import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  'https://jkrwyotrdlucyynnotpd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprcnd5b3RyZGx1Y3l5bm5vdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjM0NzUsImV4cCI6MjA2Njg5OTQ3NX0.NaGZ56xkvIIHj7XjeZbPTg6wHtkvihycvNa4Kzb51FQ',
  { auth: { persistSession: false } }
);

export default function Approve() {
  const [searchParams] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    const processApproval = async () => {
      try {
        const token = new URLSearchParams(window.location.search).get("token");

        if (!token) {
          setStatus("error");
          return;
        }

        // Find user by approval token
        const { data: user, error: findError } = await supabase
          .from("fdf_users")
          .select("username")
          .eq("approval_token", token)
          .single();

        if (findError || !user) {
          setStatus("error");
          return;
        }

        setStudentName(user.username || "Student");

        // Update approval status
        const { error: updateError } = await supabase
          .from("fdf_users")
          .update({
            approval_status: "approved",
            approved_at: new Date().toISOString(),
          })
          .eq("approval_token", token);

        if (updateError) {
          setStatus("error");
          return;
        }

        setStatus("success");
      } catch (error) {
        console.error("Approval error:", error);
        setStatus("error");
      }
    };

    processApproval();
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing approval...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600" size={48} />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Enrollment Approved!</h1>
            <p className="text-gray-600">
              {studentName}'s account is now active and ready to use.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              ✓ Parent approval confirmed<br/>
              ✓ Account unlocked<br/>
              ✓ Ready to start learning
            </p>
          </div>

          <a
            href="https://fdf.crypdawgs.com"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg"
          >
            Go to Dashboard
          </a>

          <p className="text-sm text-gray-600">
            This approval has been recorded and cannot be undone.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="text-red-600" size={48} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Invalid Approval Link</h1>
          <p className="text-gray-600">
            The approval link is invalid or has already been used.
          </p>
        </div>

        <a
          href="https://fdf.crypdawgs.com"
          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}
