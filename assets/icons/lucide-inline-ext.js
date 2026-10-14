/* ==========================================================================
   A-Book — Lucide inline subset, extension (Session 3)
   Appends to window.LucideIcons. Load AFTER lucide-inline.js.
   ========================================================================== */

(function () {
  'use strict';

  var set = (window.LucideIcons = window.LucideIcons || {});

  function svg(body) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ' +
           'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
           body + '</svg>';
  }

  var EXT = {

    /* ---- Text ---- */
    'type': svg(
      '<polyline points="4 7 4 4 20 4 20 7"/>' +
      '<line x1="9" x2="15" y1="20" y2="20"/>' +
      '<line x1="12" x2="12" y1="4" y2="20"/>'
    ),
    'heading': svg(
      '<path d="M6 12h12"/>' +
      '<path d="M6 20V4"/>' +
      '<path d="M18 20V4"/>'
    ),
    'align-left': svg(
      '<line x1="21" x2="3" y1="6"  y2="6"/>' +
      '<line x1="15" x2="3" y1="12" y2="12"/>' +
      '<line x1="17" x2="3" y1="18" y2="18"/>'
    ),
    'quote': svg(
      '<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>' +
      '<path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>'
    ),
    'list': svg(
      '<line x1="8" x2="21" y1="6"  y2="6"/>' +
      '<line x1="8" x2="21" y1="12" y2="12"/>' +
      '<line x1="8" x2="21" y1="18" y2="18"/>' +
      '<line x1="3" x2="3.01" y1="6"  y2="6"/>' +
      '<line x1="3" x2="3.01" y1="12" y2="12"/>' +
      '<line x1="3" x2="3.01" y1="18" y2="18"/>'
    ),
    'list-ordered': svg(
      '<line x1="10" x2="21" y1="6"  y2="6"/>' +
      '<line x1="10" x2="21" y1="12" y2="12"/>' +
      '<line x1="10" x2="21" y1="18" y2="18"/>' +
      '<path d="M4 6h1v4"/>' +
      '<path d="M4 10h2"/>' +
      '<path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>'
    ),
    'check-square': svg(
      '<polyline points="9 11 12 14 22 4"/>' +
      '<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>'
    ),
    'minus': svg('<path d="M5 12h14"/>'),
    'move-vertical': svg(
      '<polyline points="8 18 12 22 16 18"/>' +
      '<polyline points="8 6 12 2 16 6"/>' +
      '<line x1="12" x2="12" y1="2" y2="22"/>'
    ),

    /* ---- Media ---- */
    'image': svg(
      '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>' +
      '<circle cx="9" cy="9" r="2"/>' +
      '<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>'
    ),
    'images': svg(
      '<path d="M18 22H4a2 2 0 0 1-2-2V6"/>' +
      '<path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18"/>' +
      '<circle cx="12" cy="8" r="2"/>' +
      '<rect width="16" height="16" x="6" y="2" rx="2"/>'
    ),
    'video': svg(
      '<path d="m22 8-6 4 6 4V8Z"/>' +
      '<rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>'
    ),
    'music': svg(
      '<path d="M9 18V5l12-2v13"/>' +
      '<circle cx="6" cy="18" r="3"/>' +
      '<circle cx="18" cy="16" r="3"/>'
    ),
    'icons': svg(
      '<path d="M3 3h8v8H3z"/>' +
      '<circle cx="17.5" cy="7" r="4.5"/>' +
      '<path d="M3 14h8v7H3z"/>' +
      '<path d="m14 14 4 7 4-7z"/>'
    ),
    'code-2': svg(
      '<path d="m18 16 4-4-4-4"/>' +
      '<path d="m6 8-4 4 4 4"/>' +
      '<path d="m14.5 4-5 16"/>'
    ),
    'sigma': svg(
      '<path d="M18 7V4H6l6 8-6 8h12v-3"/>'
    ),
    'table': svg(
      '<path d="M12 3v18"/>' +
      '<rect width="18" height="18" x="3" y="3" rx="2"/>' +
      '<path d="M3 9h18"/>' +
      '<path d="M3 15h18"/>'
    ),

    /* ---- Card ---- */
    'square': svg('<rect width="18" height="18" x="3" y="3" rx="2"/>'),
    'layers': svg(
      '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/>' +
      '<path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>' +
      '<path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>'
    ),
    'user': svg(
      '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>' +
      '<circle cx="12" cy="7" r="4"/>'
    ),
    'bar-chart-3': svg(
      '<path d="M3 3v18h18"/>' +
      '<path d="M18 17V9"/>' +
      '<path d="M13 17V5"/>' +
      '<path d="M8 17v-3"/>'
    ),
    'calendar': svg(
      '<path d="M8 2v4"/>' +
      '<path d="M16 2v4"/>' +
      '<rect width="18" height="18" x="3" y="4" rx="2"/>' +
      '<path d="M3 10h18"/>'
    ),
    'flip-horizontal': svg(
      '<path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"/>' +
      '<path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"/>' +
      '<path d="M12 20v2"/>' +
      '<path d="M12 14v2"/>' +
      '<path d="M12 8v2"/>' +
      '<path d="M12 2v2"/>'
    ),

    /* ---- Button ---- */
    'circle': svg('<circle cx="12" cy="12" r="10"/>'),
    'link': svg(
      '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>' +
      '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'
    ),

    /* ---- Form ---- */
    'text-cursor-input': svg(
      '<path d="M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1"/>' +
      '<path d="M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5"/>' +
      '<path d="M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1"/>' +
      '<path d="M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7"/>' +
      '<path d="M9 7v10"/>'
    ),
    'chevrons-up-down': svg(
      '<path d="m7 15 5 5 5-5"/>' +
      '<path d="m7 9 5-5 5 5"/>'
    ),
    'circle-dot': svg(
      '<circle cx="12" cy="12" r="10"/>' +
      '<circle cx="12" cy="12" r="1"/>'
    ),
    'sliders': svg(
      '<line x1="4" x2="4"  y1="21" y2="14"/>' +
      '<line x1="4" x2="4"  y1="10" y2="3"/>' +
      '<line x1="12" x2="12" y1="21" y2="12"/>' +
      '<line x1="12" x2="12" y1="8"  y2="3"/>' +
      '<line x1="20" x2="20" y1="21" y2="16"/>' +
      '<line x1="20" x2="20" y1="12" y2="3"/>' +
      '<line x1="2" x2="6"  y1="14" y2="14"/>' +
      '<line x1="10" x2="14" y1="8"  y2="8"/>' +
      '<line x1="18" x2="22" y1="16" y2="16"/>'
    ),
    'toggle-left': svg(
      '<rect width="20" height="12" x="2" y="6" rx="6" ry="6"/>' +
      '<circle cx="8" cy="12" r="2"/>'
    ),

    /* ---- Interactive ---- */
    'list-collapse': svg(
      '<path d="M10 12h11"/>' +
      '<path d="M10 18h11"/>' +
      '<path d="M10 6h11"/>' +
      '<path d="m3 10 3-3-3-3"/>' +
      '<path d="m3 20 3-3-3-3"/>'
    ),
    'panels-top-left': svg(
      '<rect width="18" height="18" x="3" y="3" rx="2"/>' +
      '<path d="M3 9h18"/>' +
      '<path d="M9 21V9"/>'
    ),
    'message-circle': svg(
      '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'
    ),
    'target': svg(
      '<circle cx="12" cy="12" r="10"/>' +
      '<circle cx="12" cy="12" r="6"/>' +
      '<circle cx="12" cy="12" r="2"/>'
    ),
    'arrow-left-right': svg(
      '<path d="M8 3 4 7l4 4"/>' +
      '<path d="M4 7h16"/>' +
      '<path d="m16 21 4-4-4-4"/>' +
      '<path d="M20 17H4"/>'
    ),
    'help-circle': svg(
      '<circle cx="12" cy="12" r="10"/>' +
      '<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>' +
      '<path d="M12 17h.01"/>'
    ),
    'check-check': svg(
      '<path d="M18 6 7 17l-5-5"/>' +
      '<path d="m22 10-7.5 7.5L13 16"/>'
    ),

    /* ---- Layout ---- */
    'columns-2': svg(
      '<rect width="18" height="18" x="3" y="3" rx="2"/>' +
      '<path d="M12 3v18"/>'
    ),
    'columns-3': svg(
      '<rect width="18" height="18" x="3" y="3" rx="2"/>' +
      '<path d="M9 3v18"/>' +
      '<path d="M15 3v18"/>'
    ),
    'alert-circle': svg(
      '<circle cx="12" cy="12" r="10"/>' +
      '<line x1="12" x2="12" y1="8" y2="12"/>' +
      '<line x1="12" x2="12.01" y1="16" y2="16"/>'
    ),

    /* ---- Navigation ---- */
    'navigation': svg(
      '<polygon points="3 11 22 2 13 21 11 13 3 11"/>'
    ),
    'gauge': svg(
      '<path d="m12 14 4-4"/>' +
      '<path d="M3.34 19a10 10 0 1 1 17.32 0"/>'
    ),
    'list-checks': svg(
      '<path d="m3 17 2 2 4-4"/>' +
      '<path d="m3 7 2 2 4-4"/>' +
      '<path d="M13 6h8"/>' +
      '<path d="M13 12h8"/>' +
      '<path d="M13 18h8"/>'
    ),
    'loader-2': svg('<path d="M21 12a9 9 0 1 1-6.219-8.56"/>'),
    'check': svg('<path d="M20 6 9 17l-5-5"/>'),
    'monitor': svg(
      '<rect width="20" height="14" x="2" y="3" rx="2"/>' +
      '<line x1="8" x2="16" y1="21" y2="21"/>' +
      '<line x1="12" x2="12" y1="17" y2="21"/>'
    ),
    'tablet': svg(
      '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>' +
      '<line x1="12" x2="12.01" y1="18" y2="18"/>'
    ),
    'smartphone': svg(
      '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>' +
      '<path d="M12 18h.01"/>'
    ),
    'upload': svg(
      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>' +
      '<polyline points="17 8 12 3 7 8"/>' +
      '<line x1="12" x2="12" y1="3" y2="15"/>'
    ),
    'file-archive': svg(
      '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>' +
      '<path d="M14 2v4a2 2 0 0 0 2 2h4"/>' +
      '<path d="M10 12h1v4h-1z"/>' +
      '<path d="M10 8h1v3h-1z"/>'
    ),
    'folder-up': svg(
      '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>' +
      '<path d="M12 10v6"/>' +
      '<path d="m9 13 3-3 3 3"/>'
    ),
    'settings-2': svg(
      '<path d="M20 7h-9"/>' +
      '<path d="M14 17H5"/>' +
      '<circle cx="17" cy="17" r="3"/>' +
      '<circle cx="7" cy="7" r="3"/>'
    ),
    'save': svg(
      '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>' +
      '<polyline points="17 21 17 13 7 13 7 21"/>' +
      '<polyline points="7 3 7 8 15 8"/>'
    ),
    'eye-off': svg(
      '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>' +
      '<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>' +
      '<path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>' +
      '<line x1="2" x2="22" y1="2" y2="22"/>'
    ),
    'eye': svg(
      '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>' +
      '<circle cx="12" cy="12" r="3"/>'
    ),
    'lock': svg(
      '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>' +
      '<path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
    ),
    'unlock': svg(
      '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>' +
      '<path d="M7 11V7a5 5 0 0 1 9.9-1"/>'
    ),
    'zap': svg(
      '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>'
    ),
    'check': svg('<path d="M20 6 9 17l-5-5"/>')
  };

  for (var key in EXT) {
    if (Object.prototype.hasOwnProperty.call(EXT, key) && !set[key]) {
      set[key] = EXT[key];
    }
  }
})();