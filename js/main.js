/* ==========================================================================
   main.js — nav active state, scroll-to links, mobile menu, HUD readouts
   ========================================================================== */

(function () {
  'use strict';

  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var sections = Array.prototype.slice.call(document.querySelectorAll('.section'));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-list a'));
    var navToggle = document.querySelector('.nav-toggle');
    var navList = document.querySelector('.nav-list');
    var siteNav = document.querySelector('.site-nav');
    var navOverlay = document.querySelector('.nav-overlay');
    var hudIndex = document.querySelector('[data-hud-index]');
    var hudLabel = document.querySelector('[data-hud-label]');
    var hudClock = document.querySelector('[data-hud-clock]');
    var hud = document.querySelector('.hud');
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var currentId = 'home';

    // --- Active section: nav highlight + HUD index ---
    function setActive(id) {
      if (id === currentId) return;
      currentId = id;
      navLinks.forEach(function (link) {
        var active = link.getAttribute('data-nav') === id;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });

      var i = sections.findIndex(function (s) { return s.getAttribute('data-section') === id; });
      if (i < 0) return;
      if (hudIndex) hudIndex.textContent = pad(i + 1);
      if (hudLabel) {
        hudLabel.textContent = sections[i].getAttribute('data-label') || id;
        if (window.decryptText && !reduceMotion) {
          hudLabel.__decrypt = null;
          window.decryptText(hudLabel, 500);
        }
      }
      if (hud) hud.style.setProperty('--hud-progress', (i + 1) / sections.length);
    }

    if ('IntersectionObserver' in window) {
      var navObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.getAttribute('data-section'));
        });
      // A section is current while it covers the middle line of the screen,
      // which works for pages taller than the viewport too.
      }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

      sections.forEach(function (s) { navObserver.observe(s); });
    }

    // --- Smooth scroll for nav + CTA links ---
    function scrollToSection(id) {
      var target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }

    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        scrollToSection(link.getAttribute('data-nav'));
        closeMobileNav();
      });

      // Scramble the label on hover, like a terminal re-reading it.
      var text = link.querySelector('.nav-text');
      if (text && !reduceMotion) {
        link.addEventListener('mouseenter', function () {
          if (window.decryptText) window.decryptText(text, 420);
        });
      }
    });

    document.querySelectorAll('[data-scroll-to]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        scrollToSection(el.getAttribute('data-scroll-to'));
      });
    });

    // --- HUD clock ---
    if (hudClock) {
      var tick = function () {
        var d = new Date();
        hudClock.textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
      };
      tick();
      setInterval(tick, 1000);
    }

    // --- Mobile menu toggle ---
    function closeMobileNav() {
      navList.classList.remove('is-open');
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      if (navOverlay) navOverlay.classList.remove('is-open');
    }

    if (navToggle) {
      navToggle.addEventListener('click', function () {
        var isOpen = navList.classList.toggle('is-open');
        siteNav.classList.toggle('is-open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        if (navOverlay) navOverlay.classList.toggle('is-open', isOpen);
      });
    }

    if (navOverlay) navOverlay.addEventListener('click', closeMobileNav);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navList.classList.contains('is-open')) {
        closeMobileNav();
        navToggle.focus();
      }
    });
  });
})();
