import { Link } from "wouter";
import { ChevronLeft, Mail, MessageSquare } from "lucide-react";

export default function Contact() {
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
          <h1 className="text-xl font-bold text-gray-900">Contact Us</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-8">
            Have questions, feedback, or concerns? We'd love to hear from you.
          </p>

          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Mail className="text-blue-600" size={32} />
              <div>
                <h3 className="text-xl font-bold text-gray-900">Email Support</h3>
                <p className="text-gray-600">
                  Send us an email anytime. We'll respond within 24-48 hours.
                </p>
              </div>
            </div>
            <a
              href="mailto:admin@crypdawgs.com"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              admin@crypdawgs.com
            </a>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Common Questions</h3>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">How do I delete my account?</h4>
              <p className="text-gray-700">
                Email us at admin@crypdawgs.com with your request. We'll process account deletions within 7 business days.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">I forgot my password. What do I do?</h4>
              <p className="text-gray-700">
                Use the "Forgot Password" link on the sign-in page. You'll receive an email with instructions to reset your password.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">Is my data safe?</h4>
              <p className="text-gray-700">
                Yes. We use industry-standard encryption and secure storage through Supabase. We never sell or share your data with third parties.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">Can I report inappropriate content?</h4>
              <p className="text-gray-700">
                Absolutely. Please email us immediately at admin@crypdawgs.com with details. We take all reports seriously.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-12 mb-4">Other Resources</h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              <Link href="/privacy">
                <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span>
              </Link>
            </li>
            <li>
              <Link href="/terms">
                <span className="text-blue-600 hover:underline cursor-pointer">Terms of Use</span>
              </Link>
            </li>
            <li>
              <Link href="/child-safety">
                <span className="text-blue-600 hover:underline cursor-pointer">Child Safety Policy</span>
              </Link>
            </li>
            <li>
              <Link href="/parents">
                <span className="text-blue-600 hover:underline cursor-pointer">Parent Information</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
