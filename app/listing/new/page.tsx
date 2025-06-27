"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BasicInfoStep } from "@/components/onboarding/basic-info-step";
import { PreferencesStep } from "@/components/onboarding/preferences-step";
import { CredentialsStep } from "@/components/onboarding/credentials-step";
import { useRouter, useSearchParams } from "next/navigation";

const steps = [
  { id: 1, title: "Basic Info", description: "Name, ABN, and contact details" },
  { id: 2, title: "Preferences", description: "Job types, regions, and hours" },
  {
    id: 3,
    title: "Credentials",
    description: "Licenses and insurances (optional)",
  },
];

export default function NewListingPage() {
  const router = useRouter();
  const params = useSearchParams();
  const contactId = params.get("contactId");

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    // Basic Info
    businessName: "",
    abn: "",
    businessPhone: "",
    businessEmail: "",
    description: "",
    // Preferences
    services: [] as string[],
    regions: [] as string[],
    operatingHours: "",
    jobPreferences: {
      residential: 5,
      commercial: 5,
      emergency: 5,
      maintenance: 5,
    },
    // Credentials
    licenses: [] as string[],
    insurances: [] as string[],
    certifications: [] as string[],
    files: [] as File[],
  });

  const progress = (currentStep / steps.length) * 100;

  useEffect(() => {
    // Only initialize form with GHL if contactId exists
    if (contactId) {
      const initForm = async () => {
        try {
          await fetch("/api/form-start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contactId }),
          });
        } catch (error) {
          console.error("Failed to initialize form:", error);
        }
      };
      initForm();
    }
  }, [contactId]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const uploadFiles = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        return result.urls;
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
    return [];
  };
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // 1. Upload files first if any
      let uploadedFileUrls: string[] = [];
      if (formData.files.length > 0) {
        uploadedFileUrls = await uploadFiles(formData.files);
      }

      // 2. Prepare listing data
      const listingData = {
        name: formData.businessName,
        service: formData.services.join(", "),
        region: formData.regions.join(", "),
        phone: formData.businessPhone,
        email: formData.businessEmail,
        abn: formData.abn,
        description: formData.description,
        operatingHours: formData.operatingHours,
        serviceAreas: formData.regions,
        credentials: [
          ...formData.licenses,
          ...formData.insurances,
          ...formData.certifications,
          ...uploadedFileUrls,
        ],
        jobPreferences: formData.jobPreferences,
        // Add contactId if available
        ...(contactId && { contactId }),
        // Add uploadedFileUrls if available
        ...(uploadedFileUrls.length > 0 && { fileUrls: uploadedFileUrls }),
      };

      // 3. Submit to backend
      const response = await fetch("/api/form-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingData,
          contactId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 4. Mark form as completed in GHL if contactId exists
        if (contactId) {
          await fetch("/api/form-start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contactId, value: "completed" }),
          });
        }

        // Redirect to success page with listing ID
        // router.push(`/success?listingId=${result.listingId}`);
      } else {
        setSubmitError(result.error || "Submission failed");
      }
    } catch (error: any) {
      setSubmitError(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep data={formData} onChange={setFormData} />;
      case 2:
        return <PreferencesStep data={formData} onChange={setFormData} />;
      case 3:
        return (
          <CredentialsStep
            data={formData}
            onChange={(newData) => {
              // Merge credentials from all sources
              setFormData({
                ...newData,
                credentials: [
                  ...newData.licenses,
                  ...newData.insurances,
                  ...newData.certifications,
                  // ...newData.files.map(file => file.name) // For display only
                ],
              });
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Get Listed</h1>
            </div>
            <Button variant="outline" onClick={()=> router.push("/")}>Save & Exit</Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Step {currentStep} of {steps.length}:{" "}
              {steps[currentStep - 1].title}
            </h2>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-gray-600 mt-2">
            {steps[currentStep - 1].description}
          </p>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {currentStep === 1 &&
                "Let's start with your basic business information"}
              {currentStep === 2 &&
                "Tell us about your services and preferences"}
              {currentStep === 3 &&
                "Add your credentials to build trust (optional)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}
            {submitError && (
              <div className="mt-4 text-red-600 text-sm">{submitError}</div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || isSubmitting}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep === steps.length ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? "Processing..." : "Complete Registration"}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
              disabled={isSubmitting}
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Express Signup Option */}
        {currentStep === 1 && (
          <Card className="mt-8 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Need to get listed quickly?
                </h3>
                <p className="text-blue-700 mb-4">
                  Just fill in your name, contact, and service area. We'll reach
                  out to complete the rest later.
                </p>
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  onClick={() => {
                    // Minimal data for express signup
                    setFormData({
                      ...formData,
                      businessName: "Express Signup",
                      regions: ["Quick Signup"],
                    });
                    handleSubmit();
                  }}
                >
                  Express Signup
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
