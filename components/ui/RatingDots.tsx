interface Props {
  value: number;
  max?: number;
  color?: "sky" | "emerald" | "orange" | "pink";
}

const colorMap = {
  sky: { active: "bg-sky-400", inactive: "bg-sky-100" },
  emerald: { active: "bg-emerald-400", inactive: "bg-emerald-100" },
  orange: { active: "bg-orange-400", inactive: "bg-orange-100" },
  pink: { active: "bg-pink-400", inactive: "bg-pink-100" },
};

export default function RatingDots({ value, max = 5, color = "sky" }: Props) {
  const colors = colorMap[color];
  return (
    <div className="flex gap-1" role="img" aria-label={`${value} out of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i < value ? colors.active : colors.inactive
          }`}
        />
      ))}
    </div>
  );
}
