// components/ProfileCompleteAlert.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle } from "lucide-react";

export function ProfileCompleteAlert({ userId }: { userId: string }) {
  const [completion, setCompletion] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const calculateCompletion = async () => {
      // Mock calculation - in real app, fetch from API
      const profileData = await fetch(`/api/profile-status?userId=${userId}`);
      const { completionPercentage } = await profileData.json();

      setCompletion(completionPercentage);
      setShowAlert(completionPercentage < 90);
    };

    calculateCompletion();
  }, [userId]);

  if (!showAlert) return null;

  return (
    <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-yellow-900 mb-2">
            Complete Your Business Profile
          </h3>

          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Profile completion</span>
              <span>{completion}%</span>
            </div>
            <Progress value={completion} className="h-2" />
          </div>

          <p className="text-yellow-700 text-sm mb-3">
            {completion < 50
              ? "Your profile is mostly incomplete. Finish setting up to start receiving jobs."
              : "You're almost there! Complete your profile to unlock all features."}
          </p>

          <Button
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-700"
            onClick={() =>
              (window.location.href = "/dashboard/profile")
            }
          >
            Complete Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
