/**
 * SimplestColabDocs - A simple documentation collaboration tool
 * No external libraries - Pure JavaScript
 */

// Configuration constants
const SEARCH_CONTEXT_CHARS = 40;
const MAX_MATCHES_PER_DOCUMENT = 5;
const MAX_RECENTLY_READ = 50;

// Document structure - loaded from docs.json
let docsStructure = {};

// State
let currentDoc = null;
let currentDocPath = null;
let allDocs = {};
let searchQuery = '';
let currentTab = 'docs';

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        initTheme();
        initTabs();
        initSearch();
        
        // Load document structure from docs.json
        await loadDocsStructure();
        
        // Initialize tree after structure is loaded
        initTree();
        
        // Pre-load documents for search
        await loadDocsIndex();
        
        // Check for URL hash to restore state on refresh
        restoreFromHash();
        
        // Listen for hash changes (back/forward browser buttons)
        window.addEventListener('hashchange', restoreFromHash);
    } catch (error) {
        console.error('Error initializing application:', error);
        // Show error message to user
        const contentEl = document.getElementById('doc-content');
        if (contentEl) {
            contentEl.innerHTML = `
                <h1>Error Loading Application</h1>
                <p>There was an error loading the documentation. Please try refreshing the page.</p>
                <p>Error: ${error.message}</p>
            `;
        }
    }
});

// Load document structure from docs.json
async function loadDocsStructure() {
    try {
        const response = await fetch('docs.json');
        if (response.ok) {
            docsStructure = await response.json();
        } else {
            console.error('Could not load docs.json, using empty structure');
            docsStructure = {};
        }
    } catch (e) {
        console.error('Error loading docs.json:', e);
        docsStructure = {};
    }
}

// URL Hash Management for page refresh persistence
function updateHash(path) {
    if (path) {
        window.location.hash = encodeURIComponent(path);
    } else {
        history.pushState('', document.title, window.location.pathname + window.location.search);
    }
}

function restoreFromHash() {
    const hash = window.location.hash.slice(1);
    if (hash) {
        const path = decodeURIComponent(hash);
        // Check if it's a valid document path
        if (allDocs[path] || isValidDocPath(path)) {
            loadDocument(path);
            // Update tree active state
            document.querySelectorAll('.tree-file').forEach(f => {
                f.classList.remove('active');
                if (f.getAttribute('data-path') === path) {
                    f.classList.add('active');
                    // Expand parent folders
                    expandParentFolders(f);
                }
            });
        }
    }
}

function isValidDocPath(path) {
    // Check if path exists in docsStructure
    return findPathInStructure(docsStructure, path);
}

function findPathInStructure(structure, path) {
    for (const value of Object.values(structure)) {
        if (typeof value === 'string' && value === path) {
            return true;
        } else if (typeof value === 'object') {
            if (findPathInStructure(value, path)) {
                return true;
            }
        }
    }
    return false;
}

function expandParentFolders(fileElement) {
    let parent = fileElement.closest('.tree-children');
    while (parent) {
        const folder = parent.previousElementSibling;
        if (folder && folder.classList.contains('tree-folder')) {
            folder.classList.add('open');
        }
        parent = parent.parentElement.closest('.tree-children');
    }
}

// Recently Read Management
function getRecentlyRead() {
    const stored = localStorage.getItem('recentlyRead');
    return stored ? JSON.parse(stored) : [];
}

function addToRecentlyRead(path) {
    let recentlyRead = getRecentlyRead();
    
    // Remove if already exists
    recentlyRead = recentlyRead.filter(item => item.path !== path);
    
    // Add to beginning with timestamp
    recentlyRead.unshift({
        path: path,
        timestamp: Date.now()
    });
    
    // Keep only MAX_RECENTLY_READ items
    recentlyRead = recentlyRead.slice(0, MAX_RECENTLY_READ);
    
    localStorage.setItem('recentlyRead', JSON.stringify(recentlyRead));
}

// Tab Management
function initTabs() {
    document.querySelectorAll('.sidebar-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    currentTab = tabName;
    
    // Update tab active state
    document.querySelectorAll('.sidebar-tab').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
    });
    
    // Show/hide content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('hidden', content.id !== `tab-${tabName}`);
    });
    
    // Populate tab content
    if (tabName === 'recent') {
        displayRecentArticles();
    } else if (tabName === 'history') {
        displayRecentlyRead();
    }
}

// Theme Management
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
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
        // Check if it's a file entry (has 'path' property)
        if (value && typeof value === 'object' && value.path) {
            // It's a file with path and date
            html += `<a class="tree-file" href="#" data-path="${value.path}" data-date="${value.date || '2025-12-01'}">${name.replace('.md', '')}</a>`;
        } else if (typeof value === 'string') {
            // Legacy format - just a path string
            html += `<a class="tree-file" href="#" data-path="${value}" data-date="2025-12-01">${name.replace('.md', '')}</a>`;
        } else {
            // It's a folder
            html += `
                <div class="tree-item">
                    <div class="tree-folder">
                        <span class="tree-folder-icon"></span>
                        ${name}
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
async function loadDocument(path, highlightQuery = '') {
    const contentEl = document.getElementById('doc-content');
    
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error('Document not found');
        
        const markdown = await response.text();
        let html = parseMarkdown(markdown, path);
        
        // Apply search highlighting if query exists
        if (highlightQuery) {
            html = highlightSearchTerm(html, highlightQuery);
        }
        
        contentEl.innerHTML = html;
        currentDoc = markdown;
        currentDocPath = path;
        
        // Update URL hash for page refresh persistence
        updateHash(path);
        
        // Track in recently read
        addToRecentlyRead(path);
        
        // Store for search
        allDocs[path] = markdown;
        
        // Add click handlers for internal links
        setupInternalLinks();
        
        // Scroll to first highlight if searching
        if (highlightQuery) {
            const firstHighlight = contentEl.querySelector('.search-highlight');
            if (firstHighlight) {
                firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    } catch (error) {
        contentEl.innerHTML = `
            <h1>Error Loading Document</h1>
            <p>Could not load: ${path}</p>
            <p>${error.message}</p>
        `;
    }
}

// Setup click handlers for internal markdown links
function setupInternalLinks() {
    document.querySelectorAll('#doc-content a[data-internal="true"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            loadDocument(href, searchQuery);
            
            // Update tree active state
            document.querySelectorAll('.tree-file').forEach(f => {
                if (f.getAttribute('data-path') === href) {
                    document.querySelectorAll('.tree-file').forEach(file => file.classList.remove('active'));
                    f.classList.add('active');
                }
            });
        });
    });
}

// Highlight search terms in HTML content
function highlightSearchTerm(html, query) {
    if (!query || query.length < 2) return html;
    
    // Don't highlight inside HTML tags
    const regex = new RegExp(`(>[^<]*)(${escapeRegex(query)})([^<]*<)`, 'gi');
    return html.replace(regex, '$1<mark class="search-highlight">$2</mark>$3');
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Load docs index by scanning the docs folder structure
async function loadDocsIndex() {
    // Pre-load all known documents for search functionality
    await loadDocsFromStructure(docsStructure);
}

// Recursively load documents from nested structure
async function loadDocsFromStructure(structure) {
    for (const value of Object.values(structure)) {
        // Check if it's a file entry (has 'path' property)
        if (value && typeof value === 'object' && value.path) {
            // It's a file with path and date
            try {
                const response = await fetch(value.path);
                if (response.ok) {
                    allDocs[value.path] = await response.text();
                }
            } catch (e) {
                console.log('Could not preload:', value.path);
            }
        } else if (typeof value === 'string') {
            // Legacy format - just a path string
            try {
                const response = await fetch(value);
                if (response.ok) {
                    allDocs[value] = await response.text();
                }
            } catch (e) {
                console.log('Could not preload:', value);
            }
        } else if (value && typeof value === 'object') {
            // It's a nested structure, recurse
            await loadDocsFromStructure(value);
        }
    }
}

// Simple Markdown Parser (No external libraries)
function parseMarkdown(markdown, currentPath = '') {
    let html = markdown;
    
    // Store code blocks and inline code temporarily to prevent markdown parsing inside them
    const codeBlocks = [];
    const inlineCodes = [];
    
    // Extract code blocks first (before HTML escaping to preserve original content)
    // Make newline optional to handle edge cases
    html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (match, lang, code) => {
        const index = codeBlocks.length;
        codeBlocks.push({ lang, code: code.trim() });
        return `CODEBLOCKPLACEHOLDER${index}ENDPLACEHOLDER`;
    });
    
    // Extract inline code (before HTML escaping to preserve original content)
    html = html.replace(/`([^`]+)`/g, (match, code) => {
        const index = inlineCodes.length;
        inlineCodes.push(code);
        return `INLINECODEPLACEHOLDER${index}ENDPLACEHOLDER`;
    });
    
    // Escape HTML to prevent XSS (after extracting code)
    html = escapeHtml(html);
    
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
    
    // Get current directory for relative paths
    const currentDir = currentPath ? currentPath.substring(0, currentPath.lastIndexOf('/') + 1) : '';
    
    // Images - handle relative paths
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
        // If it's a relative path (not http/https), resolve it
        if (!src.startsWith('http://') && !src.startsWith('https://')) {
            src = resolvePath(currentDir, src);
        }
        return `<img src="${src}" alt="${alt}">`;
    });
    
    // Links - handle internal .md links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, href) => {
        // Check if it's an internal markdown link
        if (href.endsWith('.md')) {
            const resolvedPath = resolvePath(currentDir, href);
            return `<a href="${resolvedPath}" data-internal="true">${text}</a>`;
        }
        // External link
        return `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
    });
    
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
        // Don't wrap code placeholders in paragraphs (check with startsWith for efficiency)
        if (trimmed.startsWith('CODEBLOCKPLACEHOLDER')) return line;
        return `<p>${line}</p>`;
    }).join('\n');
    
    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>\s*<\/p>/g, '');
    
    // Restore all placeholders in a single pass using regex
    html = html.replace(/INLINECODEPLACEHOLDER(\d+)ENDPLACEHOLDER/g, (match, index) => {
        const code = inlineCodes[parseInt(index, 10)];
        return `<code>${escapeHtml(code)}</code>`;
    });
    
    html = html.replace(/CODEBLOCKPLACEHOLDER(\d+)ENDPLACEHOLDER/g, (match, index) => {
        const block = codeBlocks[parseInt(index, 10)];
        return `<pre><code class="language-${block.lang}">${escapeHtml(block.code)}</code></pre>`;
    });
    
    return html;
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Resolve relative paths (handles ../ and ./)
function resolvePath(basePath, relativePath) {
    // If path starts with docs/, it's already absolute
    if (relativePath.startsWith('docs/')) {
        return relativePath;
    }
    
    // Combine base and relative
    const parts = (basePath + relativePath).split('/');
    const result = [];
    
    for (const part of parts) {
        if (part === '..') {
            result.pop();
        } else if (part !== '.' && part !== '') {
            result.push(part);
        }
    }
    
    return result.join('/');
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
        searchQuery = query;
        
        if (query.length < 2) {
            // Reset tree visibility using CSS classes
            document.querySelectorAll('.tree-file').forEach(file => {
                file.classList.remove('hidden');
            });
            document.querySelectorAll('.tree-item').forEach(item => {
                item.classList.remove('hidden');
            });
            // Clear search results from main area if showing search
            const contentEl = document.getElementById('doc-content');
            if (contentEl.querySelector('.search-results')) {
                contentEl.innerHTML = `
                    <h1>Welcome to SimplestColabDocs</h1>
                    <p>Select a document from the sidebar to get started.</p>
                `;
            }
            return;
        }
        
        searchDocs(query);
    });
}

function searchDocs(query) {
    // Search through loaded documents and collect results with context
    const results = [];
    
    for (const [path, content] of Object.entries(allDocs)) {
        const lowerContent = content.toLowerCase();
        if (lowerContent.includes(query)) {
            // Find matches with context
            const matches = findMatchesWithContext(content, query);
            const fileName = path.split('/').pop().replace('.md', '');
            results.push({ path, fileName, matches });
        }
    }
    
    // Display results in main content area
    displaySearchResults(results, query);
    
    // Also update tree visibility
    document.querySelectorAll('.tree-file').forEach(file => {
        const path = file.getAttribute('data-path');
        const hasMatch = results.some(r => r.path === path);
        
        if (hasMatch) {
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
    
    // Hide empty folders
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

function findMatchesWithContext(content, query) {
    const matches = [];
    const lines = content.split('\n');
    const lowerQuery = query.toLowerCase();
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lowerLine = line.toLowerCase();
        let index = lowerLine.indexOf(lowerQuery);
        
        while (index !== -1) {
            // Get context around the match
            const start = Math.max(0, index - SEARCH_CONTEXT_CHARS);
            const end = Math.min(line.length, index + query.length + SEARCH_CONTEXT_CHARS);
            let context = line.substring(start, end);
            
            if (start > 0) context = '...' + context;
            if (end < line.length) context = context + '...';
            
            matches.push({
                lineNumber: i + 1,
                context: context,
                matchStart: start > 0 ? index - start + 3 : index,
                matchLength: query.length
            });
            
            index = lowerLine.indexOf(lowerQuery, index + 1);
        }
    }
    
    return matches.slice(0, MAX_MATCHES_PER_DOCUMENT);
}

function displaySearchResults(results, query) {
    const contentEl = document.getElementById('doc-content');
    
    if (results.length === 0) {
        contentEl.innerHTML = `
            <div class="search-results">
                <h1>Search Results</h1>
                <p class="no-results">No results found for "<strong>${escapeHtml(query)}</strong>"</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="search-results">
            <h1>Search Results</h1>
            <p class="results-count">Found ${results.reduce((sum, r) => sum + r.matches.length, 0)} matches in ${results.length} document(s) for "<strong>${escapeHtml(query)}</strong>"</p>
    `;
    
    for (const result of results) {
        html += `
            <div class="search-result-item">
                <h3 class="result-title">
                    <a href="#" data-path="${result.path}" class="result-link">${result.fileName}</a>
                </h3>
                <div class="result-matches">
        `;
        
        for (const match of result.matches) {
            const highlightedContext = highlightInContext(match.context, query);
            html += `
                <div class="result-match">
                    <span class="line-number">Line ${match.lineNumber}:</span>
                    <span class="match-context">${highlightedContext}</span>
                </div>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    contentEl.innerHTML = html;
    
    // Add click handlers for result links
    contentEl.querySelectorAll('.result-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const path = link.getAttribute('data-path');
            loadDocument(path, query);
            
            // Update tree active state
            document.querySelectorAll('.tree-file').forEach(f => {
                f.classList.remove('active');
                if (f.getAttribute('data-path') === path) {
                    f.classList.add('active');
                }
            });
        });
    });
}

function highlightInContext(context, query) {
    const escaped = escapeHtml(context);
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return escaped.replace(regex, '<mark class="search-highlight">$1</mark>');
}

// Display Recent Articles (all documents sorted by date, most recent first)
function displayRecentArticles() {
    const container = document.getElementById('tab-recent');
    const articles = getAllDocPaths();
    
    if (articles.length === 0) {
        container.innerHTML = '<p class="tab-empty">No articles found.</p>';
        return;
    }
    
    let html = '<div class="article-list">';
    
    for (const article of articles) {
        const fileName = article.path.split('/').pop().replace('.md', '');
        const folder = article.path.split('/').slice(0, -1).join('/');
        const dateStr = formatDate(article.date);
        
        html += `
            <a href="#" class="article-item" data-path="${article.path}">
                <span class="article-name">${fileName}</span>
                <span class="article-meta">
                    <span class="article-path">${folder}</span>
                    <span class="article-date">${dateStr}</span>
                </span>
            </a>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
    
    // Add click handlers
    container.querySelectorAll('.article-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const path = item.getAttribute('data-path');
            loadDocument(path);
            
            // Update tree active state
            document.querySelectorAll('.tree-file').forEach(f => {
                f.classList.remove('active');
                if (f.getAttribute('data-path') === path) {
                    f.classList.add('active');
                    expandParentFolders(f);
                }
            });
        });
    });
}

// Format date for display
function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } catch (e) {
        return dateStr;
    }
}

// Get all document paths from structure
function getAllDocPaths() {
    const paths = [];
    collectPaths(docsStructure, paths);
    // Sort by date (most recent first)
    return paths.sort((a, b) => {
        const dateA = a.date || '2025-12-01';
        const dateB = b.date || '2025-12-01';
        return dateB.localeCompare(dateA); // Descending order (most recent first)
    });
}

function collectPaths(structure, paths) {
    for (const value of Object.values(structure)) {
        // Check if it's a file entry (has 'path' property)
        if (value && typeof value === 'object' && value.path) {
            paths.push({ 
                path: value.path, 
                date: value.date || '2025-12-01'
            });
        } else if (typeof value === 'string') {
            // Legacy format - just a path string
            paths.push({ path: value, date: '2025-12-01' });
        } else if (value && typeof value === 'object') {
            // It's a nested structure
            collectPaths(value, paths);
        }
    }
}

// Display Recently Read documents
function displayRecentlyRead() {
    const container = document.getElementById('tab-history');
    const recentlyRead = getRecentlyRead();
    
    if (recentlyRead.length === 0) {
        container.innerHTML = '<p class="tab-empty">No recently read documents.</p>';
        return;
    }
    
    let html = '<div class="article-list">';
    
    for (const item of recentlyRead) {
        const fileName = item.path.split('/').pop().replace('.md', '');
        const timeAgo = getTimeAgo(item.timestamp);
        
        html += `
            <a href="#" class="article-item" data-path="${item.path}">
                <span class="article-name">${fileName}</span>
                <span class="article-time">${timeAgo}</span>
            </a>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
    
    // Add click handlers
    container.querySelectorAll('.article-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const path = item.getAttribute('data-path');
            loadDocument(path);
            
            // Update tree active state
            document.querySelectorAll('.tree-file').forEach(f => {
                f.classList.remove('active');
                if (f.getAttribute('data-path') === path) {
                    f.classList.add('active');
                    expandParentFolders(f);
                }
            });
        });
    });
}

// Get time ago string
function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' min ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + ' days ago';
    
    return new Date(timestamp).toLocaleDateString();
}
