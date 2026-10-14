/* ==========================================================================
   A-Book — Drag & drop engine (ghost + drop indicator + hit-test callback)
   ========================================================================== */

(function () {
  'use strict';
  var Abook = (window.Abook = window.Abook || {});
  var active = null;

  function noop() {}

  function start(opts) {
    if (active) cancel();
    active = {
      ghost: null,
      indicator: null,
      startX: opts.x,
      startY: opts.y,
      lastX: opts.x,
      lastY: opts.y,
      onMove: opts.onMove || noop,
      onDrop: opts.onDrop || noop,
      onCancel: opts.onCancel || noop,
      rafPending: false
    };

    buildGhost(opts);
    bind();
  }

  function buildGhost(opts) {
    var g = document.createElement('div');
    g.className = 'ab-dnd-ghost';
    if (opts.ghostHTML) g.innerHTML = opts.ghostHTML;
    else g.textContent = opts.ghostLabel || '';
    g.style.transform = 'translate(' + (opts.x + 16) + 'px,' + (opts.y + 16) + 'px)';
    document.body.appendChild(g);
    active.ghost = g;
    document.documentElement.classList.add('ab-dnd-active');
  }

  function bind() {
    document.addEventListener('pointermove', onMove, true);
    document.addEventListener('pointerup', onUp, true);
    document.addEventListener('pointercancel', onCancelEvent, true);
    window.addEventListener('keydown', onKey, true);
  }

  function unbind() {
    document.removeEventListener('pointermove', onMove, true);
    document.removeEventListener('pointerup', onUp, true);
    document.removeEventListener('pointercancel', onCancelEvent, true);
    window.removeEventListener('keydown', onKey, true);
  }

  function onMove(e) {
    if (!active) return;
    active.lastX = e.clientX;
    active.lastY = e.clientY;
    if (active.ghost) {
      active.ghost.style.transform =
        'translate(' + (e.clientX + 16) + 'px,' + (e.clientY + 16) + 'px)';
    }
    if (!active.rafPending) {
      active.rafPending = true;
      window.requestAnimationFrame(function () {
        if (!active) return;
        active.rafPending = false;
        active.onMove({ x: active.lastX, y: active.lastY });
      });
    }
    e.preventDefault();
  }

  function onUp(e) {
    if (!active) return;
    var a = active;
    finish();
    a.onDrop({ x: e.clientX, y: e.clientY });
  }

  function onCancelEvent() {
    if (!active) return;
    var a = active;
    finish();
    a.onCancel();
  }

  function onKey(e) {
    if (e.key === 'Escape' && active) {
      e.preventDefault();
      onCancelEvent();
    }
  }

  function finish() {
    var a = active;
    active = null;
    unbind();
    if (a && a.ghost && a.ghost.parentNode) a.ghost.parentNode.removeChild(a.ghost);
    if (a && a.indicator && a.indicator.parentNode) a.indicator.parentNode.removeChild(a.indicator);
    document.documentElement.classList.remove('ab-dnd-active');
  }

  function cancel() { onCancelEvent(); }
  function isDragging() { return active !== null; }

  function showIndicator(rect) {
    if (!active) return;
    if (!active.indicator) {
      active.indicator = document.createElement('div');
      active.indicator.className = 'ab-drop-indicator';
      document.body.appendChild(active.indicator);
    }
    var el = active.indicator;
    el.style.left = rect.left + 'px';
    el.style.top = rect.top + 'px';
    el.style.width = Math.max(20, rect.width) + 'px';
    el.style.display = 'block';
  }

  function hideIndicator() {
    if (active && active.indicator) active.indicator.style.display = 'none';
  }

  Abook.DnD = {
    start: start,
    cancel: cancel,
    isDragging: isDragging,
    showIndicator: showIndicator,
    hideIndicator: hideIndicator
  };
})();