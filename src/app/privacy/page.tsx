import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | IN THE BOX STUDIO",
  description: "Informativa sulla privacy e sul trattamento dei dati personali.",
};

export default function PrivacyPage() {
  return (
    <main className="px-6 pb-32 pt-40">
      <div className="glass mx-auto max-w-3xl rounded-3xl px-6 py-12 text-left sm:px-12">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted">Ultimo aggiornamento: luglio 2026</p>

        <div className="mt-10 space-y-8 text-muted [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_li]:mb-1 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5">
          <section>
            <h2>1. Titolare del trattamento</h2>
            <p>
              Il Titolare del trattamento dei dati raccolti tramite questo
              sito è IN THE BOX STUDIO (Marco Losso), contattabile
              all&apos;indirizzo email{" "}
              <a
                href="mailto:intheboxstudio.smm@gmail.com"
                className="text-accent hover:underline"
              >
                intheboxstudio.smm@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2>2. Dati raccolti</h2>
            <p>
              Attraverso il modulo di contatto presente sul sito possono
              essere raccolti i seguenti dati personali, forniti
              volontariamente dall&apos;utente:
            </p>
            <ul>
              <li>Nome e cognome</li>
              <li>Indirizzo email</li>
              <li>Numero di telefono (facoltativo)</li>
              <li>Contenuto del messaggio inviato</li>
            </ul>
            <p>
              Il modulo di contatto non salva i dati su un server: alla
              compilazione viene aperto il client di posta elettronico
              dell&apos;utente con un messaggio precompilato, che viene
              inviato direttamente all&apos;indirizzo email del Titolare. Il
              sito non utilizza attualmente cookie di profilazione né
              strumenti di tracciamento di terze parti.
            </p>
          </section>

          <section>
            <h2>3. Finalità del trattamento</h2>
            <p>
              I dati raccolti vengono utilizzati esclusivamente per
              rispondere alle richieste di informazioni o di contatto
              inviate dall&apos;utente, e per la gestione di eventuali
              rapporti precontrattuali o contrattuali con lo stesso.
            </p>
          </section>

          <section>
            <h2>4. Base giuridica</h2>
            <p>
              Il trattamento si basa sul consenso liberamente espresso
              dall&apos;utente nel momento in cui invia il modulo di
              contatto (art. 6, par. 1, lett. a, Regolamento UE 2016/679 -
              GDPR), oppure sull&apos;esecuzione di misure precontrattuali
              richieste dall&apos;interessato (art. 6, par. 1, lett. b).
            </p>
          </section>

          <section>
            <h2>5. Modalità e conservazione</h2>
            <p>
              I dati sono trattati con strumenti informatici e conservati
              per il tempo strettamente necessario a evadere la richiesta
              e, successivamente, per il tempo previsto da eventuali
              obblighi di legge o per la gestione del rapporto instaurato,
              dopodiché vengono cancellati o resi anonimi.
            </p>
          </section>

          <section>
            <h2>6. Comunicazione dei dati</h2>
            <p>
              I dati personali raccolti non vengono ceduti, venduti o
              comunicati a terzi per finalità commerciali. Potranno essere
              condivisi con soggetti terzi solo se strettamente necessario
              all&apos;erogazione del servizio richiesto (ad esempio
              fornitori di servizi email) e nel rispetto della normativa
              vigente.
            </p>
          </section>

          <section>
            <h2>7. Diritti dell&apos;interessato</h2>
            <p>
              In qualità di interessato, hai il diritto di richiedere in
              qualsiasi momento, ai sensi degli articoli 15-22 del GDPR:
            </p>
            <ul>
              <li>l&apos;accesso ai tuoi dati personali;</li>
              <li>la rettifica o la cancellazione degli stessi;</li>
              <li>la limitazione del trattamento;</li>
              <li>l&apos;opposizione al trattamento;</li>
              <li>la portabilità dei dati.</li>
            </ul>
            <p>
              Per esercitare questi diritti è possibile scrivere in
              qualsiasi momento a{" "}
              <a
                href="mailto:intheboxstudio.smm@gmail.com"
                className="text-accent hover:underline"
              >
                intheboxstudio.smm@gmail.com
              </a>
              . Hai inoltre diritto di proporre reclamo a un&apos;autorità
              di controllo (in Italia, il Garante per la protezione dei
              dati personali).
            </p>
          </section>

          <section>
            <h2>8. Cookie</h2>
            <p>
              Il sito non installa cookie di profilazione. Potrebbero
              essere utilizzati esclusivamente cookie tecnici, necessari al
              corretto funzionamento del sito, che non richiedono consenso
              preventivo ai sensi della normativa vigente.
            </p>
          </section>

          <section>
            <h2>9. Modifiche a questa informativa</h2>
            <p>
              Questa informativa può essere aggiornata nel tempo. Eventuali
              modifiche saranno pubblicate su questa pagina con
              l&apos;indicazione della data di ultimo aggiornamento.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
