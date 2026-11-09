/* ==========================================================================
   animations.js — scroll reveals, text decryption, counters, redactions,
   and the variable-font "lens" on the hero name.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var revealSelectors = '.reveal-up, .reveal-line, .reveal-mono, .reveal-photo';

  var staggerGroups = [
    { selector: '.timeline-item', step: 0.08 },
    { selector: '.skill-category', step: 0.08 }
  ];

  /* ------------------------------------------------------------------------
     Decrypt: text cycles through random glyphs and resolves left to right.
     Works on text nodes, so inline markup (<em>, spans) survives. Screen
     readers get the real text from a visually hidden copy.
     ------------------------------------------------------------------------ */
  var UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var LOWER = 'abcdefghijklmnopqrstuvwxyz';
  var DIGIT = '0123456789';
  var SYMBOL = '#%&/<>*+=?';

  function randomFor(ch) {
    var pool;
    if (UPPER.indexOf(ch) > -1) pool = UPPER + SYMBOL;
    else if (LOWER.indexOf(ch) > -1) pool = LOWER;
    else if (DIGIT.indexOf(ch) > -1) pool = DIGIT;
    else return ch;
    return pool.charAt(Math.floor(Math.random() * pool.length));
  }

  function textNodesOf(el) {
    var nodes = [];
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  function prepareDecrypt(el) {
    if (el.__decrypt) return el.__decrypt;
    var label = el.textContent.replace(/\s+/g, ' ').trim();
    // An invisible copy of the real text holds the layout; the scramble runs
    // in a copy laid over it. Random glyphs are wider or narrower than the
    // real ones, and scrambling in flow re-wrapped lines and resized the page.
    var visual = document.createElement('span');
    visual.className = 'decrypt';
    visual.setAttribute('aria-hidden', 'true');
    var live = document.createElement('span');
    live.className = 'decrypt-live';
    while (el.firstChild) live.appendChild(el.firstChild);
    var ghost = live.cloneNode(true);
    ghost.className = 'decrypt-ghost';
    visual.appendChild(ghost);
    visual.appendChild(live);
    var sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = label;
    el.appendChild(sr);
    el.appendChild(visual);

    var nodes = textNodesOf(live);
    el.__decrypt = {
      nodes: nodes,
      originals: nodes.map(function (n) { return n.data; })
    };
    return el.__decrypt;
  }

  function decrypt(el, duration) {
    var state = prepareDecrypt(el);
    if (reduceMotion) return;
    if (state.running) cancelAnimationFrame(state.running);

    duration = duration || 1000;
    var total = state.originals.join('').length || 1;
    var offset = 0;
    var schedule = state.originals.map(function (text) {
      var times = [];
      for (var i = 0; i < text.length; i++) {
        times.push(((offset + i) / total) * duration * 0.65 + Math.random() * duration * 0.35);
      }
      offset += text.length;
      return times;
    });

    var start = null;
    var lastSwap = 0;

    function frame(now) {
      if (start === null) start = now;
      var elapsed = now - start;
      // Re-roll glyphs about 30 times a second, not every frame.
      if (now - lastSwap < 33 && elapsed < duration) {
        state.running = requestAnimationFrame(frame);
        return;
      }
      lastSwap = now;
      var finished = true;

      state.nodes.forEach(function (node, ni) {
        var original = state.originals[ni];
        var times = schedule[ni];
        var out = '';
        for (var i = 0; i < original.length; i++) {
          var ch = original.charAt(i);
          if (elapsed >= times[i] || ch === ' ' || ch === '\n') {
            out += ch;
          } else {
            out += randomFor(ch);
            finished = false;
          }
        }
        node.data = out;
      });

      if (!finished && elapsed < duration + 50) {
        state.running = requestAnimationFrame(frame);
      } else {
        state.nodes.forEach(function (node, ni) { node.data = state.originals[ni]; });
        state.running = null;
      }
    }

    state.running = requestAnimationFrame(frame);
  }

  window.decryptText = decrypt;

  /* ------------------------------------------------------------------------
     Counters
     ------------------------------------------------------------------------ */
  function prepareCounter(el) {
    el.__countTo = parseFloat(el.getAttribute('data-count-to')) || 0;
    el.__decimals = parseInt(el.getAttribute('data-count-decimals') || '0', 10);
    if (!reduceMotion) el.textContent = (0).toFixed(el.__decimals);
  }

  function runCounter(el, delay) {
    if (reduceMotion || el.__counted) return;
    el.__counted = true;
    var to = el.__countTo;
    var decimals = el.__decimals;
    var duration = 1400;
    setTimeout(function () {
      var start = performance.now();
      (function tick(now) {
        var t = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - t, 4);
        // Jitter while counting, like a reading settling down.
        var value = to * eased + (t < 1 ? (Math.random() - 0.5) * to * 0.04 * (1 - t) : 0);
        el.textContent = Math.max(0, value).toFixed(decimals);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = to.toFixed(decimals);
      })(start);
    }, delay || 0);
  }

  /* ------------------------------------------------------------------------
     Variable-font lens on the hero name: letters near the pointer grow
     heavier and wider.
     ------------------------------------------------------------------------ */
  function initLens() {
    var words = document.querySelectorAll('[data-lens]');
    if (!words.length || reduceMotion || !finePointer) return;

    var chars = [];
    words.forEach(function (word) {
      var text = word.textContent;
      word.textContent = '';
      for (var i = 0; i < text.length; i++) {
        var span = document.createElement('span');
        span.className = 'lens-char';
        span.textContent = text.charAt(i);
        word.appendChild(span);
        chars.push(span);
      }
    });

    var title = document.querySelector('.home-title');
    var radius = 220;
    var pending = false;
    var px = 0;
    var py = 0;

    function apply() {
      pending = false;
      chars.forEach(function (c) {
        var r = c.getBoundingClientRect();
        var dx = px - (r.left + r.width / 2);
        var dy = py - (r.top + r.height / 2);
        var f = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / radius);
        f = f * f * (3 - 2 * f);
        var wght = 850 + f * 50;
        var wdth = 72 + f * 28;
        c.style.fontVariationSettings = '"wght" ' + wght.toFixed(0) + ', "wdth" ' + wdth.toFixed(1);
      });
    }

    var home = document.getElementById('home');
    home.addEventListener('pointermove', function (e) {
      px = e.clientX;
      py = e.clientY;
      if (!pending) {
        pending = true;
        requestAnimationFrame(apply);
      }
    });

    home.addEventListener('pointerleave', function () {
      chars.forEach(function (c) { c.style.fontVariationSettings = ''; });
    });

    if (title) title.classList.add('has-lens');
  }

  /* ------------------------------------------------------------------------
     Reveal wiring
     ------------------------------------------------------------------------ */
  function applyStaggerDelays() {
    staggerGroups.forEach(function (group) {
      document.querySelectorAll(group.selector).forEach(function (item, index) {
        item.style.setProperty('--reveal-delay', (index * group.step) + 's');
      });
    });

    document.querySelectorAll('.pill-list').forEach(function (list) {
      Array.prototype.forEach.call(list.children, function (pill, i) {
        pill.style.setProperty('--i', i);
      });
    });

    document.querySelectorAll('.about-copy p').forEach(function (p) {
      p.querySelectorAll('.redact').forEach(function (mark, i) {
        mark.style.setProperty('--redact-delay', (0.55 + i * 0.3) + 's');
      });
    });
  }

  function onVisible(el) {
    if (el.hasAttribute('data-decrypt')) {
      var isTitle = el.classList.contains('section-title');
      setTimeout(function () { decrypt(el, isTitle ? 1100 : 700); }, isTitle ? 120 : 0);
    }

    el.querySelectorAll('[data-count-to]').forEach(function (counter, i) {
      runCounter(counter, el.classList.contains('reveal-photo') ? 900 : 350 + i * 120);
    });
  }

  function initReveals() {
    var targets = document.querySelectorAll(revealSelectors);

    if (!('IntersectionObserver' in window) || targets.length === 0) {
      targets.forEach(function (el) { el.classList.add('is-visible'); onVisible(el); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        onVisible(entry.target);
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -6% 0px'
    });

    targets.forEach(function (el) { observer.observe(el); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyStaggerDelays();
    document.querySelectorAll('[data-decrypt]').forEach(prepareDecrypt);
    document.querySelectorAll('[data-count-to]').forEach(prepareCounter);
    initLens();

    if (window.BOOT_PENDING) {
      var started = false;
      var start = function () {
        if (started) return;
        started = true;
        initReveals();
      };
      document.addEventListener('boot:done', start);
      setTimeout(start, 7000); // failsafe if the boot script never finishes
    } else {
      initReveals();
    }
  });
})();
