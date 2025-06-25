"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const services = [
  "Plumbing Services",
  "Electrical Repairs & Installation",
  "General Handyman",
  "Garden & Lawn Care",
  "Carpentry",
  "Painting",
  "Roofing",
  "HVAC",
]

const regions = [
  "Sydney, NSW",
  "Melbourne, VIC",
  "Brisbane, QLD",
  "Perth, WA",
  "Adelaide, SA",
  "Canberra, ACT",
  "Darwin, NT",
  "Hobart, TAS",
]

export function SearchFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filter Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Services</h4>
          <div className="space-y-2">
            {services.map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox id={service} />
                <Label htmlFor={service} className="text-sm font-normal">
                  {service}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-3">Regions</h4>
          <div className="space-y-2">
            {regions.map((region) => (
              <div key={region} className="flex items-center space-x-2">
                <Checkbox id={region} />
                <Label htmlFor={region} className="text-sm font-normal">
                  {region}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
