import { Link } from "react-router-dom";
import { ClipboardCheck, ArrowRight, Users, Zap, Target, CheckCircle2, Leaf, ShieldCheck } from "lucide-react";
import type { DashboardData } from "./Dashboard";
import GrowthRing from "../components/GrowthRing";
import AnimatedCounter from "../components/AnimatedCounter";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

const categoryMeta = [
  { key: "environmentalScore" as const, label: "Environmental", color: "#A9D91C", icon: Leaf },
  { key: "socialScore" as const, label: "Social", color: "#33A8B8", icon: Users },
  { key: "governanceScore" as const, label: "Governance", color: "#DE9B26", icon: ShieldCheck },
];

export default function ManagerDashboard({ data }: { data: DashboardData }) {
  const { currentScores: s, user, pendingApprovals, teamMembers = [], teamStats } = data;

  return (
    <div className="space-y-6 animate-fade-in pb-4">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-900 via-sky-800 to-teal-800 px-8 py-9 border border-white/10">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #38bdf8 0%, transparent 60%)" }} />
        <div className="relative flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-200 bg-white/10 rounded-full px-3 py-1 mb-4">
              <Users size={12} /> Manager View
            </span>
            <h1 className="font-display text-4xl font-semibold text-white leading-tight">
              {user.name.split(" ")[0]}, your <span className="text-sky-300">team</span> needs you.
            </h1>
            <p className="text-white/50 mt-2 text-sm">{user.departmentName} · Manager</p>
            {/* Team stat chips */}
            <div className="flex flex-wrap gap-3 mt-7 justify-center lg:justify-start">
              {teamStats && [
                { icon: Users, color: "text-sky-300", val: teamStats.totalMembers, label: "Team members" },
                { icon: Zap, color: "text-lime-300", val: teamStats.totalPoints, label: "Team points" },
                { icon: Target, color: "text-amber-300", val: teamStats.pendingCount, label: "Pending approvals" },
              ].map(({ icon: Icon, color, val, label }) => (
                <div key={label} className="flex items-center gap-2.5 bg-white/10 rounded-xl px-4 py-2.5">
                  <Icon size={16} className={color} />
                  <div className="text-left">
                    <p className="font-mono-tab text-white font-semibold leading-none"><AnimatedCounter value={val} /></p>
                    <p className="text-[10px] text-white/50 mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <GrowthRing environmental={s.environmentalScore} social={s.socialScore} governance={s.governanceScore} overall={s.overallScore} size={190} variant="dark" />
        </div>
      </div>

      {/* Department ESG scores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {categoryMeta.map((c) => {
          const value = s[c.key];
          const Icon = c.icon;
          return (
            <div key={c.key} className="bg-white rounded-2xl shadow-card hover:shadow-lift p-5 card-hover">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${c.color}22` }}>
                  <Icon size={16} style={{ color: c.color }} />
                </div>
                <span className="font-mono-tab text-2xl font-semibold text-ink-900"><AnimatedCounter value={Math.round(value)} /></span>
              </div>
              <p className="text-sm font-medium text-ink-700 mb-2">{c.label} Score</p>
              <div className="w-full h-1.5 bg-ink-900/[0.06] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(value, 100)}%`, backgroundColor: c.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Pending Approvals */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-card hover:shadow-lift p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-display text-lg font-medium text-ink-900 flex items-center gap-2">
              <ClipboardCheck size={18} className="text-sky-500" /> Pending Approvals
              {pendingApprovals.length > 0 && (
                <span className="ml-1 text-xs font-semibold bg-red-100 text-red-600 rounded-full px-2 py-0.5">{pendingApprovals.length}</span>
              )}
            </h2>
            <Link to="/approvals" className="text-xs font-medium text-canopy-500 hover:text-moss-900 flex items-center gap-1">Review all <ArrowRight size={12} /></Link>
          </div>
          {pendingApprovals.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle2 size={28} className="mx-auto text-canopy-400 mb-2" />
              <p className="text-sm text-ink-400">All caught up! Nothing pending.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {pendingApprovals.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-ink-900/[0.03] border border-ink-900/[0.04]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 text-[11px] font-semibold flex items-center justify-center">{initials(p.employeeName)}</div>
                    <div>
                      <p className="text-sm font-medium text-ink-900">{p.employeeName}</p>
                      <p className="text-xs text-ink-400 truncate max-w-[180px]">{p.activityTitle}</p>
                    </div>
                  </div>
                  <Link to="/approvals" className="text-xs font-medium text-sky-500 hover:text-sky-700 transition-colors whitespace-nowrap">Review →</Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Team Members */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-card hover:shadow-lift p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-display text-lg font-medium text-ink-900">Team Members</h2>
            <span className="text-xs text-ink-400 bg-ink-900/[0.04] rounded-full px-2.5 py-1">{teamMembers.length} total</span>
          </div>
          {teamMembers.length === 0 ? (
            <p className="text-sm text-ink-300 text-center py-8">No team members yet.</p>
          ) : (
            <ul className="space-y-2">
              {teamMembers.slice(0, 6).map((m) => (
                <li key={m.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-moss-900/[0.08] text-moss-800 text-[11px] font-semibold flex items-center justify-center">{initials(m.name)}</div>
                    <div>
                      <p className="text-sm font-medium text-ink-900">{m.name}</p>
                      <p className="text-xs text-ink-400 capitalize">{m.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono-tab text-sm font-semibold text-ink-900">{m.points} pts</p>
                    <p className="text-xs text-ink-400">{m.xp} XP</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
