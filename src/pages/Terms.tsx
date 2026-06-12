import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

export default function Terms() {
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
          <h1 className="text-xl font-bold text-gray-900">Terms of Use</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms of Use</h2>
          <p className="text-gray-600 mb-6">Last updated: April 2026</p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Age Requirements</h3>
          <p className="text-gray-700 mb-6">
            Future Dawgs Foundation is designed for users aged 13-17. By creating an account, you confirm you meet this age requirement. Users under 13 are not permitted to use FDF.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Account Responsibility</h3>
          <p className="text-gray-700 mb-6">
            You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized access or use of your account.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Acceptable Use</h3>
          <p className="text-gray-700 mb-4">
            You agree not to:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Engage in harassment, bullying, or abusive behavior</li>
            <li>Share inappropriate or illegal content</li>
            <li>Attempt to hack or compromise the platform</li>
            <li>Impersonate other users or create fake accounts</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Content Ownership</h3>
          <p className="text-gray-700 mb-6">
            All content, materials, and intellectual property on FDF are owned by Future Dawgs Foundation or our partners. You may not reproduce or distribute without permission.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Disclaimer</h3>
          <p className="text-gray-700 mb-6">
            FDF is provided "as-is" without warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Termination</h3>
          <p className="text-gray-700 mb-6">
            We reserve the right to terminate accounts that violate these terms or engage in harmful behavior.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Contact</h3>
          <p className="text-gray-700 mb-6">
            For questions about these terms, contact: <strong>admin@crypdawgs.com</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
