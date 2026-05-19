const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Function to automatically generate tree.json on server startup
function generateTreeJson() {
  console.log('Generating tree.json...');
  try {
    const ignore = require('ignore');
    const contentDir = path.join(__dirname, 'content');
    
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

    const tree = getDirectoryTree(contentDir);
    const jsonContent = JSON.stringify(tree, null, 2);
    
    // Write to root
    fs.writeFileSync(path.join(__dirname, 'tree.json'), jsonContent, 'utf8');
    
    // Write to public folder
    const publicDir = path.join(__dirname, 'public');
    if (fs.existsSync(publicDir)) {
      fs.writeFileSync(path.join(publicDir, 'tree.json'), jsonContent, 'utf8');
    }
    console.log('Successfully generated tree.json!');
  } catch (error) {
    console.error('Failed to generate tree.json on startup:', error);
  }
}

// Generate the tree JSON when the server starts
generateTreeJson();

// Serve the public folder as root static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the content folder statically as /content
app.use('/content', express.static(path.join(__dirname, 'content')));

// Serve tree.json from the root or public folder
app.get('/tree.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'tree.json'));
});

// Backward compatibility APIs (in case they are called anywhere)
app.get('/api/tree', (req, res) => {
  try {
    const treeData = fs.readFileSync(path.join(__dirname, 'tree.json'), 'utf8');
    res.json(JSON.parse(treeData));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/content', (req, res) => {
  const relPath = req.query.path;
  if (!relPath || relPath.includes('..')) {
    return res.status(400).json({ error: 'Invalid path' });
  }
  const absolutePath = path.join(__dirname, 'content', relPath);
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
