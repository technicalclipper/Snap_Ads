"use client";

import { VerificationLevel, IDKitWidget, useIDKit } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import { Card } from "@/app/components/Card";

interface WorldIDVerificationProps {
  onVerificationSuccess: () => void;
}

export default function WorldIDVerification({
  onVerificationSuccess,
}: WorldIDVerificationProps) {
  const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
  const action = process.env.NEXT_PUBLIC_WLD_ACTION;

  if (!app_id) {
    throw new Error("app_id is not set in environment variables!");
  }
  if (!action) {
    throw new Error("action is not set in environment variables!");
  }

  const { setOpen } = useIDKit();

  const onSuccess = (result: ISuccessResult) => {
    onVerificationSuccess();
  };

  const handleProof = async (result: ISuccessResult) => {
    try {
      const response = await fetch("/api/verify-worldcoin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Verification successful");
        return true;
      } else {
        throw new Error(data.detail || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      throw error;
    }
  };

  return (
    <Card className="max-w-md mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Verify Your Identity</h2>
      <p className="text-gray-600 mb-6">
        To watch ads and earn rewards, you need to verify your identity with
        World ID. This ensures one person can only watch an ad once.
      </p>

      <div className="space-y-4">
        <IDKitWidget
          action={action}
          app_id={app_id}
          onSuccess={onSuccess}
          handleVerify={handleProof}
          verification_level={VerificationLevel.Device}
        >
          {({ open }) => (
            <button
              onClick={open}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Verify with World ID
            </button>
          )}
        </IDKitWidget>
      </div>
    </Card>
  );
}
