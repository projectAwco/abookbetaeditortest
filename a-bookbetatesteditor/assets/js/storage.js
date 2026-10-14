/* ==========================================================================
   A-Book — Project storage (localStorage).
   Key: "abook.projects.v1"  →  JSON array of project records.
   Automatic schema migration; safe-read with validation.
   ========================================================================== */

(function () {
  'use strict';

  var Abook = (window.Abook = window.Abook || {});
  var KEY = 'abook.projects.v1';
  var SESSION_KEY = 'abook.session.snapshot';
  var SCHEMA_VERSION = 2;

  /* ---------- Read / write ---------- */

  function readRaw() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (err) {
      console.warn('[A-Book] Gagal membaca project store:', err);
      return [];
    }
  }

  function writeRaw(list) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(list));
      return true;
    } catch (err) {
      console.warn('[A-Book] Gagal menyimpan project store:', err);
      return false;
    }
  }

  /* ---------- Migration ---------- */

  function migrate(list) {
    var changed = false;
    var out = list.map(function (p) { return migrateProject(p, function () { changed = true; }); });
    if (changed) writeRaw(out);
    return out;
  }

  function migrateProject(p, flagChange) {
    if (!p || typeof p !== 'object') return p;

    var next = p;

    /* v1 → v2 : pages array normalised; every page gets .blocks */
    var version = next.schemaVersion || 1;
    if (version < 2) {
      flagChange();
      if (!Array.isArray(next.pages)) next.pages = [];
      for (var i = 0; i < next.pages.length; i++) {
        var pg = next.pages[i];
        if (!pg.id) pg.id = 'pg_' + i + '_' + Date.now().toString(36);
        if (!pg.name) pg.name = 'Halaman ' + (i + 1);
        if (typeof pg.html !== 'string') pg.html = '';
        if (typeof pg.css !== 'string') pg.css = '';
        if (!Array.isArray(pg.blocks)) pg.blocks = [];
        if (typeof pg.home !== 'boolean') pg.home = (i === 0);
      }
      if (!next.pages.length) {
        next.pages.push({
          id: 'pg_' + Date.now().toString(36),
          name: 'Halaman 1',
          html: '',
          css: '',
          blocks: [],
          home: true
        });
      }
      if (!next.theme || typeof next.theme !== 'object') next.theme = {};
      next.schemaVersion = 2;
    }

    return next;
  }

  /* ---------- IDs / time ---------- */

  function makeId() {
    return (typeof Abook.uid === 'function')
      ? Abook.uid('prj')
      : 'prj_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function nowIso() { return new Date().toISOString(); }

  /* ---------- Public API ---------- */

  function createProject(name) {
    var ts = nowIso();
    return {
      id: makeId(),
      name: (name && String(name).trim()) ? String(name).trim() : 'Project Baru',
      createdAt: ts,
      updatedAt: ts,
      schemaVersion: SCHEMA_VERSION,
      pages: [{
        id: 'pg_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name: 'Halaman 1',
        html: '',
        css: '',
        blocks: [],
        home: true
      }],
      theme: {}
    };
  }

  function listProjects() {
    var all = migrate(readRaw());
    all.sort(function (a, b) {
      return String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''));
    });
    return all;
  }

  function getProject(id) {
    if (!id) return null;
    var all = migrate(readRaw());
    for (var i = 0; i < all.length; i++) {
      if (all[i] && all[i].id === id) return all[i];
    }
    return null;
  }

  function saveProject(project) {
    if (!project || !project.id) return null;

    var all = migrate(readRaw());
    var record = {
      id: project.id,
      name: project.name || 'Project Baru',
      createdAt: project.createdAt || nowIso(),
      updatedAt: nowIso(),
      schemaVersion: SCHEMA_VERSION,
      pages: Array.isArray(project.pages) ? project.pages : [],
      theme: project.theme || {}
    };

    var idx = -1;
    for (var i = 0; i < all.length; i++) {
      if (all[i] && all[i].id === project.id) { idx = i; break; }
    }
    if (idx >= 0) all[idx] = record;
    else all.push(record);

    writeRaw(all);
    return record;
  }

  function deleteProject(id) {
    if (!id) return false;
    var all = migrate(readRaw());
    var next = all.filter(function (p) { return p && p.id !== id; });
    if (next.length === all.length) return false;
    writeRaw(next);
    return true;
  }

  function duplicateProject(id) {
    var src = getProject(id);
    if (!src) return null;
    var ts = nowIso();
    var copy = {
      id: makeId(),
      name: (src.name || 'Project') + ' (Salinan)',
      createdAt: ts,
      updatedAt: ts,
      schemaVersion: SCHEMA_VERSION,
      pages: JSON.parse(JSON.stringify(src.pages || [])),
      theme: JSON.parse(JSON.stringify(src.theme || {}))
    };
    var all = migrate(readRaw());
    all.push(copy);
    writeRaw(all);
    return copy;
  }

  function renameProject(id, name) {
    var p = getProject(id);
    if (!p) return null;
    p.name = (name && String(name).trim()) ? String(name).trim() : p.name;
    return saveProject(p);
  }

  /* ---------- Import (.abook) ---------- */

  function importProject(payload) {
    if (!payload || typeof payload !== 'object' || !payload.id) {
      throw new Error('Payload project tidak valid.');
    }
    var all = migrate(readRaw());

    /* Ensure unique id to avoid clobbering */
    var incoming = JSON.parse(JSON.stringify(payload));
    var exists = false;
    for (var i = 0; i < all.length; i++) if (all[i].id === incoming.id) { exists = true; break; }
    if (exists) {
      incoming.id = makeId();
      incoming.name = (incoming.name || 'Project') + ' (Impor)';
    }
    incoming.updatedAt = nowIso();
    incoming.schemaVersion = SCHEMA_VERSION;
    incoming.pages = incoming.pages || [];

    all.push(incoming);
    writeRaw(all);
    return incoming;
  }

  /* ---------- sessionStorage snapshot ---------- */

  function saveSession(project) {
    if (!project) return false;
    try {
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(project));
      return true;
    } catch (err) { return false; }
  }

  function loadSession() {
    try {
      var raw = window.sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) { return null; }
  }

  function clearSession() {
    try { window.sessionStorage.removeItem(SESSION_KEY); } catch (err) {}
  }

  /* ---------- Expose ---------- */

  Abook.createProject    = createProject;
  Abook.listProjects     = listProjects;
  Abook.getProject       = getProject;
  Abook.saveProject      = saveProject;
  Abook.deleteProject    = deleteProject;
  Abook.duplicateProject = duplicateProject;
  Abook.renameProject    = renameProject;
  Abook.importProject    = importProject;
  Abook.saveSession      = saveSession;
  Abook.loadSession      = loadSession;
  Abook.clearSession     = clearSession;
  Abook.SCHEMA_VERSION   = SCHEMA_VERSION;
})();