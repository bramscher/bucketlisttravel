import type { SupabaseClient } from "@supabase/supabase-js";
import type { Destination } from "@/lib/types";

type Supa = SupabaseClient;

// ─────────────────────────────────────────────
// search_destinations
// ─────────────────────────────────────────────
export async function searchDestinations(
  supa: Supa,
  input: {
    region?: string;
    vibes?: string[];
    max_cost_level?: number;
    best_month?: string;
    query?: string;
  }
) {
  let q = supa.from("destinations").select("*");

  if (input.region) q = q.eq("region", input.region);
  if (input.max_cost_level) q = q.lte("cost_level", input.max_cost_level);
  if (input.best_month) q = q.ilike("best_months", `%${input.best_month}%`);
  if (input.vibes && input.vibes.length > 0) q = q.overlaps("vibes", input.vibes);
  if (input.query) {
    q = q.or(
      `name.ilike.%${input.query}%,country.ilike.%${input.query}%,description.ilike.%${input.query}%`
    );
  }

  const { data, error } = await q.limit(10);
  if (error) return { error: error.message };

  return {
    count: data?.length || 0,
    destinations: (data || []).map((d: Destination) => ({
      id: d.id,
      name: d.name,
      region: d.region,
      country: d.country,
      tagline: d.tagline,
      cost_level: d.cost_level,
      safety_rating: d.safety_rating,
      return_potential: d.return_potential,
      best_months: d.best_months,
      avg_daily_budget: d.avg_daily_budget,
      ideal_stay_duration: d.ideal_stay_duration,
      highlights: d.highlights,
      vibes: d.vibes,
      image_url: d.image_url,
    })),
  };
}

// ─────────────────────────────────────────────
// get_destination_details
// ─────────────────────────────────────────────
export async function getDestinationDetails(
  supa: Supa,
  input: { destination_name: string }
) {
  const { data, error } = await supa
    .from("destinations")
    .select("*")
    .ilike("name", `%${input.destination_name}%`)
    .limit(1)
    .single();

  if (error || !data) {
    return { error: `No destination found matching "${input.destination_name}"` };
  }

  return { destination: data };
}

// ─────────────────────────────────────────────
// get_user_context
// ─────────────────────────────────────────────
export async function getUserContext(supa: Supa, userId: string) {
  const [profileRes, bucketListRes, tripsRes] = await Promise.all([
    supa.from("profiles").select("*").eq("id", userId).single(),
    supa
      .from("bucket_list")
      .select("*, destination:destinations(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supa
      .from("trips")
      .select("*, destination:destinations(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return {
    profile: profileRes.data
      ? {
          name: profileRes.data.full_name,
          email: profileRes.data.email,
        }
      : null,
    bucket_list:
      bucketListRes.data?.map((b: any) => ({
        destination_name: b.destination?.name,
        region: b.destination?.region,
        status: b.status,
        notes: b.notes,
      })) || [],
    trips:
      tripsRes.data?.map((t: any) => ({
        title: t.title,
        destination_name: t.destination?.name,
        status: t.status,
        start_date: t.start_date,
        end_date: t.end_date,
        total_budget: t.total_budget,
      })) || [],
  };
}

// ─────────────────────────────────────────────
// save_trip
// ─────────────────────────────────────────────
export async function saveTrip(
  supa: Supa,
  userId: string,
  input: {
    title: string;
    description?: string;
    destination_name: string;
    start_date?: string;
    end_date?: string;
    total_budget?: number;
    days: Array<{
      day_number: number;
      items: Array<{
        time_slot: "morning" | "afternoon" | "evening";
        title: string;
        description?: string;
        location?: string;
        category:
          | "activity"
          | "food"
          | "transport"
          | "accommodation"
          | "free_time";
        estimated_cost?: number;
      }>;
    }>;
  }
) {
  // Resolve destination_id
  const { data: destMatch } = await supa
    .from("destinations")
    .select("id")
    .ilike("name", `%${input.destination_name}%`)
    .limit(1)
    .single();

  const destinationId = destMatch?.id || null;

  // Create trip
  const { data: trip, error: tripError } = await supa
    .from("trips")
    .insert({
      user_id: userId,
      destination_id: destinationId,
      title: input.title,
      description: input.description || null,
      start_date: input.start_date || null,
      end_date: input.end_date || null,
      total_budget: input.total_budget || null,
      status: "planning",
    })
    .select()
    .single();

  if (tripError || !trip) {
    return { error: `Failed to create trip: ${tripError?.message}` };
  }

  // Flatten days into itinerary_items
  const items = input.days.flatMap((day, dayIdx) =>
    day.items.map((item, itemIdx) => ({
      trip_id: trip.id,
      day_number: day.day_number || dayIdx + 1,
      time_slot: item.time_slot,
      title: item.title,
      description: item.description || null,
      location: item.location || null,
      category: item.category,
      estimated_cost: item.estimated_cost || null,
      sort_order: itemIdx,
    }))
  );

  if (items.length > 0) {
    const { error: itemsError } = await supa
      .from("itinerary_items")
      .insert(items);
    if (itemsError) {
      return {
        warning: `Trip created but itinerary items failed: ${itemsError.message}`,
        trip_id: trip.id,
      };
    }
  }

  return {
    success: true,
    trip_id: trip.id,
    title: trip.title,
    item_count: items.length,
    url: `/dashboard`,
  };
}

// ─────────────────────────────────────────────
// Dispatcher
// ─────────────────────────────────────────────
export async function executeTool(
  supa: Supa,
  userId: string,
  toolName: string,
  input: any
): Promise<any> {
  try {
    switch (toolName) {
      case "search_destinations":
        return await searchDestinations(supa, input);
      case "get_destination_details":
        return await getDestinationDetails(supa, input);
      case "get_user_context":
        return await getUserContext(supa, userId);
      case "save_trip":
        return await saveTrip(supa, userId, input);
      default:
        return { error: `Unknown tool: ${toolName}` };
    }
  } catch (e: any) {
    return { error: e?.message || "Tool execution failed" };
  }
}
