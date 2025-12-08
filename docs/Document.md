# Welcome to SimplestColabDocs

This is an example document demonstrating the Markdown support in SimplestColabDocs.

## Features

SimplestColabDocs supports the following Markdown features:

### Text Formatting

- **Bold text** using `**bold**`
- *Italic text* using `*italic*`
- ***Bold and italic*** using `***both***`
- ~~Strikethrough~~ using `~~strikethrough~~`

### Links and Images

You can create [links](https://github.com) like this: `[text](url)`

Images work similarly: `![alt text](image-url)`

Here is a local image example:

![Screenshot Example](../Captura de pantalla 2023-12-04 025316.png)

### Code

Inline code: `const greeting = "Hello World";`

Code blocks:

```javascript
function sayHello(name) {
    console.log(`Hello, ${name}!`);
}

sayHello("SimplestColabDocs");
```

### Markdown Examples in Code Blocks

You can show markdown syntax examples without them being parsed:

```markdown
# This is a heading
## This is a subheading

**Bold text** and *italic text*

- List item 1
- List item 2

[Link text](https://example.com)
![Image alt](image.png)

> This is a blockquote

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

### Lists

Unordered list:
- First item
- Second item
- Third item

Ordered list:
1. Step one
2. Step two
3. Step three

### Tables

| Feature | Supported |
|---------|-----------|
| Headers | Yes |
| Bold/Italic | Yes |
| Code blocks | Yes |
| Tables | Yes |
| Images | Yes |
| Links | Yes |

### Blockquotes

> This is a blockquote.
> It can span multiple lines.

### Horizontal Rules

Use `---` to create a horizontal rule:

---

## Internal Links

You can link to other documents in this documentation:

- [Learn about Linking](Linking.md)
- [See Subfolder Test](Advanced/SubfolderTest.md)
- [Deep Link Example](Advanced/Deep/DeepLink.md)

## How to Contribute

1. Fork this repository
2. Add your document in the `docs` folder as a `.md` file
3. If your document contains images, create a folder with the same name as your document
4. Submit a Pull Request

## Theme Support

Click the theme toggle button in the sidebar to switch between light and dark themes.

---

*Happy documenting!*
