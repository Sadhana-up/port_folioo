# Sadhana Uprety — portfolio

Personal portfolio for Sadhana Uprety: BSc Data Science student at Kathmandu University and AI Developer at Lucent AI Nepal.

Built with **Vite 6 + React 18 + TypeScript**, hand-written CSS design tokens, and **Framer Motion**. No CSS framework, no router, no backend.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run typecheck  # TypeScript only
npm run build      # typecheck + production build to dist/
npm run preview    # preview the production build
```

Node 20+ is recommended.

## Project structure

```
src/
  App.tsx                   page shell, nav, theme, section composition
  components/
    Hero.tsx                draggable-letter hero + physics playground
    AboutPanel.tsx          slide-in About panel
    StackedSection.tsx      pinned Education/Experience card stack
    ProjectsSection.tsx     data-driven project grid + media
    MediaFrame.tsx          browser-frame image/video with fallbacks
    Lightbox.tsx            keyboard/touch gallery (portalled to body)
    SkillsSection.tsx       grouped skill chips
    ContactSection.tsx      in-page contact card
    SlidePanel.tsx          accessible slide-over shell
    PhotoFrame.tsx          About photo slot with fallback
    Icons.tsx               inline SVG icons
  data/
    content.ts              About, journey, skills, contact copy
    projects.ts             the single source of truth for projects
  hooks/useActiveSection.ts IntersectionObserver nav highlighting
  lib/playground.ts         letter physics
  index.css                 theme tokens + all styles
public/
  fonts/                    self-hosted Bricolage Grotesque + DM Mono
  projects/<slug>/          project screenshots (+ -800.webp variants)
  about/photo.webp          optional portrait
  resume.pdf                resume download
  og-image.png              social preview (1200x630)
  robots.txt
```

All project content lives in `src/data/projects.ts`. Add, reorder, or edit projects there; the grid and lightbox update automatically. Sections are composed in `src/App.tsx`.

## Assets you must supply

The repo ships with clearly-labelled **placeholder** images, not fake screenshots. Replace them with real captures or screenshots of your own work. Do not use stock photos or AI-generated fake product shots.

| Path | Size | Notes |
| --- | --- | --- |
| `public/projects/lucent/cover.webp` | 1600×900 | Main Lucent screenshot, 16:9 |
| `public/projects/lucent/cover-800.webp` | 800×450 | Responsive variant used by the card |
| `public/projects/lucent/gallery-1.webp` … `gallery-3.webp` | 1200×800 | Up to 3 extra Lucent screens |
| `public/projects/lucent/gallery-*-800.webp` | 800×533 | Responsive variants for the lightbox |
| `public/projects/memento/cover.webp` + `cover-800.webp` | 1600×900 / 800×450 | Main Memento screenshot |
| `public/projects/memento/gallery-1.webp` … `gallery-2.webp` + `-800` | 1200×800 / 800×533 | Up to 2 extra Memento screens |
| `public/projects/java-treasure-game/cover.webp` + `cover-800.webp` | 1600×900 / 800×450 | Game screenshot |
| `public/about/photo.webp` | 900×1200 | Optional portrait, 3:4 |
| `public/resume.pdf` | — | Currently a one-page placeholder PDF |
| `public/og-image.png` | 1200×630 | Social preview; regenerate after final copy |

After replacing a screenshot, also replace its `-800.webp` variant (any image editor can export an 800px-wide WebP), then update its `alt` text in `src/data/projects.ts`. The card uses `srcSet`, so the browser picks the 800px or full-size file automatically. To add a short screen recording, set `video: { src: '/projects/<slug>/demo.webm', poster: '/projects/<slug>/cover.webp' }`; the video only plays while the card is in view and stays muted/looping.

## Placeholders to fill in

All of these are intentionally visible/marked in the code or UI:

- Lucent live URL — replace `ADD LIVE LINK` in `src/data/projects.ts`.
- Lucent public GitHub URL — replace `ADD GITHUB LINK if public`.
- Memento role — replace `[ADD MY ROLE]`.
- Memento measurable result — replace `[ADD ONE MEASURABLE RESULT]`.
- Resume — replace `public/resume.pdf` (the hero has a `Download resume` CTA).
- Social preview — before deploying, change `og:image` and `twitter:image` in `index.html` to the absolute URL of `og-image.png` on your domain (social crawlers prefer absolute URLs).
- Photo — replace `public/about/photo.webp` and update its alt text in `src/data/content.ts`.

Nothing else is invented: Lucent metrics come from the supplied EfficientNet-B3 result, and the Memento/Java sections use only the facts provided.

## Deploy

### Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Framework preset: **Vite**.
4. Build command: `npm run build`; output directory: `dist`.
5. Add your custom domain, then make the OG image URL absolute in `index.html`.

### Netlify

1. New site from Git.
2. Build command: `npm run build`; publish directory: `dist`.
3. Add your custom domain and update the OG image URL.

This is a single-page site with hash navigation, so no SPA rewrite rules are required.

## Accessibility & motion

- Semantic landmarks, a skip link, visible focus rings, descriptive alt text, labelled icon buttons, and `aria-current` nav state.
- The hero name is exposed to screen readers via `aria-label`; the decorative draggable letters are hidden from assistive tech.
- The gallery supports Escape, arrow keys, Tab trapping, and touch swipe, and restores focus to the trigger when closed.
- `prefers-reduced-motion` disables the letter float, hover transforms, skeletons, and scroll-driven card motion. In reduced mode the Education/Experience cards become a static list.
- Images use intrinsic `width`/`height`, lazy loading below the fold, and skeletons to avoid layout shift.

## Design notes

- Keep typography (Bricolage Grotesque + DM Mono), spacing, and color tokens consistent. All palette and motion values live in `:root` / `[data-theme='dark']` in `src/index.css`.
- The original personality is intentionally preserved: warm accent, gradient squiggle underline, draggable letters with “put letters back”, theme toggle, and the stacked-card feel. The contact panel was folded into the in-page contact card so the contact information exists in one place.
