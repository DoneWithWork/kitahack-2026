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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Filter,
  GraduationCap,

  Search,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

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

interface ScholarshipExtras {
  tags?: string[];
  fieldsAllowed?: string[];
  educationLevels?: string[];
  amount?: string | { value?: number; currency?: string };
  minimumGrades?: Record<string, number>;
}

type EligibilityData = {
  eligible: boolean;
  reasons: string[];
  gradeDetails?: {
    userGradeCounts: Record<string, number>;
    rawGradeCounts: Record<string, number>;
    requiredGradeCounts: Record<string, number>;
    extractedCGPA: number | null;
    userGPA: number | null;
    requiredCGPA: number | null;
  };
};

export default function ScholarshipsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBenefit, setSelectedBenefit] = useState<string>("");
  const [selectedRisk, setSelectedRisk] = useState<string>("");
  const [selectedDeadline, setSelectedDeadline] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [startingId, setStartingId] = useState<string | null>(null);

  // Single combined query replaces 3 separate tRPC calls.
  // Before: getAll + checkEligibility + getUserApplications fired in parallel,
  // each independently fetching all scholarships from Firestore (3x) and
  // getUserApplications ran N sequential sub-queries (N+1 problem).
  // Now: one endpoint, one Firestore scholarships read, one collectionGroup
  // query for applications, one transcript read — all parallelised server-side.
  const { data: pageData, isLoading } =
    trpc.scholarship.getPageData.useQuery();

  const scholarships = pageData?.scholarships;
  const eligibilityData = useMemo(() => {
    if (!pageData) return undefined;
    return {
      eligibility: pageData.eligibility,
      hasTranscript: pageData.hasTranscript,
      subjectCount: pageData.subjectCount,
      userGPA: pageData.userGPA,
    };
  }, [pageData]);
  const eligibilityLoading = isLoading;
  const userApplications = pageData?.applications;

  const startApplication = trpc.application.startApplication.useMutation();
  const router = useRouter();

  const getEligibilityForScholarship = useCallback(
    (scholarshipId: string): EligibilityData => {
      if (!eligibilityData?.eligibility) {
        return { eligible: true, reasons: [] };
      }
      return (
        eligibilityData.eligibility[scholarshipId] ?? {
          eligible: true,
          reasons: [],
        }
      );
    },
    [eligibilityData],
  );

  const filteredScholarships = useMemo(() => {
    if (!scholarships) return [];

    return scholarships
      .filter((scholarship) => Boolean(scholarship.uid))
      .filter((scholarship) => {
        const query = searchQuery.toLowerCase();
        const ext = scholarship as typeof scholarship & ScholarshipExtras;
        const benefitsText = Array.isArray(scholarship.benefits)
          ? scholarship.benefits.join(" ")
          : scholarship.benefits || "";
        const tagsText = ext.tags ? ext.tags.join(" ") : "";

        const matchesSearch =
          !query ||
          scholarship.title.toLowerCase().includes(query) ||
          (scholarship.provider ?? "").toLowerCase().includes(query) ||
          (scholarship.description || "").toLowerCase().includes(query) ||
          benefitsText.toLowerCase().includes(query) ||
          tagsText.toLowerCase().includes(query);

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
            const now = new Date();
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
          matchesSearch && matchesBenefit && matchesRisk && matchesDeadline
        );
      });
  }, [
    scholarships,
    searchQuery,
    selectedBenefit,
    selectedRisk,
    selectedDeadline,
  ]);

  const {
    eligible: eligibleScholarships,
    notEligible: notEligibleScholarships,
  } = useMemo(() => {
    const eligible = filteredScholarships.filter((s) => {
      const elig = getEligibilityForScholarship(s.uid || "");
      return elig.eligible;
    });
    const notEligible = filteredScholarships.filter((s) => {
      const elig = getEligibilityForScholarship(s.uid || "");
      return !elig.eligible;
    });
    return { eligible, notEligible };
  }, [filteredScholarships, getEligibilityForScholarship]);

  const getDeadlineInfo = (deadline: string) => {
    const date = new Date(deadline);
    if (isNaN(date.getTime())) return "-";
    const now = new Date();
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

  const handleStartApplication = async (scholarshipId: string) => {
    if (!scholarshipId || startApplication.isPending) return;
    setStartingId(scholarshipId);
    try {
      const result = await startApplication.mutateAsync({ scholarshipId });
      router.push(`/dashboard/application/${result.applicationId}/essay`);
    } catch (error: unknown) {
      const err = error as { message?: string; data?: { code?: string } };
      if (err.message?.includes("already applied")) {
        const existingApp = userApplications?.find(
          (app) => app.scholarshipId === scholarshipId,
        );
        if (existingApp) {
          router.push(
            `/dashboard/application/${existingApp.applicationId}/${existingApp.currentStage}`,
          );
          return;
        }
      }
      const message = err.message || "An unexpected error occurred";
      alert(message);
      console.error("Error starting application:", error);
    } finally {
      setStartingId(null);
    }
  };

  const clearFilters = () => {
    setSelectedBenefit("");
    setSelectedRisk("");
    setSelectedDeadline("");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedBenefit || selectedRisk || selectedDeadline;

  const renderGradeRequirements = (
    scholarship: ScholarshipExtras & { uid?: string; eligibility?: string },
  ) => {
    const minGrades = scholarship.minimumGrades;
    const eligibility = getEligibilityForScholarship(scholarship.uid || "");
    const details = eligibility.gradeDetails;

    if (!minGrades && !details?.requiredCGPA) return null;

    const hasGradeReqs =
      minGrades && Object.values(minGrades).some((v) => v > 0);

    return (
      <div className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          <GraduationCap className="h-3.5 w-3.5" />
          Grade Requirements
        </div>

        {details?.requiredCGPA !== null &&
          details?.requiredCGPA !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Minimum CGPA</span>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    details?.userGPA !== null && details?.userGPA !== undefined
                      ? details.userGPA >= details.requiredCGPA
                        ? "border-green-500 text-green-600 dark:text-green-400"
                        : "border-red-500 text-red-600 dark:text-red-400"
                      : "border-muted-foreground"
                  }
                >
                  {details.requiredCGPA.toFixed(2)}
                </Badge>
                {details?.userGPA !== null &&
                  details?.userGPA !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      (You: {details.userGPA.toFixed(2)})
                    </span>
                  )}
              </div>
            </div>
          )}

        {hasGradeReqs && (
          <div className="flex flex-col gap-2">
            {Object.entries(minGrades!)
              .filter(([, count]) => count > 0)
              .map(([tier, count]) => {
                const userCount = details?.userGradeCounts?.[tier] ?? 0;
                const met = userCount >= count;
                const raw = details?.rawGradeCounts;

                // Build a breakdown string showing which raw tiers
                // contribute to this cumulative count.
                // For tier "A", show A* and A raw counts.
                // For tier "B", show A*, A, and B raw counts, etc.
                const tierOrder = ["A*", "A", "B", "C", "D", "F"];
                const tierIndex = tierOrder.indexOf(tier);
                const contributingTiers = tierOrder.slice(0, tierIndex + 1);
                const breakdownParts = raw
                  ? contributingTiers
                      .filter((t) => (raw[t] ?? 0) > 0)
                      .map((t) => `${raw[t]} ${t}`)
                  : [];
                const breakdownText = breakdownParts.length > 0
                  ? breakdownParts.join(", ")
                  : null;

                return (
                  <div
                    key={tier}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium border ${
                      eligibilityData?.hasTranscript
                        ? met
                          ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
                          : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold">{count} {tier}</span>
                      <span className="opacity-60">required</span>
                    </div>
                    {eligibilityData?.hasTranscript && (
                      <div className="flex items-center gap-1.5">
                        <span>
                          You: {breakdownText ? `${breakdownText} (${userCount} total)` : userCount}
                        </span>
                        {met ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {!eligibilityData?.hasTranscript && hasGradeReqs && (
          <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Upload your transcript to check grade eligibility
          </p>
        )}
      </div>
    );
  };

  const renderScholarshipCard = (
    scholarship: (typeof filteredScholarships)[0],
  ) => {
    const ext = scholarship as typeof scholarship & ScholarshipExtras;
    const eligibility = getEligibilityForScholarship(scholarship.uid || "");
    const userApp = userApplications?.find(
      (app) => app.scholarshipId === scholarship.uid,
    );
    const isCompleted =
      userApp?.status === "completed" || userApp?.status === "accepted";
    const detailsUrl =
      scholarship.applicationLink ||
      (scholarship as typeof scholarship & { applicationUrl?: string })
        .applicationUrl ||
      (scholarship as typeof scholarship & { sourceUrl?: string }).sourceUrl ||
      "";
    const isStarting =
      startApplication.isPending && startingId === scholarship.uid;

    return (
      <Card
        key={scholarship.uid}
        className="group flex flex-col h-full overflow-hidden border border-border/60 rounded-2xl backdrop-blur transition-all hover:shadow-xl bg-card"
      >
        <CardHeader className="space-y-1.5 px-6 pt-6 pb-0 shrink-0">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl font-semibold leading-tight line-clamp-2 h-[3.5rem] flex items-start">
              {scholarship.title}
            </CardTitle>
            <Badge
              variant={eligibility.eligible ? "default" : "destructive"}
              className={`shrink-0 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 mt-1 ${
                eligibility.eligible
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-100"
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 hover:bg-red-100"
              }`}
            >
              {eligibility.eligible ? "Eligible" : "Not Eligible"}
            </Badge>
          </div>

          <div className="flex items-center justify-between h-5">
            <CardDescription className="text-sm text-muted-foreground line-clamp-1">
              {scholarship.provider}
            </CardDescription>
            <div className="flex gap-2">
              {getRiskIcon(scholarship.risk?.riskLevel)}
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs shrink-0">
                <Clock className="h-3.5 w-3.5" />
                {getDeadlineInfo(scholarship.deadline ?? "")}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 gap-4 px-6 pt-3 overflow-hidden">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 h-[2.5rem]">
            {scholarship.description}
          </p>

          <div className="h-6">
            {scholarship.amount && (
              <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <DollarSign className="h-4 w-4" />
                {typeof scholarship.amount === "string"
                  ? scholarship.amount
                  : `${scholarship.amount}`}
              </div>
            )}
          </div>

          <div className="flex-1">
            {renderGradeRequirements(ext)}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm min-h-[2rem]">
            {(Array.isArray(scholarship.benefits)
              ? scholarship.benefits
              : String(scholarship.benefits || "")
                  .split(",")
                  .map((b) => b.trim())
                  .filter(Boolean)
            )
              .slice(0, 4)
              .map((benefit: string) => (
                <Badge
                  className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 text-xs"
                  variant="outline"
                  key={benefit}
                >
                  {benefit}
                </Badge>
              ))}
          </div>

          {!eligibility.eligible && eligibility.reasons.length > 0 && (
            <div className="rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-2.5 space-y-1 shrink-0">
              <p className="text-xs font-medium text-red-700 dark:text-red-300">
                Why you&apos;re not eligible:
              </p>
              {eligibility.reasons.map((reason, i) => (
                <p
                  key={i}
                  className="text-xs text-red-600 dark:text-red-400 flex items-start gap-1.5"
                >
                  <XCircle className="h-3 w-3 mt-0.5 shrink-0" />
                  {reason}
                </p>
              ))}
            </div>
          )}
        </CardContent>

        <div className="mt-auto border-t border-border/60 p-4 bg-muted/20 min-h-[95px] flex flex-col justify-center relative">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Link href={detailsUrl || "#"} className="w-full">
              <Button
                variant="outline"
                className="rounded-xl font-medium w-full h-10"
                disabled={!detailsUrl}
              >
                View Details
              </Button>
            </Link>

            {isCompleted ? (
              <Button disabled variant="outline" className="rounded-xl w-full h-10">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Completed
              </Button>
            ) : userApp ? (
              <Button
                onClick={() =>
                  router.push(
                    `/dashboard/application/${userApp.applicationId}/${userApp.currentStage}`,
                  )
                }
                className="rounded-xl w-full text-xs px-1 h-10"
              >
                Resume Application
              </Button>
            ) : eligibility.eligible ? (
              <Button
                onClick={() => handleStartApplication(scholarship.uid || "")}
                disabled={isStarting}
                className="rounded-xl w-full text-xs px-1 h-10"
              >
                {isStarting ? "Starting..." : "Begin Selection Process"}
              </Button>
            ) : (
              <Button
                disabled
                variant="outline"
                className="rounded-xl w-full opacity-60 h-10"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Not Eligible
              </Button>
            )}
          </div>
          {!isCompleted && !userApp && eligibility.eligible && (
            <p className="text-[10px] text-muted-foreground text-center uppercase tracking-tight opacity-70 absolute bottom-3 left-0 right-0">
              Multi-stage evaluation process
            </p>
          )}
        </div>
      </Card>
    );
  };

  const pageLoading = isLoading || eligibilityLoading;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Discover Scholarships
          </h1>
          <p className="text-muted-foreground">
            Find and apply for scholarships that match your profile. Eligibility
            is checked against your uploaded transcript and GPA.
          </p>
        </div>

        {pageLoading ? (
          <ScholarshipsPageSkeleton />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {filteredScholarships.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {eligibleScholarships.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Eligible</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-900 flex items-center justify-center">
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {notEligibleScholarships.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Not Eligible</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {eligibilityData?.hasTranscript ? (
                          <span className="text-green-600 dark:text-green-400 text-sm font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" /> Uploaded
                          </span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 text-sm font-semibold flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4" /> Missing
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">Transcript</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transcript Warning Banner */}
            {eligibilityData && !eligibilityData.hasTranscript && (
              <Card className="mb-6 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Upload your transcript for accurate eligibility matching
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Grade requirements cannot be verified without a transcript.
                      {eligibilityData.userGPA
                        ? ` Your GPA (${eligibilityData.userGPA}/100) is being used for CGPA checks.`
                        : " Set your GPA in your profile for CGPA-based checks."}
                    </p>
                  </div>
                  <Link href="/dashboard/documents">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300"
                    >
                      Upload Transcript
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Search and Filters */}
            <Card className="mb-3">
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
                        {(selectedBenefit ? 1 : 0) +
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
                  <div className="flex flex-row items-center justify-end gap-10 mt-4 pt-4 border-t">
                    <div>
                      <Label className="mb-2 block text-sm">Benefits</Label>
                      <Select
                        value={selectedBenefit}
                        onValueChange={setSelectedBenefit}
                      >
                        <SelectTrigger className="w-full">
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
                    {showFilters && hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="self-end"
                        onClick={clearFilters}
                      >
                        Clear all filters
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabs: All / Eligible / Not Eligible */}
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">
                  All ({filteredScholarships.length})
                </TabsTrigger>
                <TabsTrigger
                  value="eligible"
                  className="text-green-600 dark:text-green-400"
                >
                  Eligible ({eligibleScholarships.length})
                </TabsTrigger>
                <TabsTrigger
                  value="not-eligible"
                  className="text-red-600 dark:text-red-400"
                >
                  Not Eligible ({notEligibleScholarships.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {filteredScholarships.length === 0 ? (
                  <EmptyState
                    hasActiveFilters={!!hasActiveFilters}
                    onClear={clearFilters}
                  />
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredScholarships.map((s) => renderScholarshipCard(s))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="eligible" className="space-y-4">
                {eligibleScholarships.length === 0 ? (
                  <Card className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No eligible scholarships found
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      {!eligibilityData?.hasTranscript
                        ? "Upload your transcript and set your GPA to unlock eligibility matching."
                        : "Try improving your grades or check back later for new scholarships."}
                    </p>
                    {!eligibilityData?.hasTranscript && (
                      <Link href="/dashboard/documents">
                        <Button className="mt-4">Upload Transcript</Button>
                      </Link>
                    )}
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {eligibleScholarships.map((s) => renderScholarshipCard(s))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="not-eligible" className="space-y-4">
                {notEligibleScholarships.length === 0 ? (
                  <Card className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      You&apos;re eligible for all scholarships!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Great job! Check the &quot;Eligible&quot; tab to start
                      applying.
                    </p>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {notEligibleScholarships.map((s) =>
                      renderScholarshipCard(s),
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
}

function EmptyState({
  hasActiveFilters,
  onClear,
}: {
  hasActiveFilters: boolean;
  onClear: () => void;
}) {
  return (
    <Card className="p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No scholarships found</h3>
      <p className="text-muted-foreground">
        {hasActiveFilters
          ? "Try adjusting your search or filters"
          : "No scholarships available yet"}
      </p>
      {hasActiveFilters && (
        <Button variant="outline" className="mt-4" onClick={onClear}>
          Clear filters
        </Button>
      )}
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card className="flex flex-col h-full overflow-hidden border border-border/60 rounded-2xl">
      <CardHeader className="space-y-2 px-6 pt-6 pb-0">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-4 px-6 pt-3">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-5 w-28" />
        {/* Grade requirements area */}
        <div className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
        {/* Benefits badges */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardContent>
      <div className="border-t border-border/60 p-4 bg-muted/20 flex gap-3">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 flex-1 rounded-xl" />
      </div>
    </Card>
  );
}

function ScholarshipsPageSkeleton() {
  return (
    <>
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <Skeleton className="w-11 h-11 rounded-xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-7 w-12" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search Bar */}
      <Card className="mb-3">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex gap-4 border-b pb-1">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-28" />
        </div>

        {/* Scholarship Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </>
  );
}
