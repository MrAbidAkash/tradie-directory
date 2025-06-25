import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Star } from "lucide-react"
import Link from "next/link"

// This would normally fetch from your API
const mockListings = [
  {
    _id: "1",
    name: "Paul's Plumbing Co.",
    service: "Plumbing Services",
    region: "Sydney, NSW",
    phone: "(02) 9876 5432",
    email: "paul@paulsplumbing.com",
    rating: 4.8,
    reviews: 127,
    description: "Professional plumbing services with 15+ years experience",
  },
  {
    _id: "2",
    name: "Elite Electricians",
    service: "Electrical Repairs & Installation",
    region: "Melbourne, VIC",
    phone: "(03) 9234 5678",
    email: "contact@eliteelectrics.com.au",
    rating: 4.9,
    reviews: 89,
    description: "Licensed electricians for residential and commercial work",
  },
  {
    _id: "3",
    name: "Handy Harry's Handyman",
    service: "General Handyman",
    region: "Brisbane, QLD",
    phone: "(07) 3123 4567",
    email: "harry@handyharry.com.au",
    rating: 4.7,
    reviews: 156,
    description: "Your go-to handyman for all home repairs and maintenance",
  },
  {
    _id: "4",
    name: "GreenThumb Landscaping",
    service: "Garden & Lawn Care",
    region: "Perth, WA",
    phone: "(08) 9456 7890",
    email: "info@greenthumbgardeners.com.au",
    rating: 4.6,
    reviews: 203,
    description: "Transform your outdoor space with professional landscaping",
  },
]

export function ListingsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockListings.map((listing) => (
        <Card key={listing._id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{listing.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <MapPin className="h-4 w-4" />
                  {listing.region}
                </CardDescription>
              </div>
              <Badge variant="secondary">{listing.service}</Badge>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{listing.rating}</span>
              </div>
              <span className="text-sm text-gray-500">({listing.reviews} reviews)</span>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-gray-600 mb-4">{listing.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{listing.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{listing.email}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Link href={`/listing/${listing._id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  View Profile
                </Button>
              </Link>
              <Button className="flex-1">Contact Now</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
