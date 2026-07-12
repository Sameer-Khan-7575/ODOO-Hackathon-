import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Mail, Lock, User as UserIcon, Building2, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import client from "../api/client";
import GrowthRing from "../components/GrowthRing";
import FloatingOrbs from "../components/FloatingOrbs";

interface Department {
  id: number;
  name: string;
}

// Public sign-up only ever creates EMPLOYEE accounts (the backend enforces
// this too — role is never trusted from the client). Manager/Admin access
// is granted separately by a program owner.

export default function Login() {
  const [mode, setMode] = useState<"signin" | "register">("signin");

  // sign in
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin123");

  // register
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [departments, setDepartments] = useState<Department[]>([]);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  useEffect(() => {
    client
      .get("/master/departments")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];
        setDepartments(list);
        if (list[0]) setDepartmentId(list[0].id);
      })
      .catch(() => setDepartments([]));
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!departmentId) {
      setError("Please select a department");
      return;
    }
    setIsLoading(true);
    try {
      await register({
        name,
        email: regEmail,
        password: regPassword,
        departmentId: Number(departmentId),
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex w-[44%] bg-moss-gradient relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-grain pointer-events-none" />
        <FloatingOrbs variant="dark" />

        <div className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-lime-400 flex items-center justify-center shadow-glow">
            <Leaf size={18} strokeWidth={2.5} className="text-moss-900" />
          </div>
          <span className="font-display text-xl font-semibold text-white">EcoSphere</span>
        </div>

        <div className="relative flex flex-col items-center animate-float">
          <GrowthRing environmental={78} social={62} governance={45} overall={64} size={280} />
        </div>

        <div className="relative">
          <p className="font-display text-3xl text-white leading-snug max-w-sm">
            Every action leaves a ring.
          </p>
          <p className="text-white/50 mt-3 max-w-sm text-sm leading-relaxed">
            Track environmental, social and governance impact across your organisation —
            one verified action at a time.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-paper-50 relative overflow-hidden">
        <FloatingOrbs variant="light" />
        <div className="w-full max-w-md animate-slide-up relative">
          <div className="lg:hidden flex items-center gap-2.5 justify-center mb-8">
            <div className="w-9 h-9 rounded-xl bg-moss-900 flex items-center justify-center">
              <Leaf size={18} strokeWidth={2.5} className="text-lime-400" />
            </div>
            <span className="font-display text-xl font-semibold text-ink-900">EcoSphere</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-ink-900/[0.04] rounded-xl p-1 mb-8">
            <button
              onClick={() => {
                setMode("signin");
                setError("");
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === "signin" ? "bg-white text-ink-900 shadow-soft" : "text-ink-500 hover:text-ink-900"
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === "register" ? "bg-white text-ink-900 shadow-soft" : "text-ink-500 hover:text-ink-900"
              }`}
            >
              Create account
            </button>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 animate-fade-in">
              {error}
            </div>
          )}

          {mode === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <h2 className="font-display text-2xl font-medium text-ink-900 mb-1">Welcome back</h2>
                <p className="text-ink-500 text-sm mb-6">Sign in to continue tracking your impact.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-ink-900/10 pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-canopy-500 focus:border-transparent transition-shadow"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-ink-900/10 pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-canopy-500 focus:border-transparent transition-shadow"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-moss-900 hover:bg-moss-800 disabled:opacity-60 text-white font-medium rounded-xl py-3 transition-colors group"
              >
                {isLoading ? "Signing in…" : "Sign in"}
                {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />}
              </button>

              <p className="text-xs text-ink-500 mt-6 text-center leading-relaxed">
                Demo admin: admin@gmail.com<br />(password: admin123)
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <h2 className="font-display text-2xl font-medium text-ink-900 mb-1">Create your account</h2>
                <p className="text-ink-500 text-sm mb-6">Join as a participant, manager, or program admin.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Full name</label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-ink-900/10 pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-canopy-500 focus:border-transparent transition-shadow"
                    placeholder="Jane Cooper"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-ink-900/10 pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-canopy-500 focus:border-transparent transition-shadow"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-ink-900/10 pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-canopy-500 focus:border-transparent transition-shadow"
                    placeholder="At least 6 characters"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Department</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(Number(e.target.value))}
                    required
                    className="w-full rounded-xl border border-ink-900/10 pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-canopy-500 focus:border-transparent transition-shadow appearance-none bg-white"
                  >
                    {departments.length === 0 && <option value="">Loading…</option>}
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-xs text-ink-500 bg-ink-900/[0.03] rounded-lg px-3.5 py-2.5 leading-relaxed">
                New accounts join as an <span className="font-medium text-ink-700">Employee</span>.
                Manager or Admin access is granted separately by a program owner.
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-moss-900 hover:bg-moss-800 disabled:opacity-60 text-white font-medium rounded-xl py-3 transition-colors group"
              >
                {isLoading ? "Creating account…" : "Create account"}
                {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
