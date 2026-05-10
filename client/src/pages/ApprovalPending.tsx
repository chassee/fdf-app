import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

/**
 * Approval Pending Screen
 * Shows approval status and polls for updates
 * Automatically redirects when approved
 */
export default function ApprovalPending() {
  const { user, isAuthenticated } = useAuth();
  const [pollCount, setPollCount] = useState(0);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const statusQuery = trpc.parentApproval.checkStatus.useQuery(
    { accessToken: user?.id.toString() || "" },
    {
      enabled: isAuthenticated && !!user?.id,
      refetchInterval: 5000, // Poll every 5 seconds
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (statusQuery.data?.status === "approved") {
      // Approved! Redirect to home or dashboard
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
  }, [statusQuery.data?.status]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="max-w-md w-full p-8 bg-white/80 backdrop-blur">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600">Please sign in to check your approval status.</p>
        </Card>
      </div>
    );
  }

  const status = statusQuery.data?.status || "pending";
  const parentEmail = statusQuery.data?.parentEmail || "your parent";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="max-w-md w-full p-8 bg-white/80 backdrop-blur">
        {status === "approved" ? (
          <>
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 animate-pulse">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Approved! 🎉</h1>
            <p className="text-gray-600 text-center mb-6">
              Your parent has approved your participation. Welcome to Future Dawgs Foundation!
            </p>
            <p className="text-sm text-gray-500 text-center">
              Redirecting to your dashboard...
            </p>
          </>
        ) : status === "denied" ? (
          <>
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Request Denied</h1>
            <p className="text-gray-600 text-center mb-6">
              Your parent has declined the approval request. Please contact them to discuss.
            </p>
            <Button className="w-full" onClick={() => window.location.href = "/"}>
              Back to Home
            </Button>
          </>
        ) : (
          <>
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Waiting for Approval</h1>
            <p className="text-gray-600 text-center mb-6">
              We sent an approval email to <strong>{parentEmail}</strong>. We're checking for updates...
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900">
                <strong>What happens next?</strong>
              </p>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>✓ Your parent receives an email with an approval link</li>
                <li>✓ They click the link to approve</li>
                <li>✓ You're automatically notified and can start learning</li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500 mb-4">
                Last checked: {lastChecked ? lastChecked.toLocaleTimeString() : "checking..."}
              </p>
              <Button
                onClick={() => {
                  statusQuery.refetch();
                  setLastChecked(new Date());
                  setPollCount(pollCount + 1);
                }}
                variant="outline"
                className="w-full"
                disabled={statusQuery.isLoading}
              >
                {statusQuery.isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Check Now"
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-400 mt-4 text-center">
              Auto-checking every 5 seconds (checked {pollCount} times)
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
