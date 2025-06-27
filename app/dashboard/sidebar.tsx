// components/dashboard/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Wrench,
  FileText,
  Settings,
  Users,
  Calendar,
  CreditCard,
  LogOut,
} from "lucide-react";

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "My Listing", href: "/dashboard/listing", icon: Wrench },
    { name: "Jobs", href: "/dashboard/jobs", icon: Calendar },
    { name: "Clients", href: "/dashboard/clients", icon: Users },
    { name: "Invoices", href: "/dashboard/invoices", icon: CreditCard },
    { name: "Documents", href: "/dashboard/documents", icon: FileText },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <div className="text-xl font-bold text-blue-700"><Link href="/">TradieDirectory</Link></div>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  pathname === item.href
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={onClose}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            ))}

            <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
              <LogOut className="h-5 w-5 mr-3" />
              <span>Sign Out</span>
            </button>
          </nav>

          <div className="p-4 border-t">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-blue-700">
                Need help? Contact our support team at support@tradiedirect.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
