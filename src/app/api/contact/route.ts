import { Resend } from "resend";
import { NextResponse } from "next/server";

const TO_EMAIL = "intheboxstudio.smm@gmail.com";
const MAX_MESSAGE_LENGTH = 3000;
const MAX_FIELD_LENGTH = 200;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido." }, { status: 400 });
  }

  const { nome, email, telefono, messaggio } = (body ?? {}) as Record<string, unknown>;

  if (
    !isNonEmptyString(nome, MAX_FIELD_LENGTH) ||
    !isNonEmptyString(email, MAX_FIELD_LENGTH) ||
    !isNonEmptyString(messaggio, MAX_MESSAGE_LENGTH)
  ) {
    return NextResponse.json({ error: "Compila tutti i campi obbligatori." }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Indirizzo email non valido." }, { status: 400 });
  }

  if (telefono !== undefined && telefono !== "" && !isNonEmptyString(telefono, 50)) {
    return NextResponse.json({ error: "Numero di telefono non valido." }, { status: 400 });
  }

  const text = [
    `Nome: ${nome}`,
    `Email: ${email}`,
    telefono ? `Telefono: ${telefono}` : null,
    "",
    messaggio,
  ]
    .filter(Boolean)
    .join("\n");

  if (!process.env.RESEND_API_KEY) {
    console.error("Contact form: RESEND_API_KEY non configurata");
    return NextResponse.json({ error: "Il servizio non è configurato correttamente." }, { status: 500 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Modulo contatti IN THE BOX STUDIO <onboarding@resend.dev>",
      to: TO_EMAIL,
      replyTo: email,
      subject: `Richiesta dal sito da parte di ${nome}`,
      text,
    });

    if (error) {
      console.error("Contact form email error", error);
      return NextResponse.json({ error: "Invio non riuscito, riprova più tardi." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form unexpected error", error);
    return NextResponse.json({ error: "Si è verificato un errore imprevisto." }, { status: 500 });
  }
}
