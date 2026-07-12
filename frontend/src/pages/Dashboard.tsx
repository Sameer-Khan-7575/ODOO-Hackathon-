import { useEffect, useState } from "react";
import client from "../api/client";
import EmployeeDashboard from "./EmployeeDashboard";
import ManagerDashboard from "./ManagerDashboard";
import AdminDashboard from "./AdminDashboard";

export interface DashboardData {
  user: { name: string; role: string; departmentName: string };
  currentScores: {
    totalPoints: number; totalXP: number;
    environmentalScore: number; socialScore: number;
    governanceScore: number; overallScore: number;
  };
  leaderboard: { rank: number; userId: number; name: string; points: number; xp: number; departmentName: string }[];
  pendingApprovals: { id: number; activityTitle: string; employeeName: string; employeeEmail: string; submittedAt: string }[];
  recentActivities: { id: number; activityTitle: string; pointsEarned: number | null; status: string }[];
  unlockedBadges: { name: string; icon: string; description: string }[];
  // Manager-only
  teamMembers?: { id: number; name: string; email: string; role: string; points: number; xp: number }[];
  teamStats?: { totalMembers: number; totalPoints: number; totalXP: number; pendingCount: number };
  // Admin-only
  departmentScores?: { id: number; name: string; status: string; memberCount: number; environmentalScore: number; socialScore: number; governanceScore: number; totalScore: number }[];
  totalEmployees?: number;
  config?: { envWeight: number; socialWeight: number; governanceWeight: number; autoEmissionCalc: boolean; evidenceRequired: boolean; badgeAutoAward: boolean };
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    client.get("/scores/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load dashboard"));
  }, []);

  if (error)
    return <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3">{error}</div>;
  if (!data)
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-48 bg-ink-900/5 rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-28 bg-ink-900/5 rounded-2xl" />
          <div className="h-28 bg-ink-900/5 rounded-2xl" />
          <div className="h-28 bg-ink-900/5 rounded-2xl" />
        </div>
      </div>
    );

  const role = data.user.role?.toUpperCase();
  if (role === "ADMIN") return <AdminDashboard data={data} />;
  if (role === "MANAGER") return <ManagerDashboard data={data} />;
  return <EmployeeDashboard data={data} />;
}
