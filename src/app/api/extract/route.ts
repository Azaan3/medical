import { NextResponse } from "next/server";
import { extractDocumentText } from "@/lib/documents/extract";

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large (max 8 MB)" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractDocumentText(
      buffer,
      file.name,
      file.type || "application/octet-stream",
    );

    return NextResponse.json({
      name: file.name,
      text: text.slice(0, 50_000),
      truncated: text.length > 50_000,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Extraction failed";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
