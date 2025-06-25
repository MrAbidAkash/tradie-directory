"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface BasicInfoStepProps {
  data: any
  onChange: (data: any) => void
}

export function BasicInfoStep({ data, onChange }: BasicInfoStepProps) {
  const handleChange = (field: string, value: string) => {
    onChange({
      ...data,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Business Name *</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g., Paul's Plumbing Co."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="abn">ABN *</Label>
          <Input
            id="abn"
            value={data.abn}
            onChange={(e) => handleChange("abn", e.target.value)}
            placeholder="12 345 678 901"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="(02) 9876 5432"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="contact@business.com.au"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Business Description</Label>
        <Textarea
          id="description"
          value={data.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Tell potential customers about your business, experience, and what makes you unique..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  )
}
