import { extractText } from "@/lib/ai";
import { extractGradesPrompt } from "@/lib/ai/constants";
import { adminStorage } from "@/lib/firebase/admin";
import { createTranscript } from "@/lib/repositories/transcripts.repo";
import { updateUser } from "@/lib/repositories/users.repo";
import type { Transcript } from "@/lib/schemas/transcript.schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TranscriptExtractionSchema = z.object({
  subjects: z.array(
    z.object({
      name: z.string(),
      grade: z.string(),
      code: z.string().optional(),
    }),
  ),
  year: z.number().optional(),
  school: z.string().optional(),
  gpa: z.number().optional(),
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
      schema: TranscriptExtractionSchema,
    });

    const transcript: Transcript = {
      uid: userId,
      subjects: parsed.subjects,
      uploadedAt: new Date().toISOString(),
      gpa: 3.8,
      ...(parsed.year !== undefined && { year: parsed.year }),
      ...(parsed.school !== undefined && { school: parsed.school }),
    };

    await createTranscript(transcript);

    // update user onboarding status
    await updateUser(userId, {
      transcriptUploaded: true,
      onboardingStep: 3,
    });
    return NextResponse.json({
      success: true,
      transcriptId: userId,
    });
  } catch (error) {
    console.error("Upload error:", error);
    const err = error as Error;
    if (
      err.message?.includes("not supported") ||
      err.message?.includes("image")
    ) {
      return NextResponse.json(
        {
          error:
            "Unable to process this file format. Please try uploading a PDF instead.",
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 },
    );
  }
}
