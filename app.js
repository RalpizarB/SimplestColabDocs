/**
 * SimplestColabDocs - A simple documentation collaboration tool
 * No external libraries - Pure JavaScript
 */

// Document structure - will be loaded from docs folder
const docsStructure = {
    'Getting Started': {
        'Document.md': 'docs/Document.md'
    }
};

// State
let currentDoc = null;
let allDocs = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTree();
    initSearch();
    loadDocsIndex();
});

// Theme Management
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    }
    
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Tree Navigation
function initTree() {
    const treeContainer = document.getElementById('doc-tree');
    treeContainer.innerHTML = buildTree(docsStructure);
    
    // Add event listeners to folders
    document.querySelectorAll('.tree-folder').forEach(folder => {
        folder.addEventListener('click', () => {
            folder.classList.toggle('open');
        });
    });
    
    // Add event listeners to files
    document.querySelectorAll('.tree-file').forEach(file => {
        file.addEventListener('click', (e) => {
            e.preventDefault();
            const path = file.getAttribute('data-path');
            loadDocument(path);
            
            // Update active state
            document.querySelectorAll('.tree-file').forEach(f => f.classList.remove('active'));
            file.classList.add('active');
        });
    });
}

function buildTree(structure, level = 0) {
    let html = '';
    
    for (const [name, value] of Object.entries(structure)) {
        if (typeof value === 'string') {
            // It's a file
            html += `<a class="tree-file" href="#" data-path="${value}">📄 ${name.replace('.md', '')}</a>`;
        } else {
            // It's a folder
            html += `
                <div class="tree-item">
                    <div class="tree-folder">
                        <span class="tree-folder-icon">▶</span>
                        📁 ${name}
                    </div>
                    <div class="tree-children">
                        ${buildTree(value, level + 1)}
                    </div>
                </div>
            `;
        }
    }
    
    return html;
}

// Document Loading
async function loadDocument(path) {
    const contentEl = document.getElementById('doc-content');
    
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error('Document not found');
        
        const markdown = await response.text();
        const html = parseMarkdown(markdown);
        contentEl.innerHTML = html;
        currentDoc = path;
        
        // Store for search
        allDocs[path] = markdown;
    } catch (error) {
        contentEl.innerHTML = `
            <h1>Error Loading Document</h1>
            <p>Could not load: ${path}</p>
            <p>${error.message}</p>
        `;
    }
}

// Load docs index by scanning the docs folder structure
async function loadDocsIndex() {
    // Pre-load all known documents for search functionality
    for (const category of Object.values(docsStructure)) {
        for (const path of Object.values(category)) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    allDocs[path] = await response.text();
                }
            } catch (e) {
                console.log('Could not preload:', path);
            }
        }
    }
}

// Simple Markdown Parser (No external libraries)
function parseMarkdown(markdown) {
    let html = markdown;
    
    // Escape HTML to prevent XSS
    html = escapeHtml(html);
    
    // Code blocks (must be first to prevent other parsing inside)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
    });
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Headers
    html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
    html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    
    // Bold and Italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');
    
    // Strikethrough
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    
    // Blockquotes
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
    // Merge consecutive blockquotes
    html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');
    
    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr>');
    html = html.replace(/^\*\*\*$/gm, '<hr>');
    
    // Unordered lists - simpler approach without lookbehind
    html = html.replace(/^[\*\-] (.+)$/gm, '<li>$1</li>');
    
    // Ordered lists - simpler approach without lookbehind
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="ol-item">$1</li>');
    
    // Wrap consecutive list items
    html = wrapListItems(html);
    
    // Tables
    html = parseTable(html);
    
    // Paragraphs - wrap lines that aren't already wrapped
    const lines = html.split('\n');
    html = lines.map(line => {
        const trimmed = line.trim();
        if (trimmed === '') return '';
        if (trimmed.startsWith('<')) return line;
        return `<p>${line}</p>`;
    }).join('\n');
    
    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>\s*<\/p>/g, '');
    
    return html;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Wrap consecutive list items in ul/ol tags
function wrapListItems(html) {
    const lines = html.split('\n');
    const result = [];
    let inOrderedList = false;
    let inUnorderedList = false;
    
    for (const line of lines) {
        const isOrderedItem = line.includes('<li class="ol-item">');
        const isUnorderedItem = line.includes('<li>') && !isOrderedItem;
        
        if (isOrderedItem) {
            if (!inOrderedList) {
                if (inUnorderedList) {
                    result.push('</ul>');
                    inUnorderedList = false;
                }
                result.push('<ol>');
                inOrderedList = true;
            }
            // Remove the class marker
            result.push(line.replace(' class="ol-item"', ''));
        } else if (isUnorderedItem) {
            if (!inUnorderedList) {
                if (inOrderedList) {
                    result.push('</ol>');
                    inOrderedList = false;
                }
                result.push('<ul>');
                inUnorderedList = true;
            }
            result.push(line);
        } else {
            if (inOrderedList) {
                result.push('</ol>');
                inOrderedList = false;
            }
            if (inUnorderedList) {
                result.push('</ul>');
                inUnorderedList = false;
            }
            result.push(line);
        }
    }
    
    // Close any remaining lists
    if (inOrderedList) result.push('</ol>');
    if (inUnorderedList) result.push('</ul>');
    
    return result.join('\n');
}

function parseTable(html) {
    const tableRegex = /(\|.+\|)\n(\|[-:\s|]+\|)\n((?:\|.+\|\n?)+)/g;
    
    return html.replace(tableRegex, (match, header, separator, body) => {
        const headerCells = header.split('|').filter(c => c.trim());
        const bodyRows = body.trim().split('\n');
        
        let tableHtml = '<table><thead><tr>';
        headerCells.forEach(cell => {
            tableHtml += `<th>${cell.trim()}</th>`;
        });
        tableHtml += '</tr></thead><tbody>';
        
        bodyRows.forEach(row => {
            const cells = row.split('|').filter(c => c.trim());
            tableHtml += '<tr>';
            cells.forEach(cell => {
                tableHtml += `<td>${cell.trim()}</td>`;
            });
            tableHtml += '</tr>';
        });
        
        tableHtml += '</tbody></table>';
        return tableHtml;
    });
    
}

// Search Functionality
function initSearch() {
    const searchInput = document.getElementById('search-input');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            // Reset tree visibility using CSS classes
            document.querySelectorAll('.tree-file').forEach(file => {
                file.classList.remove('hidden');
            });
            document.querySelectorAll('.tree-item').forEach(item => {
                item.classList.remove('hidden');
            });
            return;
        }
        
        searchDocs(query);
    });
}

function searchDocs(query) {
    // Search through loaded documents
    const results = [];
    
    for (const [path, content] of Object.entries(allDocs)) {
        if (content.toLowerCase().includes(query)) {
            results.push(path);
        }
    }
    
    // Also search through tree file names
    document.querySelectorAll('.tree-file').forEach(file => {
        const fileName = file.textContent.toLowerCase();
        const path = file.getAttribute('data-path');
        
        if (fileName.includes(query) || results.includes(path)) {
            file.classList.remove('hidden');
            // Ensure parent folder is visible and open
            const parent = file.closest('.tree-children');
            if (parent) {
                parent.classList.remove('hidden');
                const folder = parent.previousElementSibling;
                if (folder && folder.classList.contains('tree-folder')) {
                    folder.classList.add('open');
                }
            }
        } else {
            file.classList.add('hidden');
        }
    });
    
    // Hide empty folders - check for visible files using class
    document.querySelectorAll('.tree-item').forEach(item => {
        const allFiles = item.querySelectorAll('.tree-file');
        const hiddenFiles = item.querySelectorAll('.tree-file.hidden');
        if (allFiles.length > 0 && allFiles.length === hiddenFiles.length) {
            item.classList.add('hidden');
        } else {
            item.classList.remove('hidden');
        }
    });
}
