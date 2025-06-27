// app/partner/dashboard/listing/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completion, setCompletion] = useState(75);
  const [formData, setFormData] = useState({
    name: "",
    abn: "",
    phone: "",
    email: "",
    description: "",
    service: "",
    region: "",
    operatingHours: "",
    credentials: [] as string[],
    jobPreferences: {
      residential: 5,
      commercial: 5,
      emergency: 5,
      maintenance: 5,
    },
  });

  const serviceOptions = [
    "Plumbing Services",
    "Electrical Repairs",
    "General Handyman",
    "Garden & Lawn Care",
    "Carpentry",
    "Painting",
    "Roofing",
    "HVAC",
    "Tiling",
    "Flooring",
  ];

  const regionOptions = [
    "Sydney CBD",
    "New South Wale",
    "Victoria",
    "North Shore",
    "Eastern Suburbs",
    "Inner West",
    "Western Sydney",
    "Northern Beaches",
    "South Sydney",
    "Hills District",
  ];

  useEffect(() => {
    // Fetch listing data from API
    setTimeout(() => {
      setFormData({
        name: "Sydney Premium Plumbing",
        abn: "12 345 678 901",
        phone: "(02) 9876 5432",
        email: "contact@premiumplumbing.com.au",
        description:
          "Family-owned plumbing business with 15+ years experience. Specializing in emergency plumbing, bathroom renovations, and pipe repairs.",
        service: "Plumbing Services",
        region: "Inner West",
        operatingHours: "Mon-Fri: 7AM-6PM, Sat: 8AM-4PM, Sun: Emergency only",
        credentials: [
          "Master Plumbers License",
          "Public Liability Insurance",
          "WorkCover NSW",
        ],
        jobPreferences: {
          residential: 8,
          commercial: 6,
          emergency: 9,
          maintenance: 7,
        },
      });
      setLoading(false);
    }, 800);
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Recalculate completion
    setCompletion((prev) => Math.min(prev + 2, 100));
  };

  const handleJobPreferenceChange = (type: string, value: number[]) => {
    setFormData((prev) => ({
      ...prev,
      jobPreferences: {
        ...prev.jobPreferences,
        [type]: value[0],
      },
    }));
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    const services = checked
      ? [...formData.credentials, service]
      : formData.credentials.filter((s) => s !== service);

    setFormData((prev) => ({ ...prev, credentials: services }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      // Save to API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save listing", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Business Listing</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Profile:</span> {completion}% complete
          </div>
          <Progress value={completion} className="w-32 h-2" />
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="services">Services & Availability</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Business Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g., Paul's Plumbing Co."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="abn">ABN *</Label>
                  <Input
                    id="abn"
                    value={formData.abn}
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
                    value={formData.phone}
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
                    value={formData.email}
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
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Tell potential customers about your business, experience, and what makes you unique..."
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Services & Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">
                  Primary Service *
                </Label>
                <p className="text-sm text-gray-600 mb-4">
                  Select your main service category
                </p>
                <select
                  value={formData.service}
                  onChange={(e) => handleChange("service", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a service</option>
                  {serviceOptions.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-base font-medium">
                  Service Region *
                </Label>
                <p className="text-sm text-gray-600 mb-4">
                  Select your primary service region
                </p>
                <select
                  value={formData.region}
                  onChange={(e) => handleChange("region", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a region</option>
                  {regionOptions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="hours" className="text-base font-medium">
                  Operating Hours
                </Label>
                <Input
                  id="hours"
                  value={formData.operatingHours}
                  onChange={(e) =>
                    handleChange("operatingHours", e.target.value)
                  }
                  placeholder="e.g., Mon-Fri: 7AM-6PM, Sat: 8AM-4PM"
                />
              </div>

              <div>
                <Label className="text-base font-medium">Job Preferences</Label>
                <p className="text-sm text-gray-600 mb-4">
                  Rate your preference for different types of work (1-10 scale)
                </p>
                <div className="space-y-6">
                  {Object.entries(formData.jobPreferences).map(
                    ([type, value]) => (
                      <div key={type} className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="capitalize">{type} Work</Label>
                          <span className="text-sm text-gray-600">
                            {value}/10
                          </span>
                        </div>
                        <Slider
                          value={[value]}
                          onValueChange={(newValue) =>
                            handleJobPreferenceChange(type, newValue)
                          }
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Professional Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">
                  Why add credentials?
                </h3>
                <p className="text-blue-700 text-sm">
                  Adding your licenses, insurances, and certifications helps
                  build trust with potential customers and can increase your
                  booking rate by up to 40%.
                </p>
              </div>

              <div>
                <Label className="text-base font-medium">
                  Licenses & Certifications
                </Label>
                <p className="text-sm text-gray-600 mb-4">
                  Select all that apply to your business
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Plumbing License",
                    "Electrical License",
                    "Builder License",
                    "HVAC Certification",
                    "Gas Fitting License",
                    "Construction White Card",
                    "Working at Heights",
                    "First Aid Certificate",
                    "Public Liability Insurance",
                    "WorkCover Insurance",
                  ].map((license) => (
                    <div key={license} className="flex items-center space-x-2">
                      <Checkbox
                        id={license}
                        checked={formData.credentials.includes(license)}
                        onCheckedChange={(checked) =>
                          handleServiceChange(license, checked as boolean)
                        }
                      />
                      <Label htmlFor={license} className="text-sm font-normal">
                        {license}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">
                  Upload Documents
                </Label>
                <p className="text-sm text-gray-600 mb-4">
                  Upload copies of your licenses, certificates, or insurance
                  documents
                </p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          //   strokeLinecap="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop files here, or click to browse
                    </p>
                    <Button variant="outline" size="sm">
                      Choose Files
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Supported formats: PDF, JPG, PNG (max 5MB each)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
