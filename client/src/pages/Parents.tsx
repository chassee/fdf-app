import { Card } from "@/components/ui/card";
import { Shield, BookOpen, Lock, Heart } from "lucide-react";

export default function Parents() {
  return (
    <div className="space-y-8 pb-8">
      <div className="text-center space-y-4 pt-8">
        <h1 className="text-3xl font-display text-white">Parents Info</h1>
        <p className="text-gray-300 text-lg max-w-md mx-auto">
          FDF is a safe, education-first environment for building real-world skills.
        </p>
      </div>

      <div className="grid gap-4">
        {[
          { 
            icon: Shield, 
            title: "100% Free & Safe", 
            desc: "No hidden fees, no credit products for minors. FDF is fully sponsor-funded.",
            color: "text-neon-lime"
          },
          { 
            icon: BookOpen, 
            title: "Financial Education", 
            desc: "Missions focus on saving, budgeting, and basic entrepreneurship skills.",
            color: "text-neon-cyan"
          },
          { 
            icon: Lock, 
            title: "Privacy First", 
            desc: "Strict data protection. No public messaging between users under 18.",
            color: "text-neon-pink"
          },
          { 
            icon: Heart, 
            title: "Sponsor Funded", 
            desc: "Our partners cover all costs so every kid has access to these tools.",
            color: "text-orange-400"
          },
        ].map((item) => (
          <Card key={item.title} className="glass-panel p-6 border-white/10">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${item.color}`}>
                <item.icon size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 text-center space-y-4">
        <h3 className="text-white font-bold text-xl">Have Questions?</h3>
        <p className="text-gray-300 text-sm">
          Our team is dedicated to providing a safe learning environment. Contact us anytime.
        </p>
        <a href="mailto:parents@crypdawgs.com" className="inline-block text-neon-cyan font-bold hover:underline">
          parents@crypdawgs.com
        </a>
      </div>
    </div>
  );
}
