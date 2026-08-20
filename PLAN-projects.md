# Projects Page Build Plan

Route: `/projects` (grid) + `/projects/[slug]` (detail, already scoped in `PLAN.md`). Reuses the dark theme / blue accent tokens from `PLAN.md` §2.

Thumbnails are in: `ferrarii-thumbnail.jpg`, `spii-thumbnail.jpg`, `guitar-pedal-thumbnail.jpg`, `aware-thumbnail.jpg` - plus one more, `hackathons-thumbnail.png`, that isn't one of the 4 projects you described. Need a title/description/tags for that one before it can be added to §5 - let me know and I'll slot it in (5 items still lays out fine in the 2-column grid).

One heads up on the stagger: all 4 thumbnails you added are the same 4:3 landscape ratio, so with width-constrained cards the images themselves will come out roughly the same height - the column-first CSS layout will still work, but the "staggered" look will be subtle (driven mostly by description-length differences) rather than the dramatic Google-Images effect you get from mixed portrait/landscape photos. Not a blocker, just flagging so the result isn't a surprise. If you want a more pronounced stagger, mixing in a portrait-oriented thumbnail or two would do it.

## 1. Layout - staggered 2-column grid

CSS multi-column layout (`columns: 2`), not a JS masonry library - simplest way to get the Pinterest/Google-Images stagger with zero JS:

- Grid container: `columns: 2; column-gap: <space>;`
- Each card: `break-inside: avoid; margin-bottom: <space>; display: inline-block; width: 100%;`
- Thumbnail: `width: 100%; height: auto;` - constrained on width only, so taller/shorter source photos naturally produce the staggered effect.

One caveat vs. true Google Images: CSS columns fill **column-first** (top-to-bottom in column 1, then column 2) rather than **row-first** (left-to-right, wrapping) like Google Images actually does. With only 2 columns and 4 projects this is barely noticeable, and it costs zero JS - flagging it so you can say the word if you want strict row-major order instead (that would need a small JS masonry pass to compute row spans).

Mobile (< 768px): `columns: 1`.

## 2. Card anatomy

```
[ thumbnail image, full card width, natural height ]
Title (bold, --text)
Short description (1 line, --text-muted)
[ tag bubble ] [ tag bubble ] [ tag bubble ]   -- flex-wrap row
```

Whole card is a link to `/projects/[slug]`. Hover: same lift + subtle blue glow used on the homepage portrait, for consistency - `translateY(-6px)`, blurred glow behind, `transition: 200ms ease-out`.

## 3. Tag bubbles - color system

Each **tag name** maps to a fixed color, defined once in `src/lib/tagColors.ts`, so the same tag is always the same color everywhere it appears (e.g. "C++" is the same blue on both Ferrarii and Spii). Chip style: colored 1px border + ~15% opacity tint of that color as background, text in the color itself - reads as a set rather than clashing.

| Tag | Color |
|---|---|
| PCB Design | violet `#A78BFA` |
| Manufacturing | amber `#FBBF24` |
| CAD | teal `#2DD4BF` |
| C++ | blue `#60A5FA` (matches site accent) |
| Embedded Systems | cyan `#22D3EE` |
| Full Stack | pink `#F472B6` |
| Raspberry Pi | red `#F87171` |
| Computer Vision | green `#4ADE80` |
| Software | indigo `#818CF8` |
| Hackathon | orange `#FB923C` |
| Web Dev | lime `#A3E635` |

Adding a brand-new tag later = one new line in `tagColors.ts` (pick an unused hue); a fallback neutral-gray chip if a tag isn't in the map yet, so nothing breaks if you forget that step.

## 4. Content structure - copy/paste to add a project

Each project is one markdown file in `src/content/projects/`, frontmatter only (body reserved for the `/projects/[slug]` detail page content later):

```markdown
---
title: "Ferrarii"
thumbnail: "../../photos/project-thumbnails/ferrarii-thumbnail.jpg"
description: "RoboJackets' premier 3kg sumo robot - led development as bot lead."
tags: ["PCB Design", "Manufacturing", "CAD", "C++", "Embedded Systems", "Full Stack"]
---

<!-- detail page content goes here later -->
```

To add a new project: copy an existing `.md` file, rename it, edit the 4 frontmatter fields. No component code to touch - `/projects` and `/projects/[slug]` both read from this collection automatically.

## 5. The 5 projects (drafted from your notes)

**Ferrarii**
> RoboJackets' premier 3kg sumo robot, led development as bot lead.
Tags: PCB Design, Manufacturing, CAD, C++, Embedded Systems, Full Stack

**Spii**
> Solo-built 500g sumo robot, designed and built independently.
Tags: PCB Design, CAD, C++, Embedded Systems, Full Stack

**Guitar Pedal**
> Final project for Prototyping Intelligent Devices, a fully software-driven guitar pedal.
Tags: C++, Embedded Systems, Full Stack

**A-Ware**
> Capstone project using computer vision on Raspberry Pi hardware.
Tags: Raspberry Pi, Computer Vision, Software

**Hackathons**
> Software I have developed in hackathons, 2 wins secured so far.
Tags: Software, Hackathon, Web Dev

(Minor cleanup from your notes: "RoboJacket's" → "RoboJackets'", plural possessive, assuming that's the club name. Flag if I've got that wrong.)

## 6. Component breakdown

```
src/
  content/
    projects/
      config.ts             -- schema: title, thumbnail, description, tags[]
      ferrarii.md
      spii.md
      guitar-pedal.md
      a-ware.md
      hackathons.md
  components/
    projects/
      ProjectCard.astro     -- thumbnail + title + description + tag row, hover lift/glow, wraps <a>
      TagBubble.astro        -- single colored pill, color resolved from tagColors map
  lib/
    tagColors.ts             -- central tag name -> color map (+ fallback gray)
  photos/
    project-thumbnails/      -- all 5 thumbnails already in place
  pages/
    projects.astro            -- masonry grid, loops the collection, renders ProjectCard
    projects/[slug].astro     -- detail page (per PLAN.md §3/§4)
```

## 7. Build order

1. `tagColors.ts` with the 11 tags above + fallback.
2. `TagBubble.astro`.
3. Content collection schema + the 5 `.md` files (frontmatter only for now).
4. `ProjectCard.astro`: image, title, description, tag row, hover state.
5. `projects.astro`: CSS-columns grid, loop collection into `ProjectCard`s, mobile single-column breakpoint.
6. Confirm stagger looks right once real thumbnails are in `project-thumbnails/`.
7. `projects/[slug].astro` detail template (can start as a simple title + description + gallery placeholder, fleshed out later per project).

## 8. Still needed from you

- Confirm the 5 titles/descriptions/tags in §5 read right (Hackathons entry is new, worth a second look).
- Detail-page content (longer write-up, extra photos) for each project, whenever you're ready, not required to ship the grid itself.
