import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ArrowRight, Loader2, Calendar } from "lucide-react";

function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function OnboardingDOB() {
  const [, setLocation] = useLocation();
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Get session token from Supabase native session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setLocation("/signin");
        return;
      }
      setAccessToken(session.access_token);
    });
  }, [setLocation]);

  const [isPending, setIsPending] = useState(false);

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!dob) { setError("Please enter your date of birth"); return; }
    const age = calculateAge(dob);
    if (age < 13 || age > 17) {
      setError("FDF is for ages 13–17 only.");
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { toast.error("Session expired. Please sign in again."); setLocation("/signin"); return; }
    setIsPending(true);
    try {
      const { error: updateErr } = await supabase
        .from("fdf_users")
        .update({ dob, profile_complete: true })
        .eq("auth_user_id", session.user.id);
      if (updateErr) throw updateErr;
      toast.success("Date of birth saved!");
      setLocation("/onboarding/username");
    } catch (e: any) {
      const msg = e.message ?? "Failed to save date of birth";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsPending(false);
    }
  }

  // Max date: must be at least 13 years old
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 13);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  // Min date: can't be older than 17
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 18);
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const age = dob ? calculateAge(dob) : null;
  const isValid = dob && age !== null && age >= 13 && age <= 17;

  return (
    <div style={S.page}>
      <div style={S.card}>
        {/* Progress dots */}
        <div style={S.progressRow}>
          <div style={{ ...S.dot, background: "#8b5cf6" }} />
          <div style={{ ...S.dot, background: "rgba(255,255,255,0.2)" }} />
          <div style={{ ...S.dot, background: "rgba(255,255,255,0.2)" }} />
        </div>

        {/* Icon */}
        <div style={S.iconWrap}>
          <Calendar size={28} color="#a78bfa" />
        </div>

        <h1 style={S.title}>When's your birthday?</h1>
        <p style={S.subtitle}>FDF is built for ages 13–17. We need your date of birth to verify eligibility.</p>

        <form onSubmit={handleContinue} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={S.label}>Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={e => { setDob(e.target.value); setError(""); }}
              min={minDateStr}
              max={maxDateStr}
              style={{
                ...S.input,
                borderColor: error ? "#f87171" : isValid ? "#34d399" : "rgba(139,92,246,0.25)",
                colorScheme: "dark",
              }}
            />
            {error && <p style={S.fieldError}>{error}</p>}
            {isValid && !error && (
              <p style={{ fontSize: "0.8rem", color: "#34d399", marginTop: 6 }}>
                ✓ Age {age} — you're eligible for FDF!
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending || !isValid}
            style={{ ...S.submitBtn, opacity: isPending || !isValid ? 0.6 : 1, cursor: isPending || !isValid ? "not-allowed" : "pointer" }}
          >
            {isPending ? (
              <><Loader2 size={18} style={{ animation: "spin 0.8s linear infinite" }} /> Saving…</>
            ) : (
              <>Continue <ArrowRight size={16} /></>
            )}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type="date"]:focus { outline: none; border-color: #8b5cf6 !important; box-shadow: 0 0 0 3px rgba(139,92,246,0.15); }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1) opacity(0.5); cursor: pointer; }
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
  progressRow: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
    marginBottom: 28,
  },
  dot: {
    width: 8, height: 8, borderRadius: "50%",
    transition: "background 0.3s",
  },
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
};
