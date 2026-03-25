import {
  BookOpen,
  ChevronRight,
  ExternalLink,
  Lock,
  Mail,
  Shield,
  Users,
  Zap,
} from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Shield,
    title: "100% Free for Students",
    body: "FDF is entirely free for ages 13–17. No in-app purchases, no subscriptions, no hidden fees. The program is funded by sponsors who believe in youth financial education.",
    color: "oklch(0.68_0.16_150)",
  },
  {
    icon: Lock,
    title: "Privacy First",
    body: "We collect only a first name and date of birth during onboarding. No last names, phone numbers, or addresses. We never sell or share student data with third parties.",
    color: "oklch(0.65_0.18_270)",
  },
  {
    icon: BookOpen,
    title: "What Students Learn",
    body: "FDF teaches real-world financial and entrepreneurial skills: saving habits, product creation, brand building, and basic business operations — all through weekly missions.",
    color: "oklch(0.70_0.15_200)",
  },
  {
    icon: Users,
    title: "Sponsor-Funded Model",
    body: "FDF is supported by sponsors from the Crypdawgs ecosystem. Sponsors fund the program in exchange for visibility — not access to student data.",
    color: "oklch(0.78_0.14_85)",
  },
  {
    icon: Zap,
    title: "Age-Gated System",
    body: "Students must be 13–17 to participate. At 18, accounts transition to the Crypdawgs Vault — a more advanced system. Under-13 access is blocked entirely.",
    color: "oklch(0.72_0.16_270)",
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

export default function Parents() {
  return (
    <div className="container py-8 space-y-8 animate-fade-in">

      {/* ── Page Header ── */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[oklch(0.50_0.04_280)] text-[11px] font-mono uppercase tracking-widest mb-2">
          <Users size={11} />
          <span>FDF</span>
          <ChevronRight size={10} />
          <span className="text-[oklch(0.70_0.08_280)]">Parent Information</span>
        </div>
        <h1 className="text-white">Parent Information</h1>
        <p className="text-[oklch(0.55_0.04_280)] text-sm max-w-xl">
          Everything you need to know about the Future Dawgs Foundation program before your child enrolls.
        </p>
      </div>

      {/* ── Trust Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TRUST_ITEMS.map((item) => (
          <div key={item.title} className="panel-sm space-y-2">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                style={{
                  background: `${item.color}18`,
                  border: `1px solid ${item.color}35`,
                }}
              >
                <item.icon size={14} style={{ color: item.color }} />
              </div>
              <h3 className="text-sm font-600 text-white">{item.title}</h3>
            </div>
            <p className="text-[11px] text-[oklch(0.50_0.04_280)] leading-relaxed pl-9">
              {item.body}
            </p>
          </div>
        ))}
      </div>

      {/* ── Curriculum Overview ── */}
      <div className="panel">
        <h2 className="text-sm font-display font-700 text-white uppercase tracking-widest mb-1">
          Curriculum Overview
        </h2>
        <p className="text-[11px] text-[oklch(0.45_0.04_280)] mb-5">
          12-week rotating mission curriculum. Students progress at their own pace.
        </p>

        <div className="space-y-0 divide-y divide-[oklch(0.25_0.03_280/0.4)]">
          {CURRICULUM.map((item) => (
            <div key={item.week} className="flex items-start gap-4 py-3 first:pt-0 last:pb-0">
              <span className="text-[10px] font-mono text-[oklch(0.40_0.04_280)] w-20 shrink-0 pt-0.5">
                {item.week}
              </span>
              <div>
                <span className="text-xs font-600 text-white block mb-0.5">{item.topic}</span>
                <span className="text-[11px] text-[oklch(0.50_0.04_280)]">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="panel">
        <h2 className="text-sm font-display font-700 text-white uppercase tracking-widest mb-5">
          Frequently Asked Questions
        </h2>

        <div className="space-y-0 divide-y divide-[oklch(0.25_0.03_280/0.4)]">
          {[
            {
              q: "Is FDF affiliated with any cryptocurrency platform?",
              a: "FDF is the youth education layer of the Crypdawgs ecosystem. At 18, students may choose to access the Crypdawgs Vault — but this is entirely optional and not required during the FDF program.",
            },
            {
              q: "Can I monitor my child's progress?",
              a: "Yes. Parents can request a progress report by emailing admin@crypdawgs.com with their child's registered first name. We will provide a summary of completed missions and current rank.",
            },
            {
              q: "How do I remove my child's account?",
              a: "Email admin@crypdawgs.com with the subject line 'Account Removal Request' and your child's registered first name. All data will be permanently deleted within 7 business days.",
            },
            {
              q: "What are the XP and Gems used for?",
              a: "XP and Gems are internal progress metrics only. They cannot be exchanged for real money or used to make purchases. They track mission completion and unlock cosmetic rewards like badges and stickers.",
            },
            {
              q: "Is there any social or chat functionality?",
              a: "No. FDF is a solo training platform. There is no direct messaging, public profiles, or social feed. Students interact only with the mission and rewards systems.",
            },
          ].map((item) => (
            <div key={item.q} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
              <h3 className="text-xs font-600 text-white">{item.q}</h3>
              <p className="text-[11px] text-[oklch(0.50_0.04_280)] leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Contact ── */}
      <div className="panel-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-[oklch(0.65_0.18_270/0.15)] border border-[oklch(0.65_0.18_270/0.25)] flex items-center justify-center shrink-0">
          <Mail size={18} className="text-[oklch(0.65_0.18_270)]" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-600 text-white mb-1">Need Help?</h3>
          <p className="text-[11px] text-[oklch(0.50_0.04_280)] leading-relaxed mb-3">
            For questions about your child's account, data removal requests, or program concerns,
            contact us directly. We respond within 1–2 business days.
          </p>
          <a
            href="mailto:admin@crypdawgs.com"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[oklch(0.65_0.18_270)] hover:text-[oklch(0.72_0.16_270)] transition-colors"
          >
            admin@crypdawgs.com
            <ExternalLink size={10} />
          </a>
        </div>
      </div>

      {/* ── Footer Links ── */}
      <div className="flex flex-wrap gap-4 pt-2 border-t border-[oklch(0.22_0.03_280/0.5)]">
        {["Privacy Policy", "Terms of Use", "Child Safety Policy", "Contact"].map((link) => (
          <button
            key={link}
            className="text-[11px] font-mono text-[oklch(0.40_0.04_280)] hover:text-[oklch(0.60_0.06_280)] transition-colors"
            onClick={() => {
              if (link === "Contact") window.location.href = "mailto:admin@crypdawgs.com";
            }}
          >
            {link}
          </button>
        ))}
      </div>
    </div>
  );
}
