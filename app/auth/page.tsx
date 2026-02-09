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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth, db } from "@/lib/firebase/client";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  ArrowRight,
  Chrome,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signInWithGoogle, user } = useAuth();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // For now, only Google Sign In is implemented
    setError("Please use Google Sign In for now.");
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

        {/* Right Side - Auth Form */}
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
              Welcome back
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="dark:text-slate-300">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10 dark:bg-slate-800 dark:border-slate-700"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="dark:text-slate-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 dark:bg-slate-800 dark:border-slate-700"
                        disabled
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
                    disabled={true}
                  >
                    Sign In with Email
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="dark:text-slate-300">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10 dark:bg-slate-800 dark:border-slate-700"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="signup-email"
                      className="dark:text-slate-300"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10 dark:bg-slate-800 dark:border-slate-700"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="signup-password"
                      className="dark:text-slate-300"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 dark:bg-slate-800 dark:border-slate-700"
                        disabled
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
                    disabled={true}
                  >
                    Create Account with Email
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full dark:bg-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 h-11 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Chrome className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Signing in..." : "Continue with Google"}
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              By continuing, you agree to our{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
