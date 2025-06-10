# Obsidian Embed Line Range

![Obsidian Link Range Logo](https://user-images.githubusercontent.com/23059902/225677761-c36b01a6-6194-4d83-a130-a1d7561b8359.png)

This plugin brings wiki-link line range queries to Obsidian while retaining native backlink functionality. Supports standard wiki-links, Bible references, or other user-defined patterns, hover preview, and embedded content wiki-links.

![demo](./docs/demo-2.gif)

## Usage

### Line Range Links
To use, simply use the same wiki-link syntax you're used to in obsidian, but instead of specifying a single line, you can specify a line range separated by a separator string.

For example, if I wanted a link to lines 10 through 25 in a note named "Recipe", I could craft a link like the following:

`[[Recipe:10..25]]`

For a single line:

`[[Recipe:15]]`

### Bible References
When Bible references are enabled, you can use natural Bible citation syntax:

`![[I Peter 1:3-5]]` - Embeds verses 3-5 from I Peter chapter 1
`[[John 3:16]]` - Links to John 3:16
`[[II Corinthians 5:17-21|New Creation]]` - Links with custom display text

This works with folder structures like:
```
60 I Peter.md/
├── Chapter 01.md
├── Chapter 02.md
└── ...
```

Where the numeric prefix (60) represents the canonical book order.

## Basic Settings

The default settings give you the functionality indicated above.

![default settings](./docs/default-settings.png)

### Bible Reference Settings

- **Enable Bible References**: Allows parsing of Bible citations like "I Peter 1:3-5"
- **Use Numeric Bible Book Prefixes**: Automatically handles files with canonical book numbers (e.g., "60 I Peter.md")

## Advanced Settings Choices

If you prefer a different line separator than the default syntax, you may change it.

Some will want to change the visual style of the line separators and prefixes.

![advanced settings](./docs/advanced-settings.png)
