import { ModeToggle } from "@/components/mode-toggle";
import AuthButtons from "@/components/onboarding/AuthButtons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-blue-500">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              ScholarGuide
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#benefits"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Benefits
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <ModeToggle />
            <AuthButtons />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 linear-hero opacity-50" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-blue-100/50 to-transparent" />

        <div className="container relative mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8 animate-fade-in">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 px-4 py-1.5 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-1" />
                AI-Powered Platform
              </Badge>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
                Guaranteed{" "}
                <span className="bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  Scholarships
                </span>{" "}
                for Your Future
              </h1>

              <p className="text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Over $100 Million in scholarships go unclaimed every year.
                Let&apos;s make sure you claim your share — and more! Our
                AI-powered platform matches you with the perfect opportunities.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 h-14 px-8 text-lg"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border text-foreground hover:bg-secondary h-14 px-8 text-lg"
                >
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 border-2 border-background flex items-center justify-center text-white text-xs font-bold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    2,000+ Students
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Matched with scholarships
                  </p>
                </div>
              </div>
            </div>

            <div className="relative lg:pl-8">
              <div className="relative rounded-3xl linear-hero p-2">
                <div className="relative rounded-2xl bg-card shadow-2xl overflow-hidden border border-border">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-blue-600 to-blue-400" />
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Scholarship Match Score
                        </p>
                        <p className="text-3xl font-bold text-foreground">
                          94%
                        </p>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-foreground">
                          Stanford Merit Scholarship
                        </span>
                        <Badge className="ml-auto bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                          Eligible
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-foreground">
                          Gates Millennium Scholarship
                        </span>
                        <Badge className="ml-auto bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                          Eligible
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                        <Target className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-foreground">
                          Fulbright Program
                        </span>
                        <Badge className="ml-auto bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                          High Match
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating card */}
              <Card className="absolute -bottom-6 -left-6 w-64 shadow-2xl border-border animate-fade-in">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">$50,000</p>
                      <p className="text-xs text-muted-foreground">
                        Average Award
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "$2.5M+", label: "Scholarships Found" },
              { value: "15,000+", label: "Active Students" },
              { value: "98%", label: "Match Accuracy" },
              { value: "500+", label: "Partner Universities" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 mb-4">
              Features
            </Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need to Win Scholarships
            </h2>
            <p className="text-lg text-muted-foreground">
              Our AI-powered platform provides all the tools you need to
              discover, track, and secure scholarships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Matching",
                description:
                  "Our intelligent algorithm analyzes your profile to find scholarships perfectly suited to your qualifications and interests.",
                color: "blue",
              },
              {
                icon: BookOpen,
                title: "Smart Document Parser",
                description:
                  "Upload your transcripts and documents. Our AI extracts and organizes all relevant information automatically.",
                color: "indigo",
              },
              {
                icon: Target,
                title: "Eligibility Checker",
                description:
                  "Instantly know which scholarships you're eligible for with our deterministic eligibility engine.",
                color: "violet",
              },
              {
                icon: Award,
                title: "Application Tracker",
                description:
                  "Keep track of all your applications, deadlines, and requirements in one organized dashboard.",
                color: "purple",
              },
              {
                icon: Users,
                title: "Essay Assistant",
                description:
                  "Get AI-powered help writing compelling scholarship essays that stand out from the competition.",
                color: "fuchsia",
              },
              {
                icon: CheckCircle2,
                title: "Deadline Reminders",
                description:
                  "Never miss a deadline with smart reminders and priority-based notifications.",
                color: "pink",
              },
            ].map((feature, i) => (
              <Card key={i} className="group hover-lift border-border bg-card">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon
                      className={`w-6 h-6 text-${feature.color}-600 dark:text-${feature.color}-300`}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 mb-4">
              How It Works
            </Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Four Simple Steps to Success
            </h2>
            <p className="text-lg text-muted-foreground">
              Our streamlined process makes finding and applying for
              scholarships easier than ever.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Create Profile",
                description:
                  "Sign up and complete your profile with academic information and interests.",
              },
              {
                step: "02",
                title: "Upload Documents",
                description:
                  "Upload your transcripts and relevant documents for AI analysis.",
              },
              {
                step: "03",
                title: "Get Matched",
                description:
                  "Our AI finds and ranks scholarships based on your eligibility.",
              },
              {
                step: "04",
                title: "Apply & Win",
                description:
                  "Track applications, get essay help, and secure your scholarships.",
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-blue-100 dark:text-blue-900 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-8 right-0 transform translate-x-1/2">
                    <ArrowRight className="w-6 h-6 text-blue-300 dark:text-blue-700" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative rounded-3xl linear-primary p-12 lg:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGgyLTJ6IiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-20" />
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Find Your Perfect Scholarship?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of students who have already discovered their
                scholarship matches. Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 dark:bg-slate-100 dark:hover:bg-white h-14 px-8 text-lg shadow-xl"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <p className="mt-6 text-sm text-blue-200">
                No credit card required • Free forever plan available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-800">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-blue-500">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  ScholarGuide
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Empowering students worldwide to discover and secure educational
                funding opportunities.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Testimonials
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Scholarship Guide
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © 2026 ScholarGuide. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-slate-500 hover:text-white transition-colors"
              >
                Twitter
              </Link>
              <Link
                href="#"
                className="text-slate-500 hover:text-white transition-colors"
              >
                LinkedIn
              </Link>
              <Link
                href="#"
                className="text-slate-500 hover:text-white transition-colors"
              >
                Instagram
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
