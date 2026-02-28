"use client";

import { useMemo, useState, useEffect, useOptimistic, startTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  Save,
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle,
  XCircle,
  History,
} from "lucide-react";
import { AdminModeToggle } from "@/components/admin-mode-toggle";
import { formatDateTime } from "@/lib/utils/dates";
import { Skeleton } from "@/components/ui/skeleton";

export default function EssayPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const [draft, setDraft] = useState("");
  const [localDraft, setLocalDraft] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [aiHistoryCursor, setAiHistoryCursor] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAdminHighlight, setShowAdminHighlight] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [optimisticSubmitted, setOptimisticSubmitted] = useOptimistic(
    false,
    (state, newValue: boolean) => newValue,
  );

  const utils = trpc.useUtils();
  const { data: appData, isLoading: appLoading } =
    trpc.application.getApplicationById.useQuery(
      { applicationId },
      { enabled: !!applicationId },
    );

  const saveMutation = trpc.application.saveEssayDraft.useMutation({
    onSuccess: () => {
      utils.application.getApplicationById.invalidate({ applicationId });
    },
  });
  const submitMutation = trpc.application.submitEssay.useMutation({
    onSuccess: () => {
      utils.application.getApplicationById.invalidate({ applicationId });
    },
  });
  const assistanceMutation = trpc.application.getEssayAssistance.useMutation();

  const aiHistory = useMemo(() => {
    const entries = appData?.application.stages.essay.aiHistory ?? [];
    return [...entries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [appData?.application.stages.essay.aiHistory]);

  useEffect(() => {
    if (appData?.application && appData.scholarship) {
      setDraft(appData.application.stages.essay.draft || "");
      setLocalDraft(appData.application.stages.essay.draft || "");
    }
  }, [appData]);

  useEffect(() => {
    if (aiHistoryCursor || aiHistory.length === 0) return;
    if (!aiSuggestion) {
      setAiSuggestion(aiHistory[0].response);
      setAiHistoryCursor(aiHistory[0].id);
      return;
    }
    const match = aiHistory.find((entry) => entry.response === aiSuggestion);
    if (match) {
      setAiHistoryCursor(match.id);
    }
  }, [aiHistory, aiHistoryCursor, aiSuggestion]);

  useEffect(() => {
    if (showAdminHighlight) {
      const timer = setTimeout(() => {
        setShowAdminHighlight(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAdminHighlight]);

  if (appLoading) {
    return (
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-56" />
          </div>
          <Skeleton className="h-9 w-40 rounded-md" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left: Essay card skeleton */}
          <Card className="xl:order-1">
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-60 mt-1" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Separator />
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-[300px] w-full rounded-md" />
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-28 rounded-md" />
                  <Skeleton className="h-10 w-32 rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: AI assistant skeleton */}
          <Card className="xl:order-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 w-36" />
              </div>
              <Skeleton className="h-4 w-56 mt-1" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-3 w-28" />
              <div className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] gap-4">
                <div className="rounded-lg border border-border bg-muted/40 p-2 space-y-2">
                  <Skeleton className="h-4 w-16 mx-1" />
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-md" />
                  ))}
                </div>
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!appData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-lg font-medium">Error loading application</p>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  const { application, scholarship } = appData;
  const essayStage = application.stages.essay;
  const isReviewed = essayStage.checked;
  const isSubmitted = essayStage.submitted || optimisticSubmitted;
  const isEditable =
    !isReviewed && application.currentStage === "essay" && !isSubmitted;

  const handleSaveDraft = async () => {
    try {
      await saveMutation.mutateAsync({
        applicationId,
        scholarshipId: application.scholarshipId,
        draft: localDraft,
      });
      setDraft(localDraft);
    } catch (err) {
      console.error("Error saving draft:", err);
    }
  };

  const handleSubmit = () => {
    if (!localDraft.trim() || isSubmitting) return;
    setIsSubmitting(true);

    startTransition(async () => {
      setOptimisticSubmitted(true);

      try {
        await submitMutation.mutateAsync({
          applicationId,
          scholarshipId: application.scholarshipId,
          draft: localDraft,
        });
        setShowAdminHighlight(true);
      } catch (err) {
        console.error("Error submitting essay:", err);
        setOptimisticSubmitted(false);
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  const handleGetSuggestions = async () => {
    setAiLoading(true);
    try {
      const result = await assistanceMutation.mutateAsync({
        applicationId,
        scholarshipId: application.scholarshipId,
        currentDraft: localDraft,
      });
      setAiSuggestion(result.assistance);
      setAiHistoryCursor(null);
      await utils.application.getApplicationById.refetch({ applicationId });
    } catch (err) {
      console.error("Error getting suggestions:", err);
      setAiSuggestion(
        "Unable to get suggestions at this time. Please try again later.",
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Essay Stage</p>
          <h1 className="text-2xl font-semibold text-foreground">
            {scholarship.title}
          </h1>
        </div>
        <AdminModeToggle
          applicationId={applicationId}
          highlight={showAdminHighlight}
        />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="w-full space-y-6 xl:order-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Your Essay Response
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Draft your response and submit when ready.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Essay Question</h3>
                <p className="text-foreground whitespace-pre-wrap">
                  {scholarship.essayQuestion}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Your Response</h3>

                {isReviewed && (
                  <div
                    className={`p-4 rounded-lg mb-4 ${
                      essayStage.passed
                        ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {essayStage.passed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span
                        className={`font-semibold ${essayStage.passed ? "text-green-700" : "text-red-700"}`}
                      >
                        {essayStage.passed
                          ? "Essay Passed"
                          : "Essay Not Passed"}
                      </span>
                    </div>
                    {essayStage.reviewerNotes && (
                      <p className="text-sm text-muted-foreground">
                        {essayStage.reviewerNotes}
                      </p>
                    )}
                  </div>
                )}

                {isReviewed && essayStage.passed && (
                  <Button
                    onClick={() =>
                      router.push(
                        `/dashboard/application/${applicationId}/group`,
                      )
                    }
                    className="w-full"
                  >
                    Proceed to Group Case Study
                  </Button>
                )}

                <Textarea
                  value={localDraft}
                  onChange={(e) => setLocalDraft(e.target.value)}
                  placeholder="Write your essay here..."
                  className="min-h-[300px] text-base"
                  disabled={!isEditable}
                />

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={
                      !isEditable ||
                      localDraft === draft ||
                      saveMutation.isPending
                    }
                  >
                    {saveMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Draft
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      !isEditable ||
                      !localDraft.trim() ||
                      isSubmitting ||
                      submitMutation.isPending ||
                      optimisticSubmitted
                    }
                  >
                    {submitMutation.isPending || optimisticSubmitted ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {optimisticSubmitted ? "Submitted" : "Submit Essay"}
                  </Button>
                </div>

                {isSubmitted && !isReviewed && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Essay submitted. Waiting for review.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 xl:order-2">
          <Card className="sticky top-6 max-h-[calc(100vh-6rem)] flex flex-col">
            <CardHeader className="shrink-0">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Writing Assistant
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Suggestions stay scoped to this essay stage.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto min-h-0 pr-1">
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGetSuggestions}
                  disabled={aiLoading}
                >
                  {aiLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {localDraft.trim() ? "Improve My Draft" : "Get Suggestions"}
                </Button>
                <div className="text-xs text-muted-foreground">
                  {aiHistory.length} saved suggestion{aiHistory.length === 1 ? "" : "s"}
                </div>
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
                            setAiSuggestion(entry.response);
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
                      AI Feedback
                    </h4>
                  </div>
                  {aiSuggestion ? (
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none 
                      prose-headings:font-semibold prose-headings:text-foreground
                      prose-p:text-foreground/90 prose-p:leading-relaxed
                      prose-ul:text-foreground/90 prose-ol:text-foreground/90
                      prose-li:marker:text-blue-500
                      prose-strong:text-foreground prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-blue-100 dark:prose-code:bg-blue-900/30 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                      prose-blockquote:border-blue-300 dark:prose-blockquote:border-blue-700 prose-blockquote:bg-transparent prose-blockquote:not-italic"
                    >
                      <ReactMarkdown>{aiSuggestion}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Ask for suggestions to see feedback here.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
