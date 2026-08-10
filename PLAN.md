# Homepage Build Plan

References:
- `src/photos/style-reference.png` — dark panel, thin circular loop lines, cutout breaking the frame, bold sans headline. Adapting with blue loops instead of lime green.
- `src/photos/home-page-layout-reference.png` — rough composite: left third empty (text goes here), Ferrarii lower-middle, Xander (professional portrait) right side and largest, his feet cropped at the bottom edge.

**Orbit-of-3-projects idea from the earlier draft is scrapped.** Homepage is just Xander + Ferrarii + an intro text block.

## 1. Visual concept

- Full-bleed dark hero, 3 zones left to right:
  1. **Text** — "Hello, I'm Xander" headline + short description (and likely a CTA, e.g. "View my work" / scroll or link into Projects).
  2. **Ferrarii** — mid-ground, smaller than Xander, gently floating (idle bob animation, continuous — not just an on-load flourish).
  3. **Xander** — professional portrait, largest element, stationary, feet cropped at/below the viewport bottom edge like he's standing in the frame.
- Thin blue ring/loop lines behind both cutouts, some passing behind them (underlap) to visually tie the composition together.
- Load sequence: Xander floats up + fades in first (then stays put), Ferrarii floats up shortly after and then transitions into its continuous idle float/bob loop, loop lines draw in as the settling background layer, text fades/slides in with its own timing (first or last — see §6).
- Hover: same lift + subtle glow affordance on both Xander and Ferrarii, since both are clickable.
- Top nav (unchanged from before): home icon top-left · About · Projects · Skills · Experience · Education · Contact · social icons.

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
  Ferrarii cutout (z-index 10, mid column, idle float + hover)
  Portrait (z-index 10, right column, largest, bottom-anchored, stationary)
```

`About`, `Projects`, `Skills`, `Experience`, `Education`, `Contact` remain separate routed pages. Clicking Xander's portrait → `/about`. Clicking Ferrarii → its project detail page (`/projects/ferrarii`).

## 4. Component breakdown

```
src/
  components/
    Nav.astro
    LoopField.astro        -- SVG rings, drawn with stroke-dasharray animation
    IntroText.astro        -- "Hello, I'm Xander" + description
    Portrait.astro         -- Xander hero cutout, load + hover animation, stationary after load
    FloatingCutout.astro   -- reusable: Ferrarii now, reusable for future homepage elements
  content/
    projects/
      spii.md              -- exists in the collection for its /projects page even though it's off the homepage now
      ferrarii.md
  photos/                  -- existing cutout PNGs (already transparent, verified)
  pages/
    index.astro             -- assembles Nav + Hero (LoopField + IntroText + Ferrarii + Portrait)
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

## 5. Layout (desktop, based on the reference composite)

Three horizontal zones across the hero, roughly:

| Zone | Width | Content | Vertical anchor |
|---|---|---|---|
| Left | ~0–32vw | Intro text, vertically centered | center |
| Middle | ~32–62vw | Ferrarii, mid-size | lower-middle, floating — doesn't touch the bottom edge |
| Right | ~62–100vw | Xander portrait, largest | bottom-anchored, cropped at the hero's bottom edge |

Xander and Ferrarii sit close enough that Xander's shoulder slightly overlaps Ferrarii's front edge (Xander in front, higher z-index) — matches the reference composite rather than keeping them fully separated.

Mobile (< 768px): stack vertically — intro text on top, Ferrarii and Xander below at reduced scale (Xander still largest). Idle float animation on Ferrarii stays; orbit-specific concerns from the old plan no longer apply since there's nothing to collapse.

## 6. Animation spec

Load sequence, staggered `@keyframes float-up` (`opacity 0→1`, `translateY(40px)→0`):

| Element | Delay |
|---|---|
| Xander portrait | 0.0s |
| Intro text | 0.15s |
| Ferrarii | 0.3s |
| Loop lines | 0.4s, `stroke-dashoffset` draw-in over ~1.2s |

After Ferrarii's entrance finishes (~0.3s + entrance duration), it transitions into a **continuous idle float**: a slow `@keyframes bob` (`translateY(0) → translateY(-12px) → translateY(0)`, ease-in-out, ~4s loop, infinite) so it visibly hovers in place. Xander has no idle animation — stays put once he's landed.

Hover (Xander or Ferrarii independently):
- `transform: translateY(-10px)` layered on top of whatever animation is already running, `transition: transform 200ms ease-out`
- `::after` radial-gradient blur glow (`filter: blur(24px)`, `opacity 0→0.6`) behind the image
- `cursor: pointer`

For Ferrarii specifically, the hover lift needs to compose with the idle bob rather than fight it — simplest approach is a wrapper div doing the idle bob via `transform: translateY(...)` on the keyframe, and the hover lift applied as an additional `translateY` on an inner element (or via a CSS variable offset added into the same transform) so they don't clobber each other.

All CSS/SVG, no JS framework. Respect `prefers-reduced-motion`: keep the opacity fade, drop the translateY on load and drop the idle bob loop entirely.

## 7. Build order

1. `global.css` tokens, fonts, reset.
2. `Nav.astro` (static, no scroll behavior yet).
3. `LoopField.astro` — get the SVG rings looking right behind placeholder boxes first.
4. `Portrait.astro` — Xander: load animation + hover glow, bottom-cropped, stationary.
5. `FloatingCutout.astro` — Ferrarii: load animation + idle bob loop + hover glow that composes with the bob.
6. `IntroText.astro` — headline + description, load animation.
7. Assemble `index.astro`: three-zone layout, wire up real widths/positions against the reference image.
8. Content collection schema (`src/content/config.ts`) + `spii.md` / `ferrarii.md` so `/projects/ferrarii` resolves (SPII's page exists even though it's off the homepage).
9. Mobile stacked layout pass.
10. `prefers-reduced-motion` pass + accessibility (alt text, focus states, Xander/Ferrarii as keyboard-reachable links).

## 8. Assets/content still needed from you

- Headline/description copy for the intro text block — placeholder below, swap it for your own:

  > **Hello, I'm Xander.**
  > I'm an engineer and project manager who likes turning ideas into working machines. I build and compete with combat robots like Ferrarii, splitting my time between hands-on fabrication and the planning it takes to get a team-built robot to the competition floor on time. Outside of that I'm usually digging into code or whatever new problem has caught my attention.

- Blurb + gallery photos for the Ferrarii and SPII project pages.
- Copy for About / Skills / Experience / Education / Contact.
- Résumé file (PDF) if you want it downloadable from `/about`.
- Social links for the nav icons.

Note: you've also since added `competition-photo-*`, `experience-icon-*`, `projects-icons-reference.png`, and `competitions-icon-reference.png` to `src/photos/` — those look like they're for the Projects/Experience pages rather than the homepage, so they're out of scope for this doc. Happy to plan those pages next once the homepage is settled.
