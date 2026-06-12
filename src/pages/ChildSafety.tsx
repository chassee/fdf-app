import { Link } from "wouter";
import { ChevronLeft, Shield } from "lucide-react";

export default function ChildSafety() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold">
              <ChevronLeft size={20} />
              Back
            </button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Child Safety Policy</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Child Safety Policy</h2>
          <p className="text-gray-600 mb-6">Last updated: April 2026</p>

          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <Shield className="text-green-600" size={24} />
            <p className="text-green-700 font-semibold">
              Future Dawgs Foundation is designed with child safety as our top priority.
            </p>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. No Social Features</h3>
          <p className="text-gray-700 mb-6">
            FDF does NOT include chat, messaging, or social networking features. Users cannot communicate with each other through the platform, eliminating risks of inappropriate contact or cyberbullying.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. No Public Profiles</h3>
          <p className="text-gray-700 mb-6">
            User profiles are private and not visible to other users. Personal information is never shared or displayed publicly.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Age Verification</h3>
          <p className="text-gray-700 mb-6">
            We verify that users are between 13-17 years old. Users under 13 are blocked from accessing the platform.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Minimal Data Collection</h3>
          <p className="text-gray-700 mb-6">
            We collect only essential information: email, date of birth, and username. We do not collect location data, device information, or browsing history.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. No Third-Party Tracking</h3>
          <p className="text-gray-700 mb-6">
            We do not use third-party trackers, advertisers, or analytics that could compromise user privacy.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Reporting Concerns</h3>
          <p className="text-gray-700 mb-6">
            If you have concerns about child safety or suspect inappropriate activity, please contact us immediately at: <strong>admin@crypdawgs.com</strong>
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Parental Involvement</h3>
          <p className="text-gray-700 mb-6">
            We encourage parents to be involved in their child's learning journey. Visit our <Link href="/parents"><span className="text-blue-600 hover:underline">Parent Information</span></Link> page for more details.
          </p>
        </div>
      </div>
    </div>
  );
}
