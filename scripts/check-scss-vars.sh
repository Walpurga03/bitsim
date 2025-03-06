#!/bin/bash

# Dieses Skript prüft, ob alle SCSS-Dateien die Variablen importieren

echo "Prüfe SCSS-Dateien auf Imports für variables.scss..."

# Suche alle SCSS-Dateien
SCSS_FILES=$(find src -type f -name "*.scss" | grep -v "_root.scss" | grep -v "variables.scss")

for file in $SCSS_FILES
do
  if ! grep -q "@use.*variables" "$file"; then
    echo "⚠️  $file: Kein variables.scss Import gefunden"
  else
    echo "✅ $file: Import OK"
  fi
  
  # Suche nach potenziellen Hardcoded Farben (einfache Heuristik)
  if grep -q "#[0-9a-fA-F]\{3,6\}" "$file" | grep -v "@use"; then
    echo "   - Potenzielle Hardcoded Farben gefunden"
  fi
  
  # Suche nach direkten Pixel/rem-Werten (einfache Heuristik)
  if grep -E -q "[0-9]+px|[0-9]+rem|[0-9]+em" "$file"; then
    echo "   - Potenzielle direkte Größenangaben gefunden"
  fi
done

echo "Prüfung abgeschlossen."
