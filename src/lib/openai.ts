const EMBEDDING_MODEL = "text-embedding-3-small";

export function requireApiKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error(
      "OPENAI_API_KEY is not configured. Add it in your hosting provider environment variables.",
    );
  }
  return key;
}

export async function createEmbedding(text: string): Promise<number[]> {
  const apiKey = requireApiKey();
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text.slice(0, 8000),
    }),
  });

  if (!response.ok) {
    throw new Error(`Embedding API error (${response.status})`);
  }

  const data = (await response.json()) as {
    data?: { embedding: number[] }[];
  };
  const embedding = data.data?.[0]?.embedding;
  if (!embedding) {
    throw new Error("Empty embedding response");
  }
  return embedding;
}

export async function extractTextFromImage(
  base64: string,
  mimeType: string,
): Promise<string> {
  const apiKey = requireApiKey();
  const model = process.env.CLINICAL_VISION_MODEL ?? "gpt-4.1-mini";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all clinically relevant text from this medical document image (labs, vitals, diagnoses, medications). Output plain text only. If illegible, say which sections are unclear.",
            },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64}` },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Vision API error (${response.status})`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}
