/* ==========================================================================
   A-Book — Runtime (iframe-side executor).
   Loaded by the parent; its source is serialized into the iframe srcdoc.
   NO eval, NO new Function, NO parent access beyond postMessage.
   ========================================================================== */

(function () {
  'use strict';
  var Abook = (window.Abook = window.Abook || {});

  function RUNTIME() {
    'use strict';

    /* ================= State ================= */
    var vars = {};
    var programs = [];
    var listeners = [];
    var audioCtx = null;
    var animInjected = false;
    var correctAnswer = null;
    var pageHistory = [];

    /* ================= Messaging ================= */
    function post(type, payload) {
      try {
        window.parent.postMessage({ type: 'ab:' + type, payload: payload || {} }, '*');
      } catch (err) { /* ignore */ }
    }

    function onMessage(event) {
      var data = event.data;
      if (!data || typeof data.type !== 'string') return;
      if (data.type.indexOf('ab:') !== 0) return;
      var payload = data.payload || {};
      switch (data.type) {
        case 'ab:set-content':    setContent(payload); break;
        case 'ab:install-blocks': installBlocks(payload.programs || []); break;
        case 'ab:select-id':      forwardSelection(payload.id); break;
        case 'ab:get-rect':       replyRect(payload.id); break;
        case 'ab:hit-test':       hitTest(payload); break;
        case 'ab:update-props':   updateProps(payload); break;
        case 'ab:update-style':   updateStyle(payload); break;
        case 'ab:list-elements':  listElements(); break;
        case 'ab:jiggle':         toggleJiggle(payload.ids || [], payload.on !== false); break;
        case 'ab:ping':           post('ready', { url: window.location.href }); break;
        case 'ab:highlight':      highlightElement(payload.id, payload.duration || 300); break;
    }
    }

    /* ================= Content ================= */
    function setContent(payload) {
      if (typeof payload.html === 'string') {
        document.body.innerHTML = payload.html;
      }
      if (typeof payload.css === 'string') {
        var styleEl = document.getElementById('ab-page-css');
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'ab-page-css';
          document.head.appendChild(styleEl);
        }
        styleEl.textContent = payload.css;
      }
      reinstallListeners();
      installReveal();
      installTilt();
      post('content-ready', {});
    }

    /* ================= Element utilities ================= */
    function byId(id) {
      if (!id) return null;
      return document.querySelector('[data-ab-id="' + id + '"]');
    }

    function listElements() {
      var els = Array.prototype.slice.call(document.querySelectorAll('[data-ab-id]'));
      var out = els.map(function (el) {
        var r = el.getBoundingClientRect();
        var text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
        return {
          id: el.getAttribute('data-ab-id'),
          type: el.getAttribute('data-ab-type') || '',
          text: text,
          rect: { top: r.top, left: r.left, width: r.width, height: r.height }
        };
      });
      post('elements', { list: out });
    }

    /* ================= Selection ================= */
    function forwardSelection(id) {
      if (id) post('selected', { id: id });
    }

    function onDocClick(e) {
      var el = e.target.closest && e.target.closest('[data-ab-id]');
      if (!el) { post('selected', { id: null }); return; }
      var shift = e.shiftKey;
      post('selected', { id: el.getAttribute('data-ab-id'), additive: shift });
    }

    function replyRect(id) {
      var el = byId(id);
      if (!el) { post('rect', { id: id, rect: null }); return; }
      var r = el.getBoundingClientRect();
      post('rect', { id: id, rect: { top: r.top, left: r.left, width: r.width, height: r.height } });
    }

    /* ================= Hit test (for drop) ================= */
    function hitTest(p) {
      var x = p.x, y = p.y;
      var els = Array.prototype.slice.call(document.querySelectorAll('[data-ab-id]'));
      // Reverse iterate so topmost (later in DOM) wins
      var candidates = els.filter(function (el) {
        var r = el.getBoundingClientRect();
        return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
      });
      if (!candidates.length) {
        post('hit', { targetId: null, position: 'after' });
        return;
      }
      // Innermost wins
      var target = candidates.reduce(function (best, cur) {
        var br = best.getBoundingClientRect();
        var cr = cur.getBoundingClientRect();
        return (cr.width * cr.height) < (br.width * br.height) ? cur : best;
      });
      var tr = target.getBoundingClientRect();
      var position = (y < tr.top + tr.height / 2) ? 'before' : 'after';
      post('hit', { targetId: target.getAttribute('data-ab-id'), position: position });
    }

    /* ================= Property updates ================= */
    function updateProps(p) {
      var el = byId(p.id);
      if (!el) return;
      var updates = p.updates || {};
      for (var key in updates) {
        if (!Object.prototype.hasOwnProperty.call(updates, key)) continue;
        applyProp(el, key, updates[key]);
      }
    }

    function applyProp(el, key, value) {
      switch (key) {
        case 'text':
        case 'label':
        case 'content':
          el.textContent = String(value == null ? '' : value);
          return;
        case 'src':
        case 'href':
        case 'alt':
        case 'placeholder':
        case 'value':
          el.setAttribute(key, String(value == null ? '' : value));
          return;
        case 'icon': {
          var iconEl = el.querySelector('.ab-icon') || el.querySelector('i') || el;
          var svg = (window.LucideIcons && window.LucideIcons[value]) || '';
          if (svg) iconEl.innerHTML = svg;
          return;
        }
        default:
          el.setAttribute('data-ab-' + key, String(value == null ? '' : value));
          return;
      }
    }

    function updateStyle(p) {
      var el = byId(p.id);
      if (!el) return;
      var style = p.style || {};
      for (var k in style) {
        if (!Object.prototype.hasOwnProperty.call(style, k)) continue;
        try { el.style[k] = style[k]; } catch (err) { /* ignore */ }
      }
    }

    /* ================= Program install ================= */
    function installBlocks(next) {
      programs = next || [];
      reinstallListeners();
      installReveal();
      installTilt();
      post('blocks-ready', { count: programs.length });
    }

    function reinstallListeners() {
      for (var i = 0; i < listeners.length; i++) {
        var L = listeners[i];
        try {
          if (L.kind === 'dom') L.target.removeEventListener(L.type, L.handler, L.opts);
          else if (L.kind === 'window') window.removeEventListener(L.type, L.handler, L.opts);
          else if (L.kind === 'doc') document.removeEventListener(L.type, L.handler, L.opts);
        } catch (err) { /* ignore */ }
      }
      listeners = [];

      for (var j = 0; j < programs.length; j++) {
        bindProgram(programs[j]);
      } 
    }

        function ensureJiggleKeyframes() {
      if (document.getElementById('ab-jiggle-kf')) return;
      var css = document.createElement('style');
      css.id = 'ab-jiggle-kf';
      css.textContent =
        '@keyframes abJiggle{0%,100%{transform:rotate(-0.4deg)}50%{transform:rotate(0.4deg)}}' +
        '.ab-jiggle{animation:abJiggle 500ms ease-in-out infinite alternate;transform-origin:center center}';
      document.head.appendChild(css);
    }

    function toggleJiggle(ids, on) {
      ensureJiggleKeyframes();
      for (var i = 0; i < ids.length; i++) {
        var el = byId(ids[i]);
        if (!el) continue;
        if (on) el.classList.add('ab-jiggle');
        else el.classList.remove('ab-jiggle');
      }
    }

    function installReveal() {
      if (!('IntersectionObserver' in window)) {
        var all = document.querySelectorAll('.ab-reveal');
        Array.prototype.forEach.call(all, function (el) {
          el.classList.add('is-revealed');
        });
        return;
      }
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

      var els = document.querySelectorAll('.ab-reveal:not(.is-revealed)');
      Array.prototype.forEach.call(els, function (el) { observer.observe(el); });
    }

    function installTilt() {
      var els = document.querySelectorAll('[data-ab-tilt]');
      Array.prototype.forEach.call(els, function (el) {
        if (el.__abTiltBound) return;
        el.__abTiltBound = true;
        var max = parseFloat(el.getAttribute('data-ab-tilt')) || 4;
        el.addEventListener('pointermove', function (e) {
          var rect = el.getBoundingClientRect();
          var cx = rect.left + rect.width / 2;
          var cy = rect.top + rect.height / 2;
          var dx = (e.clientX - cx) / (rect.width / 2);
          var dy = (e.clientY - cy) / (rect.height / 2);
          dx = Math.max(-1, Math.min(1, dx));
          dy = Math.max(-1, Math.min(1, dy));
          el.style.transform =
            'perspective(900px) rotateX(' + (-dy * max).toFixed(2) + 'deg) ' +
            'rotateY(' + (dx * max).toFixed(2) + 'deg)';
        });
        el.addEventListener('pointerleave', function () {
          el.style.transform = '';
        });
      });
    }

    function bindProgram(prog) {
      var evt = prog.event;
      var targetEl = prog.targetId && prog.targetId !== 'page' ? byId(prog.targetId) : null;

      var handler = function (e) { runProgram(prog, e); };
      var opts = false;

      if (evt === 'evt-click') {
        if (!targetEl) return;
        targetEl.addEventListener('click', handler, opts);
        listeners.push({ kind: 'dom', target: targetEl, type: 'click', handler: handler, opts: opts });
      } else if (evt === 'evt-enter') {
        if (!targetEl) return;
        targetEl.addEventListener('mouseenter', handler, opts);
        listeners.push({ kind: 'dom', target: targetEl, type: 'mouseenter', handler: handler, opts: opts });
      } else if (evt === 'evt-leave') {
        if (!targetEl) return;
        targetEl.addEventListener('mouseleave', handler, opts);
        listeners.push({ kind: 'dom', target: targetEl, type: 'mouseleave', handler: handler, opts: opts });
      } else if (evt === 'evt-hover') {
        if (!targetEl) return;
        targetEl.addEventListener('mousemove', handler, opts);
        listeners.push({ kind: 'dom', target: targetEl, type: 'mousemove', handler: handler, opts: opts });
      } else if (evt === 'evt-load') {
        // Fire after a tick so initial render settles
        setTimeout(function () { runProgram(prog, null); }, 30);
      } else if (evt === 'evt-scroll') {
        window.addEventListener('scroll', handler, opts);
        listeners.push({ kind: 'window', type: 'scroll', handler: handler, opts: opts });
      } else if (evt === 'evt-var') {
        var watchedName = (prog.eventParams && prog.eventParams.name) || 'skor';
        var wrap = (function (name, original) {
          return function (e) {
            if (e && e.detail && e.detail.name === name) runProgram(prog, e);
          };
        })(watchedName, handler);
        document.addEventListener('ab:var-changed', wrap, opts);
        listeners.push({ kind: 'doc', type: 'ab:var-changed', handler: wrap, opts: opts });
      } else if (evt === 'evt-correct') {
        var wrapC = function (e) { runProgram(prog, e); };
        document.addEventListener('ab:answer-correct', wrapC, opts);
        listeners.push({ kind: 'doc', type: 'ab:answer-correct', handler: wrapC, opts: opts });
      } else if (evt === 'evt-wrong') {
        var wrapW = function (e) { runProgram(prog, e); };
        document.addEventListener('ab:answer-wrong', wrapW, opts);
        listeners.push({ kind: 'doc', type: 'ab:answer-wrong', handler: wrapW, opts: opts });
      }
    }

    /* ================= Program execution ================= */
    var stopped = false;

    function runProgram(prog, evt) {
      stopped = false;
      var scope = { event: prog.event, targetId: prog.targetId, evt: evt };
      executeActions(prog.actions || [], scope).catch(function (err) {
        if (err !== 'STOP') console.warn('[A-Book runtime]', err);
      });
    }

    function executeActions(actions, scope) {
      var i = 0;
      return new Promise(function (resolve, reject) {
        function step() {
          if (stopped) return reject('STOP');
          if (i >= actions.length) return resolve();
          var a = actions[i++];
          executeAction(a, scope).then(step, function (err) {
            if (err === 'STOP') return reject('STOP');
            // Skip this action on any other error and continue
            console.warn('[A-Book runtime action]', err);
            step();
          });
        }
        step();
      });
    }

    function executeAction(a, scope) {
      if (!a) return Promise.resolve();
      var t = a.type;
      var p = a.params || {};

      switch (t) {
        case 'wait':
          return sleep(numberVal(p.seconds, 1) * 1000);
        case 'repeat':
          return runRepeat(a, scope, numberVal(p.times, 1));
        case 'if':
          return evalCond(p.cond) ? executeActions(a.children, scope) : Promise.resolve();
        case 'if-else':
          return evalCond(p.cond)
            ? executeActions(a.children, scope)
            : executeActions(a.childrenAlt || [], scope);
        case 'while':
          return runWhile(a, scope, p.cond);
        case 'stop':
          stopped = true;
          return Promise.reject('STOP');

        case 'var-create':
        case 'var-set':
          setVar(p.name, coerce(p.value));
          return Promise.resolve();
        case 'var-change':
          setVar(p.name, numberVal(vars[p.name], 0) + numberVal(p.n, 0));
          return Promise.resolve();
        case 'var-show': {
          var el = byId('page') || document.body;
          // non-blocking; log for now
          console.log('[var]', p.name, '=', vars[p.name]);
          return Promise.resolve();
        }

        case 'el-show':   return setEl(p.target, { display: '' });
        case 'el-hide':   return setEl(p.target, { display: 'none' });
        case 'el-move':   return animateMove(p, scope);
        case 'el-resize': return setEl(p.target, {
          width: numberVal(p.w, 200) + 'px',
          height: numberVal(p.h, 120) + 'px'
        });
        case 'el-color':  return setEl(p.target, { color: p.color || '#F5F5F7' });
        case 'el-rotate':
          return setEl(p.target, { transform: 'rotate(' + numberVal(p.deg, 0) + 'deg)' });
        case 'el-text': {
          var elT = byId(p.target);
          if (elT) elT.textContent = String(p.text == null ? '' : p.text);
          return Promise.resolve();
        }
        case 'el-value': {
          var elV = byId(p.target);
          if (elV) {
            if ('value' in elV) elV.value = p.value;
            else elV.setAttribute('data-value', p.value);
          }
          return Promise.resolve();
        }

        case 'st-class-add': return classOp(p.target, p.name, true);
        case 'st-class-rm':  return classOp(p.target, p.name, false);
        case 'st-opacity':   return setEl(p.target, { opacity: String(clamp01(numberVal(p.v, 1))) });
        case 'st-blur':      return setEl(p.target, {
          filter: numberVal(p.v, 0) > 0 ? 'blur(' + p.v + 'px)' : ''
        });

        case 'anim-play':    return playAnimation(p.target, p.name);
        case 'anim-shake':   return shake(p.target);

        case 'nav-page': {
          post('request-nav', { name: p.name });
          return Promise.resolve();
        }
        case 'nav-slide': {
          var track = document.querySelector('.tpl-slide__track, [data-slide-track]');
          if (track) {
            var idx = Math.max(0, numberVal(p.n, 1) - 1);
            track.style.transform = 'translateX(' + (-100 * idx) + '%)';
          }
          return Promise.resolve();
        }
        case 'nav-back': {
          post('request-back', {});
          return Promise.resolve();
        }
        case 'nav-scroll': {
          var sc = document.getElementById(p.name) ||
                   document.querySelector('[data-ab-name="' + p.name + '"]');
          if (sc && sc.scrollIntoView) sc.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return Promise.resolve();
        }

        case 'quiz-set':
          correctAnswer = String(p.value || '');
          return Promise.resolve();
        case 'quiz-check': {
          var val = readQuizValue();
          var ok = (val === correctAnswer);
          document.dispatchEvent(new CustomEvent(ok ? 'ab:answer-correct' : 'ab:answer-wrong'));
          return Promise.resolve();
        }

        case 'sound-tone':   return playTone(numberVal(p.freq, 440), numberVal(p.dur, 200));

        default:
          return Promise.resolve();
      }
    }

    /* ---------- Sub-executors ---------- */

    function runRepeat(a, scope, times) {
      var i = 0;
      var children = a.children || [];
      return new Promise(function (resolve, reject) {
        function loop() {
          if (stopped) return reject('STOP');
          if (i >= times) return resolve();
          i++;
          executeActions(children, scope).then(loop, function (err) {
            if (err === 'STOP') return reject('STOP');
            loop();
          });
        }
        loop();
      });
    }

    function runWhile(a, scope, cond) {
      return new Promise(function (resolve, reject) {
        function loop() {
          if (stopped) return reject('STOP');
          if (!evalCond(cond)) return resolve();
          executeActions(a.children, scope).then(loop, function (err) {
            if (err === 'STOP') return reject('STOP');
            loop();
          });
        }
        loop();
      });
    }

    function setEl(id, style) {
      var el = byId(id);
      if (!el) return Promise.resolve();
      for (var k in style) {
        if (!Object.prototype.hasOwnProperty.call(style, k)) continue;
        try { el.style[k] = style[k]; } catch (err) { /* ignore */ }
      }
      return Promise.resolve();
    }

    function classOp(id, name, add) {
      var el = byId(id);
      if (!el || !name) return Promise.resolve();
      if (add) el.classList.add(name);
      else el.classList.remove(name);
      return Promise.resolve();
    }

    function animateMove(p, scope) {
      var el = byId(p.target);
      if (!el) return Promise.resolve();
      var dur = numberVal(p.dur, 0.4) * 1000;
      el.style.transition = 'transform ' + dur + 'ms cubic-bezier(.22,1,.36,1)';
      el.style.transform = 'translate(' + numberVal(p.x, 0) + 'px,' + numberVal(p.y, 0) + 'px)';
      return sleep(dur);
    }

    /* ---------- Animation helpers ---------- */

    function ensureAnimStyles() {
      if (animInjected) return;
      animInjected = true;
      var css = document.createElement('style');
      css.textContent =
        '@keyframes abFadeIn{from{opacity:0}to{opacity:1}}' +
        '@keyframes abFadeOut{from{opacity:1}to{opacity:0}}' +
        '@keyframes abSlideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}' +
        '@keyframes abSlideDown{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}' +
        '@keyframes abScaleIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}' +
        '@keyframes abScaleOut{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.9)}}' +
        '@keyframes abBlurIn{from{opacity:0;filter:blur(8px)}to{opacity:1;filter:blur(0)}}' +
        '@keyframes abShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}' +
        '@keyframes abGlowPulse{0%,100%{box-shadow:0 0 0 rgba(126,231,255,0)}50%{box-shadow:0 0 24px rgba(126,231,255,.45)}}' +
        '@keyframes abSpringBounce{0%{transform:scale(.9)}60%{transform:scale(1.06)}100%{transform:scale(1)}}' +
        '@keyframes abShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}';
      document.head.appendChild(css);
    }

    function playAnimation(id, name) {
      var el = byId(id);
      if (!el) return Promise.resolve();
      ensureAnimStyles();
      var map = {
        'fade-in':      { name: 'abFadeIn',      dur: 400 },
        'fade-out':     { name: 'abFadeOut',     dur: 400 },
        'slide-up':     { name: 'abSlideUp',     dur: 420 },
        'slide-down':   { name: 'abSlideDown',   dur: 420 },
        'scale-in':     { name: 'abScaleIn',     dur: 380 },
        'scale-out':    { name: 'abScaleOut',    dur: 380 },
        'blur-in':      { name: 'abBlurIn',      dur: 460 },
        'shimmer':      { name: 'abShimmer',     dur: 1200, iter: 1 },
        'glow-pulse':   { name: 'abGlowPulse',   dur: 1200, iter: 1 },
        'spring-bounce':{ name: 'abSpringBounce', dur: 600 }
      };
      var def = map[name] || map['fade-in'];
      el.style.animation = 'none';
      // Force reflow so the animation can restart
      void el.offsetWidth;
      el.style.animation = def.name + ' ' + def.dur + 'ms cubic-bezier(.22,1,.36,1) ' +
        (def.iter ? def.iter + ' ' : '') + 'both';
      return sleep(def.dur + 40).then(function () {
        el.style.animation = '';
      });
    }

    function shake(id) {
      var el = byId(id);
      if (!el) return Promise.resolve();
      ensureAnimStyles();
      el.style.animation = 'abShake 320ms cubic-bezier(.22,1,.36,1) 1 both';
      return sleep(340).then(function () { el.style.animation = ''; });
    }

    /* ---------- Sound ---------- */

    function playTone(freq, dur) {
      try {
        if (!audioCtx) {
          var Ctor = window.AudioContext || window.webkitAudioContext;
          if (!Ctor) return Promise.resolve();
          audioCtx = new Ctor();
        }
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.value = 0.0;
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        var now = audioCtx.currentTime;
        gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
        gain.gain.linearRampToValueAtTime(0.0, now + dur / 1000);
        osc.start(now);
        osc.stop(now + dur / 1000 + 0.02);
      } catch (err) { /* ignore */ }
      return sleep(dur);
    }

    /* ---------- Quiz ---------- */

    function readQuizValue() {
      var checked = document.querySelector('input[type="radio"]:checked, input[type="checkbox"]:checked');
      if (checked && 'value' in checked && checked.value) return String(checked.value);
      return '';
    }

    /* ---------- Variables ---------- */

    function setVar(name, value) {
      if (!name) return;
      vars[name] = value;
      document.dispatchEvent(new CustomEvent('ab:var-changed', { detail: { name: name, value: value } }));
      post('var-changed', { name: name, value: value });
    }

    /* ---------- Helpers ---------- */

    function sleep(ms) {
      return new Promise(function (r) { setTimeout(r, ms); });
    }

    function numberVal(v, dflt) {
      var n = parseFloat(v);
      return isNaN(n) ? dflt : n;
    }

    function clamp01(n) { return Math.max(0, Math.min(1, n)); }

    function coerce(v) {
      if (v === 'true') return true;
      if (v === 'false') return false;
      if (v === 'null') return null;
      var n = parseFloat(v);
      if (!isNaN(n) && String(n) === String(v).trim()) return n;
      return v;
    }

    /* Very small condition evaluator: supports `a < b`, `a == b`, `a != b`,
       true/false literal, or a variable name lookup. Anything else is falsey.
       NO eval, NO new Function. */
    function evalCond(expr) {
      if (typeof expr !== 'string') return false;
      var s = expr.trim();
      if (!s) return false;
      if (s === 'true') return true;
      if (s === 'false') return false;

      var m = s.match(/^(.+?)\s*(==|!=|>=|<=|>|<)\s*(.+)$/);
      if (m) {
        var lhs = resolveOperand(m[1]);
        var rhs = resolveOperand(m[3]);
        switch (m[2]) {
          case '==': return lhs == rhs;   // eslint-disable-line eqeqeq
          case '!=': return lhs != rhs;   // eslint-disable-line eqeqeq
          case '>':  return Number(lhs) >  Number(rhs);
          case '<':  return Number(lhs) <  Number(rhs);
          case '>=': return Number(lhs) >= Number(rhs);
          case '<=': return Number(lhs) <= Number(rhs);
        }
      }
      var val = resolveOperand(s);
      return !!val;
    }

    function resolveOperand(token) {
      var t = token.trim();
      if ((t[0] === '"' && t[t.length - 1] === '"') ||
          (t[0] === "'" && t[t.length - 1] === "'")) {
        return t.slice(1, -1);
      }
      if (/^-?\d+(\.\d+)?$/.test(t)) return parseFloat(t);
      if (t === 'true') return true;
      if (t === 'false') return false;
      if (Object.prototype.hasOwnProperty.call(vars, t)) return vars[t];
      return t;
    }

    function highlightElement(id, duration) {
      var el = byId(id);
      if (!el) return;
      el.classList.add('ab-highlight-undo');
      window.setTimeout(function () {
        el.classList.remove('ab-highlight-undo');
      }, duration);
    }

    function ensureHighlightStyles() {
      if (document.getElementById('ab-highlight-kf')) return;
      var s = document.createElement('style');
      s.id = 'ab-highlight-kf';
      s.textContent =
        '.ab-highlight-undo{outline:2px solid rgba(126,231,255,.75);outline-offset:2px;' +
        'transition:outline .15s;border-radius:4px}';
      document.head.appendChild(s);
    }

    /* ================= Boot ================= */

    function boot() {
      document.addEventListener('click', onDocClick, true);
      window.addEventListener('message', onMessage);
      post('ready', {});
      // Report initial element list after a tick
      setTimeout(listElements, 40);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  }

  /* Serialize RUNTIME into a self-invoking string for iframe injection. */
  Abook.RuntimeSource = '(' + RUNTIME.toString() + ')();';
})();