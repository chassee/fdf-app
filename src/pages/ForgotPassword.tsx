import { useState } from "react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, ArrowRight, Loader2, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: "https://fdf.crypdawgs.com/reset-password",
      });
      if (err) throw err;
      setSent(true);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        {/* Back link */}
        <Link href="/signin" style={S.backLink}>
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>

        {/* Logo */}
        <div style={S.logoRow}>
          <div style={S.logoBadge}>FDF</div>
        </div>

        {sent ? (
          /* Success state */
          <div style={{ textAlign: "center" }}>
            <div style={S.successIcon}>
              <CheckCircle2 size={32} color="#4ade80" />
            </div>
            <h1 style={S.title}>Check your inbox</h1>
            <p style={S.subtitle}>
              We sent a password reset link to <strong style={{ color: "#a78bfa" }}>{email}</strong>.
              It expires in 1 hour.
            </p>
            <p style={{ ...S.subtitle, marginTop: 16, fontSize: "0.8rem" }}>
              Didn't get it? Check your spam folder, or{" "}
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                style={S.textBtn}
              >
                try again
              </button>.
            </p>
          </div>
        ) : (
          /* Form state */
          <>
            <h1 style={S.title}>Reset password</h1>
            <p style={S.subtitle}>
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={S.label}>Email address</label>
                <div style={{ position: "relative" }}>
                  <Mail size={15} style={S.inputIcon} />
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus
                    style={{ ...S.input, paddingLeft: 40 }}
                  />
                </div>
                {error && <p style={S.fieldError}>{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                style={{
                  ...S.submitBtn,
                  opacity: loading || !email.trim() ? 0.6 : 1,
                  cursor: loading || !email.trim() ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <><Loader2 size={18} style={{ animation: "spin 0.8s linear infinite" }} /> Sending…</>
                ) : (
                  <>Send reset link <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          </>
        )}
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
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.45)",
    textDecoration: "none",
    marginBottom: 24,
    transition: "color 0.2s",
  },
  logoRow: { display: "flex", justifyContent: "center", marginBottom: 20 },
  logoBadge: {
    width: 52, height: 52, borderRadius: 14,
    background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "1rem", fontWeight: 900, color: "#fff", letterSpacing: "0.05em",
    boxShadow: "0 8px 24px rgba(139,92,246,0.4)",
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "1.5rem", fontWeight: 800, color: "#f8fafc",
    textAlign: "center", marginBottom: 6, letterSpacing: "-0.03em",
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "rgba(255,255,255,0.55)",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 1.5,
  },
  label: {
    display: "block", fontSize: "0.72rem", fontWeight: 700,
    color: "rgba(255,255,255,0.7)", marginBottom: 6,
    letterSpacing: "0.06em", textTransform: "uppercase",
  },
  inputIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: "rgba(255,255,255,0.35)",
    pointerEvents: "none",
  } as React.CSSProperties,
  input: {
    width: "100%", padding: "13px 14px", borderRadius: 12,
    border: "1.5px solid rgba(139,92,246,0.25)",
    background: "rgba(255,255,255,0.08)", fontSize: "0.9375rem",
    color: "#f8fafc", boxSizing: "border-box", transition: "border-color 0.2s",
  },
  fieldError: { fontSize: "0.72rem", color: "#f87171", marginTop: 4 },
  submitBtn: {
    marginTop: 4, width: "100%", height: 52,
    background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
    color: "#fff", border: "none", borderRadius: 14,
    fontSize: "0.9375rem", fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    boxShadow: "0 8px 24px rgba(139,92,246,0.35)", transition: "all 0.2s",
  },
  successIcon: {
    display: "flex", justifyContent: "center", marginBottom: 16,
  },
  textBtn: {
    background: "none", border: "none", cursor: "pointer",
    color: "#a78bfa", fontWeight: 600, fontSize: "inherit", padding: 0,
  },
};
