interface Props {
  vibe: string;
  size?: "sm" | "md";
}

const vibeStyles: Record<string, { bg: string; text: string; dot: string }> = {
  Adventure: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
  Culture: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  Food: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-400" },
  Nature: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  Romance: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-400" },
};

const fallback = { bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400" };

export default function VibeTag({ vibe, size = "sm" }: Props) {
  const s = vibeStyles[vibe] || fallback;
  const sizing = size === "md" ? "px-3 py-1 text-xs" : "px-2.5 py-0.5 text-[11px]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${sizing} rounded-full font-semibold tracking-wide ${s.bg} ${s.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {vibe}
    </span>
  );
}
