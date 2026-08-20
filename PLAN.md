# Homepage Build Plan (v2)

References:
- `src/photos/style-reference.png` - dark panel, thin circular loop lines, cutout breaking the frame, bold sans headline. Adapting with blue loops instead of lime green.
- `src/photos/home-page-layout-reference.png` - original composite (v1 layout idea); superseded below now that Ferrarii is off the homepage.

**v2 change: Ferrarii is dropped from the homepage.** Homepage is now just Xander's portrait + the intro text block. Ferrarii still gets its own project page (`/projects/ferrarii`), it's just no longer part of the hero scene - spacing below is rebalanced for two zones instead of three.

## 1. Visual concept

- Full-bleed dark hero, 2 zones left to right:
  1. **Text** - "Hello, I'm Xander" headline + short description. Gets more breathing room now that it isn't sharing the scene with a third element.
  2. **Xander** - professional portrait, the only visual anchor, larger/more prominent than in v1, stationary, feet cropped at/below the viewport bottom edge like he's standing in the frame.
- Thin blue ring/loop lines behind the portrait, some passing behind it (underlap) to fill the negative space Ferrarii used to occupy.
- Load sequence: portrait floats up + fades in first, text follows shortly after, loop lines draw in as the settling background layer.
- Hover: lift + subtle glow on the portrait (still clickable → `/about`).
- Top nav (unchanged): home icon top-left · About · Projects · Skills · Experience · Education · Contact · social icons.

## 2. Color & type

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0B0E14` | page background |
| `--bg-panel` | `#11151D` | nav bar / subtle panel fills |
| `--blue` | `#4DA8FF` | loop lines, hover glow, accent text |
| `--blue-dim` | `#2C4870` | secondary/low-opacity loop lines |
| `--text` | `#F2F5F9` | headings, name |
| `--text-muted` | `#8A94A6` | nav links, captions, description copy |

Fonts: geometric/modern sans for headings (e.g. Space Grotesk) + clean body sans (e.g. Inter), via Fontsource (no runtime external request).

## 3. Page structure

```
Nav (fixed, transparent → bg-panel on scroll)
  [home icon]      About  Projects  Skills  Experience  Education  Contact      [social icons]

Hero (min-height: 100svh, overflow: hidden on this section only)
  LoopField (SVG, absolutely positioned, z-index 0)
  IntroText (z-index 10, left column)
  Portrait (z-index 10, right column, largest, bottom-anchored, stationary)
```

`About`, `Projects`, `Skills`, `Experience`, `Education`, `Contact` remain separate routed pages. Clicking Xander's portrait → `/about`.

## 4. Component breakdown

```
src/
  components/
    Nav.astro
    LoopField.astro        -- SVG rings, drawn with stroke-dasharray animation
    IntroText.astro        -- "Hello, I'm Xander" + description
    Portrait.astro         -- Xander hero cutout, load + hover animation, stationary after load
  content/
    projects/
      spii.md              -- own /projects page, not on homepage
      ferrarii.md           -- own /projects page, not on homepage (dropped from hero in v2)
  photos/                  -- existing cutout PNGs (already transparent, verified)
  pages/
    index.astro             -- assembles Nav + Hero (LoopField + IntroText + Portrait)
    about.astro
    projects.astro
    skills.astro
    experience.astro
    education.astro
    contact.astro
    projects/[slug].astro   -- detail page, getStaticPaths from content collection
  styles/
    global.css              -- tokens above, resets, fonts
```

`FloatingCutout.astro` from v1 is dropped - no longer needed on the homepage. Keep it in mind as a reusable pattern if a future page wants a floating element, but don't build it speculatively.

## 5. Layout (desktop) - v2 spacing

Two horizontal zones across the hero:

| Zone | Width | Content | Vertical anchor |
|---|---|---|---|
| Left | ~0–40vw | Intro text, vertically centered | center |
| Right | ~40–100vw | Xander portrait, larger than v1 (more room to fill without Ferrarii) | bottom-anchored, cropped at the hero's bottom edge |

Portrait sizing: bump up from v1's ~55–60vh to roughly **65–72vh**, and center it within the right zone (not pinned to the far edge) so the loop lines have room to show around both sides of him rather than just underlapping one shoulder.

Text column: since it now owns ~40vw instead of ~32vw, the paragraph can run a bit wider per line before wrapping - keep line length reasonable (~50–65 characters) rather than stretching it edge-to-edge; cap the text block's max-width inside that zone rather than filling all 40vw.

Mobile (< 768px): stack vertically - intro text on top, portrait below, centered, at reduced scale.

## 6. Animation spec

Load sequence, staggered `@keyframes float-up` (`opacity 0→1`, `translateY(40px)→0`):

| Element | Delay |
|---|---|
| Xander portrait | 0.0s |
| Intro text | 0.2s |
| Loop lines | 0.4s, `stroke-dashoffset` draw-in over ~1.2s |

Portrait has no idle animation - stays put once landed (no more bob loop to worry about now that Ferrarii's gone, simplifies this section a lot from v1).

Hover (portrait only):
- `transform: translateY(-10px)`, `transition: transform 200ms ease-out`
- `::after` radial-gradient blur glow (`filter: blur(24px)`, `opacity 0→0.6`) behind the image
- `cursor: pointer`

All CSS/SVG, no JS framework. Respect `prefers-reduced-motion`: keep the opacity fade, drop the translateY on load.

## 7. Build order

1. `global.css` tokens, fonts, reset.
2. `Nav.astro` (static, no scroll behavior yet).
3. `LoopField.astro` - get the SVG rings looking right behind a placeholder box, filling the space around the portrait now that it's the sole element.
4. `Portrait.astro` - load animation + hover glow, bottom-cropped, stationary, sized per §5.
5. `IntroText.astro` - headline + description, load animation, capped line length.
6. Assemble `index.astro`: two-zone layout per §5.
7. Content collection schema (`src/content/config.ts`) + `spii.md` / `ferrarii.md` so their `/projects/*` pages resolve, even though neither appears on the homepage now.
8. Mobile stacked layout pass.
9. `prefers-reduced-motion` pass + accessibility (alt text, focus state, portrait as a keyboard-reachable link).

## 8. Content

Intro text placeholder (yours to edit):

> **Hello, I'm Xander.**
> I'm an engineer and project manager who likes turning ideas into working machines. I build and compete with combat robots like Ferrarii, splitting my time between hands-on fabrication and the planning it takes to get a team-built robot to the competition floor on time. Outside of that I'm usually digging into code or whatever new problem has caught my attention.

## 9. Assets/content still needed from you

- Blurb + gallery photos for the Ferrarii and SPII project pages (still needed even though they're off the homepage).
- Copy for About / Skills / Experience / Education / Contact.
- Résumé file (PDF) if you want it downloadable from `/about`.
- Social links for the nav icons.

Note: `competition-photo-*`, `experience-icon-*`, `projects-icons-reference.png`, and `competitions-icon-reference.png` in `src/photos/` look like they're for the Projects/Experience pages rather than the homepage - out of scope for this doc. Happy to plan those pages next once the homepage is settled.
