"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Scholarship } from "@/lib/schemas/scholarship.schema";
import { trpc } from "@/lib/trpc/client";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Filter,
  Loader2,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const STUDY_LEVELS = [
  "high_school",
  "undergraduate",
  "graduate",
  "postgraduate",
] as const;

const BENEFIT_OPTIONS = [
  "Tuition",
  "Accommodation",
  "Living Allowance",
  "Travel",
  "Books",
  "Laptop",
  "Research Grant",
];

const RISK_LEVELS = ["LOW", "MEDIUM", "HIGH"] as const;

export default function ScholarshipsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedBenefit, setSelectedBenefit] = useState<string>("");
  const [selectedRisk, setSelectedRisk] = useState<string>("");
  const [selectedDeadline, setSelectedDeadline] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedScholarship, setSelectedScholarship] =
    useState<Scholarship | null>(null);
  const [applicationText, setApplicationText] = useState("");

  const { data: scholarships, isLoading } = trpc.scholarship.getAll.useQuery();

  const { data: _userProfile } = trpc.profile.get.useQuery();
  const { data: matches } = trpc.match.getMatches.useQuery();
  const { data: applications } = trpc.workflow.getApplications.useQuery();
  const generateEssay = trpc.assistant.generateEssay.useMutation();
  const startApplication = trpc.workflow.startApplication.useMutation();
  const searchScholarships = trpc.scrape.scrape.useMutation();

  const filteredScholarships = useMemo(() => {
    if (!scholarships) return [];

    return scholarships.filter((scholarship) => {
      const query = searchQuery.toLowerCase();
      const benefitsText = Array.isArray(scholarship.benefits)
        ? scholarship.benefits.join(" ")
        : scholarship.benefits || "";
      const tagsText = (scholarship as any).tags
        ? (scholarship as any).tags.join(" ")
        : "";

      const matchesSearch =
        !query ||
        scholarship.title.toLowerCase().includes(query) ||
        scholarship.provider.toLowerCase().includes(query) ||
        (scholarship.description || "").toLowerCase().includes(query) ||
        benefitsText.toLowerCase().includes(query) ||
        tagsText.toLowerCase().includes(query);

      const scholarshipFields = (scholarship as any).fieldsAllowed
        ? (scholarship as any).fieldsAllowed
        : [];
      const matchesField =
        !selectedField ||
        scholarshipFields.some((f: string) =>
          f.toLowerCase().includes(selectedField.toLowerCase()),
        );

      const scholarshipLevels = (scholarship as any).educationLevels
        ? (scholarship as any).educationLevels
        : [];
      const matchesLevel =
        !selectedLevel || scholarshipLevels.includes(selectedLevel);

      const matchesBenefit =
        !selectedBenefit ||
        benefitsText.toLowerCase().includes(selectedBenefit.toLowerCase()) ||
        tagsText.toLowerCase().includes(selectedBenefit.toLowerCase());

      const matchesRisk =
        !selectedRisk || scholarship.risk?.riskLevel === selectedRisk;

      const matchesDeadline =
        !selectedDeadline ||
        (() => {
          if (!scholarship.deadline) return true;
          const deadline = new Date(scholarship.deadline);
          let now = new Date();
          now.setFullYear(2023);
          const daysLeft = Math.ceil(
            (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
          );

          switch (selectedDeadline) {
            case "active":
              return daysLeft > 0;
            case "expired":
              return daysLeft <= 0;
            case "7days":
              return daysLeft > 0 && daysLeft <= 7;
            case "30days":
              return daysLeft > 0 && daysLeft <= 30;
            default:
              return true;
          }
        })();

      return (
        matchesSearch &&
        matchesField &&
        matchesLevel &&
        matchesBenefit &&
        matchesRisk &&
        matchesDeadline
      );
    });
  }, [
    scholarships,
    searchQuery,
    selectedField,
    selectedLevel,
    selectedBenefit,
    selectedRisk,
    selectedDeadline,
  ]);

  const getEligibilityStatus = (scholarshipId: string) => {
    const match = matches?.find((m) => m.scholarshipId === scholarshipId);
    if (!match) return { eligible: null, reasons: [] };
    return { eligible: match.eligible, reasons: match.reasons };
  };

  const isApplied = (scholarshipId: string) => {
    return applications?.some((app) => app.scholarshipId === scholarshipId);
  };

  const getDeadlineInfo = (deadline: string) => {
    const date = new Date(deadline);
    if (isNaN(date.getTime())) return "-";
    const now = new Date();
    now.setFullYear(2023);
    const daysLeft = Math.ceil(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysLeft < 0) return "Expired";
    if (daysLeft === 0) return "Today";
    if (daysLeft === 1) return "Tomorrow";
    if (daysLeft <= 7) return `${daysLeft} days left`;
    return date.toLocaleDateString();
  };

  const getRiskIcon = (riskLevel?: string) => {
    switch (riskLevel) {
      case "LOW":
        return <ShieldCheck className="h-4 w-4 text-green-500" />;
      case "MEDIUM":
        return <ShieldQuestion className="h-4 w-4 text-amber-500" />;
      case "HIGH":
        return <ShieldAlert className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const handleGenerateEssay = async () => {
    if (!selectedScholarship) return;
    await generateEssay.mutateAsync({
      scholarshipId: selectedScholarship.uid,
      prompt: applicationText,
    });
  };

  const handleStartApplication = async (scholarshipId: string) => {
    await startApplication.mutateAsync({ scholarshipId });
  };

  const clearFilters = () => {
    setSelectedField("");
    setSelectedLevel("");
    setSelectedBenefit("");
    setSelectedRisk("");
    setSelectedDeadline("");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedField ||
    selectedLevel ||
    selectedBenefit ||
    selectedRisk ||
    selectedDeadline;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Discover Scholarships
          </h1>
          <p className="text-muted-foreground">
            Find and apply for scholarships that match your profile. AI-powered
            matching helps you focus on opportunities you&apos;re most likely to
            win.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {scholarships?.length || 0}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {matches?.filter((m) => m.eligible).length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Eligible</p>
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
                  <p className="text-2xl font-bold">$ 100K</p>
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
                variant={hasActiveFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {(selectedField ? 1 : 0) +
                      (selectedLevel ? 1 : 0) +
                      (selectedBenefit ? 1 : 0) +
                      (selectedRisk ? 1 : 0) +
                      (selectedDeadline ? 1 : 0)}
                  </Badge>
                )}
                {showFilters ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>

            {showFilters && (
              <div className="flex flex-row  justify-between   mt-4 pt-4 border-t">
                <div>
                  <Label className="mb-2 block text-sm">Study Level</Label>
                  <Select
                    value={selectedLevel}
                    onValueChange={setSelectedLevel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={null!}>All levels</SelectItem>
                      <SelectItem value="high_school">High School</SelectItem>
                      <SelectItem value="undergraduate">
                        Undergraduate
                      </SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="postgraduate">Postgraduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="">
                  <Label className="mb-2 block text-sm">Benefits</Label>
                  <Select
                    value={selectedBenefit}
                    onValueChange={setSelectedBenefit}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any benefit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={null!}>Any benefit</SelectItem>
                      {BENEFIT_OPTIONS.map((benefit) => (
                        <SelectItem key={benefit} value={benefit}>
                          {benefit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block text-sm">Deadline</Label>
                  <Select
                    value={selectedDeadline}
                    onValueChange={setSelectedDeadline}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={null!}>Any time</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="7days">Within 7 days</SelectItem>
                      <SelectItem value="30days">Within 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block text-sm">Risk Level</Label>
                  <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any risk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={null!}>Any risk</SelectItem>
                      {RISK_LEVELS.map((risk) => (
                        <SelectItem key={risk} value={risk}>
                          <div className="flex items-center gap-2">
                            {getRiskIcon(risk)}
                            {risk}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {showFilters && hasActiveFilters && (
              <div className="flex justify-end mt-4">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">
              All ({filteredScholarships.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredScholarships.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No scholarships found
                </h3>
                <p className="text-muted-foreground">
                  {hasActiveFilters
                    ? "Try adjusting your search or filters"
                    : "No scholarships available yet"}
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </Button>
                )}
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredScholarships.map((scholarship) => {
                  const eligibility = getEligibilityStatus(scholarship.uid);
                  const applied = isApplied(scholarship.uid);

                  return (
                    <Card
                      key={scholarship.uid}
                      className="group flex flex-col h-full overflow-hidden border border-border/60 rounded-2xl backdrop-blur transition-all hover:shadow-xl"
                    >
                      <CardHeader className="space-y-1.5 px-6 pt-6 pb-0">
                        <CardTitle className="text-xl font-semibold leading-tight line-clamp-2 min-h-16">
                          {scholarship.title}
                        </CardTitle>

                        <div className="flex items-center justify-between">
                          <CardDescription className="text-sm text-muted-foreground line-clamp-1">
                            {scholarship.provider}
                          </CardDescription>
                          <div className="flex items-center gap-2">
                            {getRiskIcon(scholarship.risk?.riskLevel)}
                            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                              <Clock className="h-4 w-4" />
                              {getDeadlineInfo(scholarship.deadline)}
                            </span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="flex flex-col gap-5 px-6 flex-1">
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {scholarship.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                          <span className="text-green-600 dark:text-green-400">
                            {(scholarship as any).amount?.value
                              ? `${(scholarship as any).amount.currency} ${(scholarship as any).amount.value.toLocaleString()}`
                              : scholarship.amount || scholarship.benefits}
                          </span>
                        </div>

                        {((scholarship as any).tags || []).length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {((scholarship as any).tags || [])
                              .slice(0, 4)
                              .map((tag: string) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs px-3 py-1 rounded-xl"
                                >
                                  {tag}
                                </Badge>
                              ))}
                          </div>
                        )}

                        {eligibility.reasons.length > 0 && (
                          <p className="text-xs text-red-500 dark:text-red-400 leading-relaxed">
                            {eligibility.reasons.join(" • ")}
                          </p>
                        )}
                      </CardContent>

                      <div className="border-t border-border/60 p-4 bg-muted/20 flex gap-3">
                        <Link
                          href={scholarship.applicationLink || "#"}
                          className="w-full block"
                        >
                          <Button className="rounded-xl font-medium w-full">
                            View Details
                          </Button>
                        </Link>

                        {applied ? (
                          <Button
                            disabled
                            variant="outline"
                            size="icon"
                            className="rounded-xl"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        ) : eligibility.eligible ? (
                          <Button
                            size="icon"
                            onClick={() =>
                              handleStartApplication(scholarship.uid)
                            }
                            disabled={startApplication.isPending}
                            className="rounded-xl"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            disabled
                            variant="outline"
                            size="icon"
                            className="rounded-xl"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
