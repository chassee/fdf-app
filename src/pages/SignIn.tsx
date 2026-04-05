import { useState } from "react";
import { Link, useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useFDF } from "@/contexts/FDFContext";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

export default function SignIn() {
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { setLocalProfile } = useFDF();

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || loading) return;
    setLoading(true);
    try {
      // Supabase handles session persistence natively via onAuthStateChange
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      if (error || !data.session) throw new Error(error?.message ?? "Invalid email or password");

      // Fetch profile and hydrate local state
      const { data: profile } = await supabase
        .from("fdf_users")
        .select("*")
        .eq("auth_user_id", data.user.id)
        .maybeSingle();

      if (profile) {
        setLocalProfile({
          name: profile.name,
          xp: profile.xp ?? 0,
          gems: profile.gems ?? 0,
          streak_days: profile.streak_days ?? 0,
          completed_missions: profile.completed_missions ?? [],
          last_checkin: profile.last_checkin ?? null,
          dob: profile.dob ?? null,
          dawg_class: profile.dawg_class ?? null,
        });
      }

      toast.success("Welcome back! 👋");

      // Route based on profile state
      if (profile?.graduated === true) {
        setLocation("/graduation");
        return;
      }

      // If no profile or onboarding not complete → onboarding
      if (!profile || !profile.onboarding_complete) {
        const hasDob = !!profile?.dob;
        setLocation(hasDob ? "/onboarding/username" : "/onboarding/dob");
        return;
      }

      // Check approval status
      const approvalStatus = profile?.approval_status ?? "pending";
      if (approvalStatus === "pending") {
        const { data: approvalRecord } = await supabase
          .from("parent_approvals")
          .select("id")
          .eq("user_id", data.user.id)
          .maybeSingle();
        setLocation(approvalRecord ? "/pending-approval" : "/parent-approval");
        return;
      }

      setLocation("/");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        {/* Logo */}
        <div style={S.logoRow}>
          <div style={S.logoBadge}>FDF</div>
        </div>

        <h1 style={S.title}>Welcome Back</h1>
        <p style={S.subtitle}>Continue your FDF training</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Email */}
          <div>
            <label style={S.label}>Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              autoComplete="email"
              style={{ ...S.input, borderColor: errors.email ? "#f87171" : "rgba(139,92,246,0.25)" }}
            />
            {errors.email && <p style={S.fieldError}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label style={S.label}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Your password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                autoComplete="current-password"
                style={{ ...S.input, paddingRight: 44, borderColor: errors.password ? "#f87171" : "rgba(139,92,246,0.25)" }}
              />
              <button type="button" onClick={() => setShowPass(p => !p)} style={S.eyeBtn}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p style={S.fieldError}>{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{ ...S.submitBtn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? (
              <><Loader2 size={18} style={{ animation: "spin 0.8s linear infinite" }} /> Signing in…</>
            ) : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <p style={S.switchText}>
          Don't have an account?{" "}
          <Link href="/signup" style={S.link}>Create Account</Link>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { outline: none; border-color: #8b5cf6 !important; box-shadow: 0 0 0 3px rgba(139,92,246,0.15); }
        input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100dvh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 20px",
    background: "linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  },
  card: {
    width: "100%",
    maxWidth: 440,
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 24,
    padding: "36px 32px",
    boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
  },
  logoRow: { display: "flex", justifyContent: "center", marginBottom: 24 },
  logoBadge: {
    width: 52, height: 52, borderRadius: 14,
    background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "1rem", fontWeight: 900, color: "#fff", letterSpacing: "0.05em",
    boxShadow: "0 8px 24px rgba(139,92,246,0.4)",
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "1.625rem", fontWeight: 800, color: "#f8fafc",
    textAlign: "center", marginBottom: 6, letterSpacing: "-0.03em",
  },
  subtitle: { fontSize: "0.875rem", color: "rgba(255,255,255,0.55)", textAlign: "center", marginBottom: 28 },
  label: {
    display: "block", fontSize: "0.72rem", fontWeight: 700,
    color: "rgba(255,255,255,0.7)", marginBottom: 6,
    letterSpacing: "0.06em", textTransform: "uppercase",
  },
  input: {
    width: "100%", padding: "13px 14px", borderRadius: 12,
    border: "1.5px solid rgba(139,92,246,0.25)",
    background: "rgba(255,255,255,0.08)", fontSize: "0.9375rem",
    color: "#f8fafc", boxSizing: "border-box", transition: "border-color 0.2s",
  },
  eyeBtn: {
    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", cursor: "pointer",
    color: "rgba(255,255,255,0.45)", padding: 4, display: "flex", alignItems: "center",
  },
  fieldError: { fontSize: "0.72rem", color: "#f87171", marginTop: 4 },
  submitBtn: {
    marginTop: 8, width: "100%", height: 52,
    background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
    color: "#fff", border: "none", borderRadius: 14,
    fontSize: "0.9375rem", fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    boxShadow: "0 8px 24px rgba(139,92,246,0.35)", transition: "all 0.2s",
  },
  switchText: { textAlign: "center", marginTop: 24, fontSize: "0.875rem", color: "rgba(255,255,255,0.5)" },
  link: { color: "#a78bfa", fontWeight: 700, textDecoration: "none" },
};
