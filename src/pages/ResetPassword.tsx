import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { ArrowRight, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState(false);

  useEffect(() => {
    // Supabase sends the user back with a hash fragment containing the tokens.
    // onAuthStateChange fires with SIGNED_IN after the hash is processed.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });

    // Also check if we already have a valid session (user refreshed the page)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true);
      else {
        // Give Supabase a moment to process the hash
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session: s } }) => {
            if (s) setSessionReady(true);
            else setSessionError(true);
          });
        }, 1500);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password: form.password });
      if (err) throw err;
      setDone(true);
      setTimeout(() => setLocation("/signin"), 2500);
    } catch (e: any) {
      setError(e.message ?? "Failed to update password. Please request a new reset link.");
    } finally {
      setLoading(false);
    }
  }

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (p.length >= 12) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very strong"][strength];
  const strengthColor = ["", "#f87171", "#fb923c", "#facc15", "#4ade80", "#34d399"][strength];

  return (
    <div style={S.page}>
      <div style={S.card}>
        {/* Logo */}
        <div style={S.logoRow}>
          <div style={S.logoBadge}>FDF</div>
        </div>

        {done ? (
          <div style={{ textAlign: "center" }}>
            <div style={S.successIcon}><CheckCircle2 size={36} color="#4ade80" /></div>
            <h1 style={S.title}>Password updated!</h1>
            <p style={S.subtitle}>Redirecting you to sign in…</p>
          </div>
        ) : sessionError ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <AlertCircle size={36} color="#f87171" />
            </div>
            <h1 style={S.title}>Link expired</h1>
            <p style={S.subtitle}>
              This reset link has expired or already been used.
            </p>
            <button
              onClick={() => setLocation("/forgot-password")}
              style={{ ...S.submitBtn, marginTop: 8 }}
            >
              Request a new link <ArrowRight size={16} />
            </button>
          </div>
        ) : !sessionReady ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <Loader2 size={28} style={{ animation: "spin 0.8s linear infinite", color: "#8b5cf6", margin: "0 auto 12px" }} />
            <p style={S.subtitle}>Verifying reset link…</p>
          </div>
        ) : (
          <>
            <h1 style={S.title}>New password</h1>
            <p style={S.subtitle}>Choose a strong password for your account.</p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* New password */}
              <div>
                <label style={S.label}>New Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    autoComplete="new-password"
                    autoFocus
                    style={{ ...S.input, paddingRight: 44 }}
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)} style={S.eyeBtn}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Strength bar */}
                {form.password.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[1,2,3,4,5].map(i => (
                        <div key={i} style={{
                          flex: 1, height: 3, borderRadius: 2,
                          background: i <= strength ? strengthColor : "rgba(255,255,255,0.1)",
                          transition: "background 0.3s",
                        }} />
                      ))}
                    </div>
                    <p style={{ fontSize: "0.7rem", color: strengthColor, marginTop: 4 }}>{strengthLabel}</p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label style={S.label}>Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={form.confirm}
                    onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                    autoComplete="new-password"
                    style={{
                      ...S.input, paddingRight: 44,
                      borderColor: form.confirm && form.confirm !== form.password
                        ? "#f87171" : "rgba(139,92,246,0.25)",
                    }}
                  />
                  <button type="button" onClick={() => setShowConfirm(p => !p)} style={S.eyeBtn}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && <p style={S.fieldError}>{error}</p>}

              <button
                type="submit"
                disabled={loading || !form.password || !form.confirm}
                style={{
                  ...S.submitBtn,
                  opacity: loading || !form.password || !form.confirm ? 0.6 : 1,
                  cursor: loading || !form.password || !form.confirm ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <><Loader2 size={18} style={{ animation: "spin 0.8s linear infinite" }} /> Updating…</>
                ) : (
                  <>Update Password <ArrowRight size={16} /></>
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
    fontSize: "0.875rem", color: "rgba(255,255,255,0.55)",
    textAlign: "center", marginBottom: 24, lineHeight: 1.5,
  },
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
  fieldError: { fontSize: "0.72rem", color: "#f87171", marginTop: 0 },
  submitBtn: {
    marginTop: 4, width: "100%", height: 52,
    background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
    color: "#fff", border: "none", borderRadius: 14,
    fontSize: "0.9375rem", fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    boxShadow: "0 8px 24px rgba(139,92,246,0.35)", transition: "all 0.2s",
  },
  successIcon: { display: "flex", justifyContent: "center", marginBottom: 16 },
};
