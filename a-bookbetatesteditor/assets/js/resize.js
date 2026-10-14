/* ==========================================================================
   A-Book — iOS-style resize, refined.
   • min 24×24, max 4000×4000
   • 4px grid snap
   • Shift-lock ratio
   • optional ratioLock flag
   • multi-element proportional scale
   • content handle for nested media
   ========================================================================== */

(function () {
  'use strict';
  var Abook = (window.Abook = window.Abook || {});
  var active = null;

  var MIN = 24;
  var MAX = 4000;

  function noop() {}

  function attach(container, opts) {
    var handles = container.querySelectorAll('[data-ab-handle]');
    Array.prototype.forEach.call(handles, function (h) {
      h.addEventListener('pointerdown', function (e) {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        begin(opts, h.getAttribute('data-ab-handle'), e);
      });
    });
  }

  function begin(opts, dir, e) {
    if (active) return;
    var rect = opts.getRect ? opts.getRect() : null;
    if (!rect) return;

    active = {
      opts: opts,
      dir: dir,
      sx: e.clientX,
      sy: e.clientY,
      startRect: rect,
      lastRect: rect,
      lastX: e.clientX,
      lastY: e.clientY,
      extras: (typeof opts.getExtras === 'function') ? opts.getExtras() : []
    };

    document.documentElement.classList.add('ab-resizing');
    window.addEventListener('pointermove', onMove, true);
    window.addEventListener('pointerup', onUp, true);
    window.addEventListener('pointercancel', onUp, true);
    window.addEventListener('keydown', onKey, true);
  }

  function onKey(e) {
    if (!active) return;
    if (e.key === 'Shift') {
      onMove({
        clientX: active.lastX, clientY: active.lastY,
        shiftKey: true, preventDefault: noop
      });
    }
    if (e.key === 'Escape') onUp();
  }

  function onMove(e) {
    if (!active) return;
    if (e.preventDefault) e.preventDefault();
    active.lastX = e.clientX;
    active.lastY = e.clientY;

    var dx = e.clientX - active.sx;
    var dy = e.clientY - active.sy;
    var r = active.startRect;
    var dir = active.dir;
    var next = { x: r.x, y: r.y, width: r.width, height: r.height };

    if (dir.indexOf('e') >= 0) next.width  = r.width  + dx;
    if (dir.indexOf('w') >= 0) { next.width = r.width - dx; next.x = r.x + dx; }
    if (dir.indexOf('s') >= 0) next.height = r.height + dy;
    if (dir.indexOf('n') >= 0) { next.height = r.height - dy; next.y = r.y + dy; }

    var lockRatio = e.shiftKey || active.opts.ratioLock === true;

    if (lockRatio) {
      var ratio = r.width / r.height;
      var anchorRight = dir.indexOf('w') >= 0;
      var anchorBottom = dir.indexOf('n') >= 0;
      if (Math.abs(next.width - r.width) > Math.abs(next.height - r.height)) {
        var newH = next.width / ratio;
        if (anchorBottom) next.y = r.y + (r.height - newH);
        next.height = newH;
      } else {
        var newW = next.height * ratio;
        if (anchorRight) next.x = r.x + (r.width - newW);
        next.width = newW;
      }
    }

    var grid = (active.opts.snapGrid != null) ? active.opts.snapGrid : 4;
    if (grid > 0) {
      next.x = Math.round(next.x / grid) * grid;
      next.y = Math.round(next.y / grid) * grid;
      next.width = Math.round(next.width / grid) * grid;
      next.height = Math.round(next.height / grid) * grid;
    }

    next.width  = Math.max(MIN, Math.min(MAX, next.width));
    next.height = Math.max(MIN, Math.min(MAX, next.height));

    active.lastRect = next;
    active.opts.onResize(next, active.extras);
  }

  function onUp() {
    if (!active) return;
    var opts = active.opts;
    var finalRect = active.lastRect;
    var extras = active.extras;
    active = null;

    document.documentElement.classList.remove('ab-resizing');
    window.removeEventListener('pointermove', onMove, true);
    window.removeEventListener('pointerup', onUp, true);
    window.removeEventListener('pointercancel', onUp, true);
    window.removeEventListener('keydown', onKey, true);

    if (opts.onCommit && finalRect) opts.onCommit(finalRect, extras);
  }

  Abook.Resize = {
    attach: attach,
    MIN: MIN,
    MAX: MAX
  };
})();