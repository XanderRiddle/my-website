// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
	// MDX lets project write-ups (e.g. content/projects/ferrarii.mdx) embed
	// Astro components — photo galleries, video players — inline with the
	// prose, instead of the plain-.md loader's HTML-only output.
	integrations: [mdx()],
});
