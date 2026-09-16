# The Last Cachebender

An interactive learning journey through caching fundamentals, cache layers, read and write strategies, eviction, invalidation, failure modes, and system design.

The learner must master the four Cache Realms and use them together to defeat the Latency Lord.

## Status

Course content and the standalone website are under development.

## Preview locally

Open `index.html` directly in a browser, or serve the folder locally:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project files

- `index.html` — course map and landing page
- `course.html` — Prologue and Lessons 1–2
- `book-air.html` — Book One and Lesson 3
- `book-water.html` — Book Two and Lesson 4
- `book-earth.html` — Book Three and Lessons 5–6
- `book-fire.html` — Book Four and Lesson 7
- `book-spirit.html` — the Spirit Library and Lessons 8–11
- `book-war.html` — Book Five, Lessons 12–14, and the appendices
- `l1.html` through `l14.html` — standalone lesson pages
- `techniques.html` — reference index for the course concepts
- `css/` — shared course and landing-page styles
- `js/` — theme, progress, navigation, and reading behaviour
- `public/og.webp` — social-sharing preview

## Maintaining lesson content

The standalone pages, `l1.html` through `l14.html`, are the canonical source
for each lesson's heading and body. The grouped book pages provide a continuous
reading route and contain generated copies of those lesson blocks. Keep their
book introductions, appendices, navigation, and metadata in the grouped pages.

After editing a standalone lesson, first check that the grouped copies match:

```powershell
python tools/sync_lessons.py
```

If the command reports drift, update the grouped copies and check again:

```powershell
python tools/sync_lessons.py --write
python tools/sync_lessons.py
```

Course-planning material is maintained locally under `docs/` and is intentionally excluded from the public repository.

## Planned deployment

The project is intended to be published with GitHub Pages at:

`https://shahbaaz12.github.io/the-last-cachebender/`


## Home banner animation

The banner renders water, earth, fire, and air directly with Canvas 2D in
`js/realm-intro.js`. No video, external library, or additional asset is needed.
The scenes overlap during transitions rather than clearing between elements.

Visitors can select an element or pause the motion. Reduced-motion preferences
show a still scene with manual element selection. Rendering is capped at 30 fps,
device resolution at 2×, and pauses when the canvas is offscreen or the tab is
hidden. The original cache diagram remains available if JavaScript or Canvas
is unavailable.
