/* ==========================================================================
   cursor.js — targeting reticle that trails the pointer and locks onto
   interactive elements. Fine pointers only; off with reduced motion.
   ========================================================================== */

(function () {
  'use strict';

  var mq = window.matchMedia;
  if (!mq || !mq('(hover: hover) and (pointer: fine)').matches) return;
  if (mq('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('DOMContentLoaded', function () {
    var reticle = document.createElement('div');
    reticle.className = 'reticle';
    reticle.setAttribute('aria-hidden', 'true');
    reticle.innerHTML =
      '<span class="reticle-ring"><span class="reticle-ring-inner"></span></span>' +
      '<span class="reticle-dot"><span class="reticle-readout"></span></span>';
    document.body.appendChild(reticle);
    document.documentElement.classList.add('has-reticle');

    var ring = reticle.querySelector('.reticle-ring');
    var dot = reticle.querySelector('.reticle-dot');
    var readout = reticle.querySelector('.reticle-readout');

    var TARGETS = 'a, button, [role="button"], .pill, .redact, .project-thumb';

    var mx = -100;
    var my = -100;
    var rx = mx;
    var ry = my;
    var running = false;
    var locked = false;

    function pad4(n) {
      n = Math.max(0, Math.round(n));
      return ('000' + n).slice(-4);
    }

    function loop() {
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      if (Math.abs(mx - rx) > 0.1 || Math.abs(my - ry) > 0.1) {
        requestAnimationFrame(loop);
      } else {
        running = false;
      }
    }

    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      if (!locked) readout.textContent = 'X' + pad4(mx) + ' Y' + pad4(my);
      reticle.classList.add('is-on');
      if (!running) {
        running = true;
        requestAnimationFrame(loop);
      }
    }, { passive: true });

    document.addEventListener('pointerover', function (e) {
      var target = e.target.closest ? e.target.closest(TARGETS) : null;
      locked = !!target;
      reticle.classList.toggle('is-locked', locked);
      if (locked) readout.textContent = 'Lock';
    });

    document.addEventListener('pointerdown', function () { reticle.classList.add('is-pressed'); });
    document.addEventListener('pointerup', function () { reticle.classList.remove('is-pressed'); });

    document.documentElement.addEventListener('pointerleave', function () {
      reticle.classList.remove('is-on');
    });

    window.addEventListener('blur', function () {
      reticle.classList.remove('is-on');
    });
  });
})();
