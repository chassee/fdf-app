
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Clock, Mail, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  'https://jkrwyotrdlucyynnotpd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprcnd5b3RyZGx1Y3l5bm5vdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjM0NzUsImV4cCI6MjA2Njg5OTQ3NX0.NaGZ56xkvIIHj7XjeZbPTg6wHtkvihycvNa4Kzb51FQ',
  { auth: { persistSession: false } }
);

export default function ApprovalPending() {
  const [, navigate] = useLocation();
  const [profile, setProfile] = useState<any>(null);
  const [checking, setChecking] = useState(false);
  const [authUser, setAuthUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }
      setAuthUser(user);

      const { data } = await supabase
        .from("fdf_users")
        .select("*")
        .eq("auth_user_id", user.id)
        .single();

      if (data) {
        setProfile(data);
        if (data.approval_status === "approved") {
          navigate("/");
        }
      }
    };

    getUser();
  }, [navigate]);

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      const { data } = await supabase
        .from("fdf_users")
        .select("approval_status")
        .eq("auth_user_id", authUser?.id)
        .single();

      if (data?.approval_status === "approved") {
        navigate("/");
      }
    } finally {
      setChecking(false);
    }
  };

  if (!profile) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="text-yellow-600" size={40} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Approval in Progress</h1>
          <p className="text-gray-600 text-center">
            Your application is under review. Full access will unlock once your parent or guardian approves your enrollment.
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Status</span>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
              PENDING REVIEW
            </span>
          </div>

          <div className="space-y-3 border-t pt-4">
            <div className="flex items-start gap-3">
              <Shield className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Parent / Guardian</p>
                <p className="font-semibold text-gray-900">{profile.parent_name || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Notification Sent To</p>
                <p className="font-semibold text-gray-900">{profile.parent_email || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="font-semibold text-gray-900">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-blue-50 border-blue-200">
          <h2 className="font-bold text-gray-900 mb-4">WHAT HAPPENS NEXT</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <p className="text-sm text-gray-700">Your parent receives an approval notification</p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <p className="text-sm text-gray-700">They review and confirm your enrollment</p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <p className="text-sm text-gray-700">Your account unlocks automatically</p>
            </div>
          </div>
        </Card>

        <Button
          onClick={handleCheckStatus}
          disabled={checking}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
        >
          <CheckCircle size={20} />
          {checking ? "Checking..." : "Check Approval Status"}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Questions? Contact us at{" "}
          <a href="mailto:admin@crypdawgs.com" className="text-blue-600 font-semibold hover:underline">
            admin@crypdawgs.com
          </a>
        </p>
      </div>
    </div>
  );
}
