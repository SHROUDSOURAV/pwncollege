document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.getElementById('nav-container');
  const markdownBody = document.getElementById('markdown-body');
  const activePathSpan = document.getElementById('active-path');
  const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
  const sidebar = document.getElementById('sidebar');
  const resizer = document.getElementById('resizer');

  // Register NASM as x86asm for highlight.js to support specific code blocks
  if (typeof hljs !== 'undefined') {
    hljs.registerAliases('nasm', { languageName: 'x86asm' });
  }

  // --- Setup Client-Side Marked Renderer ---
  const renderer = new marked.Renderer();

  // Custom image renderer to resolve relative paths from the github repository/content directory
  renderer.image = function(hrefOrObj, titleInfo, textInfo) {
    let href = typeof hrefOrObj === 'object' ? hrefOrObj.href : hrefOrObj;
    let title = typeof hrefOrObj === 'object' ? hrefOrObj.title : titleInfo;
    let text = typeof hrefOrObj === 'object' ? hrefOrObj.text : textInfo;

    let finalHref = href;
    if (finalHref && !finalHref.startsWith('http') && !finalHref.startsWith('/') && !finalHref.startsWith('data:')) {
      // Resolve path relative to the current markdown file path
      const hash = window.location.hash;
      if (hash.startsWith('#/')) {
        const activePath = decodeURIComponent(hash.substring(2));
        const folderPath = activePath.includes('/') 
          ? activePath.substring(0, activePath.lastIndexOf('/')) 
          : '';
        // Prepend content/ + folderPath/
        finalHref = 'content/' + (folderPath ? folderPath + '/' : '') + finalHref;
      }
    }

    let out = `<img src="${finalHref}" alt="${text || ''}"`;
    if (title) {
      out += ` title="${title}"`;
    }
    out += '>';
    return out;
  };

  // Custom code highlighting with highlight.js inside marked
  renderer.code = function(codeOrObj, langInfo) {
    let code = typeof codeOrObj === 'object' ? codeOrObj.text : codeOrObj;
    let lang = typeof codeOrObj === 'object' ? codeOrObj.lang : langInfo;
    
    lang = lang || 'plaintext';
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    const highlighted = hljs.highlight(code, { language }).value;
    return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
  };

  // Configure marked options
  marked.setOptions({
    renderer: renderer,
    gfm: true,
    breaks: true
  });

  // --- Sidebar Resizing Logic ---
  let isDragging = false;

  resizer.addEventListener('mousedown', (e) => {
    isDragging = true;
    resizer.classList.add('dragging');
    sidebar.classList.add('no-transition'); // Disable snapping lag temporarily
    document.body.style.cursor = 'col-resize';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    if (sidebar.classList.contains('collapsed')) return;
    
    let newWidth = e.clientX;
    if (newWidth < 150) newWidth = 150;
    if (newWidth > 800) newWidth = 800;

    sidebar.style.width = `${newWidth}px`;
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      resizer.classList.remove('dragging');
      sidebar.classList.remove('no-transition');
      document.body.style.cursor = 'default';
    }
  });

  // --- Sidebar Toggle Logic ---
  toggleSidebarBtn.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle('mobile-open');
    } else {
      sidebar.classList.toggle('collapsed');
      if (sidebar.classList.contains('collapsed')) {
        resizer.style.display = 'none';
      } else {
        resizer.style.display = 'block';
      }
    }
  });

  // --- Hash Routing Logic ---
  function handleRoute() {
    const hash = window.location.hash;
    if (hash.startsWith('#/')) {
      const path = decodeURIComponent(hash.substring(2));
      if (path) {
        loadContent(path);
        return;
      }
    }
    showWelcomeScreen();
  }

  window.addEventListener('hashchange', handleRoute);

  function showWelcomeScreen() {
    document.querySelectorAll('.nav-title.active').forEach(el => el.classList.remove('active'));
    activePathSpan.textContent = '/';
    document.title = 'CTF-Writeups Web';
    markdownBody.innerHTML = `
      <div class="welcome-screen">
        <h1>Welcome to CTF-Writeups</h1>
        <p>A personal collection of unofficial writeups. Select a file from the sidebar to start reading.</p>
      </div>
    `;
  }

  // Fetch Tree
  async function fetchTree() {
    try {
      // Use relative path for tree.json to support base paths correctly
      const res = await fetch('tree.json');
      const tree = await res.json();
      navContainer.innerHTML = '';
      const ul = buildTreeUI(tree);
      navContainer.appendChild(ul);
      
      // Handle the initial route once the tree UI is fully loaded in DOM
      handleRoute();
    } catch (e) {
      console.error('Failed to load tree:', e);
      navContainer.innerHTML = '<div style="color:var(--red);">Error loading files</div>';
    }
  }

  function buildTreeUI(nodes) {
    const ul = document.createElement('ul');
    ul.className = 'nav-tree';

    nodes.forEach(node => {
      const li = document.createElement('li');
      li.className = 'nav-item';

      const titleDiv = document.createElement('div');
      titleDiv.className = 'nav-title';
      titleDiv.dataset.path = node.path;
      
      const icon = document.createElement('span');
      icon.className = 'icon';

      const text = document.createElement('span');
      text.textContent = node.name.replace('.md', '');

      if (node.type === 'directory') {
        icon.textContent = '📁';
        titleDiv.appendChild(icon);
        titleDiv.appendChild(text);
        li.appendChild(titleDiv);
        
        const childrenUl = buildTreeUI(node.children);
        childrenUl.style.display = 'none'; // Collapse by default
        li.appendChild(childrenUl);

        titleDiv.addEventListener('click', (e) => {
          e.stopPropagation();
          const isCollapsed = childrenUl.style.display === 'none';
          childrenUl.style.display = isCollapsed ? 'block' : 'none';
          icon.textContent = isCollapsed ? '📂' : '📁';
        });

      } else {
        icon.textContent = '📄';
        titleDiv.appendChild(icon);
        titleDiv.appendChild(text);
        li.appendChild(titleDiv);

        titleDiv.addEventListener('click', (e) => {
          e.stopPropagation();
          window.location.hash = '#/' + encodeURIComponent(node.path);
          if (window.innerWidth <= 768) sidebar.classList.remove('mobile-open');
        });
      }
      ul.appendChild(li);
    });

    return ul;
  }

  async function loadContent(path) {
    activePathSpan.textContent = '/' + path;
    
    // Set document title
    const fileName = path.includes('/') ? path.substring(path.lastIndexOf('/') + 1) : path;
    const cleanName = fileName.replace('.md', '');
    document.title = `${cleanName} | CTF-Writeups Web`;

    markdownBody.innerHTML = '<div style="text-align:center;color:var(--text-muted);margin-top:50px;">Loading... ⚡</div>';
    
    try {
      // Fetch the markdown file directly relative to the server/root page
      const res = await fetch('content/' + encodeURI(path));
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      let content = await res.text();
      
      // Basic Obsidian image parsing ![[image.png]]
      content = content.replace(/!\[\[(.*?)\]\]/g, '![Obsidian Image]($1)');
      
      const htmlContent = marked.parse(content);
      markdownBody.innerHTML = `<div class="fade-in">${htmlContent}</div>`;
      
      // Decorate code blocks
      decorateCodeBlocks();
      
      // Highlight and expand sidebar parents
      expandSidebarToPath(path);

    } catch (e) {
      console.error(e);
      markdownBody.innerHTML = `<div style="color:var(--red);text-align:center;"><h2>Connection Error</h2><p>Could not fetch file: "${path}".</p></div>`;
    }
  }

  function expandSidebarToPath(path) {
    // Clear any existing active class
    document.querySelectorAll('.nav-title.active').forEach(el => el.classList.remove('active'));
    
    const targetEl = document.querySelector(`.nav-title[data-path="${CSS.escape(path)}"]`);
    if (!targetEl) return;
    
    targetEl.classList.add('active');
    
    // Traverse up and expand parent folders
    let parent = targetEl.parentElement; // the <li>
    while (parent && parent.id !== 'nav-container') {
      if (parent.tagName === 'LI') {
        const childUl = parent.querySelector('ul');
        if (childUl) {
          childUl.style.display = 'block';
          const folderTitle = parent.querySelector('.nav-title');
          if (folderTitle) {
            const icon = folderTitle.querySelector('.icon');
            if (icon) icon.textContent = '📂';
          }
        }
      } else if (parent.tagName === 'UL') {
        parent.style.display = 'block';
        const folderLi = parent.parentElement;
        if (folderLi && folderLi.tagName === 'LI') {
          const folderTitle = folderLi.querySelector('.nav-title');
          if (folderTitle) {
            const icon = folderTitle.querySelector('.icon');
            if (icon) icon.textContent = '📂';
          }
        }
      }
      parent = parent.parentElement;
    }
    
    // Scroll active item smoothly into view
    targetEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function decorateCodeBlocks() {
    document.querySelectorAll('.markdown-body pre').forEach(pre => {
      if (pre.parentElement.classList.contains('code-content')) return;

      const codeEl = pre.querySelector('code');
      let lang = 'bash';
      if (codeEl && codeEl.className) {
        const match = codeEl.className.match(/language-(\w+)/);
        if (match) lang = match[1];
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'custom-code-block';

      const header = document.createElement('div');
      header.className = 'code-header';

      const leftGroup = document.createElement('div');
      leftGroup.className = 'left-group';

      const windowControls = document.createElement('div');
      windowControls.className = 'window-controls';
      windowControls.innerHTML = '<div class="ctrl red"></div><div class="ctrl yellow"></div><div class="ctrl green"></div>';
      
      const langLabel = document.createElement('div');
      langLabel.className = 'lang-label';
      langLabel.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>` + lang;

      leftGroup.appendChild(windowControls);
      leftGroup.appendChild(langLabel);

      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span>COPY</span>`;
      
      copyBtn.onclick = () => {
        const textToCopy = codeEl ? codeEl.innerText : pre.innerText;
        navigator.clipboard.writeText(textToCopy);
        copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> <span class="copied" style="color:var(--green)">COPIED</span>`;
        setTimeout(() => {
          copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span>COPY</span>`;
        }, 2000);
      };

      header.appendChild(leftGroup);
      header.appendChild(copyBtn);

      wrapper.appendChild(header);
      
      pre.parentNode.insertBefore(wrapper, pre);
      
      const codeContent = document.createElement('div');
      codeContent.className = 'code-content';
      codeContent.appendChild(pre);
      wrapper.appendChild(codeContent);
    });
  }

  fetchTree();
});
