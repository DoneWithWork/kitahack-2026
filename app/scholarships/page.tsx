"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Filter, 
  GraduationCap, 
  DollarSign, 
  Award, 
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Target,
  Loader2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Link from "next/link";
import type { Scholarship, ScholarshipSearchFilters } from "@/lib/schemas/scholarship.schema";

export default function ScholarshipsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [applicationText, setApplicationText] = useState("");

  const { data: scholarships, isLoading } = trpc.scholarship.search.useQuery({
    query: searchQuery || undefined,
    fields: selectedField ? [selectedField] : undefined,
    educationLevel: selectedLevel as ScholarshipSearchFilters["educationLevel"] || undefined,
  });

  const { data: urgentScholarships } = trpc.scholarship.getUrgent.useQuery();
  const { data: _userProfile } = trpc.profile.get.useQuery();
  const { data: matches } = trpc.match.getMatches.useQuery();
  const { data: applications } = trpc.workflow.getApplications.useQuery();
  const generateEssay = trpc.assistant.generateEssay.useMutation();
  const startApplication = trpc.workflow.startApplication.useMutation();

  const getEligibilityStatus = (scholarshipId: string) => {
    const match = matches?.find((m) => m.scholarshipId === scholarshipId);
    if (!match) return { eligible: null, reasons: [] };
    return { eligible: match.eligible, reasons: match.reasons };
  };

  const isApplied = (scholarshipId: string) => {
    return applications?.some((app) => app.scholarshipId === scholarshipId);
  };

  type ScholarshipAmount = {
    value?: number;
    currency?: string;
    type?: "fixed" | "range" | "full_tuition" | "partial" | "variable";
    minAmount?: number;
    maxAmount?: number;
  };

  const formatAmount = (amount: ScholarshipAmount | undefined | null) => {
    if (!amount) return "Amount not specified";
    if (amount.type === "full_tuition") return "Full Tuition";
    if (amount.type === "range") {
      return `$${amount.minAmount?.toLocaleString()} - $${amount.maxAmount?.toLocaleString()} ${amount.currency}`;
    }
    return `$${amount.value?.toLocaleString() ?? 0} ${amount.currency ?? "USD"}`;
  };

  const getDeadlineInfo = (deadline: string) => {
    const date = new Date(deadline);
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    const daysLeft = Math.ceil((date.getTime() - now) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return "Expired";
    if (daysLeft === 0) return "Today";
    if (daysLeft === 1) return "Tomorrow";
    if (daysLeft <= 7) return `${daysLeft} days left`;
    return date.toLocaleDateString();
  };

  const handleGenerateEssay = async () => {
    if (!selectedScholarship) return;
    await generateEssay.mutateAsync({
      scholarshipId: selectedScholarship.id,
      prompt: applicationText,
    });
  };

  const handleStartApplication = async (scholarshipId: string) => {
    await startApplication.mutateAsync({ scholarshipId });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">ScholarGuide</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/scholarships">
              <Button variant="ghost" className="text-primary">Scholarships</Button>
            </Link>
            <Link href="/documents">
              <Button variant="ghost">Documents</Button>
            </Link>
            <Link href="/assistant">
              <Button variant="ghost">AI Assistant</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Discover Scholarships</h1>
          <p className="text-muted-foreground">
            Find and apply for scholarships that match your profile. AI-powered matching helps you focus on opportunities you&apos;re most likely to win.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{scholarships?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{matches?.filter((m) => m.eligible).length || 0}</p>
                  <p className="text-sm text-muted-foreground">Eligible</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{urgentScholarships?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Urgent (2 weeks)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    ${Math.round(
                      (scholarships?.reduce((acc, s) => acc + (s.amount?.value || 0), 0) || 0) / 1000
                    )}K
                  </p>
                  <p className="text-sm text-muted-foreground">Total Funding</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search scholarships..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>

            {showFilters && (
              <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                <div>
                  <Label className="mb-2 block">Field of Study</Label>
                  <Select value={selectedField} onValueChange={setSelectedField}>
                    <SelectTrigger>
                      <SelectValue placeholder="All fields" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All fields</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Medicine">Medicine</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Law">Law</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                      <SelectItem value="Sciences">Sciences</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">Education Level</Label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All levels</SelectItem>
                      <SelectItem value="high_school">High School</SelectItem>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="postgraduate">Postgraduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Scholarships</TabsTrigger>
            <TabsTrigger value="eligible">Eligible for You</TabsTrigger>
            <TabsTrigger value="urgent">Urgent Deadlines</TabsTrigger>
            <TabsTrigger value="recommended">AI Recommended</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : scholarships?.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No scholarships found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scholarships?.map((scholarship) => {
                  const eligibility = getEligibilityStatus(scholarship.id);
                  const applied = isApplied(scholarship.id);

                  return (
                    <Card key={scholarship.id} className="group hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-2">{scholarship.title}</CardTitle>
                            <CardDescription className="mt-1">{scholarship.provider}</CardDescription>
                          </div>
                          {eligibility.eligible === true && (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 shrink-0">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Eligible
                            </Badge>
                          )}
                          {eligibility.eligible === false && (
                            <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 shrink-0">
                              <XCircle className="h-3 w-3 mr-1" />
                              Not Eligible
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {scholarship.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-semibold">{formatAmount(scholarship.amount)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                            <Clock className="h-4 w-4" />
                            <span>{getDeadlineInfo(scholarship.deadline)}</span>
                          </div>
                        </div>

                        {scholarship.fieldsAllowed && (
                          <div className="flex flex-wrap gap-1">
                            {scholarship.fieldsAllowed.slice(0, 3).map((field) => (
                              <Badge key={field} variant="secondary" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                            {scholarship.fieldsAllowed.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{scholarship.fieldsAllowed.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        {eligibility.reasons.length > 0 && (
                          <div className="text-xs text-red-600 dark:text-red-400">
                            {eligibility.reasons.join(", ")}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => setSelectedScholarship(scholarship)}
                              >
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-2xl">{scholarship.title}</DialogTitle>
                                <DialogDescription>{scholarship.provider}</DialogDescription>
                              </DialogHeader>

                              <div className="space-y-6 py-4">
                                <div className="flex items-center gap-4">
                                  {eligibility.eligible === true ? (
                                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-sm px-3 py-1">
                                      <CheckCircle2 className="h-4 w-4 mr-1" />
                                      You&apos;re Eligible
                                    </Badge>
                                  ) : eligibility.eligible === false ? (
                                    <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-sm px-3 py-1">
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Not Eligible
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary">Eligibility Unknown</Badge>
                                  )}
                                  <Badge variant="outline" className="text-sm">
                                    <Clock className="h-4 w-4 mr-1" />
                                    Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                                  </Badge>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">Description</h4>
                                  <p className="text-muted-foreground">{scholarship.description}</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Benefits</h4>
                                    <p className="text-muted-foreground">{scholarship.benefits}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Award Amount</h4>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                      {formatAmount(scholarship.amount)}
                                    </p>
                                  </div>
                                </div>

                                {scholarship.requirements && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Requirements</h4>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                      {scholarship.requirements.map((req, idx) => (
                                        <li key={idx}>{req}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {scholarship.documentsRequired && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Required Documents</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {scholarship.documentsRequired.map((doc, idx) => (
                                        <Badge key={idx} variant="secondary">{doc}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {eligibility.eligible && !applied && (
                                  <div className="border rounded-lg p-4 space-y-4">
                                    <h4 className="font-semibold flex items-center gap-2">
                                      <Sparkles className="h-5 w-5 text-amber-500" />
                                      AI Application Assistant
                                    </h4>
                                    <Textarea
                                      placeholder="Describe your background, achievements, and why you're a good fit for this scholarship..."
                                      value={applicationText}
                                      onChange={(e) => setApplicationText(e.target.value)}
                                      className="min-h-[100px]"
                                    />
                                    <Button 
                                      onClick={handleGenerateEssay}
                                      disabled={!applicationText.trim() || generateEssay.isPending}
                                      className="w-full"
                                    >
                                      {generateEssay.isPending ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Generating...
                                        </>
                                      ) : (
                                        <>
                                          <Sparkles className="mr-2 h-4 w-4" />
                                          Generate Essay Draft
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                )}

                                <div className="flex gap-3">
                                  {applied ? (
                                    <Button disabled className="flex-1">
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      Application Started
                                    </Button>
                                  ) : eligibility.eligible ? (
                                    <Button 
                                      className="flex-1"
                                      onClick={() => handleStartApplication(scholarship.id)}
                                      disabled={startApplication.isPending}
                                    >
                                      {startApplication.isPending ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      ) : (
                                        <ArrowRight className="mr-2 h-4 w-4" />
                                      )}
                                      Start Application
                                    </Button>
                                  ) : (
                                    <Button disabled className="flex-1" variant="outline">
                                      Not Eligible
                                    </Button>
                                  )}
                                  {scholarship.applicationUrl && (
                                    <Button variant="outline" asChild>
                                      <a href={scholarship.applicationUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4" />
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {applied ? (
                            <Button disabled variant="outline" size="icon">
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          ) : eligibility.eligible ? (
                            <Button 
                              size="icon"
                              onClick={() => handleStartApplication(scholarship.id)}
                              disabled={startApplication.isPending}
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button disabled variant="outline" size="icon">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="eligible" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholarships
                ?.filter((s) => getEligibilityStatus(s.id).eligible === true)
                .map((scholarship) => (
                  <Card key={scholarship.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{scholarship.title}</CardTitle>
                      <CardDescription>{scholarship.provider}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {scholarship.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-600 font-semibold">
                          {formatAmount(scholarship.amount)}
                        </span>
                        <span className="text-amber-600">
                          {getDeadlineInfo(scholarship.deadline)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="urgent" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {urgentScholarships?.map((scholarship) => (
                <Card key={scholarship.id} className="border-amber-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{scholarship.title}</CardTitle>
                        <CardDescription>{scholarship.provider}</CardDescription>
                      </div>
                      <Badge className="bg-amber-100 text-amber-700">
                        <Clock className="h-3 w-3 mr-1" />
                        Urgent
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {scholarship.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-600 font-semibold">
                        {formatAmount(scholarship.amount)}
                      </span>
                      <span className="text-red-600 font-semibold">
                        Due: {new Date(scholarship.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommended" className="space-y-4">
            <Card className="p-8 text-center">
              <Sparkles className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Recommendations</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Our AI analyzes your profile, transcript, and interests to find scholarships with the highest match probability.
              </p>
              <Link href="/dashboard">
                <Button>
                  <Target className="mr-2 h-4 w-4" />
                  View Personalized Matches
                </Button>
              </Link>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
