/* ==========================================================================
   A-Book — Landing interactions
   ========================================================================== */

(function () {
  'use strict';

  var Abook = window.Abook || {};

  Abook.ready(function () {
    bindLearn();
    bindRipples();
  });

  /* ---------- "Pelajari" → smooth scroll to features ---------- */

  function bindLearn() {
    var btn = document.getElementById('btn-learn');
    var target = document.getElementById('fitur');
    if (!btn || !target) return;

    btn.addEventListener('click', function () {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ---------- Thin liquid ripple on primary action ---------- */

  function bindRipples() {
    var nodes = document.querySelectorAll('[data-ripple]');
    Array.prototype.forEach.call(nodes, attachRipple);
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

  function attachRipple(el) {
    el.addEventListener('pointerdown', function (event) {
      emitRipple(el, event.clientX, event.clientY);
    });

    el.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      var rect = el.getBoundingClientRect();
      emitRipple(el, rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  }
})();