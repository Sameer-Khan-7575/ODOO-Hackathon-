import { useEffect, useState } from "react";
import { Image as ImageIcon, FileText, X, Check, Loader2 } from "lucide-react";
import client from "../api/client";

interface Activity {
  id: number;
  title: string;
  description: string;
  pointsReward: number;
  xpReward: number;
  proofType: "IMAGE" | "TEXT" | "IMAGE_AND_TEXT";
  category: { name: string; color: string };
}

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState("");
  const [modalActivity, setModalActivity] = useState<Activity | null>(null);
  const [proofText, setProofText] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const load = () => {
    client
      .get("/csr/activities")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];
        setActivities(list);
      })
      .catch(() => setError("Failed to load activities"));
  };

  useEffect(() => {
    load();
  }, []);

  const openModal = (a: Activity) => {
    setModalActivity(a);
    setProofText("");
    setProofUrl("");
    setMessage("");
  };

  const submitParticipation = async () => {
    if (!modalActivity) return;
    setSubmitting(true);
    setMessage("");

    let proof: any = {};
    if (modalActivity.proofType === "IMAGE") proof = { type: "IMAGE", url: proofUrl };
    else if (modalActivity.proofType === "TEXT") proof = { type: "TEXT", text: proofText };
    else proof = { type: "IMAGE_AND_TEXT", url: proofUrl, text: proofText };

    try {
      await client.post("/csr/participate", { activityId: modalActivity.id, proof });
      setMessage("Submitted! Awaiting manager approval.");
      setTimeout(() => setModalActivity(null), 1200);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (error) return <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3">{error}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-ink-500 text-sm -mt-2">Participate to earn points, XP, and badges.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((a, i) => (
          <div
            key={a.id}
            className="group bg-white rounded-2xl shadow-card hover:shadow-lift p-5 flex flex-col justify-between transition-shadow animate-slide-up card-hover"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div>
              <span
                className="inline-block text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full text-white mb-3"
                style={{ backgroundColor: a.category.color }}
              >
                {a.category.name}
              </span>
              <h3 className="font-display text-lg font-medium text-ink-900 leading-snug">{a.title}</h3>
              <p className="text-sm text-ink-500 mt-1.5 leading-relaxed">{a.description}</p>
            </div>
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-ink-900/[0.05]">
              <span className="text-xs font-mono-tab text-ink-700">
                +{a.pointsReward} pts · +{a.xpReward} XP
              </span>
              <button
                onClick={() => openModal(a)}
                className="bg-moss-900 group-hover:bg-canopy-500 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
              >
                Participate
              </button>
            </div>
          </div>
        ))}
        {activities.length === 0 && !error && (
          <div className="col-span-full text-center py-16 text-ink-300 text-sm">Loading activities…</div>
        )}
      </div>

      {modalActivity && (
        <div className="fixed inset-0 bg-ink-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-lift p-6 w-full max-w-md animate-fade-in relative">
            <button
              onClick={() => setModalActivity(null)}
              className="absolute top-4 right-4 text-ink-300 hover:text-ink-900 transition-colors"
            >
              <X size={18} />
            </button>
            <h2 className="font-display text-xl font-medium text-ink-900 mb-1 pr-6">{modalActivity.title}</h2>
            <p className="text-sm text-ink-500 mb-5">Submit proof of participation.</p>

            {(modalActivity.proofType === "IMAGE" || modalActivity.proofType === "IMAGE_AND_TEXT") && (
              <div className="mb-3">
                <label className="flex items-center gap-1.5 text-sm font-medium text-ink-700 mb-1.5">
                  <ImageIcon size={14} /> Photo URL
                </label>
                <input
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-ink-900/10 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-canopy-500"
                />
              </div>
            )}

            {(modalActivity.proofType === "TEXT" || modalActivity.proofType === "IMAGE_AND_TEXT") && (
              <div className="mb-3">
                <label className="flex items-center gap-1.5 text-sm font-medium text-ink-700 mb-1.5">
                  <FileText size={14} /> Description
                </label>
                <textarea
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-ink-900/10 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-canopy-500"
                />
              </div>
            )}

            {message && (
              <p className="text-sm text-canopy-500 mb-3 flex items-center gap-1.5">
                <Check size={14} /> {message}
              </p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setModalActivity(null)}
                className="px-4 py-2 text-sm rounded-lg text-ink-500 hover:bg-ink-900/5"
              >
                Cancel
              </button>
              <button
                onClick={submitParticipation}
                disabled={submitting}
                className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-moss-900 text-white hover:bg-canopy-500 disabled:opacity-60 transition-colors"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                {submitting ? "Submitting…" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
