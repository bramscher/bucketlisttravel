interface Props {
  vibe: string;
}

const vibeStyles: Record<string, string> = {
  Adventure: "bg-blue-100 text-blue-800",
  Culture: "bg-amber-100 text-amber-800",
  Food: "bg-pink-100 text-pink-800",
  Nature: "bg-emerald-100 text-emerald-800",
  Romance: "bg-violet-100 text-violet-800",
};

export default function VibeTag({ vibe }: Props) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${
        vibeStyles[vibe] || "bg-slate-100 text-slate-700"
      }`}
    >
      {vibe}
    </span>
  );
}
