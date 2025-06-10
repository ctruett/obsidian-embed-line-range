# Bible Verse Embedder

![Bible Verse Embedder Logo](https://user-images.githubusercontent.com/23059902/225677761-c36b01a6-6194-4d83-a130-a1d7561b8359.png)

This plugin allows you to embed Bible verses and passages in your Obsidian notes using natural citation syntax. Simply write `![[John 3:16]]` or `![[I Peter 1:3-5]]` to embed verses directly into your notes.

## Credits

This plugin is based on the original [Obsidian Link Range](https://github.com/rmellmer/obsidian-link-range) plugin by [Ryan Mellmer](https://github.com/rmellmer) and [Eric Sowell](https://github.com/ericsowell). 

**Original Authors**: Ryan Mellmer and Eric Sowell  
**Current Maintainer**: [ctruett](https://github.com/ctruett)

### Major Changes in This Fork
- Simplified to focus exclusively on Bible verse embedding
- Added natural Bible citation syntax (e.g., `![[I Peter 1:3-5]]`)
- Removed general line range functionality to streamline for Bible study
- Added support for all 66 biblical books with canonical numbering

![demo](./docs/demo-2.gif)

## Usage

### Bible References
Use natural Bible citation syntax to embed verses and passages:

**Single Verse:**
`![[John 3:16]]` - Embeds John 3:16
`[[Romans 8:28]]` - Links to Romans 8:28

**Verse Range:**
`![[I Peter 1:3-5]]` - Embeds verses 3-5 from I Peter chapter 1
`[[Ephesians 2:8-10]]` - Links to Ephesians 2:8-10

**With Custom Display Text:**
`[[John 3:16|God's Love]]` - Links with custom display text
`![[Romans 8:28-30|The Golden Chain]]` - Embeds with custom title

### Required Folder Structure
Your Bible files should be organized like this:
```
Bible/
├── 60 I Peter/
│   ├── Chapter 01.md
│   ├── Chapter 02.md
│   └── ...
├── 43 John/
│   ├── Chapter 01.md
│   ├── Chapter 02.md
│   └── ...
└── ...
```

Where:
- The numeric prefix (60, 43, etc.) represents the canonical book order
- Each verse should be on its own line in the chapter files
- Verse 1 = Line 1, Verse 2 = Line 2, etc.

## Settings

Only one setting is required:

- **Bible Folder Path**: Path to the folder containing your Bible books and chapters (e.g., "Bible")

The plugin automatically handles:
- All 66 biblical books with canonical numbering
- Book name variations (1 Peter → I Peter, etc.)
- Single verses and verse ranges
- Custom display text

## Supported Books

The plugin recognizes all 66 biblical books:
- **Old Testament** (1-39): Genesis through Malachi
- **New Testament** (40-66): Matthew through Revelation

Common abbreviations are automatically converted:
- `1 Peter` → `I Peter`
- `2 Corinthians` → `II Corinthians`
- And similar patterns for other numbered books
