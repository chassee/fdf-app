import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

/**
 * Parent Approval Form
 * Collects parent information and sends approval email
 */
export default function ParentApprovalForm() {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    parentName: "",
    parentEmail: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestApprovalMutation = trpc.parentApproval.requestApproval.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setError(null);
    },
    onError: (err) => {
      setError(err.message || "Failed to send approval email. Please try again.");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="max-w-md w-full p-8 bg-white/80 backdrop-blur">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Parent Approval Required</h1>
          <p className="text-gray-600 mb-6">
            Please sign in to request parent approval for Future Dawgs Foundation.
          </p>
          <Button className="w-full">Sign In</Button>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="max-w-md w-full p-8 bg-white/80 backdrop-blur text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Sent!</h1>
          <p className="text-gray-600 mb-6">
            We've sent an approval email to <strong>{formData.parentEmail}</strong>. Your parent has 7 days to approve your participation.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Once approved, you'll be able to access all FDF features and start your journey.
          </p>
          <Button
            onClick={() => {
              setSubmitted(false);
              setFormData({ parentName: "", parentEmail: "" });
            }}
            className="w-full"
          >
            Send Another Email
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="max-w-md w-full p-8 bg-white/80 backdrop-blur">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Parent Approval</h1>
        <p className="text-gray-600 mb-6">
          To get started with Future Dawgs Foundation, we need your parent's approval. This ensures safety and transparency.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!user?.id) return;

            requestApprovalMutation.mutate({
              accessToken: user.id.toString(),
              studentName: user.name || "Student",
              parentName: formData.parentName,
              parentEmail: formData.parentEmail,
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent's Full Name
            </label>
            <Input
              type="text"
              placeholder="e.g., John Smith"
              value={formData.parentName}
              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              required
              disabled={requestApprovalMutation.isPending}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent's Email Address
            </label>
            <Input
              type="email"
              placeholder="parent@example.com"
              value={formData.parentEmail}
              onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
              required
              disabled={requestApprovalMutation.isPending}
              className="w-full"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={requestApprovalMutation.isPending || !formData.parentName || !formData.parentEmail}
            className="w-full"
          >
            {requestApprovalMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Approval Request"
            )}
          </Button>
        </form>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Your parent will receive an email with a secure approval link. The link expires in 7 days.
        </p>
      </Card>
    </div>
  );
}
