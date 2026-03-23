import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { readFile } from 'fs/promises';
import { z } from 'zod';

const triageSchema = z.object({
  classification: z.string(),
  severity: z.enum(['low', 'medium', 'high']),
  summary: z.string(),
  recommendedActions: z.array(z.string()),
  shouldSuggestPsp: z.boolean(),
  detectedSignals: z.array(z.string()),
});

const chatSchema = z.object({
  reply: z.string(),
  intent: z.enum([
    'general_guidance',
    'risk_assessment',
    'evidence_preservation',
    'psp_referral',
    'emotional_support',
    'unclear',
  ]),
  shouldSuggestPsp: z.boolean(),
  suggestedActions: z.array(z.string()),
});

export type TriageResult = z.infer<typeof triageSchema>;
export type ChatResult = z.infer<typeof chatSchema>;

@Injectable()
export class GeminiService {
  private readonly client: GoogleGenAI;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException(
        'GEMINI_API_KEY is not configured',
      );
    }

    this.client = new GoogleGenAI({ apiKey });
    this.model =
      this.configService.get<string>('GEMINI_MODEL') ?? 'gemini-2.5-flash';
  }

  async generateWebsiteChatReply(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
) {
  const conversation = messages
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join('\n');

  const prompt = `
Tu és um assistente virtual do site PSP de apoio ao ciberbullying.

A tua função é:
- responder dúvidas sobre o funcionamento do site;
- explicar as funcionalidades disponíveis;
- indicar onde o utilizador deve ir dentro da plataforma;
- responder apenas com base na informação fornecida na conversa.

Regras:
- Não inventes funcionalidades.
- Se a resposta não estiver disponível no contexto, diz isso claramente.
- Fala em português europeu.
- Responde de forma curta, clara e útil.

Devolve APENAS JSON válido:
{
  "reply": "string",
  "suggestedActions": ["string", "string"]
}

Conversa:
${conversation}
`;

  const response = await this.client.models.generateContent({
    model: this.model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const rawText = response.text;

  if (!rawText) {
    throw new Error('Empty response from Gemini');
  }

  const parsed = JSON.parse(rawText);

  return {
    reply: parsed.reply,
    suggestedActions: parsed.suggestedActions ?? [],
  };
}
  async analyzeCyberbullyingText(text: string): Promise<TriageResult> {
    const prompt = `
Tu és um assistente de triagem para uma plataforma de apoio ao ciberbullying.

Analisa o texto do utilizador e devolve APENAS um JSON válido.
Não escrevas markdown.
Não uses blocos de código.
Não adiciones texto antes nem depois do JSON.

Campos obrigatórios:
{
  "classification": "possible_cyberbullying | harassment | threat | image_exposure | impersonation | unclear | other",
  "severity": "low | medium | high",
  "summary": "string curta e clara em português europeu",
  "recommendedActions": ["string", "string", "string"],
  "shouldSuggestPsp": true,
  "detectedSignals": ["string", "string"]
}

Texto:
"""${text}"""
`;

    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const rawText = response.text;

      if (!rawText) {
        throw new Error('Empty response from Gemini');
      }

      const parsed = JSON.parse(rawText);
      return triageSchema.parse(parsed);
    } catch (error) {
      throw new InternalServerErrorException(
        `Gemini text triage failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    }
  }

  async analyzeCyberbullyingImage(
    filePath: string,
    mimeType: string,
  ): Promise<TriageResult> {
    const imageBuffer = await readFile(filePath);

    const prompt = `
Tu és um assistente de triagem para uma plataforma de apoio ao ciberbullying.

Analisa a imagem enviada, assumindo que pode ser um print de conversa, rede social, comentário ou publicação.
Devolve APENAS um JSON válido.
Não escrevas markdown.
Não uses blocos de código.
Não adiciones texto antes nem depois do JSON.

Campos obrigatórios:
{
  "classification": "possible_cyberbullying | harassment | threat | image_exposure | impersonation | unclear | other",
  "severity": "low | medium | high",
  "summary": "string curta e clara em português europeu",
  "recommendedActions": ["string", "string", "string"],
  "shouldSuggestPsp": true,
  "detectedSignals": ["string", "string"]
}
`;

    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: [
          { text: prompt },
          {
            inlineData: {
              mimeType,
              data: imageBuffer.toString('base64'),
            },
          },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });

      const rawText = response.text;

      if (!rawText) {
        throw new Error('Empty response from Gemini');
      }

      const parsed = JSON.parse(rawText);
      return triageSchema.parse(parsed);
    } catch (error) {
      throw new InternalServerErrorException(
        `Gemini image triage failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    }
  }

  async generateChatReply(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  ): Promise<ChatResult> {
    const conversation = messages
      .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
      .join('\n');

    const prompt = `
Tu és um assistente de triagem e apoio para uma plataforma de combate ao ciberbullying.

Objetivo:
- responder com calma, clareza e segurança;
- ajudar o utilizador a perceber a situação;
- sugerir próximos passos úteis;
- nunca fingir ser polícia, psicólogo ou advogado;
- nunca dar garantias legais;
- nunca incentivar confronto ou vingança;
- se houver ameaça séria, perseguição, chantagem, exposição íntima ou usurpação grave, sugerir contacto com PSP.

Responde APENAS em JSON válido.
Não escrevas markdown.
Não uses blocos de código.
Não acrescentes texto fora do JSON.

Formato:
{
  "reply": "resposta em português europeu, humana, curta e útil",
  "intent": "general_guidance | risk_assessment | evidence_preservation | psp_referral | emotional_support | unclear",
  "shouldSuggestPsp": true,
  "suggestedActions": ["string", "string", "string"]
}

Regras:
- reply deve ter no máximo 120 palavras.
- reply deve ser clara e prática.
- suggestedActions deve ter entre 2 e 4 ações.
- Se faltar contexto, pede mais detalhe com cuidado.
- Se o utilizador parecer estar em risco sério, indica contacto com autoridade.

Conversa:
${conversation}
`;

    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const rawText = response.text;

      if (!rawText) {
        throw new Error('Empty response from Gemini');
      }

      const parsed = JSON.parse(rawText);
      return chatSchema.parse(parsed);
    } catch (error) {
      throw new InternalServerErrorException(
        `Gemini chat failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    }
  }
}