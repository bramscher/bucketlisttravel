import type Anthropic from "@anthropic-ai/sdk";

export const chatTools: Anthropic.Tool[] = [
  {
    name: "search_destinations",
    description:
      "Search the Bucket List Travel destination database. Use this when the user asks about destinations matching specific criteria like region, vibe, budget level, or best travel months. Only call this when destinations from the system prompt aren't sufficient.",
    input_schema: {
      type: "object",
      properties: {
        region: {
          type: "string",
          description:
            "Filter by region (e.g., 'Asia Pacific', 'Europe', 'Africa')",
        },
        vibes: {
          type: "array",
          items: { type: "string" },
          description:
            "Filter by vibes. Valid values: Adventure, Culture, Food, Nature, Romance",
        },
        max_cost_level: {
          type: "number",
          description: "Maximum cost level 1-5 (1=budget, 5=luxury)",
        },
        best_month: {
          type: "string",
          description: "Month to travel (e.g., 'March')",
        },
        query: {
          type: "string",
          description:
            "Free-text search across destination name, country, or description",
        },
      },
    },
  },
  {
    name: "get_destination_details",
    description:
      "Get full details about a specific destination including highlights, daily budget, ideal stay duration, and vibes. Use when you need more detail than what's in the system prompt summary.",
    input_schema: {
      type: "object",
      properties: {
        destination_name: {
          type: "string",
          description:
            "Name of the destination (e.g., 'Kyoto, Japan' or just 'Kyoto')",
        },
      },
      required: ["destination_name"],
    },
  },
  {
    name: "get_user_context",
    description:
      "Fetch the current user's bucket list, existing trips, and profile preferences. Call this when the user references their saved destinations, past trips, or wants personalized recommendations based on their history.",
    input_schema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "save_trip",
    description:
      "Save a planned trip and its day-by-day itinerary to the user's account. IMPORTANT: Only call this when the user explicitly confirms they want to save the itinerary (e.g., 'yes save it', 'add this to my trips'). Never save without explicit confirmation.",
    input_schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Trip title, e.g. '10 Days in Kyoto'",
        },
        description: {
          type: "string",
          description: "Short description of the trip's vibe or theme",
        },
        destination_name: {
          type: "string",
          description:
            "Name of the primary destination (must match a destination in our database)",
        },
        start_date: {
          type: "string",
          description: "ISO date string YYYY-MM-DD, optional",
        },
        end_date: {
          type: "string",
          description: "ISO date string YYYY-MM-DD, optional",
        },
        total_budget: {
          type: "number",
          description: "Total trip budget in USD, optional",
        },
        days: {
          type: "array",
          description: "Day-by-day breakdown of the itinerary",
          items: {
            type: "object",
            properties: {
              day_number: { type: "number" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    time_slot: {
                      type: "string",
                      enum: ["morning", "afternoon", "evening"],
                    },
                    title: {
                      type: "string",
                      description: "Short activity title",
                    },
                    description: {
                      type: "string",
                      description: "Vivid, sensory description",
                    },
                    location: { type: "string" },
                    category: {
                      type: "string",
                      enum: [
                        "activity",
                        "food",
                        "transport",
                        "accommodation",
                        "free_time",
                      ],
                    },
                    estimated_cost: {
                      type: "number",
                      description: "Cost in USD",
                    },
                  },
                  required: ["time_slot", "title", "category"],
                },
              },
            },
            required: ["day_number", "items"],
          },
        },
      },
      required: ["title", "destination_name", "days"],
    },
  },
];
