import { extractText } from "@/lib/ai";
import { extractGradesPrompt } from "@/lib/ai/constants";
import { adminDb, adminStorage } from "@/lib/firebase/admin";
import { updateUser } from "@/lib/repositories/users.repo";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TranscriptSchema = z.object({
  subjects: z.array(
    z.object({
      name: z.string(),
      grade: z.string(),
      code: z.string().optional(),
    }),
  ),
  year: z.number(),
  school: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string | null;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const bucket = adminStorage().bucket();
    const filename = `uploads/${Date.now()}-${file.name}`;
    const fileRef = bucket.file(filename);

    await fileRef.save(buffer, {
      contentType: file.type,
    });

    const parsed = await extractText({
      buffer,
      file,
      prompt: extractGradesPrompt,
      schema: TranscriptSchema,
    });

    const doc = await adminDb()
      .collection("transcripts")
      .add({
        userId,
        ...parsed,
        uploadedAt: new Date(),
      });

    // update user onboarding status
    await updateUser(userId, {
      transcriptUploaded: true,
      onboardingStep: 3,
    });
    return NextResponse.json({
      success: true,
      transcriptId: doc.id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
