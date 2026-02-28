import { ModeToggle } from "@/components/mode-toggle";
import AuthButtons from "@/components/onboarding/AuthButtons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  GraduationCap,
  Lightbulb,
  MessageSquare,
  Rocket,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
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
              href="#problem"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Problem
            </Link>
            <Link
              href="#sdg"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              SDG Alignment
            </Link>
            <Link
              href="#feedback"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Feedback
            </Link>
            <Link
              href="#metrics"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Impact
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#roadmap"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Roadmap
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
                Track multiple scholarship applications in one place. Our AI
                helps you find eligible opportunities, simplifies requirements,
                and guides your essays authentically.
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
                          Maxis Talent Scholarship
                        </span>
                        <Badge className="ml-auto bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                          Eligible
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-foreground">
                          Petronas Education Award
                        </span>
                        <Badge className="ml-auto bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                          Eligible
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                        <Target className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-foreground">
                          YTL Foundation Scholarship
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
                      <p className="font-bold text-foreground">RM100,000</p>
                      <p className="text-xs text-muted-foreground">
                        Full Scholarship Average
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section id="problem" className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 px-4 py-1.5 text-sm font-medium mb-4">
              Problem Statement
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              The Scholarship Gap: Why SPM Students Miss Opportunities
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              SPM school leavers face a fragmented scholarship ecosystem—
              scattered information, complex requirements, and no centralized
              way to manage multiple applications.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Eye,
                title: "Hidden Opportunities",
                description:
                  "Scholarships are published on individual websites with limited outreach, leaving many opportunities undiscovered.",
                stat: "67%",
                statLabel: "say finding info is top priority",
              },
              {
                icon: FileText,
                title: "Complex Requirements",
                description:
                  "Varying eligibility criteria, documentation needs, and submission processes create confusion.",
                stat: "2+ hours",
                statLabel: "average search time per scholarship",
              },
              {
                icon: Clock,
                title: "Missed Deadlines",
                description:
                  "Managing applications across different portals and emails leads to missed submissions.",
                stat: "1 in 3",
                statLabel: "students miss at least one deadline",
              },
              {
                icon: MessageSquare,
                title: "Essay Challenges",
                description:
                  "Limited guidance and weak writing skills lead to overreliance on detectable AI-generated content.",
                stat: "73%",
                statLabel: "of essays show AI detection flags",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="border-border bg-card hover:border-red-200 dark:hover:border-red-800 transition-colors"
              >
                <CardContent className="p-6">
                  <item.icon className="w-8 h-8 text-red-500 mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.description}
                  </p>
                  <div className="pt-4 border-t border-border">
                    <span className="text-2xl font-bold text-red-600">
                      {item.stat}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {item.statLabel}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SDG Alignment */}
      <section id="sdg" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 px-4 py-1.5 text-sm font-medium mb-4">
              SDG Alignment
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              How We Address Real-World Problems with AI
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our solution directly supports three United Nations Sustainable
              Development Goals through meaningful technology integration.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                sdg: "SDG 4",
                title: "Quality Education",
                description: "Equitable access to tertiary education",
                color: "green",
                badgeBg: "bg-green-100 dark:bg-green-900/30",
                badgeText: "text-green-700 dark:text-green-400",
                iconColor: "text-green-500",
                sdgColor: "text-green-600 dark:text-green-400",
                solutions: [
                  {
                    title: "AI Scholarship Matching",
                    detail:
                      "Recommends scholarships based on student profile, results, and income background—ensuring no qualified student misses funding due to lack of information.",
                  },
                  {
                    title: "Essay Guidance",
                    detail:
                      "Provides structure suggestions and feedback to improve authentic writing instead of generic AI-generated content.",
                  },
                ],
              },
              {
                sdg: "SDG 8",
                title: "Decent Work & Economic Growth",
                description: "Workforce development through education access",
                color: "blue",
                badgeBg: "bg-blue-100 dark:bg-blue-900/30",
                badgeText: "text-blue-700 dark:text-blue-400",
                iconColor: "text-blue-500",
                sdgColor: "text-blue-600 dark:text-blue-400",
                solutions: [
                  {
                    title: "Application Tracking",
                    detail:
                      "Centralized dashboard prevents missed deadlines, enabling more students to progress into higher education and careers.",
                  },
                  {
                    title: "Eligibility Simplification",
                    detail:
                      "NLP translates complex criteria into simple checklists, reducing confusion for students without school guidance.",
                  },
                ],
              },
              {
                sdg: "SDG 10",
                title: "Reduced Inequalities",
                description: "Fair access regardless of background",
                color: "orange",
                badgeBg: "bg-orange-100 dark:bg-orange-900/30",
                badgeText: "text-orange-700 dark:text-orange-400",
                iconColor: "text-orange-500",
                sdgColor: "text-orange-600 dark:text-orange-400",
                solutions: [
                  {
                    title: "Centralized Platform",
                    detail:
                      "Reduces structural disadvantages for B40, rural, and first-generation students who lack family guidance or school support.",
                  },
                  {
                    title: "Privacy-First Architecture",
                    detail:
                      "Addresses data privacy concerns while providing equitable access to scholarship opportunities.",
                  },
                ],
              },
            ].map((item, i) => (
              <Card key={i} className="border-border bg-card overflow-hidden">
                <div
                  className={`h-2 ${
                    item.color === "green"
                      ? "bg-green-500"
                      : item.color === "blue"
                      ? "bg-blue-500"
                      : "bg-orange-500"
                  }`}
                />
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-2xl font-bold ${item.sdgColor}`}>
                      {item.sdg}
                    </span>
                    <Badge className={`${item.badgeBg} ${item.badgeText}`}>
                      Target 4.A, 8.6, 10.2
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {item.description}
                  </p>
                  <div className="space-y-4">
                    {item.solutions.map((sol, j) => (
                      <div key={j} className="flex gap-3">
                        <CheckCircle2
                          className={`w-5 h-5 ${item.iconColor} flex-shrink-0 mt-0.5`}
                        />
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {sol.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {sol.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Feedback & Iteration */}
      <section id="feedback" className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-0 px-4 py-1.5 text-sm font-medium mb-4">
              User Feedback & Iteration
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Evolving Based on Real Student Needs
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Through surveys and direct feedback, we discovered that students
              needed more than just an aggregator—they needed intelligent
              guidance.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <Card className="border-border bg-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Initial Assumption
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  We initially thought a scholarship aggregator website with
                  basic management features would be sufficient. Students would
                  find opportunities and track applications in one place.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    User Feedback Insights
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        Data Privacy Concerns
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Students worried about sensitive academic/financial data
                        handling
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Sparkles className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        AI Essay Detection Anxiety
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Concern over &quot;GPT-written&quot; essays being
                        flagged as inauthentic
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Target className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        Scenario-Based Preparation
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Request for company-specific interview questions (e.g.,
                        Maxis)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Rocket className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-foreground">
                  Iteration Result: Scenario-Based AI Assistant
                </h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Based on user feedback, we introduced a foundational AI model
                that:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
                  <p className="font-semibold text-foreground text-sm mb-1">
                    Pulls Company Data
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Integrates information about scholarship providers (e.g.,
                    Maxis values, culture)
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
                  <p className="font-semibold text-foreground text-sm mb-1">
                    Generates Practice Questions
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Creates scenario-based questions aligned with company values
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
                  <p className="font-semibold text-foreground text-sm mb-1">
                    Provides Authentic Feedback
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Guides without generating—helping students find their own
                    voice
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Success Metrics */}
      <section id="metrics" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 px-4 py-1.5 text-sm font-medium mb-4">
              Success Metrics
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Measurable Impact Goals
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We track specific metrics to ensure our solution delivers real
              value to SPM students seeking scholarship opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                metric: "≥50%",
                label: "Discovery Time Reduction",
                description: "Average time to identify 5 eligible scholarships",
                icon: TrendingUp,
                color: "blue",
              },
              {
                metric: "≥85%",
                label: "Eligibility Match Precision",
                description:
                  "Recommended scholarships users confirm eligibility for",
                icon: Target,
                color: "green",
              },
              {
                metric: "≥40%",
                label: "Application Completion Rate",
                description: "Improvement in completed vs started applications",
                icon: CheckCircle2,
                color: "purple",
              },
              {
                metric: "≥80%",
                label: "Essay Confidence Index",
                description:
                  "Users reporting improved authentic writing confidence",
                icon: Sparkles,
                color: "orange",
              },
            ].map((item, i) => (
              <Card key={i} className="border-border bg-card text-center">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 mx-auto rounded-full bg-${item.color}-100 dark:bg-${item.color}-900 flex items-center justify-center mb-4`}
                  >
                    <item.icon
                      className={`w-6 h-6 text-${item.color}-600 dark:text-${item.color}-400`}
                    />
                  </div>
                  <p
                    className={`text-4xl font-bold text-${item.color}-600 mb-2`}
                  >
                    {item.metric}
                  </p>
                  <p className="font-semibold text-foreground mb-2">
                    {item.label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
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
                icon: MessageSquare,
                title: "Essay Assistant",
                description:
                  "Get AI-powered help writing compelling scholarship essays that stand out from the competition.",
                color: "fuchsia",
              },
              {
                icon: Clock,
                title: "Deadline Reminders",
                description:
                  "Never miss a deadline with smart notifications and calendar integration.",
                color: "orange",
              },
              {
                icon: Shield,
                title: "Privacy First",
                description:
                  "Your data is protected with enterprise-grade security and anonymization.",
                color: "green",
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

      {/* Scalability Roadmap */}
      <section id="roadmap" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-0 px-4 py-1.5 text-sm font-medium mb-4">
              Scalability Roadmap
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              From Pilot to Regional Impact
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our phased approach ensures sustainable growth while maintaining
              quality and measurable impact.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="border-border bg-card">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <Badge className="bg-blue-100 text-blue-700">Phase 1</Badge>
                  <span className="text-sm text-muted-foreground">
                    0-6 months
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Pilot
                </h3>
                <p className="text-muted-foreground mb-6">
                  Focus: Malaysian SPM leavers with curated scholarship database
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Top 100-200 scholarships database</span>
                  </li>
                  <li className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>AI-powered eligibility filtering</span>
                  </li>
                  <li className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Scenario-based essay simulation</span>
                  </li>
                  <li className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Privacy-first architecture</span>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm font-semibold text-foreground">
                    Goal: Prove metric improvements with real users
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <Badge className="bg-indigo-100 text-indigo-700">
                    Phase 2
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    6-18 months
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  National Scale
                </h3>
                <p className="text-muted-foreground mb-6">
                  Technical & Partnership Scaling across Malaysia
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span>Automated scraping + verification</span>
                  </li>
                  <li className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span>Modular AI orchestration</span>
                  </li>
                  <li className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span>Cloud-native horizontal scaling</span>
                  </li>
                  <li className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span>Corporate partnerships</span>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm font-semibold text-foreground">
                    Goal: 5,000+ users, ≥80% precision
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <Badge className="bg-green-100 text-green-700">Phase 3</Badge>
                  <span className="text-sm text-muted-foreground">
                    18-36 months
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Regional Expansion
                </h3>
                <p className="text-muted-foreground mb-6">
                  Beyond Malaysia to Southeast Asia
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Country-specific eligibility models</span>
                  </li>
                  <li className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Pre-university/foundation scholarships</span>
                  </li>
                  <li className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Multi-language AI support</span>
                  </li>
                  <li className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Regional scholarship infrastructure</span>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm font-semibold text-foreground">
                    Goal: Platform as regional infrastructure
                  </p>
                </div>
              </CardContent>
            </Card>
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
                Ready to Transform Scholarship Access?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join us in bridging the gap between SPM students and scholarship
                opportunities. Your journey to funded education starts here.
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
                No credit card required • Privacy-first platform
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
                Empowering Malaysian students to discover and secure educational
                funding opportunities through AI-powered guidance.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#features"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#metrics"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Impact
                  </Link>
                </li>
                <li>
                  <Link
                    href="#roadmap"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Roadmap
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
