import { NextRequest, NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

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

    const [url] = await fileRef.getSignedUrl({
      action: "read",
      expires: Date.now() + 24 * 60 * 60 * 1000,
    });

    return NextResponse.json({ success: true, url, path: filename });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
