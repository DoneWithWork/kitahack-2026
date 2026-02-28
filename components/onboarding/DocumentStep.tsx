import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/firebase/client";
import { trpc } from "@/lib/trpc/client";
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function DocumentsStep({
  onNext,
}: {
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
}) {
  const [certificates, setCertificates] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [sessionUploadCount, setSessionUploadCount] = useState(0);

  const documentsQuery = trpc.document.getByType.useQuery({
    type: "certificate",
  });
  const saveStatus = trpc.onboarding.saveDocumentsStatus.useMutation();

  const existingCount = documentsQuery.data?.length ?? 0;
  const totalUploaded = existingCount + sessionUploadCount;
  const canContinue = totalUploaded > 0;

  // Clear success message after a few seconds
  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => setUploadSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCertificates(Array.from(e.target.files));
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (certificates.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    const formData = new FormData();
    certificates.forEach((file) => formData.append("files", file));
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setUploadError("User not authenticated. Please refresh and try again.");
      setIsUploading(false);
      return;
    }
    formData.append("userId", userId);

    try {
      const response = await fetch("/api/upload-certs", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      await response.json();
      setSessionUploadCount((prev) => prev + certificates.length);
      setUploadSuccess(true);
      setCertificates([]);

      // Refetch to update the existing documents list
      await documentsQuery.refetch();
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload documents. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinue = async () => {
    if (!canContinue) return;
    await saveStatus.mutateAsync({ uploaded: true });
    onNext();
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
          extract and organize the information. You must upload at least one
          certificate to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing documents indicator */}
        {existingCount > 0 && (
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">
                  {existingCount} document(s) already uploaded
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload success feedback */}
        {uploadSuccess && (
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700 animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="font-medium text-green-800 dark:text-green-200">
                Certificates uploaded and processed successfully!
              </p>
            </div>
          </div>
        )}

        {/* Upload error feedback */}
        {uploadError && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 animate-fade-in">
            <p className="font-medium text-red-800 dark:text-red-200">
              {uploadError}
            </p>
          </div>
        )}

        {/* Drop zone */}
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

        {/* Upload button */}
        <Button
          onClick={handleUpload}
          disabled={certificates.length === 0 || isUploading}
          className="w-full h-12"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>

        {/* Hint when no certs uploaded yet */}
        {!canContinue && (
          <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
            Please upload at least one certificate before continuing.
          </p>
        )}

        {/* Continue button */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={handleContinue}
            disabled={!canContinue || saveStatus.isPending}
            className={`flex-1 h-12 transition-all duration-300 ${
              canContinue
                ? "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/25 animate-[borderPulse_2s_ease-in-out_infinite]"
                : "bg-slate-400 cursor-not-allowed"
            }`}
          >
            {saveStatus.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                {canContinue ? (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                ) : null}
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
