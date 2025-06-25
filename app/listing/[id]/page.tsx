import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Star, Clock, Award, Shield } from "lucide-react";
import { notFound } from "next/navigation";

// Mock data - replace with actual database fetch
const mockListing = {
  _id: "1",
  name: "Paul's Plumbing Co.",
  service: "Plumbing Services",
  region: "Sydney, NSW",
  phone: "(02) 9876 5432",
  email: "paul@paulsplumbing.com",
  abn: "12 345 678 901",
  rating: 4.8,
  reviews: 127,
  description:
    "Professional plumbing services with 15+ years experience. We specialize in residential and commercial plumbing, emergency repairs, and bathroom renovations.",
  operatingHours: "Mon-Fri: 7AM-6PM, Sat: 8AM-4PM, Sun: Emergency only",
  serviceAreas: ["Sydney CBD", "North Shore", "Eastern Suburbs", "Inner West"],
  credentials: [
    "Licensed Plumber (NSW)",
    "Public Liability Insurance",
    "Workers Compensation",
    "Master Plumbers Association Member",
  ],
  jobPreferences: {
    residential: 9,
    commercial: 7,
    emergency: 8,
    maintenance: 6,
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingPage({ params }: PageProps) {
  const { id } = await params;

  // In a real app, fetch from database
  if (id !== "1") {
    notFound();
  }

  const listing = mockListing;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                TradieDirectory
              </h1>
            </div>
            <Button variant="outline">Back to Search</Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{listing.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <MapPin className="h-4 w-4" />
                      {listing.region}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {listing.service}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-lg">
                      {listing.rating}
                    </span>
                    <span className="text-gray-500">
                      ({listing.reviews} reviews)
                    </span>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Verified
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {listing.description}
                </p>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{listing.operatingHours}</p>
              </CardContent>
            </Card>

            {/* Service Areas */}
            <Card>
              <CardHeader>
                <CardTitle>Service Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {listing.serviceAreas.map((area) => (
                    <Badge key={area} variant="outline">
                      {area}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Credentials */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Credentials & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {listing.credentials.map((credential) => (
                    <li key={credential} className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>{credential}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{listing.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="break-all">{listing.email}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Button className="w-full">Call Now</Button>
                  <Button variant="outline" className="w-full">
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full">
                    Request Quote
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Job Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Specialties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(listing.jobPreferences).map(
                    ([type, rating]) => (
                      <div
                        key={type}
                        className="flex justify-between items-center"
                      >
                        <span className="capitalize">{type}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(10)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < rating ? "bg-blue-600" : "bg-gray-200"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {rating}/10
                          </span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
