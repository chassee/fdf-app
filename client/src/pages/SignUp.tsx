import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";

export default function SignUp() {
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ name: "", age: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const signUpMutation = trpc.supabaseAuth.signUp.useMutation({
    onSuccess: async (data) => {
      // Auto sign-in after signup
      try {
        const { data: signInData, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error || !signInData.session) throw new Error(error?.message ?? "Sign-in failed");
        // Store session
        localStorage.setItem("fdf-supabase-session", JSON.stringify({
          accessToken: signInData.session.access_token,
          refreshToken: signInData.session.refresh_token,
          expiresAt: signInData.session.expires_at,
          userId: signInData.user.id,
          email: signInData.user.email,
        }));
        setSuccess(true);
        toast.success("Account created! Welcome to FDF 🎉");
        // All FDF users are 13-17, so always require parent approval
        const age = parseInt(form.age);
        const redirectTo = age < 18 ? "/parent-approval" : "/";
        setTimeout(() => setLocation(redirectTo), 1500);
      } catch (e: any) {
        toast.error(e.message);
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    const age = parseInt(form.age);
    if (!form.age || isNaN(age) || age < 13 || age > 17) errs.age = "Age must be 13–17";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email required";
    if (!form.password || form.password.length < 8) errs.password = "Password must be at least 8 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    signUpMutation.mutate({
      name: form.name.trim(),
      age: parseInt(form.age),
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });
  }

  if (success) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--bg-main)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <CheckCircle2 size={32} style={{ color: "#16a34a" }} />
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
            Welcome to FDF
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)" }}>Setting up your dashboard…</p>
        </div>
      </div>
    );
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
            Join FDF
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-sub)" }}>
            Create your account to start building financial intelligence.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Name */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-main)", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 12,
                border: errors.name ? "1.5px solid #ef4444" : "1.5px solid rgba(91,140,255,0.2)",
                background: "rgba(255,255,255,0.9)", fontSize: "0.9375rem",
                color: "var(--text-main)", outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
            />
            {errors.name && <p style={{ fontSize: "0.72rem", color: "#ef4444", marginTop: 4 }}>{errors.name}</p>}
          </div>

          {/* Age */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-main)", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Age
            </label>
            <input
              type="number"
              placeholder="13–17"
              min={13}
              max={17}
              value={form.age}
              onChange={e => setForm(p => ({ ...p, age: e.target.value }))}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 12,
                border: errors.age ? "1.5px solid #ef4444" : "1.5px solid rgba(91,140,255,0.2)",
                background: "rgba(255,255,255,0.9)", fontSize: "0.9375rem",
                color: "var(--text-main)", outline: "none",
                boxSizing: "border-box",
              }}
            />
            {errors.age && <p style={{ fontSize: "0.72rem", color: "#ef4444", marginTop: 4 }}>{errors.age}</p>}
          </div>

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
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 12,
                border: errors.email ? "1.5px solid #ef4444" : "1.5px solid rgba(91,140,255,0.2)",
                background: "rgba(255,255,255,0.9)", fontSize: "0.9375rem",
                color: "var(--text-main)", outline: "none",
                boxSizing: "border-box",
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
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
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
            disabled={signUpMutation.isPending}
            style={{
              marginTop: 8,
              width: "100%", padding: "14px 20px",
              background: signUpMutation.isPending ? "rgba(91,140,255,0.5)" : "linear-gradient(135deg, var(--primary), var(--accent))",
              color: "white", border: "none", borderRadius: 14,
              fontSize: "0.9375rem", fontWeight: 700,
              cursor: signUpMutation.isPending ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 8px 24px rgba(91,140,255,0.3)",
              transition: "all 0.2s",
            }}
          >
            {signUpMutation.isPending ? (
              <>
                <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                Creating account…
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Sign In link */}
        <p style={{ textAlign: "center", marginTop: 24, fontSize: "0.875rem", color: "var(--text-sub)" }}>
          Already have an account?{" "}
          <Link href="/signin" style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>
            Sign In
          </Link>
        </p>

        {/* Age note */}
        <p style={{ textAlign: "center", marginTop: 12, fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
          FDF is for ages 13–17 only. 100% free. Sponsor-funded.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(91,140,255,0.12); }
      `}</style>
    </div>
  );
}
