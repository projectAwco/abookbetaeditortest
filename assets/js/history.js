/* ==========================================================================
   A-Book — Undo/redo history.
   Snapshots are lightweight: for content edits we snapshot only the active
   page (html + css + blocks); for structural edits we snapshot the page list.
   ========================================================================== */

(function () {
  'use strict';

  var Abook = (window.Abook = window.Abook || {});

  var MAX = 100;
  var stack = [];
  var cursor = -1;
  var listeners = [];

  /* ---------- Internals ---------- */

  function notify() {
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](); } catch (err) { /* ignore */ }
    }
  }

  function trim() {
    if (stack.length <= MAX) return;
    var overflow = stack.length - MAX;
    stack.splice(0, overflow);
    cursor -= overflow;
    if (cursor < 0) cursor = 0;
  }

  /* ---------- Public API ---------- */

  function reset(snapshot) {
    stack = snapshot ? [snapshot] : [];
    cursor = stack.length - 1;
    notify();
  }

  function record(snapshot) {
    if (!snapshot) return;
    /* Truncate any redoable future */
    if (cursor < stack.length - 1) {
      stack = stack.slice(0, cursor + 1);
    }
    stack.push(snapshot);
    cursor = stack.length - 1;
    trim();
    notify();
  }

  function undo() {
    if (cursor <= 0) return null;
    cursor--;
    notify();
    return stack[cursor];
  }

  function redo() {
    if (cursor >= stack.length - 1) return null;
    cursor++;
    notify();
    return stack[cursor];
  }

  function canUndo() { return cursor > 0; }
  function canRedo() { return cursor < stack.length - 1; }

  function clear() {
    stack = [];
    cursor = -1;
    notify();
  }

  function peek() {
    return cursor >= 0 ? stack[cursor] : null;
  }

  function size() { return stack.length; }
  function position() { return cursor; }

  function onChange(fn) {
    if (typeof fn === 'function') listeners.push(fn);
  }

  Abook.History = {
    reset: reset,
    record: record,
    undo: undo,
    redo: redo,
    canUndo: canUndo,
    canRedo: canRedo,
    clear: clear,
    peek: peek,
    size: size,
    position: position,
    onChange: onChange,
    max: MAX
  };
})();