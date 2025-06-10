# Bible References Feature

This plugin supports natural Bible reference syntax for linking to and embedding Bible verses.

## Overview

When Bible references are enabled, you can use natural citation syntax like `![[I Peter 1:3-5]]` to reference verses in your Bible study notes.

## Setup

### File Structure

The plugin expects your Bible files to be organized in folders with numeric prefixes based on canonical book order:

```
60 I Peter/
├── Chapter 01.md
├── Chapter 02.md
├── Chapter 03.md
├── Chapter 04.md
└── Chapter 05.md

61 II Peter/
├── Chapter 01.md
├── Chapter 02.md
└── Chapter 03.md

43 John/
├── Chapter 01.md
├── Chapter 02.md
├── ...
└── Chapter 21.md
```

### Settings

1. Enable "Bible References" in the plugin settings
2. Enable "Use Numeric Bible Book Prefixes" if your files use canonical numbering

## Usage

### Single Verse
```
[[John 3:16]]
![[Romans 8:28]]
```

### Verse Range
```
[[I Peter 1:3-5]]
![[Ephesians 2:8-10]]
```

### With Custom Display Text
```
[[John 3:16|God's Love]]
[[Romans 8:28-30|The Golden Chain]]
```

## Supported Book Names

The plugin recognizes both traditional and modern book abbreviations:

### Old Testament (1-39)
- Genesis (1), Exodus (2), Leviticus (3), Numbers (4), Deuteronomy (5)
- Joshua (6), Judges (7), Ruth (8), I Samuel (9), II Samuel (10)
- I Kings (11), II Kings (12), I Chronicles (13), II Chronicles (14)
- Ezra (15), Nehemiah (16), Esther (17), Job (18), Psalms (19)
- Proverbs (20), Ecclesiastes (21), Song of Solomon (22), Isaiah (23)
- Jeremiah (24), Lamentations (25), Ezekiel (26), Daniel (27)
- Hosea (28), Joel (29), Amos (30), Obadiah (31), Jonah (32)
- Micah (33), Nahum (34), Habakkuk (35), Zephaniah (36), Haggai (37)
- Zechariah (38), Malachi (39)

### New Testament (40-66)
- Matthew (40), Mark (41), Luke (42), John (43), Acts (44)
- Romans (45), I Corinthians (46), II Corinthians (47)
- Galatians (48), Ephesians (49), Philippians (50), Colossians (51)
- I Thessalonians (52), II Thessalonians (53), I Timothy (54), II Timothy (55)
- Titus (56), Philemon (57), Hebrews (58), James (59)
- I Peter (60), II Peter (61), I John (62), II John (63), III John (64)
- Jude (65), Revelation (66)

### Book Name Aliases

The plugin automatically converts modern abbreviations:
- `1 Peter` → `I Peter`
- `2 Peter` → `II Peter`
- `1 John` → `I John`
- `2 John` → `II John`
- `3 John` → `III John`
- `1 Corinthians` → `I Corinthians`
- `2 Corinthians` → `II Corinthians`
- And similar patterns for other numbered books

## Technical Details

### Verse-to-Line Mapping

The plugin assumes:
1. Each verse is on its own line
2. Verses are numbered sequentially starting from line 1 in each chapter file
3. Chapter files contain only the verses (no headers or extra content)

### File Resolution

For a reference like `I Peter 1:3-5`:
1. Book name "I Peter" → Canonical index 60
2. Chapter 1 → "Chapter 01"
3. Final path: `60 I Peter/Chapter 01.md`
4. Verses 3-5 → Lines 3-5 in that file

## Examples

### Bible Study Notes
```markdown
# Study on Faith

Peter teaches us about living hope in ![[I Peter 1:3-5]].

Compare this with Paul's teaching: [[Ephesians 2:8-10|Salvation by Grace]].

The foundation of our faith is found in [[John 3:16]].
```

### Sermon Preparation
```markdown
# Sermon: The Love of God

## Main Text
![[I John 4:7-21]]

## Supporting Verses
- [[John 3:16]] - God's love demonstrated
- [[Romans 5:8]] - Love while we were sinners
- [[I Corinthians 13:4-8|Love Chapter]] - Description of love
```

## Troubleshooting

### File Not Found
- Ensure your chapter files follow the exact naming pattern: `Chapter 01.md`, `Chapter 02.md`, etc.
- Verify the book folder has the correct canonical number prefix
- Check that the book name matches one of the supported names

### Incorrect Verses
- Verify that verses in your chapter files start at line 1
- Ensure each verse is on its own line
- Check that verse numbers match line numbers

### Book Name Not Recognized
- Use the full canonical book name (e.g., "I Peter" not "1 Pet")
- Check the supported book names list above
- Ensure correct spelling and capitalization