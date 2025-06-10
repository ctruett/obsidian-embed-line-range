import { App, TFile } from "obsidian";
import { LinkRangeSettings } from "./settings";

export interface ParsedLink {
	note: string;
	startLine: number;
	endLine?: number;
	altText?: string;
	file?: TFile;
}

export function checkLinkText(href: string, settings: LinkRangeSettings): ParsedLink | null {
	// Only handle Bible references
	return parseBibleReference(href, settings);
}

export function parseBibleReference(href: string, settings: LinkRangeSettings): ParsedLink | null {
	// Parse Bible references like "I Peter 1:3-5" or "John 3:16"
	const bibleRegex = /^([^|]*?)\s+(\d+):(\d+)(?:-(\d+))?\|?(.*)?$/;
	const matches = bibleRegex.exec(href.trim());

	if (!matches) {
		return null;
	}

	const bookName = matches[1].trim();
	const chapter = parseInt(matches[2], 10);
	const startVerse = parseInt(matches[3], 10);
	const endVerse = matches[4] ? parseInt(matches[4], 10) : undefined;
	const customAltText = matches[5];

	// For Bible references, we need to determine which file contains this chapter
	// and then convert chapter:verse to line numbers within that file
	const chapterFileName = getBibleChapterFileName(bookName, chapter, settings);
	if (!chapterFileName) {
		return null;
	}

	// Convert verses to line numbers (assuming each verse is one line, starting from line 1)
	const startLine = startVerse - 1; // Convert to 0-based indexing
	const endLine = endVerse ? endVerse - 1 : undefined;

	const altText = customAltText || `${bookName} ${chapter}:${startVerse}${endVerse ? `-${endVerse}` : ''}`;

	return {
		note: chapterFileName,
		startLine,
		endLine,
		altText
	};
}

export function getBibleChapterFileName(bookName: string, chapter: number, settings: LinkRangeSettings): string | null {
	// Normalize the book name and try to find the corresponding chapter file
	const normalizedBookName = bookName.trim();
	
	// Handle common book name variations
	const bookAliases: { [key: string]: string } = {
		"1 Peter": "I Peter",
		"2 Peter": "II Peter", 
		"1 John": "I John",
		"2 John": "II John",
		"3 John": "III John",
		"1 Corinthians": "I Corinthians",
		"2 Corinthians": "II Corinthians",
		"1 Thessalonians": "I Thessalonians",
		"2 Thessalonians": "II Thessalonians",
		"1 Timothy": "I Timothy",
		"2 Timothy": "II Timothy",
		"1 Kings": "I Kings",
		"2 Kings": "II Kings",
		"1 Chronicles": "I Chronicles", 
		"2 Chronicles": "II Chronicles",
		"1 Samuel": "I Samuel",
		"2 Samuel": "II Samuel"
	};

	const canonicalName = bookAliases[normalizedBookName] || normalizedBookName;
	
	// For the folder structure with Bible folder containing book folders
	const bookIndex = getBibleBookIndex(canonicalName);
	if (bookIndex === null) {
		return null;
	}
	
	// Format: "Bible/60 I Peter/Chapter 01" (if Bible folder is specified)
	const chapterNum = chapter.toString().padStart(2, '0');
	const bookFolder = `${bookIndex} ${canonicalName}`;
	
	if (settings.bibleFolder) {
		return `${settings.bibleFolder}/${bookFolder}/Chapter ${chapterNum}`;
	} else {
		return `${bookFolder}/Chapter ${chapterNum}`;
	}
}

export function getBibleBookIndex(bookName: string): number | null {
	// Map of canonical book names to their traditional canonical order
	const bookIndexes: { [key: string]: number } = {
		"Genesis": 1, "Exodus": 2, "Leviticus": 3, "Numbers": 4, "Deuteronomy": 5,
		"Joshua": 6, "Judges": 7, "Ruth": 8, "I Samuel": 9, "II Samuel": 10,
		"I Kings": 11, "II Kings": 12, "I Chronicles": 13, "II Chronicles": 14,
		"Ezra": 15, "Nehemiah": 16, "Esther": 17, "Job": 18, "Psalms": 19,
		"Proverbs": 20, "Ecclesiastes": 21, "Song of Solomon": 22, "Isaiah": 23,
		"Jeremiah": 24, "Lamentations": 25, "Ezekiel": 26, "Daniel": 27,
		"Hosea": 28, "Joel": 29, "Amos": 30, "Obadiah": 31, "Jonah": 32,
		"Micah": 33, "Nahum": 34, "Habakkuk": 35, "Zephaniah": 36, "Haggai": 37,
		"Zechariah": 38, "Malachi": 39, "Matthew": 40, "Mark": 41, "Luke": 42,
		"John": 43, "Acts": 44, "Romans": 45, "I Corinthians": 46, "II Corinthians": 47,
		"Galatians": 48, "Ephesians": 49, "Philippians": 50, "Colossians": 51,
		"I Thessalonians": 52, "II Thessalonians": 53, "I Timothy": 54, "II Timothy": 55,
		"Titus": 56, "Philemon": 57, "Hebrews": 58, "James": 59, "I Peter": 60,
		"II Peter": 61, "I John": 62, "II John": 63, "III John": 64, "Jude": 65,
		"Revelation": 66
	};

	return bookIndexes[bookName] || null;
}

export function checkLink(app: App, linkHTML: HTMLElement, settings: LinkRangeSettings, isEmbed=false, hrefField = "data-href"): ParsedLink | null {
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

	// All references are now Bible references
	const file = findBibleChapterFile(app, res.note, settings);
	if (!file) {
		return null;
	}
	res.file = file;
	
	// For Bible references, verses are already 0-based indexed from parsing
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

export function findBibleChapterFile(app: App, chapterFileName: string, settings: LinkRangeSettings): TFile | null {
	// Look for the chapter file in the vault
	const files = app.vault.getMarkdownFiles();
	
	// Try to find exact match first
	let file = files.find(f => f.path === chapterFileName + ".md");
	if (file) return file;
	
	// Try to find by basename
	file = files.find(f => f.basename === chapterFileName);
	if (file) return file;
	
	// Try to find within folders (for nested structure)
	file = files.find(f => f.path.endsWith(chapterFileName + ".md"));
	if (file) return file;
	
	return null;
}


