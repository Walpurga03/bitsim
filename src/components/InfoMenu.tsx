import React, { useState } from 'react';
import styles from './InfoMenu.module.scss';
import { contactConfig } from '../config/contactConfig';  // Importiere die Kontakt-Konfiguration
import { FaGithub, FaBolt } from 'react-icons/fa';
import nostrImg from '../assets/nostr.gif';

interface InfoMenuProps {
  onMenuItemClick: (explanation: string) => void;
  hideIcon?: boolean;
}

const InfoMenu: React.FC<InfoMenuProps> = ({ onMenuItemClick, hideIcon = false }) => {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);

  // Funktion zum Kopieren in die Zwischenablage
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Adresse in die Zwischenablage kopiert!');
  };

  // Erweiterte Erklärungen für weitere Begriffe:
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
    
    Halving: `Halving:
Beim Halving wird die Belohnung für das Mining – also die Anzahl der neu generierten Bitcoins pro gefundenem Block – alle 210.000 Blöcke (rund alle vier Jahre) halbiert. Dieser Mechanismus reduziert schrittweise das Angebot an neuen Bitcoins, was langfristig zu einer deflationären Währung führt und zur Werterhaltung beiträgt.`,

Keypairs: `Keypairs:
Jedes Wallet besitzt ein Paar aus Private und Public Key.
- Der Private Key bleibt geheim und wird zur Signierung von Transaktionen verwendet.
- Der Public Key ist öffentlich und dient zur Validierung von Transaktionen.
Diese Schlüsselpaare gewährleisten die Sicherheit der Transaktionen, da nur der Inhaber des Private Keys berechtigt ist, Gelder zu transferieren.`,

Kontakt: `Kontakt:
Für Fragen, Anregungen oder Spenden können Sie mich über die folgenden Kanäle kontaktieren:`,

};

  const handleItemClick = (item: string) => {
    onMenuItemClick(explanations[item] || '');
    setOpen(false);
  };

  return (
    <div>
      {!hideIcon && (
        <div className={styles.infoIcon} onClick={toggleMenu}>
          INFO
        </div>
      )}
      {open && (
        <div className={styles.menu}>
          <ul>
            {Object.keys(explanations).map((item) =>
              item === 'Kontakt' ? (
                <li key="Kontakt">
                  <span>{item}:</span>
                  <div className={styles.contactButtons}>
                    <button onClick={() => copyToClipboard(contactConfig.github)}>
                      <FaGithub size={20} />
                    </button>
                    <button onClick={() => copyToClipboard(contactConfig. nostr)}>
                      <img src={nostrImg} alt="nostr" style={{ width: 20, height: 20 }} />
                    </button>
                    <button onClick={() => copyToClipboard(contactConfig.lightning)}>
                      <FaBolt size={20} />
                    </button>
                  </div>
                </li>
              ) : (
                <li key={item} onClick={() => handleItemClick(item)}>
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
