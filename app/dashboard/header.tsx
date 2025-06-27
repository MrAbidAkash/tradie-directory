// components/dashboard/header.tsx
"use client";

import { Bell, Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Header({
  onMenuClick,
  onLogout,
}: {
  onMenuClick: () => void;
  onLogout: () => void;
}) {
  return (
    <header className="bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="mr-2 lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">Premium Plumbing</p>
                    <p className="text-xs text-gray-500">Premium Account</p>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2" align="end">
                <div className="space-y-1">
                  <button className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100">
                    My Profile
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100">
                    Account Settings
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
}
