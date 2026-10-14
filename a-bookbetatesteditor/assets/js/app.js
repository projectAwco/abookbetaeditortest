/* ==========================================================================
   A-Book — Global init, icon rendering, helpers.
   Classic script (no modules) so pages open from file://.
   ========================================================================== */

(function () {
  'use strict';

  var Abook = (window.Abook = window.Abook || {});

  /* ---------- Language ---------- */

  function setLanguage() {
    var html = document.documentElement;
    if (!html.getAttribute('lang')) html.setAttribute('lang', 'id');
  }

  /* ---------- Theme & motion preference ---------- */

  function applyTheme() {
    var html = document.documentElement;
    html.setAttribute('data-theme', 'dark');

    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    function sync() {
      html.classList.toggle('reduce-motion', mq.matches);
    }

    sync();

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', sync);
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(sync);
    }
  }

  /* ---------- Icons ---------- */

  function iconSvg(name) {
    var set = window.LucideIcons || {};
    return set[name] || null;
  }

  function renderIcons(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll('[data-lucide]');

    Array.prototype.forEach.call(nodes, function (node) {
      var name = node.getAttribute('data-lucide');
      var markup = iconSvg(name);
      if (!markup) return;

      var wrapper = document.createElement('span');
      var extra = node.getAttribute('class') || '';
      wrapper.className = 'ab-icon' + (extra ? ' ' + extra : '');

      var label = node.getAttribute('aria-label');
      if (label) {
        wrapper.setAttribute('role', 'img');
        wrapper.setAttribute('aria-label', label);
      } else {
        wrapper.setAttribute('aria-hidden', 'true');
      }

      wrapper.innerHTML = markup;
      node.replaceWith(wrapper);
    });
  }

  /* ---------- Helpers ---------- */

  function navigate(url) {
    if (!url) return;
    window.location.href = url;
  }

  var MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
                   'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  function formatDate(input) {
    if (!input) return '';
    var d = (input instanceof Date) ? input : new Date(input);
    if (isNaN(d.getTime())) return '';
    return d.getDate() + ' ' + MONTHS_ID[d.getMonth()] + ' ' + d.getFullYear();
  }

  function uid(prefix) {
    var p = prefix || 'id';
    var rnd = Math.random().toString(36).slice(2, 10);
    var time = Date.now().toString(36);
    return p + '_' + time + rnd;
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  /* ---------- Namespaced API ---------- */

  Abook.renderIcons = renderIcons;
  Abook.iconSvg     = iconSvg;
  Abook.navigate    = navigate;
  Abook.formatDate  = formatDate;
  Abook.uid         = uid;
  Abook.ready       = ready;

  /* ---------- Global aliases (spec-required helpers) ---------- */

  window.renderIcons = renderIcons;
  window.navigate    = navigate;
  window.formatDate  = formatDate;
  window.uid         = uid;

  /* ---------- Boot ---------- */

  ready(function () {
    setLanguage();
    applyTheme();
    renderIcons();
  });
})();