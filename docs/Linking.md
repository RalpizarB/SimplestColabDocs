# Internal Linking Guide

This document explains how to link between documents in SimplestColabDocs.

## Basic Syntax

To link to another markdown file, use the standard markdown link syntax:

```markdown
[Link Text](path/to/file.md)
```

## Relative Paths

Links are relative to the current document location:

- `[Same Folder](Document.md)` - Links to a file in the same folder
- `[Subfolder](Advanced/SubfolderTest.md)` - Links to a file in a subfolder
- `[Up and Over](../other-folder/Doc.md)` - Navigate up then into another folder

## Examples

Here are some example links:

### Same Folder Links

- [Back to Main Document](Document.md)

### Subfolder Links

- [Subfolder Test](Advanced/SubfolderTest.md)
- [Deep Nested Document](Advanced/Deep/DeepLink.md)

## Navigation

Use the sidebar to navigate between documents, or use internal links to create a connected documentation structure.

---

*This document demonstrates internal linking capabilities.*
