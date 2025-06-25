"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Upload } from "lucide-react"

interface CredentialsStepProps {
  data: any
  onChange: (data: any) => void
}

export function CredentialsStep({ data, onChange }: CredentialsStepProps) {
  const [newLicense, setNewLicense] = useState("")
  const [newInsurance, setNewInsurance] = useState("")
  const [newCertification, setNewCertification] = useState("")

  const addItem = (type: string, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      onChange({
        ...data,
        [type]: [...data[type], value.trim()],
      })
      setter("")
    }
  }

  const removeItem = (type: string, index: number) => {
    onChange({
      ...data,
      [type]: data[type].filter((_: any, i: number) => i !== index),
    })
  }

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Why add credentials?</h3>
        <p className="text-blue-700 text-sm">
          Adding your licenses, insurances, and certifications helps build trust with potential customers and can
          increase your booking rate by up to 40%.
        </p>
      </div>

      {/* Licenses */}
      <div>
        <Label className="text-base font-medium">Professional Licenses</Label>
        <p className="text-sm text-gray-600 mb-4">Add any professional licenses you hold</p>

        <div className="flex gap-2 mb-3">
          <Input
            value={newLicense}
            onChange={(e) => setNewLicense(e.target.value)}
            placeholder="e.g., Licensed Plumber (NSW)"
            onKeyPress={(e) => e.key === "Enter" && addItem("licenses", newLicense, setNewLicense)}
          />
          <Button type="button" onClick={() => addItem("licenses", newLicense, setNewLicense)} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.licenses.map((license: string, index: number) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {license}
              <button onClick={() => removeItem("licenses", index)} className="ml-1 hover:text-red-600">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Insurance */}
      <div>
        <Label className="text-base font-medium">Insurance Coverage</Label>
        <p className="text-sm text-gray-600 mb-4">List your insurance policies</p>

        <div className="flex gap-2 mb-3">
          <Input
            value={newInsurance}
            onChange={(e) => setNewInsurance(e.target.value)}
            placeholder="e.g., Public Liability Insurance"
            onKeyPress={(e) => e.key === "Enter" && addItem("insurances", newInsurance, setNewInsurance)}
          />
          <Button type="button" onClick={() => addItem("insurances", newInsurance, setNewInsurance)} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.insurances.map((insurance: string, index: number) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {insurance}
              <button onClick={() => removeItem("insurances", index)} className="ml-1 hover:text-red-600">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <Label className="text-base font-medium">Certifications & Memberships</Label>
        <p className="text-sm text-gray-600 mb-4">Add any relevant certifications or professional memberships</p>

        <div className="flex gap-2 mb-3">
          <Input
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
            placeholder="e.g., Master Plumbers Association Member"
            onKeyPress={(e) => e.key === "Enter" && addItem("certifications", newCertification, setNewCertification)}
          />
          <Button
            type="button"
            onClick={() => addItem("certifications", newCertification, setNewCertification)}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.certifications.map((cert: string, index: number) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {cert}
              <button onClick={() => removeItem("certifications", index)} className="ml-1 hover:text-red-600">
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

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
          <Button variant="outline" size="sm">
            Choose Files
          </Button>
          <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, JPG, PNG (max 5MB each)</p>
        </div>
      </div>
    </div>
  )
}
