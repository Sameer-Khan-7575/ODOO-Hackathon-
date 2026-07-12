import { Link } from "react-router-dom";
import { ArrowRight, Building2, ClipboardCheck, Users, Leaf, ShieldCheck, Settings, CheckCircle2 } from "lucide-react";
import type { DashboardData } from "./Dashboard";
import GrowthRing from "../components/GrowthRing";
import AnimatedCounter from "../components/AnimatedCounter";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-1.5 bg-ink-900/[0.06] rounded-full overflow-hidden mt-1">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }} />
    </div>
  );
}

export default function AdminDashboard({ data }: { data: DashboardData }) {
  const { currentScores: s, user, pendingApprovals, leaderboard, departmentScores = [], totalEmployees = 0, config } = data;

  return (
    <div className="space-y-6 animate-fade-in pb-4">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-900 via-orange-800 to-rose-900 px-8 py-9 border border-white/10">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, #fbbf24 0%, transparent 60%)" }} />
        <div className="relative flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-200 bg-white/10 rounded-full px-3 py-1 mb-4">
              <ShieldCheck size={12} /> Admin Control Centre
            </span>
            <h1 className="font-display text-4xl font-semibold text-white leading-tight">
              Company ESG at a <span className="text-amber-300">glance</span>.
            </h1>
            <p className="text-white/50 mt-2 text-sm">{user.departmentName} · Admin</p>
            <div className="flex flex-wrap gap-3 mt-7 justify-center lg:justify-start">
              {[
                { icon: Users, color: "text-amber-300", val: totalEmployees, label: "Total employees" },
                { icon: Building2, color: "text-orange-300", val: departmentScores.length, label: "Departments" },
                { icon: ClipboardCheck, color: "text-rose-300", val: pendingApprovals.length, label: "Pending reviews" },
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

      {/* Company ESG score cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { key: "environmentalScore" as const, label: "Environmental", color: "#A9D91C", icon: Leaf },
          { key: "socialScore" as const, label: "Social", color: "#33A8B8", icon: Users },
          { key: "governanceScore" as const, label: "Governance", color: "#DE9B26", icon: ShieldCheck },
        ].map((c) => {
          const Icon = c.icon;
          const value = s[c.key];
          return (
            <div key={c.key} className="bg-white rounded-2xl shadow-card hover:shadow-lift p-5 card-hover">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${c.color}22` }}>
                  <Icon size={16} style={{ color: c.color }} />
                </div>
                <span className="font-mono-tab text-2xl font-semibold text-ink-900"><AnimatedCounter value={Math.round(value)} /></span>
              </div>
              <p className="text-sm font-medium text-ink-700 mb-2">Company {c.label}</p>
              <ScoreBar value={value} color={c.color} />
            </div>
          );
        })}
      </div>

      {/* Department breakdown table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-900/[0.05]">
          <h2 className="font-display text-lg font-medium text-ink-900 flex items-center gap-2">
            <Building2 size={18} className="text-amber-500" /> Department Scores
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-900/[0.03] text-ink-500 text-left">
              <tr>
                <th className="px-5 py-3.5 font-medium">Department</th>
                <th className="px-5 py-3.5 font-medium">Members</th>
                <th className="px-5 py-3.5 font-medium">Environmental</th>
                <th className="px-5 py-3.5 font-medium">Social</th>
                <th className="px-5 py-3.5 font-medium">Governance</th>
                <th className="px-5 py-3.5 font-medium">Overall</th>
              </tr>
            </thead>
            <tbody>
              {departmentScores.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-ink-300">No department data yet.</td></tr>
              ) : departmentScores.map((dept) => (
                <tr key={dept.id} className="border-t border-ink-900/[0.05] hover:bg-ink-900/[0.015]">
                  <td className="px-5 py-3.5 font-medium text-ink-900">{dept.name}</td>
                  <td className="px-5 py-3.5 text-ink-500">{dept.memberCount}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-tab text-ink-700 w-8">{Math.round(dept.environmentalScore)}</span>
                      <div className="flex-1 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-lime-400" style={{ width: `${Math.min(dept.environmentalScore,100)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-tab text-ink-700 w-8">{Math.round(dept.socialScore)}</span>
                      <div className="flex-1 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-sky-400" style={{ width: `${Math.min(dept.socialScore,100)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-tab text-ink-700 w-8">{Math.round(dept.governanceScore)}</span>
                      <div className="flex-1 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-amber-400" style={{ width: `${Math.min(dept.governanceScore,100)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`font-mono-tab font-semibold text-sm ${dept.totalScore >= 70 ? "text-canopy-600" : dept.totalScore >= 40 ? "text-amber-500" : "text-red-500"}`}>
                      {Math.round(dept.totalScore)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom row: Pending + Leaderboard + Config */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pending approvals */}
        <div className="bg-white rounded-2xl shadow-card hover:shadow-lift p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-base font-medium text-ink-900 flex items-center gap-2">
              <ClipboardCheck size={16} className="text-rose-500" /> Pending
              {pendingApprovals.length > 0 && <span className="text-xs font-semibold bg-red-100 text-red-600 rounded-full px-2 py-0.5">{pendingApprovals.length}</span>}
            </h2>
            <Link to="/approvals" className="text-xs text-canopy-500 hover:text-moss-900 flex items-center gap-1">All <ArrowRight size={11} /></Link>
          </div>
          {pendingApprovals.length === 0 ? (
            <div className="text-center py-6"><CheckCircle2 size={24} className="mx-auto text-canopy-400 mb-2" /><p className="text-sm text-ink-400">All caught up!</p></div>
          ) : (
            <ul className="space-y-2">
              {pendingApprovals.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-center gap-2.5 py-1.5">
                  <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 text-[10px] font-semibold flex items-center justify-center shrink-0">{initials(p.employeeName)}</div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-ink-900 truncate">{p.employeeName}</p>
                    <p className="text-[11px] text-ink-400 truncate">{p.activityTitle}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Top leaderboard */}
        <div className="bg-white rounded-2xl shadow-card hover:shadow-lift p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-base font-medium text-ink-900">Top Employees</h2>
            <Link to="/leaderboard" className="text-xs text-canopy-500 hover:text-moss-900 flex items-center gap-1">All <ArrowRight size={11} /></Link>
          </div>
          <ul className="space-y-2">
            {leaderboard.slice(0, 5).map((row) => {
              const medal = row.rank <= 3 ? ["🥇","🥈","🥉"][row.rank - 1] : `#${row.rank}`;
              return (
                <li key={row.rank} className="flex items-center gap-2.5 py-1">
                  <span className="w-6 text-center text-sm">{medal}</span>
                  <div className="w-7 h-7 rounded-full bg-moss-900/[0.08] text-moss-800 text-[10px] font-semibold flex items-center justify-center">{initials(row.name)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-ink-900 truncate">{row.name}</p>
                    <p className="text-[11px] text-ink-400 truncate">{row.departmentName}</p>
                  </div>
                  <span className="font-mono-tab text-xs font-semibold text-ink-900">{row.points}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* System Config summary */}
        <div className="bg-white rounded-2xl shadow-card hover:shadow-lift p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings size={16} className="text-amber-500" />
            <h2 className="font-display text-base font-medium text-ink-900">System Config</h2>
          </div>
          {config ? (
            <div className="space-y-3 text-sm">
              {[
                { label: "Environmental weight", val: `${config.envWeight}%`, color: "#A9D91C" },
                { label: "Social weight", val: `${config.socialWeight}%`, color: "#33A8B8" },
                { label: "Governance weight", val: `${config.governanceWeight}%`, color: "#DE9B26" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-ink-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </span>
                  <span className="font-mono-tab font-semibold text-ink-900">{item.val}</span>
                </div>
              ))}
              <div className="border-t border-ink-900/[0.05] pt-3 space-y-2">
                {[
                  { label: "Auto emission calc", val: config.autoEmissionCalc },
                  { label: "Evidence required", val: config.evidenceRequired },
                  { label: "Badge auto-award", val: config.badgeAutoAward },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-ink-500 text-xs">{item.label}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.val ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>{item.val ? "On" : "Off"}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-300">Config not loaded.</p>
          )}
        </div>
      </div>
    </div>
  );
}
