import { useEffect, useState } from "react";
import { Gift, PartyPopper } from "lucide-react";
import client from "../api/client";
import Confetti from "../components/Confetti";
import AnimatedCounter from "../components/AnimatedCounter";

interface Reward {
  id: number;
  name: string;
  description: string;
  pointsRequired: number;
  inventory: number;
  icon: string;
  canRedeem: boolean;
}

export default function Rewards() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [redeemingId, setRedeemingId] = useState<number | null>(null);
  const [celebrate, setCelebrate] = useState(0);

  const load = () => {
    client
      .get("/rewards")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];
        setRewards(list);
        setUserPoints(res.data.userPoints ?? 0);
      })
      .catch(() => setError("Failed to load rewards"));
  };

  useEffect(() => {
    load();
  }, []);

  const redeem = async (rewardId: number) => {
    setRedeemingId(rewardId);
    setMessage("");
    try {
      const { data } = await client.post("/rewards/redeem", { rewardId });
      setMessage(`Redeemed "${data.rewardName}"! Claim code: ${data.claimCode}`);
      setCelebrate((c) => c + 1);
      load();
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Failed to redeem");
    } finally {
      setRedeemingId(null);
    }
  };

  if (error) return <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3">{error}</div>;

  return (
    <div className="space-y-6 animate-fade-in relative">
      {celebrate > 0 && <Confetti fireKey={celebrate} />}
      <div className="flex items-center justify-between -mt-2">
        <p className="text-ink-500 text-sm">Redeem your points for real perks.</p>
        <div className="flex items-center gap-2 bg-moss-gradient rounded-xl px-4 py-2 shadow-soft">
          <Gift size={14} className="text-lime-300" />
          <span className="font-mono-tab text-white font-semibold text-sm">
            <AnimatedCounter value={userPoints} /> pts
          </span>
        </div>
      </div>

      {message && (
        <div className="rounded-xl bg-canopy-500/10 border border-canopy-500/25 text-moss-900 text-sm px-4 py-3 flex items-center gap-2 animate-pop-in">
          <PartyPopper size={16} className="text-canopy-500 shrink-0" /> {message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((r, i) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl shadow-card hover:shadow-lift p-5 flex flex-col justify-between transition-shadow animate-slide-up card-hover"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div>
              <span className="text-3xl">{r.icon}</span>
              <h3 className="font-display font-medium text-ink-900 mt-2.5">{r.name}</h3>
              <p className="text-sm text-ink-500 leading-snug">{r.description}</p>
              <p className="text-xs text-ink-300 mt-1.5">{r.inventory} in stock</p>
            </div>
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-ink-900/[0.05]">
              <span className="font-mono-tab text-sm font-semibold text-ink-900">{r.pointsRequired} pts</span>
              <button
                onClick={() => redeem(r.id)}
                disabled={!r.canRedeem || r.inventory <= 0 || redeemingId === r.id}
                className="bg-moss-900 hover:bg-canopy-500 disabled:bg-ink-900/10 disabled:text-ink-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
              >
                {redeemingId === r.id ? "Redeeming…" : "Redeem"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
