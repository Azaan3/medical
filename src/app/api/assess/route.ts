import { NextResponse } from "next/server";
import { z } from "zod";
import { fallbackAssessment, parseAssessment } from "@/lib/assessment";
import {
  buildUserPrompt,
  RESPONSE_SCHEMA,
  SYSTEM_PROMPT,
} from "@/lib/prompts";
import { APP_MODE } from "@/lib/config";
import { CONSENT_BLOCK_MESSAGE, validateConsent } from "@/lib/consent";
import { PHI_BLOCK_MESSAGE, scanClinicalCaseForPhi } from "@/lib/phi-guard";
import { retrieveGuidelineContext } from "@/lib/rag/retrieve";
import type { ChatMessage, ClinicalCase } from "@/lib/types";

const requestSchema = z.object({
  clinicalCase: z.object({
    id: z.string(),
    createdAt: z.string(),
    demographics: z.record(z.unknown()),
    chiefComplaint: z.string(),
    symptoms: z.array(z.string()),
    history: z.string(),
    medications: z.array(z.string()),
    allergies: z.array(z.string()),
    vitals: z.record(z.unknown()),
    labs: z.array(
      z.object({
        name: z.string(),
        value: z.string(),
        unit: z.string().optional(),
        flag: z.enum(["low", "high", "critical", "normal"]).optional(),
      }),
    ),
    narrative: z.string(),
    uploadedFileNames: z.array(z.string()),
    documentTexts: z
      .array(z.object({ name: z.string(), text: z.string() }))
      .optional()
      .default([]),
  }),
  messages: z.array(
    z.object({
      id: z.string(),
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
      timestamp: z.string(),
    }),
  ),
  newInput: z.string().min(1),
  consent: z.record(z.unknown()).optional(),
});

async function callOpenAI(
  clinicalCase: ClinicalCase,
  messages: ChatMessage[],
  newInput: string,
  guidelineContext: string,
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured. Add it in your hosting provider (e.g. Vercel environment variables).",
    );
  }

  const model = process.env.CLINICAL_MODEL ?? "gpt-4.1";
  const history = messages
    .slice(-12)
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: buildUserPrompt(
            clinicalCase,
            history,
            newInput,
            guidelineContext,
          ),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI provider error (${response.status}): ${errText}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from AI provider");
  }
  return content;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { clinicalCase, messages, newInput, consent } = parsed.data;

    if (!validateConsent(consent)) {
      return NextResponse.json(
        {
          error: CONSENT_BLOCK_MESSAGE,
          assessment: fallbackAssessment(CONSENT_BLOCK_MESSAGE),
        },
        { status: 403 },
      );
    }

    const caseWithDocs = {
      ...clinicalCase,
      documentTexts: clinicalCase.documentTexts ?? [],
    } as ClinicalCase;

    if (APP_MODE === "training") {
      const phiHits = scanClinicalCaseForPhi({
        chiefComplaint: caseWithDocs.chiefComplaint,
        symptoms: caseWithDocs.symptoms,
        history: caseWithDocs.history,
        narrative: caseWithDocs.narrative,
        documentTexts: caseWithDocs.documentTexts,
        newInput,
      });
      if (phiHits.length > 0) {
        return NextResponse.json(
          {
            error: PHI_BLOCK_MESSAGE,
            phiDetected: phiHits,
            assessment: fallbackAssessment(PHI_BLOCK_MESSAGE),
          },
          { status: 400 },
        );
      }
    }

    const { chunks, contextBlock } = await retrieveGuidelineContext(
      caseWithDocs,
      newInput,
    );

    const raw = await callOpenAI(
      caseWithDocs,
      messages as ChatMessage[],
      newInput,
      contextBlock,
    );
    const assessment = parseAssessment(raw);

    return NextResponse.json({
      assessment,
      schema: RESPONSE_SCHEMA,
      sourcesUsed: chunks.map((c) => c.source),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown assessment error";
    return NextResponse.json(
      { assessment: fallbackAssessment(message), error: message },
      { status: 200 },
    );
  }
}
