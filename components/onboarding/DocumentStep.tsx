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
import { useState } from "react";
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

  const documentsQuery = trpc.document.getByType.useQuery({
    type: "certificates",
  });
  const saveStatus = trpc.onboarding.saveDocumentsStatus.useMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCertificates(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (certificates.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    certificates.forEach((file) => formData.append("files", file));
    const userId = auth.currentUser?.uid;
    if (!userId) {
      alert("User not authenticated");
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
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload documents. Please try again.");
    }

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

        {/* {uploadedDocs.length > 0 && (
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
                  <Badge className="ml-auto">
                    {doc.extractedData.certificateName}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )} */}

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
              Upload{" "}
            </>
          )}
        </Button>

        <div className="flex gap-4 pt-4">
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
