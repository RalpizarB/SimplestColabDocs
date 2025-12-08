# Guía de Uso

## Navegación

### Barra Lateral

La barra lateral tiene tres pestañas:

1. **Documents**: Navegación en árbol de todos los documentos organizados por carpetas
2. **All Articles**: Lista de todos los artículos ordenados por fecha (más reciente primero)
3. **Recently Read**: Historial de documentos que has leído recientemente

### Búsqueda

Usa la barra de búsqueda en la parte superior para encontrar texto en todos los documentos. Los resultados muestran:
- Número de coincidencias
- Contexto de cada coincidencia
- Número de línea

## Características de Markdown

### Enlaces Internos

Puedes enlazar a otros documentos usando la sintaxis estándar de Markdown: `[Texto del enlace](ruta/al/documento.md)`

Ejemplo: Enlaces relativos funcionan desde cualquier profundidad de carpeta.

### Imágenes

Para incluir imágenes, usa: `![Texto alternativo](ruta/a/imagen.png)`

### Bloques de Código

Usa tres acentos graves seguidos del lenguaje para crear bloques de código con resaltado de sintaxis.

### Tablas

| Columna 1 | Columna 2 |
|-----------|-----------|
| Dato 1    | Dato 2    |

## Temas

Haz clic en el botón de alternar tema (sol/luna) en la esquina superior derecha para cambiar entre modo claro y oscuro. Tu preferencia se guarda automáticamente.

## Colaboración

### Para Contribuir

1. Haz fork del repositorio
2. Añade tu documento `.md` en la carpeta `docs`
3. Commit y push tus cambios
4. Crea un Pull Request

### Estructura de Carpetas

Ejemplo de estructura:

    docs/
    ├── tutorial/
    │   ├── Primeros Pasos.md
    │   └── Guía de Uso.md
    └── tu-categoria/
        └── tu-documento.md

El archivo `docs.json` se genera automáticamente cuando haces push.

---

# Usage Guide

## Navigation

### Sidebar

The sidebar has three tabs:

1. **Documents**: Tree navigation of all documents organized by folders
2. **All Articles**: List of all articles sorted by date (most recent first)
3. **Recently Read**: History of documents you've recently read

### Search

Use the search bar at the top to find text across all documents. Results show:
- Number of matches
- Context of each match
- Line number

## Markdown Features

### Internal Links

You can link to other documents using standard Markdown syntax: `[Link text](path/to/document.md)`

Example: Relative links work from any folder depth.

### Images

To include images, use: `![Alt text](path/to/image.png)`

### Code Blocks

Use three backticks followed by the language name to create code blocks with syntax highlighting.

### Tables

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |

## Themes

Click the theme toggle button (sun/moon) in the top right corner to switch between light and dark mode. Your preference is automatically saved.

## Collaboration

### To Contribute

1. Fork the repository
2. Add your `.md` document in the `docs` folder
3. Commit and push your changes
4. Create a Pull Request

### Folder Structure

Example structure:

    docs/
    ├── tutorial/
    │   ├── Primeros Pasos.md
    │   └── Guía de Uso.md
    └── your-category/
        └── your-document.md

The `docs.json` file is automatically generated when you push.
