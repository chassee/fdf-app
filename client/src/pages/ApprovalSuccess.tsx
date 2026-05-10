import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * Approval Success Page
 * Shown after parent clicks approval link
 * Displays success message and redirects to dashboard
 */
export default function ApprovalSuccess() {
  const [, setLocation] = useLocation();
  const [studentName, setStudentName] = useState("Student");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Get student name from URL params
    const params = new URLSearchParams(window.location.search);
    const name = params.get("studentName");
    if (name) {
      setStudentName(decodeURIComponent(name));
    }
  }, []);

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      setLocation("/");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="max-w-md w-full p-8 bg-white/80 backdrop-blur text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Approved! 🎉</h1>
        <p className="text-lg text-gray-600 mb-6">
          {studentName} is all set to join Future Dawgs Foundation!
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-900 font-medium mb-2">What's next?</p>
          <ul className="text-sm text-green-800 space-y-2">
            <li>✓ Complete your profile</li>
            <li>✓ Choose your Dawg Class</li>
            <li>✓ Start your first mission</li>
            <li>✓ Build real financial skills</li>
          </ul>
        </div>

        <p className="text-gray-600 mb-6">
          Redirecting to dashboard in <strong>{countdown}</strong> seconds...
        </p>

        <Button
          onClick={() => setLocation("/")}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Go to Dashboard Now
        </Button>

        <p className="text-xs text-gray-500 mt-4">
          Welcome to the Future Dawgs Foundation family! 🐕
        </p>
      </Card>
    </div>
  );
}
