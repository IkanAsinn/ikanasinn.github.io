/* ==========================================================================
   animations.js — IntersectionObserver-driven scroll reveals
   ========================================================================== */

(function () {
  'use strict';

  var revealSelectors = [
    '.reveal-up',
    '.reveal-line',
    '.reveal-mono',
    '.reveal-photo'
  ].join(',');

  var staggerGroups = [
    { selector: '.timeline-item', step: 0.08 },
    { selector: '.skill-category', step: 0.08 },
    { selector: '.stat-block', step: 0.1 }
  ];

  function applyStaggerDelays(root) {
    staggerGroups.forEach(function (group) {
      var items = root.querySelectorAll(group.selector);
      items.forEach(function (item, index) {
        item.style.setProperty('--reveal-delay', (index * group.step) + 's');
      });
    });
  }

  function initReveals() {
    applyStaggerDelays(document);

    var targets = document.querySelectorAll(revealSelectors);

    if (!('IntersectionObserver' in window) || targets.length === 0) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -8% 0px'
    });

    targets.forEach(function (el) { observer.observe(el); });
  }

  document.addEventListener('DOMContentLoaded', initReveals);
})();
