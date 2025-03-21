import React, { useState, useEffect } from 'react';
import styles from '../styles/InfoMenu.module.scss';
import { 
  FaInfoCircle, FaTimes, FaBitcoin, FaDatabase, 
  FaArrowRight, FaCube, FaExchangeAlt, FaChartLine
} from 'react-icons/fa';

interface InfoMenuProps {
  onMenuItemClick: (data: { explanation: string, audioFile?: string }) => void;
  hideIcon?: boolean;
}

interface MenuItem {
  title: string;
  explanation: string;
  audioFile?: string;
}

interface MenuSection {
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
}

const InfoMenu: React.FC<InfoMenuProps> = ({ onMenuItemClick, hideIcon = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);

  // Definiere Menüinhalte
  useEffect(() => {
    const sections: MenuSection[] = [
      {
        title: "Grundlagen",
        icon: <FaBitcoin className={styles.sectionIcon} />,
        items: [
          {
            title: "Was ist Bitcoin?",
            explanation: `Bitcoin ist die erste dezentrale digitale Währung, die 2009 von einer Person oder Gruppe unter dem Pseudonym Satoshi Nakamoto geschaffen wurde.

Anders als traditionelle Währungen wird Bitcoin nicht von einer zentralen Autorität wie einer Bank oder Regierung ausgegeben oder kontrolliert. Stattdessen basiert sie auf einem Peer-to-Peer-Netzwerk und Open-Source-Software.

Bitcoins werden als Belohnung für einen Prozess namens "Mining" geschaffen und können gegen andere Währungen, Produkte und Dienstleistungen eingetauscht werden.`
          },
          {
            title: "Blockchain-Technologie",
            explanation: `Die Blockchain ist das Herzstück von Bitcoin. Sie ist ein öffentliches, dezentrales Hauptbuch, das alle jemals getätigten Bitcoin-Transaktionen aufzeichnet.

Neue Transaktionen werden in Blöcken zusammengefasst und der Blockchain hinzugefügt, nachdem sie durch Mining validiert wurden. Jeder Block enthält einen kryptografischen Hash des vorherigen Blocks, was eine Verkettung schafft und die Unveränderlichkeit der Daten gewährleistet.

Da die Blockchain auf tausenden Computern weltweit existiert, gibt es keine zentrale Fehlerquelle und keine Möglichkeit für eine einzelne Entität, die Kontrolle zu übernehmen.`
          },
          {
            title: "Kryptografische Schlüssel",
            explanation: `Bitcoin-Benutzer besitzen private und öffentliche Schlüsselpaare. Der öffentliche Schlüssel (oder eine Variante davon) dient als Bitcoin-Adresse, an die andere Benutzer Bitcoins senden können.

Der private Schlüssel wird zum Signieren von Transaktionen verwendet und sollte geheim gehalten werden. Wer den privaten Schlüssel kennt, kontrolliert die zugehörigen Bitcoins.

Die Sicherheit von Bitcoin basiert auf der praktischen Unmöglichkeit, den privaten Schlüssel aus dem öffentlichen Schlüssel oder einer Bitcoin-Adresse abzuleiten.`
          }
        ]
      },
      {
        title: "Mining & Konsens",
        icon: <FaCube className={styles.sectionIcon} />,
        items: [
          {
            title: "Proof-of-Work",
            explanation: `Der Proof-of-Work (PoW) ist der Konsensmechanismus, den Bitcoin verwendet, um zu bestimmen, welcher Miner den nächsten Block zur Blockchain hinzufügen darf.

Im PoW-System müssen Miner komplexe mathematische Rätsel lösen, indem sie eine Nonce finden, die einen Hash erzeugt, der unter einem bestimmten Zielwert liegt. Der erste Miner, der dieses Rätsel löst, darf den Block hinzufügen und erhält dafür eine Blockbelohnung plus Transaktionsgebühren.

Dieser Prozess erfordert erhebliche Rechenleistung, was Angriffe auf das System kostspielig macht und die Sicherheit des Netzwerks gewährleistet.`
          },
          {
            title: "Schwierigkeitsanpassung",
            explanation: `Bitcoin passt die Mining-Schwierigkeit automatisch an, um eine konstante Blockzeit von durchschnittlich 10 Minuten zu gewährleisten.

Die Anpassung erfolgt alle 2016 Blöcke (etwa alle zwei Wochen). Wurden die Blöcke im Durchschnitt schneller gefunden, wird die Schwierigkeit erhöht; wurden sie langsamer gefunden, wird die Schwierigkeit verringert.

Dieser Mechanismus sorgt für eine vorhersehbare Ausgabe neuer Bitcoins und passt das System an die wachsende Gesamtrechenleistung des Netzwerks an.`
          },
          {
            title: "51%-Angriff",
            explanation: `Ein 51%-Angriff bezieht sich auf ein Szenario, in dem ein Einzelner oder eine Gruppe die Mehrheit der Mining-Rechenleistung im Bitcoin-Netzwerk kontrolliert.

Mit dieser Kontrolle könnten sie bestimmte Aktionen durchführen, wie das Verhindern neuer Transaktionen oder das Rückgängigmachen kürzlich abgeschlossener Transaktionen (Double-Spending).

Aufgrund der enormen Rechenleistung des Bitcoin-Netzwerks und der hohen Kosten für Mining-Hardware wird ein solcher Angriff zunehmend unpraktisch und wirtschaftlich unrentabel.`
          }
        ]
      },
      {
        title: "Transaktionen & Netzwerk",
        icon: <FaExchangeAlt className={styles.sectionIcon} />,
        items: [
          {
            title: "Bitcoin-Transaktionen",
            explanation: `Eine Bitcoin-Transaktion ist eine Übertragung von Werten zwischen Bitcoin-Wallets, die in der Blockchain aufgezeichnet wird.

Jede Transaktion hat Inputs (von welchen Adressen die Bitcoins kommen) und Outputs (an welche Adressen sie gehen). Überschüssige Bitcoins werden als Wechselgeld zurück an den Absender gesendet.

Transaktionen werden mit dem privaten Schlüssel des Absenders digital signiert, was beweist, dass die Bitcoins wirklich dem Absender gehören.`
          },
          {
            title: "Mempool",
            explanation: `Der Mempool (Memory Pool) ist ein Wartebereich für unbestätigte Bitcoin-Transaktionen, bevor sie in einen Block aufgenommen werden.

Wenn du eine Bitcoin-Transaktion sendest, wird sie zuerst zum Mempool hinzugefügt. Miner wählen dann Transaktionen aus dem Mempool aus, typischerweise basierend auf den angebotenen Transaktionsgebühren.

Bei hoher Netzwerkauslastung kann der Mempool überfüllt werden, was zu längeren Wartezeiten und höheren Gebühren führen kann.`
          },
          {
            title: "Transaktionsgebühren",
            explanation: `Bitcoin-Transaktionsgebühren sind Anreize für Miner, Transaktionen in ihre Blöcke aufzunehmen.

Während Miner auch durch die Blockbelohnung entlohnt werden, werden Transaktionsgebühren immer wichtiger, da die Blockbelohnung alle vier Jahre halbiert wird.

Höhere Gebühren bedeuten in der Regel schnellere Bestätigungen, da Miner dazu neigen, Transaktionen mit höheren Gebühren zuerst zu bearbeiten. Die Gebühren werden in Satoshi pro Byte (sat/B) oder Satoshi pro virtuelles Byte (sat/vB) berechnet.`
          },
          {
            title: "Dezentrales Netzwerk",
            explanation: `Das Bitcoin-Netzwerk besteht aus Tausenden von Nodes (Knoten), die über das Internet miteinander verbunden sind.

Full Nodes speichern eine vollständige Kopie der Blockchain und validieren alle Transaktionen und Blöcke. Sie tragen zur Dezentralisierung und Sicherheit des Netzwerks bei.

Light Nodes speichern nur die für sie relevanten Teile der Blockchain und verlassen sich für Validierungen auf Full Nodes.

Diese dezentrale Struktur stellt sicher, dass kein einzelner Punkt des Versagens existiert und das Netzwerk widerstandsfähig gegen Zensur und Angriffe ist.`
          }
        ]
      },
      {
        title: "Wirtschaftliche Aspekte",
        icon: <FaChartLine className={styles.sectionIcon} />,
        items: [
          {
            title: "Begrenzter Vorrat",
            explanation: `Eine der wichtigsten Eigenschaften von Bitcoin ist sein begrenzter Vorrat: Es werden nie mehr als 21 Millionen Bitcoins existieren.

Diese Knappheit steht im starken Kontrast zu traditionellen Währungen, die von Zentralbanken nach Belieben geschaffen werden können. Dadurch wird Bitcoin oft als "digitales Gold" oder Absicherung gegen Inflation betrachtet.

Der letzte Bitcoin wird voraussichtlich im Jahr 2140 geschürft sein, wobei die Ausgaberate durch den Halving-Mechanismus schrittweise verringert wird.`
          },
          {
            title: "Halving",
            explanation: `Das "Halving" ist ein in den Bitcoin-Code eingebauter Mechanismus, der die Ausgaberate neuer Bitcoins reguliert.

Etwa alle vier Jahre (oder genau gesagt alle 210.000 Blöcke) halbiert sich die Blockbelohnung für Miner. Zu Beginn betrug die Belohnung 50 BTC pro Block, dann wurde sie auf 25 BTC, 12.5 BTC und aktuell 6.25 BTC reduziert.

Diese schrittweise Reduzierung der Inflation ist ein wesentlicher Teil des deflationären Designs von Bitcoin und trägt zu seinem Wertversprechen als knappes Gut bei.`
          },
          {
            title: "Wertspeicher vs. Zahlungsmittel",
            explanation: `In der Bitcoin-Community gibt es eine fortlaufende Debatte über die primäre Funktion von Bitcoin: Ist es ein Wertspeicher ("digital gold") oder ein Zahlungsmittel?

Als Wertspeicher bietet Bitcoin Schutz vor Inflation und wirtschaftlicher Unsicherheit, ähnlich wie Gold.

Als Zahlungsmittel ermöglicht Bitcoin schnelle, grenzenlose und relativ kostengünstige Übertragungen von Wert, obwohl Skalierungsprobleme und Volatilität dessen Nutzung als alltägliches Zahlungsmittel einschränken können.

Layer-2-Lösungen wie das Lightning Network zielen darauf ab, Bitcoin als Zahlungsmittel zu verbessern, indem sie schnellere und kostengünstigere Transaktionen ermöglichen.`
          }
        ]
      },
      {
        title: "Technische Entwicklung",
        icon: <FaDatabase className={styles.sectionIcon} />,
        items: [
          {
            title: "Upgrades & Forks",
            explanation: `Bitcoin entwickelt sich durch Upgrades weiter, die als Soft Forks (abwärtskompatibel) oder Hard Forks (nicht abwärtskompatibel) implementiert werden können.

Bedeutende Upgrades waren unter anderem:
- Segregated Witness (SegWit): Verbesserte die Skalierbarkeit und behob Transaktionsformbarkeit
- Taproot: Erhöhte Privatsphäre und Effizienz für komplexe Transaktionen

Hard Forks haben manchmal zu neuen Kryptowährungen geführt, wie Bitcoin Cash (BCH) und Bitcoin SV (BSV), die andere Designphilosophien vertreten.`
          },
          {
            title: "Lightning Network",
            explanation: `Das Lightning Network ist eine "Layer 2"-Lösung, die auf Bitcoin aufbaut, um schnellere und kostengünstigere Transaktionen zu ermöglichen.

Es funktioniert durch die Erstellung von Zahlungskanälen zwischen Benutzern, die mehrere Transaktionen ermöglichen, ohne dass jede einzelne in der Blockchain aufgezeichnet werden muss. Nur die abschließenden Salden werden in der Blockchain festgehalten.

Dieser Ansatz verbessert die Skalierbarkeit erheblich und ermöglicht Mikrozahlungen, die auf der Hauptkette unpraktisch wären, während gleichzeitig die Sicherheit und Dezentralisierung von Bitcoin erhalten bleibt.`
          },
          {
            title: "Smart Contracts auf Bitcoin",
            explanation: `Obwohl Bitcoin nicht mit der gleichen Smart-Contract-Funktionalität wie Ethereum entwickelt wurde, unterstützt es grundlegende programmierbare Funktionen durch seine Skriptsprache.

Bitcoin-Skripte ermöglichen verschiedene Anwendungsfälle wie:
- Multi-Signatur-Wallets, die mehrere Unterschriften für Ausgaben erfordern
- Zeitbasierte Sperren (Timelock), die Bitcoins für einen bestimmten Zeitraum sperren
- Hash Time-Locked Contracts (HTLCs), die für das Lightning Network und atomare Swaps wesentlich sind

Mit dem Taproot-Upgrade wurden die Smart-Contract-Fähigkeiten von Bitcoin weiter verbessert.`
          }
        ]
      }
    ];
    
    setMenuSections(sections);
  }, []);

  // Schließe Menü mit ESC-Taste
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (title: string, explanation: string, audioFile?: string) => {
    setActiveItem(title);
    onMenuItemClick({ explanation, audioFile });
    
    // Optional: Menü nach Item-Klick schließen
    // setIsOpen(false);
  };

  return (
    <>
      <div className={`${styles.iconContainer} ${hideIcon ? styles.hidden : ''}`}>
        <div className={styles.menuIcon} onClick={toggleMenu}>
          <FaInfoCircle />
        </div>
      </div>

      {isOpen && (
        <div className={styles.overlay} onClick={(e) => {
          if (e.target === e.currentTarget) setIsOpen(false);
        }}>
          <div className={styles.menu}>
            <div className={styles.menuHeader}>
              <div className={styles.menuTitle}>
                <FaInfoCircle className={styles.menuTitleIcon} />
                Bitcoin-Lexikon
              </div>
              <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
                <FaTimes />
              </button>
            </div>
            
            {menuSections.map((section, idx) => (
              <div key={idx} className={styles.menuSection}>
                <h3 className={styles.sectionTitle}>
                  {section.icon}
                  {section.title}
                </h3>
                <div className={styles.menuItems}>
                  {section.items.map((item, itemIdx) => (
                    <div 
                      key={itemIdx} 
                      className={`${styles.menuItem} ${activeItem === item.title ? styles.activeItem : ''}`}
                      onClick={() => handleMenuItemClick(item.title, item.explanation, item.audioFile)}
                    >
                      {item.title}
                      <FaArrowRight className={styles.itemIcon} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className={styles.menuFooter}>
              <p>Bitcoin Simulator &copy; 2023</p>
              <p>
                <a href="https://bitcoin.org/" target="_blank" rel="noopener noreferrer">
                  Mehr über Bitcoin lernen
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoMenu;