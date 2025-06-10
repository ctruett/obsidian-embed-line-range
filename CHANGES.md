# Changes Summary: Header Ranges to Line Ranges

This document summarizes all the changes made to convert the Obsidian Link Range plugin from header-based ranges to line-based ranges with colon separator.

## Major Changes

### 1. Link Syntax Transformation

**Old Format:**
```
[[Recipe#Ingredients..Directions]]
[[Note#Header1..Header2]]
```

**New Format:**
```
[[Recipe:10..25]]
[[Note:5..15]]
[[Recipe:20]]     // Single line
```

### 2. Separator Change

- Changed from `#` to `:` as the primary separator between note name and line reference
- Maintained `..` as the range separator between line numbers
- Removed all `L` prefix requirements - now uses plain numbers

### 3. Core Functionality Updates

#### Parsing Logic (`src/utils.ts`)
- Updated regex from `/([^#|]*)#?([^#|]*)?\|?(.*)?/` to `/([^:|]*):\s*([^:|]*)?\|?(.*)?/`
- Simplified line number parsing to use `parseInt()` directly
- Removed header metadata cache dependencies
- Direct 0-based/1-based index conversion for internal processing

#### Content Extraction (`src/embeds.ts`)
- Direct line slicing instead of header position lookups
- Uses `lines.slice(startIdx, endIdx)` for content extraction
- No dependency on Obsidian's heading metadata

#### Settings (`src/settings.ts`)
- Renamed `headingSeparator` → `lineSeparator`
- Renamed `headingVisual` → `lineVisual`
- Renamed `headingSeparatorVisual` → `lineSeparatorVisual`
- Updated default `lineVisual` from `#L` to `:`
- Updated settings descriptions and examples

### 4. User Interface Updates

#### Settings Panel
- Updated field labels and descriptions
- Changed example from `[[Note Name:L10..L25]]` to `[[Note Name:10..25]]`
- Updated tooltips and help text

#### Live Preview (`src/livePreviewDisplayView.ts`)
- Changed detection from `linkText.indexOf('#')` to `linkText.indexOf(':')`
- Updated visual override system for new separator
- Fixed linting issues (const declarations, removed unnecessary semicolons)

### 5. Link Processing

#### Markdown Post Processor (`src/markdownPostProcessor.ts`)
- Updated href generation to use `:` separator
- Removed `L` prefix from line references
- Changed from `res.note + "#" + lineRef` to `res.note + ":" + lineRef`

#### Main Plugin (`main.ts`)
- Fixed TypeScript issues with Function types
- Updated scroll positioning to use `res.startLine`
- Improved type safety with proper function signatures

### 6. Documentation Updates

#### README.md
- Updated all examples to use new `:` syntax
- Changed from `[[Recipe:L10..L25]]` to `[[Recipe:10..25]]`
- Simplified usage examples

#### Migration Guide (MIGRATION.md)
- Complete migration path from old to new syntax
- Breaking changes documentation
- Updated examples and usage patterns

### 7. Technical Improvements

#### Type Safety
- Fixed Function type usage in main.ts
- Added proper TypeScript annotations
- Used eslint-disable for necessary any types
- Improved error handling

#### Performance
- Removed dependency on metadata cache for header lookups
- Direct line access for faster content extraction
- Simplified parsing logic

#### Code Quality
- Fixed all linting issues
- Consistent const declarations
- Removed unnecessary semicolons
- Better variable naming

## Breaking Changes

1. **Link Syntax:** All existing header-based links need to be converted to line-based format
2. **Separator:** Changed from `#` to `:` 
3. **Format:** No more `L` prefix requirement
4. **Settings:** Internal setting names changed (auto-migrated)

## Examples of New Syntax

### Basic Usage
```
[[Recipe:10..25]]           // Lines 10 through 25
[[Recipe:15]]               // Single line 15
[[Recipe:1..5|Ingredients]] // Lines 1-5 with custom text
```

### Embeds
```
![[Code Example:42..50]]    // Embed lines 42-50
![[Notes:1]]                // Embed line 1
```

### Settings
- Line Separator: `..` (default)
- Line Visual: `:` (default)
- End Inclusive: `true` (default)

## Migration Required

Users must manually update their existing links from the old header-based format to the new line-based format. The plugin will no longer recognize links in the format `[[Note#Header1..Header2]]`.

## Version Information

- Previous version: 2.0.0 (header-based)
- New version: 3.0.0 (line-based)
- Settings version: v3
- Minimum Obsidian version: 0.15.0