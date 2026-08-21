import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Projects collection — PLAN-projects.md §4/§6. The plan sketched this as
// src/content/projects/config.ts; Astro 7 reads collection config from this
// single root file instead, so all collections are declared here.
//
// `tags` is a plain string array rather than an enum: PLAN-projects.md §3 wants
// an unknown tag to fall back to a grey chip, not fail the build.
const projects = defineCollection({
	loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			thumbnail: image(),
			description: z.string(),
			tags: z.array(z.string()),
			// Display position on /projects, low to high. Without it the grid
			// falls back to alphabetical file order, which buries Ferrarii.
			order: z.number(),
		}),
});

export const collections = { projects };
