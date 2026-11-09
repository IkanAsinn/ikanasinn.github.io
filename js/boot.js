/* ==========================================================================
   boot.js — "secure terminal" intro. Plays on every load, skippable with
   any key, click or tap. Fires `boot:done` on document when the shutters
   start to part, so the hero choreography plays as the page is revealed.
   ========================================================================== */

(function () {
  'use strict';

  var root = document.documentElement;
  window.BOOT_PENDING = root.classList.contains('is-booting');

  function done() {
    window.BOOT_PENDING = false;
    document.dispatchEvent(new CustomEvent('boot:done'));
  }

  if (!window.BOOT_PENDING) return;

  var boot = document.getElementById('boot');
  var list = document.getElementById('boot-lines');
  if (!boot || !list) {
    root.classList.remove('is-booting');
    done();
    return;
  }

  var steps = [
    { text: 'Establishing secure channel', status: 'OK' },
    { text: 'Verifying clearance', status: 'OK' },
    { text: 'Decrypting file BH-0425', status: '%' }
  ];

  var timers = [];
  var finished = false;

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  function addLine(step) {
    var li = document.createElement('li');
    li.className = 'boot-line';
    li.innerHTML =
      '<span class="boot-line-text"></span>' +
      '<span class="boot-line-dots"></span>' +
      '<span class="boot-line-status"></span>';
    li.querySelector('.boot-line-text').textContent = step.text;
    list.appendChild(li);
    return li.querySelector('.boot-line-status');
  }

  function countUp(el, duration) {
    var start = performance.now();
    (function tick(now) {
      if (finished) return;
      var t = Math.min(1, (now - start) / duration);
      el.textContent = Math.round(t * 100) + '%';
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }

  function open() {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);

    boot.classList.add('is-opening');
    // Let the seam flash before the page starts animating behind the shutters.
    setTimeout(done, 250);
    setTimeout(function () {
      root.classList.remove('is-booting');
      boot.remove();
    }, 1300);

    window.removeEventListener('keydown', open);
    boot.removeEventListener('pointerdown', open);
  }

  // Timeline
  later(function () { addLine(steps[0]); }, 120);
  later(function () { list.lastChild.querySelector('.boot-line-status').textContent = 'OK'; }, 420);
  later(function () { addLine(steps[1]); }, 520);
  later(function () { list.lastChild.querySelector('.boot-line-status').textContent = 'OK'; }, 820);
  later(function () { countUp(addLine(steps[2]), 650); }, 920);
  later(function () { boot.classList.add('is-granted'); }, 1650);
  later(open, 2450);

  window.addEventListener('keydown', open);
  boot.addEventListener('pointerdown', open);
})();
