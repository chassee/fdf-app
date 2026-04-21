import { useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { toast } from "sonner";
import { ArrowRight, Loader2, AtSign, CheckCircle2 } from "lucide-react";

export default function OnboardingUsername() {
  const [, setLocation] = useLocation();
  const { user, profile, refetch } = useOnboarding();
  const [username, setUsername] = useState(profile?.username || "");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  if (!user || !profile) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh" }}>Loading...</div>;
  }

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmed = username.trim();
    if (!trimmed) { setError("Please choose a username"); return; }
    if (trimmed.length < 2) { setError("Username must be at least 2 characters"); return; }
    if (trimmed.length > 30) { setError("Username must be 30 characters or less"); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) { setError("Only letters, numbers and underscores allowed"); return; }

    setIsPending(true);
    try {
      const { data: existing } = await supabase
        .from("fdf_users")
        .select("id")
        .eq("username", trimmed)
        .maybeSingle();
      if (existing) { setError("That username is already taken. Try another."); setIsPending(false); return; }

      const { error: updateErr } = await supabase
        .from("fdf_users")
        .update({ username: trimmed, onboarding_complete: true })
        .eq("id", profile.id);
      if (updateErr) throw updateErr;

      await refetch();

      toast.success("You're all set! Welcome to FDF 🎉");
      setTimeout(() => setLocation("/"), 800);
    } catch (e: any) {
      const msg = e.message ?? "Failed to save username";
      setError(msg);
      toast.error(msg);
      setIsPending(false);
    }
  }

  const isValid = username.trim().length >= 2 && /^[a-zA-Z0-9_]+$/.test(username.trim());

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.progressRow}>
          <div style={{ ...S.dot, background: "#8b5cf6" }} />
          <div style={{ ...S.dot, background: "#8b5cf6" }} />
          <div style={{ ...S.dot, background: "#8b5cf6" }} />
        </div>

        <div style={S.iconWrap}>
          <AtSign size={28} color="#a78bfa" />
        </div>

        <h1 style={S.title}>Choose your Dawg name</h1>
        <p style={S.subtitle}>This is how other Dawgs will know you. You can use letters, numbers, and underscores.</p>

        <form onSubmit={handleContinue} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={S.label}>Username</label>
            <div style={{ position: "relative" }}>
              <span style={S.atPrefix}>@</span>
              <input
                type="text"
                placeholder="your_dawg_name"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(""); }}
                maxLength={30}
                autoComplete="username"
                style={{
                  ...S.input,
                  paddingLeft: 36,
                  borderColor: error ? "#f87171" : isValid ? "#34d399" : "rgba(139,92,246,0.25)",
                }}
              />
              {isValid && !error && (
                <CheckCircle2 size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#34d399" }} />
              )}
            </div>
            {error && <p style={S.fieldError}>{error}</p>}
            {!error && username && (
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", marginTop: 6 }}>
                {username.length}/30 characters
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending || !isValid}
            style={{ ...S.submitBtn, opacity: isPending || !isValid ? 0.6 : 1, cursor: isPending || !isValid ? "not-allowed" : "pointer" }}
          >
            {isPending ? (
              <><Loader2 size={18} style={{ animation: "spin 0.8s linear infinite" }} /> Finishing setup…</>
            ) : (
              <>Let's Go! <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <p style={S.footnote}>You can change your username later in settings.</p>
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
  progressRow: { display: "flex", gap: 8, justifyContent: "center", marginBottom: 28 },
  dot: { width: 8, height: 8, borderRadius: "50%", transition: "background 0.3s" },
  iconWrap: {
    width: 56, height: 56, borderRadius: 16,
    background: "rgba(139,92,246,0.15)",
    border: "1px solid rgba(139,92,246,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 20px",
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "1.5rem", fontWeight: 800, color: "#f8fafc",
    textAlign: "center", marginBottom: 8, letterSpacing: "-0.03em",
  },
  subtitle: {
    fontSize: "0.875rem", color: "rgba(255,255,255,0.5)",
    textAlign: "center", marginBottom: 28, lineHeight: 1.6,
  },
  label: {
    display: "block", fontSize: "0.72rem", fontWeight: 700,
    color: "rgba(255,255,255,0.7)", marginBottom: 6,
    letterSpacing: "0.06em", textTransform: "uppercase",
  },
  atPrefix: {
    position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
    color: "rgba(255,255,255,0.4)", fontSize: "0.9375rem", fontWeight: 600,
    pointerEvents: "none",
  },
  input: {
    width: "100%", padding: "13px 14px", borderRadius: 12,
    border: "1.5px solid rgba(139,92,246,0.25)",
    background: "rgba(255,255,255,0.08)", fontSize: "0.9375rem",
    color: "#f8fafc", boxSizing: "border-box", transition: "border-color 0.2s",
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
  footnote: { textAlign: "center", marginTop: 20, fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" },
};
