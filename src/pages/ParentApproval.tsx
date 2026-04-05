import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";
import { Shield, Lock, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ParentApproval() {
  const [, navigate] = useLocation();
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userAge, setUserAge] = useState<number | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate("/signin");
        return;
      }
      const uid = session.user.id;
      setUserId(uid);

      // Fetch user profile to check age and existing approval
      const { data: profile } = await supabase
        .from("fdf_users")
        .select("age, approval_status")
        .eq("auth_user_id", uid)
        .maybeSingle();

      if (!profile) return;

      // If already approved, redirect home
      if (profile.approval_status === "approved") {
        navigate("/");
        return;
      }

      // If already submitted (pending), redirect to pending screen
      if (profile.approval_status === "pending") {
        // Check if they already submitted a parent approval request
        const { data: existing } = await supabase
          .from("parent_approvals")
          .select("id")
          .eq("user_id", uid)
          .maybeSingle();
        if (existing) {
          navigate("/pending-approval");
          return;
        }
      }

      setUserAge(profile.age ?? null);
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    if (!parentName.trim() || !parentEmail.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Insert parent approval record
      const { error: insertErr } = await supabase
        .from("parent_approvals")
        .insert({
          user_id: userId,
          parent_name: parentName.trim(),
          parent_email: parentEmail.trim(),
          status: "pending",
        });

      if (insertErr) throw insertErr;

      // Update user approval_status to pending (already default, but explicit)
      await supabase
        .from("fdf_users")
        .update({ approval_status: "pending" })
        .eq("auth_user_id", userId);

      setSubmitted(true);
      setTimeout(() => navigate("/pending-approval"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: "linear-gradient(160deg, #f7f9ff 0%, #eef3ff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 360 }}>
          <div
            style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <CheckCircle2 size={32} color="#16a34a" />
          </div>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.375rem",
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: 8,
            }}
          >
            Request Submitted
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
            Redirecting to your approval status…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(160deg, #f7f9ff 0%, #eef3ff 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: 16,
              background: "linear-gradient(135deg, #5b8cff 0%, #7b5cff 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 8px 24px rgba(91,140,255,0.25)",
            }}
          >
            <Shield size={26} color="white" />
          </div>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.03em",
              marginBottom: 8,
            }}
          >
            Parent Approval Required
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#64748b", lineHeight: 1.6, maxWidth: 320, margin: "0 auto" }}>
            As a participant under 18, FDF requires a parent or guardian to approve your enrollment before full access is granted.
          </p>
        </div>

        {/* Info Banner */}
        <div
          style={{
            background: "rgba(91,140,255,0.08)",
            border: "1px solid rgba(91,140,255,0.2)",
            borderRadius: 12,
            padding: "14px 16px",
            marginBottom: 24,
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <Lock size={16} color="#5b8cff" style={{ marginTop: 2, flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1e40af", marginBottom: 2 }}>
              Why is this required?
            </p>
            <p style={{ fontSize: "0.78rem", color: "#475569", lineHeight: 1.5 }}>
              FDF is a structured financial education program. Parent consent ensures transparency, safety, and institutional accountability.
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(12px)",
            borderRadius: 20,
            border: "1px solid rgba(91,140,255,0.12)",
            boxShadow: "0 4px 24px rgba(15,23,42,0.06)",
            padding: "28px 24px",
          }}
        >
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "#94a3b8",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Parent / Guardian Information
          </p>

          {/* Parent Name */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: 6,
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder="Parent or guardian's full name"
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1.5px solid #e2e8f0",
                fontSize: "0.9rem",
                color: "#0f172a",
                background: "white",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#5b8cff")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          {/* Parent Email */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: 6,
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              placeholder="parent@email.com"
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1.5px solid #e2e8f0",
                fontSize: "0.9rem",
                color: "#0f172a",
                background: "white",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#5b8cff")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
            <p style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 5 }}>
              An approval notification will be sent to this address.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 8,
                padding: "10px 12px",
                marginBottom: 16,
              }}
            >
              <AlertCircle size={14} color="#ef4444" />
              <p style={{ fontSize: "0.8rem", color: "#dc2626" }}>{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 12,
              background: submitting
                ? "#94a3b8"
                : "linear-gradient(135deg, #5b8cff 0%, #7b5cff 100%)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.9rem",
              border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "opacity 0.15s",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {submitting ? "Submitting…" : (
              <>
                Request Parent Approval
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer note */}
        <p
          style={{
            textAlign: "center",
            fontSize: "0.72rem",
            color: "#94a3b8",
            marginTop: 20,
            lineHeight: 1.5,
          }}
        >
          FDF is 100% free. No purchases required.
        </p>
      </div>
    </div>
  );
}
