// Central tag -> colour map — PLAN-projects.md §3. One entry per tag name so
// the same tag reads identically on every card it appears on. Adding a tag =
// one new line here with an unused hue; anything missing falls back to the
// neutral grey below rather than breaking the card.

export const TAG_COLORS: Record<string, string> = {
	"PCB Design": "#A78BFA", // violet
	Manufacturing: "#FBBF24", // amber
	CAD: "#2DD4BF", // teal
	"C++": "#60A5FA", // blue — matches the site accent
	"Embedded Systems": "#22D3EE", // cyan
	"Full Stack": "#F472B6", // pink
	"Raspberry Pi": "#F87171", // red
	"Computer Vision": "#4ADE80", // green
	Software: "#818CF8", // indigo
	Hackathon: "#FB923C", // orange
	"Web Dev": "#A3E635", // lime
};

export const FALLBACK_TAG_COLOR = "#8A94A6"; // --text-muted

export function tagColor(tag: string): string {
	return TAG_COLORS[tag] ?? FALLBACK_TAG_COLOR;
}
