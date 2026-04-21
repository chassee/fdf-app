import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold">
              <ChevronLeft size={20} />
              Back
            </button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Privacy Policy</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
          <p className="text-gray-600 mb-6">Last updated: April 2026</p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Data We Collect</h3>
          <p className="text-gray-700 mb-4">
            Future Dawgs Foundation collects minimal personal information:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Email address (for account creation)</li>
            <li>Date of birth (for age verification)</li>
            <li>Username (for profile identification)</li>
            <li>Activity data (missions completed, XP earned)</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Data</h3>
          <p className="text-gray-700 mb-4">
            We use your data only to:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Verify your age (13-17 years old)</li>
            <li>Provide the FDF learning experience</li>
            <li>Track your progress and achievements</li>
            <li>Send important account notifications</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Data Storage</h3>
          <p className="text-gray-700 mb-6">
            Your data is stored securely using Supabase, a trusted backend-as-a-service provider. All data is encrypted in transit and at rest.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Data Sharing</h3>
          <p className="text-gray-700 mb-6">
            We do NOT share, sell, or rent your personal information to third parties. Your data is yours alone.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Your Rights</h3>
          <p className="text-gray-700 mb-4">
            You have the right to:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Access your personal data</li>
            <li>Request deletion of your account and data</li>
            <li>Opt out of non-essential communications</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Contact Us</h3>
          <p className="text-gray-700 mb-6">
            For privacy concerns or data requests, contact us at: <strong>admin@crypdawgs.com</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
