/* ==========================================================================
   modal.js — opens a project detail dialog from a card button.
   Content comes from window.PROJECTS (js/projects.js).
   ========================================================================== */

(function () {
  'use strict';

  var FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

  document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById('project-modal');
    var projects = window.PROJECTS || {};
    if (!modal || !Object.keys(projects).length) return;

    var panel = modal.querySelector('.project-modal-panel');
    var tagEl = modal.querySelector('#project-modal-tag');
    var titleEl = modal.querySelector('#project-modal-title');
    var summaryEl = modal.querySelector('#project-modal-summary');
    var featuresEl = modal.querySelector('#project-modal-features');
    var stackEl = modal.querySelector('#project-modal-stack');
    var linksEl = modal.querySelector('#project-modal-links');
    var imageEl = modal.querySelector('#project-modal-image');
    var captionEl = modal.querySelector('#project-modal-caption');
    var thumbsEl = modal.querySelector('#project-modal-thumbs');
    var scrollContainer = document.getElementById('scroll-container');

    var stageEl = modal.querySelector('.project-modal-stage');

    var lastFocused = null;

    function setShot(shot, thumb) {
      imageEl.src = shot.src;
      imageEl.alt = shot.alt;
      captionEl.textContent = shot.caption;
      stageEl.classList.toggle('is-portrait', !!shot.portrait);
      Array.prototype.forEach.call(thumbsEl.children, function (node) {
        node.classList.toggle('is-active', node === thumb);
        node.setAttribute('aria-pressed', node === thumb ? 'true' : 'false');
      });
    }

    function renderShots(project) {
      thumbsEl.innerHTML = '';
      project.shots.forEach(function (shot, i) {
        var thumb = document.createElement('button');
        thumb.type = 'button';
        thumb.className = 'project-modal-thumb';
        thumb.setAttribute('aria-label', 'Screenshot ' + (i + 1) + ': ' + shot.caption);
        var img = document.createElement('img');
        img.src = shot.src;
        img.alt = '';
        img.loading = 'lazy';
        thumb.appendChild(img);
        thumb.addEventListener('click', function () { setShot(shot, thumb); });
        thumbsEl.appendChild(thumb);
      });
      setShot(project.shots[0], thumbsEl.firstElementChild);
    }

    function renderLinks(project) {
      linksEl.innerHTML = '';
      (project.links || []).forEach(function (link, i) {
        if (i > 0) linksEl.appendChild(document.createTextNode(' · '));
        var a = document.createElement('a');
        a.href = link.href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = link.label;
        linksEl.appendChild(a);
      });
    }

    function open(id) {
      var project = projects[id];
      if (!project) return;

      tagEl.textContent = project.tag;
      titleEl.textContent = project.title;
      summaryEl.textContent = project.summary;
      stackEl.textContent = project.stack;

      featuresEl.innerHTML = '';
      project.features.forEach(function (feature) {
        var li = document.createElement('li');
        li.textContent = feature;
        featuresEl.appendChild(li);
      });

      renderLinks(project);
      renderShots(project);

      lastFocused = document.activeElement;
      modal.hidden = false;
      requestAnimationFrame(function () { modal.classList.add('is-open'); });
      // Lock the scroll-snap container and the page behind the dialog.
      if (scrollContainer) scrollContainer.style.overflow = 'hidden';
      document.body.classList.add('is-modal-open');
      panel.scrollTop = 0;
      modal.querySelector('.project-modal-close').focus();
    }

    function close() {
      modal.classList.remove('is-open');
      if (scrollContainer) scrollContainer.style.overflow = '';
      document.body.classList.remove('is-modal-open');

      // Hide once the fade finishes. transitionend alone is not enough: a
      // background tab can defer the transition, leaving an invisible
      // overlay swallowing clicks, so a timer guarantees the teardown.
      var done = false;
      var finish = function () {
        if (done) return;
        done = true;
        modal.hidden = true;
        modal.removeEventListener('transitionend', finish);
      };
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
      else {
        modal.addEventListener('transitionend', finish);
        window.setTimeout(finish, 400);
      }
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    // --- Open buttons on the project cards ---
    document.querySelectorAll('[data-project-open]').forEach(function (btn) {
      btn.addEventListener('click', function () { open(btn.getAttribute('data-project-open')); });
    });

    // --- Close: backdrop, close button, Escape ---
    modal.querySelectorAll('[data-project-close]').forEach(function (el) {
      el.addEventListener('click', close);
    });

    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;

      // Keep focus inside the dialog while it is open.
      var nodes = Array.prototype.filter.call(
        panel.querySelectorAll(FOCUSABLE),
        function (node) { return node.offsetParent !== null; }
      );
      if (!nodes.length) return;
      var first = nodes[0];
      var last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  });
})();
