"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc/client";
import {
  Award,
  ExternalLink,
  FileText,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const formatDate = (value: string | undefined): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

const titleize = (value: string): string =>
  value
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());

export default function DocumentsPage() {
  const { data: certificates } = trpc.document.getByType.useQuery({
    type: "certificate",
  });
  const { data: transcript } = trpc.transcript.get.useQuery();

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border bg-gradient-to-br from-blue-50 via-white to-amber-50 p-6 shadow-sm dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
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
                  <p className="text-lg font-semibold text-foreground">
                    {certificates?.length || 0}
                  </p>
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
                  <p className="text-lg font-semibold text-foreground">
                    {transcript ? 1 : 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Tabs defaultValue="certificates" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="transcripts">Transcripts</TabsTrigger>
        </TabsList>

        <TabsContent value="certificates" className="space-y-4">
          {certificates && certificates.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {certificates.map((doc) => {
                const extracted = doc.extractedData || {};
                return (
                  <Card
                    key={doc.id}
                    className="group border-border bg-card shadow-sm"
                  >
                    <CardHeader className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-lg">{doc.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {doc.fileName}
                          </p>
                        </div>
                        {doc.isVerified && (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
                            <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="rounded-2xl border border-border bg-muted/50 p-4">
                        <div className="grid gap-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Issuer
                            </span>
                            <span className="font-medium text-foreground">
                              {typeof extracted.issuer === "string"
                                ? extracted.issuer
                                : "—"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Issue Date
                            </span>
                            <span className="font-medium text-foreground">
                              {formatDate(
                                typeof extracted.issueDate === "string"
                                  ? extracted.issueDate
                                  : undefined,
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Level / Grade
                            </span>
                            <span className="font-medium text-foreground">
                              {typeof extracted.level === "string"
                                ? extracted.level
                                : typeof extracted.grade === "string"
                                  ? extracted.grade
                                  : "—"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {Object.keys(extracted).length > 0 && (
                        <div className="grid gap-2 text-sm">
                          {Object.entries(extracted).map(([key, value]) => (
                            <div
                              key={key}
                              className="flex items-start justify-between gap-4 border-b border-border/60 pb-2"
                            >
                              <span className="text-muted-foreground">
                                {titleize(key)}
                              </span>
                              <span className="text-right font-medium text-foreground">
                                {Array.isArray(value)
                                  ? value.join(", ")
                                  : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                        <span>{formatFileSize(doc.fileSize)}</span>
                        <span>Uploaded {formatDate(doc.uploadedAt)}</span>
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <Award className="h-10 w-10 text-muted-foreground" />
                <p className="text-lg font-semibold text-foreground">
                  No certificates yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Upload certificates to keep them organized for applications.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="transcripts" className="space-y-4">
          {transcript ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="group border-border bg-card shadow-sm">
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">
                        Academic Transcript
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Graduation year {transcript.year}
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                      <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                      Verified
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-3 rounded-2xl border border-border bg-muted/50 p-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">GPA</span>
                      <span className="font-medium text-foreground">
                        {transcript.gpa}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Year</span>
                      <span className="font-medium text-foreground">
                        {transcript.year}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subjects</span>
                      <span className="font-medium text-foreground">
                        {transcript.subjects.length}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border p-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Subject Grades</span>
                      <span>{transcript.subjects.length} entries</span>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm">
                      {transcript.subjects.map((subject, index) => (
                        <div
                          key={`${subject.name}-${index}`}
                          className="flex items-center justify-between border-b border-border/60 pb-2"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {subject.name}
                            </span>
                            {subject.code && (
                              <span className="text-xs text-muted-foreground">
                                {subject.code}
                              </span>
                            )}
                          </div>
                          <span className="font-semibold text-foreground">
                            {subject.grade}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                    <span>Uploaded {formatDate(transcript.uploadedAt)}</span>
                    {transcript.fileUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={transcript.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <GraduationCap className="h-10 w-10 text-muted-foreground" />
                <p className="text-lg font-semibold text-foreground">
                  No transcripts yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Upload transcripts to keep them ready for review.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
