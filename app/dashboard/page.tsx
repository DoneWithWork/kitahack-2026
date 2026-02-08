"use client";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import Link from "next/link";
import { 
  Award, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  GraduationCap,
  ChevronRight,
  Sparkles,
  Calendar,
  ArrowUpRight,
  Target,
  Users
} from "lucide-react";

const scholarships = [
  {
    id: "1",
    title: "Doctoral Certificate in Applied Computer Science",
    amount: "$10,280",
    university: "Westcliff University, US",
    deadline: "March 15, 2026",
    match: 94,
  },
  {
    id: "2",
    title: "PhD Health Economics",
    amount: "$11,584",
    university: "University of Colorado Denver, US",
    deadline: "April 1, 2026",
    match: 89,
  },
  {
    id: "3",
    title: "Doctoral Certificate in Applied Computer Science",
    amount: "$18,343",
    university: "University of North Carolina at Greensboro, US",
    deadline: "March 30, 2026",
    match: 92,
  },
];

const universities = [
  { name: "University of Colorado", location: "United States (USA)", logo: "UC" },
  { name: "University of Texas", location: "United States (USA)", logo: "UT" },
  { name: "University of Canada", location: "Canada", logo: "UC" },
  { name: "University of Toronto", location: "Canada", logo: "UT" },
];

const destinations = [
  { name: "Canada", subtitle: "Your best destination", image: "bg-gradient-to-br from-blue-400 to-blue-600" },
  { name: "Oxford", subtitle: "Your best destination", image: "bg-gradient-to-br from-amber-400 to-orange-500" },
  { name: "Colorado", subtitle: "United States (USA)", image: "bg-gradient-to-br from-green-400 to-emerald-600" },
  { name: "Texas", subtitle: "Your best destination", image: "bg-gradient-to-br from-red-400 to-rose-600" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: matches, refetch: refetchMatches } = trpc.match.getMatches.useQuery();
  const { data: applications } = trpc.workflow.getApplications.useQuery();
  const { data: reminders } = trpc.workflow.getReminders.useQuery();
  const calculateMutation = trpc.match.calculateMatches.useMutation({
    onSuccess: () => refetchMatches(),
  });

  const eligibleCount = matches?.filter((m) => m.eligible).length || 0;
  const totalMatches = matches?.length || 0;

  const recentActivity = [
    { action: "New scholarship match found", time: "2 hours ago", type: "match" },
    { action: "Application submitted to Stanford", time: "1 day ago", type: "success" },
    { action: "Document uploaded: Transcript", time: "2 days ago", type: "info" },
    { action: "Deadline approaching: Fulbright", time: "3 days ago", type: "warning" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, Sudarsan!</h1>
          <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your scholarship journey.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Award className="mr-2 h-4 w-4" />
          Find Scholarships
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Matches</p>
                <p className="text-3xl font-bold text-foreground mt-1">{totalMatches}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Eligible</p>
                <p className="text-3xl font-bold text-foreground mt-1">{eligibleCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-3xl font-bold text-foreground mt-1">{applications?.length || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reminders</p>
                <p className="text-3xl font-bold text-foreground mt-1">{reminders?.reminders.length || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 mt-6">
          {/* Banner */}
          <Card className="bg-gradient-to-r from-yellow-300 to-yellow-200 dark:from-yellow-700 dark:to-yellow-600 border-0 overflow-hidden">
            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Explore new opportunities
                  </h2>
                  <p className="text-muted-foreground mb-4 max-w-lg">
                    Course search made smarter and simpler. Use our magical AI system to find scholarships with high admission chances.
                  </p>
                  <Button className="bg-background text-foreground hover:bg-background/90 font-semibold">
                    Try now
                  </Button>
                </div>
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-background/30 rounded-full flex items-center justify-center">
                  <Sparkles className="w-12 h-12 lg:w-16 lg:h-16 text-yellow-700 dark:text-yellow-200" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <Card className="lg:col-span-2 border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-muted">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === "success" ? "bg-green-100 dark:bg-green-900" :
                        activity.type === "warning" ? "bg-amber-100 dark:bg-amber-900" :
                        activity.type === "match" ? "bg-blue-100 dark:bg-blue-900" :
                        "bg-muted"
                      }`}>
                        {activity.type === "success" ? <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" /> :
                         activity.type === "warning" ? <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" /> :
                         activity.type === "match" ? <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" /> :
                         <FileText className="w-5 h-5 text-muted-foreground" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="bg-slate-900 dark:bg-slate-800 border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Up-coming Events</p>
                    <h3 className="text-lg font-bold text-white">IELTS Speaking Workshop</h3>
                    <p className="text-sm text-slate-400 mt-1">United Kingdom | 09am - 12am</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-slate-800 dark:bg-slate-700 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold">
                  View Details
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recommended Scholarships */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Recommended Scholarships</h2>
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                See all <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholarships.map((scholarship) => (
                <Card key={scholarship.id} className="group hover-lift border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-bold text-foreground line-clamp-2 flex-1">
                        {scholarship.title}
                      </h3>
                      <Badge className="ml-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-100">
                        {scholarship.match}% Match
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-primary mb-2">{scholarship.amount}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <GraduationCap className="h-4 w-4" />
                      <span className="truncate">{scholarship.university}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Deadline: {scholarship.deadline}</span>
                      <Button size="sm" variant="outline" className="text-primary border-primary/20 hover:bg-primary/10">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Destinations & Partnerships */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Destinations */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Your destinations</h2>
              <p className="text-sm text-muted-foreground mb-6">Providers 120 world class education in 6 countries</p>
              
              <div className="grid grid-cols-2 gap-4">
                {destinations.map((dest, i) => (
                  <Card key={i} className="group cursor-pointer overflow-hidden border-0">
                    <CardContent className={`p-0 relative h-32 ${dest.image}`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-3 left-3 text-white">
                        <h3 className="font-bold">{dest.name}</h3>
                        <p className="text-xs text-white/80">{dest.subtitle}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Partnerships */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Partnerships</h2>
              <p className="text-sm text-muted-foreground mb-6">Partnered over 120 world class Universities</p>
              
              <div className="space-y-3">
                {universities.map((uni, i) => (
                  <Card key={i} className="group hover-lift border-border bg-card cursor-pointer">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-sm">
                          {uni.logo}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground text-sm">{uni.name}</h4>
                          <p className="text-xs text-muted-foreground">{uni.location}</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="matches" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Your Scholarship Matches</CardTitle>
              <div className="text-sm text-muted-foreground">
                Ranked by eligibility and relevance
              </div>
            </CardHeader>
            <CardContent>
              {matches && matches.length > 0 ? (
                <div className="space-y-4">
                  {matches.map((match) => (
                    <div
                      key={match.scholarshipId}
                      className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-muted transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{match.scholarshipId}</p>
                        <p className="text-sm text-muted-foreground">
                          Score: {match.score} | Similarity: {Math.round(match.similarity * 100)}%
                        </p>
                        {!match.eligible && match.reasons.length > 0 && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {match.reasons.join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {match.eligible ? (
                          <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-100">
                            Eligible
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-100">
                            Not Eligible
                          </Badge>
                        )}
                        <Link href={`/scholarships/${match.scholarshipId}`}>
                          <Button size="sm" variant="outline" className="text-primary border-primary/20 hover:bg-primary/10">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">No matches calculated yet</p>
                  <Button
                    onClick={() => calculateMutation.mutate()}
                    disabled={calculateMutation.isPending}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {calculateMutation.isPending ? "Calculating..." : "Calculate Matches"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Your Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {applications && applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.scholarshipId}
                      className="rounded-xl border border-border p-4 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium text-foreground">{app.scholarshipId}</p>
                        <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                          {app.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Deadline: {new Date(app.deadline).toLocaleDateString()}
                      </p>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Checklist:</p>
                        <ul className="space-y-2">
                          {app.checklist.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-3 text-sm"
                            >
                              <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                                item.completed ? "bg-primary border-primary" : "border-border"
                              }`}>
                                {item.completed && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                              </div>
                              <span className={item.completed ? "text-muted-foreground line-through" : "text-foreground"}>
                                {item.item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">No applications yet</p>
                  <Link href="/scholarships">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Browse Scholarships
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
