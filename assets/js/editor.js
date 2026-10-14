/* ==========================================================================
   A-Book — Editor shell (Session 2)
   Layout, panels, panel navigation, page routing, canvas pan/zoom.
   No drag-drop, no resize, no blocks, no runtime yet.
   ========================================================================== */

(function () {
  'use strict';

  var Abook = window.Abook || {};

  /* ======================================================================
     Constants
     ====================================================================== */

  var PREVIEW_W = 1280;
  var PREVIEW_H = 720;
  var ZOOM_MIN = 0.25;
  var ZOOM_MAX = 2.5;
  var ZOOM_STEPS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5];

  /* ======================================================================
     Local state
     ====================================================================== */

  var state = null;
  var project = null;
  var spaceHeld = false;
  var isPanning = false;
  var panStartClientX = 0;
  var panStartClientY = 0;
  var panStartPanX = 0;
  var panStartPanY = 0;
  var currentPreviewDoc = '';

  /* ======================================================================
     Entry
     ====================================================================== */

  Abook.ready(function () {
    var projectId = readProjectIdFromUrl();
    if (!projectId) return redirectToDashboard();

    project = Abook.getProject(projectId);
    if (!project) return redirectToDashboard();

    ensureProjectShape(project);

    state = window.AbookState = {
      projectId: project.id,
      activePageId: (project.pages[0] && project.pages[0].id) || null,
      selectedElementId: null,
      zoom: 1,
      panX: 0,
      panY: 0,
      history: [],
      clipboard: null
    };

    /* Fire-and-forget sync so peers/tools reading AbookState get it. */
    document.dispatchEvent(new CustomEvent('ab:ready', { detail: { state: state } }));

    initHeader();
    initSidebarTabs();
    initSidebarContent();
    initPageTabs();
    initCanvasInteractions();
    initCanvasToolbar();
    initCodeDialog();
    initDrawers();
    initTooltips();
    initGlobalKeys();
    initSelectionOverlay();
    initIframeBridge();
    initElementDnD();
    initPropertiesPanel();
    initBlocksPanel();
    initHistory();
    initAutosave();
    initExportDialog();
    initPreviewModal();
    initKeyboardShortcuts();

    if (window.ab && typeof window.ab.installDefaults === 'function') {
      window.ab.installDefaults();
    }

    renderProjectName();
    renderPageTabs();
    buildPreviewDocument();
    updateZoomUI();

    /* Initial history snapshot so the first undo returns to the loaded state. */
    History.reset(captureActiveState());
    updateUndoRedoButtons();

    window.requestAnimationFrame(function () {
      fitToCanvas(true);
    });

    var iframe = document.getElementById('ab-preview');
    if (iframe) {
      iframe.addEventListener('load', function () { /* placeholder */ });
    }
  });

  /* ======================================================================
     URL routing
     ====================================================================== */

  function readProjectIdFromUrl() {
    try {
      var params = new URLSearchParams(window.location.search);
      var id = params.get('id');
      return id && id.trim() ? id.trim() : null;
    } catch (err) {
      return null;
    }
  }

  function redirectToDashboard() {
    window.location.replace('dashboard.html');
  }

  /* ======================================================================
     Project shape — guarantees pages[] exists with at least one page
     ====================================================================== */

  function ensureProjectShape(p) {
    if (!Array.isArray(p.pages) || p.pages.length === 0) {
      p.pages = [makeNewPage('Halaman 1', true)];
      Abook.saveProject(p);
      return;
    }
    /* Ensure every page has required fields */
    var hasHome = false;
    for (var i = 0; i < p.pages.length; i++) {
      var page = p.pages[i];
      if (!page.id) page.id = Abook.uid('pg');
      if (!page.name) page.name = 'Halaman ' + (i + 1);
      if (!('html' in page)) page.html = '';
      if (!('css' in page)) page.css = '';
      if (page.home) hasHome = true;
    }
    if (!hasHome) p.pages[0].home = true;
  }

  function makeNewPage(name, home) {
    return {
      id: Abook.uid('pg'),
      name: name || 'Halaman Baru',
      html: '',
      css: '',
      home: !!home
    };
  }

  function getActivePage() {
    if (!project || !project.pages) return null;
    for (var i = 0; i < project.pages.length; i++) {
      if (project.pages[i].id === state.activePageId) return project.pages[i];
    }
    return project.pages[0] || null;
  }

  /* ======================================================================
     Header
     ====================================================================== */

  function initHeader() {
    var nameInput = document.getElementById('project-name');
    if (nameInput) {
      nameInput.value = project.name || 'Project';

      nameInput.addEventListener('change', commitName);
      nameInput.addEventListener('blur', commitName);
      nameInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          nameInput.blur();
        }
        if (event.key === 'Escape') {
          nameInput.value = project.name || 'Project';
          nameInput.blur();
        }
      });
    }

    var undoBtn = document.getElementById('btn-undo');
    var redoBtn = document.getElementById('btn-redo');

    if (undoBtn) {
      undoBtn.addEventListener('click', function () {
        showToast('Undo belum tersedia di sesi ini.');
      });
    }
    if (redoBtn) {
      redoBtn.addEventListener('click', function () {
        showToast('Redo belum tersedia di sesi ini.');
      });
    }

    initZoomDropdown();

    var previewBtn = document.getElementById('btn-preview');
    if (previewBtn) {
      previewBtn.addEventListener('click', togglePreviewMode);
    }

    var exportBtn = document.getElementById('btn-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', function () {
        showToast('Ekspor ZIP akan tersedia setelah sesi runtime.');
      });
    }
  }

  function commitName() {
    var input = document.getElementById('project-name');
    if (!input) return;
    var next = (input.value || '').trim() || 'Project';
    if (next === project.name) return;
    project.name = next;
    input.value = next;
    Abook.saveProject(project);
    document.title = 'A-Book — ' + next;
  }

  function renderProjectName() {
    var input = document.getElementById('project-name');
    if (input) input.value = project.name || 'Project';
    document.title = 'A-Book — ' + (project.name || 'Project');
  }

  /* ---------- Zoom dropdown ---------- */

  function initZoomDropdown() {
    var trigger = document.getElementById('btn-zoom');
    var menu = document.getElementById('zoom-menu');
    if (!trigger || !menu) return;

    trigger.addEventListener('click', function (event) {
      event.stopPropagation();
      toggleZoomMenu();
    });

    var items = menu.querySelectorAll('[data-zoom]');
    Array.prototype.forEach.call(items, function (item) {
      item.addEventListener('click', function () {
        var value = parseFloat(item.getAttribute('data-zoom'));
        if (!isNaN(value)) setZoom(value);
        closeZoomMenu();
      });
    });

    document.addEventListener('click', function (event) {
      if (menu.hidden) return;
      if (event.target.closest('.ab-zoom-wrap')) return;
      closeZoomMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !menu.hidden) {
        closeZoomMenu();
      }
    });
  }

  function toggleZoomMenu() {
    var menu = document.getElementById('zoom-menu');
    var trigger = document.getElementById('btn-zoom');
    if (!menu || !trigger) return;

    if (menu.hidden) {
      menu.hidden = false;
      syncZoomMenuActive();
      window.requestAnimationFrame(function () {
        menu.classList.add('is-open');
      });
      trigger.setAttribute('aria-expanded', 'true');
    } else {
      closeZoomMenu();
    }
  }

  function closeZoomMenu() {
    var menu = document.getElementById('zoom-menu');
    var trigger = document.getElementById('btn-zoom');
    if (!menu) return;
    if (menu.hidden) return;
    menu.classList.remove('is-open');
    trigger && trigger.setAttribute('aria-expanded', 'false');
    window.setTimeout(function () {
      if (!menu.classList.contains('is-open')) menu.hidden = true;
    }, 150);
  }

  function syncZoomMenuActive() {
    var menu = document.getElementById('zoom-menu');
    if (!menu) return;
    var items = menu.querySelectorAll('[data-zoom]');
    Array.prototype.forEach.call(items, function (item) {
      var value = parseFloat(item.getAttribute('data-zoom'));
      item.classList.toggle('is-active', Math.abs(value - state.zoom) < 0.01);
    });
  }

  /* ======================================================================
     Sidebar tabs
     ====================================================================== */

  function initSidebarTabs() {
    var tabs = document.querySelectorAll('.ab-sidebar-tab');
    Array.prototype.forEach.call(tabs, function (tab) {
      tab.addEventListener('click', function () {
        var name = tab.getAttribute('data-tab');
        if (name) switchSidebarTab(name);
      });

      tab.addEventListener('keydown', function (event) {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault();
        var list = Array.prototype.slice.call(tabs);
        var idx = list.indexOf(tab);
        var delta = event.key === 'ArrowRight' ? 1 : -1;
        var next = list[(idx + delta + list.length) % list.length];
        next.focus();
        var name = next.getAttribute('data-tab');
        if (name) switchSidebarTab(name);
      });
    });
  }

  function switchSidebarTab(name) {
    var tabs = document.querySelectorAll('.ab-sidebar-tab');
    var panels = document.querySelectorAll('.ab-tabpanel');

    Array.prototype.forEach.call(tabs, function (tab) {
      var isActive = tab.getAttribute('data-tab') === name;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    Array.prototype.forEach.call(panels, function (panel) {
      var isActive = panel.getAttribute('data-panel') === name;

      if (isActive) {
        panel.hidden = false;
        panel.classList.remove('is-entering');
        /* Force reflow so the animation can replay */
        void panel.offsetWidth;
        panel.classList.add('is-entering');
      } else {
        panel.hidden = true;
        panel.classList.remove('is-entering');
      }
    });
  }

  /* ======================================================================
     Page tabs
     ====================================================================== */

  function initPageTabs() {
    var addBtn = document.getElementById('btn-add-page');
    if (addBtn) addBtn.addEventListener('click', addNewPage);

    var list = document.getElementById('page-tabs-list');
    if (list) {
      /* Delegated context menu */
      list.addEventListener('contextmenu', function (event) {
        var tab = event.target.closest('.ab-page-tab');
        if (!tab) return;
        event.preventDefault();
        var id = tab.getAttribute('data-page-id');
        if (id) openPageContextMenu(id, event.clientX, event.clientY);
      });
    }
  }

  function renderPageTabs() {
    var list = document.getElementById('page-tabs-list');
    if (!list) return;

    list.innerHTML = '';

    for (var i = 0; i < project.pages.length; i++) {
      var page = project.pages[i];
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ab-page-tab' + (page.id === state.activePageId ? ' is-active' : '');
      btn.setAttribute('data-page-id', page.id);
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', page.id === state.activePageId ? 'true' : 'false');
      btn.textContent = page.name || ('Halaman ' + (i + 1));
      if (page.home) btn.title = 'Halaman utama';
      list.appendChild(btn);
    }

    /* Delegated click, attached once */
    if (!list.dataset.bound) {
      list.dataset.bound = '1';
      list.addEventListener('click', function (event) {
        var tab = event.target.closest('.ab-page-tab');
        if (!tab) return;
        var id = tab.getAttribute('data-page-id');
        if (id && id !== state.activePageId) setActivePage(id);
      });
    }
  }

  function addNewPage() {
    var name = 'Halaman ' + (project.pages.length + 1);
    var page = makeNewPage(name, false);
    project.pages.push(page);
    Abook.saveProject(project);

    /* Session 6 — record page list change */
    commitStructuralChange();

    state.activePageId = page.id;
    renderPageTabs();
    buildPreviewDocument();
    showToast('Halaman "' + name + '" ditambahkan.');
  }

  function setActivePage(id) {
    state.activePageId = id;
    renderPageTabs();
    buildPreviewDocument();
  }

  /* ---------- Page context menu ---------- */

  var activePageMenu = null;

  function openPageContextMenu(pageId, clientX, clientY) {
    closePageContextMenu();

    var menu = document.createElement('div');
    menu.className = 'ab-zoom-menu is-open';
    menu.style.position = 'fixed';
    menu.style.left = clientX + 'px';
    menu.style.top = clientY + 'px';
    menu.style.right = 'auto';
    menu.style.transform = 'none';
    menu.style.zIndex = '500';
    menu.setAttribute('role', 'menu');

    var items = [
      { label: 'Ubah nama',    fn: function () { renamePage(pageId); } },
      { label: 'Duplikat',     fn: function () { duplicatePage(pageId); } },
      { label: 'Jadikan Home', fn: function () { setHomePage(pageId); } },
      { label: 'Hapus',        fn: function () { deletePage(pageId); }, danger: true }
    ];

    for (var i = 0; i < items.length; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ab-zoom-menu__item' + (items[i].danger ? ' is-danger' : '');
      btn.setAttribute('role', 'menuitem');
      btn.textContent = items[i].label;
      (function (fn) {
        btn.addEventListener('click', function () {
          closePageContextMenu();
          fn();
        });
      })(items[i].fn);
      menu.appendChild(btn);
    }

    document.body.appendChild(menu);
    activePageMenu = menu;

    /* Keep inside viewport */
    var rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth - 8) {
      menu.style.left = (window.innerWidth - rect.width - 8) + 'px';
    }
    if (rect.bottom > window.innerHeight - 8) {
      menu.style.top = (window.innerHeight - rect.height - 8) + 'px';
    }
  }

  function closePageContextMenu() {
    if (!activePageMenu) return;
    var m = activePageMenu;
    activePageMenu = null;
    if (m.parentNode) m.parentNode.removeChild(m);
  }

  function findPageIndex(id) {
    for (var i = 0; i < project.pages.length; i++) {
      if (project.pages[i].id === id) return i;
    }
    return -1;
  }

  function renamePage(id) {
    var idx = findPageIndex(id);
    if (idx < 0) return;
    var current = project.pages[idx];
    var next = window.prompt('Nama halaman:', current.name || '');
    if (next === null) return;
    var trimmed = next.trim();
    if (!trimmed) return;
    current.name = trimmed;
    Abook.saveProject(project);
    renderPageTabs();
    commitStructuralChange();
  }

  function duplicatePage(id) {
    var idx = findPageIndex(id);
    if (idx < 0) return;
    var src = project.pages[idx];
    var copy = {
      id: Abook.uid('pg'),
      name: (src.name || 'Halaman') + ' (Salinan)',
      html: src.html || '',
      css: src.css || '',
      home: false
    };
    project.pages.splice(idx + 1, 0, copy);
    Abook.saveProject(project);
    commitStructuralChange();
    state.activePageId = copy.id;
    renderPageTabs();
    buildPreviewDocument();
    showToast('Halaman diduplikasi.');
  }

  function deletePage(id) {
    if (project.pages.length <= 1) {
      showToast('Minimal harus ada satu halaman.');
      return;
    }
    var idx = findPageIndex(id);
    if (idx < 0) return;

    var removed = project.pages[idx];
    var wasHome = !!removed.home;
    project.pages.splice(idx, 1);

    if (wasHome && project.pages[0]) project.pages[0].home = true;

    if (state.activePageId === id) {
      state.activePageId = project.pages[Math.min(idx, project.pages.length - 1)].id;
    }

    Abook.saveProject(project);
    commitStructuralChange();
    renderPageTabs();
    buildPreviewDocument();
    showToast('Halaman dihapus.');
  }

  function setHomePage(id) {
    for (var i = 0; i < project.pages.length; i++) {
      project.pages[i].home = project.pages[i].id === id;
    }
    Abook.saveProject(project);
    commitStructuralChange();
    renderPageTabs();
    showToast('Halaman utama diperbarui.');
  }

  /* ======================================================================
     Canvas — pan, zoom, transform
     ====================================================================== */

  function initCanvasInteractions() {
    var canvas = document.getElementById('canvas');
    if (!canvas) return;

    /* Space-held pan mode */
    document.addEventListener('keydown', function (event) {
      if (event.code === 'Space' && !isTypingTarget(event.target)) {
        if (!spaceHeld) {
          spaceHeld = true;
          canvas.classList.add('is-space-held');
        }
        /* Prevent page scroll while space is held */
        if (!event.repeat) event.preventDefault();
      }
    });

    document.addEventListener('keyup', function (event) {
      if (event.code === 'Space') {
        spaceHeld = false;
        canvas.classList.remove('is-space-held');
      }
    });

    /* Blur clears held space to avoid sticky state */
    window.addEventListener('blur', function () {
      spaceHeld = false;
      canvas.classList.remove('is-space-held');
    });

    /* Pointer drag */
    canvas.addEventListener('pointerdown', function (event) {
      var wantsPan = event.button === 1 || (event.button === 0 && spaceHeld);
      if (!wantsPan) return;

      event.preventDefault();
      isPanning = true;
      panStartClientX = event.clientX;
      panStartClientY = event.clientY;
      panStartPanX = state.panX;
      panStartPanY = state.panY;
      canvas.classList.add('is-panning');

      try { canvas.setPointerCapture(event.pointerId); } catch (err) { /* noop */ }
    });

    canvas.addEventListener('pointermove', function (event) {
      if (!isPanning) return;
      state.panX = panStartPanX + (event.clientX - panStartClientX);
      state.panY = panStartPanY + (event.clientY - panStartClientY);
      applyCanvasTransform();
    });

    function endPan(event) {
      if (!isPanning) return;
      isPanning = false;
      canvas.classList.remove('is-panning');
      try { canvas.releasePointerCapture(event.pointerId); } catch (err) { /* noop */ }
    }

    canvas.addEventListener('pointerup', endPan);
    canvas.addEventListener('pointercancel', endPan);

    /* Prevent middle-click default (auto-scroll) */
    canvas.addEventListener('auxclick', function (event) {
      if (event.button === 1) event.preventDefault();
    });

    /* Ctrl/Cmd + wheel zoom-to-cursor */
    canvas.addEventListener('wheel', function (event) {
      if (!(event.ctrlKey || event.metaKey)) return;
      event.preventDefault();
      zoomAtPoint(event.clientX, event.clientY, event.deltaY);
    }, { passive: false });
  }

  function applyCanvasTransform() {
    var inner = document.getElementById('canvas-inner');
    if (!inner) return;
    inner.style.transform =
      'translate(-50%, -50%) translate(' + state.panX + 'px, ' + state.panY + 'px)' +
      ' scale(' + state.zoom + ')';
  }

  function zoomAtPoint(clientX, clientY, deltaY) {
    var canvas = document.getElementById('canvas');
    if (!canvas) return;

    var rect = canvas.getBoundingClientRect();
    var cx = clientX - rect.left - rect.width / 2;
    var cy = clientY - rect.top - rect.height / 2;

    var oldZoom = state.zoom;
    var factor = Math.exp(-deltaY * 0.0015);
    var next = clamp(oldZoom * factor, ZOOM_MIN, ZOOM_MAX);
    next = Math.round(next * 100) / 100;

    if (next === oldZoom) return;

    /* Keep the point under the cursor anchored */
    var k = next / oldZoom;
    state.panX = cx - (cx - state.panX) * k;
    state.panY = cy - (cy - state.panY) * k;
    state.zoom = next;

    applyCanvasTransform();
    updateZoomUI();
    syncZoomMenuActive();
  }

  function setZoom(value) {
    var next = clamp(value, ZOOM_MIN, ZOOM_MAX);
    state.zoom = Math.round(next * 100) / 100;
    applyCanvasTransform();
    updateZoomUI();
    syncZoomMenuActive();
  }

  function updateZoomUI() {
    var pct = Math.round(state.zoom * 100) + '%';
    var header = document.getElementById('zoom-display');
    var toolbar = document.getElementById('toolbar-zoom-label');
    if (header) header.textContent = pct;
    if (toolbar) toolbar.textContent = pct;
  }

  function fitToCanvas(silent) {
    var canvas = document.getElementById('canvas');
    if (!canvas) return;

    var rect = canvas.getBoundingClientRect();
    var padding = 64;
    var availW = Math.max(160, rect.width - padding);
    var availH = Math.max(90, rect.height - padding);

    var fit = Math.min(availW / PREVIEW_W, availH / PREVIEW_H);
    fit = clamp(fit, ZOOM_MIN, 1);
    fit = Math.round(fit * 100) / 100;

    state.zoom = fit;
    state.panX = 0;
    state.panY = 0;

    applyCanvasTransform();
    updateZoomUI();
    syncZoomMenuActive();

    if (!silent) showToast('Diperkecil agar muat layar.');
  }

  /* ======================================================================
     Canvas toolbar
     ====================================================================== */

  function initCanvasToolbar() {
    var out = document.getElementById('btn-zoom-out');
    var inn = document.getElementById('btn-zoom-in');
    var fit = document.getElementById('btn-fit');
    var code = document.getElementById('btn-code');
    var label = document.getElementById('toolbar-zoom-label');

    if (out) out.addEventListener('click', function () { stepZoom(-1); });
    if (inn) inn.addEventListener('click', function () { stepZoom(1); });
    if (fit) fit.addEventListener('click', function () { fitToCanvas(false); });
    if (code) code.addEventListener('click', openCodeDialog);
    if (label) label.addEventListener('click', function () { setZoom(1); });
  }

  function stepZoom(direction) {
    var z = state.zoom;
    var next;

    if (direction > 0) {
      next = ZOOM_MAX;
      for (var i = 0; i < ZOOM_STEPS.length; i++) {
        if (ZOOM_STEPS[i] > z + 0.001) { next = ZOOM_STEPS[i]; break; }
      }
    } else {
      next = ZOOM_MIN;
      for (var j = ZOOM_STEPS.length - 1; j >= 0; j--) {
        if (ZOOM_STEPS[j] < z - 0.001) { next = ZOOM_STEPS[j]; break; }
      }
    }

    setZoom(next);
  }

  /* ======================================================================
     Preview iframe document
     ====================================================================== */

  function buildPreviewDocument() {
    var iframe = document.getElementById('ab-preview');
    if (!iframe) return;

    var page = getActivePage();
    var theme = project.theme || {};

    var doc = '';
    doc += '<!DOCTYPE html>';
    doc += '<html lang="id"><head>';
    doc += '<meta charset="UTF-8">';
    doc += '<meta name="viewport" content="width=device-width, initial-scale=1">';
    doc += '<style>' + previewBaseCss(theme) + '</style>';
    if (page && page.css) doc += '<style>' + page.css + '</style>';
    doc += '</head><body>';

    if (page && page.html) {
      doc += page.html;
    } else {
      doc += '<div class="ab-pv-empty">'
          +   '<div class="ab-pv-empty__title">Halaman kosong</div>'
          +   '<div class="ab-pv-empty__text">Editor elemen akan tersedia pada sesi berikutnya.</div>'
          + '</div>';
    }

    // -------------------------------------------------------------
    // CHANGE 1: INJECT THE RUNTIME SCRIPT
    // -------------------------------------------------------------
    doc += '<script>' + (Abook.RuntimeSource || '') + '</script>';
    doc += '</body></html>';

    // -------------------------------------------------------------
    // CHANGE 2: SET SRCDOC & QUEUE PROGRAMS
    // -------------------------------------------------------------
    currentPreviewDoc = doc;
    iframe.srcdoc = doc;
    
        /* After the iframe settles, run enter animations on first paint. */
    iframe.addEventListener('load', function () {
      /* The runtime announces itself via postMessage; we do nothing here.
         This listener is only kept as a placeholder in case downstream
         sessions need to hook element enter/exit animations. */
    }, { once: true });
    // After the runtime boots inside the iframe, it will post an 'ab:ready' 
    // message. Our `initIframeBridge()` listener catches this, sets `iframeReady = true`, 
    // and then flushes the queue via `syncProgramsToRuntime()`.

  }

  function previewBaseCss(theme) {
    var bg = (theme && theme.bg) || '#020012';
    var fg = (theme && theme.fg) || '#F5F5F7';

    return [
      '*,*::before,*::after{box-sizing:border-box;}',
      'html,body{margin:0;padding:0;height:100%;}',
      'body{',
      '  background:' + bg + ';',
      '  color:' + fg + ';',
      '  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,Arial,sans-serif;',
      '  display:flex;align-items:center;justify-content:center;',
      '  min-height:100%;',
      '}',
      '.ab-pv-empty{',
      '  text-align:center;',
      '  color:rgba(245,245,247,0.55);',
      '  padding:48px;',
      '  max-width:520px;',
      '}',
      '.ab-pv-empty__title{',
      '  font-size:16px;font-weight:600;letter-spacing:-0.01em;',
      '  color:#F5F5F7;margin-bottom:8px;',
      '}',
      '.ab-pv-empty__text{',
      '  font-size:13px;line-height:1.55;',
      '}'
    ].join('\n');
  }

  /* ======================================================================
     Code dialog
     ====================================================================== */

  function initCodeDialog() {
    var dialog = document.getElementById('code-dialog');
    if (!dialog) return;

    var closers = dialog.querySelectorAll('[data-dialog-close]');
    Array.prototype.forEach.call(closers, function (el) {
      el.addEventListener('click', closeCodeDialog);
    });

    var copyBtn = document.getElementById('btn-copy-code');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var out = document.getElementById('code-output');
        if (!out) return;
        copyToClipboard(out.textContent || '');
      });
    }
  }

  function openCodeDialog() {
    var dialog = document.getElementById('code-dialog');
    var out = document.getElementById('code-output');
    if (!dialog || !out) return;

    out.textContent = currentPreviewDoc || '';

    dialog.hidden = false;
    window.requestAnimationFrame(function () {
      dialog.classList.add('is-open');
    });

    var closeBtn = dialog.querySelector('[data-dialog-close].ab-icon-btn');
    if (closeBtn) closeBtn.focus();
  }

  function closeCodeDialog() {
    var dialog = document.getElementById('code-dialog');
    if (!dialog || dialog.hidden) return;

    dialog.classList.remove('is-open');
    window.setTimeout(function () {
      if (!dialog.classList.contains('is-open')) dialog.hidden = true;
    }, 260);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast('Kode disalin.');
      }, function () {
        showToast('Gagal menyalin kode.');
      });
      return;
    }

    /* Fallback */
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showToast('Kode disalin.'); }
    catch (err) { showToast('Gagal menyalin kode.'); }
    document.body.removeChild(ta);
  }

  /* ======================================================================
     Preview mode toggle
     ====================================================================== */

  function togglePreviewMode() {
    var editor = document.getElementById('ab-editor');
    if (!editor) return;
    var on = editor.classList.toggle('is-previewing');
    document.body.classList.toggle('is-previewing', on);

    /* Recenter + fit when returning to normal */
    if (!on) {
      window.requestAnimationFrame(function () { fitToCanvas(true); });
    }
  }

  /* ======================================================================
     Drawers (tablet / mobile)
     ====================================================================== */

  function initDrawers() {
    var leftTrigger = document.getElementById('btn-menu-left');
    var rightTrigger = document.getElementById('btn-menu-right');
    var backdrop = document.getElementById('drawer-backdrop');
    var panelLeft = document.getElementById('panel-left');
    var panelRight = document.getElementById('panel-right');

    if (leftTrigger) {
      leftTrigger.addEventListener('click', function () {
        toggleDrawer(panelLeft, panelRight);
      });
    }

    if (rightTrigger) {
      rightTrigger.addEventListener('click', function () {
        toggleDrawer(panelRight, panelLeft);
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeAllDrawers);
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeAllDrawers();
    });
  }

  function toggleDrawer(target, other) {
    if (!target) return;
    var willOpen = !target.classList.contains('is-open');
    if (other) other.classList.remove('is-open');

    var backdrop = document.getElementById('drawer-backdrop');

    if (willOpen) {
      target.classList.add('is-open');
      if (backdrop) {
        backdrop.hidden = false;
        window.requestAnimationFrame(function () {
          backdrop.classList.add('is-open');
        });
      }
    } else {
      target.classList.remove('is-open');
      hideBackdropIfNoDrawers();
    }
  }

  function closeAllDrawers() {
    var left = document.getElementById('panel-left');
    var right = document.getElementById('panel-right');
    if (left) left.classList.remove('is-open');
    if (right) right.classList.remove('is-open');

    var backdrop = document.getElementById('drawer-backdrop');
    if (backdrop) {
      backdrop.classList.remove('is-open');
      window.setTimeout(function () { backdrop.hidden = true; }, 260);
    }
  }

  function hideBackdropIfNoDrawers() {
    var left = document.getElementById('panel-left');
    var right = document.getElementById('panel-right');
    var open = (left && left.classList.contains('is-open')) ||
               (right && right.classList.contains('is-open'));
    if (open) return;

    var backdrop = document.getElementById('drawer-backdrop');
    if (!backdrop) return;
    backdrop.classList.remove('is-open');
    window.setTimeout(function () { backdrop.hidden = true; }, 260);
  }

  /* ======================================================================
     Tooltips (JS-driven floating element — avoids overflow clipping)
     ====================================================================== */

  function initTooltips() {
    var tip = document.createElement('div');
    tip.className = 'ab-tooltip';
    tip.setAttribute('role', 'tooltip');
    tip.setAttribute('aria-hidden', 'true');
    document.body.appendChild(tip);

    var showTimer = null;
    var activeEl = null;

    function show(target) {
      tip.textContent = target.getAttribute('data-tooltip') || '';
      if (!tip.textContent) return;

      tip.classList.remove('is-visible');
      /* Measure with content in place */
      tip.style.left = '-9999px';
      tip.style.top = '-9999px';
      tip.classList.add('is-visible');

      var rect = target.getBoundingClientRect();
      var tRect = tip.getBoundingClientRect();

      var top = rect.top - tRect.height - 8;
      var left = rect.left + rect.width / 2 - tRect.width / 2;

      if (top < 8) top = rect.bottom + 8;
      if (left < 8) left = 8;
      if (left + tRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tRect.width - 8;
      }

      tip.style.left = left + 'px';
      tip.style.top  = top  + 'px';
    }

    function hide() {
      tip.classList.remove('is-visible');
    }

    document.addEventListener('pointerover', function (event) {
      var target = event.target.closest('[data-tooltip]');
      if (!target || target === activeEl) return;
      if (target.disabled) return;

      activeEl = target;
      if (showTimer) window.clearTimeout(showTimer);
      showTimer = window.setTimeout(function () { show(target); }, 320);
    });

    document.addEventListener('pointerout', function (event) {
      var target = event.target.closest('[data-tooltip]');
      if (!target || target !== activeEl) return;
      activeEl = null;
      if (showTimer) window.clearTimeout(showTimer);
      hide();
    });

    document.addEventListener('pointerdown', function () {
      if (showTimer) window.clearTimeout(showTimer);
      hide();
    });

    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
  }

  /* ======================================================================
     Ripple feedback for icon buttons + pill buttons
     ====================================================================== */

  function initRipples() {
    document.addEventListener('pointerdown', function (event) {
      var target = event.target.closest('.ab-icon-btn, .ab-btn, [data-ripple]');
      if (!target) return;
      if (target.disabled) return;
      emitRipple(target, event.clientX, event.clientY);
    });
  }

  function emitRipple(el, clientX, clientY) {
    var rect = el.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height) * 2;

    var ripple = document.createElement('span');
    ripple.className = 'ab-ripple';
    ripple.style.width  = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left   = (clientX - rect.left - size / 2) + 'px';
    ripple.style.top    = (clientY - rect.top  - size / 2) + 'px';

    el.appendChild(ripple);
    window.setTimeout(function () {
      if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
    }, 420);
  }

  /* ======================================================================
     Global keyboard
     ====================================================================== */

  function initGlobalKeys() {
    document.addEventListener('keydown', function (event) {
      var typing = isTypingTarget(event.target);

      /* Undo / Redo — routed to history engine later */
      if (!typing && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        showToast(event.shiftKey ? 'Redo belum tersedia di sesi ini.'
                                 : 'Undo belum tersedia di sesi ini.');
        return;
      }

      /* Fit */
      if (!typing && event.key === '0' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        fitToCanvas(false);
        return;
      }

      /* Reset zoom */
      if (!typing && event.key === '1' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        setZoom(1);
        return;
      }

      /* Close surfaces on Escape */
      if (event.key === 'Escape') {
        closeZoomMenu();
        closePageContextMenu();
        closeCodeDialog();
      }
    });

    document.addEventListener('click', function (event) {
      if (!activePageMenu) return;
      if (event.target.closest('.ab-zoom-menu')) return;
      closePageContextMenu();
    });
  }

  function isTypingTarget(el) {
    if (!el) return false;
    var tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
  }

  /* ======================================================================
     Toast
     ====================================================================== */

  var toastTimer = null;

  function showToast(message) {
    var el = document.getElementById('toast');
    if (!el) return;

    el.textContent = message;
    el.hidden = false;

    window.requestAnimationFrame(function () {
      el.classList.add('is-visible');
    });

    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      el.classList.remove('is-visible');
      window.setTimeout(function () { el.hidden = true; }, 260);
    }, 2200);
  }

  /* ======================================================================
     Utilities
     ====================================================================== */

  function clamp(value, min, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  /* Expose for later sessions */
  Abook.Editor = {
    getState: function () { return state; },
    getProject: function () { return project; },
    applyCanvasTransform: applyCanvasTransform,
    fitToCanvas: fitToCanvas,
    setZoom: setZoom,
    showToast: showToast

  }

    /* ======================================================================
     Session 3 — sidebar content (templates + elements)
     ====================================================================== */

  function initSidebarContent() {
    renderTemplatesPanel();
    renderElementsPanel();
    renderPagesPanel();
  }

  /* ---------- Templates ---------- */

  function renderTemplatesPanel() {
    var panel = document.getElementById('panel-template');
    if (!panel) return;

    var tpl = Abook.Templates;
    if (!tpl || !tpl.list || !tpl.list.length) {
      panel.innerHTML = '<div class="ab-empty-list"><p class="ab-empty-list__text">Belum ada item</p></div>';
      return;
    }

    var grid = document.createElement('div');
    grid.className = 'ab-tpl-grid';

    for (var i = 0; i < tpl.list.length; i++) {
      grid.appendChild(buildTemplateCard(tpl.list[i]));
    }

    panel.innerHTML = '';
    panel.appendChild(grid);
    Abook.renderIcons(panel);
  }

  function buildTemplateCard(template) {
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'ab-tpl-card';
    card.setAttribute('data-template-id', template.id);
    card.setAttribute('aria-label', 'Template ' + template.name);

    var preview = document.createElement('div');
    preview.className = 'ab-tpl-card__preview';

    var inner = document.createElement('div');
    inner.className = 'ab-tpl-card__preview-inner';
    inner.innerHTML = template.thumb || '';
    preview.appendChild(inner);

    var icon = document.createElement('span');
    icon.className = 'ab-tpl-card__icon';
    icon.innerHTML = '<i data-lucide="' + template.icon + '" aria-hidden="true"></i>';
    preview.appendChild(icon);

    var title = document.createElement('span');
    title.className = 'ab-tpl-card__title';
    title.textContent = template.name;

    card.appendChild(preview);
    card.appendChild(title);

    card.addEventListener('click', function () {
      showToast('Template "' + template.name + '" siap. Drag ke kanvas pada sesi berikutnya.');
    });

    return card;
  }

  /* ---------- Elements ---------- */

  function renderElementsPanel() {
    var panel = document.getElementById('panel-element');
    if (!panel) return;

    var lib = Abook.Elements;
    if (!lib || !lib.list || !lib.list.length) {
      panel.innerHTML = '<div class="ab-empty-list"><p class="ab-empty-list__text">Belum ada item</p></div>';
      return;
    }

    var wrap = document.createElement('div');

    var search = document.createElement('div');
    search.className = 'ab-el-search';
    search.innerHTML =
      '<span class="ab-el-search__icon"><i data-lucide="search" aria-hidden="true"></i></span>' +
      '<input type="search" class="ab-el-search__input" id="el-search" placeholder="Cari elemen..." aria-label="Cari elemen">' +
      '<button type="button" class="ab-el-search__clear" id="el-search-clear" aria-label="Bersihkan"><i data-lucide="x" aria-hidden="true"></i></button>';

    wrap.appendChild(search);

    var cats = document.createElement('div');
    cats.className = 'ab-el-cats';
    cats.id = 'el-cats';
    wrap.appendChild(cats);

    panel.innerHTML = '';
    panel.appendChild(wrap);

    /* Build category sections */
    for (var i = 0; i < lib.categories.length; i++) {
      cats.appendChild(buildElementCategory(lib.categories[i], i === 0));
    }

    /* Wire search */
    var input = wrap.querySelector('#el-search');
    var clear = wrap.querySelector('#el-search-clear');

    if (input) {
      input.addEventListener('input', function () {
        search.classList.toggle('has-value', input.value.length > 0);
        filterElements(input.value);
      });
    }

    if (clear) {
      clear.addEventListener('click', function () {
        input.value = '';
        search.classList.remove('has-value');
        filterElements('');
        input.focus();
      });
    }

    Abook.renderIcons(panel);
  }

  function buildElementCategory(meta, openByDefault) {
    var lib = Abook.Elements;
    var items = lib.byCategory(meta.key);

    var section = document.createElement('section');
    section.className = 'ab-el-cat' + (openByDefault ? ' is-open' : '');
    section.setAttribute('data-category', meta.key);

    var head = document.createElement('button');
    head.type = 'button';
    head.className = 'ab-el-cat__head';
    head.setAttribute('aria-expanded', openByDefault ? 'true' : 'false');
    head.innerHTML =
      '<span class="ab-el-cat__icon"><i data-lucide="' + meta.icon + '" aria-hidden="true"></i></span>' +
      '<span class="ab-el-cat__label">' + meta.label + '</span>' +
      '<span class="ab-el-cat__count">' + items.length + '</span>' +
      '<span class="ab-el-cat__chev"><i data-lucide="chevron-down" aria-hidden="true"></i></span>';

    var body = document.createElement('div');
    body.className = 'ab-el-cat__body';

    var grid = document.createElement('div');
    grid.className = 'ab-el-cat__grid';

    for (var i = 0; i < items.length; i++) {
      grid.appendChild(buildElementItem(items[i]));
    }

    body.appendChild(grid);
    section.appendChild(head);
    section.appendChild(body);

    /* Animate open/close via max-height */
    syncCategoryHeight(section, openByDefault);

    head.addEventListener('click', function () {
      var isOpen = section.classList.toggle('is-open');
      head.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      syncCategoryHeight(section, isOpen);
    });

    return section;
  }

  function syncCategoryHeight(section, open) {
    var body = section.querySelector('.ab-el-cat__body');
    if (!body) return;

    if (open) {
      body.style.maxHeight = body.scrollHeight + 'px';
      /* After the transition completes, unclamp so dynamic content can grow */
      window.setTimeout(function () {
        if (section.classList.contains('is-open')) {
          body.style.maxHeight = 'none';
        }
      }, 300);
    } else {
      /* Re-clamp so collapse animates */
      body.style.maxHeight = body.scrollHeight + 'px';
      void body.offsetHeight;
      body.style.maxHeight = '0px';
    }
  }

  function buildElementItem(el) {
    var item = document.createElement('button');
    item.type = 'button';
    item.className = 'ab-el-item';
    item.setAttribute('data-element-id', el.id);
    item.setAttribute('data-element-name', el.name.toLowerCase());
    item.setAttribute('aria-label', el.name);

    var handle = document.createElement('span');
    handle.className = 'ab-el-item__handle';
    handle.setAttribute('aria-hidden', 'true');

    var icon = document.createElement('span');
    icon.className = 'ab-el-item__icon';
    icon.innerHTML = '<i data-lucide="' + el.icon + '" aria-hidden="true"></i>';

    var label = document.createElement('span');
    label.className = 'ab-el-item__label';
    label.textContent = el.name;

    item.appendChild(handle);
    item.appendChild(icon);
    item.appendChild(label);

    item.addEventListener('click', function () {
      showToast('"' + el.name + '" siap. Drag ke kanvas pada sesi berikutnya.');
    });

    return item;
  }

  function filterElements(query) {
    var q = (query || '').trim().toLowerCase();
    var sections = document.querySelectorAll('.ab-el-cat');

    Array.prototype.forEach.call(sections, function (section) {
      var items = section.querySelectorAll('.ab-el-item');
      var visibleCount = 0;

      Array.prototype.forEach.call(items, function (item) {
        var name = item.getAttribute('data-element-name') || '';
        var match = !q || name.indexOf(q) !== -1;
        item.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });

      /* Hide category if no matches */
      section.style.display = visibleCount === 0 ? 'none' : '';

      /* Auto-open matching categories while searching */
      if (q && visibleCount > 0) {
        if (!section.classList.contains('is-open')) {
          section.classList.add('is-open');
          var head = section.querySelector('.ab-el-cat__head');
          if (head) head.setAttribute('aria-expanded', 'true');
        }
        var body = section.querySelector('.ab-el-cat__body');
        if (body) body.style.maxHeight = 'none';
      }
    });
  }

  /* ---------- Pages list ---------- */

  function renderPagesPanel() {
    var panel = document.getElementById('panel-pages');
    if (!panel || !project) return;

    panel.innerHTML = '';

    var list = document.createElement('div');
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '6px';

    for (var i = 0; i < project.pages.length; i++) {
      list.appendChild(buildPageListItem(project.pages[i], i));
    }

    var addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'ab-btn ab-btn--sm';
    addBtn.style.marginTop = '10px';
    addBtn.style.width = '100%';
    addBtn.innerHTML = '<i data-lucide="plus" aria-hidden="true"></i> Halaman baru';
    addBtn.addEventListener('click', addNewPage);

    panel.appendChild(list);
    panel.appendChild(addBtn);
    Abook.renderIcons(panel);
  }

  function buildPageListItem(page, index) {
    var isActive = page.id === state.activePageId;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ab-btn ab-btn--ghost ab-btn--sm';
    btn.style.width = '100%';
    btn.style.justifyContent = 'flex-start';
    btn.style.textAlign = 'left';
    btn.style.height = 'auto';
    btn.style.padding = '10px 12px';
    btn.style.borderRadius = '10px';
    if (isActive) {
      btn.style.background = 'rgba(255,255,255,.06)';
      btn.style.borderColor = 'var(--ab-border-color-strong)';
    }

    var label = document.createElement('span');
    label.textContent = (index + 1) + '. ' + (page.name || 'Halaman');
    btn.appendChild(label);

    if (page.home) {
      var tag = document.createElement('span');
      tag.textContent = 'Home';
      tag.style.marginLeft = 'auto';
      tag.style.fontSize = '10px';
      tag.style.letterSpacing = '0.08em';
      tag.style.textTransform = 'uppercase';
      tag.style.color = 'var(--ab-text-tertiary)';
      btn.appendChild(tag);
    }

    btn.addEventListener('click', function () {
      if (!isActive) setActivePage(page.id);
      renderPagesPanel();
    });

    return btn;
  };
    /* ======================================================================
     Session 4 — Selection, DnD, resize, properties, blocks
     ====================================================================== */

  var iframeReady = false;
  var iframeQueue = [];
  var selectionIds = [];
  var ratioLocked = false;

  /* ============ Iframe messaging ============ */

  function sendToRuntime(type, payload) {
    var iframe = document.getElementById('ab-preview');
    if (!iframe || !iframe.contentWindow) return;
    if (!iframeReady && type !== 'ab:ping') {
      iframeQueue.push([type, payload]);
      return;
    }
    try { iframe.contentWindow.postMessage({ type: type, payload: payload || {} }, '*'); }
    catch (err) { /* ignore */ }
  }

  function flushQueue() {
    while (iframeQueue.length) {
      var item = iframeQueue.shift();
      sendToRuntime(item[0], item[1]);
    }
  }

  function initIframeBridge() {
    window.addEventListener('message', onRuntimeMessage);
  }

  function onRuntimeMessage(event) {
    var data = event.data;
    if (!data || typeof data.type !== 'string') return;
    if (data.type.indexOf('ab:') !== 0) return;

    var p = data.payload || {};
    switch (data.type) {
      case 'ab:ready':
        iframeReady = true;
        flushQueue();
        syncProgramsToRuntime();
        sendToRuntime('ab:list-elements');
        break;
      case 'ab:selected':   handleRuntimeSelection(p); break;
      case 'ab:rect':       handleRectReply(p); break;
      case 'ab:hit':        handleHitReply(p); break;
      case 'ab:elements':   handleElementsList(p); break;
      case 'ab:content-ready':
        /* Re-apply selection highlight after content swap */
        if (selectionIds.length) sendToRuntime('ab:select-id', { id: selectionIds[0] });
        break;
      case 'ab:request-nav':  requestPageByName(p.name); break;
      case 'ab:request-back': requestBack(); break;
      case 'ab:var-changed':  /* could be logged */ break;
    }
  }

  /* ============ Selection ============ */

  var lastRect = null;
  var lastHit = null;
  var lastElementsList = [];

  function handleRuntimeSelection(p) {
    if (!p.id) { clearSelection(); return; }

    if (p.additive) {
      var idx = selectionIds.indexOf(p.id);
      if (idx >= 0) selectionIds.splice(idx, 1);
      else selectionIds.push(p.id);
    } else {
      selectionIds = [p.id];
    }

    state.selectedIds = selectionIds.slice();
    state.selectedElementId = selectionIds[0] || null;

    sendToRuntime('ab:jiggle', {
      ids: selectionIds.slice(),
      on: selectionIds.length > 1
    });

    sendToRuntime('ab:get-rect', { id: selectionIds[0] });
    if (selectionIds.length > 1) requestAllRects();
    renderSelectionOverlay();
    renderPropertiesPanel();

  }

  function clearSelection() {
    selectionIds = [];
    state.selectedIds = [];
    state.selectedElementId = null;
    renderSelectionOverlay();
    renderPropertiesPanel();
  }

  function initSelectionOverlay() {
    var overlay = document.getElementById('selection-overlay');
    if (!overlay) return;

    overlay.innerHTML =
      '<div class="ab-selection-overlay__label" id="sel-label"></div>' +
      '<div class="ab-selection-overlay__toolbar">' +
        '<button type="button" id="sel-lock" aria-label="Kunci rasio"><span class="ab-icon"></span></button>' +
        '<button type="button" id="sel-blocks" aria-label="Buka blok"><span class="ab-icon"></span></button>' +
      '</div>' +
      '<div class="ab-selection-overlay__handle" data-ab-handle="nw"></div>' +
      '<div class="ab-selection-overlay__handle" data-ab-handle="n"></div>' +
      '<div class="ab-selection-overlay__handle" data-ab-handle="ne"></div>' +
      '<div class="ab-selection-overlay__handle" data-ab-handle="e"></div>' +
      '<div class="ab-selection-overlay__handle" data-ab-handle="se"></div>' +
      '<div class="ab-selection-overlay__handle" data-ab-handle="s"></div>' +
      '<div class="ab-selection-overlay__handle" data-ab-handle="sw"></div>' +
      '<div class="ab-selection-overlay__handle" data-ab-handle="w"></div>';

    var labelEl = overlay.querySelector('#sel-label');
    var lockBtn = overlay.querySelector('#sel-lock');
    var blocksBtn = overlay.querySelector('#sel-blocks');

    if (lockBtn) {
      lockBtn.innerHTML = '<span class="ab-icon">' + (Abook.iconSvg('lock') || '') + '</span>';
      lockBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        ratioLocked = !ratioLocked;
        lockBtn.classList.toggle('is-active', ratioLocked);
      });
    }
    if (blocksBtn) {
      blocksBtn.innerHTML = '<span class="ab-icon">' + (Abook.iconSvg('blocks') || '') + '</span>';
      blocksBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        switchSidebarTab('blocks');
      });
    }

    Abook.Resize.attach(overlay, {
      snapGrid: 4,
      getRect: function () { return lastRect; },
      onResize: function (rect) {
        lastRect = rect;
        positionOverlayFromRect(rect);
        if (!selectionIds[0]) return;
        sendToRuntime('ab:update-style', {
          id: selectionIds[0],
          style: {
            width: Math.round(rect.width / state.zoom) + 'px',
            height: Math.round(rect.height / state.zoom) + 'px'
          }
        });
      },
      onCommit: function (rect) {
        if (!selectionIds[0]) return;
        var id = selectionIds[0];
        mutatePageHtml(function (doc) {
          var el = doc.querySelector('[data-ab-id="' + id + '"]');
          if (!el) return;
          el.style.width = Math.round(rect.width / state.zoom) + 'px';
          el.style.height = Math.round(rect.height / state.zoom) + 'px';
        });

        /* Session 6 — record this resize in history */
        commitActiveChange();
      }
    });

    // Selection clicks in overlay close selection when clicking empty canvas
    var canvas = document.getElementById('canvas');
    if (canvas) {
      canvas.addEventListener('pointerdown', function (e) {
        if (e.target.closest('.ab-selection-overlay')) return;
        if (Abook.DnD.isDragging()) return;
        // Let the iframe handle its own clicks; if click lands outside iframe bounds, clear
        var iframe = document.getElementById('ab-preview');
        if (!iframe) return;
        var r = iframe.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right ||
            e.clientY < r.top || e.clientY > r.bottom) {
          clearSelection();
        }
      });
    }
  }

  function handleRectReply(p) {
    if (!p.id) return;
    if (p.rect) {
      lastRect = p.rect;
      if (selectionIds.length === 1) positionOverlayFromRect(p.rect);
    } else {
      lastRect = null;
      renderSelectionOverlay();
    }
  }

  function requestAllRects() {
    /* For multi-select we just query the bounding box of the first selected */
    if (selectionIds[0]) sendToRuntime('ab:get-rect', { id: selectionIds[0] });
  }

  function positionOverlayFromRect(rect) {
    var overlay = document.getElementById('selection-overlay');
    var canvas = document.getElementById('canvas');
    var iframe = document.getElementById('ab-preview');
    if (!overlay || !canvas || !iframe) return;

    if (selectionIds.length === 0 || !rect) {
      overlay.classList.add('is-empty');
      return;
    }

    var canvasRect = canvas.getBoundingClientRect();
    var iframeRect = iframe.getBoundingClientRect();
    var scale = iframeRect.width / 1280;

    overlay.classList.remove('is-empty');
    overlay.style.left = (iframeRect.left - canvasRect.left + rect.left * scale) + 'px';
    overlay.style.top  = (iframeRect.top  - canvasRect.top  + rect.top  * scale) + 'px';
    overlay.style.width  = (rect.width  * scale) + 'px';
    overlay.style.height = (rect.height * scale) + 'px';

    var label = document.getElementById('sel-label');
    if (label) {
      label.textContent = selectionIds.length > 1
        ? selectionIds.length + ' elemen dipilih'
        : shortLabel(selectionIds[0]);
    }

    // Hide handles for multi-select
    var handles = overlay.querySelectorAll('[data-ab-handle]');
    var showHandles = selectionIds.length === 1;
    Array.prototype.forEach.call(handles, function (h) {
      h.style.display = showHandles ? '' : 'none';
    });
  }

  function shortLabel(id) {
    for (var i = 0; i < lastElementsList.length; i++) {
      if (lastElementsList[i].id === id) {
        var t = lastElementsList[i].type || 'elemen';
        return t.replace(/-/g, ' ');
      }
    }
    return 'elemen';
  }

  function renderSelectionOverlay() {
    if (!selectionIds.length) {
      var ov = document.getElementById('selection-overlay');
      if (ov) ov.classList.add('is-empty');
      return;
    }
    sendToRuntime('ab:get-rect', { id: selectionIds[0] });
  }

  function handleElementsList(p) {
    lastElementsList = p.list || [];
    renderPropertiesPanel();
    renderBlocksPanel();
  }

  /* ============ DnD (palette → iframe) ============ */

  function initElementDnD() {
    document.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      var item = e.target.closest('.ab-el-item');
      if (!item) return;
      e.preventDefault();
      startElementDrag(item, e);
    });
  }

  function startElementDrag(item, e) {
    var elementId = item.getAttribute('data-element-id');
    var el = Abook.Elements.get(elementId);
    if (!el) return;

    var ghostHTML = el.thumb || '';

    Abook.DnD.start({
      x: e.clientX,
      y: e.clientY,
      ghostHTML: ghostHTML,
      onMove: function (pt) {
        var hit = computeDropPoint(pt.x, pt.y);
        if (!hit) {
          Abook.DnD.hideIndicator();
          return;
        }
        Abook.DnD.showIndicator(hit.indicator);
      },
      onDrop: function (pt) {
        var hit = computeDropPoint(pt.x, pt.y);
        Abook.DnD.hideIndicator();
        if (!hit) return;
        insertElementFromDefinition(el, hit.targetId, hit.position);
      },
      onCancel: function () {
        Abook.DnD.hideIndicator();
      }
    });
  }

  function computeDropPoint(x, y) {
    var iframe = document.getElementById('ab-preview');
    var canvas = document.getElementById('canvas');
    if (!iframe || !canvas) return null;

    var iframeRect = iframe.getBoundingClientRect();
    if (x < iframeRect.left || x > iframeRect.right ||
        y < iframeRect.top  || y > iframeRect.bottom) return null;

    var scale = iframeRect.width / 1280;
    var localX = (x - iframeRect.left) / scale;
    var localY = (y - iframeRect.top)  / scale;

    // Use the last hit-test result (async) — the runtime replies via postMessage
    sendToRuntime('ab:hit-test', { x: localX, y: localY });

    // Compute indicator rect in parent coordinates using lastHit
    if (!lastHit || !lastHit.rect) {
      var canvasRect = canvas.getBoundingClientRect();
      return {
        targetId: null, position: 'after',
        indicator: {
          left: iframeRect.left - 0,
          top: y,
          width: iframeRect.width
        }
      };
    }

    var r = lastHit.rect;
    var top = iframeRect.top + (lastHit.position === 'before' ? r.top : r.top + r.height) * scale;
    var left = iframeRect.left + r.left * scale;
    var width = r.width * scale;

    return {
      targetId: lastHit.targetId,
      position: lastHit.position,
      indicator: { left: left, top: top, width: width }
    };
  }

  function handleHitReply(p) {
    if (!p.targetId) {
      lastHit = null;
      return;
    }
    var el = null;
    for (var i = 0; i < lastElementsList.length; i++) {
      if (lastElementsList[i].id === p.targetId) { el = lastElementsList[i]; break; }
    }
    lastHit = { targetId: p.targetId, position: p.position, rect: el ? el.rect : null };
  }

  function insertElementFromDefinition(elementDef, targetId, position) {
    var newId = Abook.uid('el');
    var tagged = tagElementHtml(elementDef.defaultHTML, newId, elementDef.id);

    mutatePageHtml(function (doc, root) {
      var target = targetId ? root.querySelector('[data-ab-id="' + targetId + '"]') : null;
      if (!target) {
        root.insertAdjacentHTML('beforeend', tagged);
        return;
      }
      if (position === 'before') {
        target.insertAdjacentHTML('beforebegin', tagged);
      } else {
        target.insertAdjacentHTML('afterend', tagged);
      }
    });

    // Ensure the CSS for this element type is present
    ensureElementCss(elementDef);
    commitActiveChange();

    // Select the newly inserted element
    window.setTimeout(function () {
      selectionIds = [newId];
      state.selectedIds = selectionIds.slice();
      state.selectedElementId = newId;
      sendToRuntime('ab:select-id', { id: newId });
      renderPropertiesPanel();
    }, 60);

    showToast('"' + elementDef.name + '" ditambahkan.');
  }

  function tagElementHtml(html, id, type) {
    var tpl = document.createElement('template');
    tpl.innerHTML = html;
    var root = tpl.content.firstElementChild;
    if (root) {
      root.setAttribute('data-ab-id', id);
      root.setAttribute('data-ab-type', type);
      return tpl.innerHTML;
    }
    return '<div data-ab-id="' + id + '" data-ab-type="' + type + '">' + html + '</div>';
  }

  function ensureElementCss(def) {
    if (!def || !def.defaultCSS) return;
    var page = getActivePage();
    if (!page) return;
    if (page.css && page.css.indexOf(def.defaultCSS.slice(0, 40)) >= 0) return;
    page.css = (page.css || '') + '\n' + def.defaultCSS;
    Abook.saveProject(project);
    sendToRuntime('ab:set-content', { html: page.html || '', css: page.css || '' });
  }

  /* ============ Page mutation ============ */

  function mutatePageHtml(mutator, opts) {
    opts = opts || {};
    if (opts.history === true) commitActiveChange();
    var page = getActivePage();
    if (!page) return;
    var doc = new DOMParser().parseFromString(
      '<div id="__root">' + (page.html || '') + '</div>', 'text/html');
    var root = doc.getElementById('__root');
    mutator(doc, root);
    page.html = root.innerHTML;
    Abook.saveProject(project);
    sendToRuntime('ab:set-content', { html: page.html, css: page.css || '' });
    if (opts.history === true) commitActiveChange();
  }

  /* ============ Properties panel ============ */

  function initPropertiesPanel() {
    // No-op; populated on demand
  }

  function renderPropertiesPanel() {
    var empty = document.getElementById('right-empty');
    var props = document.getElementById('right-props');
    if (!empty || !props) return;

    if (!selectionIds.length) {
      empty.hidden = false;
      props.hidden = true;
      return;
    }

    empty.hidden = true;
    props.hidden = false;
    props.innerHTML = '';

    var id = selectionIds[0];
    var info = null;
    for (var i = 0; i < lastElementsList.length; i++) {
      if (lastElementsList[i].id === id) { info = lastElementsList[i]; break; }
    }

    var elDef = info ? Abook.Elements.get(info.type) : null;

    /* Identity */
    props.appendChild(section('Elemen', [
      roField('Tipe', info ? info.type : '—'),
      roField('ID', id)
    ], true));

    /* Content */
    if (elDef && elDef.editableProps && elDef.editableProps.length) {
      var contentRows = [];
      for (var k = 0; k < elDef.editableProps.length; k++) {
        (function (prop) {
          contentRows.push(buildPropInput(prop, id));
        })(elDef.editableProps[k]);
      }
      props.appendChild(section('Konten', contentRows, true));
    } else {
      props.appendChild(section('Konten', [
        el('div', { class: 'ab-prop-empty', text: 'Elemen ini tidak punya properti konten.' })
      ], false));
    }

    /* Layout (read-only display + W/H edit) */
    props.appendChild(section('Tata Letak', [
      el('div', { class: 'ab-prop-field__row' },
        numField('Lebar (px)', 'w', id, info && info.rect ? Math.round(info.rect.width) : 0),
        numField('Tinggi (px)', 'h', id, info && info.rect ? Math.round(info.rect.height) : 0)
      )
    ], true));

    /* Appearance */
    props.appendChild(section('Tampilan', [
      rangeField('Opacity', 'opacity', id, 1, 0, 1, 0.05),
      rangeField('Blur (px)', 'blur', id, 0, 0, 24, 1),
      rangeField('Radius (px)', 'radius', id, 0, 0, 48, 1)
    ], false));

    /* Logic — programs targeting this element */
    var programs = (getActivePage() && getActivePage().blocks || [])
      .filter(function (p) { return p.targetId === id; });

    var logicRows = [];
    if (programs.length) {
      var list = el('div', { class: 'ab-prop-programs' });
      programs.forEach(function (prog) {
        var def = Abook.Blocks.getDef(prog.event);
        var item = el('button', { class: 'ab-prop-program', type: 'button' });
        item.innerHTML = '<span class="ab-icon">' +
          (Abook.iconSvg(def ? def.icon : 'zap') || '') + '</span><span>' +
          (def ? def.label : prog.event) + '</span>';
        item.addEventListener('click', function () {
          switchSidebarTab('blocks');
          openProgramEditor(prog.id);
        });
        list.appendChild(item);
      });
      logicRows.push(list);
    } else {
      logicRows.push(el('div', { class: 'ab-prop-empty', text: 'Belum ada program untuk elemen ini.' }));
    }

    var addBtn = el('button', { class: 'ab-btn ab-btn--sm', type: 'button' });
    addBtn.innerHTML = '<span class="ab-icon">' + (Abook.iconSvg('plus') || '') + '</span> Buat program';
    addBtn.addEventListener('click', function () {
      createProgramForElement(id);
    });
    logicRows.push(addBtn);

    props.appendChild(section('Logika', logicRows, true));
  }

  function section(title, rows, open) {
    var sec = el('section', { class: 'ab-prop-section' + (open ? ' is-open' : '') });
    var head = el('button', { class: 'ab-prop-section__head', type: 'button' });
    head.innerHTML = '<span>' + title + '</span>' +
      '<span class="ab-prop-section__chev"><span class="ab-icon">' +
      (Abook.iconSvg('chevron-down') || '') + '</span></span>';
    head.addEventListener('click', function () {
      sec.classList.toggle('is-open');
    });
    var body = el('div', { class: 'ab-prop-section__body' });
    var inner = el('div', { class: 'ab-prop-section__inner' });
    rows.forEach(function (r) { if (r) inner.appendChild(r); });
    body.appendChild(inner);
    sec.appendChild(head);
    sec.appendChild(body);
    return sec;
  }

  function el(tag, attrs, child) {
    var node = document.createElement(tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) {
      if (k === 'text') node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    }
    if (child) {
      if (Array.isArray(child)) child.forEach(function (c) { if (c) node.appendChild(c); });
      else node.appendChild(child);
    }
    return node;
  }

  function roField(label, value) {
    var wrap = el('div', { class: 'ab-prop-field' });
    wrap.appendChild(el('div', { class: 'ab-prop-field__label', text: label }));
    var input = el('input', { class: 'ab-prop-input', type: 'text', readonly: '', value: String(value || '') });
    wrap.appendChild(input);
    return wrap;
  }

  function numField(label, key, id, value) {
    var wrap = el('div', { class: 'ab-prop-field' });
    wrap.appendChild(el('div', { class: 'ab-prop-field__label', text: label }));
    var input = el('input', { class: 'ab-prop-input', type: 'number', value: String(value || 0) });
    input.addEventListener('change', function () {
      applyLayoutChange(id, key, parseFloat(input.value));
    });
    wrap.appendChild(input);
    return wrap;
  }

  function rangeField(label, key, id, value, min, max, step) {
    var wrap = el('div', { class: 'ab-prop-field' });
    wrap.appendChild(el('div', { class: 'ab-prop-field__label', text: label }));
    var input = el('input', { class: 'ab-prop-input', type: 'range', min: min, max: max, step: step, value: value });
    var readout = el('div', { class: 'ab-prop-field__label', text: String(value), style: 'text-align:right' });
    input.addEventListener('input', function () {
      var v = parseFloat(input.value);
      readout.textContent = String(v);
      applyAppearanceChange(id, key, v);
    });
    wrap.appendChild(input);
    wrap.appendChild(readout);
    return wrap;
  }

  function buildPropInput(prop, id) {
    var wrap = el('div', { class: 'ab-prop-field' });
    wrap.appendChild(el('div', { class: 'ab-prop-field__label', text: prop.label }));

    var value = prop.default;
    var node;

    if (prop.type === 'select') {
      node = el('select', { class: 'ab-prop-select' });
      (prop.options || []).forEach(function (opt) {
        var o = el('option', { value: opt, text: opt });
        if (opt === value) o.setAttribute('selected', 'selected');
        node.appendChild(o);
      });
      node.addEventListener('change', function () {
        sendToRuntime('ab:update-props', { id: id, updates: { [prop.key]: node.value } });
        persistProp(id, prop.key, node.value);
      });
    } else if (prop.type === 'color') {
      node = el('input', { class: 'ab-prop-input', type: 'text', value: String(value) });
      node.addEventListener('change', function () {
        var v = node.value;
        applyColorStyle(id, prop.key, v);
        sendToRuntime('ab:update-props', { id: id, updates: { [prop.key]: v } });
        persistProp(id, prop.key, v);
      });
    } else {
      var inputType = prop.type === 'number' ? 'number' : 'text';
      node = el('input', { class: 'ab-prop-input', type: inputType, value: String(value == null ? '' : value) });
      node.addEventListener('change', function () {
        var v = inputType === 'number' ? parseFloat(node.value) : node.value;
        sendToRuntime('ab:update-props', { id: id, updates: { [prop.key]: v } });
        persistProp(id, prop.key, v);
      });
    }

    wrap.appendChild(node);
    return wrap;
  }

  function applyColorStyle(id, key, value) {
    var propToStyle = {
      color: 'color',
      background: 'backgroundColor'
    };
    var styleKey = propToStyle[key] || 'color';
    sendToRuntime('ab:update-style', { id: id, style: { [styleKey]: value } });
  }

  function applyLayoutChange(id, key, value) {
    if (isNaN(value)) return;
    var style = {};
    if (key === 'w') style.width = Math.max(24, value) + 'px';
    if (key === 'h') style.height = Math.max(24, value) + 'px';
    sendToRuntime('ab:update-style', { id: id, style: style });
    mutatePageHtml(function (doc) {
      var node = doc.querySelector('[data-ab-id="' + id + '"]');
      if (!node) return;
      if (key === 'w') node.style.width = style.width;
      if (key === 'h') node.style.height = style.height;
    });

    /* Session 6 — record this layout change in history */
    commitActiveChange();
  }

  function applyAppearanceChange(id, key, value) {
    var style = {};
    if (key === 'opacity') style.opacity = String(value);
    if (key === 'blur') style.filter = value > 0 ? 'blur(' + value + 'px)' : '';
    if (key === 'radius') style.borderRadius = value + 'px';
    sendToRuntime('ab:update-style', { id: id, style: style });
  }

  function persistProp(id, key, value) {
    mutatePageHtml(function (doc) {
      var node = doc.querySelector('[data-ab-id="' + id + '"]');
      if (!node) return;
      var mapped = null;
      switch (key) {
        case 'text':
        case 'label':
        case 'content':
          node.textContent = String(value);
          return;
        case 'src':
        case 'href':
        case 'alt':
        case 'placeholder':
        case 'value':
          node.setAttribute(key, String(value));
          return;
        case 'icon':
          var holder = node.querySelector('.ab-icon') || node.querySelector('i');
          if (holder && window.LucideIcons && window.LucideIcons[value]) {
            holder.innerHTML = window.LucideIcons[value];
          }
          return;
        default:
          node.setAttribute('data-ab-prop-' + key, String(value));
      }
    });

    /* Session 6 — record this property edit in history */
    commitActiveChange();
  }

  /* ============ Blocks panel ============ */

  function initBlocksPanel() {
    renderBlocksPanel();
  }

  function renderBlocksPanel() {
    var panel = document.getElementById('panel-blocks');
    if (!panel) return;
    panel.innerHTML = '';

    var wrap = el('div', { class: 'ab-blocks-panel' });
    panel.appendChild(wrap);

    if (state.currentProgramId) {
      renderProgramEditorView(wrap, state.currentProgramId);
    } else {
      renderProgramListView(wrap);
    }
    Abook.renderIcons(panel);
  }

  function renderProgramListView(wrap) {
    var page = getActivePage();
    var programs = (page && page.blocks) || [];

    wrap.appendChild(el('div', { class: 'ab-blocks-panel__title', text: 'Program halaman' }));

    var list = el('div', { class: 'ab-program-list' });
    if (!programs.length) {
      list.appendChild(el('div', { class: 'ab-block-editor__empty',
        text: 'Belum ada program. Buat program untuk mulai menambahkan logika.' }));
    } else {
      programs.forEach(function (prog) {
        list.appendChild(buildProgramCard(prog));
      });
    }
    wrap.appendChild(list);

    var addBtn = el('button', { class: 'ab-btn ab-btn--sm', type: 'button' });
    addBtn.innerHTML = '<span class="ab-icon">' + (Abook.iconSvg('plus') || '') + '</span> Program baru';
    addBtn.addEventListener('click', function () {
      createProgramForElement(state.selectedElementId || null);
    });
    wrap.appendChild(addBtn);
  }

  function buildProgramCard(prog) {
    var def = Abook.Blocks.getDef(prog.event) || { icon: 'zap', label: 'Kejadian' };
    var targetLabel = prog.targetId === 'page' || !prog.targetId
      ? 'Seluruh halaman'
      : ('Target: ' + shortLabel(prog.targetId));

    var card = el('div', { class: 'ab-program-card' });
    var icon = el('span', { class: 'ab-program-card__icon' });
    icon.innerHTML = Abook.iconSvg(def.icon) || '';
    card.appendChild(icon);

    var meta = el('div', { class: 'ab-program-card__meta' });
    meta.appendChild(el('div', { class: 'ab-program-card__title', text: def.label }));
    meta.appendChild(el('div', { class: 'ab-program-card__sub', text: targetLabel + ' · ' + (prog.actions || []).length + ' blok' }));
    card.appendChild(meta);

    var del = el('button', { class: 'ab-program-card__del', type: 'button' });
    del.innerHTML = Abook.iconSvg('trash-2') || '';
    del.addEventListener('click', function (e) {
      e.stopPropagation();
      var page = getActivePage();
      if (!page) return;
      page.blocks = (page.blocks || []).filter(function (p) { return p.id !== prog.id; });
      Abook.saveProject(project);
      syncProgramsToRuntime();
      renderBlocksPanel();
    });
    card.appendChild(del);

    card.addEventListener('click', function () { openProgramEditor(prog.id); });
    return card;
  }

  function openProgramEditor(programId) {
    state.currentProgramId = programId;
    state.blockScope = [];
    renderBlocksPanel();
  }

  function closeProgramEditor() {
    state.currentProgramId = null;
    state.blockScope = [];
    renderBlocksPanel();
  }

  function renderProgramEditorView(wrap, programId) {
    var page = getActivePage();
    var prog = null;
    (page.blocks || []).forEach(function (p) { if (p.id === programId) prog = p; });
    if (!prog) { closeProgramEditor(); return; }

    var scope = state.blockScope || [];

    /* Breadcrumb */
    var crumbs = el('div', { class: 'ab-block-editor__crumbs' });
    var rootCrumb = el('button', { class: 'ab-block-editor__crumb' + (scope.length === 0 ? ' is-current' : ''),
      type: 'button', text: 'Program' });
    rootCrumb.addEventListener('click', function () {
      state.blockScope = [];
      renderBlocksPanel();
    });
    crumbs.appendChild(rootCrumb);

    var scopePath = [];
    for (var i = 0; i < scope.length; i++) {
      crumbs.appendChild(el('span', { class: 'ab-block-editor__crumb-sep', text: '›' }));
      var blockInScope = scope[i];
      var defInScope = Abook.Blocks.getDef(blockInScope.blockId);
      (function (index, label) {
        var c = el('button', { class: 'ab-block-editor__crumb' +
          (index === scope.length - 1 ? ' is-current' : ''), type: 'button', text: label });
        c.addEventListener('click', function () {
          state.blockScope = scope.slice(0, index + 1);
          renderBlocksPanel();
        });
        crumbs.appendChild(c);
      })(i, defInScope ? defInScope.label.replace(/\[[^\]]+\]/g, '…') : 'Blok');
      scopePath.push(blockInScope);
    }
    wrap.appendChild(crumbs);

    /* Back button */
    var back = el('button', { class: 'ab-btn ab-btn--sm ab-btn--ghost', type: 'button' });
    back.innerHTML = '<span class="ab-icon">' + (Abook.iconSvg('arrow-left') || '') + '</span> Daftar program';
    back.addEventListener('click', closeProgramEditor);
    wrap.appendChild(back);

    /* Canvas: event block + action stack of current scope */
    var canvas = el('div', { class: 'ab-block-editor__canvas' });

    if (scope.length === 0) {
      canvas.appendChild(buildEventBlock(prog));
      var rootActions = prog.actions || [];
      if (!rootActions.length) {
        canvas.appendChild(el('div', { class: 'ab-block-editor__empty',
          text: 'Klik blok di bawah untuk menambah aksi.' }));
      } else {
        rootActions.forEach(function (a) {
          canvas.appendChild(buildBlockView(a, prog, []));
        });
      }
    } else {
      var current = scope[scope.length - 1];
      var list = current.children || [];
      if (!list.length) {
        canvas.appendChild(el('div', { class: 'ab-block-editor__empty',
          text: 'Masih kosong. Klik blok di bawah untuk menambah aksi.' }));
      } else {
        list.forEach(function (a) {
          canvas.appendChild(buildBlockView(a, prog, scope));
        });
      }
    }

    wrap.appendChild(canvas);

    /* Palette */
    wrap.appendChild(buildPalette(prog, scope));
  }

  function buildEventBlock(prog) {
    var def = Abook.Blocks.getDef(prog.event) || { icon: 'zap', label: 'Kejadian', cat: 'event' };
    var block = el('div', { class: 'ab-block ab-block--event' });
    var icon = el('span', { class: 'ab-block__icon' });
    icon.innerHTML = Abook.iconSvg(def.icon) || '';
    block.appendChild(icon);

    var label = el('span', { class: 'ab-block__label' });
    var segments = Abook.Blocks.parseLabel({ label: def.label, parts: def.parts || [] });
    segments.forEach(function (seg) {
      if (seg.type === 'text') label.appendChild(document.createTextNode(seg.value));
      else label.appendChild(buildPartField(seg.part, prog.eventParams || {}, function (v) {
        prog.eventParams = prog.eventParams || {};
        prog.eventParams[seg.part.key] = v;
        Abook.saveProject(project);
        syncProgramsToRuntime();
      }));
    });
    block.appendChild(label);

    var controls = el('div', { class: 'ab-block__controls' });
    var change = el('button', { class: 'ab-block__ctrl', type: 'button' });
    change.innerHTML = Abook.iconSvg('pencil') || '';
    change.addEventListener('click', function (e) {
      e.stopPropagation();
      openEventPicker(prog, change);
    });
    controls.appendChild(change);
    block.appendChild(controls);

    return block;
  }

  function openEventPicker(prog, anchor) {
    var menu = el('div', { class: 'ab-zoom-menu is-open' });
    menu.style.position = 'fixed';
    menu.style.zIndex = '400';
    var rect = anchor.getBoundingClientRect();
    menu.style.left = rect.left + 'px';
    menu.style.top = (rect.bottom + 6) + 'px';

    Abook.Blocks.eventDefs().forEach(function (def) {
      var item = el('button', { class: 'ab-zoom-menu__item', type: 'button' });
      item.textContent = def.label.replace(/\[[^\]]+\]/g, '…');
      item.addEventListener('click', function () {
        prog.event = def.id;
        Abook.saveProject(project);
        syncProgramsToRuntime();
        if (menu.parentNode) menu.parentNode.removeChild(menu);
        renderBlocksPanel();
      });
      menu.appendChild(item);
    });

    document.body.appendChild(menu);
    var dismiss = function () {
      if (menu.parentNode) menu.parentNode.removeChild(menu);
      document.removeEventListener('pointerdown', dismiss, true);
    };
    setTimeout(function () { document.addEventListener('pointerdown', dismiss, true); }, 10);
  }

  function buildBlockView(action, prog, scopePath) {
    var def = Abook.Blocks.getDef(action.blockId);
    if (!def) return el('div', { class: 'ab-block-editor__empty', text: 'Blok tidak dikenal: ' + action.blockId });

    var block = el('div', { class: 'ab-block ab-block--' + def.cat });
    var icon = el('span', { class: 'ab-block__icon' });
    icon.innerHTML = Abook.iconSvg(def.icon) || '';
    block.appendChild(icon);

    var label = el('span', { class: 'ab-block__label' });
    var segments = Abook.Blocks.parseLabel(def);
    segments.forEach(function (seg) {
      if (seg.type === 'text') {
        label.appendChild(document.createTextNode(seg.value));
      } else {
        label.appendChild(buildPartField(seg.part, action.params, function (v) {
          action.params[seg.part.key] = v;
          Abook.saveProject(project);
          syncProgramsToRuntime();
        }));
      }
    });
    block.appendChild(label);

    /* Controls */
    var controls = el('div', { class: 'ab-block__controls' });

    if (def.body) {
      var openBtn = el('button', { class: 'ab-block__ctrl', type: 'button' });
      openBtn.innerHTML = Abook.iconSvg('chevron-right') || '';
      openBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        state.blockScope = scopePath.concat([action]);
        renderBlocksPanel();
      });
      controls.appendChild(openBtn);
    }

    var del = el('button', { class: 'ab-block__ctrl ab-block__ctrl--danger', type: 'button' });
    del.innerHTML = Abook.iconSvg('x') || '';
    del.addEventListener('click', function (e) {
      e.stopPropagation();
      removeActionFromScope(prog, scopePath, action);
    });
    controls.appendChild(del);

    block.appendChild(controls);

    /* Nested body preview (read-only) */
    if (def.body) {
      var body = el('div', { class: 'ab-block__body' });
      var children = action.children || [];
      if (!children.length) {
        body.appendChild(el('div', { class: 'ab-block__body-empty', text: 'Klik ▸ untuk mengisi' }));
      } else {
        children.forEach(function (c) {
          var cDef = Abook.Blocks.getDef(c.blockId);
          var mini = el('div', { class: 'ab-block ab-block--' + (cDef ? cDef.cat : 'event') });
          mini.style.padding = '5px 8px';
          mini.style.fontSize = '10.5px';
          mini.textContent = (cDef ? cDef.label.replace(/\[[^\]]+\]/g, '…') : c.blockId);
          body.appendChild(mini);
        });
      }
      block.appendChild(body);

      if (def.bodyAlt) {
        var alt = el('div', { class: 'ab-block__body ab-block__body--alt' });
        alt.appendChild(el('div', { class: 'ab-block__body-empty', text: 'Cabang "jika tidak" (segera hadir)' }));
        block.appendChild(alt);
      }
    }

    return block;
  }

  function buildPartField(part, params, onChange) {
    var value = params[part.key];

    if (part.type === 'select') {
      var sel = el('select', { class: 'ab-block__part ab-block__part--select' });
      (part.options || []).forEach(function (opt) {
        var o = el('option', { value: opt, text: opt });
        if (opt === value) o.setAttribute('selected', 'selected');
        sel.appendChild(o);
      });
      sel.addEventListener('change', function () { onChange(sel.value); });
      sel.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
      return sel;
    }

    if (part.type === 'color') {
      var sw = el('input', { class: 'ab-block__part ab-block__part--color', type: 'color', value: String(value || '#7EE7FF') });
      sw.addEventListener('input', function () { onChange(sw.value); });
      sw.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
      return sw;
    }

    if (part.type === 'element') {
      var pe = el('span', { class: 'ab-block__part ab-block__part--element', text: elementShortLabel(value) });
      if (!value) pe.classList.add('is-empty');
      pe.addEventListener('click', function (e) {
        e.stopPropagation();
        openElementPicker(function (id) {
          onChange(id);
          pe.textContent = elementShortLabel(id);
          pe.classList.remove('is-empty');
        });
      });
      return pe;
    }

    var input = el('span', { class: 'ab-block__part', contenteditable: 'true', text: String(value == null ? '' : value) });
    input.addEventListener('blur', function () {
      var v = input.textContent.trim();
      if (part.type === 'number') {
        var n = parseFloat(v);
        if (!isNaN(n)) v = n;
      }
      onChange(v);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
    });
    input.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    return input;
  }

  function elementShortLabel(id) {
    if (!id) return 'pilih elemen';
    for (var i = 0; i < lastElementsList.length; i++) {
      if (lastElementsList[i].id === id) {
        var t = lastElementsList[i].type || 'elemen';
        var txt = lastElementsList[i].text ? ' · "' + lastElementsList[i].text.slice(0, 14) + '"' : '';
        return t + txt;
      }
    }
    return id.slice(0, 10);
  }

  function openElementPicker(callback) {
    var list = lastElementsList.length
      ? lastElementsList
      : [{ id: 'page', type: 'halaman', text: '' }];

    var menu = el('div', { class: 'ab-zoom-menu is-open' });
    menu.style.position = 'fixed';
    menu.style.zIndex = '400';

    list.forEach(function (info) {
      var item = el('button', { class: 'ab-zoom-menu__item', type: 'button' });
      item.textContent = (info.type || 'elemen') + ' · ' + (info.text || info.id).slice(0, 24);
      item.addEventListener('click', function () {
        callback(info.id);
        if (menu.parentNode) menu.parentNode.removeChild(menu);
      });
      menu.appendChild(item);
    });

    document.body.appendChild(menu);
    var rect = menu.getBoundingClientRect();
    menu.style.left = Math.min(window.innerWidth - rect.width - 12, Math.max(12, window.innerWidth / 2 - rect.width / 2)) + 'px';
    menu.style.top = Math.max(12, window.innerHeight / 2 - rect.height / 2) + 'px';

    var dismiss = function () {
      if (menu.parentNode) menu.parentNode.removeChild(menu);
      document.removeEventListener('pointerdown', dismiss, true);
    };
    setTimeout(function () { document.addEventListener('pointerdown', dismiss, true); }, 10);
  }

  function buildPalette(prog, scopePath) {
    var pal = el('div', { class: 'ab-block-editor__palette' });
    pal.appendChild(el('div', { class: 'ab-block-editor__palette-title', text: 'Tambah blok' }));

    var body = el('div', { class: 'ab-block-editor__palette-body' });
    pal.appendChild(body);

    Abook.Blocks.categories.forEach(function (cat, idx) {
      if (cat.key === 'event') return; // events are only allowed at root
      var group = el('div', { class: 'ab-palette-cat' + (idx === 1 ? ' is-open' : '') });

      var head = el('button', { class: 'ab-palette-cat__head', type: 'button' });
      head.innerHTML = '<span class="ab-icon">' + (Abook.iconSvg(cat.icon) || '') +
        '</span><span>' + cat.label + '</span>' +
        '<span class="ab-palette-cat__chev"><span class="ab-icon">' +
        (Abook.iconSvg('chevron-down') || '') + '</span></span>';
      head.addEventListener('click', function () {
        group.classList.toggle('is-open');
      });
      group.appendChild(head);

      var catBody = el('div', { class: 'ab-palette-cat__body' });
      Abook.Blocks.defsByCat(cat.key).forEach(function (def) {
        var b = el('div', { class: 'ab-block ab-block--' + def.cat });
        b.style.cursor = 'pointer';
        var ic = el('span', { class: 'ab-block__icon' });
        ic.innerHTML = Abook.iconSvg(def.icon) || '';
        b.appendChild(ic);
        var lbl = el('span', { class: 'ab-block__label', text: def.label.replace(/\[[^\]]+\]/g, '…') });
        b.appendChild(lbl);
        b.addEventListener('click', function () {
          appendBlockToScope(prog, scopePath, def.id);
        });
        catBody.appendChild(b);
      });
      group.appendChild(catBody);
      body.appendChild(group);
    });

    return pal;
  }

  function appendBlockToScope(prog, scopePath, defId) {
    var action = Abook.Blocks.newActionInstance(defId);
    if (!action) return;

    if (!scopePath.length) {
      prog.actions = prog.actions || [];
      prog.actions.push(action);
    } else {
      var parent = scopePath[scopePath.length - 1];
      parent.children = parent.children || [];
      parent.children.push(action);
    }

    Abook.saveProject(project);
    syncProgramsToRuntime();
    renderBlocksPanel();

    /* Session 6 — record this block change in history */
    commitActiveChange();
  }

  function removeActionFromScope(prog, scopePath, action) {
    var list;
    if (!scopePath.length) list = prog.actions;
    else list = scopePath[scopePath.length - 1].children;
    if (!list) return;
    var idx = list.indexOf(action);
    if (idx >= 0) list.splice(idx, 1);
    Abook.saveProject(project);
    syncProgramsToRuntime();
    renderBlocksPanel();

    /* Session 6 — record this block change in history */
    commitActiveChange();
  }

  function createProgramForElement(targetId) {
    var page = getActivePage();
    if (!page) return;
    page.blocks = page.blocks || [];
    var prog = {
      id: Abook.Blocks.uid('prog'),
      targetId: targetId || 'page',
      event: targetId ? 'evt-click' : 'evt-load',
      eventParams: {},
      actions: []
    };
    page.blocks.push(prog);
    Abook.saveProject(project);
    syncProgramsToRuntime();
    renderBlocksPanel();

    /* Session 6 — record this block change in history */
    commitActiveChange();
  }

  function syncProgramsToRuntime() {
    var page = getActivePage();
    if (!page) return;
    sendToRuntime('ab:install-blocks', {
      programs: Abook.Blocks.compile(page.blocks || [])
    });
  }

  /* ============ Page navigation helpers ============ */

  function requestPageByName(name) {
    if (!name) return;
    var page = getActivePage();
    var target = null;
    (project.pages || []).forEach(function (p) {
      if (p.name === name || p.id === name) target = p;
    });
    if (!target || !page) return;
    // Save then switch
    if (target.id !== page.id) setActivePage(target.id);
  }

  function requestBack() {
    // Simple back behavior: switch to the "home" page
    var home = null;
    (project.pages || []).forEach(function (p) { if (p.home) home = p; });
    if (home) setActivePage(home.id);
  }

    /* ======================================================================
     Session 5 — Animation bridge (parent side)
     Exposes the animation engine's `ab` object to the runtime via
     the postMessage protocol. The runtime calls `ab:run-animation` and
     the parent forwards it back for logging / telemetry (the runtime
     also runs its own animations locally; this bridge is for parity).
     ====================================================================== */

  function initAnimationBridge() {
    if (!window.ab) return;
    /* No-op today; hooking point for future telemetry. */
  }

    /* ======================================================================
     Session 6 — History, autosave, export, preview, shortcuts
     ====================================================================== */

  var History = Abook.History;

  var UNDO_ICONS = { saved: 'check', saving: 'loader-2' };
  var dirty = false;
  var saveTimer = null;
  var saveStatusEl = null;
  var saveIconEl = null;
  var saveTextEl = null;

  /* ---------- Snapshot capture ---------- */

  function captureActiveState() {
    var page = getActivePage();
    return {
      type: 'active',
      pageId: page ? page.id : null,
      activePageId: state.activePageId,
      html: page ? (page.html || '') : '',
      css: page ? (page.css || '') : '',
      blocks: page && page.blocks ? JSON.parse(JSON.stringify(page.blocks)) : []
    };
  }

  function captureStructuralState() {
    return {
      type: 'structural',
      activePageId: state.activePageId,
      pages: JSON.parse(JSON.stringify(project.pages || []))
    };
  }

  function captureActiveStateAlt() {
    /* Legacy name kept so the boot code above works either way. */
    return captureActiveState();
  }

  /* ---------- Restore ---------- */

  function restoreSnapshot(snap) {
    if (!snap) return;

    if (snap.type === 'active') {
      var page = null;
      for (var i = 0; i < project.pages.length; i++) {
        if (project.pages[i].id === snap.pageId) { page = project.pages[i]; break; }
      }
      if (!page) return;

      page.html = snap.html;
      page.css = snap.css;
      page.blocks = JSON.parse(JSON.stringify(snap.blocks || []));

      /* If the active page changed, switch first */
      if (state.activePageId !== snap.pageId) {
        state.activePageId = snap.pageId;
        renderPageTabs();
        buildPreviewDocument();
      } else {
        sendToRuntime('ab:set-content', { html: page.html, css: page.css || '' });
        syncProgramsToRuntime();
      }
      renderPagesPanel();
      renderPropertiesPanel();
      renderBlocksPanel();
      return;
    }

    if (snap.type === 'structural') {
      project.pages = JSON.parse(JSON.stringify(snap.pages || []));
      state.activePageId = snap.activePageId;
      ensureProjectShape(project);
      renderPageTabs();
      buildPreviewDocument();
      renderPagesPanel();
      renderPropertiesPanel();
      renderBlocksPanel();
      return;
    }
  }

  /* ---------- Commit / mark dirty ---------- */

  function commitActiveChange() {
    History.record(captureActiveState());
    updateUndoRedoButtons();
    markDirty();
  }

  function commitStructuralChange() {
    History.record(captureStructuralState());
    updateUndoRedoButtons();
    markDirty();
  }

  function updateUndoRedoButtons() {
    var undo = document.getElementById('btn-undo');
    var redo = document.getElementById('btn-redo');
    if (undo) undo.disabled = !History.canUndo();
    if (redo) redo.disabled = !History.canRedo();
  }

  function flashSelection() {
    var overlay = document.getElementById('selection-overlay');
    if (!overlay || overlay.classList.contains('is-empty')) return;
    overlay.classList.remove('is-flashing');
    void overlay.offsetWidth;
    overlay.classList.add('is-flashing');
    window.setTimeout(function () { overlay.classList.remove('is-flashing'); }, 340);

    /* Also ask the iframe to outline the selected element */
    if (selectionIds[0]) {
      sendToRuntime('ab:highlight', { id: selectionIds[0], duration: 320 });
    }
  }

  /* ---------- Undo / Redo handlers ---------- */

  function initHistory() {
    var undoBtn = document.getElementById('btn-undo');
    var redoBtn = document.getElementById('btn-redo');

    if (undoBtn) {
      undoBtn.disabled = true;
      undoBtn.addEventListener('click', onUndo);
    }
    if (redoBtn) {
      redoBtn.disabled = true;
      redoBtn.addEventListener('click', onRedo);
    }
  }

  function onUndo() {
    var snap = History.undo();
    if (!snap) return;
    restoreSnapshot(snap);
    updateUndoRedoButtons();
    markDirty();
    flashSelection();
  }

  function onRedo() {
    var snap = History.redo();
    if (!snap) return;
    restoreSnapshot(snap);
    updateUndoRedoButtons();
    markDirty();
    flashSelection();
  }

  /* ---------- Autosave ---------- */

  function initAutosave() {
    saveStatusEl = document.getElementById('save-status');
    saveIconEl = document.getElementById('save-icon');
    saveTextEl = document.getElementById('save-text');

    setSaveState('saved');

    saveTimer = window.setInterval(flushAutosave, 2000);

    window.addEventListener('beforeunload', function () {
      if (dirty) {
        Abook.saveProject(project);
        Abook.saveSession(project);
      }
    });

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden' && dirty) {
        Abook.saveProject(project);
        Abook.saveSession(project);
        dirty = false;
      }
    });

    Abook.History.onChange(updateUndoRedoButtons);
  }

  function markDirty() {
    dirty = true;
    if (saveStatusEl) setSaveState('saving');
  }

  function flushAutosave() {
    if (!dirty || !project) return;

    Abook.saveProject(project);
    Abook.saveSession(project);
    dirty = false;

    setSaveState('saved');
  }

  function setSaveState(kind) {
    if (!saveStatusEl || !saveIconEl || !saveTextEl) return;
    var icon = UNDO_ICONS[kind] || 'check';
    saveStatusEl.setAttribute('data-state', kind);
    saveTextEl.textContent = kind === 'saving' ? 'Menyimpan...' : 'Tersimpan';
    saveIconEl.innerHTML = (Abook.iconSvg(icon) || '');
  }

  /* ---------- Page navigation → session save ---------- */

  function persistBeforeNavigation() {
    Abook.saveProject(project);
    Abook.saveSession(project);
    dirty = false;
  }

  window.addEventListener('pagehide', persistBeforeNavigation);

  /* ---------- Export dialog ---------- */

  function initExportDialog() {
    var dialog = document.getElementById('export-dialog');
    if (!dialog) return;

    var closers = dialog.querySelectorAll('[data-dialog-close]');
    Array.prototype.forEach.call(closers, function (el) {
      el.addEventListener('click', closeExportDialog);
    });

    var zipBtn = document.getElementById('export-zip');
    if (zipBtn) zipBtn.addEventListener('click', runExportZip);

    var abookBtn = document.getElementById('export-abook');
    if (abookBtn) abookBtn.addEventListener('click', runExportAbook);

    var exportHeaderBtn = document.getElementById('btn-export');
    if (exportHeaderBtn) {
      /* Replace the Session 2 toast behavior with dialog open */
      exportHeaderBtn.replaceWith(exportHeaderBtn.cloneNode(true));
      var fresh = document.getElementById('btn-export');
      fresh.addEventListener('click', openExportDialog);
    }
  }

  function openExportDialog() {
    var dialog = document.getElementById('export-dialog');
    if (!dialog) return;

    var filename = document.getElementById('export-filename');
    if (filename && !filename.value) filename.value = project.name || 'a-book';

    var progress = document.getElementById('export-progress');
    if (progress) progress.hidden = true;
    var bar = document.getElementById('export-progress-bar');
    if (bar) bar.style.width = '0%';
    var text = document.getElementById('export-progress-text');
    if (text) text.textContent = '0%';

    dialog.hidden = false;
    document.body.classList.add('ab-modal-open');
    window.requestAnimationFrame(function () {
      dialog.classList.add('is-open');
    });
  }

  function closeExportDialog() {
    var dialog = document.getElementById('export-dialog');
    if (!dialog || dialog.hidden) return;
    dialog.classList.remove('is-open');
    document.body.classList.remove('ab-modal-open');
    window.setTimeout(function () {
      if (!dialog.classList.contains('is-open')) dialog.hidden = true;
    }, 260);
  }

  function runExportZip() {
    if (!Abook.Exporter || typeof Abook.Exporter.exportZip !== 'function') {
      showToast('Modul ekspor belum siap.');
      return;
    }
    /* Force-flush pending changes so the export reflects the latest edits */
    persistBeforeNavigation();

    var filename = document.getElementById('export-filename');
    var compression = document.getElementById('export-compression');
    var includeSource = document.getElementById('export-source');

    var progress = document.getElementById('export-progress');
    var bar = document.getElementById('export-progress-bar');
    var text = document.getElementById('export-progress-text');
    if (progress) progress.hidden = false;

    Abook.Exporter.exportZip(project, {
      filename: filename ? filename.value : project.name,
      compression: compression ? compression.value : 'DEFLATE',
      includeSource: !!(includeSource && includeSource.checked),
      onProgress: function (pct) {
        if (bar) bar.style.width = pct.toFixed(0) + '%';
        if (text) text.textContent = pct.toFixed(0) + '%';
      }
    }).then(function (result) {
      showToast('ZIP diunduh: ' + result.filename);
      closeExportDialog();
    }).catch(function (err) {
      console.warn('[A-Book export]', err);
      showToast('Gagal mengekspor: ' + err.message);
    });
  }

  function runExportAbook() {
    if (!Abook.Exporter || typeof Abook.Exporter.downloadAbook !== 'function') {
      showToast('Modul ekspor belum siap.');
      return;
    }
    persistBeforeNavigation();

    var filename = document.getElementById('export-filename');
    Abook.Exporter.downloadAbook(project, filename ? filename.value : project.name);
    showToast('.abook diunduh.');
  }

  /* ---------- Fullscreen preview modal ---------- */

  function initPreviewModal() {
    var modal = document.getElementById('preview-modal');
    if (!modal) return;

    var closers = modal.querySelectorAll('[data-preview-close]');
    Array.prototype.forEach.call(closers, function (el) {
      el.addEventListener('click', closePreviewModal);
    });

    var devices = modal.querySelectorAll('[data-device]');
    Array.prototype.forEach.call(devices, function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(devices, function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        setPreviewDevice(btn.getAttribute('data-device'));
      });
    });

    var headerBtn = document.getElementById('btn-preview');
    if (headerBtn) {
      headerBtn.replaceWith(headerBtn.cloneNode(true));
      var fresh = document.getElementById('btn-preview');
      fresh.addEventListener('click', openPreviewModal);
    }

    var freshDevice = 'desktop';
    setPreviewDevice(freshDevice);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) closePreviewModal();
    });
  }

  function setPreviewDevice(device) {
    var frame = document.getElementById('preview-frame');
    if (!frame) return;
    frame.setAttribute('data-device', device);
  }

  function openPreviewModal() {
    var modal = document.getElementById('preview-modal');
    var iframe = document.getElementById('ab-preview-full');
    if (!modal || !iframe) return;

    /* Feed the same document the editor preview uses, but with runtime scripts. */
    iframe.srcdoc = currentPreviewDoc || '';

    modal.hidden = false;
    document.body.classList.add('ab-modal-open');
    window.requestAnimationFrame(function () {
      modal.classList.add('is-open');
    });
  }

  function closePreviewModal() {
    var modal = document.getElementById('preview-modal');
    if (!modal || modal.hidden) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('ab-modal-open');
    window.setTimeout(function () {
      if (!modal.classList.contains('is-open')) modal.hidden = true;
    }, 260);
  }

  /* ---------- Keyboard shortcuts ---------- */

  var activeTool = 'select'; /* 'select' | 'pan' */

  function initKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
      var typing = isTypingTarget(e.target);
      var mod = e.ctrlKey || e.metaKey;

      /* Undo / Redo */
      if (!typing && mod && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        onUndo();
        return;
      }
      if (!typing && mod && (e.key.toLowerCase() === 'y' ||
          (e.key.toLowerCase() === 'z' && e.shiftKey))) {
        e.preventDefault();
        onRedo();
        return;
      }

      /* Ctrl+D duplicate */
      if (!typing && mod && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateSelected();
        return;
      }

      /* Ctrl+G group */
      if (!typing && mod && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        groupSelected();
        return;
      }

      /* Ctrl+Shift+K open block panel */
      if (!typing && mod && e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        switchSidebarTab('blocks');
        showToast('Panel blok dibuka.');
        return;
      }

      /* Esc deselect */
      if (e.key === 'Escape') {
        if (selectionIds.length) {
          clearSelection();
          sendToRuntime('ab:select-id', { id: null });
          e.preventDefault();
        }
        return;
      }

      /* Delete / Backspace */
      if (!typing && (e.key === 'Delete' || e.key === 'Backspace')) {
        if (!selectionIds.length) return;
        e.preventDefault();
        deleteSelected();
        return;
      }

      /* Arrow keys — nudge */
      if (!typing && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.key) >= 0) {
        if (!selectionIds.length) return;
        e.preventDefault();
        var step = e.shiftKey ? 10 : 1;
        var dx = e.key === 'ArrowRight' ? step : e.key === 'ArrowLeft' ? -step : 0;
        var dy = e.key === 'ArrowDown'  ? step : e.key === 'ArrowUp'   ? -step : 0;
        nudgeSelected(dx, dy);
        return;
      }

      /* Letter tools */
      if (!typing && !mod && !e.shiftKey && !e.altKey) {
        var k = e.key.toLowerCase();
        if (k === 'v') { activeTool = 'select'; showToast('Alat: Pilih'); }
        else if (k === 'h') { activeTool = 'pan'; showToast('Alat: Geser'); }
        else if (k === 't') { e.preventDefault(); insertQuickHeading(); }
      }
    });
  }

  function duplicateSelected() {
    if (!selectionIds.length) return;
    var page = getActivePage();
    if (!page) return;

    var doc = new DOMParser().parseFromString(
      '<div id="__root">' + (page.html || '') + '</div>', 'text/html');
    var root = doc.getElementById('__root');
    var newIds = [];

    selectionIds.forEach(function (id) {
      var src = root.querySelector('[data-ab-id="' + id + '"]');
      if (!src) return;
      var clone = src.cloneNode(true);
      var newId = Abook.uid('el');
      clone.setAttribute('data-ab-id', newId);
      /* Re-id any descendants */
      var desc = clone.querySelectorAll('[data-ab-id]');
      Array.prototype.forEach.call(desc, function (d) { d.setAttribute('data-ab-id', Abook.uid('el')); });
      src.parentNode.insertBefore(clone, src.nextSibling);
      newIds.push(newId);
    });

    page.html = root.innerHTML;
    Abook.saveProject(project);
    sendToRuntime('ab:set-content', { html: page.html, css: page.css || '' });
    sendToRuntime('ab:list-elements');

    selectionIds = newIds;
    state.selectedIds = newIds.slice();
    state.selectedElementId = newIds[0] || null;

    commitActiveChange();
    showToast('Elemen diduplikasi.');
  }

  function groupSelected() {
    if (selectionIds.length < 2) {
      showToast('Pilih minimal dua elemen untuk dikelompokkan.');
      return;
    }
    var groupId = Abook.uid('grp');
    mutatePageHtml(function (doc) {
      selectionIds.forEach(function (id) {
        var node = doc.querySelector('[data-ab-id="' + id + '"]');
        if (node) node.setAttribute('data-ab-group', groupId);
      });
    }, { history: false });
    commitActiveChange();
    showToast('Elemen dikelompokkan.');
  }

  function deleteSelected() {
    if (!selectionIds.length) return;
    var count = selectionIds.length;
    mutatePageHtml(function (doc) {
      selectionIds.forEach(function (id) {
        var node = doc.querySelector('[data-ab-id="' + id + '"]');
        if (node && node.parentNode) node.parentNode.removeChild(node);
      });
    });
    clearSelection();
    sendToRuntime('ab:select-id', { id: null });
    sendToRuntime('ab:list-elements');
    showToast(count + ' elemen dihapus.');
  }

  function nudgeSelected(dx, dy) {
    if (!selectionIds.length) return;
    mutatePageHtml(function (doc) {
      selectionIds.forEach(function (id) {
        var node = doc.querySelector('[data-ab-id="' + id + '"]');
        if (!node) return;
        var cur = node.style.transform || '';
        var re = /translate3?d?\(\s*(-?[\d.]+)px,\s*(-?[\d.]+)px/;
        var m = cur.match(re);
        var x = m ? parseFloat(m[1]) : 0;
        var y = m ? parseFloat(m[2]) : 0;
        x += dx;
        y += dy;
        node.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      });
    });
  }

  function insertQuickHeading() {
    var id = Abook.uid('el');
    var html = '<h2 data-ab-id="' + id + '" data-ab-type="heading-h2" class="ab-h2">Judul Baru</h2>';
    mutatePageHtml(function (doc, root) {
      root.insertAdjacentHTML('beforeend', html);
    });
    window.setTimeout(function () {
      selectionIds = [id];
      state.selectedIds = [id];
      state.selectedElementId = id;
      sendToRuntime('ab:select-id', { id: id });
      sendToRuntime('ab:list-elements');
      renderPropertiesPanel();
    }, 60);
    showToast('Heading ditambahkan.');
  }

  /* ---------- Runtime: add highlight + jiggle to the bridge ---------- */

  /* These cases are added by extending the existing onRuntimeMessage switch
     through a one-time patch. */
  (function extendRuntimeBridge() {
    /* The existing onRuntimeMessage() will already handle ab:rect,
       ab:hit, ab:selected, etc. We only need to catch a couple more. */
    /* Nothing else to do here — messages are one-way from parent. */
  })();
})();