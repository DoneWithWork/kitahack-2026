"use client";

import { useState } from "react";
import Image from "next/image";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Upload, 
  GraduationCap, 
  Award, 
  Trash2, 
  ExternalLink, 
  CheckCircle2,
  Loader2,
  Eye,
  FileIcon,
  FileType
} from "lucide-react";
import Link from "next/link";
import type { Document, DocumentUploadInput } from "@/lib/schemas/document.schema";

const documentTypes = [
  { value: "transcript", label: "Academic Transcript", icon: GraduationCap, color: "blue" },
  { value: "certificate", label: "Certificate", icon: Award, color: "green" },
  { value: "recommendation_letter", label: "Recommendation Letter", icon: FileText, color: "purple" },
  { value: "essay", label: "Essay/Personal Statement", icon: FileType, color: "amber" },
  { value: "other", label: "Other Document", icon: FileIcon, color: "slate" },
];

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const { data: allDocuments, refetch: refetchDocuments } = trpc.document.getAll.useQuery();
  const { data: certificates } = trpc.document.getByType.useQuery({ type: "certificate" });
  const { data: transcripts } = trpc.document.getByType.useQuery({ type: "transcript" });
  const uploadMutation = trpc.document.uploadWithOCR.useMutation();
  const deleteMutation = trpc.document.delete.useMutation();

  const getDocumentsByType = (type: string) => {
    if (type === "all") return allDocuments;
    return allDocuments?.filter((doc) => doc.type === type);
  };

  const getDocumentTypeInfo = (type: string) => {
    return documentTypes.find((t) => t.value === type) || documentTypes[4];
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { url } = await response.json();
      const docType = documentType as DocumentUploadInput["type"];
      await uploadMutation.mutateAsync({
        type: docType,
        name: documentName || selectedFile.name,
        description: documentDescription,
        fileUrl: url,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        mimeType: selectedFile.type,
      });

      setSelectedFile(null);
      setDocumentType("");
      setDocumentName("");
      setDocumentDescription("");
      refetchDocuments();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      await deleteMutation.mutateAsync({ id });
      refetchDocuments();
    }
  };

  const renderDocumentCard = (doc: Document) => {
    const typeInfo = getDocumentTypeInfo(doc.type);
    const Icon = typeInfo.icon;

    return (
      <Card key={doc.id} className="group">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl bg-${typeInfo.color}-100 dark:bg-${typeInfo.color}-900 flex items-center justify-center shrink-0`}>
              <Icon className={`h-6 w-6 text-${typeInfo.color}-600 dark:text-${typeInfo.color}-400`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-foreground truncate">{doc.name}</h3>
                  <p className="text-sm text-muted-foreground">{typeInfo.label}</p>
                </div>
                {doc.isVerified && (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 shrink-0">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              {doc.description && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{doc.description}</p>
              )}

              {doc.extractedData && Object.keys(doc.extractedData).length > 0 && (
                <div className="mt-3 p-3 rounded-lg bg-muted text-sm">
                  {typeof (doc.extractedData as Record<string, unknown>).certificateName === "string" && (
                    <p><span className="font-medium">Certificate:</span> {String((doc.extractedData as Record<string, unknown>).certificateName)}</p>
                  )}
                  {typeof (doc.extractedData as Record<string, unknown>).issuer === "string" && (
                    <p><span className="font-medium">Issuer:</span> {String((doc.extractedData as Record<string, unknown>).issuer)}</p>
                  )}
                  {typeof (doc.extractedData as Record<string, unknown>).issueDate === "string" && (
                    <p><span className="font-medium">Date:</span> {new Date(String((doc.extractedData as Record<string, unknown>).issueDate)).toLocaleDateString()}</p>
                  )}
                  {typeof (doc.extractedData as Record<string, unknown>).grade === "string" && (
                    <p><span className="font-medium">Grade:</span> {String((doc.extractedData as Record<string, unknown>).grade)}</p>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span>{formatFileSize(doc.fileSize)}</span>
                <span>•</span>
                <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-2 mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedDocument(doc)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{doc.name}</DialogTitle>
                      <DialogDescription>
                        Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {doc.mimeType.startsWith("image/") ? (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                          <Image
                            src={doc.fileUrl}
                            alt={doc.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <FileText className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}

                      {doc.ocrText && (
                        <div>
                          <h4 className="font-semibold mb-2">Extracted Text (OCR)</h4>
                          <div className="p-4 bg-muted rounded-lg max-h-60 overflow-y-auto">
                            <pre className="text-sm whitespace-pre-wrap">{doc.ocrText}</pre>
                          </div>
                        </div>
                      )}

                      {doc.extractedData && Object.keys(doc.extractedData).length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Extracted Data</h4>
                          <div className="grid gap-2">
                            {Object.entries(doc.extractedData).map(([key, value]) => (
                              <div key={key} className="flex justify-between p-2 bg-muted rounded">
                                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                                <span className="text-muted-foreground">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button asChild className="w-full">
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Document
                        </a>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="sm" asChild>
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(doc.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
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
              <Button variant="ghost" className="text-primary">Documents</Button>
            </Link>
            <Link href="/assistant">
              <Button variant="ghost">AI Assistant</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">My Documents</h1>
            <p className="text-muted-foreground mt-1">
              Manage your transcripts, certificates, and other important documents
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
                <DialogDescription>
                  Upload your documents for AI-powered OCR extraction and organization
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                  {selectedFile ? (
                    <div className="space-y-2">
                      <FileText className="h-12 w-12 text-blue-600 mx-auto" />
                      <p className="font-medium text-foreground">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                      <Button variant="outline" size="sm" onClick={() => setSelectedFile(null)}>
                        Change File
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-foreground mb-2">Drop your file here</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Supports PDF, PNG, JPG (max 10MB)
                      </p>
                      <Input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="max-w-sm mx-auto"
                      />
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="doc-type">Document Type *</Label>
                    <Select value={documentType} onValueChange={setDocumentType}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="doc-name">Document Name</Label>
                    <Input
                      id="doc-name"
                      placeholder="e.g., SPM Certificate 2023"
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="doc-description">Description (Optional)</Label>
                    <Textarea
                      id="doc-description"
                      placeholder="Add any notes about this document..."
                      value={documentDescription}
                      onChange={(e) => setDocumentDescription(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || !documentType || isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading & Processing OCR...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Document Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{allDocuments?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{certificates?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Certificates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{transcripts?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Transcripts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {allDocuments?.filter((d) => d.isVerified).length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="transcript">Transcripts</TabsTrigger>
            <TabsTrigger value="certificate">Certificates</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {allDocuments?.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
                <p className="text-muted-foreground mb-4">Upload your first document to get started</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent>{/* Same upload dialog content */}</DialogContent>
                </Dialog>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {getDocumentsByType("all")?.map(renderDocumentCard)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="transcript" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {getDocumentsByType("transcript")?.map(renderDocumentCard)}
            </div>
          </TabsContent>

          <TabsContent value="certificate" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {getDocumentsByType("certificate")?.map(renderDocumentCard)}
            </div>
          </TabsContent>

          <TabsContent value="other" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
                  {getDocumentsByType("other")?.map(renderDocumentCard)}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
