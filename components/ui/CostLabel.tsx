interface Props {
  level: number;
}

const labels: Record<number, string> = {
  1: "Budget",
  2: "Affordable",
  3: "Moderate",
  4: "Premium",
  5: "Luxury",
};

const colorClasses: Record<number, { text: string; dot: string }> = {
  1: { text: "text-emerald-600", dot: "bg-emerald-400" },
  2: { text: "text-emerald-600", dot: "bg-emerald-400" },
  3: { text: "text-amber-600", dot: "bg-amber-400" },
  4: { text: "text-orange-600", dot: "bg-orange-400" },
  5: { text: "text-rose-600", dot: "bg-rose-400" },
};

export default function CostLabel({ level }: Props) {
  const c = colorClasses[level] || { text: "text-slate-500", dot: "bg-slate-300" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {"$".repeat(level)} {labels[level]}
    </span>
  );
}
