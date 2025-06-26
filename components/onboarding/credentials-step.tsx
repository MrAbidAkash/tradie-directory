"use client";

import { useRef, useState } from "react";
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
    </div>
  );
}
