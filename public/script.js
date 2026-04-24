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
      
    } catch (e) {
      console.error(e);
      markdownBody.innerHTML = `<div style="color:var(--red);text-align:center;"><h2>Connection Error</h2><p>Could not fetch file.</p></div>`;
    }
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
