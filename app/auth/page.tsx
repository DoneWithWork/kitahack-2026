"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth, db } from "@/lib/firebase/client";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Chrome, GraduationCap, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithGoogle();
      const user = await auth.currentUser?.getIdTokenResult();
      const q = query(
        collection(db, "users"),
        where("uid", "==", user?.claims.user_id || ""),
      );
      const snapShot = await getDocs(q);
      console.log(
        "snapShot docs:",
        snapShot.docs[0].data().onboardingCompleted,
      );
      if (result.isNew || !result.success) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-blue-500">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              ScholarGuide
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              Start Your Scholarship Journey Today
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Join thousands of students who have discovered their perfect
              scholarship matches with our AI-powered platform.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 shadow-lg shadow-blue-100 dark:shadow-none">
              <p className="text-3xl font-bold text-blue-600">$2.5M+</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Scholarships Found
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 shadow-lg shadow-blue-100 dark:shadow-none">
              <p className="text-3xl font-bold text-blue-600">15,000+</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Active Students
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Google Sign-In */}
        <Card className="border-slate-200 dark:border-slate-700 shadow-xl shadow-blue-100/50 dark:shadow-none">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between lg:hidden mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-blue-500">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  ScholarGuide
                </span>
              </div>
              <ModeToggle />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome to ScholarGuide
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Sign in with your Google account to start finding scholarships
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              size="lg"
              className="w-full h-12 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white dark:border-slate-700 font-semibold shadow-md hover:shadow-lg transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Chrome className="mr-3 h-5 w-5" />
                  Continue with Google
                </>
              )}
            </Button>

            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                ✨ No password needed. Just one click to access your dashboard.
              </p>
              <p className="text-center text-xs text-slate-500 dark:text-slate-500">
                By signing in, you agree to our{" "}
                <Link
                  href="#"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
