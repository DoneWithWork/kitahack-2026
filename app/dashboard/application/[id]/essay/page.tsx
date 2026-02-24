"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Save,
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { AdminModeToggle } from "@/components/admin-mode-toggle";

export default function EssayPage() {
  const params = useParams();
  const applicationId = params.id as string;

  const [draft, setDraft] = useState("");
  const [localDraft, setLocalDraft] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showAdminHighlight, setShowAdminHighlight] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const utils = trpc.useUtils();
  const { data: appData, isLoading: appLoading } =
    trpc.application.getApplicationById.useQuery(
      { applicationId },
      { enabled: !!applicationId },
    );

  const saveMutation = trpc.application.saveEssayDraft.useMutation({
    onSuccess: () => {
      utils.application.getApplicationById.invalidate();
    },
  });
  const submitMutation = trpc.application.submitEssay.useMutation({
    onSuccess: () => {
      utils.application.getApplicationById.invalidate();
    },
  });
  const assistanceMutation = trpc.application.getEssayAssistance.useMutation();

  useEffect(() => {
    if (appData?.application && appData.scholarship) {
      setDraft(appData.application.stages.essay.draft || "");
      setLocalDraft(appData.application.stages.essay.draft || "");
    }
  }, [appData]);

  if (appLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
  const isEditable =
    !isReviewed &&
    application.currentStage === "essay" &&
    !essayStage.submitted;

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

  const handleSubmit = async () => {
    if (!localDraft.trim() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await submitMutation.mutateAsync({
        applicationId,
        scholarshipId: application.scholarshipId,
        draft: localDraft,
      });
      setShowAdminHighlight(true);
    } catch (err) {
      console.error("Error submitting essay:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetSuggestions = async () => {
    setAiLoading(true);
    try {
      const result = await assistanceMutation.mutateAsync({
        scholarshipId: application.scholarshipId,
        currentDraft: localDraft,
      });
      setAiSuggestion(result.assistance);
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
      <div className="flex justify-end">
        <AdminModeToggle
          applicationId={applicationId}
          highlight={showAdminHighlight}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {scholarship.title}
              </CardTitle>
              <p className="text-muted-foreground">Essay Stage</p>
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
                      submitMutation.isPending
                    }
                  >
                    {submitMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Submit Essay
                  </Button>
                </div>

                {essayStage.submitted && !isReviewed && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Essay submitted. Waiting for review.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-6 max-h-[calc(100vh-6rem)] flex flex-col">
            <CardHeader className="shrink-0">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Writing Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto min-h-0 pr-1">
              <p className="text-sm text-muted-foreground">
                Get personalized suggestions to improve your essay based on the
                scholarship requirements.
              </p>

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

              {aiSuggestion && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">AI Feedback</h4>
                  <div className="text-sm whitespace-pre-wrap prose dark:prose-invert max-w-none">
                    {aiSuggestion}
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Scholarship Details</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <span className="font-medium text-foreground">
                      Provider:
                    </span>{" "}
                    {scholarship.sourceUrl}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">
                      Benefits:
                    </span>{" "}
                    {scholarship.benefits.length} items
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
