import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { SERVICES } from "@/data/services";
import { FAQ_ITEMS } from "@/data/faq";

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1500;

const client = new Anthropic();

type ChatMessage = { role: "user" | "assistant"; content: string };

function buildSystemPrompt(): string {
  const servicesList = SERVICES.map((s) => `- ${s.title}: ${s.cardDescription}`).join("\n");
  const faqList = FAQ_ITEMS.map((f) => `D: ${f.question}\nR: ${f.answer}`).join("\n\n");

  return `Sei l'assistente virtuale del sito di IN THE BOX STUDIO, lo studio di Marco Losso, un perito informatico specializzato in agenti AI e automazione aziendale. Non sei Marco in prima persona: sei il suo assistente AI e, se te lo chiedono esplicitamente, lo dichiari con naturalezza.

TONO: amichevole e diretto, come se parlassi a un cliente al telefono. Frasi semplici, senza tecnicismi inutili. Puoi usare qualche emoji ogni tanto, con moderazione, mai più di una per messaggio. Rispondi sempre in italiano, anche se il visitatore scrive in un'altra lingua. Tieni le risposte brevi (poche frasi), adatte a una chat, non a un articolo.

FORMATTAZIONE: scrivi solo testo semplice, come in una normale chat. Non usare markdown: niente asterischi per il grassetto/corsivo, niente elenchi puntati con trattini o numeri, niente titoli con #. Se devi elencare più cose, scrivile in una frase discorsiva separate da virgole o punti.

SERVIZI OFFERTI:
${servicesList}

DOMANDE FREQUENTI (usale come riferimento per il livello di dettaglio e le informazioni corrette):
${faqList}

REGOLE IMPORTANTI:
- Non inventare mai prezzi precisi o tempi di consegna esatti: per queste domande spiega che dipende dal progetto e invita a una chiamata conoscitiva gratuita tramite il modulo contatti.
- Se non sai rispondere a qualcosa o la domanda richiede una valutazione specifica del progetto, invita a scrivere tramite il modulo contatti (pagina /contatti) o via email a intheboxstudio.smm@gmail.com.
- Parla solo di argomenti legati ai servizi di IN THE BOX STUDIO (agenti AI, automazione, blog automatici, chatbot, siti internet, social media e copywriting). Se ti chiedono altro, riporta gentilmente la conversazione su questi temi.
- Non dare consigli legali, medici o finanziari.`;
}

function isValidMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const m = value as Record<string, unknown>;
  return (
    (m.role === "user" || m.role === "assistant") &&
    typeof m.content === "string" &&
    m.content.length > 0 &&
    m.content.length <= MAX_MESSAGE_LENGTH
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido." }, { status: 400 });
  }

  const rawMessages = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return NextResponse.json({ error: "Nessun messaggio ricevuto." }, { status: 400 });
  }

  const recent = rawMessages.slice(-MAX_MESSAGES);
  if (!recent.every(isValidMessage)) {
    return NextResponse.json({ error: "Messaggio non valido." }, { status: 400 });
  }

  const messages: ChatMessage[] = recent;
  if (messages[0].role !== "user") {
    return NextResponse.json(
      { error: "La conversazione deve iniziare con un messaggio dell'utente." },
      { status: 400 },
    );
  }

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 600,
      system: buildSystemPrompt(),
      messages,
    });

    const textBlock = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === "text",
    );

    return NextResponse.json({ reply: textBlock?.text ?? "" });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Troppe richieste in questo momento, riprova tra poco." },
        { status: 429 },
      );
    }
    if (error instanceof Anthropic.AuthenticationError) {
      console.error("Chat API: chiave ANTHROPIC_API_KEY mancante o non valida", error);
      return NextResponse.json(
        { error: "Il servizio non è configurato correttamente." },
        { status: 500 },
      );
    }
    if (error instanceof Anthropic.APIError) {
      console.error("Chat API error", error);
      return NextResponse.json(
        { error: "Si è verificato un errore, riprova tra poco." },
        { status: 502 },
      );
    }
    console.error("Chat API unexpected error", error);
    return NextResponse.json({ error: "Si è verificato un errore imprevisto." }, { status: 500 });
  }
}
