document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.getElementById('nav-container');
  const markdownBody = document.getElementById('markdown-body');
  const activePathSpan = document.getElementById('active-path');
  const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
  const sidebar = document.getElementById('sidebar');
  const resizer = document.getElementById('resizer');

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
    // Don't drag if sidebar is hidden
    if (sidebar.classList.contains('collapsed')) return;
    
    let newWidth = e.clientX;
    // Apply constraints dynamically if mouse goes extremely far
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
      // Mobile behavior
      sidebar.classList.toggle('mobile-open');
    } else {
      // Desktop behavior
      sidebar.classList.toggle('collapsed');
      if (sidebar.classList.contains('collapsed')) {
        resizer.style.display = 'none';
      } else {
        resizer.style.display = 'block';
      }
    }
  });

  // Fetch Tree
  async function fetchTree() {
    try {
      const res = await fetch('/api/tree');
      const tree = await res.json();
      navContainer.innerHTML = '';
      const ul = buildTreeUI(tree);
      navContainer.appendChild(ul);
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
        // Collapse by default
        childrenUl.style.display = 'none';
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
          document.querySelectorAll('.nav-title.active').forEach(el => el.classList.remove('active'));
          titleDiv.classList.add('active');
          loadContent(node.path);
          if (window.innerWidth <= 768) sidebar.classList.remove('mobile-open');
        });
      }
      ul.appendChild(li);
    });

    return ul;
  }

  async function loadContent(path) {
    activePathSpan.textContent = path;
    markdownBody.innerHTML = '<div style="text-align:center;color:var(--text-muted);margin-top:50px;">Loading... ⚡</div>';
    
    try {
      const res = await fetch(`/api/content?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      
      if (data.error) {
        markdownBody.innerHTML = `<div style="color:var(--red);text-align:center;"><h2>Error</h2><p>${data.error}</p></div>`;
        return;
      }

      markdownBody.innerHTML = `<div class="fade-in">${data.html}</div>`;
      
      decorateCodeBlocks();

    } catch (e) {
      console.error(e);
      markdownBody.innerHTML = `<div style="color:var(--red);text-align:center;"><h2>Connection Error</h2><p>Could not fetch file.</p></div>`;
    }
  }

  function decorateCodeBlocks() {
    document.querySelectorAll('.markdown-body pre').forEach(pre => {
      // Check if already decorated
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

  let lastTreeSource = "";
  setInterval(async () => {
      try {
          const res = await fetch('/api/tree');
          const txt = await res.text();
          if (lastTreeSource && lastTreeSource !== txt) {
              const activeEl = document.querySelector('.nav-title.active');
              const activePath = activeEl ? activeEl.dataset.path : null;
              
              lastTreeSource = txt;
              navContainer.innerHTML = '';
              const ul = buildTreeUI(JSON.parse(txt));
              navContainer.appendChild(ul);

              if (activePath) {
                  const newActive = document.querySelector(`.nav-title[data-path="${activePath}"]`);
                  if (newActive) newActive.classList.add('active');
              }
          } else {
              lastTreeSource = txt;
          }
      } catch(e){}
  }, 5000);
});
