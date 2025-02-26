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
    
    Mining: `Mining:
Mining ist ein spannender Prozess, bei dem neue Blöcke zur Blockchain hinzugefügt werden. Miner sammeln Transaktionen, prüfen ihre Gültigkeit und fügen sie in Blöcke ein. 
Durch den Einsatz des Proof-of-Work-Algorithmus sorgen sie dafür, dass das Netzwerk reibungslos und sicher funktioniert. Dabei tragen die Miner aktiv zur Stabilität und Dezentralisierung des Systems bei und werden als Anerkennung für ihren Beitrag mit neu generierten Bitcoins belohnt.`,
    
    PoW: `PoW (Proof-of-Work):
Proof-of-Work ist ein innovativer Mechanismus, bei dem Miner komplexe rechnergestützte Aufgaben lösen, um die Echtheit eines neuen Blocks zu bestätigen. 
Dieses Verfahren stellt sicher, dass nur regulierte und geprüfte Blöcke zur Blockchain hinzugefügt werden, was die Sicherheit und Stabilität des Netzwerks stärkt.`,
    
    Node: `Node:
Ein Node (Knoten) ist ein wesentlicher Baustein des dezentralen Bitcoin-Netzwerks. Jeder Node speichert die vollständige Blockchain, 
prüft Transaktionen und Blöcke auf ihre Gültigkeit und tauscht kontinuierlich Informationen mit anderen Nodes aus, um einen 
einheitlichen und aktuellen Datenstand sicherzustellen. Dieser fortlaufende Informationsaustausch fördert den Netzwerk-Konsens 
und trägt maßgeblich zur Integrität des Systems bei.`,
    
    Blockchain: `Blockchain:
Die Blockchain ist ein digitales, öffentliches und unveränderliches Kassenbuch, in dem alle Transaktionen und Blöcke in chronologischer Reihenfolge aufgezeichnet werden. Jeder Block enthält den Hash seines Vorgängers, was einen lückenlosen und manipulationssicheren Ablauf gewährleistet. Diese Technologie bildet das Fundament des dezentralen Bitcoin-Netzwerks und sorgt für Transparenz sowie Vertrauen im gesamten System.`,
    
    Difficulty: `Difficulty:
Der Mining-Schwierigkeitsgrad bestimmt, wie anspruchsvoll es ist, einen neuen Block zu finden. Er wird dynamisch angepasst, wobei in der Regel alle 2016 Blöcke (etwa alle zwei Wochen) der Durchschnitt der Blockgenerierungszeit ermittelt wird. 
Sollte dieser Durchschnitt unter 10 Minuten liegen, wird das Target (der numerische Schwierigkeitswert) gesenkt – das heißt, es wird kleiner –, sodass es schwieriger wird, einen Block zu finden. Umgekehrt wird das Target vergrößert, wenn die durchschnittliche Blockzeit über 10 Minuten liegt. 
Dieses Verfahren sorgt dafür, dass unabhängig von der insgesamt eingesetzten Rechenleistung im Netzwerk im Durchschnitt alle 10 Minuten ein Block generiert wird und das System stabil bleibt.`,
    
    Transaktionen: `Transaktionen:
Bei Bitcoin werden alle Transfers als Transaktionen verarbeitet, die sowohl Inputs (auch UTXOs genannt) als auch Outputs umfassen. 
Inputs repräsentieren dabei ungenutzte Ausgaben aus vorherigen Transaktionen, während Outputs den Betrag sowie die Empfängeradresse definieren. 
Alle Transaktionen werden kryptographisch signiert, um ihre Authentizität und Integrität sicherzustellen.`,
    
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
