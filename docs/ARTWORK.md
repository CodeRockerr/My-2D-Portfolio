# Generated artwork

Generated with ChatGPT’s built-in image-generation tool. Originals are retained unmodified in `docs/art/`; production assets use local WebP files.

## Primary playable world

| Asset | Original | Web delivery |
| --- | --- | --- |
| Complete top-down workshop | `docs/art/game-map-original.png` | `vite-project/public/art/game-map.webp` |
| Unified character sheet | `docs/art/unified-player-original.png` | `vite-project/public/art/unified-player.webp` |

The room is 1536 × 1024 and is always fitted in full within the game viewport. Furniture bounds and floor marker positions are defined in `src/game-world.js`.

The character is a 1254 × 1254 RGBA image, delivered as lossless WebP. One 4 × 4 sheet supplies every direction: down, left, right and up in successive rows. Columns provide neutral, contact, passing and opposite-contact poses. All directions share the same head, outfit and proportions. The runtime measures frame placement using recorded alpha bounds, normalizing visible height to 132 world pixels and the foot baseline to 141 pixels within a 164px avatar box. This compensates for the generated sheet’s uneven padding without altering the original image. The character scales proportionally with the room; navigation text stays readable outside it.

The former eight-frame sheet and separate side-walking sheet remain archived in `docs/art/`, including retired WebP deliveries. They are not used or shipped by the current game. The profile photo remains the supplied photograph.

### Unified character prompt

The exact generation prompt is retained in [unified-player-prompt.txt](art/unified-player-prompt.txt).

### Top-down map prompt

```text
Use case: stylized-concept. Asset type: actual top-down 2D RPG game map background for a playable software engineer portfolio, not a website mockup.
Create a landscape 3:2 pixel-art map, 1536x1024 if possible. STRICT classic 16-bit SNES RPG camera: top-down orthographic, walls and furniture show a little front face as in Stardew Valley or Pokemon interiors. Absolutely NO isometric angles, NO diamond-shaped room, NO 3D render. Large visible square pixels, purposeful limited palette, hand-placed pixel clusters. The map fills almost the entire frame. A rectangular cozy engineering workshop with dark midnight navy exterior border all around (roughly 6% edge). Warm amber wooden tiled floor, muted pine green walls, rich indigo furniture shadows, teal monitor glows, small golden lights.
Precise game level layout: back wall at y=12%; the open floor starts at y=29% and ends at y=88%, spans x=12% to x=88%.
Seven distinctive interactive furniture stations arranged around the perimeter:
1 at x=30%, y=22%: a desk with three cyan/green monitors displaying simple pixel financial chart patterns.
2 at x=72%, y=22%: a research poster board beside a short bookshelf and a gold trophy.
3 at x=16%, y=48%: a professional electronics workbench with tools and a small computer, against left wall.
4 at x=84%, y=48%: two blue and purple game arcade cabinets with a controller and blinking screen, against right wall.
5 at x=18%, y=78%: a comfortable reading nook with a rust-orange armchair, small side table, a green plant.
6 at x=47%, y=84%: a small freestanding wooden desk with a neat white document and fountain pen.
7 at x=80%, y=79%: a red letter box on a stand beside a small potted plant.
Keep the ENTIRE middle area x=28%..72%, y=35%..75% EMPTY walkable wooden floor, with only one small dark green rectangular rug centered at (50%,55%). No obstacles or objects on the rug. Generous connected walkable corridors between every station. Small windows along walls, subtle books and wall decorations only at edges. Crisp warm lighting drawn with discrete pixel tones, dark edge outlines. The result must unmistakably look like a real retro 2D game level.
No characters, no text, no letters, no logos, no UI, no watermarks, no gradients, no anti-aliasing.
```

## Optional reading-view artwork

| Asset                            | Original                                 | Web delivery                                    |
| -------------------------------- | ---------------------------------------- | ----------------------------------------------- |
| Isometric studio                 | `docs/art/studio-original.png`           | `vite-project/public/art/studio.webp`           |
| Four-frame engineer sprite sheet | `docs/art/engineer-sprites-original.png` | `vite-project/public/art/engineer-sprites.webp` |

The studio is 1536 × 1024. The sprite sheet is 2172 × 724, divided into four equal-width CSS frames. The avatar is a stylized illustration, not a likeness derived from a photo. The studio is composited with ordinary HTML links and a movable DOM sprite; no lettering baked into the art is relied upon for navigation.

The selected images were copied into the workspace and converted with `cwebp`. The character conversion uses lossless WebP to preserve transparency. The studio uses quality 85. Originals are retained without modification. `coughsense-poster.webp` is a rendered preview of the supplied PDF, not AI-generated art.

## Studio prompt

```text
Use case: stylized-concept. Asset type: original pixel-art environment for Adit Shah's interactive 2D engineering portfolio.
Create a polished wide landscape 3:2 isometric cutaway engineering studio as a single game environment asset. Render against a perfectly flat warm ivory #f4f1e9 background, no text or UI anywhere. The room is an elegant compact workspace, viewed from above at an isometric angle, its complete diamond floor and short back walls visible, with generous outer breathing room. Warm oak parquet floor, muted sage green walls, dark forest green metal, creamy paper and tiny amber lights. Crisp carefully placed pixel clusters, premium indie game pixel art, no blur, no gradients, no photorealism. Arrange: along back left a walnut desk with dual green-screen monitors showing abstract code and market curves; back right a research poster display and a low bookshelf with books and one small golden trophy; front left an electronics bench with a small microcontroller, oscilloscope and a plant; front right a low cabinet holding a red closed mailbox and a blue game controller. Keep the middle and front middle of floor empty for a movable character, clearly open walkable floor. All items complete, grounded, natural consistent scale, cohesive detailed custom sprites. A few quiet plants. Warm overhead light, sparse subtle pixel shadows. No lettering, no numbers, no brand logos, no watermark. The room should feel intelligent, personal, calm and professional, suitable beside clean editorial website typography.
```

## Character-sheet prompt

```text
Use case: stylized-concept. Asset type: game character sprite sheet for a pixel-art interactive portfolio. Create one horizontal sprite sheet of exactly FOUR equally sized square cells in one row on a genuinely TRANSPARENT background. Each cell contains the SAME small friendly male engineer character, medium brown skin, short dark hair, dark round glasses, ivory overshirt over forest green t-shirt, dark blue trousers, brown shoes. All four figures same scale, full body visible, centered at exact x positions 12.5%, 37.5%, 62.5%, 87.5% of canvas width, same baseline at 85% canvas height, generous transparent margins, about 65% of cell height. Cell 1 facing front-left standing, cell 2 facing front-left walking left leg forward, cell 3 facing front-left walking right leg forward, cell 4 facing back-right standing. 4:1 aspect ratio. Crisp intentional game pixel art, 32-pixel-character aesthetic scaled up with hard edges. Warm muted natural colors, simple charming human proportions, slight isometric top down view to fit an isometric engineering studio. No grid lines, no lettering, no labels, no contact shadows outside the figures, no accessories outside the clothes, no watermark. Alpha transparency around every sprite, no painted checkerboard.
```

## Maintenance

If regenerating the environment, check the labels and update the floor polygon in `src/studio-math.js` and station positions in `src/studio.js`. If regenerating the sheet, check equal frame spacing and alpha transparency, then update the CSS aspect ratio and frame count if needed. Do not reference images from a machine-specific generated-images directory in production.

## Official event artwork

These images are event branding, not generated artwork. They were downloaded unchanged from the event organizers’ Devpost listings and are hosted locally to avoid third-party image requests from visitors. Each achievement image links to its source event page. Event names and institutions are rendered as accessible HTML beside the artwork.

- `public/art/hackncstate-2026.png`: detective-wolf logo from the [HackNCState 2026 event listing](https://hackncstate2026.devpost.com/), [original event image](https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/004/205/120/datas/original.png).
- `public/art/hacknc-2025.png`: ram/game-console mascot from the [HackNC 2025 event listing](https://hacknc-2025.devpost.com/), [original event image](https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/003/837/359/datas/original.png).

The additional WattWatch, StockX and RecipeAI project visuals are decorative HTML/SVG illustrations of their domains, not screenshots or measured performance plots.
