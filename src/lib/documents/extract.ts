import { extractTextFromImage } from "../openai";

export async function extractDocumentText(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
): Promise<string> {
  const lower = fileName.toLowerCase();

  if (
    mimeType.startsWith("text/") ||
    lower.endsWith(".txt") ||
    lower.endsWith(".md") ||
    lower.endsWith(".csv")
  ) {
    return buffer.toString("utf-8").trim();
  }

  if (mimeType === "application/pdf" || lower.endsWith(".pdf")) {
    const pdfParse = (await import("pdf-parse")).default;
    const result = await pdfParse(buffer);
    return (result.text ?? "").trim();
  }

  if (mimeType.startsWith("image/")) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "Image extraction requires OPENAI_API_KEY for vision OCR.",
      );
    }
    const base64 = buffer.toString("base64");
    return extractTextFromImage(base64, mimeType);
  }

  throw new Error(`Unsupported file type: ${mimeType || fileName}`);
}
