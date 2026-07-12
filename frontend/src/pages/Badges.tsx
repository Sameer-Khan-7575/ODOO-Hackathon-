import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import client from "../api/client";
import AnimatedCounter from "../components/AnimatedCounter";

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  requirement: { type: string; value: number };
  isUnlocked: boolean;
  unlockedAt: string | null;
}

export default function Badges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    client
      .get("/badges")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];
        setBadges(list);
      })
      .catch(() => setError("Failed to load badges"));
  }, []);

  if (error) return <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3">{error}</div>;

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between -mt-2">
        <p className="text-ink-500 text-sm">Milestones you can unlock along the way.</p>
        {badges.length > 0 && (
          <span className="text-xs font-mono-tab text-ink-500 bg-ink-900/[0.04] rounded-full px-3 py-1">
            <AnimatedCounter value={unlockedCount} />/{badges.length} unlocked
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((b, i) => (
          <div
            key={b.id}
            className={`relative rounded-2xl p-5 flex items-center gap-4 transition-all animate-pop-in card-hover ${
              b.isUnlocked
                ? "bg-white shadow-card hover:shadow-lift"
                : "bg-ink-900/[0.025] border border-dashed border-ink-900/10 hover:border-ink-900/20"
            }`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className={`text-4xl ${!b.isUnlocked && "grayscale opacity-40"} ${b.isUnlocked && "animate-float"}`} style={b.isUnlocked ? { animationDuration: "4s" } : undefined}>
              {b.icon}
            </span>
            <div className="min-w-0">
              <h3 className={`font-display font-medium ${b.isUnlocked ? "text-ink-900" : "text-ink-500"}`}>
                {b.name}
              </h3>
              <p className="text-sm text-ink-500 leading-snug">{b.description}</p>
              <p className="text-xs mt-1.5 flex items-center gap-1">
                {b.isUnlocked ? (
                  <span className="text-canopy-500 font-medium">Unlocked</span>
                ) : (
                  <span className="text-ink-300 flex items-center gap-1">
                    <Lock size={10} /> Needs {b.requirement.value} {b.requirement.type.toLowerCase().replace("_", " ")}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
