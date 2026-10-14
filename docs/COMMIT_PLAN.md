# Commit file map — October 2026 achievements and projects

This map covers the current achievement and project additions; the earlier portfolio redesign is already in the repository history. The assistant has not staged, committed or pushed these changes.

Run the commands yourself from the repository root after reviewing and testing. These three groups use whole files with no overlapping staging ranges. Asset files come first so the application commit can reference them immediately.

## 1. Poster and project artwork

**Message:** `feat(assets): add CppCon poster and hackathon project artwork`

Files:

- `vite-project/public/documents/cppcon-2026-poster.pdf` — unchanged supplied poster.
- `vite-project/public/art/cppcon-2026-poster.webp` — optimized poster preview.
- `vite-project/public/art/mayday-mayor.webp` — project screenshot.
- `vite-project/public/art/avatar-logo.webp` — project logo.

```sh
git add vite-project/public/documents/cppcon-2026-poster.pdf \
  vite-project/public/art/cppcon-2026-poster.webp \
  vite-project/public/art/mayday-mayor.webp \
  vite-project/public/art/avatar-logo.webp
git commit -m "feat(assets): add CppCon poster and hackathon project artwork"
```

## 2. Achievement entries, project details and poster access

**Message:** `feat(portfolio): add 2026 achievements and project details`

Files:

- `vite-project/src/content.js` — four new recognition entries, Pocket Rivals / Mayday Mayor / AVATAR project records, shared poster metadata, the six additional user-supplied repository links and updated page descriptions.
- `vite-project/src/render.js` — shared achievement rendering, project art, team-context headings, repository/contact actions, CoughSense’s secondary research link and poster preview/download links.
- `vite-project/src/styles.css` — responsive achievement and project art, Pocket Rivals title/round cards, wrapping action links and the new square portrait framing.
- `vite-project/public/art/adit-portrait.webp` — latest supplied headshot, optimized without cropping.
- `vite-project/tests/browser/content-additions.spec.js` — new prizes, project filters/details, repository access, images, overflow and PDF download coverage.
- `vite-project/tests/browser/readability.spec.js` — seven achievement stories in the trophy panel.
- `vite-project/tests/browser/usability.spec.js` — seven stories while preserving earlier award assertions.
- `vite-project/tests/browser/portfolio.spec.js` — ten cards in the reading view.
- `vite-project/tests/browser/game.spec.js` — ten cards in the game view.

```sh
git add vite-project/src/content.js vite-project/src/render.js \
  vite-project/src/styles.css \
  vite-project/public/art/adit-portrait.webp \
  vite-project/tests/browser/content-additions.spec.js \
  vite-project/tests/browser/readability.spec.js \
  vite-project/tests/browser/usability.spec.js \
  vite-project/tests/browser/portfolio.spec.js \
  vite-project/tests/browser/game.spec.js
git commit -m "feat(portfolio): add 2026 achievements and project details"
```

Review notes:

- CppCon is an AEQUITAS poster presentation, separate from CoughSense’s Best Poster Award.
- Mayday Mayor displays **both** 3rd Place and Best Use of Solana.
- AVATAR’s HackNC **2026** award and WolfVest’s HackNC **2025** award remain distinct.
- Pocket Rivals is private; visitors see its description and an email contact link.
- The game’s Achievements panel and standalone page use the same content. The Projects grid now has ten entries, including Pocket Rivals, Mayday Mayor and AVATAR. AEQUITAS remains separate. The source files are shared by both additions, so this whole-file group includes achievements and projects together.

For a separate repository-link commit after the other changes have been committed, use `feat(projects): link source repositories and preserve CoughSense research access`. It covers the new link fields in `src/content.js`, secondary project actions in `src/render.js`, and the corresponding README/content notes. These files currently also contain the earlier uncommitted additions, so use selected hunks if splitting them now.

For a separate portrait update after the earlier changes have been committed, use `feat(profile): replace portrait with updated headshot`. Files: `vite-project/public/art/adit-portrait.webp`, the portrait dimensions in `vite-project/src/render.js`, the `.about-portrait` rules in `vite-project/src/styles.css`, and the matching README/content/artwork notes. Use selected hunks if separating the currently shared source files.

## 3. Content sources and maintenance instructions

**Message:** `docs(portfolio): document new achievements and asset sources`

Files:

- `README.md`
- `docs/CONTENT_NOTES.md`
- `docs/ARTWORK.md`
- `docs/COMMIT_PLAN.md`

```sh
git add README.md docs/CONTENT_NOTES.md docs/ARTWORK.md docs/COMMIT_PLAN.md
git commit -m "docs(portfolio): document new achievements and asset sources"
```

## Validation

```sh
npm test
npm --prefix vite-project run format:check
npm run build
cd vite-project
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' npm run test:browser
```

The Chrome path is for this macOS machine. On other machines use an installed Playwright browser or set the variable to a suitable Chromium executable.

Before committing, review `/#projects`, `/overview/#projects`, `/achievements/`, `/#achievements`, `/cppcon/`, `/aequitas/#cppcon` and `/research/` on desktop and mobile. Click the poster preview and download actions. Build outputs, résumé QR outputs, Playwright reports/screenshots, local environment files and temporary source downloads stay ignored or outside the repository.
