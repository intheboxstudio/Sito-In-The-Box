import {
  Bot,
  Workflow,
  Newspaper,
  MessageCircleMore,
  LayoutTemplate,
  Megaphone,
  type LucideIcon,
} from "lucide-react";

// Stage icons are referenced by key (not by component) because this data is
// shared with a Server Component page: React components can't be passed as
// props across the server/client boundary, so ServiceHeroVisual (a Client
// Component) resolves these keys to actual icons itself.
export type StageIconKey =
  | "message-square"
  | "bot"
  | "check-circle-2"
  | "zap"
  | "refresh-cw"
  | "search"
  | "newspaper"
  | "rocket"
  | "message-circle-more"
  | "layout-template"
  | "code-2"
  | "lightbulb"
  | "pen-tool"
  | "megaphone";

export type ServiceStage = {
  icon: StageIconKey;
  label: string;
};

export type ServiceExample = {
  title: string;
  description: string;
};

export type ServiceDetail = {
  slug: string;
  icon: LucideIcon;
  title: string;
  cardDescription: string;
  tagline: string;
  stages: [ServiceStage, ServiceStage, ServiceStage];
  intro: string[];
  whyOptimal: string[];
  examples: ServiceExample[];
  replaces: string[];
  closing: string;
};

export const SERVICES: ServiceDetail[] = [
  {
    slug: "agenti-ai-su-misura",
    icon: Bot,
    title: "Agenti AI su misura",
    cardDescription:
      "Agenti che sostituiscono completamente una segretaria, un ragioniere o un ufficio ticket di assistenza: gestione clienti, documenti, statistiche e analisi dati.",
    tagline:
      "Un collaboratore digitale che non dorme mai, non si stanca e lavora esattamente come vuoi tu.",
    stages: [
      { icon: "message-square", label: "Richiesta del cliente" },
      { icon: "bot", label: "L'agente AI analizza e decide" },
      { icon: "check-circle-2", label: "Azione completata in autonomia" },
    ],
    intro: [
      "Un agente AI non è un semplice chatbot che risponde a due domande e si blocca. È un programma capace di capire una richiesta, decidere in autonomia i passaggi necessari per portarla a termine e usare gli strumenti giusti per farlo: consultare un database, scrivere un documento, mandare un'email, aggiornare un foglio di calcolo, cercare informazioni online. In pratica, gli affidi un obiettivo — non un singolo comando — e lui si organizza da solo per raggiungerlo, proprio come farebbe una persona a cui deleghi un compito.",
      "La differenza rispetto a un software tradizionale è che l'agente ragiona: se la prima strada non funziona ne prova un'altra, se manca un'informazione la va a cercare, e se un compito richiede più passaggi li collega da solo, senza bisogno che tu li programmi uno per uno.",
    ],
    whyOptimal: [
      "Per un'azienda questo si traduce in un collaboratore che costa una frazione di uno stipendio, lavora 24 ore su 24 senza pause, ferie o malattie, non commette errori per stanchezza e si può moltiplicare all'infinito: se il lavoro raddoppia, l'agente gestisce il doppio dei casi senza bisogno di assumere e formare qualcun altro.",
      "Non sostituisce la sensibilità umana nelle decisioni delicate, ma si occupa perfettamente di tutto ciò che è ripetitivo, prevedibile o basato su regole chiare, liberando le persone in azienda per il lavoro che richiede davvero giudizio, relazione ed esperienza.",
    ],
    examples: [
      {
        title: "Segreteria virtuale",
        description:
          "Gestisce prenotazioni, appuntamenti e richieste via email o WhatsApp, aggiorna il calendario e manda i promemoria, senza che nessuno debba rispondere manualmente.",
      },
      {
        title: "Ufficio assistenza clienti",
        description:
          "Legge i ticket in arrivo, capisce di cosa si tratta, risponde subito alle richieste semplici e passa al team umano solo i casi che richiedono davvero una persona.",
      },
      {
        title: "Contabilità di primo livello",
        description:
          "Legge fatture e scontrini, li classifica, li inserisce nel gestionale e segnala eventuali anomalie, riducendo drasticamente il lavoro di data entry.",
      },
      {
        title: "Monitoraggio magazzino",
        description:
          "Controlla le scorte in tempo reale, prevede quando un prodotto sta per esaurirsi e prepara automaticamente l'ordine di riacquisto al fornitore.",
      },
      {
        title: "Ricerche di mercato",
        description:
          "Analizza prezzi della concorrenza, recensioni dei clienti e tendenze del settore, e restituisce un report chiaro senza settimane di lavoro manuale.",
      },
    ],
    replaces: [
      "Centralinista e segreteria per la gestione di chiamate e appuntamenti",
      "Primo livello di assistenza clienti (email, chat, ticket)",
      "Data entry e inserimento manuale di documenti e fatture",
      "Ricerche e report ripetitivi che oggi richiedono ore di lavoro",
    ],
    closing:
      "Non stai comprando un software: stai aggiungendo una persona in più al tuo team, che lavora sempre, non si lamenta mai e costa una frazione di uno stipendio. Raccontami come lavora oggi la tua azienda: ti dico esattamente dove un agente AI può iniziare a darti una mano.",
  },
  {
    slug: "automazione-aziendale",
    icon: Workflow,
    title: "Automazione aziendale",
    cardDescription:
      "Elimino attività ripetitive collegando i tuoi sistemi con flussi automatizzati: meno lavoro manuale, meno errori, più tempo.",
    tagline:
      "I programmi che già usi ogni giorno, finalmente collegati tra loro: le informazioni si muovono da sole.",
    stages: [
      { icon: "zap", label: "Succede qualcosa (es. nuovo ordine)" },
      { icon: "refresh-cw", label: "Il flusso collega i tuoi sistemi" },
      { icon: "check-circle-2", label: "Risultato pronto, zero lavoro manuale" },
    ],
    intro: [
      "Ogni azienda usa già diversi strumenti: una casella email, un CRM per i clienti, un foglio Excel, un gestionale, magari WhatsApp Business. Il problema è che questi strumenti quasi mai si parlano tra loro: qualcuno deve copiare a mano i dati da uno all'altro, ricordarsi di aggiornare ogni sistema, inviare le stesse informazioni più volte in posti diversi.",
      "L'automazione aziendale collega questi strumenti con dei flussi automatici: quando succede qualcosa in un punto (arriva un nuovo cliente, viene ricevuto un ordine, si riceve una fattura), il sistema fa partire da solo tutti i passaggi successivi, senza che nessuno debba intervenire manualmente.",
    ],
    whyOptimal: [
      "Il vantaggio non è solo il tempo risparmiato, ma anche la qualità del lavoro: un'automazione non dimentica un passaggio, non si stanca alle 18 di venerdì e non commette l'errore di copiare un numero sbagliato da una tabella. Ogni processo diventa affidabile e ripetibile, indipendentemente da chi è in ufficio quel giorno.",
      "È anche una soluzione che cresce con l'azienda: un flusso automatico gestisce allo stesso modo 10 o 1000 richieste al giorno, mentre il lavoro manuale richiederebbe di assumere altre persone man mano che il volume aumenta.",
    ],
    examples: [
      {
        title: "Dal sito al CRM in automatico",
        description:
          "Un nuovo contatto compila il form sul sito: viene creato subito nel CRM, riceve un'email di benvenuto e il team viene avvisato su Telegram, tutto senza intervento manuale.",
      },
      {
        title: "Fatture che si archiviano da sole",
        description:
          "Ogni fattura ricevuta via email viene salvata automaticamente nella cartella giusta, rinominata correttamente e registrata nel gestionale contabile.",
      },
      {
        title: "Magazzino ed e-commerce sincronizzati",
        description:
          "Quando arriva un ordine online, lo stock si aggiorna da solo su tutti i canali di vendita e il corriere riceve automaticamente i dati per la spedizione.",
      },
      {
        title: "Promemoria e follow-up automatici",
        description:
          "Se un preventivo non riceve risposta entro qualche giorno, il sistema invia da solo un messaggio di follow-up, senza che il commerciale debba ricordarselo.",
      },
    ],
    replaces: [
      "Copia-incolla manuale di dati tra fogli di calcolo, email e gestionali",
      "Promemoria e follow-up che oggi dipendono dalla memoria di qualcuno",
      "Archiviazione manuale di documenti e fatture",
      "Aggiornamenti manuali di magazzino, ordini e spedizioni",
    ],
    closing:
      "Non serve cambiare tutti i software che usi già: nella maggior parte dei casi basta collegarli. Dimmi quali passaggi ripeti ogni giorno in azienda: insieme troviamo quelli che possiamo automatizzare per primi.",
  },
  {
    slug: "blog-automatici",
    icon: Newspaper,
    title: "Blog automatici",
    cardDescription:
      "Un agente IA analizza il web, individua i problemi reali delle persone su un argomento, studia le fonti autorevoli, scrive l'articolo con un'immagine dedicata e consiglia il prodotto o servizio giusto.",
    tagline:
      "Contenuti pubblicati con costanza, ogni settimana, senza che tu debba scrivere una sola riga.",
    stages: [
      { icon: "search", label: "Ricerca di cosa cercano davvero le persone" },
      { icon: "newspaper", label: "Scrittura e pubblicazione dell'articolo" },
      { icon: "rocket", label: "Traffico e vendite in crescita" },
    ],
    intro: [
      "Un blog automatico è un agente AI che si occupa dell'intero lavoro editoriale al posto tuo: individua gli argomenti che le persone cercano davvero online, studia le fonti più autorevoli sul tema, scrive un articolo completo — con tanto di immagine dedicata — e lo pubblica sul tuo sito, con una costanza che sarebbe difficile mantenere manualmente.",
      "Non si tratta di testi generici o ripetitivi: l'agente parte sempre dai problemi reali delle persone, cioè le domande che effettivamente digitano su Google, e costruisce contenuti pensati per rispondere a quelle domande, spesso chiudendo l'articolo con il consiglio di un prodotto o servizio pertinente.",
    ],
    whyOptimal: [
      "Per un'azienda, avere un blog aggiornato è uno dei modi più efficaci per farsi trovare online e costruire fiducia, ma richiede tempo, ricerca e competenze di scrittura che raramente si hanno internamente, e assumere un copywriter dedicato ha un costo fisso importante.",
      "Con un agente che scrive in autonomia, i contenuti escono con costanza (per esempio 2-3 articoli a settimana), il costo è una frazione di quello di una persona dedicata, e il lavoro editoriale smette di essere un pensiero in più nella gestione quotidiana dell'azienda.",
    ],
    examples: [
      {
        title: "Analisi di cosa cercano davvero i clienti",
        description:
          'L\'agente studia le domande reali delle persone su un argomento (es. "dolori articolari", scelta di un prodotto) prima di scrivere qualsiasi riga.',
      },
      {
        title: "Articolo completo e pronto alla pubblicazione",
        description:
          "Titolo, testo, struttura e immagine dedicata generati e pubblicati in autonomia, con un tono professionale e naturale.",
      },
      {
        title: "Contenuto che vende",
        description:
          "Ogni articolo può chiudersi con il consiglio di un prodotto o servizio della tua azienda, trasformando il blog in un canale di vendita silenzioso.",
      },
      {
        title: "Caso reale: Parafarmacia Emy",
        description:
          "Un agente scrive in autonomia 3 articoli a settimana su omeopatia e naturopatia, partendo dai problemi reali cercati online, e consiglia i prodotti in vendita in farmacia.",
      },
    ],
    replaces: [
      "Copywriter o content manager per la produzione ordinaria di articoli SEO",
      "Ricerca manuale delle parole chiave e degli argomenti da trattare",
      "Il tempo dedicato a scrivere, impaginare e pubblicare ogni articolo",
    ],
    closing:
      "Un blog fermo da mesi non porta clienti. Raccontami di cosa si occupa la tua azienda: valutiamo insieme se un agente che scrive per te può diventare il tuo canale di contenuti costante.",
  },
  {
    slug: "chatbot-cloni-aziendali",
    icon: MessageCircleMore,
    title: "Chatbot e cloni aziendali",
    cardDescription:
      "Assistenti virtuali addestrati sulla tua azienda che rispondono a qualsiasi domanda dei clienti, 24 ore su 24, sui tuoi canali.",
    tagline:
      "Un assistente che conosce la tua azienda a memoria e risponde ai clienti come faresti tu.",
    stages: [
      { icon: "message-circle-more", label: "Il cliente scrive in qualsiasi momento" },
      { icon: "bot", label: "Il clone risponde come faresti tu" },
      { icon: "check-circle-2", label: "Cliente soddisfatto, zero attesa" },
    ],
    intro: [
      'Un chatbot aziendale, o "clone", è un assistente virtuale addestrato sui contenuti specifici della tua attività: catalogo prodotti, listino prezzi, orari, procedure interne, domande frequenti, tono di voce del brand. Non è un chatbot generico che risponde a frasi preimpostate: capisce il linguaggio naturale delle persone e risponde tenendo conto delle informazioni reali della tua azienda.',
      "Può vivere sul sito, su WhatsApp, su Instagram o Telegram, e conversare con i clienti in ogni momento della giornata, con la stessa competenza (e nei limiti che decidi tu) di una persona del tuo team.",
    ],
    whyOptimal: [
      "I clienti oggi si aspettano una risposta immediata, non importa l'orario. Un assistente virtuale elimina l'attesa, risponde nello stesso modo a chiunque scriva, senza differenze dovute a stanchezza o distrazione, e si occupa da solo di tutte le domande ripetitive, lasciando al tuo team solo i casi che richiedono davvero attenzione umana.",
      "È anche uno strumento che scala senza costi aggiuntivi: che arrivino 10 o 1000 messaggi al giorno, il livello di servizio resta identico.",
    ],
    examples: [
      {
        title: "Assistente sul sito",
        description:
          "Risponde a domande su prodotti, prezzi, disponibilità, orari e spedizioni, 24 ore su 24, direttamente sul tuo sito.",
      },
      {
        title: "Filtro intelligente per i ticket",
        description:
          "Gestisce da solo le richieste semplici e passa al team umano solo i casi complessi, corredati già delle informazioni utili.",
      },
      {
        title: "Clone su WhatsApp o Instagram",
        description:
          "Risponde ai messaggi dei clienti sui social e su WhatsApp Business con lo stesso tono e le stesse informazioni della tua azienda.",
      },
      {
        title: "Assistente interno per i dipendenti",
        description:
          "Risponde alle domande del team su procedure, documenti e regolamenti interni, senza dover ogni volta interpellare un responsabile.",
      },
    ],
    replaces: [
      "Primo livello di assistenza clienti via chat, email o social",
      "Centralino telefonico o WhatsApp per le domande più comuni",
      "Il tempo speso a rispondere sempre alle stesse domande frequenti",
    ],
    closing:
      "Quante domande ricevi ogni giorno che sono, in fondo, sempre le stesse? Parliamone: costruiamo un assistente che le gestisce al posto tuo, con le informazioni vere della tua azienda.",
  },
  {
    slug: "siti-internet",
    icon: LayoutTemplate,
    title: "Siti internet",
    cardDescription:
      "Siti moderni e curati nel design, con animazioni su misura, spesso collegati agli agenti AI e alle automazioni per trasformare le visite in richieste reali.",
    tagline:
      "Un sito che non è solo bello da vedere, ma progettato per lavorare per te.",
    stages: [
      { icon: "layout-template", label: "Progettazione su misura" },
      { icon: "code-2", label: "Sviluppo e animazioni" },
      { icon: "rocket", label: "Sito online, pronto a convertire" },
    ],
    intro: [
      "Un sito internet è spesso il primo contatto reale tra un'azienda e un potenziale cliente: prima ancora di parlarci, le persone lo giudicano in pochi secondi. Mi occupo della progettazione e realizzazione di siti moderni, vetrina, aziendali, landing page o e-commerce, curati nel design, veloci da caricare e pensati per funzionare bene su ogni dispositivo.",
      "La parte che fa davvero la differenza, però, è quello che c'è dietro: ogni sito può essere collegato agli agenti AI e alle automazioni di cui ti ho parlato, così un form di contatto non è solo un modulo che invia un'email, ma l'inizio di un intero processo automatico.",
    ],
    whyOptimal: [
      'Un sito costruito solo per "esserci" online, senza una strategia dietro, difficilmente porta risultati concreti. Un sito progettato bene, invece, comunica professionalità fin dal primo secondo, guida il visitatore verso un\'azione precisa (contattarti, comprare, prenotare) e, se collegato alle automazioni giuste, continua a lavorare anche quando tu non sei davanti al computer.',
      "Rispetto a un template generico o a un'agenzia tradizionale, un sito su misura è pensato esattamente attorno al tuo modo di lavorare, non il contrario.",
    ],
    examples: [
      {
        title: "Sito vetrina professionale",
        description:
          "Presenta la tua azienda con un design curato e animazioni moderne, con un form di contatto collegato automaticamente al tuo CRM.",
      },
      {
        title: "Landing page per le campagne pubblicitarie",
        description:
          "Una pagina pensata per convertire i click delle tue campagne ADS in richieste reali, con un funnel automatizzato dietro.",
      },
      {
        title: "E-commerce con gestione automatizzata",
        description:
          "Un negozio online dove ordini, magazzino e spedizioni si aggiornano da soli, senza gestione manuale.",
      },
      {
        title: "Sito con chatbot integrato",
        description:
          "Un assistente virtuale che risponde ai visitatori in tempo reale, direttamente all'interno del sito.",
      },
    ],
    replaces: [
      "Agenzie web tradizionali, spesso più lente e più costose",
      "Temi e template generici che non si adattano davvero al tuo brand",
      'Un form di contatto "muto" che richiede gestione manuale di ogni richiesta',
    ],
    closing:
      "Il sito giusto non è quello più bello in assoluto, ma quello costruito attorno a come lavori davvero tu. Raccontami cosa deve fare il tuo sito, e progettiamo insieme la soluzione più adatta.",
  },
  {
    slug: "social-media-copywriting",
    icon: Megaphone,
    title: "Social media & copywriting",
    cardDescription:
      "Gestione social e copywriting con creazione di grafiche, funnel di vendita, landing page, reel e campagne ADS automatizzate.",
    tagline:
      "Presenza social costante, contenuti curati e campagne che parlano davvero al tuo pubblico.",
    stages: [
      { icon: "lightbulb", label: "Strategia e idea creativa" },
      { icon: "pen-tool", label: "Grafica e copywriting" },
      { icon: "megaphone", label: "Pubblicazione e promozione" },
    ],
    intro: [
      "Gestire i social in modo professionale significa molto più che pubblicare qualche foto ogni tanto: serve una strategia, contenuti pensati per il pubblico giusto, un copywriting che comunica davvero il valore di ciò che offri, e spesso campagne pubblicitarie mirate per raggiungere nuovi clienti.",
      "Mi occupo della gestione completa: dalla creazione di grafiche e contenuti, alla scrittura dei testi per post, caption, landing page e funnel di vendita, fino alla gestione di campagne ADS su Meta e altri canali, supportato, dove ha senso, da strumenti di intelligenza artificiale che velocizzano la produzione senza sacrificare la qualità.",
    ],
    whyOptimal: [
      "Un profilo social curato e aggiornato con costanza costruisce fiducia nel tempo, mentre uno abbandonato o gestito in modo improvvisato comunica l'esatto contrario, anche se il prodotto o servizio dietro è ottimo. Allo stesso modo, un copywriting scritto pensando davvero a chi legge converte molto di più di un testo generico.",
      "Affidare questa parte significa avere contenuti pubblicati con regolarità, una comunicazione coerente con il tuo brand, e campagne pubblicitarie impostate per generare risultati misurabili, senza dover diventare tu stesso un esperto di marketing.",
    ],
    examples: [
      {
        title: "Grafiche e contenuti pronti",
        description:
          "Post, caption e grafiche create su misura per i tuoi canali social, con un calendario editoriale costante.",
      },
      {
        title: "Copywriting che converte",
        description:
          "Testi per landing page, funnel di vendita e schede prodotto scritti per trasformare i visitatori in clienti.",
      },
      {
        title: "Campagne ADS gestite",
        description:
          "Impostazione e gestione di campagne pubblicitarie su Meta e altri canali, con creatività e testi testati.",
      },
      {
        title: "Reel e contenuti dinamici",
        description:
          "Video brevi e contenuti pensati per i formati che oggi generano più visibilità sui social.",
      },
    ],
    replaces: [
      "Un social media manager junior per la produzione ordinaria dei contenuti",
      "Il tempo speso internamente a scrivere testi pubblicitari senza formazione specifica",
      "La gestione manuale, spesso discontinua, dei canali social",
    ],
    closing:
      "Un profilo social aggiornato in modo discontinuo perde credibilità nel tempo. Raccontami su quali canali vuoi essere presente e a chi ti rivolgi: costruiamo insieme una presenza social che lavora per te.",
  },
];

export function getServiceBySlug(slug: string) {
  return SERVICES.find((service) => service.slug === slug);
}
