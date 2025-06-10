import { App, MarkdownPostProcessorContext } from "obsidian";
import { replaceEmbed } from "./embeds";
import { LinkRangeSettings } from "./settings";
import { checkLink } from "./utils";


export function linkRangePostProcessor(app: App, el: HTMLElement, ctx: MarkdownPostProcessorContext, settings: LinkRangeSettings): void {
	const links = el.querySelectorAll('a.internal-link');

	// Handle Bible reference links
	links.forEach(link => { 
		const htmlLink = link as HTMLElement
		const res = checkLink(app, htmlLink, settings);

		if (res !== null) {
			if (res.altText) {
				htmlLink.setText(res.altText)
			}
			// For Bible references, keep the original format in href
			htmlLink.setAttribute("href", res.note);
			htmlLink.setAttribute("data-href", res.note);
			htmlLink.setAttribute("range-href", res.note);
		}
	});

	// Handle embeds
	const embeds = el.querySelectorAll('span.internal-embed');

	embeds.forEach(embed => {
		replaceEmbed(app, embed, settings, true)	
	});
}
