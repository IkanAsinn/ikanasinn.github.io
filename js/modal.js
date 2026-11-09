/* ==========================================================================
   modal.js — opens a project detail dialog from a card button.
   Content comes from window.PROJECTS (js/projects.js).

   Uses a native <dialog> with showModal(): the dialog is promoted to the
   browser's top layer, so it cannot be laid out in the document flow even if
   a stale stylesheet is served, and Escape, focus containment, and inertness
   of the page behind it come from the platform rather than from script.

   Inside, only the copy column scrolls. The gallery is a fixed carousel with
   arrows, dots, and arrow-key support, so text and image never drift apart.
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById('project-modal');
    var projects = window.PROJECTS || {};
    if (!modal || !Object.keys(projects).length || typeof modal.showModal !== 'function') return;

    var panel = modal.querySelector('.project-modal-panel');
    var closeBtn = modal.querySelector('.project-modal-close');
    var tagEl = modal.querySelector('#project-modal-tag');
    var titleEl = modal.querySelector('#project-modal-title');
    var summaryEl = modal.querySelector('#project-modal-summary');
    var featuresEl = modal.querySelector('#project-modal-features');
    var stackEl = modal.querySelector('#project-modal-stack');
    var linksEl = modal.querySelector('#project-modal-links');
    var imageEl = modal.querySelector('#project-modal-image');
    var captionEl = modal.querySelector('#project-modal-caption');
    var counterEl = modal.querySelector('#project-modal-counter');
    var dotsEl = modal.querySelector('#project-modal-dots');
    var stageEl = modal.querySelector('.project-modal-stage');
    var copyEl = modal.querySelector('.project-modal-copy');
    var scrollContainer = document.getElementById('scroll-container');

    var lastFocused = null;
    var shots = [];
    var index = 0;
    var preloaded = [];

    function pad(n) {
      return (n < 10 ? '0' : '') + n;
    }

    /**
     * Fetch every slide up front. The stage img only starts downloading when
     * its src is assigned, so without this each Next press waited on the
     * network before it could paint.
     */
    function preloadAll(project) {
      preloaded = project.shots.map(function (shot) {
        var img = new Image();
        img.decoding = 'async';
        img.src = shot.src;
        return img;
      });
    }

    /** Slide the new frame in from the side it came from. */
    function animateStep(direction) {
      imageEl.classList.remove('is-step-next', 'is-step-prev');
      // Force a style flush so the animation restarts on rapid presses.
      void imageEl.offsetWidth;
      imageEl.classList.add(direction > 0 ? 'is-step-next' : 'is-step-prev');
    }

    function show(i, direction) {
      if (!shots.length) return;
      // Wrap, so holding an arrow key cycles rather than dead-ends.
      index = (i + shots.length) % shots.length;
      var shot = shots[index];
      imageEl.src = shot.src;
      imageEl.alt = shot.alt;
      captionEl.textContent = shot.caption;
      counterEl.textContent = pad(index + 1) + ' / ' + pad(shots.length);
      stageEl.classList.toggle('is-portrait', !!shot.portrait);
      stageEl.classList.toggle('is-wide', !!shot.wide);
      Array.prototype.forEach.call(dotsEl.children, function (dot, di) {
        dot.classList.toggle('is-active', di === index);
        dot.setAttribute('aria-current', di === index ? 'true' : 'false');
      });
      if (direction) animateStep(direction);
    }

    function renderGallery(project) {
      shots = project.shots;
      dotsEl.innerHTML = '';

      // One dot per screenshot; a single shot needs no navigation at all.
      if (shots.length > 1) {
        shots.forEach(function (shot, i) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'project-modal-dot';
          dot.setAttribute('aria-label', 'Screenshot ' + (i + 1) + ': ' + shot.caption);
          dot.addEventListener('click', function () {
            if (i === index) return;
            show(i, i > index ? 1 : -1);
          });
          dotsEl.appendChild(dot);
        });
        dotsEl.hidden = false;
      } else {
        dotsEl.hidden = true;
      }

      modal.querySelectorAll('[data-shot-prev], [data-shot-next]').forEach(function (btn) {
        btn.hidden = shots.length < 2;
      });

      show(0);
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
      preloadAll(project);
      renderGallery(project);

      lastFocused = document.activeElement;
      copyEl.scrollTop = 0;
      panel.scrollTop = 0;
      document.body.classList.add('is-modal-open');
      // The scroll-snap container keeps scrolling behind a top-layer dialog.
      if (scrollContainer) scrollContainer.style.overflow = 'hidden';
      modal.showModal();
      closeBtn.focus();
    }

    function close() {
      if (modal.open) modal.close();
    }

    // Fires for every closing path: the button, Escape, and a backdrop click.
    modal.addEventListener('close', function () {
      document.body.classList.remove('is-modal-open');
      if (scrollContainer) scrollContainer.style.overflow = '';
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    });

    // A click that lands on the dialog itself is a click on the backdrop; the
    // panel stops it by being a descendant.
    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });

    modal.querySelector('[data-shot-prev]').addEventListener('click', function () { show(index - 1, -1); });
    modal.querySelector('[data-shot-next]').addEventListener('click', function () { show(index + 1, 1); });

    // Arrow keys drive the carousel. Nothing in the copy column is focusable,
    // so there is no scroll-versus-slide ambiguity to resolve.
    modal.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (shots.length < 2) return;
      e.preventDefault();
      show(index + (e.key === 'ArrowRight' ? 1 : -1), e.key === 'ArrowRight' ? 1 : -1);
    });

    document.querySelectorAll('[data-project-open]').forEach(function (btn) {
      btn.addEventListener('click', function () { open(btn.getAttribute('data-project-open')); });
    });

    closeBtn.addEventListener('click', close);
  });
})();
