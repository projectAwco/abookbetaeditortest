/* ==========================================================================
   A-Book — Dashboard logic
   ========================================================================== */

(function () {
  'use strict';

  var Abook = window.Abook || {};

  var activeMenu = null;
  var modalState = { onConfirm: null };
  var lastFocused = null;

  Abook.ready(function () {
    bindHeader();
    bindEmpty();
    bindFAB();
    bindModal();
    bindGlobalDismiss();
    bindImport();
    render();
  });

  /* ======================================================================
     Rendering
     ====================================================================== */

  function render() {
    var grid = document.getElementById('project-grid');
    var empty = document.getElementById('empty-state');
    if (!grid || !empty) return;

    var projects = Abook.listProjects();
    grid.innerHTML = '';

    if (projects.length === 0) {
      grid.hidden = true;
      empty.hidden = false;
      Abook.renderIcons(empty);
      return;
    }

    empty.hidden = true;
    grid.hidden = false;

    var frag = document.createDocumentFragment();
    for (var i = 0; i < projects.length; i++) {
      frag.appendChild(buildCard(projects[i]));
    }
    grid.appendChild(frag);
    Abook.renderIcons(grid);
  }

  function buildCard(project) {
    var article = document.createElement('article');
    article.className = 'ab-card glass';
    article.tabIndex = 0;
    article.setAttribute('role', 'button');
    article.setAttribute('aria-label', 'Buka project ' + project.name);
    article.dataset.id = project.id;

    var preview = document.createElement('div');
    preview.className = 'ab-card__preview';

    var gridPattern = document.createElement('div');
    gridPattern.className = 'ab-card__grid';
    preview.appendChild(gridPattern);

    var meta = document.createElement('div');
    meta.className = 'ab-card__meta';

    var name = document.createElement('div');
    name.className = 'ab-card__name';
    name.textContent = project.name;

    var date = document.createElement('div');
    date.className = 'ab-card__date';
    date.textContent = 'Diperbarui ' + (Abook.formatDate(project.updatedAt) || '—');

    meta.appendChild(name);
    meta.appendChild(date);

    var more = document.createElement('button');
    more.type = 'button';
    more.className = 'ab-card__more';
    more.setAttribute('aria-label', 'Menu untuk project ' + project.name);
    more.setAttribute('aria-haspopup', 'menu');
    more.innerHTML = '<i data-lucide="more-horizontal" aria-hidden="true"></i>';

    article.appendChild(preview);
    article.appendChild(meta);
    article.appendChild(more);

    article.addEventListener('click', function (event) {
      if (event.target.closest('.ab-card__more')) return;
      openProject(project.id);
    });

    article.addEventListener('keydown', function (event) {
      if (event.target !== article) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProject(project.id);
      }
    });

    more.addEventListener('click', function (event) {
      event.stopPropagation();
      openCardMenu(project, more);
    });

    return article;
  }

  function openProject(id) {
    Abook.navigate('editor.html?id=' + encodeURIComponent(id));
  }

  /* ======================================================================
     Context menu
     ====================================================================== */

  function openCardMenu(project, anchor) {
    closeMenu();

    var menu = document.createElement('div');
    menu.className = 'ab-menu';
    menu.setAttribute('role', 'menu');

    var items = [
      {
        icon: 'pencil',
        label: 'Ubah nama',
        onSelect: function () { promptRename(project); }
      },
      {
        icon: 'copy',
        label: 'Duplikat',
        onSelect: function () { duplicate(project); }
      },
      {
        icon: 'trash-2',
        label: 'Hapus',
        danger: true,
        onSelect: function () { promptDelete(project); }
      }
    ];

    for (var i = 0; i < items.length; i++) {
      menu.appendChild(buildMenuItem(items[i]));
    }

    document.body.appendChild(menu);
    Abook.renderIcons(menu);

    positionMenu(menu, anchor);

    activeMenu = menu;
    window.requestAnimationFrame(function () {
      menu.classList.add('is-open');
    });
  }

  function buildMenuItem(item) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ab-menu__item' + (item.danger ? ' is-danger' : '');
    btn.setAttribute('role', 'menuitem');
    btn.innerHTML =
      '<span class="ab-menu__icon">' +
        '<i data-lucide="' + item.icon + '" aria-hidden="true"></i>' +
      '</span>' +
      '<span></span>';

    var labelSpan = btn.querySelector('span:last-child');
    labelSpan.textContent = item.label;

    btn.addEventListener('click', function (event) {
      event.stopPropagation();
      closeMenu();
      item.onSelect();
    });

    return btn;
  }

  function positionMenu(menu, anchor) {
    var rect = anchor.getBoundingClientRect();
    var mRect = menu.getBoundingClientRect();

    var left = rect.right - mRect.width;
    var top = rect.bottom + 8;

    if (left < 8) left = 8;
    if (left + mRect.width > window.innerWidth - 8) {
      left = window.innerWidth - mRect.width - 8;
    }
    if (top + mRect.height > window.innerHeight - 8) {
      top = rect.top - mRect.height - 8;
    }
    if (top < 8) top = 8;

    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
  }

  function closeMenu() {
    if (!activeMenu) return;
    var menu = activeMenu;
    activeMenu = null;
    menu.classList.remove('is-open');
    window.setTimeout(function () {
      if (menu.parentNode) menu.parentNode.removeChild(menu);
    }, 180);
  }

  /* ======================================================================
     Actions
     ====================================================================== */

  function promptCreate() {
    openModal({
      title: 'Project baru',
      text: 'Beri nama project supaya mudah ditemukan nanti.',
      input: true,
      inputValue: 'Project Baru',
      inputPlaceholder: 'Contoh: Biologi — Sel',
      confirmLabel: 'Buat',
      onConfirm: function (value) {
        var project = Abook.createProject(value);
        Abook.saveProject(project);
        closeModal();
        openProject(project.id);
      }
    });
  }

  function promptRename(project) {
    openModal({
      title: 'Ubah nama project',
      text: '',
      input: true,
      inputValue: project.name,
      inputPlaceholder: 'Nama project',
      confirmLabel: 'Simpan',
      onConfirm: function (value) {
        Abook.renameProject(project.id, value);
        closeModal();
        render();
      }
    });
  }

  function promptDelete(project) {
    openModal({
      title: 'Hapus project?',
      text: '"' + project.name + '" akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.',
      input: false,
      confirmLabel: 'Hapus',
      danger: true,
      onConfirm: function () {
        Abook.deleteProject(project.id);
        closeModal();
        render();
      }
    });
  }

  function duplicate(project) {
    var copy = Abook.duplicateProject(project.id);
    if (copy) render();
  }

  /* ======================================================================
     Modal
     ====================================================================== */

  function openModal(opts) {
    var modal      = document.getElementById('modal');
    var title      = document.getElementById('modal-title');
    var text       = document.getElementById('modal-text');
    var field      = document.getElementById('modal-field');
    var input      = document.getElementById('modal-input');
    var confirmBtn = document.getElementById('modal-confirm');
    if (!modal || !title || !text || !field || !input || !confirmBtn) return;

    lastFocused = document.activeElement;

    title.textContent = opts.title || '';
    text.textContent  = opts.text  || '';
    text.hidden = !opts.text;

    if (opts.input) {
      field.hidden = false;
      input.value = opts.inputValue || '';
      input.placeholder = opts.inputPlaceholder || '';
    } else {
      field.hidden = true;
      input.value = '';
    }

    confirmBtn.textContent = opts.confirmLabel || 'Konfirmasi';
    confirmBtn.classList.toggle('is-danger', !!opts.danger);
    confirmBtn.classList.toggle('iridescent-border', !opts.danger);

    modalState.onConfirm = opts.onConfirm || null;

    modal.hidden = false;
    document.body.classList.add('modal-open');

    window.requestAnimationFrame(function () {
      modal.classList.add('is-open');
      window.setTimeout(function () {
        if (opts.input) {
          input.focus();
          input.select();
        } else {
          confirmBtn.focus();
        }
      }, 80);
    });
  }

  function closeModal() {
    var modal = document.getElementById('modal');
    if (!modal || modal.hidden) return;

    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    modalState.onConfirm = null;

    window.setTimeout(function () {
      modal.hidden = true;
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
      lastFocused = null;
    }, 260);
  }

  function confirmModal() {
    var field = document.getElementById('modal-field');
    var input = document.getElementById('modal-input');
    var usesInput = field && !field.hidden;

    if (usesInput) {
      var value = (input.value || '').trim();
      if (!value) {
        input.classList.add('is-shake');
        window.setTimeout(function () {
          input.classList.remove('is-shake');
        }, 380);
        input.focus();
        return;
      }
      if (modalState.onConfirm) modalState.onConfirm(value);
      return;
    }

    if (modalState.onConfirm) modalState.onConfirm();
  }

  /* ======================================================================
     Bindings
     ====================================================================== */

  function bindHeader() {
    var btn = document.getElementById('btn-new');
    if (btn) btn.addEventListener('click', promptCreate);
  }

  function bindEmpty() {
    var btn = document.getElementById('btn-empty-new');
    if (btn) btn.addEventListener('click', promptCreate);
  }

  function bindFAB() {
    var btn = document.getElementById('fab-new');
    if (btn) btn.addEventListener('click', promptCreate);
  }

  function bindModal() {
    var modal = document.getElementById('modal');
    if (!modal) return;

    var closers = modal.querySelectorAll('[data-modal-close]');
    Array.prototype.forEach.call(closers, function (el) {
      el.addEventListener('click', closeModal);
    });

    var confirmBtn = document.getElementById('modal-confirm');
    if (confirmBtn) confirmBtn.addEventListener('click', confirmModal);

    var input = document.getElementById('modal-input');
    if (input) {
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          confirmModal();
        }
      });
    }
  }

  function bindGlobalDismiss() {
    document.addEventListener('click', function (event) {
      if (!activeMenu) return;
      if (event.target.closest('.ab-menu')) return;
      if (event.target.closest('.ab-card__more')) return;
      closeMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        if (activeMenu) { closeMenu(); return; }
        closeModal();
        return;
      }
      if (event.key === 'Tab') trapFocus(event);
    });

    window.addEventListener('resize', closeMenu);
    window.addEventListener('scroll', closeMenu, true);
  }

  function trapFocus(event) {
    var modal = document.getElementById('modal');
    if (!modal || modal.hidden) return;

    var focusables = modal.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;

    var first = focusables[0];
    var last  = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
    /* ======================================================================
     Session 6 — .abook import (button + drag-and-drop)
     ====================================================================== */

  function bindImport() {
    var btn = document.getElementById('btn-import');
    var input = document.getElementById('import-input');
    if (!btn || !input) return;

    btn.addEventListener('click', function () { input.click(); });

    input.addEventListener('change', function () {
      var file = input.files && input.files[0];
      if (!file) return;
      readAbookFile(file);
      input.value = '';
    });

    /* Drag-and-drop anywhere on the dashboard */
    window.addEventListener('dragover', function (e) {
      e.preventDefault();
      document.body.classList.add('ab-drop-active');
    });

    window.addEventListener('dragleave', function (e) {
      if (e.target === document.documentElement || e.target === document.body) {
        document.body.classList.remove('ab-drop-active');
      }
    });

    window.addEventListener('drop', function (e) {
      e.preventDefault();
      document.body.classList.remove('ab-drop-active');
      var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (file) readAbookFile(file);
    });
  }

  function readAbookFile(file) {
    if (!Abook.Exporter || typeof Abook.Exporter.decodeAbook !== 'function') {
      showToast('Modul impor belum siap.');
      return;
    }

    var reader = new FileReader();

    reader.onload = function () {
      try {
        var payload = Abook.Exporter.decodeAbook(reader.result);
        var imported = Abook.importProject(payload);
        render();
        showToast('Project "' + imported.name + '" diimpor.');
      } catch (err) {
        showToast('Gagal mengimpor: ' + err.message);
      }
    };

    reader.onerror = function () {
      showToast('Gagal membaca file.');
    };

    reader.readAsText(file);
  }
})();