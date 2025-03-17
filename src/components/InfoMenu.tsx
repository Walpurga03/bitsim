import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/InfoMenu.module.scss';
import { contactConfig } from '../config/contactConfig';
import { FaGithub, FaBolt } from 'react-icons/fa';
import { IoInformationCircle } from 'react-icons/io5';
import nostrImg from '../assets/nostr.gif';

// Audio-Dateien importieren
import konsensAudio from '../assets/audio/Konsens.mp3';
import miningAudio from '../assets/audio/Mining.mp3';

interface ExplanationData {
  explanation: string;
  audioFile?: string;
}

interface InfoMenuProps {
  onMenuItemClick: (data: ExplanationData) => void;
  hideIcon?: boolean;
}

const InfoMenu: React.FC<InfoMenuProps> = ({ onMenuItemClick, hideIcon = false }) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuAnimation, setMenuAnimation] = useState(false);

  const toggleMenu = () => {
    if (!open) {
      setOpen(true);
      // Animation starten, wenn Menü geöffnet wird
      setTimeout(() => setMenuAnimation(true), 50);
    } else {
      setMenuAnimation(false);
      // Warten bis Animation fertig ist, dann Menü schließen
      setTimeout(() => setOpen(false), 300);
    }
  };

  // Click outside handler zum Schließen des Menüs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && 
          !(event.target as Element)?.classList?.contains(styles.infoIcon)) {
        setMenuAnimation(false);
        setTimeout(() => setOpen(false), 300);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Escape-Taste zum Schließen des Menüs
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setMenuAnimation(false);
        setTimeout(() => setOpen(false), 300);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [open]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Erfolgreiche Kopier-Animation oder Feedback
        const message = `${type}-Adresse in die Zwischenablage kopiert!`;
        // Hier könnten wir statt alert ein besseres Feedback-Element einsetzen
        alert(message);
      })
      .catch(err => {
        console.error('Kopieren fehlgeschlagen:', err);
        alert('Kopieren fehlgeschlagen. Bitte manuell kopieren.');
      });
  };

  // Alle Erläuterungstexte - bestehend behalten
  const explanations: Record<string, string> = {
    Konsens: `Konsens im Bitcoin-Netzwerk:
    Der Bitcoin-Konsens sorgt dafür, dass alle Teilnehmer des Netzwerks sich ohne zentrale Kontrolle auf den gleichen Stand der Blockchain einigen können.
    Kernelemente:
    - Längste-Kette-Regel: Alle Nodes akzeptieren automatisch die Blockchain mit der meisten Rechenarbeit als die gültige Kette.
    - Validierungsregeln: Jeder Node prüft selbständig alle Blöcke und Transaktionen nach festgelegten Regeln.
    - Bestätigungen: Mit jedem weiteren Block über einer Transaktion sinkt das Risiko einer Umkehrung drastisch.
    Beispiele für feste Regeln:
    - Jede Transaktion muss korrekt signiert sein.
    - Neue Bitcoins dürfen nur gemäß dem Ausgabeplan erzeugt werden, der auf maximal 21 Millionen Bitcoins begrenzt ist.
    - Die Block-Belohnung muss dem aktuellen Halving-Stand entsprechen.
    - Transaktionen dürfen nur vorhandene, noch nicht ausgegebene Bitcoins verwenden.
    Durch diesen Mechanismus erreicht Bitcoin Einigkeit im Netzwerk und verhindert Manipulationen wie doppelte Ausgaben (Double-Spending), ohne dass eine zentrale Instanz benötigt wird.`,
    
    Mining: `Mining im Bitcoin-Netzwerk:
    Mining erklärt:
    Bitcoin-Mining ist der Prozess, bei dem Transaktionen verifiziert und zur Blockchain hinzugefügt werden. Die Miner konkurrieren darum, einen neuen Block zu erzeugen, indem sie folgende Aufgaben erfüllen:
    Technischer Ablauf:
    - Sammeln von Transaktionen: Miner wählen aus dem Mempool unbestätigte Transaktionen aus
    - Blockbildung: Die ausgewählten Transaktionen werden zu einem Kandidatenblock zusammengefasst
    - Mathematisches Puzzle lösen: Der Miner sucht einen speziellen Nonce-Wert, der zu einem Block-Hash unter dem aktuellen Schwierigkeits-Target führt
    - Proof-of-Work: Das wiederholte Hashen mit verschiedenen Nonce-Werten stellt eine messbare Rechenarbeit dar
    - Verbreitung: Ein erfolgreicher Block wird im Netzwerk verbreitet und von anderen Nodes verifiziert

    Belohnungen:
    - Block-Belohnung: Aktuell neu geschaffene Bitcoins pro Block
    - Transaktionsgebühren: Zusätzliche Anreize durch Gebühren der enthaltenen Transaktionen

    Das Mining sichert das Netzwerk gegen Angriffe, da ein Angreifer mehr als 50% der gesamten Rechenleistung des Netzwerks kontrollieren müsste, um die Blockchain zu manipulieren. Gleichzeitig stellt es einen fairen Mechanismus zur Ausgabe neuer Bitcoins dar.`,
    
    PoW: `Proof-of-Work (PoW) im Bitcoin-Netzwerk:
    Proof-of-Work erklärt:
    Proof-of-Work ist das kryptografische Verfahren, mit dem Bitcoin sicherstellt, dass nur Blöcke mit nachgewiesener Rechenarbeit zur Blockchain hinzugefügt werden können.
    Technische Details:
    - Die Herausforderung: Finde einen Nonce-Wert, sodass der Hash des gesamten Blocks unter einem bestimmten Zielwert (Target) liegt.
    - SHA-256: Bitcoin verwendet die kryptografische Hashfunktion SHA-256, die für jeden Input einen eindeutigen, nicht vorhersagbaren Output erzeugt.
    - Rechenintensiv: Das Finden einer Lösung erfordert Millionen oder Milliarden von Versuchen.
    - Leicht zu überprüfen: Andere Nodes können die gefundene Lösung mit nur einer einzigen Hash-Berechnung verifizieren.
    - Anpassbare Schwierigkeit: Die Target-Schwierigkeit wird alle 2016 Blöcke angepasst, um eine durchschnittliche Blockzeit von 10 Minuten zu gewährleisten.
    Der Proof-of-Work-Mechanismus macht Angriffe auf das Netzwerk extrem kostspielig und bewirkt, dass eine Manipulation der Blockchain eine massive Investition in Rechenleistung erfordern würde, die den möglichen Gewinn übersteigt.`,
    
    Node: `Nodes im Bitcoin-Netzwerk:
    Nodes erklärt:
    Ein Node (Knoten) ist ein Computer oder Server, der am Bitcoin-Netzwerk teilnimmt und wesentliche Funktionen für dessen Betrieb erfüllt.
    Arten von Nodes:
    - Full Node: Speichert die komplette Blockchain, prüft alle Regeln und verbreitet Informationen.
    - Mining Node: Ein Full Node mit zusätzlicher Mining-Software, der aktiv nach neuen Blöcken sucht.
    - Light Node (SPV): Speichert nur Block-Header und eigene Transaktionen, geeignet für mobile Geräte.

    Hauptaufgaben eines Full Nodes:
    - Validierung: Überprüft eigenständig jede Transaktion und jeden Block auf Regelkonformität.
    - Datenspeicherung: Hält die gesamte Blockchain lokal verfügbar (derzeit über 500 GB).
    - Weiterleitung: Überträgt neue Transaktionen und Blöcke an verbundene Peers.
    - Peer-to-Peer-Kommunikation: Tauscht Daten mit anderen Nodes über das Bitcoin-Protokoll aus.

    Je mehr unabhängige Nodes im Netzwerk aktiv sind, desto dezentraler und widerstandsfähiger ist Bitcoin gegen Zensur und Manipulation. Jeder kann einen Node betreiben und damit direkt zur Sicherheit des Netzwerks beitragen.`,
    
    Blockchain: `Die Blockchain-Technologie in Bitcoin:
    Blockchain erklärt:
    Die Blockchain ist die grundlegende Datenstruktur von Bitcoin – ein chronologisch verkettetes, digitales Kassenbuch, das alle jemals durchgeführten Transaktionen permanent und öffentlich speichert.
    Aufbau der Blockchain:
    - Blöcke: Container für Transaktionen, die etwa alle 10 Minuten erzeugt werden.
    - Verkettung: Jeder Block enthält den kryptografischen Hash seines Vorgängerblocks.
    - Merkle Tree: Eine baumartige Datenstruktur innerhalb des Blocks, die alle Transaktionen effizient organisiert.
    - Block-Header: Enthält Metadaten wie Version, Zeitstempel, Schwierigkeitsgrad und Nonce.

    Schlüsseleigenschaften:
    - Unveränderlichkeit: Eine Änderung in einem Block würde alle folgenden Blöcke ungültig machen.
    - Transparenz: Jeder kann die gesamte Transaktionshistorie einsehen.
    - Dezentralisierung: Die Blockchain wird redundant auf tausenden Computern weltweit gespeichert.
    - Fälschungssicherheit: Eine Manipulation würde massive Rechenleistung erfordern und sofort erkannt werden.

    Die Blockchain löst das "Double-Spending-Problem" digitaler Währungen, indem sie einen zeitlich geordneten, manipulationssicheren Nachweis über jede Transaktion liefert, ohne dass eine vertrauenswürdige zentrale Instanz nötig ist.`,
    
    Difficulty: `Difficulty-Adjustment im Bitcoin-Netzwerk:
    Difficulty erklärt:
    Die Difficulty (Schwierigkeit) ist ein dynamischer Parameter im Bitcoin-Protokoll, der reguliert, wie schwer es ist, einen gültigen Block zu finden, um die Blockzeit von etwa 10 Minuten konstant zu halten.
    Funktionsweise:
    - Target-Wert: Ein numerischer Wert, der festlegt, wie klein der Hash eines Blocks sein muss, um akzeptiert zu werden.
    - Schwierigkeitsanpassung: Findet alle 2016 Blöcke (ca. alle 2 Wochen) statt.
    Automatische Regulierung:
    - Wurden die 2016 Blöcke schneller als 14 Tage gefunden → Schwierigkeit steigt.
    - Wurden die 2016 Blöcke langsamer als 14 Tage gefunden → Schwierigkeit sinkt.
    Maximale Anpassung: Der Schwierigkeitsgrad kann sich pro Zyklus maximal um Faktor 4 ändern.
    Bedeutung:
    - Stabilität: Sorgt für konstante Blockzeiten trotz wachsender Netzwerk-Hashrate.
    - Vorhersehbare Ausgabe: Ermöglicht eine kalkulierbare Bitcoin-Erzeugungsrate.
    - Sicherheit: Eine höhere Schwierigkeit bedeutet einen besseren Schutz gegen Angriffe.
    Der Difficulty-Adjustment ist einer der genialsten Aspekte des Bitcoin-Designs, da er automatisch auf Veränderungen in der Netzwerk-Rechenleistung reagiert und die Kernfunktionen des Systems stabil hält.`,
    
    Transaktionen: `Transaktionen im Bitcoin-Netzwerk:
    Transaktionen erklärt:
    Bitcoin-Transaktionen sind digitale Datensätze, die den Transfer von Bitcoin-Werten dokumentieren und in der Blockchain gespeichert werden.
    Struktur einer Transaktion:
    - Inputs: Verweise auf frühere Transaktionsausgänge (UTXOs), die ausgegeben werden sollen.
    - Outputs: Neue UTXOs, die die Empfängeradressen und Beträge festlegen.
    - Signatur: Kryptografischer Beweis, dass der Sender befugt ist, die Inputs auszugeben.
    - Gebühr: Differenz zwischen Input-Summe und Output-Summe, die an Miner geht.

    UTXO-Modell:
    - Unspent Transaction Output (UTXO): Unausgegebene Bitcoin-Beträge, die einem Besitzer zugeordnet sind.
    - Keine Konten: Bitcoin verwendet keine Konten mit Salden, sondern nur diese "unverbrauchten Ausgänge".
    - Wechselgeld: Muss als separater Output an die eigene Adresse zurückgesendet werden.

    Verifizierung:
    - Jeder Node prüft: Sind alle referenzierten Inputs vorhanden und unverbraucht?
    - Signaturen: Stimmen die kryptografischen Signaturen mit den betreffenden Public Keys überein?
    - Beträge: Ist die Summe der Outputs plus Gebühren gleich der Summe der Inputs?

    Sobald eine Transaktion in einem Block bestätigt wurde, werden die verwendeten Inputs als "ausgegeben" markiert und die neuen Outputs als "unausgegeben" (UTXOs) für zukünftige Transaktionen verfügbar.`,
    
    Halving: `Halving im Bitcoin-Netzwerk:
    Halving erklärt:
    Das Halving ist ein programmierter Mechanismus im Bitcoin-Protokoll, der die Inflationsrate kontrolliert und die Knappheit sicherstellt.
    Kernelemente:
    - Regelmäßige Reduzierung: Alle 210.000 Blöcke (etwa alle 4 Jahre) halbiert sich die Mining-Belohnung.
    - Ausgabekontrolle: Begann mit 50 BTC pro Block, jetzt bei 3,125 BTC, nächstes Halving auf 1,5625 BTC.
    - Maximale Menge: Der Halving-Mechanismus stellt sicher, dass nie mehr als 21 Millionen Bitcoins erzeugt werden können.
    - Vorhersehbare Knappheit: Im Gegensatz zu traditionellen Währungen ist das Angebot mathematisch festgelegt.

    Historische Halvings:
    - 2012: Reduzierung von 50 auf 25 BTC.
    - 2016: Reduzierung von 25 auf 12,5 BTC.
    - 2020: Reduzierung von 12,5 auf 6,25 BTC.
    - 2024: Reduzierung von 6,25 auf 3,125 BTC.
    - Nächstes Halving: ca. 2028.

    Dieser Mechanismus schafft ein vorhersehbares, zunehmend knappes Geldangebot, was Bitcoin zu einer potenziell deflationären Währung macht und zur langfristigen Werterhaltung beitragen kann.`,
    
    Keypairs: `Keypairs im Bitcoin-Netzwerk:
    Keypairs erklärt:
    Keypairs (Schlüsselpaare) sind das Fundament der Sicherheit im Bitcoin-Netzwerk und ermöglichen digitales Eigentum ohne zentrale Autorität.
    Kernelemente:
    - **Private Key:** Eine zufällig generierte, 256-Bit lange Zahl, die streng geheim bleiben muss. Funktioniert wie ein digitaler Schlüssel zum Wallet. Wer den Private Key besitzt, kontrolliert die Bitcoins. Mathematisch fast unmöglich zu erraten (2^256 mögliche Kombinationen).
    - **Public Key:** Wird mathematisch aus dem Private Key abgeleitet. Kann öffentlich geteilt werden, ohne ein Sicherheitsrisiko darzustellen. Dient zur Verifizierung von Signaturen. Bitcoin-Adressen werden durch Hashing des Public Keys erzeugt.
    - **Digitale Signatur:** Bei jeder Transaktion erzeugt der Private Key eine einzigartige Signatur, die beweist, dass der Sender berechtigt ist, seine Bitcoins auszugeben. Diese Signatur kann mit dem Public Key von jedem verifiziert werden und verhindert Fälschungen sowie unbefugte Transaktionen.

    Die Keypair-Technologie ermöglicht ein System, in dem jeder seine eigene Bank sein kann, ohne Vertrauen in Dritte setzen zu müssen – ein Kernprinzip von Bitcoin.`,
    
    Kontakt: `Kontakt:
    Für Fragen, Anregungen oder Spenden können Sie mich über die folgenden Kanäle kontaktieren:`,

    Mempool: `Der Mempool im Bitcoin-Netzwerk:

Was ist der Mempool?
Der Mempool (Memory Pool) ist die temporäre Datenbank jedes Bitcoin Full Nodes, in der alle unbestätigten Transaktionen gesammelt werden, bevor sie in einen Block aufgenommen werden.

Funktionsweise:
1. Neue Transaktionen werden zuerst über das Peer-to-Peer-Netzwerk an die Nodes gesendet
2. Jeder Node prüft die Gültigkeit der Transaktion (gültige Signatur, ausreichendes Guthaben)
3. Gültige Transaktionen werden im lokalen Mempool gespeichert und an andere Nodes weitergeleitet
4. Miner wählen Transaktionen aus ihrem Mempool für ihre Blöcke aus - normalerweise die mit den höchsten Gebühren zuerst

Besonderheiten:
- Größenlimit: Jeder Node hat ein individuelles Limit (oft 300MB) für seinen Mempool
- Gebührenmarkt: Bei hoher Netzwerkauslastung steigen die Gebühren durch Wettbewerb
- Child Pays For Parent (CPFP): Eine nachfolgende Transaktion kann die Priorität einer vorherigen erhöhen
- Replace By Fee (RBF): Eine Transaktion kann durch eine Version mit höherer Gebühr ersetzt werden
- Zeitbasierte Entfernung: Transaktionen mit sehr niedrigen Gebühren werden nach 14 Tagen aus dem Mempool entfernt

Im Idealzustand ist der Mempool fast leer (alle Transaktionen werden schnell bestätigt). In Zeiten hoher Aktivität kann er aber auf Millionen ausstehender Transaktionen anwachsen, was zu längeren Wartezeiten und höheren Gebühren führt.`,
  };

  // Mapping von Kategorien zu importierten Audiodateien
  const audioMapping: Record<string, string> = {
    Konsens: konsensAudio,
    Mining: miningAudio,
    // weitere Zuordnungen ergänzen ...
  };

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    onMenuItemClick({
      explanation: explanations[item] || '',
      audioFile: audioMapping[item],
    });
    
    // Bei kleinen Bildschirmen das Menü nach Auswahl schließen
    if (window.innerWidth <= 768) {
      setMenuAnimation(false);
      setTimeout(() => setOpen(false), 300);
    }
  };

  // Liste aller Menüpunkte
  const menuItems = ["Blockchain", "Konsens", "Node", "Mining", "PoW", "Difficulty", "Mempool", "Transaktionen", "Halving", "Keypairs", "Kontakt"];

  return (
    <div className={styles.infoMenu}>
      {!hideIcon && (
        <div 
          className={styles.infoIcon} 
          onClick={toggleMenu}
          role="button"
          aria-label={open ? "Informationsmenü schließen" : "Informationsmenü öffnen"}
          tabIndex={0}
          aria-expanded={open}
        >
          <IoInformationCircle size={20} style={{ marginRight: '6px' }} />
          INFO
        </div>
      )}
      
      {open && (
        <div 
          className={`${styles.menu} ${menuAnimation ? styles.visible : styles.hidden}`}
          ref={menuRef}
          role="menu"
          aria-label="Bitcoin Informationen"
        >
          <ul>
            {menuItems.map(item => 
              item === "Kontakt" ? (
                <li 
                  key="Kontakt" 
                  className={`${styles.contactItem} ${selectedItem === "Kontakt" ? styles.selected : ''}`}
                  onClick={() => handleItemClick("Kontakt")}
                  role="menuitem"
                  tabIndex={0}
                  aria-selected={selectedItem === "Kontakt"}
                >
                  <span>Kontakt</span>
                  <div className={styles.contactButtons}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(contactConfig.github, 'GitHub');
                      }}
                      aria-label="GitHub-Link kopieren"
                    >
                      <FaGithub size={20} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(contactConfig.nostr, 'Nostr');
                      }}
                      aria-label="Nostr-Link kopieren"
                    >
                      <img src={nostrImg} alt="nostr" style={{ width: 20, height: 20 }} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(contactConfig.lightning, 'Lightning');
                      }}
                      aria-label="Lightning-Adresse kopieren"
                    >
                      <FaBolt size={20} />
                    </button>
                  </div>
                </li>
              ) : (
                <li 
                  key={item} 
                  onClick={() => handleItemClick(item)}
                  className={selectedItem === item ? styles.selected : ''}
                  role="menuitem"
                  tabIndex={0}
                  aria-selected={selectedItem === item}
                >
                  {item}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InfoMenu;