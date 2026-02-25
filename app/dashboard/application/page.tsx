"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc/client";
import {
  ArrowUpRight,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

const STAGE_ORDER = ["essay", "group", "interview"] as const;
type Stage = (typeof STAGE_ORDER)[number];

const STATUS_STYLES: Record<
  string,
  { label: string; badge: string; tone: string }
> = {
  in_progress: {
    label: "In Progress",
    badge:
      "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    tone: "Keep going",
  },
  essay_passed: {
    label: "Essay Passed",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    tone: "Group stage unlocked",
  },
  group_passed: {
    label: "Group Passed",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    tone: "Interview unlocked",
  },
  accepted: {
    label: "Accepted",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    tone: "You did it",
  },
  completed: {
    label: "Completed",
    badge:
      "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
    tone: "Journey complete",
  },
  rejected: {
    label: "Not Selected",
    badge:
      "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
    tone: "Next cycle",
  },
};

const getProgressValue = (status: string, stage: Stage): number => {
  if (status === "accepted" || status === "completed") return 100;
  if (status === "rejected") return 70;

  const stageIndex = STAGE_ORDER.indexOf(stage);
  if (status === "group_passed") return 88;
  if (status === "essay_passed") return 58;

  return Math.min(100, Math.round(((stageIndex + 1) / STAGE_ORDER.length) * 100));
};

const getStageLabel = (stage: Stage): string => {
  switch (stage) {
    case "essay":
      return "Essay Stage";
    case "group":
      return "Group Case";
    case "interview":
      return "Interview";
    default:
      return "In Review";
  }
};

const formatDeadline = (deadline?: string): string => {
  if (!deadline) return "No deadline";
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return "No deadline";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getCountdownLabel = (deadline?: string): string => {
  if (!deadline) return "Open timeline";
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return "Open timeline";
  const now = new Date();
  const diff = Math.ceil(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diff < 0) return "Past deadline";
  if (diff === 0) return "Due today";
  if (diff === 1) return "Due tomorrow";
  if (diff <= 7) return `${diff} days left`;
  return `${diff} days left`;
};

export default function ApplicationLandingPage() {
  const { data: applications } = trpc.application.getUserApplications.useQuery();
  const { data: scholarships } = trpc.scholarship.getAll.useQuery();

  const scholarshipMap = useMemo(() => {
    const map = new Map<string, { title: string; provider?: string; deadline?: string }>();
    scholarships?.forEach((scholarship) => {
      if (!scholarship.uid) return;
      map.set(scholarship.uid, {
        title: scholarship.title,
        provider: scholarship.provider,
        deadline: scholarship.deadline,
      });
    });
    return map;
  }, [scholarships]);

  const totals = useMemo(() => {
    const total = applications?.length || 0;
    const active =
      applications?.filter(
        (app) => !["accepted", "rejected", "completed"].includes(app.status),
      ).length || 0;
    const wins =
      applications?.filter((app) => ["accepted", "completed"].includes(app.status))
        .length || 0;
    const interviews =
      applications?.filter(
        (app) => app.currentStage === "interview" && app.status !== "rejected",
      ).length || 0;
    return { total, active, wins, interviews };
  }, [applications]);

  const nextMilestone = useMemo(() => {
    if (!applications || applications.length === 0) return null;
    const activeApps = applications.filter(
      (app) => !["accepted", "rejected", "completed"].includes(app.status),
    );
    if (activeApps.length === 0) return null;

    const sorted = [...activeApps].sort((a, b) => {
      const aDeadline = scholarshipMap.get(a.scholarshipId)?.deadline;
      const bDeadline = scholarshipMap.get(b.scholarshipId)?.deadline;
      const aDate = aDeadline ? new Date(aDeadline).getTime() : Infinity;
      const bDate = bDeadline ? new Date(bDeadline).getTime() : Infinity;
      return aDate - bDate;
    });

    return sorted[0];
  }, [applications, scholarshipMap]);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-linear-to-br from-slate-950 via-slate-900 to-emerald-900 text-white">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="relative p-8 md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3 text-emerald-200">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-semibold tracking-wide uppercase">
                  Application Flightpath
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
                Every submission is a launch.
              </h1>
              <p className="mt-2 text-sm text-emerald-100/80 md:text-base">
                Track your progress, feel the momentum, and watch your next
                milestone arrive.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/scholarships">
                <Button className="bg-white text-slate-900 hover:bg-white/90">
                  Start a new application
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/scholarships">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Back to dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <Card className="border-0 bg-white/10 text-white">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/60">
                      Total
                    </p>
                    <p className="text-2xl font-semibold">{totals.total}</p>
                  </div>
                  <Target className="h-5 w-5 text-emerald-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/10 text-white">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/60">
                      Active
                    </p>
                    <p className="text-2xl font-semibold">{totals.active}</p>
                  </div>
                  <Flame className="h-5 w-5 text-amber-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/10 text-white">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/60">
                      Interviews
                    </p>
                    <p className="text-2xl font-semibold">{totals.interviews}</p>
                  </div>
                  <Clock className="h-5 w-5 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/10 text-white">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/60">
                      Wins
                    </p>
                    <p className="text-2xl font-semibold">{totals.wins}</p>
                  </div>
                  <Trophy className="h-5 w-5 text-amber-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-4 w-4 text-primary" />
              Momentum Boost
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Keep the streak alive. Each completed stage increases your signal
              score across future scholarships.
            </p>
            <div className="rounded-xl border border-dashed border-border p-4">
              <p className="text-xs uppercase text-muted-foreground">
                This week
              </p>
              <p className="text-lg font-semibold text-foreground">
                {totals.active} active applications
              </p>
              <p className="text-xs text-muted-foreground">
                Stay ready for sudden stage unlocks.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-primary" />
              Next Milestone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {nextMilestone ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Focus next on</p>
                  <p className="text-lg font-semibold text-foreground">
                    {scholarshipMap.get(nextMilestone.scholarshipId)?.title ||
                      nextMilestone.scholarshipId}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getStageLabel(nextMilestone.currentStage as Stage)}
                  </p>
                </div>
                <div className="rounded-xl bg-muted p-4">
                  <p className="text-xs uppercase text-muted-foreground">
                    Countdown
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {getCountdownLabel(
                      scholarshipMap.get(nextMilestone.scholarshipId)?.deadline,
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDeadline(
                      scholarshipMap.get(nextMilestone.scholarshipId)?.deadline,
                    )}
                  </p>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                You are all caught up. Start a new application to keep the
                momentum going.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              Anticipation Meter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 p-4 dark:from-amber-950 dark:via-orange-950 dark:to-rose-950">
              <p className="text-xs uppercase text-amber-700 dark:text-amber-200">
                Energy check
              </p>
              <p className="text-lg font-semibold text-foreground">
                {totals.active > 0 ? "Momentum rising" : "Ready to launch"}
              </p>
              <p className="text-xs text-muted-foreground">
                Your next stage unlock could appear any day.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Keep drafts and prep notes fresh.
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Your Applications
            </h2>
            <p className="text-sm text-muted-foreground">
              Track status, stage progress, and the next move.
            </p>
          </div>
        </div>

        {applications && applications.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {applications.map((app) => {
              const scholarship = scholarshipMap.get(app.scholarshipId);
              const statusStyle =
                STATUS_STYLES[app.status] || STATUS_STYLES.in_progress;
              const progress = getProgressValue(
                app.status,
                app.currentStage as Stage,
              );

              return (
                <Card
                  key={app.applicationId}
                  className="group border-border/60 bg-card/95 backdrop-blur transition-all hover:shadow-xl"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          {scholarship?.title || app.scholarshipId}
                        </CardTitle>
                        {scholarship?.provider && (
                          <p className="text-sm text-muted-foreground">
                            {scholarship.provider}
                          </p>
                        )}
                      </div>
                      <Badge className={statusStyle.badge}>
                        {statusStyle.label}
                      </Badge>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                      <div className="flex items-center justify-between text-xs uppercase text-muted-foreground">
                        <span>{getStageLabel(app.currentStage as Stage)}</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="mt-2" />
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-foreground">
                          {statusStyle.tone}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDeadline(scholarship?.deadline)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{getCountdownLabel(scholarship?.deadline)}</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                      Next up: {getStageLabel(app.currentStage as Stage)}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/dashboard/application/${app.applicationId}/${app.currentStage}`}
                        className="flex-1"
                      >
                        <Button className="w-full">
                          Continue application
                        </Button>
                      </Link>
                      <Link href="/dashboard/scholarships" className="flex-1">
                        <Button variant="outline" className="w-full">
                          Explore more
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-dashed border-border bg-muted/40">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-amber-100 to-rose-100 text-amber-600">
                <Sparkles className="h-7 w-7" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">
                  Your launchpad is ready
                </p>
                <p className="text-sm text-muted-foreground">
                  Start your first application and see your stages light up.
                </p>
              </div>
              <Link href="/dashboard/scholarships">
                <Button>Browse scholarships</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
