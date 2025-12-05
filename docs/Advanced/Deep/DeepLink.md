# Deep Nested Document

This document is located in a deeply nested folder (`docs/Advanced/Deep/`).

## Testing Deep Links

### Links Back Up the Tree

- [Back to Subfolder Test](../SubfolderTest.md)
- [Back to Main Document](../../Document.md)
- [Back to Linking Guide](../../Linking.md)

### Image from Root

Images can also use relative paths from deeply nested documents:

![Screenshot from root](../../../Captura de pantalla 2023-12-04 025316.png)

## Use Cases

Deep nesting is useful for:

1. **Organizing large documentation** - Group related topics together
2. **Versioning** - Keep different versions in separate folders
3. **Categorization** - Create logical hierarchies

## Navigation Example

```markdown
From: docs/Advanced/Deep/DeepLink.md
To: docs/Document.md
Path: ../../Document.md
```

The `../` means "go up one directory level".

## All Links Working

This page demonstrates that links work correctly regardless of how deeply nested the current document is.

| Destination | Relative Path |
|-------------|---------------|
| docs/Advanced/Deep/DeepLink.md (current) | - |
| docs/Advanced/SubfolderTest.md | ../SubfolderTest.md |
| docs/Document.md | ../../Document.md |
| docs/Linking.md | ../../Linking.md |

---

*This is the deepest nested document in the test structure.*
