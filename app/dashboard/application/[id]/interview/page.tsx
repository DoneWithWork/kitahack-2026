"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Sparkles, CheckCircle, XCircle, Clock, User, Building, Lightbulb, MessageSquare, ClipboardList } from "lucide-react";
import { AdminModeToggle } from "@/components/admin-mode-toggle";

export default function InterviewPage() {
  const params = useParams();
  const applicationId = params.id as string;

  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState("");

  const { data, isLoading, error } = trpc.application.getInterviewStageById.useQuery(
    { applicationId },
    { enabled: !!applicationId }
  );

  const markUsedMutation = trpc.application.markInterviewPreparationGenerated.useMutation();
  const assistanceMutation = trpc.application.getInterviewAssistance.useMutation({
    onSuccess: (data) => {
      setAiResult(data.assistance);
    },
  });

  const handleMarkUsed = () => {
    if (data?.application) {
      markUsedMutation.mutate({
        applicationId,
        scholarshipId: data.application.scholarshipId,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-lg font-medium">Error loading interview stage</p>
          <p className="text-muted-foreground">
            {error?.message || "You must complete the group study stage first"}
          </p>
        </div>
      </div>
    );
  }

  const { application, scholarship } = data;
  const interviewStage = application.stages.interview;
  const isReviewed = interviewStage.checked;
  const interviewer = interviewStage.interviewer;

  const handleGetAssistance = async (type: "profile" | "organization" | "questions" | "strategy" | "checklist") => {
    setAiLoading(type);
    setAiResult("");
    try {
      await assistanceMutation.mutateAsync({
        scholarshipId: application.scholarshipId,
        assistanceType: type,
      });
      handleMarkUsed();
    } catch (err) {
      console.error("Error getting assistance:", err);
    } finally {
      setAiLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AdminModeToggle applicationId={applicationId} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{scholarship.title}</CardTitle>
            <p className="text-muted-foreground">Personal Interview Stage</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {isReviewed && (
              <div
                className={`p-4 rounded-lg ${
                  interviewStage.passed
                    ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {interviewStage.passed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span
                    className={`font-semibold ${
                      interviewStage.passed ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {interviewStage.passed ? "Interview Passed - Accepted!" : "Interview Not Passed"}
                  </span>
                </div>
                {interviewStage.reviewerNotes && (
                  <p className="text-sm text-muted-foreground">{interviewStage.reviewerNotes}</p>
                )}
              </div>
            )}

            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <User className="h-5 w-5" />
                Interview Details
              </h3>
              {interviewer ? (
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div>
                    <p className="font-medium">Interviewer</p>
                    <p className="text-lg">{interviewer.name}</p>
                    <p className="text-muted-foreground">{interviewer.title}</p>
                    <p className="text-muted-foreground">{interviewer.organization}</p>
                  </div>
                  {interviewer.profileSummary && (
                    <div>
                      <p className="font-medium text-sm">Profile Summary</p>
                      <p className="text-sm text-muted-foreground">{interviewer.profileSummary}</p>
                    </div>
                  )}
                  {interviewer.linkedinUrl && (
                    <div>
                      <p className="font-medium text-sm">LinkedIn</p>
                      <a
                        href={interviewer.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        View Profile
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-muted-foreground">
                    Interview details will be assigned by the scholarship administrator.
                  </p>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Interview Focus Areas
              </h3>
              <div className="bg-muted p-4 rounded-lg">
                <ul className="list-disc list-inside space-y-1">
                  {scholarship.interviewFocusAreas.map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                What to Expect
              </h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <span className="font-medium text-foreground">Format:</span> Personal interview with assigned interviewer
                </p>
                <p>
                  <span className="font-medium text-foreground">Duration:</span> Typically 30-45 minutes
                </p>
                <p>
                  The interview will assess your alignment with the scholarship values,
                  your understanding of the organization, and your potential to contribute
                  to their mission.
                </p>
              </div>
            </div>

            {isReviewed && interviewStage.passed && (
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <p className="font-semibold text-green-700">Congratulations! You have been accepted!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  The scholarship team will be in touch with further instructions.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Interview Prep Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isReviewed ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  AI assistance used: {application.stages.interview.aiPreparationGenerated ? "Yes" : "No"}
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Get AI-powered guidance to help you prepare for your personal interview.
                  The AI analyzes the interviewer profile and scholarship focus areas.
                </p>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleGetAssistance("profile")}
                    disabled={!!aiLoading}
                  >
                    {aiLoading === "profile" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <User className="h-4 w-4 mr-2" />
                    )}
                    Interviewer Profile
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleGetAssistance("organization")}
                    disabled={!!aiLoading}
                  >
                    {aiLoading === "organization" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Building className="h-4 w-4 mr-2" />
                    )}
                    Organization Briefing
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleGetAssistance("questions")}
                    disabled={!!aiLoading}
                  >
                    {aiLoading === "questions" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <MessageSquare className="h-4 w-4 mr-2" />
                    )}
                    Predicted Questions
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleGetAssistance("strategy")}
                    disabled={!!aiLoading}
                  >
                    {aiLoading === "strategy" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Lightbulb className="h-4 w-4 mr-2" />
                    )}
                    Difficult Questions
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleGetAssistance("checklist")}
                    disabled={!!aiLoading}
                  >
                    {aiLoading === "checklist" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <ClipboardList className="h-4 w-4 mr-2" />
                    )}
                    24-Hour Checklist
                  </Button>
                </div>

                {aiResult && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">AI Guidance</h4>
                    <div className="text-sm whitespace-pre-wrap prose dark:prose-invert max-w-none">
                      {aiResult}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Scholarship Details</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <span className="font-medium text-foreground">Provider:</span>{" "}
                      {scholarship.sourceUrl}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Benefits:</span>{" "}
                      {scholarship.benefits.length} items
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
