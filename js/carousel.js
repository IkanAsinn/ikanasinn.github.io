/* ==========================================================================
   carousel.js — horizontal, user-driven case-file carousel
   ========================================================================== */

(function () {
  'use strict';

  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function initCarousel(root) {
    var track = root.querySelector('[data-carousel-track]');
    var items = Array.prototype.slice.call(root.querySelectorAll('[data-carousel-item]'));
    var prevBtn = root.querySelector('[data-carousel-prev]');
    var nextBtn = root.querySelector('[data-carousel-next]');
    var dotsWrap = root.querySelector('[data-carousel-dots]');
    var countEl = root.querySelector('[data-carousel-count]');
    var progressEl = root.querySelector('[data-carousel-progress]');

    if (!track || items.length === 0) return;

    var index = 0;
    var dots = [];

    items.forEach(function (_, i) {
      if (!dotsWrap) return;
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to project ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    function render() {
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      items.forEach(function (item, i) {
        var current = i === index;
        item.classList.toggle('is-current', current);
        item.setAttribute('aria-hidden', current ? 'false' : 'true');
        // Off-screen cards must not take focus.
        item.inert = !current;
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
      if (countEl) countEl.textContent = pad(index + 1) + ' / ' + pad(items.length);
      if (progressEl) root.style.setProperty('--carousel-progress', (index + 1) / items.length);
    }

    function goTo(i) {
      // Wrap around for an infinite loop.
      if (i < 0) index = items.length - 1;
      else if (i >= items.length) index = 0;
      else index = i;
      render();
    }

    prevBtn.addEventListener('click', function () { goTo(index - 1); });
    nextBtn.addEventListener('click', function () { goTo(index + 1); });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') goTo(index - 1);
      if (e.key === 'ArrowRight') goTo(index + 1);
    });

    // Touch swipe support
    var touchStartX = null;
    var touchStartY = null;

    track.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var deltaX = e.changedTouches[0].clientX - touchStartX;
      var deltaY = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) goTo(index + 1);
        else goTo(index - 1);
      }
      touchStartX = null;
    }, { passive: true });

    render();
    // Enable the wipe transitions only after the first paint, so the first
    // case does not animate in from blank before the section is reached.
    requestAnimationFrame(function () { root.classList.add('is-ready'); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-carousel]').forEach(initCarousel);
  });
})();
