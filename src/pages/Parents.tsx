import { BookOpen, ExternalLink, Lock, Mail, Shield, Users, Zap } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: "🛡️",
    title: "100% Free for Students",
    body: "FDF is entirely free for ages 13–17. No in-app purchases, no subscriptions, no hidden fees. The program is funded by sponsors who believe in youth financial education.",
    color: "#16a34a",
    bg: "#dcfce7",
  },
  {
    icon: "🔒",
    title: "Privacy First",
    body: "We collect only a first name and date of birth during onboarding. No last names, phone numbers, or addresses. We never sell or share student data with third parties.",
    color: "#7b5cff",
    bg: "#ede8ff",
  },
  {
    icon: "📚",
    title: "What Students Learn",
    body: "FDF teaches real-world financial and entrepreneurial skills: saving habits, product creation, brand building, and basic business operations — all through weekly missions.",
    color: "#3b82f6",
    bg: "#eff6ff",
  },
  {
    icon: "🤝",
    title: "Sponsor-Funded Model",
    body: "FDF is supported by sponsors from the Crypdawgs ecosystem. Sponsors fund the program in exchange for visibility — not access to student data.",
    color: "#f59e0b",
    bg: "#fef3c7",
  },
  {
    icon: "🎂",
    title: "Age-Gated System",
    body: "Students must be 13–17 to participate. At 18, accounts transition to the Crypdawgs Vault — a more advanced system. Under-13 access is blocked entirely.",
    color: "#5b8cff",
    bg: "#e8efff",
  },
];

const CURRICULUM = [
  { week: "Week 1–2",   topic: "Saving Fundamentals",   desc: "Building the habit of setting money aside consistently." },
  { week: "Week 3–4",   topic: "Product Creation",       desc: "Identifying a skill or product you can offer for value." },
  { week: "Week 5–6",   topic: "Brand Identity",         desc: "Creating a name, logo, and consistent visual identity." },
  { week: "Week 7–8",   topic: "Sales Basics",           desc: "How to present and sell a product or service." },
  { week: "Week 9–10",  topic: "Digital Presence",       desc: "Setting up a simple online presence for your brand." },
  { week: "Week 11–12", topic: "Business Operations",    desc: "Tracking income, expenses, and basic financial records." },
];

const FAQS = [
  {
    q: "Is FDF affiliated with any cryptocurrency platform?",
    a: "FDF is the youth education layer of the Crypdawgs ecosystem. At 18, students may choose to access the Crypdawgs Vault — but this is entirely optional and not required during the FDF program.",
  },
  {
    q: "Can I monitor my child's progress?",
    a: "Yes. Parents can request a progress report through the app. We will provide a summary of completed missions and current rank.",
  },
  {
    q: "How do I remove my child's account?",
    a: "Submit an account removal request through the app. All data will be permanently deleted within 7 business days.",
  },
  {
    q: "What are the XP and Gems used for?",
    a: "XP and Gems are internal progress metrics only. They cannot be exchanged for real money or used to make purchases. They track mission completion and unlock cosmetic rewards like badges and stickers.",
  },
  {
    q: "Is there any social or chat functionality?",
    a: "No. FDF is a solo training platform. There is no direct messaging, public profiles, or social feed. Students interact only with the mission and rewards systems.",
  },
];

export default function Parents() {
  return (
    <div className="page-container animate-fade-in">

      {/* ── Header ── */}
      <div style={{ paddingTop: 20, paddingBottom: 24 }}>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "var(--text-main)",
            letterSpacing: "-0.02em",
            marginBottom: 6,
          }}
        >
          Parent Information
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-sub)", maxWidth: 480, lineHeight: 1.6 }}>
          Everything you need to know about the Future Dawgs Foundation program before your child enrolls.
        </p>
      </div>

      {/* ── Trust Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 24,
        }}
      >
        {TRUST_ITEMS.map((item) => (
          <div
            key={item.title}
            className="academy-card"
            style={{ padding: "14px 14px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: item.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9rem",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <p
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "var(--text-main)",
                  lineHeight: 1.3,
                }}
              >
                {item.title}
              </p>
            </div>
            <p
              style={{
                fontSize: "0.72rem",
                color: "var(--text-sub)",
                lineHeight: 1.6,
              }}
            >
              {item.body}
            </p>
          </div>
        ))}
      </div>

      {/* ── Curriculum ── */}
      <div className="academy-card" style={{ marginBottom: 16 }}>
        <p
          style={{
            fontWeight: 800,
            fontSize: "0.9rem",
            color: "var(--text-main)",
            marginBottom: 4,
            letterSpacing: "-0.01em",
          }}
        >
          Curriculum Overview
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 14 }}>
          12-week rotating mission curriculum. Students progress at their own pace.
        </p>

        <div>
          {CURRICULUM.map((item, i) => (
            <div
              key={item.week}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "10px 0",
                borderBottom: i < CURRICULUM.length - 1 ? "1px solid rgba(91,140,255,0.08)" : "none",
              }}
            >
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  width: 72,
                  flexShrink: 0,
                  paddingTop: 2,
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                }}
              >
                {item.week}
              </span>
              <div>
                <p style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-main)", marginBottom: 2 }}>
                  {item.topic}
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-sub)" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="academy-card" style={{ marginBottom: 16 }}>
        <p
          style={{
            fontWeight: 800,
            fontSize: "0.9rem",
            color: "var(--text-main)",
            marginBottom: 14,
            letterSpacing: "-0.01em",
          }}
        >
          Frequently Asked Questions
        </p>

        <div>
          {FAQS.map((item, i) => (
            <div
              key={item.q}
              style={{
                padding: "12px 0",
                borderBottom: i < FAQS.length - 1 ? "1px solid rgba(91,140,255,0.08)" : "none",
              }}
            >
              <p style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-main)", marginBottom: 5 }}>
                {item.q}
              </p>
              <p style={{ fontSize: "0.775rem", color: "var(--text-sub)", lineHeight: 1.6 }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Contact ── */}
      <div
        className="academy-card"
        style={{
          background: "linear-gradient(135deg, rgba(91,140,255,0.06) 0%, rgba(123,92,255,0.06) 100%)",
          border: "1.5px solid rgba(91,140,255,0.15)",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "var(--primary-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              flexShrink: 0,
            }}
          >
            ✉️
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-main)", marginBottom: 5 }}>
              Need Help?
            </p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-sub)", lineHeight: 1.6 }}>
              For questions about your child's account, data removal requests, or program concerns,
              use the in-app support form. We respond within 1–2 business days.
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer Links ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          paddingTop: 16,
          paddingBottom: 8,
          borderTop: "1px solid rgba(91,140,255,0.1)",
        }}
      >
        {["Privacy Policy", "Terms of Use", "Child Safety Policy", "Contact"].map((link) => (
          <button
            key={link}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              cursor: "pointer",
              textDecoration: "none",
            }}
            onClick={() => {}}
          >
            {link}
          </button>
        ))}
      </div>
    </div>
  );
}
