import { App, MarkdownPostProcessorContext } from "obsidian";
import { replaceEmbed } from "./embeds";
import { LinkRangeSettings } from "./settings";
import { checkLink } from "./utils";


export function linkRangePostProcessor(app: App, el: HTMLElement, ctx: MarkdownPostProcessorContext, settings: LinkRangeSettings): void {
	const links = el.querySelectorAll('a.internal-link');

	// Handle links
	links.forEach(link => { 
		const htmlLink = link as HTMLElement
		const res = checkLink(app, htmlLink, settings);

		if (res !== null) {
			if (res.altText) {
				htmlLink.setText(res.altText)
			}
			const lineRef = (res.startLine + 1).toString(); // Convert back to 1-based for display
			htmlLink.setAttribute("href", res.note + ":" + lineRef);
			htmlLink.setAttribute("data-href", res.note + ":" + lineRef);
			if (res.endLine !== undefined) {
				const endLineRef = (res.endLine + 1).toString(); // Convert back to 1-based for display
				htmlLink.setAttribute("range-href", res.note + ":" + lineRef + settings.lineSeparator + endLineRef);
			} else {
				htmlLink.setAttribute("range-href", res.note + ":" + lineRef);
			}
		}
	});

	// Handle embeds
	const embeds = el.querySelectorAll('span.internal-embed');

	embeds.forEach(embed => {
		replaceEmbed(app, embed, settings, true)	
	});
}
