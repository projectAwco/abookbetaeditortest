/* ==========================================================================
   A-Book — Scratch-style block system.
   Data definitions + palette + program editor + compiler.
   No free JS: users assemble blocks, we serialize to safe JSON.
   ========================================================================== */

(function () {
  'use strict';
  var Abook = (window.Abook = window.Abook || {});

  /* ====================================================================
     Categories
     ==================================================================== */

  var CATEGORIES = [
    { key: 'event',      label: 'Kejadian',  icon: 'zap' },
    { key: 'control',    label: 'Kontrol',   icon: 'git-branch' },
    { key: 'variable',   label: 'Variabel',  icon: 'hash' },
    { key: 'element',    label: 'Elemen',    icon: 'box' },
    { key: 'styling',    label: 'Gaya',      icon: 'palette' },
    { key: 'animation',  label: 'Animasi',   icon: 'sparkles' },
    { key: 'navigation', label: 'Navigasi',  icon: 'compass' },
    { key: 'quiz',       label: 'Kuis',      icon: 'help-circle' },
    { key: 'sound',      label: 'Suara',     icon: 'music' }
  ];

  /* ====================================================================
     Block definitions
     parts: { key, type, default, options? }
     body: true when the block holds a nested stack.
     ==================================================================== */

  var DEFS = [

    /* ---------- EVENT ---------- */
    { id: 'evt-click',  cat: 'event', icon: 'mouse-pointer-click', label: 'Ketika elemen ini diklik' },
    { id: 'evt-enter',  cat: 'event', icon: 'log-in',  label: 'Ketika kursor masuk elemen' },
    { id: 'evt-leave',  cat: 'event', icon: 'log-out', label: 'Ketika kursor keluar elemen' },
    { id: 'evt-hover',  cat: 'event', icon: 'mouse-pointer', label: 'Ketika kursor di atas elemen' },
    { id: 'evt-load',   cat: 'event', icon: 'play',   label: 'Ketika halaman dibuka' },
    { id: 'evt-scroll', cat: 'event', icon: 'arrow-down', label: 'Ketika halaman di-scroll' },
    { id: 'evt-var',    cat: 'event', icon: 'refresh-cw', label: 'Ketika variabel [name] berubah',
      parts: [{ key: 'name', type: 'text', default: 'skor' }] },
    { id: 'evt-correct', cat: 'event', icon: 'check-circle', label: 'Ketika jawaban benar' },
    { id: 'evt-wrong',   cat: 'event', icon: 'x-circle',    label: 'Ketika jawaban salah' },

    /* ---------- CONTROL ---------- */
    { id: 'wait',    cat: 'control', icon: 'clock', label: 'Tunggu [seconds] detik',
      parts: [{ key: 'seconds', type: 'number', default: 1 }] },
    { id: 'repeat',  cat: 'control', icon: 'repeat', label: 'Ulangi [times] kali',
      parts: [{ key: 'times', type: 'number', default: 3 }], body: true },
    { id: 'if',      cat: 'control', icon: 'git-branch', label: 'Jika [cond] maka',
      parts: [{ key: 'cond', type: 'text', default: 'true' }], body: true },
    { id: 'if-else', cat: 'control', icon: 'git-branch', label: 'Jika [cond] maka … jika tidak',
      parts: [{ key: 'cond', type: 'text', default: 'true' }], body: true, bodyAlt: true },
    { id: 'while',   cat: 'control', icon: 'refresh-cw', label: 'Selama [cond] lakukan',
      parts: [{ key: 'cond', type: 'text', default: 'false' }], body: true },
    { id: 'stop',    cat: 'control', icon: 'square', label: 'Hentikan' },

    /* ---------- VARIABLE ---------- */
    { id: 'var-create', cat: 'variable', icon: 'plus', label: 'Buat variabel [name] = [value]',
      parts: [{ key: 'name', type: 'text', default: 'skor' }, { key: 'value', type: 'text', default: '0' }] },
    { id: 'var-set',    cat: 'variable', icon: 'edit', label: 'Set [name] = [value]',
      parts: [{ key: 'name', type: 'text', default: 'skor' }, { key: 'value', type: 'text', default: '0' }] },
    { id: 'var-change', cat: 'variable', icon: 'plus-circle', label: 'Ubah [name] sebanyak [n]',
      parts: [{ key: 'name', type: 'text', default: 'skor' }, { key: 'n', type: 'number', default: 1 }] },
    { id: 'var-show',   cat: 'variable', icon: 'eye', label: 'Tampilkan variabel [name]',
      parts: [{ key: 'name', type: 'text', default: 'skor' }] },

    /* ---------- ELEMENT ---------- */
    { id: 'el-show', cat: 'element', icon: 'eye', label: 'Tampilkan [target]',
      parts: [{ key: 'target', type: 'element', default: '' }] },
    { id: 'el-hide', cat: 'element', icon: 'eye-off', label: 'Sembunyikan [target]',
      parts: [{ key: 'target', type: 'element', default: '' }] },
    { id: 'el-move', cat: 'element', icon: 'move', label: 'Pindah [target] ke ([x], [y]) selama [dur] detik',
      parts: [
        { key: 'target', type: 'element', default: '' },
        { key: 'x', type: 'number', default: 0 },
        { key: 'y', type: 'number', default: 0 },
        { key: 'dur', type: 'number', default: 0.4 }
      ] },
    { id: 'el-resize', cat: 'element', icon: 'maximize', label: 'Ubah ukuran [target] ke [w]x[h]',
      parts: [
        { key: 'target', type: 'element', default: '' },
        { key: 'w', type: 'number', default: 200 },
        { key: 'h', type: 'number', default: 120 }
      ] },
    { id: 'el-color', cat: 'element', icon: 'palette', label: 'Set warna [target] ke [color]',
      parts: [
        { key: 'target', type: 'element', default: '' },
        { key: 'color', type: 'color', default: '#7EE7FF' }
      ] },
    { id: 'el-rotate', cat: 'element', icon: 'rotate-cw', label: 'Putar [target] sebanyak [deg] derajat',
      parts: [
        { key: 'target', type: 'element', default: '' },
        { key: 'deg', type: 'number', default: 90 }
      ] },
    { id: 'el-text', cat: 'element', icon: 'type', label: 'Set teks [target] = [text]',
      parts: [
        { key: 'target', type: 'element', default: '' },
        { key: 'text', type: 'text', default: 'Halo' }
      ] },
    { id: 'el-value', cat: 'element', icon: 'input', label: 'Set nilai [target] = [value]',
      parts: [
        { key: 'target', type: 'element', default: '' },
        { key: 'value', type: 'text', default: '' }
      ] },

    /* ---------- STYLING ---------- */
    { id: 'st-class-add', cat: 'styling', icon: 'tag', label: 'Tambah kelas [name] ke [target]',
      parts: [
        { key: 'name', type: 'text', default: 'is-active' },
        { key: 'target', type: 'element', default: '' }
      ] },
    { id: 'st-class-rm', cat: 'styling', icon: 'tag', label: 'Hapus kelas [name] dari [target]',
      parts: [
        { key: 'name', type: 'text', default: 'is-active' },
        { key: 'target', type: 'element', default: '' }
      ] },
    { id: 'st-opacity', cat: 'styling', icon: 'layers', label: 'Set opacity [target] = [v]',
      parts: [
        { key: 'target', type: 'element', default: '' },
        { key: 'v', type: 'number', default: 1 }
      ] },
    { id: 'st-blur', cat: 'styling', icon: 'droplet', label: 'Set blur [target] = [v]px',
      parts: [
        { key: 'target', type: 'element', default: '' },
        { key: 'v', type: 'number', default: 4 }
      ] },

    /* ---------- ANIMATION ---------- */
    { id: 'anim-play', cat: 'animation', icon: 'sparkles', label: 'Mainkan animasi [name] pada [target]',
      parts: [
        { key: 'name', type: 'select', default: 'fade-in',
          options: ['fade-in', 'fade-out', 'slide-up', 'slide-down', 'scale-in',
                    'scale-out', 'blur-in', 'shimmer', 'glow-pulse', 'spring-bounce'] },
        { key: 'target', type: 'element', default: '' }
      ] },
    { id: 'anim-shake', cat: 'animation', icon: 'activity', label: 'Goyang [target]',
      parts: [{ key: 'target', type: 'element', default: '' }] },

    /* ---------- NAVIGATION ---------- */
    { id: 'nav-page',   cat: 'navigation', icon: 'arrow-right', label: 'Pindah ke halaman [name]',
      parts: [{ key: 'name', type: 'text', default: '' }] },
    { id: 'nav-slide',  cat: 'navigation', icon: 'presentation', label: 'Buka slide [n]',
      parts: [{ key: 'n', type: 'number', default: 1 }] },
    { id: 'nav-back',   cat: 'navigation', icon: 'arrow-left', label: 'Kembali ke halaman sebelumnya' },
    { id: 'nav-scroll', cat: 'navigation', icon: 'arrow-down', label: 'Scroll ke elemen [name]',
      parts: [{ key: 'name', type: 'text', default: '' }] },

    /* ---------- QUIZ ---------- */
    { id: 'quiz-set',   cat: 'quiz', icon: 'check-circle', label: 'Set jawaban benar = [value]',
      parts: [{ key: 'value', type: 'text', default: '' }] },
    { id: 'quiz-check', cat: 'quiz', icon: 'check-check', label: 'Periksa jawaban' },

    /* ---------- SOUND ---------- */
    { id: 'sound-tone', cat: 'sound', icon: 'music', label: 'Mainkan nada [freq] Hz selama [dur] ms',
      parts: [
        { key: 'freq', type: 'number', default: 440 },
        { key: 'dur', type: 'number', default: 200 }
      ] }
  ];

  /* ====================================================================
     Lookups
     ==================================================================== */

  function getDef(id) {
    for (var i = 0; i < DEFS.length; i++) if (DEFS[i].id === id) return DEFS[i];
    return null;
  }

  function defsByCat(cat) {
    return DEFS.filter(function (d) { return d.cat === cat; });
  }

  function eventDefs() {
    return DEFS.filter(function (d) { return d.cat === 'event'; });
  }

  /* ====================================================================
     Helpers — read a block definition's param label split
     Returns array of { type: 'text'|'part', value, part? }
     ==================================================================== */

  function parseLabel(def) {
    var label = def.label;
    var parts = def.parts || [];
    var segments = [];
    var map = {};
    for (var i = 0; i < parts.length; i++) map[parts[i].key] = parts[i];

    var re = /\[([a-zA-Z0-9_]+)\]/g;
    var lastIndex = 0;
    var m;
    while ((m = re.exec(label)) !== null) {
      if (m.index > lastIndex) {
        segments.push({ type: 'text', value: label.slice(lastIndex, m.index) });
      }
      var partDef = map[m[1]];
      if (partDef) segments.push({ type: 'part', part: partDef });
      else segments.push({ type: 'text', value: m[0] });
      lastIndex = re.lastIndex;
    }
    if (lastIndex < label.length) {
      segments.push({ type: 'text', value: label.slice(lastIndex) });
    }
    return segments;
  }

  /* ====================================================================
     Instance helpers
     ==================================================================== */

  function newActionInstance(defId) {
    var def = getDef(defId);
    if (!def) return null;
    var params = {};
    var parts = def.parts || [];
    for (var i = 0; i < parts.length; i++) params[parts[i].key] = parts[i].default;

    return {
      id: uid('blk'),
      blockId: defId,
      params: params,
      children: [],
      childrenAlt: []
    };
  }

  function uid(prefix) {
    return (prefix || 'id') + '_' +
      Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  /* ====================================================================
     Compiler — turn page.blocks into structured JSON
     ==================================================================== */

  function compile(programs) {
    if (!Array.isArray(programs)) return [];
    return programs.map(function (p) {
      return {
        id: p.id,
        targetId: p.targetId || 'page',
        event: p.event,
        eventParams: p.eventParams || {},
        actions: (p.actions || []).map(compileAction)
      };
    });
  }

  function compileAction(a) {
    if (!a) return null;
    return {
      type: a.blockId,
      params: a.params || {},
      children: (a.children || []).map(compileAction).filter(Boolean),
      childrenAlt: (a.childrenAlt || []).map(compileAction).filter(Boolean)
    };
  }

  /* ====================================================================
     Public API
     ==================================================================== */

  Abook.Blocks = {
    categories: CATEGORIES,
    defs: DEFS,
    getDef: getDef,
    defsByCat: defsByCat,
    eventDefs: eventDefs,
    parseLabel: parseLabel,
    newActionInstance: newActionInstance,
    uid: uid,
    compile: compile
  };
})();