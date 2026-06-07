import { NextResponse } from "next/server";
import { ALLOW_CASE_FILE_UPLOAD } from "@/lib/config";
import { extractDocumentText } from "@/lib/documents/extract";
import { scanForPhi } from "@/lib/phi-guard";

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  if (!ALLOW_CASE_FILE_UPLOAD) {
    return NextResponse.json(
      {
        error:
          "File uploads are disabled in educational mode (real reports often contain private information). Type fictional findings manually.",
      },
      { status: 403 },
    );
  }

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

    const phiHits = scanForPhi(text);
    if (phiHits.length > 0) {
      return NextResponse.json(
        {
          error: `File appears to contain identifying information (${phiHits.join(", ")}). Use fictional cases only.`,
        },
        { status: 400 },
      );
    }

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
