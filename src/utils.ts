import { App, TFile } from "obsidian";
import { LinkRangeSettings, Pattern } from "./settings";
import * as path from 'path';

export interface ParsedLink {
	note: string;
	startLine: number;
	endLine?: number;
	altText?: string;
	file?: TFile;
}

export function checkLinkText(href: string, settings: LinkRangeSettings): ParsedLink | null {
	const linkRegex = /([^:|]*):\s*([^:|]*)?\|?(.*)?/;

	const matches = linkRegex.exec(href);

	if (matches == null || matches?.length < 3 || matches[2] == undefined) {
		return null;
	}

	const lineRange = matches[2];
	const split = lineRange.split(settings.lineSeparator);

	const note = matches[1];
	
	// Parse line numbers - just parse the number directly
	const parseLineNumber = (str: string): number | null => {
		const trimmed = str.trim();
		const num = parseInt(trimmed, 10);
		return isNaN(num) ? null : num;
	};

	const startLine = parseLineNumber(split[0]);
	const endLineParsed = split[1] ? parseLineNumber(split[1]) : null;

	if (startLine === null || (split[1] && endLineParsed === null)) {
		return null;
	}

	const endLine = endLineParsed === null ? undefined : endLineParsed;

	let altText = undefined;

	if (matches?.length > 3 && matches[3] != undefined) {
		altText = matches[3]
	}
	else {
		const pattern = findPatternForFile(note, settings);
		const baseNote = path.basename(note)
		const lineVisual = pattern.lineVisual === '' ? ':' : pattern.lineVisual;
		const lineSeparatorVisual = pattern.lineSeparatorVisual === '' ? settings.lineSeparator : pattern.lineSeparatorVisual;

		if (endLine !== undefined) {
			altText = `${baseNote}${lineVisual}${startLine}${lineSeparatorVisual}${endLine}`
		}
		else {
			altText = `${baseNote}${lineVisual}${startLine}`
		}
	}
	return { note, startLine, endLine, altText }
}

export function checkLink(app :App, linkHTML: HTMLElement, settings: LinkRangeSettings, isEmbed=false, hrefField = "data-href"): ParsedLink | null {
	const href = linkHTML.getAttribute(hrefField);

	if (href == null) {
		return null;
	}

	const res = checkLinkText(href, settings)

	const alt = linkHTML.getAttribute("alt")

	if (!res) {
		return null;
	}

	// non-standard alt text, must be user provided via "|"
	if (alt != null && !alt.includes(res.note)) {
		res.altText = alt
	}

	if (!isEmbed && !linkHTML.innerText.includes(res.note)) {
		res.altText = linkHTML.innerText
	}

	// Locate the referenced file, including partial paths
	const partialPath = res.note + ".md"
	const basePart = path.basename(res.note)
	const file : TFile | undefined = app.vault.getMarkdownFiles().filter(
		(x: TFile) => x.basename == basePart && x.path.endsWith(partialPath)
	).first()

	if (!file) {
		return null
	}
	
	res.file = file

	// Line numbers are already parsed and ready to use
	// Convert from 1-based to 0-based indexing for internal use
	res.startLine = res.startLine - 1;
	if (res.endLine !== undefined) {
		if (settings.endInclusive) {
			// Keep end line as-is for inclusive range
		} else {
			// Subtract 1 for exclusive range
			res.endLine = res.endLine - 1;
		}
		// Convert to 0-based indexing
		res.endLine = res.endLine - 1;
	}

	return res;
}

export function postProcessorUpdate(app: App) {
	for (const leaf of app.workspace.getLeavesOfType('markdown')) {
		// Actually of type MarkdownView, but casting to any because the TS types don't have previewMode.renderer or editor.cm... 
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const view = leaf.view as any;

		view.previewMode.renderer.clear();
		view.previewMode.renderer.set(view.editor.cm.state.doc.toString());
	}

	app.workspace.updateOptions();
}

export function findPatternForFile(fileName: string, settings: LinkRangeSettings) : Pattern {
	let pattern = [...settings.patterns].reverse().find((pattern: Pattern) => fileName.startsWith(pattern.path))
	if (!pattern) {
		pattern = settings.getDefaultPattern();
	}

	return pattern;
}
