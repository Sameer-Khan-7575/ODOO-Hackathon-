import { useEffect, useState } from "react";
import client from "../api/client";
import AnimatedCounter from "../components/AnimatedCounter";
import FloatingOrbs from "../components/FloatingOrbs";

interface Row {
  rank: number;
  userId: number;
  name: string;
  points: number;
  overallScore: number;
  departmentName: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const podiumStyle = [
  { order: "sm:order-2", height: "h-28", ring: "ring-lime-400", medal: "🥇", top: "sm:-mt-6" },
  { order: "sm:order-1", height: "h-20", ring: "ring-ink-300", medal: "🥈", top: "" },
  { order: "sm:order-3", height: "h-14", ring: "ring-amber-400", medal: "🥉", top: "" },
];

export default function Leaderboard() {
  const [rows, setRows] = useState<Row[]>([]);
  const [yourRank, setYourRank] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    client
      .get("/scores/leaderboard")
      .then((res) => {
        setRows(res.data.data || []);
        setYourRank(res.data.yourRank ?? null);
      })
      .catch(() => setError("Failed to load leaderboard"));
  }, []);

  if (error) return <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3">{error}</div>;

  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between -mt-2">
        <p className="text-ink-500 text-sm">Top ESG contributors across the company.</p>
        {yourRank !== null && (
          <div className="text-right">
            <p className="text-xs text-ink-500">Your rank</p>
            <p className="font-display text-2xl font-semibold text-canopy-500">#{yourRank}</p>
          </div>
        )}
      </div>

      {/* Podium */}
      {top3.length === 3 && (
        <div className="bg-moss-gradient rounded-3xl relative overflow-hidden px-6 sm:px-12 pt-10 pb-6">
          <div className="absolute inset-0 bg-grain pointer-events-none" />
          <FloatingOrbs variant="dark" />
          <div className="relative flex flex-col sm:flex-row items-center sm:items-end justify-center gap-6 sm:gap-4">
            {[top3[1], top3[0], top3[2]].map((r, idx) => {
              const style = podiumStyle[idx];
              return (
                <div key={r.userId} className={`flex flex-col items-center ${style.order} ${style.top} animate-pop-in`} style={{ animationDelay: `${idx * 120}ms` }}>
                  <span className="text-3xl mb-1">{style.medal}</span>
                  <div className={`w-14 h-14 rounded-full bg-white/10 ${style.ring} ring-2 text-white font-semibold flex items-center justify-center font-mono-tab mb-2 ${idx === 1 ? "shadow-glow" : ""}`}>
                    {initials(r.name)}
                  </div>
                  <p className="text-white font-medium text-sm text-center">{r.name}</p>
                  <p className="text-white/40 text-xs mb-3">{r.departmentName}</p>
                  <div className={`w-24 sm:w-28 ${style.height} rounded-t-xl bg-white/[0.08] flex items-start justify-center pt-2`}>
                    <span className="font-mono-tab text-lime-300 font-semibold text-sm">
                      <AnimatedCounter value={r.points} /> pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-900/[0.03] text-ink-500 text-left">
            <tr>
              <th className="px-5 py-3.5 font-medium">Rank</th>
              <th className="px-5 py-3.5 font-medium">Name</th>
              <th className="px-5 py-3.5 font-medium">Department</th>
              <th className="px-5 py-3.5 font-medium">Overall Score</th>
              <th className="px-5 py-3.5 font-medium">Points</th>
            </tr>
          </thead>
          <tbody>
            {(top3.length === 3 ? rest : rows).map((r) => (
              <tr key={r.userId} className="border-t border-ink-900/[0.05] hover:bg-ink-900/[0.015] transition-colors">
                <td className="px-5 py-3.5 font-mono-tab text-ink-500">#{r.rank}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-moss-900/[0.08] text-moss-800 text-[10px] font-semibold flex items-center justify-center font-mono-tab">
                      {initials(r.name)}
                    </div>
                    <span className="font-medium text-ink-900">{r.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-ink-500">{r.departmentName}</td>
                <td className="px-5 py-3.5 font-mono-tab text-ink-700">{r.overallScore}</td>
                <td className="px-5 py-3.5 font-mono-tab font-medium text-ink-900">{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
