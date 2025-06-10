# Migration Guide: Header Ranges to Line Ranges

This document outlines the major changes made to convert the Obsidian Embed Line Range plugin from header-based ranges to line-based ranges.

## Overview

The plugin has been fundamentally changed from targeting header ranges (e.g., `[[Note#Header1..Header2]]`) to line number ranges (e.g., `[[Note#L10..L25]]`). This provides more precise control over which content is included in links and embeds.

## Breaking Changes

### Link Syntax Changes

**Before (Header-based):**
```
[[Recipe#Ingredients..Directions]]
[[Recipe#Introduction..Conclusion]]
```

**After (Line-based):**
```
[[Recipe:10..25]]     // Line range
[[Recipe:15]]         // Single line
```

### Settings Changes

The settings interface has been updated to reflect line-based terminology:

- `headingSeparator` → `lineSeparator`
- `headingVisual` → `lineVisual` 
- `headingSeparatorVisual` → `lineSeparatorVisual`
- Settings version bumped to `v3`

### Default Settings

**Before:**
- Default heading visual: `..`
- Default separator visual: `-`

**After:**
- Default line visual: `:`
- Default separator visual: `-`
- Line separator: `..`

## Technical Changes

### Core Functionality

1. **ParsedLink Interface:**
   - Removed: `h1`, `h2`, `h1Line`, `h2Line`
   - Added: `startLine`, `endLine`

2. **Line Number Parsing:**
   - Uses simple numeric format (e.g., `10`, `25`)
   - Converts to 0-based indexing internally
   - Handles inclusive/exclusive end ranges

3. **Content Extraction:**
   - Direct line-based slicing instead of header lookup
   - No dependency on Obsidian's metadata cache for headers
   - More reliable and faster content extraction

### File Changes

- `src/utils.ts`: Complete rewrite of parsing logic
- `src/settings.ts`: Updated terminology and defaults
- `src/embeds.ts`: Direct line extraction
- `src/markdownPostProcessor.ts`: Line-based href generation
- `src/livePreviewDisplayView.ts`: Updated visual overrides
- `main.ts`: Updated scroll positioning
- `README.md`: Updated documentation and examples
- `manifest.json`: Updated description and version

## Migration Steps for Users

1. **Update Links:** Convert existing header-based links to line-based links
   - Identify the line numbers where your target headers are located
   - Replace `[[Note#Header1..Header2]]` with `[[Note:10..25]]`

2. **Settings Migration:** 
   - The plugin will attempt to migrate v1 settings automatically
   - Review and update visual patterns if customized

3. **Test Functionality:**
   - Verify that embedded content displays correctly
   - Check that hover previews work with new line references
   - Confirm that backlinks still function properly

## Advantages of Line-based Ranges

1. **Precision:** Exact control over which lines are included
2. **Performance:** No need to parse headers from metadata cache
3. **Reliability:** Works regardless of header structure
4. **Flexibility:** Can target any content, not just header-delimited sections
5. **Consistency:** Line numbers are stable references

## Compatibility Notes

- **Breaking Change:** Existing header-based links will no longer work
- **Obsidian Version:** Requires Obsidian 0.15.0+
- **File Format:** Works with all markdown files
- **Backlinks:** Native backlink functionality is preserved

## Example Usage

### Basic Line Range
```
![[My Note:5..15]]
```
Embeds lines 5 through 15 from "My Note".

### Single Line
```
[[Code Example:42]]
```
Links to line 42 in "Code Example".

### With Custom Display Text
```
[[Recipe:10..25|Recipe Steps]]
```
Links to lines 10-25 with custom display text.

## Support

If you encounter issues during migration:
1. Check that line numbers are valid (positive integers)
2. Verify file paths are correct
3. Ensure the target file exists
4. Review settings for correct separator configuration

For technical issues, please refer to the plugin's issue tracker or documentation.