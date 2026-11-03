/* ==========================================================================
   modal.js — opens a project detail dialog from a card button.
   Content comes from window.PROJECTS (js/projects.js).

   Uses a native <dialog> with showModal(): the dialog is promoted to the
   browser's top layer, so it cannot be laid out in the document flow even if
   a stale stylesheet is served, and Escape, focus containment, and inertness
   of the page behind it come from the platform rather than from script.
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
    var thumbsEl = modal.querySelector('#project-modal-thumbs');
    var stageEl = modal.querySelector('.project-modal-stage');
    var scrollContainer = document.getElementById('scroll-container');

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

    document.querySelectorAll('[data-project-open]').forEach(function (btn) {
      btn.addEventListener('click', function () { open(btn.getAttribute('data-project-open')); });
    });

    closeBtn.addEventListener('click', close);
  });
})();
