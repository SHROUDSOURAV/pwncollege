const fs = require('fs');
const path = require('path');
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
    // Ignore internal or irrelevant paths
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
    
    // Check if the relative path (relative to contentDir) is ignored
    if (ig.ignores(path.posix.join('content', relPath))) {
      return; // Skip gitignored paths
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

try {
  console.log('Generating tree.json from content folder...');
  const tree = getDirectoryTree(contentDir);
  const jsonContent = JSON.stringify(tree, null, 2);
  
  // Write to workspace root
  fs.writeFileSync(path.join(__dirname, 'tree.json'), jsonContent, 'utf8');
  console.log('Successfully wrote tree.json in root!');
  
  // Also write to public folder if it exists
  const publicDir = path.join(__dirname, 'public');
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(path.join(publicDir, 'tree.json'), jsonContent, 'utf8');
    console.log('Successfully wrote tree.json in public folder!');
  }
} catch (error) {
  console.error('Error generating tree.json:', error);
  process.exit(1);
}
