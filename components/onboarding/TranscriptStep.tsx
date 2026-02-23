import { auth } from "@/lib/firebase/client";
import { trpc } from "@/lib/trpc/client";
import { BookOpen, ChevronRight, Loader2, Upload, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";

export function TranscriptStep({
  onNext,
}: {
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualSubjects, setManualSubjects] = useState([
    { name: "", grade: "" },
  ]);

  const saveStatus = trpc.onboarding.saveTranscriptStatus.useMutation();

  const [isUploaded, setIsUploaded] = useState(false);

  const handleFileUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    const userId = auth.currentUser?.uid;

    formData.append("file", file);
    formData.append("userId", userId || "unknown");

    try {
      const response = await fetch("/api/upload-transcript", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      setIsUploaded(true); // mark upload success
      onNext(); // fix bug: call function
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
            <Button
              onClick={handleFileUpload}
              disabled={!file || isUploading || isUploaded}
              className="w-full h-12 disabled:opacity-50 disabled:cursor-not-allowed"
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
