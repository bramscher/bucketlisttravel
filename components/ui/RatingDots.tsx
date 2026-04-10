interface Props {
  value: number;
  max?: number;
  color?: "sky" | "emerald" | "orange" | "pink";
}

const colorMap = {
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
};

export default function RatingDots({ value, max = 5, color = "sky" }: Props) {
  return (
    <div className="flex gap-1" role="img" aria-label={`${value} out of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
            i < value ? colorMap[color] : "bg-slate-200"
          }`}
        />
      ))}
    </div>
  );
}
