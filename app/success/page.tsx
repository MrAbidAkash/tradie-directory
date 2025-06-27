// app/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const params = useSearchParams();
  const listingId = params.get("listingId");
  const [validationStatus, setValidationStatus] = useState("pending");
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    if (listingId) {
      // Check validation status
      const checkValidation = async () => {
        try {
          const response = await fetch(
            `/api/listings/${listingId}/validation-status`,
          );
          const data = await response.json();

          setValidationStatus(data.status);
          setValidationMessage(data.message);
        } catch (error) {
          setValidationStatus("error");
          setValidationMessage("Failed to check validation status");
        }
      };

      checkValidation();
    }
  }, [listingId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>

          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Listing Submitted Successfully!
          </h2>

          <p className="mt-2 text-gray-600">
            Your business listing is under review. We'll notify you once it's
            approved.
          </p>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Verification Status</h3>

            {validationStatus === "pending" && (
              <div className="mt-2 flex items-center text-yellow-600">
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Verification in progress</span>
              </div>
            )}

            {validationStatus === "approved" && (
              <div className="mt-2 flex items-center text-green-600">
                <svg
                  className="h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Credentials verified</span>
              </div>
            )}

            {validationStatus === "needs_review" && (
              <div className="mt-2 text-yellow-600">
                <p>Manual review required: {validationMessage}</p>
                <p className="mt-2 text-sm">
                  Our team will contact you if we need additional information.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <a
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
