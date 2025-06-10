# Obsidian Link Range

![Obsidian Link Range Logo](https://user-images.githubusercontent.com/23059902/225677761-c36b01a6-6194-4d83-a130-a1d7561b8359.png)

This plugin brings wiki-link line range queries to Obsidian while retaining native backlink functionality. Supports standard wiki-links or other user-defined patterns, hover preview, and embedded content wiki-links.

![demo](./docs/demo-2.gif)

## Usage
To use, simply use the same wiki-link syntax you're used to in obsidian, but instead of specifying a single line, you can specify a line range separated by a separator string.

For example, if I wanted a link to lines 10 through 25 in a note named "Recipe", I could craft a link like the following:

`[[Recipe:10..25]]`

For a single line:

`[[Recipe:15]]`

## Basic Settings

The default settings give you the functionality indicated above.

![default settings](./docs/default-settings.png)

## Advanced Settings Choices

If you prefer a different heading separator than the Wikilink syntax, you may change it.

Some will want to change the visual style of the heading separators. The 

![advanced settings](./docs/advanced-settings.png)
