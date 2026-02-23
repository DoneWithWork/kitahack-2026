"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, Clock, FileText, Users, Video, AlertTriangle, ArrowLeft, Shield } from "lucide-react";
import { AdminModeToggle } from "@/components/admin-mode-toggle";

const STAGE_LABELS = {
  essay: "Essay",
  group: "Group Case Study",
  interview: "Personal Interview",
};

const STATUS_LABELS: Record<string, string> = {
  in_progress: "In Progress",
  essay_passed: "Essay Passed",
  group_passed: "Group Passed",
  accepted: "Accepted",
  rejected: "Rejected",
  completed: "Completed",
};

export default function AdminDashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const applicationId = searchParams.get("applicationId");

  const [notes, setNotes] = useState("");
  const [isApproving, setIsApproving] = useState(false);

  const { data: roleData } = trpc.admin.getUserRole.useQuery(undefined, {
    enabled: !!applicationId,
  });

  const { data: adminData, isLoading, refetch } = trpc.admin.getApplicationForAdmin.useQuery(
    { applicationId: applicationId! },
    { enabled: !!applicationId && roleData?.role === "admin_simulated" }
  );

  const approveMutation = trpc.admin.approveStage.useMutation({
    onSuccess: () => {
      setIsApproving(false);
      setNotes("");
      refetch();
    },
    onError: () => {
      setIsApproving(false);
    },
  });

  useEffect(() => {
    if (roleData && roleData.role !== "admin_simulated") {
      router.push("/dashboard");
    }
  }, [roleData, router]);

  if (!applicationId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-lg font-medium">No Application Selected</p>
          <p className="text-muted-foreground">Please select an application from a stage page.</p>
          <Button className="mt-4" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (roleData?.role !== "admin_simulated") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-lg font-medium">Admin Mode Not Enabled</p>
          <p className="text-muted-foreground">Please enable admin mode from a stage page.</p>
          <Button className="mt-4" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-lg font-medium">Application Not Found</p>
          <p className="text-muted-foreground">The application could not be loaded.</p>
        </div>
      </div>
    );
  }

  const { application, scholarship } = adminData;
  const currentStage = application.currentStage;
  const currentStageData = application.stages[currentStage];
  const isReviewed = currentStageData.checked;

  const handleApprove = async (passed: boolean) => {
    setIsApproving(true);
    await approveMutation.mutateAsync({
      applicationId,
      passed,
      notes: notes || undefined,
    });
  };

  const stages = [
    {
      key: "essay",
      label: "Essay",
      status: application.stages.essay.checked ? (application.stages.essay.passed ? "passed" : "failed") : "pending",
      icon: FileText,
    },
    {
      key: "group",
      label: "Group Case Study",
      status: application.stages.group.checked ? (application.stages.group.passed ? "passed" : "failed") : "pending",
      icon: Users,
    },
    {
      key: "interview",
      label: "Personal Interview",
      status: application.stages.interview.checked ? (application.stages.interview.passed ? "passed" : "failed") : "pending",
      icon: Video,
    },
  ];

  return (
    <div className="min-h-screen bg-purple-50/30 dark:bg-purple-950/10">
      <div className="p-4 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/application/${applicationId}/${currentStage}`)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-purple-600" />
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              </div>
              <p className="text-muted-foreground">Hackathon Simulation Mode</p>
            </div>
          </div>
          <AdminModeToggle applicationId={applicationId} />
        </div>

        <div className="bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <p className="text-sm text-purple-800 dark:text-purple-200">
            <strong>Admin Simulation Active</strong> - You are in hackathon demo mode. Actions here simulate administrator approval.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Scholarship</p>
                  <p className="font-medium">{scholarship.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={application.status === "rejected" ? "destructive" : "default"}>
                    {STATUS_LABELS[application.status] || application.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Stage</p>
                  <p className="font-medium">{STAGE_LABELS[currentStage]}</p>
                </div>
                {application.adminAudit && (
                  <div>
                    <p className="text-sm text-muted-foreground">Last Approved</p>
                    <p className="text-xs">
                      {new Date(application.adminAudit.lastApprovedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stage Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stages.map((stage) => (
                  <div key={stage.key} className="flex items-center gap-3">
                    {stage.status === "passed" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : stage.status === "failed" ? (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className={stage.status === "pending" ? "text-muted-foreground" : ""}>
                      {stage.label}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{STAGE_LABELS[currentStage]} Content</CardTitle>
                <CardDescription>Review the applicant&apos;s submission</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentStage === "essay" && (
                  <div className="space-y-2">
                    <p className="font-medium">Essay Question:</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{scholarship.essayQuestion}</p>
                    <Separator />
                    <p className="font-medium">Applicant&apos;s Response:</p>
                    <div className="bg-muted p-4 rounded-lg min-h-[200px] whitespace-pre-wrap">
                      {application.stages.essay.draft || "No draft submitted"}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">Submitted: {application.stages.essay.submitted ? "Yes" : "No"}</Badge>
                      <Badge variant="outline">AI Used: {application.stages.essay.aiUsed ? "Yes" : "No"}</Badge>
                    </div>
                  </div>
                )}

                {currentStage === "group" && (
                  <div className="space-y-2">
                    <p className="font-medium">Group Task Description:</p>
                    <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                      {scholarship.groupTaskDescription}
                    </div>
                    <Separator />
                    <div className="flex gap-2">
                      <Badge variant="outline">AI Preparation Used: {application.stages.group.aiPreparationUsed ? "Yes" : "No"}</Badge>
                    </div>
                  </div>
                )}

                {currentStage === "interview" && (
                  <div className="space-y-2">
                    <p className="font-medium">Interview Focus Areas:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {scholarship.interviewFocusAreas.map((area, idx) => (
                        <li key={idx}>{area}</li>
                      ))}
                    </ul>
                    <Separator />
                    <p className="font-medium">Interviewer:</p>
                    {application.stages.interview.interviewer ? (
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="font-medium">{application.stages.interview.interviewer.name}</p>
                        <p className="text-sm text-muted-foreground">{application.stages.interview.interviewer.title}</p>
                        <p className="text-sm text-muted-foreground">{application.stages.interview.interviewer.organization}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No interviewer assigned yet</p>
                    )}
                    <Separator />
                    <div className="flex gap-2">
                      <Badge variant="outline">AI Prep Generated: {application.stages.interview.aiPreparationGenerated ? "Yes" : "No"}</Badge>
                      <Badge variant="outline">Status: {application.stages.interview.status}</Badge>
                    </div>
                  </div>
                )}

                {isReviewed && (
                  <div className={`p-4 rounded-lg ${
                    currentStageData.passed
                      ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {currentStageData.passed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`font-semibold ${currentStageData.passed ? "text-green-700" : "text-red-700"}`}>
                        {currentStageData.passed ? "Approved" : "Rejected"}
                      </span>
                    </div>
                    {currentStageData.reviewerNotes && (
                      <p className="text-sm text-muted-foreground">{currentStageData.reviewerNotes}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Approval Controls</CardTitle>
                <CardDescription>Review and approve this application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isReviewed ? (
                  <div className="text-center py-4">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="font-medium">Stage Already Reviewed</p>
                    <p className="text-sm text-muted-foreground">
                      Status: {currentStageData.passed ? "Approved" : "Rejected"}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Feedback Notes (Optional)</label>
                      <Textarea
                        placeholder="Add feedback for the applicant..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(true)}
                        disabled={isApproving}
                      >
                        {isApproving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Approve Stage
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => handleApprove(false)}
                        disabled={isApproving}
                      >
                        {isApproving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        Reject Stage
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                      Approving will advance the application to the next stage.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scholarship Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Provider</p>
                  <p className="font-medium">{scholarship.sourceUrl}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Benefits</p>
                  <ul className="list-disc list-inside">
                    {scholarship.benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
