import { extractText } from "@/lib/ai";
import { extractGradesPrompt } from "@/lib/ai/constants";
import { adminDb, adminStorage } from "@/lib/firebase/admin";
import { updateUser } from "@/lib/repositories/users.repo";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const CertificateSchema = z.object({
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

    const uploadedDocuments: { certificateId: string }[] = [];

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
        schema: CertificateSchema,
      });

      const doc = await adminDb()
        .collection("certificates")
        .add({
          userId,
          ...parsed,
          uploadedAt: new Date(),
          storagePath: filename,
        });

      uploadedDocuments.push({ certificateId: doc.id });

      await updateUser(userId, {
        documentsUploaded: true,
        onboardingStep: 4,
      });
    }

    return NextResponse.json({
      success: true,
      documents: uploadedDocuments,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
