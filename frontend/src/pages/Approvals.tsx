import { useEffect, useState } from "react";
import { PartyPopper, X, Check } from "lucide-react";
import client from "../api/client";
import Confetti from "../components/Confetti";

interface PendingItem {
  id: number;
  employeeName: string;
  employeeEmail: string;
  activityTitle: string;
  categoryName: string;
  proof: { type: string; url?: string; text?: string };
  submittedAt: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Approvals() {
  const [items, setItems] = useState<PendingItem[]>([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [celebrate, setCelebrate] = useState(0);

  const load = () => {
    client
      .get("/csr/pending-approvals")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];
        setItems(list);
      })
      .catch(() => setError("Failed to load pending approvals"));
  };

  useEffect(() => {
    load();
  }, []);

  const decide = async (participationId: number, approved: boolean) => {
    setBusyId(participationId);
    try {
      await client.post("/csr/approve", { participationId, approved, feedback: approved ? "Approved" : "Not sufficient" });
      setItems((prev) => prev.filter((i) => i.id !== participationId));
      if (approved) setCelebrate((c) => c + 1);
    } catch {
      setError("Failed to submit decision");
    } finally {
      setBusyId(null);
    }
  };

  if (error) return <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3">{error}</div>;

  return (
    <div className="space-y-6 animate-fade-in relative">
      {celebrate > 0 && <Confetti fireKey={celebrate} pieces={16} />}
      <p className="text-ink-500 text-sm -mt-2">Review employee submissions and award points.</p>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-card hover:shadow-lift transition-shadow p-5 animate-slide-up card-hover"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-moss-900/[0.08] text-moss-800 text-xs font-semibold flex items-center justify-center font-mono-tab shrink-0">
                  {initials(item.employeeName)}
                </div>
                <div>
                  <h3 className="font-display font-medium text-ink-900">{item.activityTitle}</h3>
                  <p className="text-sm text-ink-500">
                    {item.employeeName} ({item.employeeEmail}) ·{" "}
                    <span className="text-ink-700">{item.categoryName}</span>
                  </p>
                  <p className="text-xs text-ink-300 mt-1">
                    Submitted {new Date(item.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => decide(item.id, false)}
                  disabled={busyId === item.id}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  <X size={14} /> Reject
                </button>
                <button
                  onClick={() => decide(item.id, true)}
                  disabled={busyId === item.id}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-moss-900 text-white hover:bg-canopy-500 disabled:opacity-50 transition-colors"
                >
                  <Check size={14} /> Approve
                </button>
              </div>
            </div>

            {item.proof?.text && (
              <p className="text-sm text-ink-700 mt-3 bg-ink-900/[0.03] rounded-xl p-3.5 leading-relaxed">
                {item.proof.text}
              </p>
            )}
            {item.proof?.url && (
              <img
                src={item.proof.url}
                alt="proof"
                className="mt-3 rounded-xl max-h-48 object-cover"
              />
            )}
          </div>
        ))}

        {items.length === 0 && (
          <div className="bg-white rounded-2xl shadow-card p-14 text-center">
            <PartyPopper size={28} className="mx-auto text-canopy-500 mb-2 animate-float" />
            <p className="text-ink-500">Nothing pending. You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
