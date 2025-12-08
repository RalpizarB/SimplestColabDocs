# Subfolder Test

This document is located in a subfolder (`docs/Advanced/`).

## Testing Relative Links

### Links to Parent Folder

- [Main Document](../Document.md)
- [Linking Guide](../Linking.md)

### Links to Same Folder

Documents in the same Advanced folder would be linked like:
```markdown
[Other Advanced Doc](OtherDoc.md)
```

### Links to Deeper Folders

- [Deep Link Document](Deep/DeepLink.md)

## Image Testing

You can also reference images with relative paths:

```markdown
![Example](../../Captura de pantalla 2023-12-04 025316.png)
```

Here is the image from the parent directory:

![Screenshot from root](../../Captura de pantalla 2023-12-04 025316.png)

## Path Resolution

The documentation system automatically resolves relative paths like:

| From | To | Syntax |
|------|-----|--------|
| docs/Advanced/SubfolderTest.md | docs/Document.md | `../Document.md` |
| docs/Advanced/SubfolderTest.md | docs/Advanced/Deep/DeepLink.md | `Deep/DeepLink.md` |
| docs/Advanced/Deep/DeepLink.md | docs/Document.md | `../../Document.md` |

---

*This document tests subfolder linking.*
