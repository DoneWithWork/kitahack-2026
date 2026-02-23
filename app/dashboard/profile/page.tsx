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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { auth } from "@/lib/firebase/client";
import {
  targetFields,
  incomeBrackets,
  commonInterests,
} from "@/lib/onboarding/constants";
import { trpc } from "@/lib/trpc/client";
import type { User } from "@/lib/schemas/user.schema";
import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  Edit3,
  FileText,
  GraduationCap,
  Heart,
  Loader2,
  Mail,

  Pencil,
  Save,
  School,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  User as UserIcon,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

function ProfileCompletionRing({
  percentage,
  size = 120,
}: {
  percentage: number;
  size?: number;
}) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/40"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">
          {percentage}%
        </span>
        <span className="text-[10px] text-muted-foreground">Complete</span>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  trend?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
      <div
        className={`absolute top-0 right-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20 ${color}`}
      />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <div className="mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">{trend}</span>
            </div>
          )}
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

function InterestTag({
  label,
  removable = false,
  onRemove,
}: {
  label: string;
  removable?: boolean;
  onRemove?: () => void;
}) {
  return (
    <span className="group/tag relative inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary/10 hover:border-primary/30 hover:shadow-sm hover:shadow-primary/10">
      <Sparkles className="h-3 w-3 opacity-60" />
      {label}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 opacity-0 transition-opacity group-hover/tag:opacity-100 hover:bg-primary/20"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

function ProfileField({
  label,
  value,
  icon: Icon,
  editable = false,
  onEdit,
}: {
  label: string;
  value: string | undefined;
  icon: React.ElementType;
  editable?: boolean;
  onEdit?: () => void;
}) {
  return (
    <div className="group flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-muted/50">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-foreground truncate">
          {value || "Not set"}
        </p>
      </div>
      {editable && (
        <button
          onClick={onEdit}
          className="rounded-lg p-2 opacity-0 transition-all group-hover:opacity-100 hover:bg-primary/10"
        >
          <Pencil className="h-4 w-4 text-primary" />
        </button>
      )}
    </div>
  );
}

function AchievementBadge({
  title,
  description,
  icon: Icon,
  unlocked,
  color,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  color: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${
        unlocked
          ? "border-primary/20 bg-card hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
          : "border-border/50 bg-muted/30 opacity-50 grayscale"
      }`}
    >
      {unlocked && (
        <div
          className={`absolute top-0 right-0 h-16 w-16 -translate-y-4 translate-x-4 rounded-full opacity-20 blur-xl ${color}`}
        />
      )}
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            unlocked ? color : "bg-muted"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${unlocked ? "text-white" : "text-muted-foreground"}`}
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-foreground text-sm">{title}</p>
            {unlocked && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const currentUser = auth.currentUser;
  const profileQuery = trpc.profile.get.useQuery();
  const updateMutation = trpc.profile.update.useMutation({
    onSuccess: () => {
      profileQuery.refetch();
      setEditDialogOpen(false);
    },
  });

  const { data: matches } = trpc.match.getMatches.useQuery();
  const { data: applications } = trpc.workflow.getApplications.useQuery();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const profile = profileQuery.data as User | undefined;

  const editFormDefaults = useMemo(() => ({
    name: profile?.name || "",
    currentSchool: profile?.currentSchool || "",
    graduationYear: profile?.graduationYear || 2026,
    targetField: profile?.targetField || "",
    incomeBracket: (profile?.incomeBracket || "medium") as "low" | "medium" | "high",
    interests: profile?.interests || [] as string[],
    goals: profile?.goals || "",
    gpa: profile?.gpa || 0,
  }), [profile]);

  const [editForm, setEditForm] = useState(editFormDefaults);

  const openEditDialog = () => {
    setEditForm(editFormDefaults);
    setEditDialogOpen(true);
  };

  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    const fields = [
      profile.name,
      profile.email,
      profile.currentSchool,
      profile.graduationYear,
      profile.targetField,
      profile.incomeBracket,
      profile.interests && profile.interests.length > 0,
      profile.goals,
      profile.gpa,
      profile.transcriptUploaded,
      profile.documentsUploaded,
      profile.onboardingCompleted,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [profile]);

  const achievements = useMemo(() => {
    if (!profile) return [];
    return [
      {
        title: "Profile Pioneer",
        description: "Completed your profile setup",
        icon: UserIcon,
        unlocked: profile.onboardingCompleted,
        color: "bg-blue-500",
      },
      {
        title: "Scholar Seeker",
        description: "Found your first scholarship match",
        icon: Target,
        unlocked: (matches?.length || 0) > 0,
        color: "bg-purple-500",
      },
      {
        title: "First Steps",
        description: "Submitted your first application",
        icon: Briefcase,
        unlocked: (applications?.length || 0) > 0,
        color: "bg-green-500",
      },
      {
        title: "Document Pro",
        description: "Uploaded all required documents",
        icon: FileText,
        unlocked: profile.documentsUploaded,
        color: "bg-amber-500",
      },
      {
        title: "Academic Star",
        description: "Uploaded your transcript",
        icon: Star,
        unlocked: profile.transcriptUploaded,
        color: "bg-rose-500",
      },
      {
        title: "Goal Setter",
        description: "Defined your career goals",
        icon: Trophy,
        unlocked: Boolean(profile.goals && profile.goals.length > 10),
        color: "bg-cyan-500",
      },
    ];
  }, [profile, matches, applications]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const handleSave = async () => {
    await updateMutation.mutateAsync({
      name: editForm.name,
      currentSchool: editForm.currentSchool || undefined,
      graduationYear: editForm.graduationYear || undefined,
      targetField: editForm.targetField || undefined,
      incomeBracket: editForm.incomeBracket,
      interests: editForm.interests,
      goals: editForm.goals || undefined,
      gpa: editForm.gpa || undefined,
    });
  };

  const toggleInterest = useCallback(
    (interest: string) => {
      setEditForm((prev) => ({
        ...prev,
        interests: prev.interests.includes(interest)
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      }));
    },
    [],
  );

  const targetFieldLabel =
    targetFields.find((f) => f.value === profile?.targetField)?.label ||
    profile?.targetField ||
    "Not set";

  const incomeBracketLabel =
    incomeBrackets.find((b) => b.value === profile?.incomeBracket)?.label ||
    profile?.incomeBracket ||
    "Not set";

  if (profileQuery.isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-primary/20" />
            <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Card className="max-w-md border-destructive/20 bg-destructive/5">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <UserIcon className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Profile Not Found
            </h3>
            <p className="text-sm text-muted-foreground">
              We couldn&apos;t load your profile. Please try refreshing.
            </p>
            <Button
              onClick={() => profileQuery.refetch()}
              className="mt-2"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* ─── Hero Section ─── */}
      <div className="relative overflow-hidden rounded-3xl">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTR2LTJoNHptMC0zMHYyaC00VjRoNHptMCAxMHYyaC00di0yaDR6bTAgMTB2MmgtNHYtMmg0em0tMTAgNHYyaC00di0yaDR6bTAgMTB2MmgtNHYtMmg0em0wIDEwdjJoLTR2LTJoNHptMC0zMHYyaC00di0yaDR6bTAtMTB2MmgtNHYtMmg0em0xMCA0djJoLTR2LTJoNHptMCAxMHYyaC00di0yaDR6bTAgMTB2MmgtNHYtMmg0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/80 to-transparent" />

        <div className="relative px-6 pb-8 pt-10 sm:px-10 sm:pt-14">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:gap-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-white/30 to-white/10 blur-sm" />
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden">
                {currentUser?.photoURL ? (
                  <Image
                    src={currentUser.photoURL}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/20 text-white">
                    <span className="text-4xl sm:text-5xl font-bold">
                      {profile.name?.charAt(0)?.toUpperCase() || "S"}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-4 w-4 text-slate-600" />
              </div>
              {/* Online Indicator */}
              <div className="absolute top-2 right-2 h-4 w-4 rounded-full border-2 border-white bg-green-400 shadow-lg" />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left mb-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
                  {profile.name}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  {profile.role === "admin_simulated" && (
                    <Badge className="bg-amber-400/90 text-amber-950 border-0 shadow-lg">
                      <Shield className="mr-1 h-3 w-3" />
                      Admin
                    </Badge>
                  )}
                  {profile.onboardingCompleted && (
                    <Badge className="bg-green-400/90 text-green-950 border-0 shadow-lg">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              <p className="mt-1 text-base text-blue-100/90">
                {profile.email}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-white/70">
                {profile.currentSchool && (
                  <span className="flex items-center gap-1.5">
                    <School className="h-4 w-4" />
                    {profile.currentSchool}
                  </span>
                )}
                {profile.targetField && (
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    {targetFieldLabel}
                  </span>
                )}
                {profile.graduationYear && (
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4" />
                    Class of {profile.graduationYear}
                  </span>
                )}
              </div>
            </div>

            {/* Edit Profile Button */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="bg-white/20 text-white border-white/20 hover:bg-white/30 backdrop-blur-sm shadow-lg"
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Update your profile information to improve scholarship
                    matching accuracy.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-school">Current School</Label>
                      <Input
                        id="edit-school"
                        value={editForm.currentSchool}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            currentSchool: e.target.value,
                          })
                        }
                        placeholder="e.g., University of Malaya"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-year">Graduation Year</Label>
                      <Select
                        value={String(editForm.graduationYear)}
                        onValueChange={(v) =>
                          setEditForm({
                            ...editForm,
                            graduationYear: Number(v),
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => 2024 + i).map(
                            (year) => (
                              <SelectItem key={year} value={String(year)}>
                                {year}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Target Field</Label>
                      <Select
                        value={editForm.targetField}
                        onValueChange={(v) =>
                          setEditForm({ ...editForm, targetField: v })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {targetFields.map((field) => (
                            <SelectItem key={field.value} value={field.value}>
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Income Bracket</Label>
                      <Select
                        value={editForm.incomeBracket}
                        onValueChange={(v) =>
                          setEditForm({
                            ...editForm,
                            incomeBracket: v as "low" | "medium" | "high",
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {incomeBrackets.map((bracket) => (
                            <SelectItem
                              key={bracket.value}
                              value={bracket.value}
                            >
                              {bracket.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>GPA (out of 100)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={editForm.gpa || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          gpa: Number(e.target.value),
                        })
                      }
                      placeholder="e.g., 85"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Interests</Label>
                    <div className="flex flex-wrap gap-2">
                      {commonInterests.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                            editForm.interests.includes(interest)
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-goals">Career Goals</Label>
                    <Textarea
                      id="edit-goals"
                      value={editForm.goals}
                      onChange={(e) =>
                        setEditForm({ ...editForm, goals: e.target.value })
                      }
                      placeholder="Describe your career aspirations and what you hope to achieve..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                    className="gap-2"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* ─── Stats Row ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          label="Scholarship Matches"
          value={matches?.length || 0}
          color="bg-blue-500"
          trend={
            matches && matches.length > 0
              ? `${matches.filter((m) => m.eligible).length} eligible`
              : undefined
          }
        />
        <StatCard
          icon={Briefcase}
          label="Applications"
          value={applications?.length || 0}
          color="bg-purple-500"
        />
        <StatCard
          icon={Trophy}
          label="Achievements"
          value={`${unlockedCount}/${achievements.length}`}
          color="bg-amber-500"
        />
        <StatCard
          icon={Zap}
          label="Profile Score"
          value={`${profileCompletion}%`}
          color="bg-cyan-500"
          trend={
            profileCompletion >= 80
              ? "Excellent"
              : profileCompletion >= 50
                ? "Good progress"
                : "Keep going"
          }
        />
      </div>

      {/* ─── Main Content (Tabs) ─── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* ─── Overview Tab ─── */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: Profile Completion + Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Completion */}
              {profileCompletion < 100 && (
                <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                  <CardContent className="flex flex-col sm:flex-row items-center gap-6 p-6">
                    <ProfileCompletionRing percentage={profileCompletion} />
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg font-semibold text-foreground">
                        Complete Your Profile
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        A complete profile helps us find the best scholarship
                        matches for you. You&apos;re{" "}
                        {100 - profileCompletion}% away from a perfect profile.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {!profile.currentSchool && (
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-primary/10"
                            onClick={() => openEditDialog()}
                          >
                            Add school
                          </Badge>
                        )}
                        {!profile.gpa && (
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-primary/10"
                            onClick={() => openEditDialog()}
                          >
                            Add GPA
                          </Badge>
                        )}
                        {(!profile.interests ||
                          profile.interests.length === 0) && (
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-primary/10"
                            onClick={() => openEditDialog()}
                          >
                            Add interests
                          </Badge>
                        )}
                        {!profile.goals && (
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-primary/10"
                            onClick={() => openEditDialog()}
                          >
                            Add goals
                          </Badge>
                        )}
                        {!profile.transcriptUploaded && (
                          <Badge variant="outline">Upload transcript</Badge>
                        )}
                        {!profile.documentsUploaded && (
                          <Badge variant="outline">Upload documents</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Personal Info */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Personal Information
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                      onClick={() => openEditDialog()}
                    >
                      <Edit3 className="mr-1.5 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-1 sm:grid-cols-2">
                  <ProfileField
                    label="Full Name"
                    value={profile.name}
                    icon={UserIcon}
                  />
                  <ProfileField
                    label="Email Address"
                    value={profile.email}
                    icon={Mail}
                  />
                  <ProfileField
                    label="Current School"
                    value={profile.currentSchool}
                    icon={School}
                    editable
                    onEdit={() => openEditDialog()}
                  />
                  <ProfileField
                    label="Graduation Year"
                    value={
                      profile.graduationYear
                        ? String(profile.graduationYear)
                        : undefined
                    }
                    icon={GraduationCap}
                    editable
                    onEdit={() => openEditDialog()}
                  />
                  <ProfileField
                    label="Target Field"
                    value={targetFieldLabel}
                    icon={BookOpen}
                    editable
                    onEdit={() => openEditDialog()}
                  />
                  <ProfileField
                    label="Income Bracket"
                    value={incomeBracketLabel}
                    icon={Briefcase}
                    editable
                    onEdit={() => openEditDialog()}
                  />
                </CardContent>
              </Card>

              {/* Interests */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Interests & Passions
                      </CardTitle>
                      <CardDescription>
                        Your interests help us match you with relevant
                        scholarships
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                      onClick={() => openEditDialog()}
                    >
                      <Edit3 className="mr-1.5 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {profile.interests && profile.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2.5">
                      {profile.interests.map((interest) => (
                        <InterestTag key={interest} label={interest} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/60 bg-muted/30 py-10">
                      <Heart className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        No interests added yet
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog()}
                      >
                        Add Interests
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Career Goals */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Career Goals</CardTitle>
                      <CardDescription>
                        Your aspirations and what drives you forward
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                      onClick={() => openEditDialog()}
                    >
                      <Edit3 className="mr-1.5 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {profile.goals ? (
                    <div className="relative rounded-xl border border-border/60 bg-muted/30 p-5">
                      <Sparkles className="absolute top-4 right-4 h-5 w-5 text-primary/30" />
                      <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                        {profile.goals}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/60 bg-muted/30 py-10">
                      <Target className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        No career goals defined yet
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog()}
                      >
                        Set Goals
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats Card */}
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 p-6">
                  <div className="flex items-center gap-3 text-white">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-white/60">Member Since</p>
                      <p className="font-semibold text-white">
                        {new Date(profile.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Profile Status
                    </span>
                    <Badge
                      className={
                        profile.onboardingCompleted
                          ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                          : "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300"
                      }
                    >
                      {profile.onboardingCompleted ? "Active" : "Incomplete"}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Transcript
                    </span>
                    <Badge
                      className={
                        profile.transcriptUploaded
                          ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {profile.transcriptUploaded ? "Uploaded" : "Pending"}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Documents
                    </span>
                    <Badge
                      className={
                        profile.documentsUploaded
                          ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {profile.documentsUploaded ? "Uploaded" : "Pending"}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Last Updated
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {new Date(profile.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* GPA Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Academic Performance
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {profile.gpa
                          ? `${profile.gpa}/100`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  {profile.gpa ? (
                    <>
                      <Progress value={profile.gpa} className="h-2.5" />
                      <p className="mt-2 text-xs text-muted-foreground">
                        {profile.gpa >= 80
                          ? "Outstanding academic performance"
                          : profile.gpa >= 60
                            ? "Good academic standing"
                            : "Room for improvement"}
                      </p>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => openEditDialog()}
                    >
                      Add GPA
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Achievements Preview */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Achievements</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                      onClick={() => setActiveTab("achievements")}
                    >
                      View All
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {achievements
                    .filter((a) => a.unlocked)
                    .slice(0, 3)
                    .map((achievement) => (
                      <div
                        key={achievement.title}
                        className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors"
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${achievement.color}`}
                        >
                          <achievement.icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {achievement.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  {unlockedCount === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      No achievements unlocked yet. Keep going!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ─── Academic Tab ─── */}
        <TabsContent value="academic" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Academic Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Academic Profile
                </CardTitle>
                <CardDescription>
                  Your academic journey at a glance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
                    <div className="flex items-center gap-3">
                      <School className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Institution
                        </p>
                        <p className="font-medium text-foreground">
                          {profile.currentSchool || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Expected Graduation
                        </p>
                        <p className="font-medium text-foreground">
                          {profile.graduationYear || "Not specified"}
                        </p>
                      </div>
                    </div>
                    {profile.graduationYear && (
                      <Badge variant="outline">
                        {profile.graduationYear - new Date().getFullYear() > 0
                          ? `${profile.graduationYear - new Date().getFullYear()} years left`
                          : "Graduated"}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Field of Study
                        </p>
                        <p className="font-medium text-foreground">
                          {targetFieldLabel}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* GPA Detailed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Academic Performance
                </CardTitle>
                <CardDescription>
                  Your GPA and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profile.gpa ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <ProfileCompletionRing
                          percentage={profile.gpa}
                          size={160}
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold text-foreground">
                            {profile.gpa}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            out of 100
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl bg-muted/50 p-4 text-center">
                      <p className="text-sm font-medium text-foreground">
                        {profile.gpa >= 90
                          ? "Dean's List Material"
                          : profile.gpa >= 80
                            ? "Strong Academic Record"
                            : profile.gpa >= 70
                              ? "Solid Performance"
                              : profile.gpa >= 60
                                ? "Meets Requirements"
                                : "Building Foundation"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {profile.gpa >= 80
                          ? "You qualify for most merit-based scholarships"
                          : "Some scholarships may have GPA requirements above your current level"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 py-10">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <TrendingUp className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground">
                        No GPA recorded
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Add your GPA to see how you match with academic
                        scholarships
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => openEditDialog()}
                    >
                      Add GPA
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Documents
                </CardTitle>
                <CardDescription>
                  Required documents for scholarship applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={`flex items-center gap-4 rounded-xl border p-4 transition-colors ${
                    profile.transcriptUploaded
                      ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30"
                      : "border-border bg-card"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      profile.transcriptUploaded
                        ? "bg-green-500"
                        : "bg-muted"
                    }`}
                  >
                    {profile.transcriptUploaded ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : (
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      Academic Transcript
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {profile.transcriptUploaded
                        ? "Successfully uploaded and verified"
                        : "Required for scholarship matching"}
                    </p>
                  </div>
                  {profile.transcriptUploaded && (
                    <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                      Done
                    </Badge>
                  )}
                </div>
                <div
                  className={`flex items-center gap-4 rounded-xl border p-4 transition-colors ${
                    profile.documentsUploaded
                      ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30"
                      : "border-border bg-card"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      profile.documentsUploaded
                        ? "bg-green-500"
                        : "bg-muted"
                    }`}
                  >
                    {profile.documentsUploaded ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : (
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      Supporting Documents
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {profile.documentsUploaded
                        ? "Certificates and credentials uploaded"
                        : "Certificates, awards, and other documents"}
                    </p>
                  </div>
                  {profile.documentsUploaded && (
                    <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                      Done
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Scholarship Readiness */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Scholarship Readiness
                </CardTitle>
                <CardDescription>
                  How prepared you are for scholarship applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  {
                    label: "Profile Completion",
                    value: profileCompletion,
                    color: "bg-blue-500",
                  },
                  {
                    label: "Document Readiness",
                    value:
                      ((profile.transcriptUploaded ? 1 : 0) +
                        (profile.documentsUploaded ? 1 : 0)) *
                      50,
                    color: "bg-green-500",
                  },
                  {
                    label: "Academic Standing",
                    value: profile.gpa || 0,
                    color: "bg-purple-500",
                  },
                  {
                    label: "Goal Clarity",
                    value: profile.goals
                      ? Math.min(100, profile.goals.length * 2)
                      : 0,
                    color: "bg-amber-500",
                  },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {metric.label}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {metric.value}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${metric.color}`}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── Achievements Tab ─── */}
        <TabsContent value="achievements" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Your Achievements
              </h2>
              <p className="text-muted-foreground mt-1">
                Track your progress and unlock badges as you complete your
                scholarship journey
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="font-bold text-primary">
                {unlockedCount}/{achievements.length}
              </span>
            </div>
          </div>

          <Progress
            value={(unlockedCount / achievements.length) * 100}
            className="h-3"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <AchievementBadge key={achievement.title} {...achievement} />
            ))}
          </div>

          {/* Motivational Section */}
          {unlockedCount < achievements.length && (
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5">
              <CardContent className="flex flex-col sm:flex-row items-center gap-6 p-8">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-500">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-foreground">
                    {achievements.length - unlockedCount} achievements remaining
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Complete your profile, upload documents, and apply for
                    scholarships to unlock all achievements. Every step brings
                    you closer to your goals!
                  </p>
                </div>
                <Button
                  className="shrink-0"
                  onClick={() => openEditDialog()}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Continue Setup
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ─── Settings Tab ─── */}
        <TabsContent value="settings" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Your account details and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    User ID
                  </p>
                  <p className="mt-1 font-mono text-sm text-foreground truncate">
                    {profile.uid}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Email
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {profile.email}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Authentication Provider
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white shadow-sm">
                      <svg viewBox="0 0 24 24" className="h-4 w-4">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      Google Sign-In
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Account Role
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge
                      className={
                        profile.role === "admin_simulated"
                          ? "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300"
                          : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      }
                    >
                      {profile.role === "admin_simulated"
                        ? "Admin (Simulated)"
                        : "Student"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Account Timeline
                </CardTitle>
                <CardDescription>
                  Key milestones in your journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-6">
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />

                  <div className="relative flex gap-4 pl-10">
                    <div className="absolute left-2 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-background">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Account Created
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(profile.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  {profile.onboardingCompleted && (
                    <div className="relative flex gap-4 pl-10">
                      <div className="absolute left-2 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-green-500 bg-background">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Onboarding Completed
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Profile setup finished
                        </p>
                      </div>
                    </div>
                  )}

                  {profile.transcriptUploaded && (
                    <div className="relative flex gap-4 pl-10">
                      <div className="absolute left-2 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-purple-500 bg-background">
                        <div className="h-2 w-2 rounded-full bg-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Transcript Uploaded
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Academic records added
                        </p>
                      </div>
                    </div>
                  )}

                  {profile.documentsUploaded && (
                    <div className="relative flex gap-4 pl-10">
                      <div className="absolute left-2 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-amber-500 bg-background">
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Documents Uploaded
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Certificates and credentials added
                        </p>
                      </div>
                    </div>
                  )}

                  {(matches?.length || 0) > 0 && (
                    <div className="relative flex gap-4 pl-10">
                      <div className="absolute left-2 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-cyan-500 bg-background">
                        <div className="h-2 w-2 rounded-full bg-cyan-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          First Scholarship Matched
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {matches?.length} scholarship
                          {(matches?.length || 0) > 1 ? "s" : ""} found
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="relative flex gap-4 pl-10">
                    <div className="absolute left-2 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-muted-foreground/30 bg-background">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Last Profile Update
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(profile.updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Manage your profile and application settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Button
                    variant="outline"
                    className="h-auto flex-col gap-2 p-5 hover:bg-primary/5 hover:border-primary/20"
                    onClick={() => openEditDialog()}
                  >
                    <Edit3 className="h-5 w-5 text-primary" />
                    <span className="font-medium">Edit Profile</span>
                    <span className="text-xs text-muted-foreground">
                      Update your personal information
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex-col gap-2 p-5 hover:bg-primary/5 hover:border-primary/20"
                    asChild
                  >
                    <a href="/dashboard/documents">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-medium">Manage Documents</span>
                      <span className="text-xs text-muted-foreground">
                        Upload or update documents
                      </span>
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex-col gap-2 p-5 hover:bg-primary/5 hover:border-primary/20"
                    asChild
                  >
                    <a href="/dashboard/scholarships">
                      <Award className="h-5 w-5 text-primary" />
                      <span className="font-medium">Find Scholarships</span>
                      <span className="text-xs text-muted-foreground">
                        Browse available scholarships
                      </span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
