"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sparkles, 
  GraduationCap, 
  FileText, 
  MessageSquare, 
  Lightbulb,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  Quote,
  Target,
  BrainCircuit
} from "lucide-react";
import Link from "next/link";

export default function AssistantPage() {
  const [activeTab, setActiveTab] = useState("essay");
  const [selectedScholarship, setSelectedScholarship] = useState("");
  const [essayPrompt, setEssayPrompt] = useState("");
  const [generatedEssay, setGeneratedEssay] = useState("");
  const [refinementFeedback, setRefinementFeedback] = useState("");
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [copied, setCopied] = useState(false);

  const { data: applications } = trpc.workflow.getApplications.useQuery();
  const { data: scholarships } = trpc.scholarship.getAll.useQuery();
  const generateEssayMutation = trpc.assistant.generateEssay.useMutation({
    onSuccess: (data) => setGeneratedEssay(data.essay),
  });
  const refineEssayMutation = trpc.assistant.refineEssay.useMutation({
    onSuccess: (data) => setGeneratedEssay(data.refined),
  });
  const getQuestionsMutation = trpc.assistant.getInterviewQuestions.useMutation({
    onSuccess: (data) => setInterviewQuestions(data.questions),
  });
  const getAnswerMutation = trpc.assistant.getInterviewAnswer.useMutation({
    onSuccess: (data) => setInterviewAnswer(data.answer),
  });

  const handleGenerateEssay = async () => {
    if (!selectedScholarship || !essayPrompt.trim()) return;
    await generateEssayMutation.mutateAsync({
      scholarshipId: selectedScholarship,
      prompt: essayPrompt,
    });
  };

  const handleRefineEssay = async () => {
    if (!generatedEssay || !refinementFeedback.trim()) return;
    await refineEssayMutation.mutateAsync({
      currentEssay: generatedEssay,
      feedback: refinementFeedback,
    });
  };

  const handleGetQuestions = async () => {
    if (!selectedScholarship) return;
    await getQuestionsMutation.mutateAsync({
      scholarshipId: selectedScholarship,
    });
  };

  const handleGetAnswer = async () => {
    if (!selectedQuestion) return;
    await getAnswerMutation.mutateAsync({
      question: selectedQuestion,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScholarshipName = (id: string) => {
    return scholarships?.find((s) => s.id === id)?.title || "Unknown Scholarship";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">ScholarGuide</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/scholarships">
              <Button variant="ghost">Scholarships</Button>
            </Link>
            <Link href="/documents">
              <Button variant="ghost">Documents</Button>
            </Link>
            <Link href="/assistant">
              <Button variant="ghost" className="text-primary">AI Assistant</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">AI Application Assistant</h1>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Get AI-powered help with writing essays, preparing for interviews, and crafting compelling applications that stand out.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Essay Writing</h3>
              <p className="text-sm text-muted-foreground">
                Generate personalized essay drafts tailored to specific scholarships and your profile
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <MessageSquare className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Interview Prep</h3>
              <p className="text-sm text-muted-foreground">
                Practice with AI-generated interview questions and get guidance on strong answers
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <Lightbulb className="h-8 w-8 text-green-600 dark:text-green-400 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Smart Refinement</h3>
              <p className="text-sm text-muted-foreground">
                Get suggestions to improve your essays and applications based on specific feedback
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tool */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5" />
              AI Writing Studio
            </CardTitle>
            <CardDescription>
              Select a scholarship and let AI help you craft the perfect application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="essay" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Essay Generator
                </TabsTrigger>
                <TabsTrigger value="interview" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Interview Prep
                </TabsTrigger>
              </TabsList>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Scholarship</label>
                  <Select value={selectedScholarship} onValueChange={setSelectedScholarship}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a scholarship..." />
                    </SelectTrigger>
                    <SelectContent>
                      {applications?.map((app) => (
                        <SelectItem key={app.scholarshipId} value={app.scholarshipId}>
                          {getScholarshipName(app.scholarshipId)}
                        </SelectItem>
                      ))}
                      {scholarships?.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="essay" className="space-y-6">
                {!generatedEssay ? (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Essay Prompt or Topic</label>
                      <Textarea
                        placeholder="Paste the essay prompt here or describe what you want to write about..."
                        value={essayPrompt}
                        onChange={(e) => setEssayPrompt(e.target.value)}
                        className="min-h-[150px]"
                      />
                    </div>

                    <div className="bg-muted rounded-lg p-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Tips for Best Results:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Include the complete essay prompt from the scholarship</li>
                        <li>Mention specific achievements or experiences you want to highlight</li>
                        <li>Note any word count requirements</li>
                        <li>Describe the tone you&apos;re aiming for (formal, personal, creative)</li>
                      </ul>
                    </div>

                    <Button
                      onClick={handleGenerateEssay}
                      disabled={!selectedScholarship || !essayPrompt.trim() || generateEssayMutation.isPending}
                      className="w-full h-12"
                    >
                      {generateEssayMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          AI is Writing Your Essay...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Essay Draft
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Generated Essay</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generatedEssay)}
                        >
                          {copied ? (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setGeneratedEssay("")}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Start Over
                        </Button>
                      </div>
                    </div>

                    <ScrollArea className="h-[400px] rounded-lg border p-4">
                      <div className="prose dark:prose-invert max-w-none">
                        <div className="whitespace-pre-wrap">{generatedEssay}</div>
                      </div>
                    </ScrollArea>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Refine Your Essay</h4>
                      <Textarea
                        placeholder="Enter feedback for improvements (e.g., 'Make it more personal', 'Add more details about my volunteer work', 'Shorten the introduction')..."
                        value={refinementFeedback}
                        onChange={(e) => setRefinementFeedback(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button
                        onClick={handleRefineEssay}
                        disabled={!refinementFeedback.trim() || refineEssayMutation.isPending}
                        variant="outline"
                        className="w-full"
                      >
                        {refineEssayMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Refining...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Apply Feedback
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="interview" className="space-y-6">
                {interviewQuestions.length === 0 ? (
                  <>
                    <div className="bg-muted rounded-lg p-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Interview Preparation
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        AI will generate common interview questions based on the scholarship&apos;s focus and requirements. 
                        You&apos;ll also get guidance on how to structure strong answers based on your profile.
                      </p>
                    </div>

                    <Button
                      onClick={handleGetQuestions}
                      disabled={!selectedScholarship || getQuestionsMutation.isPending}
                      className="w-full h-12"
                    >
                      {getQuestionsMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Questions...
                        </>
                      ) : (
                        <>
                          <Target className="mr-2 h-4 w-4" />
                          Generate Interview Questions
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Practice Questions</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setInterviewQuestions([]);
                          setSelectedQuestion("");
                          setInterviewAnswer("");
                        }}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Generate New Questions
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {interviewQuestions.map((question, idx) => (
                        <Card
                          key={idx}
                          className={`cursor-pointer transition-colors ${
                            selectedQuestion === question ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "hover:bg-muted"
                          }`}
                          onClick={() => {
                            setSelectedQuestion(question);
                            setInterviewAnswer("");
                          }}
                        >
                          <CardContent className="p-4 flex items-start gap-3">
                            <Badge variant="secondary" className="shrink-0">{idx + 1}</Badge>
                            <p className="text-sm">{question}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {selectedQuestion && (
                      <div className="space-y-4">
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-2">Selected Question:</h4>
                          <div className="p-4 bg-muted rounded-lg">
                            <Quote className="h-4 w-4 text-muted-foreground mb-2" />
                            <p className="text-sm italic">{selectedQuestion}</p>
                          </div>
                        </div>

                        {!interviewAnswer ? (
                          <Button
                            onClick={handleGetAnswer}
                            disabled={getAnswerMutation.isPending}
                            className="w-full"
                          >
                            {getAnswerMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Preparing Guidance...
                              </>
                            ) : (
                              <>
                                <Lightbulb className="mr-2 h-4 w-4" />
                                Get Answer Guidance
                              </>
                            )}
                          </Button>
                        ) : (
                          <ScrollArea className="h-[300px] rounded-lg border p-4">
                            <div className="prose dark:prose-invert max-w-none">
                              <div className="whitespace-pre-wrap">{interviewAnswer}</div>
                            </div>
                          </ScrollArea>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Tips Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Essay Writing Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span>Start with a compelling hook that grabs attention</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span>Show, don't tell - use specific examples and stories</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span>Connect your experiences to the scholarship's mission</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span>Be authentic - let your genuine voice shine through</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span>Proofread multiple times and have others review</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interview Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span>Research the scholarship organization thoroughly</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span>Prepare specific examples using the STAR method</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span>Practice with mock interviews to build confidence</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span>Dress professionally and test your technology</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span>Prepare thoughtful questions to ask the interviewer</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
