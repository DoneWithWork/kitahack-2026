"use client";

import { CompleteStep } from "@/components/onboarding/CompleteStep";
import { DocumentsStep } from "@/components/onboarding/DocumentStep";
import { ProfileStep } from "@/components/onboarding/ProfileStep";
import { TranscriptStep } from "@/components/onboarding/TranscriptStep";
import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { Progress } from "@/components/ui/progress";
import { steps } from "@/lib/onboarding/constants";
import { trpc } from "@/lib/trpc/client";
import { GraduationCap, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const {
    data: onboardingStatus,
    isLoading: statusLoading,
    refetch: refetchStatus,
  } = trpc.onboarding.getStatus.useQuery();

  const canGoBack = (step: number): boolean => {
    if (!onboardingStatus) return true;

    switch (step) {
      case 1:
        return false;
      case 2:
        return false;
      case 3:
        return false;
      default:
        return true;
    }
  };

  useEffect(() => {
    if (onboardingStatus) {
      if (onboardingStatus.onboardingCompleted) {
        router.push("/dashboard");
      } else {
        console.log(onboardingStatus.onboardingStep);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentStep(onboardingStatus.onboardingStep);
      }
    }
  }, [onboardingStatus, router]);

  const progress = (currentStep / (steps.length - 1)) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={() => setCurrentStep(1)} />;
      case 1:
        return (
          <ProfileStep
            onNext={() => {
              refetchStatus();
              setCurrentStep(2);
            }}
            onBack={() => {
              if (canGoBack(1)) setCurrentStep(0);
            }}
            canGoBack={canGoBack(1)}
          />
        );
      case 2:
        return (
          <TranscriptStep
            onNext={() => {
              refetchStatus();
              setCurrentStep(3);
            }}
            onBack={() => {
              if (canGoBack(2)) setCurrentStep(1);
            }}
            canGoBack={canGoBack(2)}
          />
        );
      case 3:
        return (
          <DocumentsStep
            onNext={() => {
              refetchStatus();
              setCurrentStep(4);
            }}
            onBack={() => {
              if (canGoBack(3)) setCurrentStep(2);
            }}
            canGoBack={canGoBack(3)}
          />
        );
      case 4:
        return <CompleteStep onComplete={() => router.push("/dashboard")} />;
      default:
        return <WelcomeStep onNext={() => setCurrentStep(1)} />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-blue-500">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                ScholarGuide
              </span>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          {statusLoading ? (
            <div className="min-h-screen flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`text-xs ${
                      step.id <= currentStep
                        ? "text-blue-600 dark:text-blue-400 font-medium"
                        : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {renderStep()}
      </div>
    </div>
  );
}
