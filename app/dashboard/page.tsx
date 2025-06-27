// app/partner/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Overview } from "@/components/dashboard/overview";
// import { RecentJobs } from "@/components/dashboard/recent-jobs";
// import { ProfileCompleteAlert } from "@/components/dashboard/profile-alert";
import { Calendar, DollarSign, Users, Wrench } from "lucide-react";
import { ProfileCompleteAlert } from "@/components/ProfileCompleteAlert";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    jobs: 0,
    earnings: 0,
    clients: 0,
    rating: 0,
  });

  useEffect(() => {
    // Fetch stats from API
    setStats({
      jobs: 12,
      earnings: 4560,
      clients: 8,
      rating: 4.8,
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Wrench className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.jobs}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.earnings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +$1,250 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clients}</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rating}</div>
            <p className="text-xs text-muted-foreground">
              98% satisfaction rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 p-6">
          <CardHeader>
            <CardTitle>Job Activity Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {/* <Overview /> */}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 p-6">
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
            <Button variant="outline" size="sm" className="mt-4">
              View All Jobs
            </Button>
          </CardHeader>
          <CardContent>
            {/* <RecentJobs /> */}
          </CardContent>
        </Card>
      </div>

      {/* <ProfileCompleteAlert completion={75} /> */}
    </div>
  );
}
