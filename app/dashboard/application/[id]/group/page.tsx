"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Users,
  Lightbulb,
  Presentation,
  Trophy,
  History,
} from "lucide-react";
import { AdminModeToggle } from "@/components/admin-mode-toggle";
import { formatDateTime } from "@/lib/utils/dates";

export default function GroupPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState("");
  const [aiHistoryCursor, setAiHistoryCursor] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const { data, isLoading, error } =
    trpc.application.getGroupStageById.useQuery(
      { applicationId },
      { enabled: !!applicationId },
    );

  const markUsedMutation =
    trpc.application.markGroupPreparationUsed.useMutation();
  const assistanceMutation = trpc.application.getGroupAssistance.useMutation({
    onSuccess: (data) => {
      setAiResult(data.assistance);
    },
  });

  const aiHistory = useMemo(() => {
    const entries = data?.application.stages.group.aiHistory ?? [];
    return [...entries].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [data?.application.stages.group.aiHistory]);

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
          <p className="text-lg font-medium">Error loading group stage</p>
          <p className="text-muted-foreground">
            {error?.message || "You must complete the essay stage first"}
          </p>
        </div>
      </div>
    );
  }

  const { application, scholarship } = data;
  const groupStage = application.stages.group;
  const isReviewed = groupStage.checked;

  const handleGetAssistance = async (
    type: "breakdown" | "slides" | "strategy",
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
      utils.application.getGroupStageById.invalidate({ applicationId });
    } catch (err) {
      console.error("Error getting assistance:", err);
    } finally {
      setAiLoading(null);
    }
  };

  return (
    <div className="space-y-4 relative">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Group Case Study Stage
          </p>
          <h1 className="text-2xl font-semibold text-foreground">
            {scholarship.title}
          </h1>
        </div>
        <AdminModeToggle applicationId={applicationId} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6 order-2 xl:order-2">
          <Card className="sticky top-6 max-h-[calc(100vh-6rem)] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Case Study Assistant
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Guidance stays scoped to this group stage.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto min-h-0 pr-1">
              {isReviewed ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    AI assistance used:{" "}
                    {application.stages.group.aiPreparationUsed ? "Yes" : "No"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleGetAssistance("breakdown")}
                      disabled={!!aiLoading}
                    >
                      {aiLoading === "breakdown" ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Lightbulb className="h-4 w-4 mr-2" />
                      )}
                      Break Down Case
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleGetAssistance("slides")}
                      disabled={!!aiLoading}
                    >
                      {aiLoading === "slides" ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Presentation className="h-4 w-4 mr-2" />
                      )}
                      Generate Slide Outline
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
                        <Trophy className="h-4 w-4 mr-2" />
                      )}
                      Give Winning Strategy
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
        <div className="space-y-6 order-1 xl:order-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Group Case Study
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Review the task and instructions before requesting AI help.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {isReviewed && (
                <div
                  className={`p-4 rounded-lg ${
                    groupStage.passed
                      ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {groupStage.passed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span
                      className={`font-semibold ${
                        groupStage.passed ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {groupStage.passed
                        ? "Group Stage Passed"
                        : "Group Stage Not Passed"}
                    </span>
                  </div>
                  {groupStage.reviewerNotes && (
                    <p className="text-sm text-muted-foreground">
                      {groupStage.reviewerNotes}
                    </p>
                  )}
                </div>
              )}

              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Group Case Study Task
                </h3>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">
                    {scholarship.groupTaskDescription}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Instructions & Time Constraint
                </h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    <span className="font-medium text-foreground">
                      Time Limit:
                    </span>{" "}
                    45 minutes
                  </p>
                  <p>
                    <span className="font-medium text-foreground">
                      Team Size:
                    </span>{" "}
                    4 members
                  </p>
                  <p>
                    You will be presented with a business case study related to
                    the scholarship sponsoring organization. Work with your team
                    to analyze the case and present a strategic solution.
                  </p>
                </div>
              </div>

              {isReviewed && groupStage.passed && (
                <Button
                  onClick={() =>
                    router.push(
                      `/dashboard/application/${applicationId}/interview`,
                    )
                  }
                  className="w-full"
                >
                  Proceed to Personal Interview
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
