# About Page Build Plan

Route: `/about` (linked from the homepage portrait and the nav bar). Reuses the dark theme / blue accent tokens from `PLAN.md` §2 — no new palette.

## 1. Layout

Two-column section under the nav bar:

| Column | Width | Content |
|---|---|---|
| Left | ~55–60% | Heading + 4 bio paragraphs, resume download button, date line |
| Right | ~40–45% | Photo carousel, 2:3 framed, blue border |

Both columns top-aligned, roughly centered as a block in the viewport (not full-bleed like the homepage hero — this page can scroll normally if content runs long on smaller screens).

Mobile (< 768px): stack — carousel first (or text first, your call, defaulting to text-then-photo since the bio is the primary content) then bio text below, full width.

## 2. Bio text

Using your draft with light copyedits only — typos and a couple of grammar snags (comma splice, hyphenation, article agreement). No content, facts, or tone changes. Flagging each fix below so you can sanity-check before I lock it in:

- "self proclaimed full stack" → "self-proclaimed full-stack" (hyphenate compound adjectives)
- "by my interests 3 come to mind" → "by my interests, 3 come to mind" (missing comma)
- "UGA and Georgia Tech marching band" → "marching bands" (plural, since it's two bands)
- "just like to Jam" → "just like to jam" (stray capital)
- "This past year for me was very interesting, I started it off strong" → "...interesting — I started it off strong" (comma splice fixed with an em dash)
- "2 teaching assistent jobs" → "2 teaching assistant jobs" (typo)
- "Speaking of hardware over the past year" → "Speaking of hardware, over the past year" (missing comma)
- "Finally this Summer I worked" → "Finally, this summer I worked" (missing comma, lowercase season)
- "fast paced and individual development environment" → "fast-paced and individual development environment" (hyphenate)
- "that startup might be more achiveable than what I previously thought" → "that a startup might be more achievable than I previously thought" (typo + article + wording)

Final text:

> **Hello, my name is Xander Riddle.**
>
> I'm a 5th year computer science student at Georgia Tech, and a self-proclaimed full-stack robotics engineer. If I were to describe myself by my interests, 3 come to mind: robotics, music and video games. I spend most of my free time building robots, usually for competition, but not exclusively. I also really enjoy leading the RoboWrestling team at Georgia Tech; leadership is very fulfilling. Music has also been a very big part of my life for a long time. I have marched across the country in both the UGA and Georgia Tech marching bands, and have participated in a number of ensembles, but these days I just like to jam with my friends back home. And a good game that I played recently was Silk Song.
>
> This past year for me was very interesting. I started it off strong with getting promoted to Project Manager of the RoboWrestling team, where I was able to accomplish my primary goals of increasing the quality of bots and the number of competitions we competed at by taking my team to both Japan and Brazil, and winning 4th place in 2 categories in Brazil. I also completed a lot of my intelligence course work, finally filling in a lot of the knowledge gaps when it comes to artificial intelligence development, and I picked up 2 teaching assistant jobs, both for hardware. Speaking of hardware, over the past year I have really honed my CAD skills, adding Onshape to my repertoire of maker skills. Finally, this summer I worked at a startup called Kovari, where I really got acclimated to the fast-paced and individual development environment, and it showed me that a startup might be more achievable than I previously thought.
>
> I'm really looking forward to my 5th year of school, and excited for what the future has in store for me.

Below the text block: a **"Download Résumé"** button/link (styled to match the site's blue accent — filled pill or outlined, matching the theme), then the date line.

**Date placement:** defaulting to right under the paragraphs, right-aligned, small muted text — "Written August 11, 2026" — since it's easy to spot without hunting the page corner, and stays attached to the content it timestamps. Say the word if you'd rather it live pinned in the bottom-right of the viewport instead.

## 3. Photo carousel

Assets found in `src/photos/about-me-photos/` — all already ~2:3 (portrait) ratio, no cropping needed:
- `Casual-self-portrait.jpg`
- `Photo-posing-with-robot.jpg`
- `photo-with-sax.jpg`

Frame: fixed 2:3 box, `border: 3px solid var(--blue)`, rounded corners, subtle `box-shadow` glow in blue to match the loop-line theme. Left/right arrow buttons anchored just outside (or overlaid on) the frame edges, circular, semi-transparent dark background with a blue icon.

**Transition (per your spec):** three stacked slides, only one interactive/visible at a time:
- Incoming slide: starts `opacity: 0`, `translateX(-40px)` (off to the left) → animates to `opacity: 1`, `translateX(0)` — fades in from the left into the foreground.
- Outgoing slide: `opacity: 1`, `translateX(0)` → `opacity: 0`, `translateX(40px)` — fades out to the right.
- Both run concurrently (crossfade + slide), ~500–600ms ease.

**Behavior:**
- Autoplay every 5s, advancing forward through the 3 photos, looping back to the first.
- Arrow click jumps immediately (same transition) and resets the 5s autoplay timer so it doesn't fight a manual click right after.
- Pause autoplay on hover/focus of the carousel, resume on mouse leave/blur.
- `prefers-reduced-motion`: drop the translateX slide, keep a plain opacity crossfade; autoplay still runs.

**Accessibility:** carousel region gets `aria-roledescription="carousel"`, only the active slide is exposed to screen readers (others `aria-hidden="true"`), each `<img>` has real alt text, arrow buttons are `<button>` elements with `aria-label="Previous photo"` / `"Next photo"`, and left/right arrow keys work when the carousel has focus.

This is the first component in the site that needs actual JS (small vanilla script — index state, `setInterval`, click/hover handlers). Everything before this has been pure CSS/SVG.

## 4. Component breakdown

```
src/
  components/
    about/
      BioText.astro       -- heading, 4 paragraphs, resume button, date
      PhotoCarousel.astro  -- framed carousel, arrows, autoplay, transition, a11y
  pages/
    about.astro             -- Nav + two-column layout (BioText | PhotoCarousel)
  photos/
    about-me-photos/        -- existing, already right-sized
public/
  resume.pdf                -- needed, not yet provided (see below)
```

## 5. Build order

1. `about.astro` scaffold: Nav + two-column grid, placeholder blocks.
2. `BioText.astro`: real copy from §2, resume button, date line.
3. `PhotoCarousel.astro`: static 3-slide frame + blue border first (no motion), confirm sizing/cropping looks right.
4. Wire up JS: index state, arrow click handlers, autoplay timer, pause-on-hover.
5. Add the enter-from-left/exit-to-right transition.
6. `prefers-reduced-motion` + accessibility pass (aria attributes, keyboard arrows, alt text).
7. Mobile stacked layout pass.

## 6. Still needed from you

- **Résumé PDF** — no file yet; drop it in and I'll wire up the download button (defaulting to `/resume.pdf`).
- Confirm the copyedits in §2 read fine, or flag any you want reverted.
- Confirm date placement (under paragraphs vs. bottom-right of viewport) — defaulting to under paragraphs per §2.
