interface GrowthRingProps {
  environmental: number;
  social: number;
  governance: number;
  overall: number;
  size?: number;
  /** "dark" for the moss-gradient hero (Login), "light" for the new pastel dashboard hero */
  variant?: "dark" | "light";
}

interface RingSpec {
  value: number;
  radius: number;
  color: string;
  label: string;
}

function Arc({
  radius,
  value,
  color,
  delay,
  trackColor,
}: {
  radius: number;
  value: number;
  color: string;
  delay: number;
  trackColor: string;
}) {
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;

  return (
    <>
      {/* track */}
      <circle cx="140" cy="140" r={radius} fill="none" stroke={trackColor} strokeWidth="12" />
      {/* value arc */}
      <circle
        cx="140"
        cy="140"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        transform="rotate(-90 140 140)"
        style={{
          animation: `drawRing 1.2s cubic-bezier(0.16,1,0.3,1) forwards`,
          animationDelay: `${delay}ms`,
          // @ts-ignore custom props consumed by keyframes via inline fallback
          "--ring-circumference": circumference,
          "--ring-offset": offset,
        }}
      >
        <animate
          attributeName="stroke-dashoffset"
          from={circumference}
          to={offset}
          dur="1.2s"
          begin={`${delay}ms`}
          fill="freeze"
          calcMode="spline"
          keySplines="0.16 1 0.3 1"
        />
      </circle>
    </>
  );
}

export default function GrowthRing({
  environmental,
  social,
  governance,
  overall,
  size = 280,
  variant = "dark",
}: GrowthRingProps) {
  const rings: RingSpec[] = [
    { value: environmental, radius: 118, color: "#7FBF2A", label: "Environmental" },
    { value: social, radius: 90, color: "#1F92A3", label: "Social" },
    { value: governance, radius: 62, color: "#C98412", label: "Governance" },
  ];
  const darkRings: RingSpec[] = [
    { value: environmental, radius: 118, color: "#C6F135", label: "Environmental" },
    { value: social, radius: 90, color: "#5FC9D6", label: "Social" },
    { value: governance, radius: 62, color: "#F2B84B", label: "Governance" },
  ];

  const isLight = variant === "light";
  const trackColor = isLight ? "rgba(22, 35, 28, 0.08)" : "rgba(250, 246, 236, 0.12)";

  return (
    <div className="relative shrink-0 animate-pop-in" style={{ width: size, height: size }}>
      <svg viewBox="0 0 280 280" width={size} height={size} className="-rotate-0">
        {(isLight ? rings : darkRings).map((r, i) => (
          <Arc key={r.label} radius={r.radius} value={r.value} color={r.color} delay={i * 180} trackColor={trackColor} />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`text-[11px] uppercase tracking-[0.2em] font-medium ${
            isLight ? "text-canopy-600" : "text-lime-300/80"
          }`}
        >
          Overall
        </span>
        <span
          className={`font-display text-5xl font-semibold tabular-nums ${
            isLight ? "text-ink-900" : "text-white"
          }`}
        >
          {Math.round(overall)}
        </span>
        <span className={`text-xs mt-0.5 ${isLight ? "text-ink-500" : "text-white/50"}`}>out of 100</span>
      </div>
    </div>
  );
}
