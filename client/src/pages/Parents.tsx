import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Mail, Shield, Users } from "lucide-react";
import { Link } from "wouter";

export default function Parents() {
  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 glass-panel border-b border-white/10">
        <div className="container max-w-4xl mx-auto flex items-center justify-between py-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-secondary hover:text-primary">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-primary">Parents Information</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="container max-w-4xl mx-auto space-y-8 pt-8 relative z-10">
        
        {/* Hero Section */}
        <div className="glass-panel rounded-2xl p-8 text-left">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald/20 border border-emerald/30">
              <Shield className="h-3.5 w-3.5 text-emerald" />
              <span className="text-xs font-semibold text-emerald uppercase tracking-wide">Trusted Platform</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Parent Trust Panel</h2>
            <p className="text-lg text-secondary max-w-2xl">
              FDF is a safe, education-first environment for building real-world financial skills. 
              Designed for ages 13–17, sponsor-funded, and built with institutional-grade privacy.
            </p>
          </div>
        </div>

        {/* Trust Cards Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          
          {/* 100% Free & Safe */}
          <Card className="glass-panel p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-emerald/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald" />
              </div>
              <h3 className="text-lg font-semibold text-primary">100% Free & Safe</h3>
            </div>
            <ul className="space-y-2.5 text-sm text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-emerald mt-0.5 font-bold">✓</span>
                <span>No hidden fees or subscriptions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald mt-0.5 font-bold">✓</span>
                <span>No credit products for minors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald mt-0.5 font-bold">✓</span>
                <span>Fully sponsor-funded access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald mt-0.5 font-bold">✓</span>
                <span>No in-app purchases</span>
              </li>
            </ul>
          </Card>

          {/* What Students Learn */}
          <Card className="glass-panel p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-cyan/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-cyan" />
              </div>
              <h3 className="text-lg font-semibold text-primary">What Students Learn</h3>
            </div>
            <ul className="space-y-2.5 text-sm text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-cyan mt-0.5">•</span>
                <span>Saving & budgeting fundamentals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan mt-0.5">•</span>
                <span>Smart spending habits</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan mt-0.5">•</span>
                <span>Goal setting & tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan mt-0.5">•</span>
                <span>Intro entrepreneurship skills</span>
              </li>
            </ul>
          </Card>

          {/* Privacy First */}
          <Card className="glass-panel p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-violet/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-violet" />
              </div>
              <h3 className="text-lg font-semibold text-primary">Privacy First</h3>
            </div>
            <ul className="space-y-2.5 text-sm text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-violet mt-0.5 font-bold">✓</span>
                <span>Strict data protection standards</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet mt-0.5 font-bold">✓</span>
                <span>No public messaging between users under 18</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet mt-0.5 font-bold">✓</span>
                <span>No third-party advertising</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet mt-0.5 font-bold">✓</span>
                <span>COPPA & GDPR compliant</span>
              </li>
            </ul>
          </Card>

          {/* Sponsor Funded */}
          <Card className="glass-panel p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-amber/20 flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-lg font-semibold text-primary">Sponsor Funded</h3>
            </div>
            <p className="text-sm text-secondary leading-relaxed">
              Our partners cover all platform costs so every student can access financial education tools, 
              regardless of family income. No student is ever charged.
            </p>
          </Card>
        </div>

        {/* Contact Section */}
        <Card className="glass-panel p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-violet to-cyan flex items-center justify-center shrink-0">
              <Mail className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-primary mb-2">Need Help?</h3>
              <p className="text-secondary mb-4">
                Our team is here to answer any questions about FDF, safety protocols, or curriculum.
              </p>
              <a href="mailto:admin@crypdawgs.com">
                <Button className="bg-violet hover:bg-violet/90 text-white font-semibold h-12 px-8 rounded-lg transition-all">
                  Email Support Team
                </Button>
              </a>
              <p className="text-sm text-tertiary mt-3">admin@crypdawgs.com</p>
            </div>
          </div>
        </Card>

        {/* Footer Links */}
        <div className="flex justify-center gap-6 text-sm text-tertiary pb-8">
          <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
          <span>•</span>
          <a href="#" className="hover:text-secondary transition-colors">Safety Guidelines</a>
        </div>
      </div>
    </div>
  );
}
