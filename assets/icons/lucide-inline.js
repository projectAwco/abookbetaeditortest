/* ==========================================================================
   A-Book — Lucide inline subset (extended for editor).
   ========================================================================== */

(function () {
  'use strict';

  function svg(body) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ' +
           'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
           body + '</svg>';
  }

  window.LucideIcons = {

    /* ---- Landing / shared ---- */
    'book-open': svg(
      '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>' +
      '<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'
    ),
    'arrow-right': svg('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'),
    'plus':        svg('<path d="M5 12h14"/><path d="M12 5v14"/>'),
    'x':           svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
    'more-horizontal': svg(
      '<circle cx="12" cy="12" r="1"/>' +
      '<circle cx="19" cy="12" r="1"/>' +
      '<circle cx="5"  cy="12" r="1"/>'
    ),
    'file-plus': svg(
      '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/>' +
      '<path d="M14 2v4a2 2 0 0 0 2 2h4"/>' +
      '<path d="M9 15h6"/><path d="M12 12v6"/>'
    ),
    'layout-template': svg(
      '<rect width="18" height="7" x="3"  y="3"  rx="1"/>' +
      '<rect width="9"  height="7" x="3"  y="14" rx="1"/>' +
      '<rect width="5"  height="7" x="16" y="14" rx="1"/>'
    ),
    'mouse-pointer-click': svg(
      '<path d="m9 9 5 12 1.8-5.2L21 14Z"/>' +
      '<path d="M7.2 2.2 8 5.1"/><path d="m5.1 8-2.9-.8"/>' +
      '<path d="M14 4.1 12 6"/><path d="m6 12-1.9 2"/>'
    ),
    'sparkles': svg(
      '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>' +
      '<path d="M5 3v4"/><path d="M19 17v4"/>' +
      '<path d="M3 5h4"/><path d="M17 19h4"/>'
    ),
    'pencil': svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/>'),
    'copy': svg(
      '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>' +
      '<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>'
    ),
    'trash-2': svg(
      '<path d="M3 6h18"/>' +
      '<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>' +
      '<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>' +
      '<line x1="10" x2="10" y1="11" y2="17"/>' +
      '<line x1="14" x2="14" y1="11" y2="17"/>'
    ),

    /* ---- Editor: header ---- */
    'menu': svg(
      '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>'
    ),
    'undo-2': svg(
      '<path d="M9 14 4 9l5-5"/>' +
      '<path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/>'
    ),
    'redo-2': svg(
      '<path d="m15 14 5-5-5-5"/>' +
      '<path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/>'
    ),
    'search': svg(
      '<circle cx="11" cy="11" r="8"/>' +
      '<path d="m21 21-4.3-4.3"/>'
    ),
    'chevron-down':  svg('<path d="m6 9 6 6 6-6"/>'),
    'chevron-right': svg('<path d="m9 18 6-6-6-6"/>'),
    'play': svg('<polygon points="6 3 20 12 6 21 6 3"/>'),
    'download': svg(
      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>' +
      '<polyline points="7 10 12 15 17 10"/>' +
      '<line x1="12" x2="12" y1="15" y2="3"/>'
    ),
    'sliders-horizontal': svg(
      '<line x1="21" x2="14" y1="4"  y2="4"/>' +
      '<line x1="10" x2="3"  y1="4"  y2="4"/>' +
      '<line x1="21" x2="12" y1="12" y2="12"/>' +
      '<line x1="8"  x2="3"  y1="12" y2="12"/>' +
      '<line x1="21" x2="16" y1="20" y2="20"/>' +
      '<line x1="12" x2="3"  y1="20" y2="20"/>' +
      '<line x1="14" x2="14" y1="2"  y2="6"/>' +
      '<line x1="8"  x2="8"  y1="10" y2="14"/>' +
      '<line x1="16" x2="16" y1="18" y2="22"/>'
    ),

    /* ---- Editor: sidebar tabs ---- */
    'box': svg(
      '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>' +
      '<path d="m3.3 7 8.7 5 8.7-5"/>' +
      '<path d="M12 22V12"/>'
    ),
    'blocks': svg(
      '<rect width="7" height="7" x="14" y="3" rx="1"/>' +
      '<path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"/>'
    ),
    'file-text': svg(
      '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>' +
      '<path d="M14 2v4a2 2 0 0 0 2 2h4"/>' +
      '<path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>'
    ),

    /* ---- Editor: canvas toolbar ---- */
    'zoom-in': svg(
      '<circle cx="11" cy="11" r="8"/>' +
      '<line x1="21" x2="16.65" y1="21" y2="16.65"/>' +
      '<line x1="11" x2="11" y1="8" y2="14"/>' +
      '<line x1="8"  x2="14" y1="11" y2="11"/>'
    ),
    'zoom-out': svg(
      '<circle cx="11" cy="11" r="8"/>' +
      '<line x1="21" x2="16.65" y1="21" y2="16.65"/>' +
      '<line x1="8"  x2="14"   y1="11" y2="11"/>'
    ),
    'maximize-2': svg(
      '<polyline points="15 3 21 3 21 9"/>' +
      '<polyline points="9 21 3 21 3 15"/>' +
      '<line x1="21" x2="14" y1="3"  y2="10"/>' +
      '<line x1="3"  x2="10" y1="21" y2="14"/>'
    ),
    'code': svg(
      '<polyline points="16 18 22 12 16 6"/>' +
      '<polyline points="8 6 2 12 8 18"/>'
    ),
    'mouse-pointer-2': svg(
      '<path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/>'
    )
  };
})();