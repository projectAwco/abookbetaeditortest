/* ==========================================================================
   A-Book — Animation & effects engine.

   API (all on window.ab):
     ab.animate(el, "fade-in", { duration, delay, easing, iterations, onEnd })
     ab.ripple(event, el)
     ab.iridescentSweep(el)
     ab.press(el)                     — spring release after :active
     ab.clickEffect(el)               — press + ripple + sweep combo (idempotent)
     ab.tilt(el, { max, perspective, shine })
     ab.magnetic(el, { strength, radius })
     ab.shimmer(el)                   — one-shot shimmer sweep
     ab.reveal(selector, { threshold, rootMargin })
     ab.parallax(selector)
     ab.glowPulse(el, on = true)
     ab.scrollProgress()              — installs a top progress bar
     ab.headerShrink(selector = ".ab-editor-header")
     ab.jiggle(elements, on = true)
     ab.installDefaults()             — auto-wires click/tilt/shimmer/reveal on
                                        the standard A-Book selectors

   All helpers are idempotent (safe to call repeatedly) and no-ops when the
   user prefers reduced motion (except ab.animate, which collapses durations
   to 0.01ms as required by the rules).
   ========================================================================== */

(function () {
  'use strict';

  var Abook = (window.Abook = window.Abook || {});

  /* ================= Reduced motion ================= */

  var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = reduceQuery.matches;

  if (typeof reduceQuery.addEventListener === 'function') {
    reduceQuery.addEventListener('change', function (e) {
      reduce = e.matches;
    });
  } else if (typeof reduceQuery.addListener === 'function') {
    reduceQuery.addListener(function (e) { reduce = e.matches; });
  }

  /* ================= Animation registry ================= */

  var ANIMATIONS = {
    'fade-in':       { name: 'ab-fade-in',       duration: 400, easing: 'var(--ab-ease-base)' },
    'fade-out':      { name: 'ab-fade-out',      duration: 250, easing: 'var(--ab-ease-base)' },
    'slide-up':      { name: 'ab-slide-up',      duration: 400, easing: 'var(--ab-ease-base)' },
    'slide-down':    { name: 'ab-slide-down',    duration: 400, easing: 'var(--ab-ease-base)' },
    'slide-right':   { name: 'ab-slide-right',   duration: 400, easing: 'var(--ab-ease-base)' },
    'scale-in':      { name: 'ab-scale-in',      duration: 400, easing: 'var(--ab-ease-spring)' },
    'scale-out':     { name: 'ab-scale-out',     duration: 250, easing: 'var(--ab-ease-base)' },
    'blur-in':       { name: 'ab-blur-in',       duration: 500, easing: 'var(--ab-ease-base)' },
    'blur-in-slide': { name: 'ab-blur-in-slide', duration: 500, easing: 'var(--ab-ease-base)' },
    'shimmer':       { name: 'ab-shimmer-sweep', duration: 900, easing: 'linear' },
    'glow-pulse':    { name: 'ab-glow-pulse',    duration: 2000, easing: 'ease-in-out', iterations: 'infinite' },
    'spring-bounce': { name: 'ab-spring-bounce', duration: 320, easing: 'var(--ab-ease-spring)' },
    'shake':         { name: 'ab-shake',         duration: 320, easing: 'var(--ab-ease-base)' },
    'jiggle':        { name: 'ab-jiggle',        duration: 500, easing: 'ease-in-out', iterations: 'infinite', direction: 'alternate' }
  };

  /* ================= Core animate ================= */

  function animate(el, name, opts) {
    if (!el) return Promise.resolve(null);

    var def = ANIMATIONS[name];
    if (!def) {
      console.warn('[ab.animate] Unknown animation:', name);
      return Promise.resolve(null);
    }

    opts = opts || {};
    var duration   = reduce ? 0.01 : (opts.duration   != null ? opts.duration   : def.duration);
    var delay      = reduce ? 0    : (opts.delay      != null ? opts.delay      : 0);
    var iterations = opts.iterations != null ? opts.iterations : (def.iterations || 1);
    var easing     = opts.easing     || def.easing || 'ease';
    var direction  = opts.direction  || def.direction || 'normal';
    var fill       = opts.fill       || 'both';
    var infinite   = iterations === 'infinite' || iterations === Infinity;

    /* Clear any prior animation and force reflow to restart cleanly */
    el.style.animation = 'none';
    void el.offsetWidth;

    el.style.animation =
      def.name + ' ' +
      duration + 'ms ' +
      easing + ' ' +
      delay + 'ms ' +
      iterations + ' ' +
      direction + ' ' +
      fill;

    return new Promise(function (resolve) {
      if (infinite) {
        resolve(el);
        return;
      }
      function done() {
        el.removeEventListener('animationend', done);
        if (opts.keepAnimation !== true) el.style.animation = '';
        if (typeof opts.onEnd === 'function') opts.onEnd(el);
        resolve(el);
      }
      el.addEventListener('animationend', done, { once: true });
    });
  }

  /* ================= Ripple ================= */

  function ensurePositioned(el) {
    var cs = window.getComputedStyle(el);
    if (cs.position === 'static') {
      el.style.position = 'relative';
    }
    if (cs.overflow !== 'hidden' && cs.overflow !== 'clip') {
      /* Add a soft clip via a persistent inline clip wrapper only when needed.
         For simplicity, most buttons already have overflow hidden. If not,
         the ripple stays inside because we size it to the box. */
    }
  }

  function ripple(event, el) {
    if (!el) return;
    if (reduce) return;

    ensurePositioned(el);

    var rect = el.getBoundingClientRect();
    var size = Math.min(400, Math.max(rect.width, rect.height) * 2);
    var x = (event && event.clientX != null ? event.clientX : rect.left + rect.width / 2) - rect.left;
    var y = (event && event.clientY != null ? event.clientY : rect.top + rect.height / 2) - rect.top;

    var dot = document.createElement('span');
    dot.className = 'ab-ripple-thin';
    dot.setAttribute('aria-hidden', 'true');
    dot.style.width  = size + 'px';
    dot.style.height = size + 'px';
    dot.style.left   = (x - size / 2) + 'px';
    dot.style.top    = (y - size / 2) + 'px';

    el.appendChild(dot);
    window.setTimeout(function () {
      if (dot.parentNode) dot.parentNode.removeChild(dot);
    }, 460);
  }

  /* ================= Iridescent sweep ================= */

  function iridescentSweep(el) {
    if (!el || reduce) return;
    if (el.querySelector(':scope > .ab-sweep-clip')) return; // already sweeping

    var cs = window.getComputedStyle(el);
    if (cs.position === 'static') el.style.position = 'relative';

    var clip = document.createElement('span');
    clip.className = 'ab-sweep-clip';
    clip.setAttribute('aria-hidden', 'true');

    var line = document.createElement('span');
    line.className = 'ab-iridescent-sweep';

    clip.appendChild(line);
    el.appendChild(clip);

    window.setTimeout(function () {
      if (clip.parentNode) clip.parentNode.removeChild(clip);
    }, 560);
  }

  /* ================= Press (spring release) ================= */

  function press(el) {
    if (!el || reduce) return;
    el.classList.remove('ab-spring-release');
    /* Force reflow so the animation restarts if pressed in quick succession */
    void el.offsetWidth;
    el.classList.add('ab-spring-release');
    window.setTimeout(function () {
      el.classList.remove('ab-spring-release');
    }, 360);
  }

  /* ================= Combined click effect ================= */

  function clickEffect(el) {
    if (!el || el.__abClickBound) return;
    el.__abClickBound = true;

    el.addEventListener('pointerup', function () {
      press(el);
    }, { passive: true });

    el.addEventListener('click', function (e) {
      ripple(e, el);
      iridescentSweep(el);
    });
  }

  /* ================= Tilt ================= */

  function tilt(el, opts) {
    if (!el || reduce) return function () {};
    opts = opts || {};

    var max         = opts.max != null ? opts.max : 4;
    var perspective = opts.perspective != null ? opts.perspective : 900;
    var shine       = opts.shine !== false;

    el.classList.add('ab-tilt');

    var shineEl = null;
    if (shine && !el.querySelector(':scope > .ab-tilt-shine')) {
      shineEl = document.createElement('span');
      shineEl.className = 'ab-tilt-shine';
      shineEl.setAttribute('aria-hidden', 'true');
      el.appendChild(shineEl);
    } else {
      shineEl = el.querySelector(':scope > .ab-tilt-shine');
    }

    var rafId = null;
    var last = null;

    function apply(e) {
      rafId = null;
      if (!last) return;
      var rect = el.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dx = (last.x - cx) / (rect.width / 2);
      var dy = (last.y - cy) / (rect.height / 2);
      dx = Math.max(-1, Math.min(1, dx));
      dy = Math.max(-1, Math.min(1, dy));

      var ry = dx * max;
      var rx = -dy * max;

      el.style.transform =
        'perspective(' + perspective + 'px) ' +
        'rotateX(' + rx.toFixed(2) + 'deg) ' +
        'rotateY(' + ry.toFixed(2) + 'deg)';

      if (shineEl) {
        var px = ((dx + 1) / 2) * 100;
        var py = ((dy + 1) / 2) * 100;
        shineEl.style.background =
          'radial-gradient(circle at ' + px + '% ' + py + '%, ' +
          'rgba(255,255,255,0.16), transparent 55%)';
      }
    }

    function onMove(e) {
      last = { x: e.clientX, y: e.clientY };
      if (!rafId) rafId = window.requestAnimationFrame(apply);
    }

    function onLeave() {
      last = null;
      if (rafId) { window.cancelAnimationFrame(rafId); rafId = null; }
      el.style.transform = 'perspective(' + perspective + 'px) rotateX(0) rotateY(0)';
      if (shineEl) shineEl.style.background = 'transparent';
    }

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);

    return function unbind() {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.classList.remove('ab-tilt');
      if (shineEl && shineEl.parentNode) shineEl.parentNode.removeChild(shineEl);
    };
  }

  /* ================= Magnetic ================= */

  function magnetic(el, opts) {
    if (!el || reduce) return function () {};
    opts = opts || {};

    var strength = opts.strength != null ? opts.strength : 6;
    var radius   = opts.radius   != null ? opts.radius   : 80;

    el.classList.add('ab-magnetic');

    var targetX = 0, targetY = 0;
    var currentX = 0, currentY = 0;
    var rafId = null;
    var active = false;

    function tick() {
      rafId = null;
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;

      var settled =
        Math.abs(targetX - currentX) < 0.05 &&
        Math.abs(targetY - currentY) < 0.05;

      if (settled) {
        currentX = targetX;
        currentY = targetY;
      }

      el.style.transform =
        'translate3d(' + currentX.toFixed(2) + 'px, ' +
        currentY.toFixed(2) + 'px, 0)';

      if (!settled) rafId = window.requestAnimationFrame(tick);
    }

    function schedule() {
      if (!rafId) rafId = window.requestAnimationFrame(tick);
    }

    function onMove(e) {
      var rect = el.getBoundingClientRect();
      /* rect already reflects current transform, so undo it to get layout box */
      var left = rect.left - currentX;
      var top  = rect.top  - currentY;
      var cx = left + rect.width / 2;
      var cy = top  + rect.height / 2;
      var dx = e.clientX - cx;
      var dy = e.clientY - cy;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var maxDist = Math.max(rect.width, rect.height) / 2 + radius;

      if (dist > maxDist) {
        if (active) {
          active = false;
          targetX = 0; targetY = 0;
          schedule();
        }
        return;
      }

      active = true;
      var nx = dx / maxDist;
      var ny = dy / maxDist;
      targetX = nx * strength;
      targetY = ny * strength;
      schedule();
    }

    function onLeave() {
      active = false;
      targetX = 0;
      targetY = 0;
      schedule();
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);

    return function unbind() {
      window.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (rafId) window.cancelAnimationFrame(rafId);
      el.style.transform = '';
      el.classList.remove('ab-magnetic');
    };
  }

  /* ================= One-shot shimmer ================= */

  function shimmer(el) {
    if (!el || reduce) return;
    ensurePositioned(el);
    el.classList.add('ab-shimmer-hover');
    /* Trigger the sweep immediately */
    el.classList.remove('ab-shimmer-once');
    void el.offsetWidth;
    el.classList.add('ab-shimmer-once');
    el.style.setProperty('--ab-shimmer-active', '1');
  }

  /* ================= Reveal on scroll ================= */

  function reveal(selector, opts) {
    opts = opts || {};
    if (reduce) {
      var all = document.querySelectorAll(selector);
      Array.prototype.forEach.call(all, function (el) {
        el.classList.add('ab-reveal', 'is-revealed');
      });
      return null;
    }

    var els = document.querySelectorAll(selector);
    if (!els.length) return null;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: opts.threshold != null ? opts.threshold : 0.15,
      rootMargin: opts.rootMargin || '0px 0px -40px 0px'
    });

    Array.prototype.forEach.call(els, function (el) {
      if (el.__abRevealed) return;
      el.__abRevealed = true;
      el.classList.add('ab-reveal');
      observer.observe(el);
    });

    return observer;
  }

  /* ================= Parallax ================= */

  function parallax(selector, opts) {
    if (reduce) return function () {};
    opts = opts || {};
    var max = opts.max != null ? opts.max : 20;

    var els = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!els.length) return function () {};

    var rafId = null;

    function apply() {
      rafId = null;
      var vh = window.innerHeight;
      var center = vh / 2;

      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        var speed = parseFloat(el.getAttribute('data-parallax'));
        if (isNaN(speed)) speed = 0.2;
        var rect = el.getBoundingClientRect();
        var elCenter = rect.top + rect.height / 2;
        var delta = (elCenter - center) * speed;
        if (delta >  max) delta =  max;
        if (delta < -max) delta = -max;
        el.style.setProperty('--ab-parallax-y', delta.toFixed(2) + 'px');
      }
    }

    function schedule() {
      if (!rafId) rafId = window.requestAnimationFrame(apply);
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    apply();

    return function unbind() {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      els.forEach(function (el) { el.style.removeProperty('--ab-parallax-y'); });
    };
  }

  /* ================= Glow pulse toggle ================= */

  function glowPulse(el, on) {
    if (!el) return;
    var enable = on !== false;
    el.classList.toggle('ab-glow-pulse', enable);
  }

  /* ================= Scroll progress bar ================= */

  function scrollProgress() {
    var bar = document.querySelector('.ab-scroll-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'ab-scroll-progress';
      bar.setAttribute('aria-hidden', 'true');
      document.body.appendChild(bar);
    }

    var rafId = null;

    function update() {
      rafId = null;
      var h = document.documentElement;
      var total = h.scrollHeight - h.clientHeight;
      var pct = total > 0 ? (h.scrollTop || document.body.scrollTop) / total : 0;
      bar.style.width = (pct * 100).toFixed(2) + '%';
    }

    function schedule() {
      if (!rafId) rafId = window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();

    return function unbind() {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (bar.parentNode) bar.parentNode.removeChild(bar);
    };
  }

  /* ================= Header shrink ================= */

  function headerShrink(selector) {
    var target = document.querySelector(selector || '.ab-editor-header');
    if (!target) return function () {};

    var rafId = null;
    var threshold = 100;

    function update() {
      rafId = null;
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      if (y > threshold) target.setAttribute('data-ab-scrolled', 'true');
      else target.removeAttribute('data-ab-scrolled');
    }

    function schedule() {
      if (!rafId) rafId = window.requestAnimationFrame(update);
    }

    var scroller = window;
    scroller.addEventListener('scroll', schedule, { passive: true });
    /* Also observe any inner scrollable canvas */
    var canvas = document.querySelector('.ab-canvas');
    if (canvas) canvas.addEventListener('scroll', schedule, { passive: true });

    update();

    return function unbind() {
      window.removeEventListener('scroll', schedule);
      if (canvas) canvas.removeEventListener('scroll', schedule);
    };
  }

  /* ================= Jiggle (multi-select) ================= */

  function jiggle(elements, on) {
    var list = (typeof elements === 'string')
      ? document.querySelectorAll(elements)
      : (Array.isArray(elements) ? elements : [elements]);

    Array.prototype.forEach.call(list, function (el) {
      if (!el) return;
      el.classList.toggle('ab-jiggle', on !== false);
    });
  }

  /* ================= Snap guide helper ================= */

  var snapGuides = [];

  function showSnapGuide(orientation, position) {
    if (reduce) return;
    var g = document.createElement('div');
    g.className = 'ab-snap-guide ab-snap-guide--' + orientation;
    if (orientation === 'v') {
      g.style.left = position + 'px';
      g.style.top = '0';
      g.style.height = '100vh';
      g.style.width = '1px';
    } else {
      g.style.top = position + 'px';
      g.style.left = '0';
      g.style.width = '100vw';
      g.style.height = '1px';
    }
    document.body.appendChild(g);
    snapGuides.push(g);
    window.setTimeout(function () {
      if (g.parentNode) g.parentNode.removeChild(g);
      var i = snapGuides.indexOf(g);
      if (i >= 0) snapGuides.splice(i, 1);
    }, 900);
  }

  function clearSnapGuides() {
    while (snapGuides.length) {
      var g = snapGuides.pop();
      if (g.parentNode) g.parentNode.removeChild(g);
    }
  }

  /* ================= Auto-install defaults ================= */

  var TILT_SELECTORS = [
    '.ab-tpl-card',
    '.ab-el-item',
    '.ab-program-card',
    '.ab-feature',
    '.ab-card',
    '.ab-stat',
    '.ab-card-simple',
    '.ab-card-it',
    '.ab-card-img',
    '.ab-profile',
    '.ab-btn-primary',
    '.ab-hero-el__btn'
  ];

  var CLICK_SELECTORS = [
    '.ab-btn',
    '.ab-icon-btn',
    '.ab-header-btn',
    '.ab-page-tab',
    '.ab-sidebar-tab',
    '.ab-menu__item',
    '.ab-zoom-menu__item',
    '.ab-modal__close',
    '.ab-empty__icon',
    '.ab-tpl-card',
    '.ab-el-item',
    '.ab-program-card',
    '.ab-program-card__del',
    '.ab-zoom-wrap',
    '.ab-prop-program',
    '.ab-palette-cat__head',
    '.ab-el-cat__head'
  ];

  var SHIMMER_SELECTORS = [
    '.ab-tpl-card',
    '.ab-feature',
    '.ab-card',
    '.ab-empty__icon'
  ];

  function tagTiltTargets() {
    var els = document.querySelectorAll(TILT_SELECTORS.join(','));
    Array.prototype.forEach.call(els, function (el) {
      if (el.hasAttribute('data-ab-tilt')) return;
      /* Skip inside iframes / editor overlays where tilt would be distracting */
      if (el.closest('.ab-selection-overlay')) return;
      if (el.closest('.ab-canvas')) return;
      el.setAttribute('data-ab-tilt', '4');
    });
  }

  function tagShimmerTargets() {
    var els = document.querySelectorAll(SHIMMER_SELECTORS.join(','));
    Array.prototype.forEach.call(els, function (el) {
      if (!el.classList.contains('ab-shimmer-hover')) {
        el.classList.add('ab-shimmer-hover');
      }
    });
  }

  function tagMagneticTargets() {
    var els = document.querySelectorAll('.ab-fab, .ab-header-btn--accent, #btn-new');
    Array.prototype.forEach.call(els, function (el) {
      if (el.__abMagnetBound) return;
      el.__abMagnetBound = true;
      magnetic(el, { strength: 6, radius: 60 });
    });
  }

  /* Delegated click effect — works for dynamically created elements */
  var delegatedClickInstalled = false;

  function installDelegatedClick() {
    if (delegatedClickInstalled) return;
    delegatedClickInstalled = true;

    document.addEventListener('pointerup', function (e) {
      var el = e.target.closest && e.target.closest(CLICK_SELECTORS.join(','));
      if (!el) return;
      if (el.disabled) return;
      if (el.getAttribute('data-ab-no-effects') === '1') return;
      press(el);
    }, true);

    document.addEventListener('click', function (e) {
      var el = e.target.closest && e.target.closest(CLICK_SELECTORS.join(','));
      if (!el) return;
      if (el.disabled) return;
      if (el.getAttribute('data-ab-no-effects') === '1') return;
      ripple(e, el);
      iridescentSweep(el);
    }, true);
  }

  /* Delegated tilt — a single window pointermove drives whichever tilt target
     is currently under the cursor. */
  var currentTilt = null;
  var tiltRaf = null;
  var lastTiltPoint = null;
  var tiltDelegatedInstalled = false;

  function installDelegatedTilt() {
    if (tiltDelegatedInstalled) return;
    tiltDelegatedInstalled = true;

    function apply() {
      tiltRaf = null;
      if (!currentTilt || !lastTiltPoint) return;
      var el = currentTilt;
      var max = parseFloat(el.getAttribute('data-ab-tilt')) || 4;
      var rect = el.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dx = (lastTiltPoint.x - cx) / (rect.width / 2);
      var dy = (lastTiltPoint.y - cy) / (rect.height / 2);
      dx = Math.max(-1, Math.min(1, dx));
      dy = Math.max(-1, Math.min(1, dy));

      var ry = dx * max;
      var rx = -dy * max;

      el.style.transform =
        'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) ' +
        'rotateY(' + ry.toFixed(2) + 'deg)';

      var shineEl = el.querySelector(':scope > .ab-tilt-shine');
      if (shineEl) {
        var px = ((dx + 1) / 2) * 100;
        var py = ((dy + 1) / 2) * 100;
        shineEl.style.background =
          'radial-gradient(circle at ' + px + '% ' + py + '%, ' +
          'rgba(255,255,255,0.16), transparent 55%)';
      }
    }

    function reset(el) {
      if (!el) return;
      el.style.transform = '';
      var shineEl = el.querySelector(':scope > .ab-tilt-shine');
      if (shineEl) shineEl.style.background = 'transparent';
    }

    document.addEventListener('pointermove', function (e) {
      if (reduce) return;
      var target = e.target.closest && e.target.closest('[data-ab-tilt]');

      if (currentTilt && currentTilt !== target) {
        reset(currentTilt);
        currentTilt = null;
      }

      if (!target) return;

      currentTilt = target;
      lastTiltPoint = { x: e.clientX, y: e.clientY };

      if (!target.querySelector(':scope > .ab-tilt-shine')) {
        var shine = document.createElement('span');
        shine.className = 'ab-tilt-shine';
        shine.setAttribute('aria-hidden', 'true');
        target.appendChild(shine);
        target.classList.add('ab-tilt');
      }

      if (!tiltRaf) tiltRaf = window.requestAnimationFrame(apply);
    }, { passive: true });

    document.addEventListener('pointerleave', function (e) {
      if (!currentTilt) return;
      reset(currentTilt);
      currentTilt = null;
    }, true);
  }

  /* Watch for dynamically added nodes so tilt/shimmer tags stay current */
  function observeNewElements() {
    var pending = false;
    var observer = new MutationObserver(function (mutations) {
      var shouldRefresh = false;
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes.length) { shouldRefresh = true; break; }
      }
      if (!shouldRefresh) return;
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(function () {
        pending = false;
        tagTiltTargets();
        tagShimmerTargets();
        tagMagneticTargets();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function installDefaults() {
    installDelegatedClick();
    installDelegatedTilt();

    tagTiltTargets();
    tagShimmerTargets();
    tagMagneticTargets();

    /* Reveal + parallax are opt-in via markup; install once if requested. */
    reveal('.ab-reveal:not(.is-revealed)');
    parallax('[data-parallax]');

    scrollProgress();
    headerShrink('.ab-editor-header');

    observeNewElements();
  }

  /* ================= Exports ================= */

  var ab = {
    reduce: reduce,
    animate: animate,
    ripple: ripple,
    iridescentSweep: iridescentSweep,
    press: press,
    clickEffect: clickEffect,
    tilt: tilt,
    magnetic: magnetic,
    shimmer: shimmer,
    reveal: reveal,
    parallax: parallax,
    glowPulse: glowPulse,
    scrollProgress: scrollProgress,
    headerShrink: headerShrink,
    jiggle: jiggle,
    showSnapGuide: showSnapGuide,
    clearSnapGuides: clearSnapGuides,
    installDefaults: installDefaults
  };

  window.ab = ab;
  Abook.ab = ab;

  /* Auto-install once the DOM is interactive, unless opted out */
  function boot() {
    if (document.body && document.body.getAttribute('data-ab-no-auto') === '1') return;
    installDefaults();
    ensureHighlightStyles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();