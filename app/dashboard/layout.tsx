// app/partner/dashboard/layout.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, this would call your logout API
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      <Toaster />
    </div>
  );
}
