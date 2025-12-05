A simple documentation colaboration tool to meant to be hosted on a static site, and maintained using Git.
Philosophy:
- No external JavaScript libraries to prevent any security vulnerability and absolute control.
- Tree like Structure, to allow themes and subthemes
- Most Markdown Support Including images, code blocks, tables and diagrams
- Colaboration throught Git Pull Requests: A new document should be uploaded in the repository as .md and it will be reflected in the site
- Both Light Theme and Dark Theme
- Search Bar to search all text
Tech stack:
HTML - CSS - Javascript

## To add a document:

1. Add your `.md` file in the `docs` folder (or a subfolder)
2. If your doc contains images, place them in a folder with the same name as your doc (without .md)
3. **Update `docs.json`** to include your new document in the structure:

```json
{
    "Category Name": {
        "YourDocument.md": "docs/YourDocument.md"
    }
}
```

For nested folders:
```json
{
    "Category": {
        "Subcategory": {
            "Document.md": "docs/Category/Subcategory/Document.md"
        }
    }
}
```

<img width="32" height="32" alt="the guy" src="https://github.com/user-attachments/assets/1bcb93fb-c861-4457-ad31-9b1a5b897842" />

