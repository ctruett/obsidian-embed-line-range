import { App, MarkdownRenderer, setIcon } from "obsidian";
import { LinkRangeSettings } from "./settings";
import { checkLink } from "./utils";

export async function replaceEmbed(app: App, embed: Node, settings: LinkRangeSettings, isMarkdownPost = false) {
	let embedHtml = embed as HTMLElement

	const res = checkLink(app, embedHtml, settings, true, "src");

	const isLinkRange = res !== null && res.endLine !== undefined;
	const file = res?.file
	if (isLinkRange && file !== undefined) {
		const { vault } = app;
		embedHtml.childNodes.forEach(x => {
			x.remove()
		})

		const linkRange = embedHtml.querySelectorAll("div.link-range-embed")

		linkRange.forEach(x => {
			x.remove()
		})

		if (isMarkdownPost) {
			// prevent default embed functionality for markdown post processor
			embedHtml.removeClasses(["internal-embed"])
			// create a child div under embedHtml to place content inside
			embedHtml = embedHtml.createDiv({
				cls: ["internal-embed", "markdown-embed", "inline-embed", "is-loaded", "link-range-embed"]
			})
		}

		embedHtml.setText("")

		embedHtml.createEl("h2", {
			text: res.altText
		})

		const linkDiv = embedHtml.createDiv({
			cls: ["markdown-embed-link"],
		});

		setIcon(linkDiv, 'link')

		linkDiv.onClickEvent((ev: MouseEvent) => {
			const leaf = app.workspace.getMostRecentLeaf();
			leaf?.openFile(file, {
				state: {
					scroll: res.startLine
				}
			});
		})

		const fileContent = await vault.cachedRead(file);

		let lines = fileContent.split("\n");
		
		// Extract lines based on the specified range
		const startIdx = Math.max(0, res.startLine);
		const endIdx = res.endLine !== undefined ? Math.min(lines.length, res.endLine + 1) : startIdx + 1;
		
		lines = lines.slice(startIdx, endIdx);

		const contentDiv = embedHtml.createDiv({
			cls: ["markdown-embed-content"]
		})

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		MarkdownRenderer.renderMarkdown(lines.join("\n"), contentDiv, "", null as any)
	}				
}
