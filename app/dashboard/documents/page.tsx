"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/firebase/client";
import { trpc } from "@/lib/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileText,
  GraduationCap,
  Loader2,
  Plus,
  ShieldCheck,
  Upload,
  User,
  Building2,
} from "lucide-react";
import { useCallback, useState } from "react";

const formatDate = (value: string | undefined): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const certTypeBadge = (type: string | undefined) => {
  const styles: Record<string, string> = {
    academic:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    completion:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    participation:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    award:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
    professional:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
  };
  const label = type || "unknown";
  return (
    <Badge className={styles[label] || "bg-gray-100 text-gray-700"}>
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </Badge>
  );
};

export default function DocumentsPage() {
  const utils = trpc.useUtils();
  const { data: certificates, isLoading: certsLoading } =
    trpc.document.getByType.useQuery({
      type: "certificate",
    });
  const { data: transcript, isLoading: transcriptLoading } =
    trpc.transcript.get.useQuery();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFiles(Array.from(e.target.files));
        setUploadError(null);
      }
    },
    [],
  );

  const handleUpload = useCallback(async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    const userId = auth.currentUser?.uid;
    if (!userId) {
      setUploadError("User not authenticated. Please log in again.");
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("userId", userId);

    try {
      const response = await fetch("/api/upload-certs", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      await response.json();
      setFiles([]);
      setUploadOpen(false);
      utils.document.getByType.invalidate({ type: "certificate" });
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(
        error instanceof Error ? error.message : "Upload failed. Try again.",
      );
    } finally {
      setIsUploading(false);
    }
  }, [files, utils.document.getByType]);

  const certCount = certificates?.length || 0;
  const hasTranscript = !!transcript;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-border bg-linear-to-br from-blue-50 via-white to-amber-50 p-6 shadow-sm dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  Document Vault
                </p>
                <h1 className="text-3xl font-bold text-foreground">
                  Certificates & Transcripts
                </h1>
              </div>
            </div>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              Verified academic records pulled from your account. Keep them
              polished, easy to review, and ready for scholarship submissions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Card className="border-0 bg-white/80 shadow-sm dark:bg-slate-900/70">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950">
                  <Award className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Certificates</p>
                  {certsLoading ? (
                    <Skeleton className="mt-1 h-6 w-8" />
                  ) : (
                    <p className="text-lg font-semibold text-foreground">
                      {certCount}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/80 shadow-sm dark:bg-slate-900/70">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950">
                  <GraduationCap className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Transcripts</p>
                  {transcriptLoading ? (
                    <Skeleton className="mt-1 h-6 w-8" />
                  ) : (
                    <p className="text-lg font-semibold text-foreground">
                      {hasTranscript ? 1 : 0}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="certificates" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted">
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="transcripts">Transcripts</TabsTrigger>
          </TabsList>

          {/* Upload Certificate Dialog */}
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Certificate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  Upload Certificates
                </DialogTitle>
                <DialogDescription>
                  Upload certificate images or PDFs. Our AI will automatically
                  extract and organize the information.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:border-blue-500">
                  <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                  <p className="mb-1 text-sm font-medium text-foreground">
                    Drop files here or click to browse
                  </p>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Supports PDF, PNG, JPG (multiple files)
                  </p>
                  <Input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    multiple
                    onChange={handleFileChange}
                    className="mx-auto max-w-xs"
                  />
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      Selected files ({files.length}):
                    </p>
                    <div className="max-h-32 space-y-1 overflow-y-auto rounded-lg bg-muted/50 p-2">
                      {files.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="truncate">{f.name}</span>
                          <span className="ml-auto whitespace-nowrap">
                            {(f.size / 1024).toFixed(0)} KB
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {uploadError && (
                  <p className="text-sm text-red-500">{uploadError}</p>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setUploadOpen(false)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={files.length === 0 || isUploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload {files.length > 0 ? `(${files.length})` : ""}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-4">
          {certsLoading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card
                  key={i}
                  className="overflow-hidden border-border bg-card shadow-sm"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <Skeleton className="mt-0.5 h-4 w-4 shrink-0 rounded" />
                          <div className="min-w-0 flex-1 space-y-1">
                            <Skeleton className="h-3 w-12" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-16 rounded-md" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : certificates && certificates.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {certificates.map((doc) => (
                <Card
                  key={doc.id}
                  className="group relative overflow-hidden border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Type badge at top */}
                  <div className="absolute top-4 right-4">
                    {certTypeBadge(doc.certificateType)}
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="pr-24 text-base font-bold leading-snug">
                      {doc.certificateTitle || doc.name || "Certificate"}
                    </CardTitle>
                    {doc.programName && (
                      <p className="text-sm text-muted-foreground">
                        {doc.programName}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-start gap-2">
                        <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">
                            Issuer
                          </p>
                          <p className="truncate font-medium text-foreground">
                            {doc.issuerName || "—"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">
                            Issue Date
                          </p>
                          <p className="truncate font-medium text-foreground">
                            {doc.issueDate || "—"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">
                            Recipient
                          </p>
                          <p className="truncate font-medium text-foreground">
                            {doc.recipientName || "—"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">
                            Result
                          </p>
                          <p className="truncate font-medium text-foreground">
                            {doc.result || "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <div className="flex items-center gap-2">
                        {doc.isVerified && (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
                            <ShieldCheck className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(doc.uploadedAt)}
                        </span>
                      </div>
                      {doc.fileUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          asChild
                        >
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                            View
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Add more card */}
              <Card
                className="flex cursor-pointer items-center justify-center border-dashed border-border transition-colors hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
                onClick={() => setUploadOpen(true)}
              >
                <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                    <Plus className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Add Certificate
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card
              className="cursor-pointer border-dashed transition-colors hover:border-blue-500"
              onClick={() => setUploadOpen(true)}
            >
              <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                  <Award className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    No certificates yet
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Click here to upload your first certificate. Our AI will
                    extract all the details automatically.
                  </p>
                </div>
                <Button className="mt-2 bg-blue-600 hover:bg-blue-700">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Certificate
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Transcripts Tab */}
        <TabsContent value="transcripts" className="space-y-4">
          {transcriptLoading ? (
            <div className="grid gap-6 xl:grid-cols-3">
              {/* Transcript overview skeleton */}
              <Card className="border-border bg-card shadow-sm xl:col-span-1">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* GPA highlight skeleton */}
                  <Skeleton className="h-24 w-full rounded-xl" />
                  {/* Stats skeleton */}
                  <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-20 rounded-xl" />
                    <Skeleton className="h-20 rounded-xl" />
                  </div>
                  {/* Upload info skeleton */}
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>
                </CardContent>
              </Card>

              {/* Subject grades skeleton */}
              <Card className="border-border bg-card shadow-sm xl:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded" />
                      <Skeleton className="h-5 w-28" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3"
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="ml-3 h-9 w-9 shrink-0 rounded-lg" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : transcript ? (
            <div className="grid gap-6 xl:grid-cols-3">
              {/* Transcript overview card */}
              <Card className="border-border bg-card shadow-sm xl:col-span-1">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">
                        Academic Transcript
                      </CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Graduation year {transcript.year}
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                      <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                      Verified
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* GPA highlight */}
                  <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white">
                    <p className="text-xs font-medium uppercase tracking-wider opacity-80">
                      Grade Point Average
                    </p>
                    <p className="mt-1 text-4xl font-bold">
                      {transcript.gpa || "N/A"}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {transcript.year}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">Year</p>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {transcript.subjects?.length ?? 0}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Subjects
                      </p>
                    </div>
                  </div>

                  {/* Upload info */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Uploaded {formatDate(transcript.uploadedAt)}</span>
                    {transcript.fileUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        asChild
                      >
                        <a
                          href={transcript.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                          View Original
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Subject grades card */}
              <Card className="border-border bg-card shadow-sm xl:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">Subject Grades</CardTitle>
                    </div>
                    <Badge variant="secondary">
                      {transcript.subjects?.length ?? 0} subjects
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {(transcript.subjects ?? []).map((subject, index) => {
                      const grade = Number(subject.grade);
                      const gradeColor =
                        grade >= 4
                          ? "text-emerald-600 dark:text-emerald-400"
                          : grade >= 3
                            ? "text-blue-600 dark:text-blue-400"
                            : grade >= 2
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-red-600 dark:text-red-400";
                      const gradeBg =
                        grade >= 4
                          ? "bg-emerald-100 dark:bg-emerald-950"
                          : grade >= 3
                            ? "bg-blue-100 dark:bg-blue-950"
                            : grade >= 2
                              ? "bg-amber-100 dark:bg-amber-950"
                              : "bg-red-100 dark:bg-red-950";

                      return (
                        <div
                          key={`${subject.name}-${index}`}
                          className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/60"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                              {subject.name}
                            </p>
                            {subject.code && (
                              <p className="text-xs text-muted-foreground">
                                {subject.code}
                              </p>
                            )}
                          </div>
                          <div
                            className={`ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${gradeBg} ${gradeColor}`}
                          >
                            {subject.grade}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                  <GraduationCap className="h-8 w-8 text-emerald-600 dark:text-emerald-300" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    No transcripts yet
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Upload your academic transcript to keep it ready for
                    scholarship applications.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
