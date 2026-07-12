/**
 * Decorative flat-illustration landscape used behind the dashboard hero text.
 * Pure SVG + CSS animation, no images/fonts to load. Kept low-contrast so
 * the headline text stays readable on top of it.
 */
export default function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 320"
      className={`absolute inset-0 w-full h-full ${className}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      {/* sun */}
      <circle cx="790" cy="70" r="38" fill="#F6CD7C" opacity="0.55" className="animate-glow-pulse" style={{ transformOrigin: "790px 70px" }} />
      <circle cx="790" cy="70" r="24" fill="#F2B84B" opacity="0.75" />

      {/* birds */}
      <g stroke="#3A4A40" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.35">
        <g className="animate-float" style={{ animationDuration: "6s" }}>
          <path d="M560 60 q8 -10 16 0 q8 -10 16 0" />
        </g>
        <g className="animate-float" style={{ animationDuration: "7.5s", animationDelay: "0.6s" }}>
          <path d="M610 90 q6 -8 12 0 q6 -8 12 0" />
        </g>
        <g className="animate-float" style={{ animationDuration: "5.5s", animationDelay: "1.2s" }}>
          <path d="M500 40 q6 -8 12 0 q6 -8 12 0" />
        </g>
      </g>

      {/* distant city skyline */}
      <g fill="#6B8F7C" opacity="0.22">
        <rect x="650" y="150" width="18" height="70" rx="2" />
        <rect x="674" y="120" width="22" height="100" rx="2" />
        <rect x="702" y="165" width="16" height="55" rx="2" />
        <rect x="724" y="135" width="20" height="85" rx="2" />
        <rect x="750" y="155" width="16" height="65" rx="2" />
      </g>

      {/* back hill */}
      <path d="M0 220 Q150 160 320 210 T650 200 T900 215 L900 320 L0 320 Z" fill="#CFE8B0" opacity="0.55" />

      {/* wind turbines (blades spin) */}
      <g opacity="0.6">
        <line x1="530" y1="120" x2="530" y2="215" stroke="#8FAE95" strokeWidth="4" />
        <g style={{ transformOrigin: "530px 120px" }} className="animate-spin-slow">
          <path d="M530 120 L530 78" stroke="#5E7D68" strokeWidth="4" strokeLinecap="round" />
          <path d="M530 120 L562 138" stroke="#5E7D68" strokeWidth="4" strokeLinecap="round" />
          <path d="M530 120 L498 138" stroke="#5E7D68" strokeWidth="4" strokeLinecap="round" />
        </g>
        <circle cx="530" cy="120" r="4" fill="#3A4A40" />
      </g>
      <g opacity="0.5">
        <line x1="590" y1="145" x2="590" y2="218" stroke="#8FAE95" strokeWidth="3.5" />
        <g style={{ transformOrigin: "590px 145px" }} className="animate-spin-slow">
          <path d="M590 145 L590 110" stroke="#5E7D68" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M590 145 L617 160" stroke="#5E7D68" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M590 145 L563 160" stroke="#5E7D68" strokeWidth="3.5" strokeLinecap="round" />
        </g>
        <circle cx="590" cy="145" r="3.5" fill="#3A4A40" />
      </g>

      {/* front hill */}
      <path d="M0 250 Q200 200 420 245 T900 240 L900 320 L0 320 Z" fill="#9FCB7C" opacity="0.7" />

      {/* trees, scattered along the front hill */}
      {[
        { x: 60, s: 1 },
        { x: 120, s: 0.8 },
        { x: 760, s: 1.1 },
        { x: 820, s: 0.85 },
        { x: 690, s: 0.7 },
        { x: 380, s: 0.9 },
        { x: 440, s: 0.65 },
      ].map((t, i) => (
        <g key={i} transform={`translate(${t.x} 250) scale(${t.s})`} opacity="0.75">
          <rect x="-2.5" y="14" width="5" height="16" fill="#6B5638" />
          <circle cx="0" cy="6" r="16" fill="#3F7D4E" />
          <circle cx="-9" cy="12" r="11" fill="#4A8F5A" />
          <circle cx="9" cy="12" r="11" fill="#4A8F5A" />
        </g>
      ))}
    </svg>
  );
}
