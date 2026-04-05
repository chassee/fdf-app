import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";
import { Clock, Shield, Mail, LogOut, CheckCircle2, RefreshCw, Wrench } from "lucide-react";

interface ApprovalRecord {
  id: string;
  parent_name: string;
  parent_email: string;
  status: "pending" | "approved" | "denied";
  created_at: string;
}

export default function PendingApproval() {
  const [, navigate] = useLocation();
  const [approval, setApproval] = useState<ApprovalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [devApproving, setDevApproving] = useState(false);
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate("/signin");
        return;
      }
      const uid = session.user.id;
      setUserId(uid);
      await loadApprovalStatus(uid);
    });
  }, [navigate]);

  async function loadApprovalStatus(uid: string) {
    setLoading(true);
    try {
      // Check fdf_users approval_status first
      const { data: profile } = await supabase
        .from("fdf_users")
        .select("approval_status")
        .eq("auth_user_id", uid)
        .maybeSingle();

      if (profile?.approval_status === "approved") {
        navigate("/");
        return;
      }

      // Load parent approval record
      const { data } = await supabase
        .from("parent_approvals")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setApproval(data as ApprovalRecord);
        if (data.status === "approved") {
          // Sync approval to fdf_users and redirect
          await supabase
            .from("fdf_users")
            .update({ approval_status: "approved" })
            .eq("auth_user_id", uid);
          navigate("/");
          return;
        }
      } else {
        // No approval request submitted yet — redirect to form
        navigate("/parent-approval");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    if (!userId) return;
    setChecking(true);
    await loadApprovalStatus(userId);
    setChecking(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/");
  }

  async function handleDevApprove() {
    if (!userId) return;
    setDevApproving(true);
    try {
      // Dev-only: directly approve in Supabase (no server needed)
      await supabase.from("parent_approvals")
        .update({ status: "approved" })
        .eq("user_id", userId);
      await supabase.from("fdf_users")
        .update({ approval_status: "approved" })
        .eq("auth_user_id", userId);
      navigate("/");
    } catch (e) {
      console.error("Dev approve failed:", e);
    } finally {
      setDevApproving(false);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: "linear-gradient(160deg, #f7f9ff 0%, #eef3ff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 40, height: 40, borderRadius: "50%",
            border: "3px solid #e2e8f0",
            borderTopColor: "#5b8cff",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const submittedDate = approval
    ? new Date(approval.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

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

        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "linear-gradient(135deg, #fef3c7, #fde68a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 8px 24px rgba(245,158,11,0.2)",
            }}
          >
            <Clock size={34} color="#d97706" />
          </div>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.03em",
              marginBottom: 10,
            }}
          >
            Approval in Progress
          </h1>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#64748b",
              lineHeight: 1.6,
              maxWidth: 320,
              margin: "0 auto",
            }}
          >
            Your application is under review. Full access will unlock once your parent or guardian approves your enrollment.
          </p>
        </div>

        {/* Status Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(12px)",
            borderRadius: 20,
            border: "1px solid rgba(91,140,255,0.12)",
            boxShadow: "0 4px 24px rgba(15,23,42,0.06)",
            padding: "24px",
            marginBottom: 16,
          }}
        >
          {/* Status Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: 16,
              borderBottom: "1px solid #f1f5f9",
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b" }}>
              Status
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#fef3c7",
                color: "#92400e",
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: 99,
                letterSpacing: "0.04em",
              }}
            >
              <span
                style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#f59e0b",
                  display: "inline-block",
                }}
              />
              PENDING REVIEW
            </span>
          </div>

          {/* Approval Details */}
          {approval && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: "#f1f5f9",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Shield size={16} color="#64748b" />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: 1 }}>
                      Parent / Guardian
                    </p>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>
                      {approval.parent_name}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: "#f1f5f9",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={16} color="#64748b" />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: 1 }}>
                      Notification Sent To
                    </p>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>
                      {approval.parent_email}
                    </p>
                  </div>
                </div>

                {submittedDate && (
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: "#f1f5f9",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Clock size={16} color="#64748b" />
                    </div>
                    <div>
                      <p style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: 1 }}>
                        Submitted
                      </p>
                      <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>
                        {submittedDate}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* What Happens Next */}
        <div
          style={{
            background: "rgba(91,140,255,0.06)",
            border: "1px solid rgba(91,140,255,0.15)",
            borderRadius: 14,
            padding: "16px",
            marginBottom: 20,
          }}
        >
          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1e40af", marginBottom: 10, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            What happens next
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Your parent receives an approval notification",
              "They review and confirm your enrollment",
              "Your account unlocks automatically",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div
                  style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: "rgba(91,140,255,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 1,
                  }}
                >
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#5b8cff" }}>
                    {i + 1}
                  </span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.5 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={handleRefresh}
            disabled={checking}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #5b8cff 0%, #7b5cff 100%)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.875rem",
              border: "none",
              cursor: checking ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: checking ? 0.7 : 1,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            <RefreshCw size={15} style={{ animation: checking ? "spin 0.8s linear infinite" : "none" }} />
            {checking ? "Checking…" : "Check Approval Status"}
          </button>

          <button
            onClick={handleSignOut}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 12,
              background: "transparent",
              color: "#64748b",
              fontWeight: 600,
              fontSize: "0.875rem",
              border: "1.5px solid #e2e8f0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <LogOut size={15} />
            Sign Out
          </button>

          {/* DEV MODE ONLY: Approve User button */}
          {isDev && (
            <button
              onClick={handleDevApprove}
              disabled={devApproving}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                background: devApproving ? "#f1f5f9" : "#fef3c7",
                color: "#92400e",
                fontWeight: 700,
                fontSize: "0.8rem",
                border: "1.5px dashed #f59e0b",
                cursor: devApproving ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                letterSpacing: "0.02em",
              }}
            >
              <Wrench size={14} />
              {devApproving ? "Approving…" : "[DEV] Approve This User"}
            </button>
          )}
        </div>


      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
