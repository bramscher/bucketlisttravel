interface Props {
  level: number;
}

const labels: Record<number, string> = {
  1: "Budget-Friendly",
  2: "Affordable",
  3: "Moderate",
  4: "Premium",
  5: "Luxury",
};

const colorClasses: Record<number, string> = {
  1: "text-emerald-600",
  2: "text-emerald-600",
  3: "text-amber-600",
  4: "text-orange-600",
  5: "text-red-500",
};

export default function CostLabel({ level }: Props) {
  return (
    <span className={`text-xs font-semibold ${colorClasses[level] || "text-slate-500"}`}>
      {"$".repeat(level)} · {labels[level] || "Unknown"}
    </span>
  );
}
