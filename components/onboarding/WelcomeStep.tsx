import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Award, ChevronRight, FileText, Sparkles, Target } from "lucide-react";
import { Button } from "../ui/button";
export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader className="text-center">
        <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-10 w-10 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome to MyDANA!
        </CardTitle>
        <CardDescription className="text-lg text-slate-600 dark:text-slate-300">
          Let&apos;s set up your profile to find the perfect scholarships for
          you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-center">
            <Target className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="font-medium text-slate-900 dark:text-white">
              Personalized Matches
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              AI-powered scholarship recommendations
            </p>
          </div>
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/30 text-center">
            <FileText className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p className="font-medium text-slate-900 dark:text-white">
              Smart Documents
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Automatic OCR and data extraction
            </p>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-center">
            <Award className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <p className="font-medium text-slate-900 dark:text-white">
              Track Applications
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Never miss a deadline
            </p>
          </div>
        </div>
        <Button
          onClick={onNext}
          className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
        >
          Get Started
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
