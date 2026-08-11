/* ==========================================================================
   main.js — nav active state, scroll-to links, mobile menu toggle
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('scroll-container');
    var sections = Array.prototype.slice.call(document.querySelectorAll('.section'));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-list a'));
    var navToggle = document.querySelector('.nav-toggle');
    var navList = document.querySelector('.nav-list');
    var siteNav = document.querySelector('.site-nav');
    var navOverlay = document.querySelector('.nav-overlay');

    // --- Active nav link tracking via IntersectionObserver ---
    if ('IntersectionObserver' in window) {
      var navObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('data-section');
            navLinks.forEach(function (link) {
              link.classList.toggle('is-active', link.getAttribute('data-nav') === id);
            });
          }
        });
      }, { threshold: 0.6 });

      sections.forEach(function (s) { navObserver.observe(s); });
    }

    // --- Smooth scroll for nav + CTA links ---
    function scrollToSection(id) {
      var target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }

    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        scrollToSection(link.getAttribute('data-nav'));
        closeMobileNav();
      });
    });

    document.querySelectorAll('[data-scroll-to]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        scrollToSection(el.getAttribute('data-scroll-to'));
      });
    });

    // --- Mobile menu toggle ---
    function closeMobileNav() {
      navList.classList.remove('is-open');
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      if (navOverlay) {
        navOverlay.classList.remove('is-open');
      }
    }

    if (navToggle) {
      navToggle.addEventListener('click', function () {
        var isOpen = navList.classList.toggle('is-open');
        siteNav.classList.toggle('is-open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        if (navOverlay) {
          navOverlay.classList.toggle('is-open', isOpen);
        }
      });
    }

    // Close menu when clicking overlay
    if (navOverlay) {
      navOverlay.addEventListener('click', closeMobileNav);
    }
  });
})();
