import { useState } from "react";
import { Link, useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useFDF } from "@/contexts/FDFContext";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function SignIn() {
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { setLocalProfile } = useFDF();

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email required";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      if (error || !data.session) throw new Error(error?.message ?? "Invalid email or password");

      // Store session in localStorage
      localStorage.setItem("fdf-supabase-session", JSON.stringify({
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at,
        userId: data.user.id,
        email: data.user.email,
      }));

      // Fetch profile from Supabase and hydrate FDFContext
      const { data: profile, error: profileError } = await supabase
        .from("fdf_users")
        .select("*")
        .eq("auth_user_id", data.user.id)
        .single();

      if (!profileError && profile) {
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

      // Check if already graduated — redirect to graduation lock screen
      if (profile?.graduated === true) {
        toast.success(`Welcome back! 👋`);
        setLocation("/graduation");
        return;
      }

      // Check approval status — redirect to pending screen if not approved
      const approvalStatus = profile?.approval_status ?? "pending";
      if (approvalStatus === "pending") {
        // Check if they have a pending approval request or need to submit one
        const { data: approvalRecord } = await supabase
          .from("parent_approvals")
          .select("id")
          .eq("user_id", data.user.id)
          .single();
        if (approvalRecord) {
          toast.success(`Welcome back! 👋`);
          setLocation("/pending-approval");
          return;
        } else {
          toast.success(`Welcome back! 👋`);
          setLocation("/parent-approval");
          return;
        }
      }
      toast.success(`Welcome back! 👋`);
      setLocation("/");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--bg-main)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 52, height: 52, borderRadius: 14,
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 8px 24px rgba(91,140,255,0.3)",
              fontSize: "1.5rem",
            }}
          >
            🐾
          </div>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.625rem", fontWeight: 800,
              color: "var(--text-main)", letterSpacing: "-0.02em", marginBottom: 6,
            }}
          >
            Sign In
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)" }}>
            Continue your FDF training.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Email */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-main)", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              autoComplete="email"
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 12,
                border: errors.email ? "1.5px solid #ef4444" : "1.5px solid rgba(91,140,255,0.2)",
                background: "rgba(255,255,255,0.9)", fontSize: "0.9375rem",
                color: "var(--text-main)", outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
            />
            {errors.email && <p style={{ fontSize: "0.72rem", color: "#ef4444", marginTop: 4 }}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-main)", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Your password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                autoComplete="current-password"
                style={{
                  width: "100%", padding: "12px 44px 12px 14px", borderRadius: 12,
                  border: errors.password ? "1.5px solid #ef4444" : "1.5px solid rgba(91,140,255,0.2)",
                  background: "rgba(255,255,255,0.9)", fontSize: "0.9375rem",
                  color: "var(--text-main)", outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p style={{ fontSize: "0.72rem", color: "#ef4444", marginTop: 4 }}>{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              width: "100%", padding: "14px 20px",
              background: loading ? "rgba(91,140,255,0.5)" : "linear-gradient(135deg, var(--primary), var(--accent))",
              color: "white", border: "none", borderRadius: 14,
              fontSize: "0.9375rem", fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 8px 24px rgba(91,140,255,0.3)",
              transition: "all 0.2s",
            }}
          >
            {loading ? (
              <>
                <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                Signing in…
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Sign Up link */}
        <p style={{ textAlign: "center", marginTop: 24, fontSize: "0.875rem", color: "var(--text-sub)" }}>
          Don't have an account?{" "}
          <Link href="/signup" style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>
            Create Account
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(91,140,255,0.12); }
      `}</style>
    </div>
  );
}
