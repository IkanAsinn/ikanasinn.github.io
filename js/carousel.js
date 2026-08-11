/* ==========================================================================
   carousel.js — horizontal, user-driven project carousel
   ========================================================================== */

(function () {
  'use strict';

  function initCarousel(root) {
    var track = root.querySelector('[data-carousel-track]');
    var items = Array.prototype.slice.call(root.querySelectorAll('[data-carousel-item]'));
    var prevBtn = root.querySelector('[data-carousel-prev]');
    var nextBtn = root.querySelector('[data-carousel-next]');
    var dotsWrap = root.querySelector('[data-carousel-dots]');

    if (!track || items.length === 0) return;

    var index = 0;
    var dots = [];

    items.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to project ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    function render() {
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
      // No disabled state - infinite loop
      prevBtn.disabled = false;
      nextBtn.disabled = false;
    }

    function goTo(i) {
      // Wrap around for infinite loop
      if (i < 0) {
        index = items.length - 1;
      } else if (i >= items.length) {
        index = 0;
      } else {
        index = i;
      }
      render();
    }

    prevBtn.addEventListener('click', function () { goTo(index - 1); });
    nextBtn.addEventListener('click', function () { goTo(index + 1); });

    // Keyboard support when carousel section is focused/active
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') goTo(index - 1);
      if (e.key === 'ArrowRight') goTo(index + 1);
    });

    // Touch swipe support
    var touchStartX = null;

    track.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var deltaX = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > 40) {
        if (deltaX < 0) goTo(index + 1);
        else goTo(index - 1);
      }
      touchStartX = null;
    }, { passive: true });

    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var carousels = document.querySelectorAll('[data-carousel]');
    carousels.forEach(initCarousel);
  });
})();
