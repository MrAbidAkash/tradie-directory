"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload } from "lucide-react";

interface CredentialsStepProps {
  data: any;
  onChange: (data: any) => void;
}

export function CredentialsStep({ data, onChange }: CredentialsStepProps) {
  const [newLicense, setNewLicense] = useState("");
  const [newInsurance, setNewInsurance] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addItem = (
    type: string,
    value: string,
    setter: (value: string) => void,
  ) => {
    if (value.trim()) {
      onChange({
        ...data,
        [type]: [...data[type], value.trim()],
      });
      setter("");
    }
  };

  const removeItem = (type: string, index: number) => {
    onChange({
      ...data,
      [type]: data[type].filter((_: any, i: number) => i !== index),
    });
  };

  // Handle file selection via input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: File[] = Array.from(e.target.files);
      const updatedFiles = [...data.files, ...newFiles];

      onChange({
        ...data,
        files: updatedFiles,
      });
    }
  };

  // Handle drag and drop events
  const handleDragOver = (e: any) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles: File[] = Array.from(e.dataTransfer.files);
      const updatedFiles = [...data.files, ...newFiles];

      onChange({
        ...data,
        files: updatedFiles,
      });
    }
  };

  // Remove a file by index
  const removeFile = (index: number) => {
    const updatedFiles = data.files.filter((_: any, i: number) => i !== index);
    onChange({
      ...data,
      files: updatedFiles,
    });
  };

  const [validationStatus, setValidationStatus] = useState<{
    status: "idle" | "validating" | "valid" | "invalid";
    message: string;
  }>({ status: "idle", message: "" });

  // Run validation when credentials change
  useEffect(() => {
    const hasCredentials =
      data.licenses.length > 0 ||
      data.insurances.length > 0 ||
      data.certifications.length > 0 ||
      data.files.length > 0;

    if (hasCredentials) {
      validateCredentials();
    } else {
      setValidationStatus({ status: "idle", message: "" });
    }
  }, [data.licenses, data.insurances, data.certifications, data.files]);

  const validateCredentials = async () => {
    setValidationStatus({
      status: "validating",
      message: "Validating credentials...",
    });

    try {
      const response = await fetch("/api/validate-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Validation Preview",
          services: ["General"],
          ...data,
        }),
      });

      const result = await response.json();

      if (result.valid) {
        setValidationStatus({
          status: "valid",
          message: "Credentials appear valid",
        });
      } else {
        setValidationStatus({
          status: "invalid",
          message: result.message || "Validation issues found",
        });
      }
    } catch (error) {
      setValidationStatus({
        status: "invalid",
        message: "Validation failed. Please check your credentials.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Why add credentials?</h3>
        <p className="text-blue-700 text-sm">
          Adding your licenses, insurances, and certifications helps build trust
          with potential customers and can increase your booking rate by up to
          40%.
        </p>
      </div>

      {/* Licenses */}
      <div>
        <Label className="text-base font-medium">Professional Licenses</Label>
        <p className="text-sm text-gray-600 mb-4">
          Add any professional licenses you hold
        </p>

        <div className="flex gap-2 mb-3">
          <Input
            value={newLicense}
            onChange={(e) => setNewLicense(e.target.value)}
            placeholder="e.g., Licensed Plumber (NSW)"
            onKeyPress={(e) =>
              e.key === "Enter" &&
              addItem("licenses", newLicense, setNewLicense)
            }
          />
          <Button
            type="button"
            onClick={() => addItem("licenses", newLicense, setNewLicense)}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.licenses.map((license: string, index: number) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {license}
              <button
                onClick={() => removeItem("licenses", index)}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Insurance */}
      <div>
        <Label className="text-base font-medium">Insurance Coverage</Label>
        <p className="text-sm text-gray-600 mb-4">
          List your insurance policies
        </p>

        <div className="flex gap-2 mb-3">
          <Input
            value={newInsurance}
            onChange={(e) => setNewInsurance(e.target.value)}
            placeholder="e.g., Public Liability Insurance"
            onKeyPress={(e) =>
              e.key === "Enter" &&
              addItem("insurances", newInsurance, setNewInsurance)
            }
          />
          <Button
            type="button"
            onClick={() => addItem("insurances", newInsurance, setNewInsurance)}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.insurances.map((insurance: string, index: number) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {insurance}
              <button
                onClick={() => removeItem("insurances", index)}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <Label className="text-base font-medium">
          Certifications & Memberships
        </Label>
        <p className="text-sm text-gray-600 mb-4">
          Add any relevant certifications or professional memberships
        </p>

        <div className="flex gap-2 mb-3">
          <Input
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
            placeholder="e.g., Master Plumbers Association Member"
            onKeyPress={(e) =>
              e.key === "Enter" &&
              addItem("certifications", newCertification, setNewCertification)
            }
          />
          <Button
            type="button"
            onClick={() =>
              addItem("certifications", newCertification, setNewCertification)
            }
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.certifications.map((cert: string, index: number) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {cert}
              <button
                onClick={() => removeItem("certifications", index)}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div>
        <Label className="text-base font-medium">Upload Documents</Label>
        <p className="text-sm text-gray-600 mb-4">
          Upload copies of your licenses, certificates, or insurance documents
        </p>

        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop files here, or click to browse
          </p>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Choose Files
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: PDF, JPG, PNG (max 5MB each)
          </p>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
          />
        </div>

        {/* Display uploaded files */}
        <div className="flex flex-wrap gap-2 mt-4">
          {data.files.map((file: File, index: number) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1"
            >
              <span className="max-w-[120px] truncate">{file.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
      {/* Validation Status Indicator */}
      {validationStatus.status !== "idle" && (
        <div
          className={`p-4 rounded-lg ${
            validationStatus.status === "valid"
              ? "bg-green-50 border border-green-200 text-green-700"
              : validationStatus.status === "invalid"
              ? "bg-yellow-50 border border-yellow-200 text-yellow-700"
              : "bg-blue-50 border border-blue-200 text-blue-700"
          }`}
        >
          <div className="flex items-center">
            {validationStatus.status === "validating" && (
              <svg
                className="animate-spin h-5 w-5 mr-3"
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
            )}
            {validationStatus.status === "valid" && (
              <svg
                className="h-5 w-5 mr-3 text-green-500"
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
            )}
            {validationStatus.status === "invalid" && (
              <svg
                className="h-5 w-5 mr-3 text-yellow-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>{validationStatus.message}</span>
          </div>

          {validationStatus.status === "invalid" && (
            <p className="mt-2 text-sm">
              Your credentials might need verification. We'll review them
              manually if needed.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
