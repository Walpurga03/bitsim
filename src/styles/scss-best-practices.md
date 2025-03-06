# SCSS Best Practices für BitSim

Um die Konsistenz und Wartbarkeit unseres Stylings zu gewährleisten, befolge bitte diese Richtlinien:

## Variablen importieren

Beginne jede SCSS-Datei mit dem Import der zentralen Variablen:

```scss
@use '../styles/variables' as *;
// Beachte: Der Pfad kann je nach Position der Datei variieren
```

## Variablen statt Hardcoded Werte

Verwende immer Variablen statt fester Werte für:

- Farben: `$primary-color` statt `#F7931A`
- Abstände: `$space-md` statt `1rem`
- Übergänge: `$transition-fast` statt `0.2s ease`
- Schriftarten: `$font-primary` statt direkter Fonts
- Schatten und Radien: `$border-radius` statt `0.5rem`

## Prüfen bestehender Dateien

Suche in bestehenden SCSS-Dateien nach Hardcoded-Werten wie:
- Hex-Farben (`#fff`, `#000`, usw.)
- Direkte Pixelwerte oder rem/em ohne Variablen
- Wiederholte Animationsdefinitionen
- Wiederholte Übergänge (transitions)

## Utility-Variablen nicht vergessen

Denke auch an weniger offensichtliche Variablen:
- `$transition-fast`, `$transition-medium` für Animationen
- `$box-shadow` für konsistente Schatten
- `$space-xs` usw. für kleine Abstände/Paddings
