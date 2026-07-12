import { useMemo } from "react";

interface ConfettiProps {
  /** Bump this to any changing number/id to re-trigger the burst */
  fireKey: number | string;
  pieces?: number;
}

const COLORS = ["#C6F135", "#4ADE80", "#5FC9D6", "#F2B84B", "#DDF17B"];

/**
 * A small CSS-only confetti burst, positioned by the parent (which should be
 * `relative`). Re-mounts (via `key={fireKey}`) each time fireKey changes,
 * which restarts the fall animation — no external libs needed.
 */
export default function Confetti({ fireKey, pieces = 24 }: ConfettiProps) {
  const bits = useMemo(
    () =>
      Array.from({ length: pieces }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
        duration: 1 + Math.random() * 0.6,
        color: COLORS[i % COLORS.length],
        size: 5 + Math.random() * 5,
        rotate: Math.random() * 360,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fireKey, pieces]
  );

  return (
    <div key={fireKey} className="absolute inset-0 overflow-hidden pointer-events-none z-20" aria-hidden="true">
      {bits.map((b) => (
        <span
          key={b.id}
          className="absolute top-0 animate-confetti-fall"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size * 0.4,
            backgroundColor: b.color,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            transform: `rotate(${b.rotate}deg)`,
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
}
