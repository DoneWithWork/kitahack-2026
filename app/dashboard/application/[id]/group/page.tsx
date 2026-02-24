"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Sparkles, CheckCircle, XCircle, Clock, Users, Lightbulb, Presentation, Trophy } from "lucide-react";
import { AdminModeToggle } from "@/components/admin-mode-toggle";

export default function GroupPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState("");

  const { data, isLoading, error } = trpc.application.getGroupStageById.useQuery(
    { applicationId },
    { enabled: !!applicationId }
  );

  const markUsedMutation = trpc.application.markGroupPreparationUsed.useMutation();
  const assistanceMutation = trpc.application.getGroupAssistance.useMutation({
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

  const handleGetAssistance = async (type: "breakdown" | "slides" | "strategy") => {
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
            <p className="text-muted-foreground">Group Case Study Stage</p>
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
                    {groupStage.passed ? "Group Stage Passed" : "Group Stage Not Passed"}
                  </span>
                </div>
                {groupStage.reviewerNotes && (
                  <p className="text-sm text-muted-foreground">{groupStage.reviewerNotes}</p>
                )}
              </div>
            )}

            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Group Case Study Task
              </h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{scholarship.groupTaskDescription}</p>
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
                  <span className="font-medium text-foreground">Time Limit:</span> 45 minutes
                </p>
                <p>
                  <span className="font-medium text-foreground">Team Size:</span> 4 members
                </p>
                <p>
                  You will be presented with a business case study related to the scholarship
                  sponsoring organization. Work with your team to analyze the case and present
                  a strategic solution.
                </p>
              </div>
            </div>

            {isReviewed && groupStage.passed && (
              <Button
                onClick={() => router.push(`/dashboard/application/${applicationId}/interview`)}
                className="w-full"
              >
                Proceed to Personal Interview
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Case Study Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isReviewed ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  AI assistance used: {application.stages.group.aiPreparationUsed ? "Yes" : "No"}
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Get AI-powered guidance to help you prepare for the group case study. The AI
                  analyzes the sponsoring organization to provide strategic insights.
                </p>

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
