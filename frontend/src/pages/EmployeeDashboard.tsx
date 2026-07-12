import { Link } from "react-router-dom";
import { Sparkles, Zap, Target, Trophy, ArrowRight, Leaf, Users, ShieldCheck } from "lucide-react";
import type { DashboardData } from "./Dashboard";
import GrowthRing from "../components/GrowthRing";
import HeroIllustration from "../components/HeroIllustration";
import AnimatedCounter from "../components/AnimatedCounter";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

const categoryMeta = [
  { key: "environmentalScore" as const, label: "Environmental", color: "#A9D91C", from: "#DDF17B", to: "#A9D91C", icon: Leaf },
  { key: "socialScore" as const, label: "Social", color: "#33A8B8", from: "#8FE0EA", to: "#33A8B8", icon: Users },
  { key: "governanceScore" as const, label: "Governance", color: "#DE9B26", from: "#F6CD7C", to: "#DE9B26", icon: ShieldCheck },
];

const statusStyle: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-600",
  Approved: "bg-green-100 text-green-600",
  Rejected: "bg-red-100 text-red-600",
};

export default function EmployeeDashboard({ data }: { data: DashboardData }) {
  const { currentScores: s, user, leaderboard, unlockedBadges, recentActivities } = data;
  const myRank = leaderboard.find((l) => l.name === user.name)?.rank;

  return (
    <div className="space-y-6 animate-fade-in pb-4">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-meadow-gradient px-8 py-9 border border-ink-900/[0.04]">
        <HeroIllustration />
        <div className="relative flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 min-w-0 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-canopy-600 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1 mb-4 shadow-soft">
              <Sparkles size={12} /> {greeting()}
            </span>
            <h1 className="font-display text-4xl sm:text-[2.75rem] leading-tight font-semibold text-ink-900">
              {user.name.split(" ")[0]}, your impact<br className="hidden sm:block" /> is <span className="text-gradient-canopy">growing</span>.
            </h1>
            <p className="text-ink-500 mt-3 text-sm">
              {user.departmentName} · Employee{myRank && <> · currently <span className="text-canopy-600 font-medium">#{myRank}</span> company-wide</>}
            </p>
            <div className="flex flex-wrap gap-3 mt-7 justify-center lg:justify-start">
              {[
                { icon: Zap, color: "text-canopy-500", val: s.totalPoints, label: "Points" },
                { icon: Target, color: "text-sky-500", val: s.totalXP, label: "XP earned" },
                { icon: Trophy, color: "text-amber-500", val: unlockedBadges.length, label: "Badges" },
              ].map(({ icon: Icon, color, val, label }) => (
                <div key={label} className="flex items-center gap-2.5 bg-white/75 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-soft card-hover">
                  <Icon size={16} className={color} />
                  <div className="text-left">
                    <p className="font-mono-tab text-ink-900 font-semibold leading-none"><AnimatedCounter value={val} /></p>
                    <p className="text-[10px] text-ink-500 mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <GrowthRing environmental={s.environmentalScore} social={s.socialScore} governance={s.governanceScore} overall={s.overallScore} size={200} variant="light" />
        </div>
      </div>

      {/* ESG Score cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {categoryMeta.map((c, i) => {
          const value = s[c.key];
          const Icon = c.icon;
          return (
            <div key={c.key} className="bg-white rounded-2xl shadow-card hover:shadow-lift p-5 card-hover" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg,${c.from}55,${c.to}33)` }}>
                  <Icon size={16} style={{ color: c.color }} />
                </div>
                <span className="font-mono-tab text-2xl font-semibold text-ink-900"><AnimatedCounter value={Math.round(value)} /></span>
              </div>
              <p className="text-sm font-medium text-ink-700 mb-2">{c.label}</p>
              <div className="w-full h-1.5 bg-ink-900/[0.06] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(value, 100)}%`, backgroundColor: c.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Leaderboard + Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-card hover:shadow-lift p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-display text-lg font-medium text-ink-900">Leaderboard</h2>
            <Link to="/leaderboard" className="text-xs font-medium text-canopy-500 hover:text-moss-900 flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          <ul className="space-y-1">
            {leaderboard.slice(0, 5).map((row) => {
              const isYou = row.name === user.name;
              const medal = row.rank <= 3 ? ["🥇","🥈","🥉"][row.rank - 1] : null;
              return (
                <li key={row.rank} className={`flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-ink-900/[0.03] ${isYou ? "bg-canopy-500/[0.06]" : ""}`}>
                  <span className="w-6 text-center text-sm font-mono-tab text-ink-500">{medal || `#${row.rank}`}</span>
                  <div className="w-8 h-8 rounded-full bg-moss-900/[0.08] text-moss-800 text-[11px] font-semibold flex items-center justify-center">{initials(row.name)}</div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm truncate ${isYou ? "font-semibold text-ink-900" : "text-ink-700"}`}>{row.name} {isYou && <span className="text-canopy-500">(you)</span>}</p>
                    <p className="text-xs text-ink-300 truncate">{row.departmentName}</p>
                  </div>
                  <span className="font-mono-tab text-sm font-medium text-ink-900">{row.points}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-card hover:shadow-lift p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-display text-lg font-medium text-ink-900">Your Badges</h2>
            <Link to="/badges" className="text-xs font-medium text-canopy-500 hover:text-moss-900 flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          {unlockedBadges.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-4xl mb-2 inline-block animate-float">🌱</p>
              <p className="text-sm text-ink-500">No badges yet.</p>
              <Link to="/activities" className="text-xs text-canopy-500 font-medium hover:underline">Get participating →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {unlockedBadges.map((b, i) => (
                <div key={b.name} title={b.description} className="flex flex-col items-center text-center gap-1.5 rounded-xl bg-amber-400/[0.08] py-3 px-1 card-hover hover:bg-amber-400/[0.16]" style={{ animationDelay: `${i * 70}ms` }}>
                  <span className="text-2xl">{b.icon}</span>
                  <span className="text-[11px] font-medium text-ink-700 leading-tight">{b.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivities.length > 0 && (
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-display text-lg font-medium text-ink-900">Recent Activity</h2>
            <Link to="/history" className="text-xs font-medium text-canopy-500 hover:text-moss-900 flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          <ul className="space-y-2">
            {recentActivities.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-2 border-b last:border-0 border-ink-900/[0.05]">
                <span className="text-sm text-ink-700">{a.activityTitle}</span>
                <div className="flex items-center gap-3">
                  {a.pointsEarned != null && <span className="text-xs font-mono-tab text-canopy-600">+{a.pointsEarned} pts</span>}
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusStyle[a.status] || "bg-ink-100 text-ink-500"}`}>{a.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
