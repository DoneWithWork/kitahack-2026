"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc/client";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileText,
  Globe,
  GraduationCap,
  Loader2,
  Sparkles,
  Target,
  Upload,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const steps = [
  { id: 0, title: "Welcome", description: "Let's get you started" },
  { id: 1, title: "Profile", description: "Tell us about yourself" },
  { id: 2, title: "Transcript", description: "Upload your academic results" },
  { id: 3, title: "Documents", description: "Add certificates & credentials" },
  { id: 4, title: "Complete", description: "You're all set!" },
];

const educationLevels = [
  { value: "high_school", label: "High School" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "graduate", label: "Graduate" },
  { value: "postgraduate", label: "Postgraduate" },
];

const incomeBrackets = [
  { value: "low", label: "Low Income (< $30,000/year)" },
  { value: "medium", label: "Medium Income ($30,000 - $80,000/year)" },
  { value: "high", label: "High Income (> $80,000/year)" },
];

const commonInterests = [
  "Computer Science",
  "Engineering",
  "Medicine",
  "Business",
  "Law",
  "Arts",
  "Sciences",
  "Social Sciences",
  "Education",
  "Environmental Studies",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Psychology",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  const {
    data: onboardingStatus,
    isLoading: statusLoading,
    refetch: refetchStatus,
  } = trpc.onboarding.getStatus.useQuery();

  useEffect(() => {
    if (onboardingStatus) {
      if (onboardingStatus.onboardingCompleted) {
        router.push("/dashboard");
      } else {
        console.log(onboardingStatus.onboardingStep);
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
            onBack={() => setCurrentStep(0)}
          />
        );
      case 2:
        return (
          <TranscriptStep
            onNext={() => {
              refetchStatus();
              setCurrentStep(3);
            }}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <DocumentsStep
            onNext={() => {
              refetchStatus();
              setCurrentStep(4);
            }}
            onBack={() => setCurrentStep(2)}
          />
        );
      case 4:
        return <CompleteStep onComplete={() => router.push("/dashboard")} />;
      default:
        return <WelcomeStep onNext={() => setCurrentStep(1)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500">
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
              {" "}
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

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader className="text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-10 w-10 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome to ScholarGuide!
        </CardTitle>
        <CardDescription className="text-lg text-slate-600 dark:text-slate-300">
          Let's set up your profile to find the perfect scholarships for you
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

function ProfileStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [formData, setFormData] = useState({
    citizenship: "",
    incomeBracket: "",
    educationLevel: "",
    fieldOfStudy: "",
    interests: [] as string[],
    goals: "",
  });
  const [customInterest, setCustomInterest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveProfile = trpc.onboarding.saveProfile.useMutation();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await saveProfile.mutateAsync({
        citizenship: formData.citizenship,
        incomeBracket: formData.incomeBracket as "low" | "medium" | "high",
        educationLevel: formData.educationLevel as
          | "high_school"
          | "undergraduate"
          | "graduate"
          | "postgraduate",
        fieldOfStudy: formData.fieldOfStudy,
        interests: formData.interests,
        goals: formData.goals,
      });
      onNext();
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const addCustomInterest = () => {
    if (customInterest && !formData.interests.includes(customInterest)) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, customInterest],
      }));
      setCustomInterest("");
    }
  };

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="h-6 w-6 text-blue-600" />
          Personal Information
        </CardTitle>
        <CardDescription>
          This helps us find scholarships that match your background and goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="citizenship">Citizenship/Nationality *</Label>
            <Input
              id="citizenship"
              placeholder="e.g., Malaysian, Singaporean"
              value={formData.citizenship}
              onChange={(e) =>
                setFormData({ ...formData, citizenship: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="income">Household Income Bracket *</Label>
            <Select
              value={formData.incomeBracket}
              onValueChange={(value) =>
                setFormData({ ...formData, incomeBracket: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select income bracket" />
              </SelectTrigger>
              <SelectContent>
                {incomeBrackets.map((bracket) => (
                  <SelectItem key={bracket.value} value={bracket.value}>
                    {bracket.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="education">Current Education Level *</Label>
            <Select
              value={formData.educationLevel}
              onValueChange={(value) =>
                setFormData({ ...formData, educationLevel: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                {educationLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="field">Field of Study *</Label>
            <Input
              id="field"
              placeholder="e.g., Computer Science, Medicine"
              value={formData.fieldOfStudy}
              onChange={(e) =>
                setFormData({ ...formData, fieldOfStudy: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Areas of Interest *</Label>
          <div className="flex flex-wrap gap-2">
            {commonInterests.map((interest) => (
              <Badge
                key={interest}
                variant={
                  formData.interests.includes(interest) ? "default" : "outline"
                }
                className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Add custom interest"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCustomInterest()}
            />
            <Button type="button" variant="outline" onClick={addCustomInterest}>
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goals">Your Goals & Aspirations *</Label>
          <Textarea
            id="goals"
            placeholder="Tell us about your academic and career goals..."
            value={formData.goals}
            onChange={(e) =>
              setFormData({ ...formData, goals: e.target.value })
            }
            className="min-h-[100px]"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={
              !formData.citizenship ||
              !formData.incomeBracket ||
              !formData.educationLevel ||
              !formData.fieldOfStudy ||
              formData.interests.length === 0 ||
              !formData.goals ||
              isSubmitting
            }
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TranscriptStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualSubjects, setManualSubjects] = useState([
    { name: "", grade: "" },
  ]);

  const transcriptQuery = trpc.transcript.get.useQuery();
  const uploadMutation = trpc.transcript.uploadFromImage.useMutation();
  const saveStatus = trpc.onboarding.saveTranscriptStatus.useMutation();

  const handleFileUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { url } = await response.json();
      // const result = await uploadMutation.mutateAsync({ imageUrl: url });
      // setUploadResult(result);
      await saveStatus.mutateAsync({ uploaded: true });
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const addSubject = () => {
    setManualSubjects([...manualSubjects, { name: "", grade: "" }]);
  };

  const updateSubject = (index: number, field: string, value: string) => {
    const updated = [...manualSubjects];
    updated[index] = { ...updated[index], [field]: value };
    setManualSubjects(updated);
  };

  const removeSubject = (index: number) => {
    setManualSubjects(manualSubjects.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          Academic Transcript
        </CardTitle>
        <CardDescription>
          Upload your academic transcript for AI analysis. This helps us find
          scholarships that match your academic achievements.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {transcriptQuery.data && (
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">
                  Transcript already uploaded!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  GPA: {transcriptQuery.data.gpa} |{" "}
                  {transcriptQuery.data.subjects.length} subjects
                </p>
              </div>
            </div>
          </div>
        )}

        {!showManualEntry ? (
          <>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Upload your transcript
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Supports PDF, PNG, JPG (max 10MB)
              </p>
              <Input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="max-w-sm mx-auto"
              />
              {file && (
                <p className="mt-2 text-sm text-blue-600">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {uploadResult && (
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/30">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Extracted Data:
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  GPA: {uploadResult.transcript.gpa}
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Subjects: {uploadResult.transcript.subjects.length}
                </p>
              </div>
            )}

            <Button
              onClick={handleFileUpload}
              disabled={!file || isUploading}
              className="w-full h-12"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading & Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload and Parse
                </>
              )}
            </Button>

            <div className="text-center">
              <Button variant="link" onClick={() => setShowManualEntry(true)}>
                Prefer to enter manually?
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <h4 className="font-medium">Manual Entry</h4>
            {manualSubjects.map((subject, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Subject name"
                  value={subject.name}
                  onChange={(e) => updateSubject(index, "name", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Grade"
                  value={subject.grade}
                  onChange={(e) =>
                    updateSubject(index, "grade", e.target.value)
                  }
                  className="w-24"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSubject(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addSubject} className="w-full">
              Add Subject
            </Button>
            <Button
              variant="link"
              onClick={() => setShowManualEntry(false)}
              className="w-full"
            >
              Back to upload
            </Button>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={async () => {
              await saveStatus.mutateAsync({ uploaded: true });
              onNext();
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DocumentsStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [certificates, setCertificates] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);

  const documentsQuery = trpc.document.getByType.useQuery({
    type: "certificate",
  });
  const uploadMutation = trpc.document.uploadWithOCR.useMutation();
  const saveStatus = trpc.onboarding.saveDocumentsStatus.useMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCertificates(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (certificates.length === 0) return;

    setIsUploading(true);
    const uploaded = [];

    for (const file of certificates) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const { url } = await response.json();
        const result = await uploadMutation.mutateAsync({
          type: "certificate",
          name: file.name,
          fileUrl: url,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        });
        uploaded.push(result.document);
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    setUploadedDocs(uploaded);
    await saveStatus.mutateAsync({ uploaded: true });
    setIsUploading(false);
    setCertificates([]);
  };

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="h-6 w-6 text-blue-600" />
          Certificates & Documents
        </CardTitle>
        <CardDescription>
          Upload your certificates, awards, and other credentials. Our AI will
          extract and organize the information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {documentsQuery.data && documentsQuery.data.length > 0 && (
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">
                  {documentsQuery.data.length} document(s) already uploaded
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
          <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            Upload certificates
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            You can select multiple files (PDF, PNG, JPG)
          </p>
          <Input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            multiple
            onChange={handleFileChange}
            className="max-w-sm mx-auto"
          />
          {certificates.length > 0 && (
            <p className="mt-2 text-sm text-blue-600">
              Selected: {certificates.length} file(s)
            </p>
          )}
        </div>

        {uploadedDocs.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-slate-900 dark:text-white">
              Uploaded Documents:
            </h4>
            {uploadedDocs.map((doc, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
              >
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">{doc.name}</span>
                {doc.extractedData?.certificateName && (
                  <Badge variant="secondary" className="ml-auto">
                    {doc.extractedData.certificateName}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={certificates.length === 0 || isUploading}
          className="w-full h-12"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing OCR...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload with OCR
            </>
          )}
        </Button>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={onNext}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CompleteStep({ onComplete }: { onComplete: () => void }) {
  const completeMutation = trpc.onboarding.completeOnboarding.useMutation();

  const handleComplete = async () => {
    await completeMutation.mutateAsync();
    onComplete();
  };

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader className="text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">
          You're All Set!
        </CardTitle>
        <CardDescription className="text-lg text-slate-600 dark:text-slate-300">
          Your profile is complete. Let's find you some scholarships!
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
