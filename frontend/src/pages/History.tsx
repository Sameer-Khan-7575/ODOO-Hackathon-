import { useEffect, useState } from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import client from "../api/client";

interface HistoryItem {
  id: number;
  activityTitle: string;
  categoryName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  pointsEarned: number | null;
  approverName: string | null;
  approvedAt: string | null;
}

const statusMeta: Record<string, { style: string; icon: any }> = {
  PENDING: { style: "bg-amber-400/15 text-amber-500", icon: Clock },
  APPROVED: { style: "bg-canopy-500/15 text-canopy-500", icon: CheckCircle2 },
  REJECTED: { style: "bg-red-100 text-red-600", icon: XCircle },
};

export default function History() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    client
      .get("/csr/history")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];
        setItems(list);
      })
      .catch(() => setError("Failed to load history"));
  }, []);

  if (error) return <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3">{error}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-ink-500 text-sm -mt-2">Everything you've submitted, and how it went.</p>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-900/[0.03] text-ink-500 text-left">
            <tr>
              <th className="px-5 py-3.5 font-medium">Activity</th>
              <th className="px-5 py-3.5 font-medium">Category</th>
              <th className="px-5 py-3.5 font-medium">Status</th>
              <th className="px-5 py-3.5 font-medium">Points</th>
              <th className="px-5 py-3.5 font-medium">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const meta = statusMeta[item.status];
              const Icon = meta.icon;
              return (
                <tr key={item.id} className="border-t border-ink-900/[0.05] hover:bg-ink-900/[0.015] transition-colors">
                  <td className="px-5 py-3.5 font-medium text-ink-900">{item.activityTitle}</td>
                  <td className="px-5 py-3.5 text-ink-500">{item.categoryName}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${meta.style}`}>
                      <Icon size={12} /> {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono-tab text-ink-900">{item.pointsEarned ?? "—"}</td>
                  <td className="px-5 py-3.5 text-ink-300">
                    {new Date(item.submittedAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-14 text-center text-ink-300">
                  No submissions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
