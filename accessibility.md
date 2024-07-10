Link di riferimento: https://www.w3.org/TR/WCAG21/

# BREVE INTRODUZIONE ABSTRACT WCAG

Web Content Accessibility Guidelines (WCAG) 2.1 copre una vasta gamma di raccomandazioni per rendere i contenuti Web
più accessibili. Seguire queste linee guida renderà i contenuti più accessibili a una gamma più ampia di persone con
disabilità, comprese le sistemazioni per cecità e ipovisione, sordità e perdita dell'udito, movimento limitato,
disabilità del linguaggio, fotosensibilità e combinazioni di queste, e alcune sistemazioni per difficoltà di
apprendimento e limitazioni cognitive; ma non affronterà ogni esigenza degli utenti per le persone con queste.
Queste linee guida riguardano l'accessibilità dei contenuti Web su desktop, laptop, tablet e dispositivi mobili.
Seguire queste linee guida spesso renderà anche i contenuti Web più utilizzabili per gli utenti in generale.

## I PRINCIPI

WCAG segue quattro principi fondamentali.
In cima ci sono quattro principi che forniscono le basi per l'accessibilità del Web: percepibile, operabile,
comprensibile e robusto.

## LINEA GUIDA

WCAG fornisce tredici linee guida agli sviluppatori per rendere i contenuti web accessibili. Le linee guida non sono
testabili ma forniscono un overview per aiutare gli autori a comprendere i criteri di successo e implementare meglio
le tecniche.

## CRITERI DI SUCCESSO

Per ogni linea guida, vengono forniti criteri di successo verificabili per consentire l'utilizzo di WCAG 2.0 laddove
i requisiti e i test di conformità sono necessari, ad esempio nelle specifiche di progettazione, negli acquisti,
nella regolamentazione e negli accordi contrattuali. Al fine di soddisfare le esigenze di diversi gruppi e diverse
situazioni, vengono definiti tre livelli di conformità: A (più basso), AA e AAA (più alto).
Ulteriori informazioni sui livelli WCAG possono essere trovate in
https://www.w3.org/WAI/WCAG21/Understanding/conformance#levels.

# PRINCIPI E LINEE GUIDA IN CONFORMITA' ALLE CLASSI

## -PRINCIPIO 1: PERCEZIONE

"Le informazioni e i componenti dell'interfaccia utente devono essere presentabili agli utenti in modi che possono
percepire."

### Guideline 1.1 Text Alternatives

Fornire alternative di testo per qualsiasi contenuto non-text in modo che possa essere cambiato in altre forme di cui
le persone hanno bisogno, come caratteri grandi, braille, discorso, simboli o un linguaggio più semplice.

#### Criteri di successo 1.1.1: Non-text Content

(NOTA: Indico con un "$" quelli che già sono stati rispettati)

(Level A)
Tutti i contenuti non testuali presentati all'utente hanno un'alternativa testuale che serve allo scopo equivalente, a eccezione delle situazioni elencate di seguito.

* **_Controlli, input_**

$ Se il contenuto non testuale è un controllo o accetta l'input dell'utente, allora ha un nome che ne descrive lo scopo. (Fare riferimento al criterio di successo 4.1.2 per ulteriori requisiti per i controlli e i contenuti che accettano l'input dell'utente.)

* **_Sensoriale_**

$ Se il contenuto non testuale è principalmente inteso per creare un'esperienza sensoriale specifica, allora le alternative di testo forniscono almeno l'identificazione descrittiva del contenuto non testuale.

(aria-expanded = true sui pulsanti che si espandono)

* **_Decorazione, Formattazione, Invisibile_**

$ Se il contenuto non testuale è pura decorazione, viene utilizzato solo per la formattazione visiva o non viene presentato agli utenti, viene implementato in modo da poter essere ignorato dalla tecnologia assistiva.

(Facciamo in modo che non venga letto tutto ma gli elementi desiderati. 
Per esempio non viene letta l'immagine di sfondo)

### Guideline 1.3 Adaptable

Crea contenuti che possono essere presentati in modi diversi (ad esempio un layout più semplice) senza perdere informazioni o struttura.

(il contenuto è flessibile e adattabile a diverse situazioni o modalità di presentazione, consentendo agli utenti di accedervi in modi diversi senza perdere la comprensione del significato)

#### Criteri di successo 1.3.1 Info and Relationships

(Level A)

$ Le informazioni, la struttura e le relazioni trasmesse attraverso la presentazione possono essere determinate a livello di programmazione o sono disponibili nel testo.

(Viene fornita una strutta precisa, aria11: utilizzo di arialandmarks, ARIA12: ruoli, G138: semantica di markup e di colori)

#### Criteri di successo 1.3.2 Meaningful Sequence

(Level A)

$ Quando la sequenza in cui viene presentato il contenuto influisce sul suo significato, una sequenza di lettura corretta può essere determinata a livello di programmazione.

(Utilizzo corretto dei tag in maniera sequenziale. G57)

#### Criteri di successo 1.3.3 Sensory Characteristics

(Level A)
$ Le istruzioni fornite per la comprensione e il funzionamento dei contenuti non si basano esclusivamente sulle caratteristiche sensoriali di componenti come forma, colore, dimensione, posizione visiva, orientamento o suono.

(Viene fornita una descrizione testuale. G96)

#### Criteri di successo 1.3.4 Orientamento

(Level AA)

$ Il contenuto non limita la visualizzazione e il funzionamento a un singolo orientamento di visualizzazione, ad esempio verticale o orizzontale, a meno che non sia essenziale un orientamento di visualizzazione specifico.

#### Criteri di successo 1.3.5 Identify Input Purpose

(Level AA)

$ Lo scopo di ogni campo di input che raccoglie informazioni sull'utente può essere determinato a livello di programmazione quando:
Il campo di input serve a uno scopo identificato nella sezione Input Purposes for User Interface Components; e
Il contenuto viene implementato utilizzando tecnologie con supporto per identificare il significato previsto per i dati di input del modulo.

(l criterio richiede che ogni campo di input sia chiaramente associato a uno scopo specifico e che vengano utilizzate tecnologie appropriate per comunicare il significato previsto dei dati. Es.  come i placeholder e non solo)

### Guideline 1.4 Distinguishable

Rendi più facile per gli utenti vedere e ascoltare i contenuti, inclusa la separazione del primo piano dallo sfondo.

#### Criteri di successo 1.4.1 Use of Color

(Level A)

$ Il colore non viene utilizzato come unico mezzo visivo per trasmettere informazioni, indicare un'azione, sollecitare una risposta o distinguere un elemento visivo.

#### Criteri di successo 1.4.3 Contrast (Minimum)

(Livello AA)

$ La presentazione visiva del testo e delle immagini del testo ha un rapporto di contrasto di almeno 4,5:1, ad eccezione di quanto segue:

(rispettato con Axe)

**Testo grande**

Il testo su larga scala e le immagini di testo su larga scala hanno un rapporto di contrasto di almeno 3:1;

**Incidentale**

Il testo o le immagini di testo che fanno parte di un componente dell'interfaccia utente inattivo, che sono pura decorazione,
che non sono visibili a nessuno o che fanno parte di un'immagine che contiene altri contenuti visivi significativi, non hanno requisiti di contrasto.

**Logotipi**

Il testo che fa parte di un logo o di un marchio non ha requisiti di contrasto.

#### Criteri di successo 1.4.4 Resize text

(Livello AA)

$ Fatta eccezione per le didascalie e le immagini di testo, il testo può essere ridimensionato senza tecnologia assistiva fino al 200 percento senza perdita di contenuto o funzionalità.

#### Criteri di successo 1.4.10 Reflow

(Livello AA)

$ Il contenuto può essere presentato senza perdita d'informazioni o funzionalità e senza richiedere lo scorrimento in due dimensioni per:

* Contenuto a scorrimento verticale a una larghezza equivalente a 320 pixel CSS;
* Contenuto a scorrimento orizzontale ad un'altezza equivalente a 256 pixel CSS.


#### Criteri di successo 1.4.11 Non-text Contrast

(Livello AA)

$ La presentazione visiva dei seguenti ha un rapporto di contrasto di almeno 3:1 rispetto ai colori adiacenti:

* **Componenti dell'interfaccia utente**

Informazioni visive necessarie per identificare i componenti e gli stati dell'interfaccia utente, ad eccezione dei componenti inattivi o in cui l'aspetto del componente
è determinato dall'agente utente e non modificato dall'autore;

* **Oggetti grafici**

Parti di grafica necessarie per comprendere il contenuto, tranne quando una particolare presentazione di grafica è essenziale per le informazioni trasmesse.

#### Criteri di successo 1.4.12 Text Spacing

(Livello AA)

$ Nei contenuti implementati utilizzando linguaggi di markup che supportano le seguenti proprietà di stile di testo, non si verifica alcuna perdita di contenuto o funzionalità impostando tutti i seguenti elementi e non modificando nessun'altra proprietà di stile:

* Altezza della linea (interlinea) almeno 1,5 volte la dimensione del carattere;
* Spaziatura dei paragrafi successivi ad almeno 2 volte la dimensione del carattere;
* Spaziatura delle lettere (traccia) ad almeno 0,12 volte la dimensione del carattere;
* Spaziatura delle parole almeno 0,16 volte la dimensione del carattere.

Eccezione: i linguaggi umani e gli script che non utilizzano una o più di queste proprietà di stile di testo nel testo scritto possono conformarsi utilizzando solo le proprietà esistenti per quella combinazione di linguaggio e script.


#### Criteri di successo 1.4.13 Content on Hover or Focus

(Livello AA)

$ Laddove la ricezione e quindi la rimozione del puntatore o la messa a fuoco della tastiera attivano contenuti aggiuntivi che diventano visibili e quindi nascosti, sono veri i seguenti:

* **Licenziabile**

È disponibile un meccanismo per respingere il contenuto aggiuntivo senza spostare il puntatore a fuoco o la messa a fuoco della tastiera, a meno che il contenuto aggiuntivo non comunichi un errore di input o non oscuri o sostituisca altri contenuti;

* **Hoverable**

Se il puntatore hover può attivare il contenuto aggiuntivo, il puntatore può essere spostato sul contenuto aggiuntivo senza che il contenuto aggiuntivo scompaia;

* **Perseverante**

Il contenuto aggiuntivo rimane visibile fino a quando il trigger hover o focus non viene rimosso, l'utente lo respinge o le sue informazioni non sono più valide.

Eccezione: la presentazione visiva del contenuto aggiuntivo è controllata dall'agente utente e non viene modificata dall'autore.


## -PRINCIPIO 2: OPERABILITA'

I componenti dell'interfaccia utente e la navigazione devono essere utilizzabili.

### Guideline 2.1 Keyboard Accessible

Rendere tutte le funzionalità disponibili da una tastiera.

#### Criteri di successo 2.1.1 Keyboard
(Level A)
$ Tutte le funzionalità del contenuto sono utilizzabili attraverso un'interfaccia tastiera senza richiedere tempi specifici per le singole sequenze di tasti, tranne quando la funzione sottostante richiede un input che dipende dal percorso del movimento dell'utente e non solo dagli endpoint.

#### Criteri di successo 2.2.5 Riautenticazione dell'autenticazione ****** (Questo dipende se modifichiamo il DBMS)

(Livello AAA)

Quando una sessione autenticata scade, l'utente può continuare l'attività senza perdita di dati dopo la riautenticazione.

### Guideline 2.4 Navigable

Fornire modi per aiutare gli utenti a navigare, trovare contenuti e determinare dove si trovano.

#### Criteri di successo  2.4.1 Bypass Blocks

(Level A)
$ È disponibile un meccanismo per bypassare i blocchi di contenuto che vengono ripetuti su più pagine Web.

(Impaginazione)

#### Criteri di successo  2.4.2 Page Titled
(Level A)

$ Le pagine Web hanno titoli che descrivono l'argomento o lo scopo.

#### Criteri di successo 2.4.3 Focus Order
(Level A)
$ Se una pagina Web può essere navigata in sequenza e le sequenze di navigazione influenzano il significato o l'operazione, i componenti focalizzabili ricevono la messa a fuoco in un ordine che preserva il significato e l'operatività.

(Es. finestra di dialogo, focus rispetto a tutto il resto)

#### Criteri di successo 2.4.4 Link Purpose (In Context)
(Level A)

$ Lo scopo di ciascun collegamento può essere determinato dal solo testo del collegamento o dal testo del collegamento insieme al suo contesto di collegamento determinato a livello di programmazione, tranne nei casi in cui lo scopo del collegamento sarebbe ambiguo per gli utenti in generale.

#### Criteri di successo 2.4.6 Headings and Labels
(Level AA)

$ I titoli e le label descrivono l'argomento o lo scopo.

#### Linea guida 2.5 – Modalità di input

Rendere più facile per gli utenti operare la funzionalità attraverso vari input oltre la tastiera.

#### Criteri di successo 2.5.3 Etichetta nel nome

(Livello A)

Per i componenti dell'interfaccia utente con etichette che includono testo o immagini di testo, il nome contiene il testo presentato visivamente.

#### Principio 3 – Comprensibile

Le informazioni e il funzionamento dell'interfaccia utente devono essere comprensibili.

#### Linea guida 3.1 – Leggibile

Rendi il contenuto del testo leggibile e comprensibile.

#### Criteri di successo 3.1.1

(Livello A)

$ Il linguaggio umano predefinito di ogni pagina Web può essere determinato a livello di programmazione.

#### Criteri di successo 3.1.2 - Linguaggio delle parti

(Livello AA)

$ Il linguaggio umano di ogni passaggio o frase nel contenuto può essere determinato a livello di programmazione ad eccezione dei nomi propri, 
dei termini tecnici, delle parole di linguaggio indeterminato e delle parole o frasi che sono diventate parte del volgare del testo immediatamente circostante.


#### Linea guida 3.2 – Prevedibile

$ Fai apparire le pagine Web e funzionano in modo prevedibile

#### Criteri di successo 3.2.1 - On focus

(Livello A)

$ Quando un componente dell'interfaccia utente riceve la messa a fuoco, non avvia un cambiamento di contesto.

#### Criteri di successo 3.2.2 - On input

(Livello A)

$ La modifica dell'impostazione di qualsiasi componente dell'interfaccia utente non causa automaticamente un cambiamento di contesto a meno
che l'utente non sia stato informato del comportamento prima di utilizzare il componente.

#### Criteri di successo 3.2.3 - Navigazione coerente

(Livello AA)

$ I meccanismi di navigazione che vengono ripetuti su più pagine Web all'interno di un insieme di pagine Web si verificano nello stesso ordine relativo ogni volta che vengono ripetuti,
a meno che non venga avviata una modifica da parte dell'utente.

#### Linea guida 3.3 – Assistenza per l'input

Aiuta gli utenti a evitare e correggere gli errori.

#### Criteri di successo 3.3.1 - Identificazione dell'errore

(Livello A)

$ Se viene rilevato automaticamente un errore di input, viene identificato l'elemento che è in errore e l'errore viene descritto all'utente nel testo.

(Presente nella login)

#### Criteri di successo 3.3.2 - Etichette o istruzioni

(Livello A)

$ Le etichette o le istruzioni vengono fornite quando il contenuto richiede l'input dell'utente.

(Presente nella login)

#### Criteri di successo 3.3.3 - Suggerimento di errore

(Livello AA)

Se viene rilevato automaticamente un errore di input e sono noti suggerimenti per la correzione, i suggerimenti vengono forniti all'utente,
a meno che ciò non metta a repentaglio la sicurezza o lo scopo del contenuto.

(Presente nella login)

#### Principio 4 – Robustezza

Il contenuto deve essere abbastanza robusto da poter essere interpretato da un'ampia varietà di agenti utente,
comprese le tecnologie assistive.

#### Linea guida 4.1 – Compatibile

Massimizzare la compatibilità con gli user agent attuali e futuri, comprese le tecnologie assistive.

#### Criteri di successo 4.1.1 - Analisi grammaticale

(Livello A)

$ Nel contenuto implementato utilizzando i linguaggi di markup, gli elementi hanno tag di inizio e fine completi, gli elementi sono nidificati in base alle loro specifiche,
gli elementi non contengono attributi duplicati e tutti gli ID sono univoci, tranne quando le specifiche consentono queste caratteristiche.

#### Criteri di successo 4.1.2 - Nome, ruolo, valore

(Livello A)

$ Per tutti i componenti dell'interfaccia utente (inclusi, a titolo esemplificativo ma non esaustivo: elementi del modulo, collegamenti e componenti generati dagli script), il nome e il ruolo possono essere determinati a livello di programmazione; gli stati, le proprietà e i valori che possono
essere impostati dall'utente possono essere impostati a livello di programmazione; e la notifica delle modifiche a questi elementi

#### Criteri di successo 4.1.3 - Messaggi di stato

(Livello AA)

$ Nei contenuti implementati utilizzando i linguaggi di markup, i messaggi di stato possono essere determinati a livello di programmazione attraverso il ruolo o le proprietà
in modo tale che possano essere presentati all'utente dalle tecnologie assistive senza ricevere messa a fuoco.

(role = status)

#### Criteri di successo

#### Criteri di successo

#### Criteri di successo

#### Criteri di successo



