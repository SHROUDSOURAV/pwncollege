const express = require('express');
const fs = require('fs');
const path = require('path');
const ignore = require('ignore');
const app = express();
const PORT = 3000;

const contentDir = path.join(__dirname, 'content');

// Helper to generate the directory tree dynamically
function getDynamicDirectoryTree() {
  const ig = ignore();
  try {
    const gitignoreContent = fs.readFileSync(path.join(__dirname, '.gitignore'), 'utf8');
    ig.add(gitignoreContent);
  } catch (e) {
    // Ignore missing .gitignore
  }

  function getDirectoryTree(dirPath, basePath = '') {
    let tree = [];
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    items.forEach(item => {
      if (item.name.startsWith('.') && item.name !== '.gitignore') return;
      if (
        item.name === 'node_modules' ||
        item.name === 'public' ||
        item.name === 'package.json' ||
        item.name === 'package-lock.json' ||
        item.name === 'server.js' ||
        item.name === 'generate-tree.js'
      ) return;
      
      const itemPath = path.join(dirPath, item.name);
      const relPath = path.posix.join(basePath, item.name);
      
      if (ig.ignores(path.posix.join('content', relPath))) {
        return;
      }

      if (item.isDirectory()) {
        const children = getDirectoryTree(itemPath, relPath);
        if (children.length > 0) {
          tree.push({ name: item.name, path: relPath, type: 'directory', children });
        }
      } else if (item.isFile() && item.name.endsWith('.md')) {
        tree.push({ name: item.name, path: relPath, type: 'file' });
      }
    });

    return tree.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'directory' ? -1 : 1;
    });
  }

  return getDirectoryTree(contentDir);
}

// Serve the public folder as root static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the content folder statically as /content
app.use('/content', express.static(path.join(__dirname, 'content')));

// Dynamic tree JSON route for general use
app.get('/tree.json', (req, res) => {
  try {
    const tree = getDynamicDirectoryTree();
    res.json(tree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dynamic API tree route
app.get('/api/tree', (req, res) => {
  try {
    const tree = getDynamicDirectoryTree();
    res.json(tree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dynamic content loading endpoint
app.get('/api/content', (req, res) => {
  const relPath = req.query.path;
  if (!relPath || relPath.includes('..')) {
    return res.status(400).json({ error: 'Invalid path' });
  }
  const absolutePath = path.join(contentDir, relPath);
  if (!fs.existsSync(absolutePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  try {
    const content = fs.readFileSync(absolutePath, 'utf8');
    res.json({ content: content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
