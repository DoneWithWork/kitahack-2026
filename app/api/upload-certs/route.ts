import { extractText } from "@/lib/ai";
import { extractGradesPrompt } from "@/lib/ai/constants";
import { adminStorage } from "@/lib/firebase/admin";
import { createDocument } from "@/lib/repositories/documents.repo";
import { updateUser } from "@/lib/repositories/users.repo";
import type { Document } from "@/lib/schemas/document.schema";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";

const CertificateExtractionSchema = z.object({
  certificateTitle: z.string().min(1),
  certificateType: z.enum([
    "academic",
    "completion",
    "participation",
    "award",
    "professional",
  ]),
  recipientName: z.string().min(1),
  issuerName: z.string().min(1),
  programName: z.string().min(1),
  result: z.string().optional(),
  issueDate: z
    .string()
    .refine((val) => !Number.isNaN(Date.parse(val)), "Invalid date format"),
  certificateId: z.string().optional(),
  verificationCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const userId = formData.get("userId") as string | null;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const uploadedDocuments: { documentId: string }[] = [];

    const bucket = adminStorage().bucket();

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `uploads/${Date.now()}-${file.name}`;
      const fileRef = bucket.file(filename);

      await fileRef.save(buffer, {
        contentType: file.type,
      });

      const parsed = await extractText({
        buffer,
        file,
        prompt: extractGradesPrompt,
        schema: CertificateExtractionSchema,
      });

      const now = new Date().toISOString();
      const docId = randomUUID();

      const document: Document = {
        id: docId,
        uid: userId,
        type: "certificate",
        name: parsed.certificateTitle,
        fileUrl: `gs://${bucket.name}/${filename}`,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        isVerified: false,
        uploadedAt: now,
        updatedAt: now,
        storagePath: filename,
        // Certificate-specific fields
        certificateTitle: parsed.certificateTitle,
        certificateType: parsed.certificateType,
        issuerName: parsed.issuerName,
        programName: parsed.programName,
        recipientName: parsed.recipientName,
        issueDate: parsed.issueDate,
        ...(parsed.result !== undefined && { result: parsed.result }),
      };

      await createDocument(document);
      uploadedDocuments.push({ documentId: docId });
    }

    await updateUser(userId, {
      documentsUploaded: true,
      onboardingStep: 4,
    });

    return NextResponse.json({
      success: true,
      documents: uploadedDocuments,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
