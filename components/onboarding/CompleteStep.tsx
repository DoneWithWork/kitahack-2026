import { trpc } from "@/lib/trpc/client";
import {
  CheckCircle2,
  Target,
  Award,
  DollarSign,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";

export function CompleteStep({ onComplete }: { onComplete: () => void }) {
  const completeMutation = trpc.onboarding.completeOnboarding.useMutation();

  const handleComplete = async () => {
    await completeMutation.mutateAsync();
    onComplete();
  };

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader className="text-center">
        <div className="w-20 h-20 rounded-full bg-linear-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">
          {"You're All Set!"}
        </CardTitle>
        <CardDescription className="text-lg text-slate-600 dark:text-slate-300">
          {"Your profile is complete. Let's find you some scholarships!"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-center">
            <Target className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="font-medium text-slate-900 dark:text-white">
              AI Matching
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Personalized recommendations
            </p>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-center">
            <Award className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <p className="font-medium text-slate-900 dark:text-white">
              Eligibility Check
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Instant qualification
            </p>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-center">
            <DollarSign className="h-8 w-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
            <p className="font-medium text-slate-900 dark:text-white">
              Funding Tracker
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Track your awards
            </p>
          </div>
        </div>
        <Button
          onClick={handleComplete}
          className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
          disabled={completeMutation.isPending}
        >
          {completeMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finalizing...
            </>
          ) : (
            <>
              Go to Dashboard
              <ChevronRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
