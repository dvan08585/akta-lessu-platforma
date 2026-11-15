# Prompty do rycin: dwadzieścia obrazów w jednym języku

Dla generatorów obrazów (Midjourney, Flux, Stable Diffusion, Ideogram). Każdy prompt składa się z trzech części: **STYL** (zawsze ten sam, wklejany na początku), **OBRAZ** (inny dla każdej ryciny) i **NEGATYW** (zawsze ten sam, na końcu lub w polu negatywnym). Dzięki temu dwadzieścia obrazów z różnych sesji wygląda jak jeden cykl z jednej ręki.

Zasada: generujemy **czarną kreskę na białym papierze**, bez koloru. Kolor (atrament jasny w trybie ciemnym, akcent ciepła) nadaje aplikacja. Jedyny wyjątek koloru: tam, gdzie prompt mówi „one accent”, a i to lepiej dodać później ręcznie.

---

## STYL (wklej na początku każdego promptu)

```
19th-century wood engraving and copperplate etching, in the manner of a geological atlas plate and a Polish interwar woodcut (Ostoja-Chrostowski), black ink on cream laid paper, fine cross-hatching and parallel hatching instead of shading, slightly trembling hand-cut contour line, printed with a worn block, visible plate tone and ink grain, high contrast monochrome, no color, no gradients, no digital smoothness, strong composition with generous empty paper, matter before scene: textures of loess layers, brick, oak beams, striped flint, stone floor seams, sand. Mood: quiet, cold, archival, foreboding; a document rather than a painting. Flat lighting as in a print. Plate framed by thin ruled border with a small plate number in the corner.
```

Po polsku, co to znaczy: drzeworyt i miedzioryt z atlasu geologicznego XIX wieku z domieszką polskiego drzeworytu międzywojennego; czarny atrament na kremowym papierze czerpanym; cień tylko szrafowaniem; kontur lekko drżący, jak z zużytego klocka; dużo pustego papieru; faktura materiału ważniejsza niż scena; nastrój cichy, zimny, archiwalny, złowróżbny; światło płaskie jak na odbitce; cienka ramka z numerem planszy.

## NEGATYW (wklej na końcu albo w polu „negative prompt”)

```
color, colour, gradient, glow, lens flare, photo, photorealistic, 3D render, CGI, smooth digital painting, anime, cartoon, vector icon, flat design, logo, fantasy magic, glowing runes, crystals, dragons, faces, portrait, eyes, text, letters, watermark, signature, blurry, low contrast, grey mush, halftone dots, comic style, symmetrical mandala
```

## Parametry

- **Midjourney (v6/v7):** doklej `--ar <proporcja> --style raw --stylize 50 --chaos 5`. Negatyw jako `--no color, gradient, photo, faces, text, glow, logo, 3d`. Wersja `--v 7 --s 50 --style raw` daje najmniej „ładnej” gładkości, o to chodzi.
- **Flux (dev/pro):** guidance 3–4, steps 28–40; Flux słabo słucha negatywów, więc słowa negatywne wpleść w styl („strictly monochrome black ink, no color, no faces”).
- **Stable Diffusion XL / 3.5:** CFG 5–7, sampler DPM++ 2M Karras, 30–40 kroków; negatyw w osobnym polu; warto LoRA „woodcut” lub „etching”, jeśli są.
- **Ideogram:** styl „Design” lub „Illustration”, bez tekstu, magic prompt wyłączony (dopisuje kolor).
- Zawsze generować **4 warianty i wybierać najbardziej szorstki**, nie najładniejszy. Gładkość to wróg tego cyklu.

## Obróbka po wygenerowaniu (żeby weszło do aplikacji)

1. Zdjąć papier: progowanie do czystej czerni i bieli (Photoshop: Threshold 120–140; GIMP: Kolory → Próg) albo od razu wektoryzacja.
2. Wektoryzacja: Illustrator Image Trace (preset „Black and White Logo”, Threshold 128, Paths 80%, Corners 60%, Noise 10 px) albo `potrace -s -t 5 --alphamax 0.8` z wiersza poleceń. Wynik: SVG z jedną ścieżką w kolorze czarnym.
3. W SVG zamienić `fill="#000000"` na `fill="currentColor"`. Aplikacja nada kolor atramentu w obu trybach.
4. Usunąć ramkę z numerem planszy (aplikacja ma własne ramy) albo zostawić, jeśli ładna; wtedy wszystkie dwadzieścia muszą ją mieć.
5. Nazwy i rozmiary jak w `docs/GRAFIKA.md`: `public/ryciny/01-panorama.svg` itd.

---

## Dwadzieścia promptów (część OBRAZ)

Każdy: proporcja, co ma być w kadrze, czego nie. Numeracja zgodna z GRAFIKA.md.

### 01 Panorama siedmiu wzgórz (1200×440, `--ar 11:4`)
```
wide panoramic plate: seven loess hills in profile above a broad slow river, the hills of different heights like a sleeping animal's back, on the fourth hill from the left a small Romanesque brick church with a squat tower, on the fifth a cathedral belfry, below the ground line a geological cross-section of loess strata drawn in fine parallel hatching with a faint seven-sided outline buried in the layers, river rendered as long horizontal strokes, one small dove in flight above the fourth hill, enormous empty sky of bare paper, horizon low
```
Po polsku: siedem wzgórz w profilu nad rzeką, przekrój lessu pod ziemią, w warstwach ledwo widoczny siedmiobok, kościół św. Jakuba na czwartym wzgórzu, dzwonnica na piątym, gołąb nad czwartym, dużo pustego nieba.

### 02 Krzemień w dłoni (800×800, `--ar 1:1`)
```
a single banded flint stone shaped as a rough seven-sided pebble resting on an open palm seen from below the wrist, fingers slightly curled, hand cropped at the wrist, the flint's concentric bands dense and tight on one side and spreading irregularly on the other like tree rings cut off-center, each band a separate engraved line, skin rendered with sparse hatching, no face, no sleeve detail, stone is the only thing in focus
```

### 03 Ziemia (480×330, `--ar 3:2`)
```
low brick barrel vault of an underground corridor seen head-on, old handmade bricks with uneven mortar, fine loess dust pouring down from the crown of the arch in thin streams and heaping on the floor, at the far end one brick protruding a finger's width from the wall, darkness beyond rendered as dense cross-hatching, no people
```

### 04 Woda (480×330, `--ar 3:2`)
```
stone floor of a crypt seen from a low angle, large flagstones with deep seams, thin water seeping up through the seams and spreading in concentric ripples from one slab, the ripples engraved as nested ellipses, a column base at the edge, no figures, the water is the subject
```

### 05 Dźwięk (480×330, `--ar 3:2`)
```
a large bronze church bell hanging in a dark belfry, seen slightly from below, the bell's surface hatched to show the cast metal, beneath the bell concentric arcs sinking downward into the floor and into the ground below as if the sound were going into the earth not the air, a single candle flame on the floor bent sideways by the vibration, no people
```

### 06 Ogień (480×330, `--ar 3:2`)
```
close plate of a banded flint seven-sided stone lying on rough wool, the bands engraved as fine irregular ellipses, a dark wet smear across the lower edge of the stone rendered in dense cross-hatching so it reads as blood without color, one small spark of white paper left bare at the stone's edge, no hands, no faces (if color is permitted: one accent, the smear in dried blood red, nothing else)
```

### 07 Zimno (480×330, `--ar 3:2`)
```
vaulted cellar under a castle, brick ribs, frost crystals growing on the bricks drawn as sharp six-rayed stars of varying size, breath visible as a faint hatched cloud in the middle of empty air with nobody there, a single wooden bench, cold still composition with much empty paper
```

### 08 Ciemność (480×330, `--ar 3:2`)
```
a single sheet of lined paper from a field notebook on a plain table, the handwritten lines fading from dark to nothing toward the bottom as if the ink were dissolving in darkness, a just-extinguished candle beside it with a thin thread of smoke, the right half of the plate swallowed by dense cross-hatched black, no legible letters, no faces
```

### 09 Powietrze (480×330, `--ar 3:2`)
```
seven small stone points arranged as a regular heptagon on a flat slab, five of them pressed by fingertips of two different hands entering the plate from left and right, two points left empty, hands cropped at the wrists, fingernails and knuckles engraved precisely, slab texture of striped stone, nothing else in frame
```

### 10 Dziedziniec św. Jakuba z góry (900×600, `--ar 3:2`)
```
archaeological plan drawn as an engraved plate: a monastery courtyard seen straight from above, Romanesque brick church outline on one side, a rectangular excavation grid with trench labels drawn as small blank boxes (no letters), a long north slope with a deep narrow test pit at its foot, layers indicated by hatching density, a scale bar, a north arrow as a simple engraved arrow, feel of a 1950s field report
```

### 11 Wieża katedry w południe (900×600, `--ar 3:2`)
```
base of a tall Gothic brick cathedral tower seen from the pavement, a bare human hand pressed flat against the brick wall at shoulder height, arm cropped before the elbow, sunlight straight overhead so shadows are tiny (noon), the brickwork engraved brick by brick, the hand's shadow fused to the wall, no face, no other people
```

### 12 Nawa katedry, trzynasta rama (900×600, `--ar 3:2`)
```
interior of a baroque cathedral nave in one-point perspective, twelve large empty picture frames hung along both walls at equal intervals, each frame's interior left as blank hatched grey, at the far end near a dark stair down to the crypt a thirteenth frame set apart and slightly larger, floor flagstones with one darker wet slab near the thirteenth frame, no figures, no visible paintings
```

### 13 Kamienica, piwnica, nowsza cegła (900×600, `--ar 3:2`)
```
cellar of an old townhouse: brick wall where a doorway-sized section has been bricked up with visibly newer, straighter, lighter bricks than the ancient uneven ones around it, a shelf of glass jars with preserved fruit to one side, a hanging bulb drawn as a bare circle without glow, the newer bricks hatched more sparsely so they read as different, no people
```

### 14 Cegła wysunięta o centymetr (900×600, `--ar 3:2`)
```
extreme close plate of an old brick wall, one brick pushed out from the surface by a finger's width casting a thin shadow line, fine loess dust lying on its upper edge, mortar cracked around it, two bare words scratched into the mortar below rendered as illegible marks, the whole wall surface engraved in patient parallel strokes
```

### 15 Nagłówek papieru Fundacji (600×200, `--ar 3:1`)
```
engraved letterhead ornament for an institution: a thin double-ruled band with a small central emblem of a regular heptagon inside a circle, flanked by two restrained laurel-free geological motifs (stylized strata lines), no text, no lettering, severe and official, 1930s bureaucratic engraving style
```

### 16 Siedem pieczęci strażników (300×300 każda, `--ar 1:1`, siedem osobnych promptów)
Wspólne: `circular rubber stamp design, single color impression, slightly uneven inking as if stamped by hand, thin double ring border, no letters, no numbers, central motif only`. Motywy:
```
16a: a small Romanesque brick church with a squat tower and a dove above it
16b: a bronze bell with three arcs beneath it
16c: a candle flame bending sideways over three ripples of water
16d: a vaulted cellar arch with a six-rayed frost star inside
16e: a brick arch with a stream of dust falling from its crown
16f: a single open palm seen from the front, fingers spread
16g: a regular heptagon with seven small dots at its corners and a banded stone in the center
```

### 17 Mapa psychograficzna siedmiu wzgórz (1600×980, `--ar 16:10`)
```
an engraved map plate that is not a true map: a long profile of seven loess hills across the whole width, each hill drawn as a soft mound with its own hatching direction, beneath them deep geological strata in parallel lines with seven small seven-sided marks buried at different depths connected by faint dotted threads, a river as a wide band of horizontal strokes along the bottom, compass rose replaced by a plain seven-pointed star, no place names, no letters, empty cartouche in a corner for the app to fill
```

### 18 Amor na bruku (800×500, `--ar 8:5`)
```
a medium-sized mixed-breed dog seen from behind, standing on the cobblestones of an old market square, head turned slightly as if listening to the ground, tail low, one front paw lifted, cobbles engraved stone by stone, the square empty, an arcade of townhouse facades far in the background hatched lightly, never show the dog's face
```

### 19 Okładka strony / Open Graph (1200×630, `--ar 40:21`)
```
the panoramic seven-hills plate (as in plate 01) recomposed for a wide card: hills and river in the lower two thirds, upper third empty cream paper reserved for a title to be added later, a single banded flint stone drawn large in the upper right corner like a seal, no text
```

### 20 Ikona aplikacji (512×512, `--ar 1:1`)
```
a regular seven-sided stone with concentric irregular bands, engraved in bold simple strokes readable at a small size, centered on plain paper, no border, no text, heavy contour
```

---

## Dodatki do dokumentów (nakładki papieru, `--ar 1:1`, 5 wariantów)
```
isolated on pure white: a faint brown ring stain from a coffee cup, a folded and creased paper corner, a smudged thumbprint in ink, a partial impression of a round rubber stamp (no letters), a torn edge with fibers; each as a separate image, very light, to be overlaid on paper documents
```

## Jak sprawdzić, że obrazy pasują do siebie
Postaw cztery wybrane obok siebie na jednym ekranie. Jeśli różnią się grubością kreski albo gęstością szrafowania bardziej, niż różnią się dwie strony tej samej książki, generuj ponownie z tym samym ziarnem (`--seed` w Midjourney, `seed` w SD) i tym samym blokiem STYL, zmieniając tylko część OBRAZ. W Midjourney warto też użyć `--sref` z najlepszą wygenerowaną planszą jako referencją stylu dla pozostałych.
