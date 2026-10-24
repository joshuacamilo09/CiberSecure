import { Injectable } from '@nestjs/common';
import { GeminiService } from '../../integrations/gemini/gemini.service';
import { SendChatbotMessageDto } from './dto/send-chatbot-message.dto';

const SITE_CONTEXT = `
INFORMAÇÃO OFICIAL DO SITE:

- Este site da PSP é focado em apoio relacionado com ciberbullying.
- O utilizador pode analisar situações com texto ou imagens (prints).
- Existe um assistente inteligente para apoio emocional.
- O utilizador autenticado pode ver histórico de análises e conversas.
- Login é obrigatório para usar funcionalidades de IA.

SECÇÕES DISPONÍVEIS:
- /aprender → conteúdos educativos
- /analisar → análise de situações
- /assistente → chat de apoio
- /perfil → histórico e dados do utilizador
- /apoio → orientação e ajuda
- /contactos → contactos oficiais

CONTACTOS:
- Emergência: 112
- PSP: +351 217 654 242
- Email: cmlisboa@psp.pt

ENCAMINHAMENTO INTELIGENTE:
- Se o utilizador descrever uma situação → sugerir análise
- Se precisar de apoio → sugerir assistente
- Se for urgente → sugerir contactos
- Se for dúvida geral → responder diretamente

REGRAS:
- Responde apenas com base nesta informação
- Não inventes funcionalidades
- Sê breve, claro e útil
- Fala em português europeu
`;

@Injectable()
export class ChatbotService {
  constructor(private readonly geminiService: GeminiService) {}

  async sendMessage(dto: SendChatbotMessageDto) {
    const history = dto.history ?? [];

    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      {
        role: 'user',
        content: `[SISTEMA]\n${SITE_CONTEXT}`,
      },
      ...history,
      {
        role: 'user',
        content: dto.message,
      },
    ];

    const result = await this.geminiService.generateWebsiteChatReply(messages);

    return {
      reply: result.reply,
      actions: result.suggestedActions ?? [],
    };
  }
}