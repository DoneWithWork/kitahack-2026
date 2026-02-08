"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"file" | "text">("file");

  const transcriptQuery = trpc.transcript.get.useQuery();
  const uploadMutation = trpc.transcript.uploadFromImage.useMutation({
    onSuccess: () => {
      transcriptQuery.refetch();
    },
  });

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { url } = await response.json();
      await uploadMutation.mutateAsync({ imageUrl: url });
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleTextSubmit = async () => {
    console.log("Text submitted:", text);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Upload Transcript</h1>
          <nav className="flex gap-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          {transcriptQuery.data ? (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Current Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">GPA:</span>{" "}
                    {transcriptQuery.data.gpa}
                  </p>
                  <p>
                    <span className="font-medium">Year:</span>{" "}
                    {transcriptQuery.data.year}
                  </p>
                  <p>
                    <span className="font-medium">Subjects:</span>{" "}
                    {transcriptQuery.data.subjects.length}
                  </p>
                  <div className="mt-4">
                    <p className="font-medium">Subject Grades:</p>
                    <ul className="mt-2 space-y-1">
                      {transcriptQuery.data.subjects.map((subject, idx) => (
                        <li key={idx} className="text-sm">
                          {subject.name}: {subject.grade}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Upload New Transcript</CardTitle>
              <CardDescription>
                Upload your SPM transcript for AI analysis and scholarship matching
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <Button
                  variant={uploadMethod === "file" ? "default" : "outline"}
                  onClick={() => setUploadMethod("file")}
                >
                  Upload File
                </Button>
                <Button
                  variant={uploadMethod === "text" ? "default" : "outline"}
                  onClick={() => setUploadMethod("text")}
                >
                  Paste Text
                </Button>
              </div>

              {uploadMethod === "file" ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="transcript-file">Select transcript file (PDF or Image)</Label>
                    <Input
                      id="transcript-file"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="mt-2"
                    />
                  </div>
                  <Button
                    onClick={handleFileUpload}
                    disabled={!file || uploadMutation.isPending}
                    className="w-full"
                  >
                    {uploadMutation.isPending ? "Uploading..." : "Upload and Parse"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="transcript-text">Paste transcript text</Label>
                    <Textarea
                      id="transcript-text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Paste your transcript text here..."
                      className="mt-2 min-h-[200px]"
                    />
                  </div>
                  <Button
                    onClick={handleTextSubmit}
                    disabled={!text.trim()}
                    className="w-full"
                  >
                    Submit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
