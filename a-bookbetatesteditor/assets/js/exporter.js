/* ==========================================================================
   A-Book — ZIP export + .abook share file.
   Requires JSZip (loaded from CDN in editor.html).
   Compiled block programs become plain JS (no eval, no innerHTML).
   ========================================================================== */

(function () {
  'use strict';

  var Abook = (window.Abook = window.Abook || {});

  /* ====================================================================
     Public entry points
     ==================================================================== */

  function exportZip(project, options) {
    options = options || {};

    if (!window.JSZip) {
      return Promise.reject(new Error('JSZip belum dimuat. Periksa koneksi internet.'));
    }

    var zip = new window.JSZip();
    var compression = options.compression === 'STORE' ? 'STORE' : 'DEFLATE';
    var filename = sanitizeFilename(options.filename || project.name || 'a-book');

    var pages = (project.pages || []).slice();
    if (!pages.length) {
      return Promise.reject(new Error('Project tidak memiliki halaman.'));
    }

    /* Home page becomes index.html; others become page-N.html */
    var homeIdx = 0;
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].home) { homeIdx = i; break; }
    }

    var pageFileMap = {};
    var pageIndex = 0;
    for (var j = 0; j < pages.length; j++) {
      var fname;
      if (j === homeIdx) fname = 'index.html';
      else {
        pageIndex++;
        fname = 'page-' + pageIndex + '.html';
      }
      pageFileMap[pages[j].id] = { name: fname, page: pages[j], isHome: j === homeIdx };
    }

    /* ---- Merge all CSS used by any page (deduped roughly) ---- */
    var usedCSS = collectUsedCSS(pages);

    /* ---- Icons actually used across all pages ---- */
    var usedIcons = collectUsedIcons(pages);

    /* ---- Compile blocks to JS ---- */
    var compiledJS = compileAllPrograms(pages);

    /* ---- Base styles + animations ---- */
    var baseCSS = [
      '*,*::before,*::after{box-sizing:border-box}',
      'html,body{margin:0;padding:0;min-height:100%}',
      'body{background:#020012;color:#F5F5F7;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}',
      'img,svg,video,iframe{max-width:100%;display:block}',
      'button,input,select,textarea{font-family:inherit}',
      'button{cursor:pointer}',
      '.ab-icon{display:inline-flex;align-items:center;justify-content:center;width:1em;height:1em;vertical-align:middle}',
      '.ab-icon > svg{width:100%;height:100%;display:block}',
      '.ab-hidden{display:none !important}',
      '.ab-highlight-undo{outline:2px solid rgba(126,231,255,.75);outline-offset:2px;transition:outline .15s}'
    ].join('\n');

    var animCSS = exportedAnimationsCSS();

    /* ---- Write each page HTML ---- */
    for (var k = 0; k < pages.length; k++) {
      var info = pageFileMap[pages[k].id];
      var html = buildPageHtml(pages[k], usedIcons, pageFileMap, pages);
      zip.file(info.name, html);
    }

    /* ---- Assets ---- */
    zip.file('assets/css/style.css', baseCSS + '\n\n' + usedCSS);
    zip.file('assets/css/animations.css', animCSS);
    zip.file('assets/js/runtime.js', standaloneRuntime());
    zip.file('assets/js/interactions.js', compiledJS);
    zip.file('assets/icons/lucide-inline.js', buildIconsSubset(usedIcons));

    if (options.includeSource === true) {
      zip.file('project.json', JSON.stringify(project, null, 2));
    }
    zip.file('project.abook', encodeAbook(project));

    /* ---- Generate ---- */
    return zip.generateAsync(
      { type: 'blob', compression: compression, compressionOptions: { level: 6 } },
      function (meta) {
        if (typeof options.onProgress === 'function') {
          options.onProgress(meta.percent || 0);
        }
      }
    ).then(function (blob) {
      triggerDownload(blob, filename + '.zip');
      return { filename: filename + '.zip', size: blob.size };
    });
  }

  /* ====================================================================
     .abook share format — base64-encoded JSON, re-importable
     ==================================================================== */

  function encodeAbook(project) {
    var payload = {
      format: 'abook',
      version: 1,
      exportedAt: new Date().toISOString(),
      project: project
    };
    var json = JSON.stringify(payload);
    return 'ABOOK1:' + btoa(unescape(encodeURIComponent(json)));
  }

  function decodeAbook(text) {
    if (typeof text !== 'string') throw new Error('File tidak valid.');
    var raw = text.trim();
    if (raw.indexOf('ABOOK1:') === 0) raw = raw.slice(7);
    var json;
    try {
      json = decodeURIComponent(escape(atob(raw)));
    } catch (err) {
      throw new Error('File .abook rusak atau tidak dikenali.');
    }
    var parsed = JSON.parse(json);
    if (!parsed || parsed.format !== 'abook' || !parsed.project) {
      throw new Error('Isi file .abook tidak sesuai.');
    }
    return parsed.project;
  }

  function downloadAbook(project, filename) {
    var text = encodeAbook(project);
    var blob = new Blob([text], { type: 'application/octet-stream' });
    triggerDownload(blob, sanitizeFilename(filename || project.name || 'project') + '.abook');
  }

  /* ====================================================================
     HTML cleaning
     ==================================================================== */

  function buildPageHtml(page, usedIcons, pageFileMap, allPages) {
    var body = cleanHtml(page.html || '');

    var cssLinks =
      '<link rel="stylesheet" href="assets/css/style.css">\n' +
      '<link rel="stylesheet" href="assets/css/animations.css">';

    var iconScript = '<script src="assets/icons/lucide-inline.js"><\/script>';
    var runtimeScript = '<script src="assets/js/runtime.js"><\/script>';
    var interactionsScript = '<script src="assets/js/interactions.js"><\/script>';

    var pageMapScript =
      '<script>window.__ABOOK_PAGES=' +
      JSON.stringify(buildPageMap(pageFileMap, allPages)) +
      ';<\/script>';

    return [
      '<!DOCTYPE html>',
      '<html lang="id">',
      '<head>',
      '<meta charset="UTF-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
      '<title>' + escapeHtml(page.name || 'A-Book') + '</title>',
      cssLinks,
      '</head>',
      '<body>',
      body,
      pageMapScript,
      runtimeScript,
      iconScript,
      interactionsScript,
      '</body>',
      '</html>'
    ].join('\n');
  }

  function buildPageMap(pageFileMap, allPages) {
    var map = {};
    for (var i = 0; i < allPages.length; i++) {
      var p = allPages[i];
      var info = pageFileMap[p.id];
      if (info) map[p.name] = info.name;
      map[p.id] = info ? info.name : '';
    }
    return map;
  }

  function cleanHtml(html) {
    var doc = new DOMParser().parseFromString(
      '<div id="__ab_root">' + html + '</div>', 'text/html'
    );
    var root = doc.getElementById('__ab_root');
    if (!root) return html;

    var all = root.querySelectorAll('*');
    Array.prototype.forEach.call(all, function (node) {
      /* Collect attributes to strip */
      var toRemove = [];
      var abId = null;
      for (var i = 0; i < node.attributes.length; i++) {
        var attr = node.attributes[i];
        var name = attr.name;
        if (name === 'data-ab-id') { abId = attr.value; toRemove.push(name); }
        else if (name.indexOf('data-ab-') === 0) { toRemove.push(name); }
      }
      for (var k = 0; k < toRemove.length; k++) {
        node.removeAttribute(toRemove[k]);
      }
      if (abId) node.setAttribute('data-id', abId);

      /* Expand lucide placeholders to inline SVG */
      if (node.tagName === 'I' && node.getAttribute('data-lucide')) {
        var iconName = node.getAttribute('data-lucide');
        var svg = (window.LucideIcons && window.LucideIcons[iconName]) || '';
        if (svg) {
          var span = doc.createElement('span');
          span.className = 'ab-icon';
          span.innerHTML = svg;
          node.parentNode.replaceChild(span, node);
        }
      }
    });

    return root.innerHTML;
  }

  /* ====================================================================
     CSS gathering
     ==================================================================== */

  function collectUsedCSS(pages) {
    var seen = {};
    var parts = [];
    for (var i = 0; i < pages.length; i++) {
      var css = pages[i].css || '';
      if (!css) continue;
      var key = css.trim();
      if (!key || seen[key]) continue;
      seen[key] = 1;
      parts.push('/* ---- page: ' + (pages[i].name || '') + ' ---- */');
      parts.push(css);
    }
    return parts.join('\n\n');
  }

  function exportedAnimationsCSS() {
    return [
      '@keyframes abFadeIn{from{opacity:0}to{opacity:1}}',
      '@keyframes abFadeOut{from{opacity:1}to{opacity:0}}',
      '@keyframes abSlideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}',
      '@keyframes abSlideDown{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}',
      '@keyframes abScaleIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}',
      '@keyframes abScaleOut{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.92)}}',
      '@keyframes abBlurIn{from{opacity:0;filter:blur(12px)}to{opacity:1;filter:blur(0)}}',
      '@keyframes abShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}',
      '@keyframes abGlowPulse{0%,100%{box-shadow:0 0 0 rgba(126,231,255,0)}50%{box-shadow:0 0 24px rgba(126,231,255,.45)}}',
      '@keyframes abSpringBounce{0%{transform:scale(.9)}60%{transform:scale(1.06)}100%{transform:scale(1)}}',
      '@keyframes abShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}',
      '.ab-reveal{opacity:0;transform:translateY(16px);transition:opacity .5s cubic-bezier(.22,1,.36,1),transform .5s cubic-bezier(.22,1,.36,1)}',
      '.ab-reveal.is-revealed{opacity:1;transform:translateY(0)}',
      '@media (prefers-reduced-motion: reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}'
    ].join('\n');
  }

  /* ====================================================================
     Icons
     ==================================================================== */

  function collectUsedIcons(pages) {
    var used = {};
    for (var i = 0; i < pages.length; i++) {
      var html = pages[i].html || '';
      var re = /data-lucide="([^"]+)"/g;
      var m;
      while ((m = re.exec(html)) !== null) used[m[1]] = 1;
    }
    used['check'] = 1;
    used['sparkles'] = 1;
    return Object.keys(used);
  }

  function buildIconsSubset(names) {
    var lines = [];
    lines.push('/* A-Book — inline Lucide subset (only icons used by this project) */');
    lines.push('(function(){');
    lines.push('var S=function(b){return \'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">\'+b+\'</svg>\';};');
    lines.push('var set=window.LucideIcons=window.LucideIcons||{};');
    var src = window.LucideIcons || {};
    for (var i = 0; i < names.length; i++) {
      var n = names[i];
      var svg = src[n];
      if (!svg) continue;
      /* Extract the inner body between <svg ...> and </svg> */
      var inner = svg.replace(/^[\s\S]*?>/, '').replace(/<\/svg>\s*$/, '');
      lines.push('set[' + JSON.stringify(n) + ']=S(' + JSON.stringify(inner) + ');');
    }
    lines.push('})();');
    return lines.join('\n');
  }

  /* ====================================================================
     Block compiler — produce plain JS
     ==================================================================== */

  function compileAllPrograms(pages) {
    var out = [];
    out.push('/* A-Book — compiled block programs. Generated from the editor. */');
    out.push('/* All calls go through __ab helpers. No eval. No user innerHTML. */');
    out.push('(function(){');
    out.push('function boot(){');
    out.push('  if (!window.__ab || !window.__ab.ready) { return; }');
    out.push('  window.__ab.ready(function(){');

    for (var i = 0; i < pages.length; i++) {
      var page = pages[i];
      var programs = page.blocks || [];
      if (!programs.length) continue;
      out.push('    /* ---- page: ' + JSON.stringify(page.name || page.id) + ' ---- */');
      for (var j = 0; j < programs.length; j++) {
        out.push(compileProgram(programs[j], pages));
      }
    }

    out.push('  });');
    out.push('}');
    out.push('if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);');
    out.push('else boot();');
    out.push('})();');
    return out.join('\n');
  }

  function compileProgram(prog, allPages) {
    var lines = [];
    var eventName = JSON.stringify(prog.event || 'evt-load');
    var targetId = JSON.stringify(prog.targetId || 'page');
    var eventParams = JSON.stringify(prog.eventParams || {});

    lines.push('    __ab.on(' + eventName + ', ' + targetId + ', ' + eventParams + ', async function (ctx) {');
    lines.push(compileActions(prog.actions || [], 3, allPages));
    lines.push('    });');
    return lines.join('\n');
  }

  function compileActions(actions, indent, allPages) {
    var pad = repeat('  ', indent);
    var out = [];
    for (var i = 0; i < actions.length; i++) {
      var a = actions[i];
      var s = compileAction(a, indent, allPages);
      if (s) out.push(s);
    }
    if (!out.length) out.push(pad + '/* no actions */');
    return out.join('\n');
  }

  function compileAction(a, indent, allPages) {
    var pad = repeat('  ', indent);
    var p = a.params || {};

    switch (a.type) {
      case 'wait':
        return pad + 'await __ab.sleep(' + num(p.seconds, 1) * 1000 + ');';
      case 'repeat': {
        var n = num(p.times, 1);
        var inner = compileActions(a.children || [], indent + 1, allPages);
        return pad + 'for (var __i = 0; __i < ' + n + '; __i++) {\n' + inner + '\n' + pad + '}';
      }
      case 'if': {
        var cond = compileCondition(p.cond);
        var body = compileActions(a.children || [], indent + 1, allPages);
        return pad + 'if (' + cond + ') {\n' + body + '\n' + pad + '}';
      }
      case 'if-else': {
        var cond2 = compileCondition(p.cond);
        var thenB = compileActions(a.children || [], indent + 1, allPages);
        var elseB = compileActions(a.childrenAlt || [], indent + 1, allPages);
        return pad + 'if (' + cond2 + ') {\n' + thenB + '\n' + pad + '} else {\n' + elseB + '\n' + pad + '}';
      }
      case 'while': {
        var wc = compileCondition(p.cond);
        var wb = compileActions(a.children || [], indent + 1, allPages);
        return pad + 'while (' + wc + ' && __ab.alive()) {\n' + wb + '\n' + pad + '  await __ab.tick();\n' + pad + '}';
      }
      case 'stop':
        return pad + 'return __ab.stop();';

      case 'var-create':
      case 'var-set':
        return pad + '__ab.setVar(' + str(p.name) + ', ' + str(p.value) + ');';
      case 'var-change':
        return pad + '__ab.changeVar(' + str(p.name) + ', ' + num(p.n, 0) + ');';
      case 'var-show':
        return pad + '/* var-show: ' + str(p.name) + ' */';

      case 'el-show':   return pad + '__ab.show(' + str(p.target) + ');';
      case 'el-hide':   return pad + '__ab.hide(' + str(p.target) + ');';
      case 'el-move':   return pad + 'await __ab.move(' + str(p.target) + ', ' + num(p.x, 0) + ', ' + num(p.y, 0) + ', ' + num(p.dur, 0.4) + ');';
      case 'el-resize': return pad + '__ab.resize(' + str(p.target) + ', ' + num(p.w, 200) + ', ' + num(p.h, 120) + ');';
      case 'el-color':  return pad + '__ab.setColor(' + str(p.target) + ', ' + str(p.color) + ');';
      case 'el-rotate': return pad + '__ab.rotate(' + str(p.target) + ', ' + num(p.deg, 0) + ');';
      case 'el-text':   return pad + '__ab.setText(' + str(p.target) + ', ' + str(p.text) + ');';
      case 'el-value':  return pad + '__ab.setValue(' + str(p.target) + ', ' + str(p.value) + ');';

      case 'st-class-add': return pad + '__ab.addClass(' + str(p.target) + ', ' + str(p.name) + ');';
      case 'st-class-rm':  return pad + '__ab.removeClass(' + str(p.target) + ', ' + str(p.name) + ');';
      case 'st-opacity':   return pad + '__ab.setOpacity(' + str(p.target) + ', ' + num(p.v, 1) + ');';
      case 'st-blur':      return pad + '__ab.setBlur(' + str(p.target) + ', ' + num(p.v, 0) + ');';

      case 'anim-play':    return pad + 'await __ab.animate(' + str(p.target) + ', ' + str(p.name) + ');';
      case 'anim-shake':   return pad + 'await __ab.shake(' + str(p.target) + ');';

      case 'nav-page':   return pad + '__ab.goToPage(' + str(p.name) + ');';
      case 'nav-slide':  return pad + '__ab.goToSlide(' + num(p.n, 1) + ');';
      case 'nav-back':   return pad + '__ab.back();';
      case 'nav-scroll': return pad + '__ab.scrollTo(' + str(p.name) + ');';

      case 'quiz-set':   return pad + '__ab.setCorrect(' + str(p.value) + ');';
      case 'quiz-check': return pad + '__ab.checkAnswer();';

      case 'sound-tone': return pad + 'await __ab.tone(' + num(p.freq, 440) + ', ' + num(p.dur, 200) + ');';

      default:
        return pad + '/* skipped block: ' + a.type + ' */';
    }
  }

  function compileCondition(expr) {
    if (typeof expr !== 'string') return 'false';
    var s = expr.trim();
    if (!s) return 'false';
    if (s === 'true') return 'true';
    if (s === 'false') return 'false';
    var m = s.match(/^(.+?)\s*(==|!=|>=|<=|>|<)\s*(.+)$/);
    if (m) {
      return compileOperand(m[1]) + ' ' + m[2] + ' ' + compileOperand(m[3]);
    }
    return '__ab.truthy(' + str(s) + ')';
  }

  function compileOperand(token) {
    var t = String(token).trim();
    if ((t[0] === '"' && t[t.length - 1] === '"') ||
        (t[0] === "'" && t[t.length - 1] === "'")) {
      return JSON.stringify(t.slice(1, -1));
    }
    if (/^-?\d+(\.\d+)?$/.test(t)) return t;
    if (t === 'true' || t === 'false') return t;
    return '__ab.getVar(' + JSON.stringify(t) + ')';
  }

  function num(v, dflt) {
    var n = parseFloat(v);
    return isNaN(n) ? dflt : n;
  }

  function str(v) {
    return JSON.stringify(v == null ? '' : String(v));
  }

  function repeat(s, n) {
    var out = '';
    for (var i = 0; i < n; i++) out += s;
    return out;
  }

  /* ====================================================================
     Standalone runtime — small, safe, no framework
     ==================================================================== */

  function standaloneRuntime() {
    return [
      '/* A-Book — standalone runtime for exported projects. No eval. */',
      '(function(){',
      'var vars = {};',
      'var stopped = false;',
      'var live = true;',
      'var audioCtx = null;',
      'var correctAnswer = null;',
      'var readyFns = [];',
      'var readyFired = false;',
      '',
      'function byId(id){',
      '  if (!id) return null;',
      '  if (id === "page") return document.body;',
      '  return document.querySelector(\'[data-id="\' + id + \'"]\') || document.getElementById(id);',
      '}',
      '',
      'function sleep(ms){return new Promise(function(r){setTimeout(r, ms);});}',
      'function tick(){return new Promise(function(r){requestAnimationFrame(function(){r();});});}',
      'function alive(){return live && !stopped;}',
      'function stop(){stopped = true;}',
      'function resetStop(){stopped = false;}',
      '',
      'function show(id){var e=byId(id); if(e) e.style.display="";}',
      'function hide(id){var e=byId(id); if(e) e.style.display="none";}',
      'function setColor(id,c){var e=byId(id); if(e) e.style.color=c;}',
      'function setText(id,t){var e=byId(id); if(e) e.textContent=t;}',
      'function setValue(id,v){var e=byId(id); if(e){if("value" in e) e.value=v; else e.setAttribute("data-value", v);}}',
      'function setOpacity(id,v){var e=byId(id); if(e) e.style.opacity=v;}',
      'function setBlur(id,v){var e=byId(id); if(e) e.style.filter = v>0 ? "blur("+v+"px)" : "";}',
      'function addClass(id,n){var e=byId(id); if(e&&n) e.classList.add(n);}',
      'function removeClass(id,n){var e=byId(id); if(e&&n) e.classList.remove(n);}',
      'function rotate(id,d){var e=byId(id); if(e) e.style.transform="rotate("+d+"deg)";}',
      'function resize(id,w,h){var e=byId(id); if(e){e.style.width=w+"px";e.style.height=h+"px";}}',
      'function move(id,x,y,dur){',
      '  var e=byId(id); if(!e) return Promise.resolve();',
      '  var d = (dur||0.4)*1000;',
      '  e.style.transition = "transform "+d+"ms cubic-bezier(.22,1,.36,1)";',
      '  e.style.transform = "translate("+x+"px,"+y+"px)";',
      '  return sleep(d);',
      '}',
      '',
      'function ensureAnim(){',
      '  if (document.getElementById("__ab_anim_kf")) return;',
      '  var s=document.createElement("style");',
      '  s.id="__ab_anim_kf";',
      '  s.textContent=',
      '    "@keyframes abFadeIn{from{opacity:0}to{opacity:1}}" +',
      '    "@keyframes abFadeOut{from{opacity:1}to{opacity:0}}" +',
      '    "@keyframes abSlideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}" +',
      '    "@keyframes abSlideDown{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}" +',
      '    "@keyframes abScaleIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}" +',
      '    "@keyframes abScaleOut{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.92)}}" +',
      '    "@keyframes abBlurIn{from{opacity:0;filter:blur(12px)}to{opacity:1;filter:blur(0)}}" +',
      '    "@keyframes abGlowPulse{0%,100%{box-shadow:0 0 0 rgba(126,231,255,0)}50%{box-shadow:0 0 24px rgba(126,231,255,.45)}}" +',
      '    "@keyframes abSpringBounce{0%{transform:scale(.9)}60%{transform:scale(1.06)}100%{transform:scale(1)}}" +',
      '    "@keyframes abShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}";',
      '  document.head.appendChild(s);',
      '}',
      '',
      'function animate(id, name){',
      '  var e=byId(id); if(!e) return Promise.resolve();',
      '  ensureAnim();',
      '  var map={',
      '    "fade-in":["abFadeIn",400],"fade-out":["abFadeOut",400],',
      '    "slide-up":["abSlideUp",420],"slide-down":["abSlideDown",420],',
      '    "scale-in":["abScaleIn",380],"scale-out":["abScaleOut",380],',
      '    "blur-in":["abBlurIn",460],',
      '    "shimmer":["abShimmer",1200],"glow-pulse":["abGlowPulse",1200],',
      '    "spring-bounce":["abSpringBounce",600]',
      '  };',
      '  var d = map[name] || map["fade-in"];',
      '  e.style.animation = "none";',
      '  void e.offsetWidth;',
      '  e.style.animation = d[0]+" "+d[1]+"ms cubic-bezier(.22,1,.36,1) both";',
      '  return sleep(d[1]+40).then(function(){e.style.animation="";});',
      '}',
      'function shake(id){',
      '  var e=byId(id); if(!e) return Promise.resolve();',
      '  ensureAnim();',
      '  e.style.animation = "abShake 320ms cubic-bezier(.22,1,.36,1) both";',
      '  return sleep(340).then(function(){e.style.animation="";});',
      '}',
      '',
      'function tone(freq, dur){',
      '  try {',
      '    if (!audioCtx){var C=window.AudioContext||window.webkitAudioContext; if(!C) return Promise.resolve(); audioCtx = new C();}',
      '    var o=audioCtx.createOscillator(); var g=audioCtx.createGain();',
      '    o.type="sine"; o.frequency.value=freq; g.gain.value=0;',
      '    o.connect(g); g.connect(audioCtx.destination);',
      '    var now=audioCtx.currentTime;',
      '    g.gain.linearRampToValueAtTime(.12, now+.02);',
      '    g.gain.linearRampToValueAtTime(0, now+dur/1000);',
      '    o.start(now); o.stop(now+dur/1000+.02);',
      '  } catch(e){}',
      '  return sleep(dur);',
      '}',
      '',
      'function setVar(k,v){vars[k]=v; document.dispatchEvent(new CustomEvent("ab:var-changed",{detail:{name:k,value:v}}));}',
      'function getVar(k){return vars[k];}',
      'function changeVar(k,n){vars[k] = (parseFloat(vars[k])||0) + n; document.dispatchEvent(new CustomEvent("ab:var-changed",{detail:{name:k,value:vars[k]}}));}',
      'function truthy(s){',
      '  if (s === "true") return true;',
      '  if (s === "false") return false;',
      '  if (s === "") return false;',
      '  if (Object.prototype.hasOwnProperty.call(vars, s)) return !!vars[s];',
      '  return !!s;',
      '}',
      '',
      'function goToPage(name){',
      '  var map = window.__ABOOK_PAGES || {};',
      '  var target = map[name];',
      '  if (target) window.location.href = target;',
      '}',
      'function back(){ if (window.history.length > 1) window.history.back(); }',
      'function goToSlide(n){',
      '  var track = document.querySelector(".tpl-slide__track, [data-slide-track]");',
      '  if (track) track.style.transform = "translateX(" + (-100 * Math.max(0, n - 1)) + "%)";',
      '}',
      'function scrollTo(id){',
      '  var e = byId(id) || document.getElementById(id);',
      '  if (e && e.scrollIntoView) e.scrollIntoView({behavior:"smooth",block:"start"});',
      '}',
      'function setCorrect(v){correctAnswer = String(v||"");}',
      'function checkAnswer(){',
      '  var checked = document.querySelector(\'input[type="radio"]:checked, input[type="checkbox"]:checked\');',
      '  var v = checked && checked.value ? String(checked.value) : "";',
      '  document.dispatchEvent(new CustomEvent(v === correctAnswer ? "ab:answer-correct" : "ab:answer-wrong"));',
      '}',
      '',
      'function installEvent(eventName, targetId, params, handler){',
      '  var target = byId(targetId);',
      '  var wrapper = function(e){ resetStop(); var p = handler(e); if (p && p.catch) p.catch(function(){}); };',
      '  switch(eventName){',
      '    case "evt-click":   if (target) target.addEventListener("click", wrapper); break;',
      '    case "evt-enter":   if (target) target.addEventListener("mouseenter", wrapper); break;',
      '    case "evt-leave":   if (target) target.addEventListener("mouseleave", wrapper); break;',
      '    case "evt-hover":   if (target) target.addEventListener("mousemove", wrapper); break;',
      '    case "evt-load":    setTimeout(wrapper, 30); break;',
      '    case "evt-scroll":  window.addEventListener("scroll", wrapper, {passive:true}); break;',
      '    case "evt-var":',
      '      document.addEventListener("ab:var-changed", function(e){ if (e.detail && e.detail.name === (params&&params.name)) wrapper(e); });',
      '      break;',
      '    case "evt-correct": document.addEventListener("ab:answer-correct", wrapper); break;',
      '    case "evt-wrong":   document.addEventListener("ab:answer-wrong", wrapper); break;',
      '  }',
      '}',
      '',
      'window.__ab = {',
      '  ready: function(fn){ if (readyFired) fn(); else readyFns.push(fn); },',
      '  on: installEvent,',
      '  sleep: sleep, tick: tick, alive: alive, stop: stop,',
      '  show: show, hide: hide, setColor: setColor, setText: setText, setValue: setValue,',
      '  setOpacity: setOpacity, setBlur: setBlur, addClass: addClass, removeClass: removeClass,',
      '  rotate: rotate, resize: resize, move: move,',
      '  animate: animate, shake: shake, tone: tone,',
      '  setVar: setVar, getVar: getVar, changeVar: changeVar, truthy: truthy,',
      '  goToPage: goToPage, back: back, goToSlide: goToSlide, scrollTo: scrollTo,',
      '  setCorrect: setCorrect, checkAnswer: checkAnswer',
      '};',
      '',
      'function installReveal(){',
      '  if (!("IntersectionObserver" in window)){',
      '    var all = document.querySelectorAll(".ab-reveal");',
      '    Array.prototype.forEach.call(all, function(el){ el.classList.add("is-revealed"); });',
      '    return;',
      '  }',
      '  var obs = new IntersectionObserver(function(entries){',
      '    entries.forEach(function(e){',
      '      if (!e.isIntersecting) return;',
      '      e.target.classList.add("is-revealed");',
      '      obs.unobserve(e.target);',
      '    });',
      '  }, {threshold: 0.15, rootMargin: "0px 0px -40px 0px"});',
      '  var els = document.querySelectorAll(".ab-reveal:not(.is-revealed)");',
      '  Array.prototype.forEach.call(els, function(el){ obs.observe(el); });',
      '}',
      '',
      'function boot(){',
      '  installReveal();',
      '  readyFired = true;',
      '  while (readyFns.length) { try { readyFns.shift()(); } catch(e){} }',
      '}',
      '',
      'if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);',
      'else boot();',
      '})();'
    ].join('\n');
  }

  /* ====================================================================
     Misc utilities
     ==================================================================== */

  function sanitizeFilename(name) {
    return String(name || 'a-book')
      .replace(/[^a-zA-Z0-9_\-\. ]+/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 60) || 'a-book';
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function triggerDownload(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  Abook.Exporter = {
    exportZip: exportZip,
    encodeAbook: encodeAbook,
    decodeAbook: decodeAbook,
    downloadAbook: downloadAbook,
    compileAllPrograms: compileAllPrograms
  };
})();