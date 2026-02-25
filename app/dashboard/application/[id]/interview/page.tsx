"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Building,
  Lightbulb,
  MessageSquare,
  ClipboardList,
  History,
} from "lucide-react";
import { AdminModeToggle } from "@/components/admin-mode-toggle";
import { formatDateTime } from "@/lib/utils/dates";

export default function InterviewPage() {
  const params = useParams();
  const applicationId = params.id as string;

  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState("");
  const [aiHistoryCursor, setAiHistoryCursor] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const { data, isLoading, error } =
    trpc.application.getInterviewStageById.useQuery(
      { applicationId },
      { enabled: !!applicationId },
    );

  const markUsedMutation =
    trpc.application.markInterviewPreparationGenerated.useMutation();
  const assistanceMutation = trpc.application.getInterviewAssistance.useMutation({
    onSuccess: (result) => {
      setAiResult(result.assistance);
    },
  });

  const aiHistory = useMemo(() => {
    const entries = data?.application.stages.interview.aiHistory ?? [];
    return [...entries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [data?.application.stages.interview.aiHistory]);

  useEffect(() => {
    if (aiHistoryCursor || aiHistory.length === 0) return;
    if (!aiResult) {
      setAiResult(aiHistory[0].response);
      setAiHistoryCursor(aiHistory[0].id);
      return;
    }
    const match = aiHistory.find((entry) => entry.response === aiResult);
    if (match) {
      setAiHistoryCursor(match.id);
    }
  }, [aiHistory, aiHistoryCursor, aiResult]);

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

  const handleGetAssistance = async (
    type: "profile" | "organization" | "questions" | "strategy" | "checklist",
  ) => {
    setAiLoading(type);
    setAiResult("");
    try {
      await assistanceMutation.mutateAsync({
        scholarshipId: application.scholarshipId,
        applicationId,
        assistanceType: type,
      });
      handleMarkUsed();
      setAiHistoryCursor(null);
      utils.application.getInterviewStageById.invalidate({ applicationId });
    } catch (err) {
      console.error("Error getting assistance:", err);
    } finally {
      setAiLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Personal Interview Stage</p>
          <h1 className="text-2xl font-semibold text-foreground">
            {scholarship.title}
          </h1>
        </div>
        <AdminModeToggle applicationId={applicationId} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Interview Overview
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Review interviewer details and focus areas.
              </p>
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
                        interviewStage.passed
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {interviewStage.passed
                        ? "Interview Passed - Accepted!"
                        : "Interview Not Passed"}
                    </span>
                  </div>
                  {interviewStage.reviewerNotes && (
                    <p className="text-sm text-muted-foreground">
                      {interviewStage.reviewerNotes}
                    </p>
                  )}
                </div>
              )}

              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Interview Details
                </h3>
                {interviewer ? (
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-xl border border-primary/20 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                          Your Interviewer
                        </p>
                        <p className="text-2xl font-bold">
                          {interviewer.name}
                        </p>
                        <p className="text-primary font-medium">
                          {interviewer.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>{interviewer.organization}</span>
                    </div>
                    {interviewer.profileSummary && (
                      <div className="pt-2 border-t border-primary/10">
                        <p className="font-medium text-sm mb-1">
                          About the Interviewer
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {interviewer.profileSummary}
                        </p>
                      </div>
                    )}
                    {interviewer.linkedinUrl && (
                      <div className="flex items-center gap-2">
                        <a
                          href={interviewer.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                          View LinkedIn Profile
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-muted-foreground">
                      Interview details will be assigned by the scholarship
                      administrator.
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
                    <span className="font-medium text-foreground">Format:</span>{" "}
                    Personal interview with assigned interviewer
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Duration:</span>{" "}
                    Typically 30-45 minutes
                  </p>
                  <p>
                    The interview will assess your alignment with the scholarship
                    values, your understanding of the organization, and your
                    potential to contribute to their mission.
                  </p>
                </div>
              </div>

              {isReviewed && interviewStage.passed && (
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="font-semibold text-green-700">
                    Congratulations! You have been accepted!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    The scholarship team will be in touch with further
                    instructions.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-6 max-h-[calc(100vh-6rem)] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Interview Prep Assistant
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Guidance stays scoped to this interview stage.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto min-h-0 pr-1">
              {isReviewed ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    AI assistance used:{" "}
                    {application.stages.interview.aiPreparationGenerated
                      ? "Yes"
                      : "No"}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Get AI-powered guidance to help you prepare for your personal
                    interview. The AI analyzes the interviewer profile and
                    scholarship focus areas.
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

                  <div className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] gap-4">
                    <div className="rounded-lg border border-border bg-muted/40">
                      <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground">
                        History
                        <History className="h-3.5 w-3.5" />
                      </div>
                      <ScrollArea className="h-[220px]">
                        <div className="p-2 space-y-2">
                          {aiHistory.length === 0 && (
                            <p className="text-xs text-muted-foreground px-2 py-4">
                              No suggestions yet.
                            </p>
                          )}
                          {aiHistory.map((entry) => (
                            <button
                              key={entry.id}
                              type="button"
                              onClick={() => {
                                setAiResult(entry.response);
                                setAiHistoryCursor(entry.id);
                              }}
                              className={`w-full rounded-md border px-2 py-2 text-left text-xs transition hover:border-primary/40 hover:bg-background ${
                                aiHistoryCursor === entry.id
                                  ? "border-primary/60 bg-background"
                                  : "border-transparent"
                              }`}
                            >
                              <p className="font-medium text-foreground">
                                {entry.title}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {formatDateTime(entry.createdAt)}
                              </p>
                            </button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                          AI Guidance
                        </h4>
                      </div>
                      {aiResult ? (
                        <div
                          className="prose prose-sm dark:prose-invert max-w-none 
                          prose-headings:font-semibold prose-headings:text-foreground
                          prose-p:text-foreground/90 prose-p:leading-relaxed
                          prose-ul:text-foreground/90 prose-ol:text-foreground/90
                          prose-li:marker:text-blue-500
                          prose-strong:text-foreground prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-blue-100 dark:prose-code:bg-blue-900/30 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                          prose-blockquote:border-blue-300 dark:prose-blockquote:border-blue-700 prose-blockquote:bg-transparent prose-blockquote:not-italic"
                        >
                          <ReactMarkdown>{aiResult}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Ask for guidance to see suggestions here.
                        </p>
                      )}
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
