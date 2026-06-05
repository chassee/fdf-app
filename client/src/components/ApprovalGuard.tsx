import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useFDF } from "@/contexts/FDFContext";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

/**
 * ApprovalGuard Component
 * Enforces parent approval requirement before accessing FDF
 * - Redirects unapproved users to approval form
 * - Auto-unlocks when approval is detected
 * - Shows loading state while checking status
 */
export function ApprovalGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { isLoading: isFDFLoading } = useFDF();
  const [location, navigate] = useLocation();
  const [approvalStatus, setApprovalStatus] = useState<"pending" | "approved" | "denied" | "not_requested" | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Admin bypass: admin@crypdawgs.com has full access
  const isAdmin = user?.email === "admin@crypdawgs.com";

  // Query approval status
  const statusQuery = trpc.parentApproval.checkStatus.useQuery(
    { accessToken: user?.id.toString() || "" },
    {
      enabled: isAuthenticated && !!user?.id,
      refetchInterval: 5000, // Poll every 5 seconds for approval updates
      refetchOnWindowFocus: false,
    }
  );

  // Update approval status when query completes
  useEffect(() => {
    if (statusQuery.data?.status) {
      setApprovalStatus(statusQuery.data.status);
      setIsLoading(false);
    } else if (statusQuery.isError) {
      setApprovalStatus(null);
      setIsLoading(false);
    }
  }, [statusQuery.data?.status, statusQuery.isError]);

  // Routes that don't require approval
  const APPROVAL_EXEMPT_ROUTES = [
    "/approval-form",
    "/approval-pending",
    "/approval-success",
    "/signup",
    "/signin",
    "/parents",
    "/onboarding/dob",
    "/onboarding/username",
  ];

  // If not authenticated, allow normal routing
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Admin bypass: skip all approval checks for admin@crypdawgs.com
  if (isAdmin) {
    return <>{children}</>;
  }

  // Still loading approval status (skip for admin)
  if (!isAdmin && (isLoading || isFDFLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="max-w-md w-full p-8 bg-white/80 backdrop-blur text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading</h1>
          <p className="text-gray-600">Checking your approval status...</p>
        </Card>
      </div>
    );
  }

  // If on an approval-exempt route, allow access
  if (APPROVAL_EXEMPT_ROUTES.some((route) => location.startsWith(route))) {
    return <>{children}</>;
  }

  // If approved, allow full access
  if (approvalStatus === "approved") {
    return <>{children}</>;
  }

  // If denied, show denial screen
  if (approvalStatus === "denied") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
        <Card className="max-w-md w-full p-8 bg-white/80 backdrop-blur text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            Your parent has not approved your participation in Future Dawgs Foundation. Please contact them to discuss.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
          >
            Back to Home
          </button>
        </Card>
      </div>
    );
  }

  // If pending or not requested, redirect to approval form
  if (approvalStatus === "pending" || approvalStatus === "not_requested") {
    navigate("/approval-form");
    return null;
  }

  // Fallback: redirect to approval form
  navigate("/approval-form");
  return null;
}
