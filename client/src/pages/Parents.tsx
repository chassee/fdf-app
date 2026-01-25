import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Mail, Shield, Users } from "lucide-react";
import { Link } from "wouter";

export default function Parents() {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 glass-panel border-b border-white/10">
        <div className="container max-w-2xl mx-auto flex items-center justify-between py-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="font-display text-xl text-gray-900">Parents Info</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="container max-w-2xl mx-auto space-y-8 pt-8">
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <h2 className="font-display text-3xl text-gray-900">Parent Trust Panel</h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            FDF is a safe, education-first environment for building real-world skills.
          </p>
        </div>

        {/* Trust Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* 100% Free & Safe */}
          <Card className="glass-panel p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-display text-lg text-gray-900">100% Free & Safe</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>No hidden fees</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>No credit products for minors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Sponsor-funded access</span>
              </li>
            </ul>
          </Card>

          {/* What Students Learn */}
          <Card className="glass-panel p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-display text-lg text-gray-900">What Students Learn</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Saving & budgeting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Smart spending habits</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Goal setting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Intro entrepreneurship skills</span>
              </li>
            </ul>
          </Card>

          {/* Privacy First */}
          <Card className="glass-panel p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-display text-lg text-gray-900">Privacy First</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>Strict data protection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>No public messaging between users under 18</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>No ads</span>
              </li>
            </ul>
          </Card>

          {/* Sponsor Funded */}
          <Card className="glass-panel p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-display text-lg text-gray-900">Sponsor Funded</h3>
            </div>
            <p className="text-sm text-gray-600">
              Partners cover costs so every student can access tools.
            </p>
          </Card>
        </div>

        {/* Need Help Section */}
        <Card className="glass-panel p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-display text-2xl text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              Our team is here to answer any questions you have about FDF.
            </p>
            <a href="mailto:admin@crypdawgs.com">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl h-12 px-8">
                Email Support
              </Button>
            </a>
            <p className="text-sm text-gray-500 mt-3">admin@crypdawgs.com</p>
          </div>
        </Card>

        {/* Footer Links */}
        <div className="flex justify-center gap-6 text-sm text-gray-500 pb-8">
          <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-700 transition-colors">Terms</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-700 transition-colors">Safety</a>
        </div>
      </div>
    </div>
  );
}
