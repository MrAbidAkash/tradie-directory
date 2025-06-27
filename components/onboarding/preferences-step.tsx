"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface PreferencesStepProps {
  data: any;
  onChange: (data: any) => void;
}

const serviceOptions = [
  "Plumbing Services",
  "Electrical Repairs & Installation",
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
  "North Sydney",
  "New South Wales",
  "Victoria",
  "North Shore",
  "Eastern Suburbs",
  "Inner West",
  "Western Sydney",
  "Northern Beaches",
  "South Sydney",
  "Hills District",
];

export function PreferencesStep({ data, onChange }: PreferencesStepProps) {
  const handleServiceChange = (service: string, checked: boolean) => {
    const services = checked
      ? [...data.services, service]
      : data.services.filter((s: string) => s !== service);

    onChange({
      ...data,
      services,
    });
  };

  const handleRegionChange = (region: string, checked: boolean) => {
    const regions = checked
      ? [...data.regions, region]
      : data.regions.filter((r: string) => r !== region);

    onChange({
      ...data,
      regions,
    });
  };

  const handleJobPreferenceChange = (type: string, value: number[]) => {
    onChange({
      ...data,
      jobPreferences: {
        ...data.jobPreferences,
        [type]: value[0],
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Services */}
      <div>
        <Label className="text-base font-medium">Services Offered *</Label>
        <p className="text-sm text-gray-600 mb-4">
          Select all services you provide
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {serviceOptions.map((service) => (
            <div key={service} className="flex items-center space-x-2">
              <Checkbox
                id={service}
                checked={data.services.includes(service)}
                onCheckedChange={(checked) =>
                  handleServiceChange(service, checked as boolean)
                }
              />
              <Label htmlFor={service} className="text-sm font-normal">
                {service}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Regions */}
      <div>
        <Label className="text-base font-medium">Service Regions *</Label>
        <p className="text-sm text-gray-600 mb-4">
          Select up to 10 regions you service
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {regionOptions.map((region) => (
            <div key={region} className="flex items-center space-x-2">
              <Checkbox
                id={region}
                checked={data.regions.includes(region)}
                onCheckedChange={(checked) =>
                  handleRegionChange(region, checked as boolean)
                }
                disabled={
                  data.regions.length >= 10 && !data.regions.includes(region)
                }
              />
              <Label htmlFor={region} className="text-sm font-normal">
                {region}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Operating Hours */}
      <div>
        <Label htmlFor="hours" className="text-base font-medium">
          Operating Hours
        </Label>
        <Input
          id="hours"
          value={data.operatingHours}
          onChange={(e) =>
            onChange({ ...data, operatingHours: e.target.value })
          }
          placeholder="e.g., Mon-Fri: 7AM-6PM, Sat: 8AM-4PM"
          className="mt-2"
        />
      </div>

      {/* Job Preferences */}
      <div>
        <Label className="text-base font-medium">Job Preferences</Label>
        <p className="text-sm text-gray-600 mb-4">
          Rate your preference for different types of work (1-10 scale)
        </p>
        <div className="space-y-6">
          {Object.entries(data.jobPreferences).map(([type, value]) => (
            <div key={type} className="space-y-2">
              <div className="flex justify-between">
                <Label className="capitalize">{type} Work</Label>
                <span className="text-sm text-gray-600">
                  {value as number}/10
                </span>
              </div>
              <Slider
                value={[value as number]}
                onValueChange={(newValue) =>
                  handleJobPreferenceChange(type, newValue)
                }
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
