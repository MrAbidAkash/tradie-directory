import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import Link from "next/link";
import { ListingsGrid } from "@/components/listings-grid";
import { SearchFilters } from "@/components/search-filters";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-gray-900">
                TradieDirectory
              </a>
            </div>
            <Link href="/listing/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Listed Now
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Find Trusted Tradies in Your Area
          </h2>
          <p className="text-xl mb-8">
            Connect with verified professionals for all your home and business
            needs
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-2 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="What service do you need?"
                className="pl-10 border-0 focus-visible:ring-0"
              />
            </div>
            <Select>
              <SelectTrigger className="w-48 border-0">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sydney">Sydney, NSW</SelectItem>
                <SelectItem value="melbourne">Melbourne, VIC</SelectItem>
                <SelectItem value="brisbane">Brisbane, QLD</SelectItem>
                <SelectItem value="perth">Perth, WA</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700">Search</Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <Suspense fallback={<div>Loading filters...</div>}>
              <SearchFilters />
            </Suspense>
          </aside>

          {/* Listings Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Featured Tradies
              </h3>
              <p className="text-gray-600">
                Verified professionals ready to help with your project
              </p>
            </div>

            <Suspense fallback={<div>Loading listings...</div>}>
              <ListingsGrid />
            </Suspense>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">TradieDirectory</h4>
              <p className="text-gray-300">
                Connecting homeowners with trusted tradies across Australia.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Tradies</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/listing/new" className="hover:text-white">
                    Get Listed
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Plumbing</li>
                <li>Electrical</li>
                <li>Handyman</li>
                <li>Landscaping</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-300">support@TradieDirectory.com.au</p>
              <p className="text-gray-300">1300 TRADIE</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
