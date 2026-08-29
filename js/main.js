/* The Last Cachebender site behaviour
   Reading progress, sidebar scroll-spy, theme toggle, back-to-top. */

(function () {
  'use strict';

  /* ---------- theme ----------
     Three states: "light", "dark", or absent (follow the OS).
     The stylesheet handles all three; this only stamps the root element. */

  var STORAGE_KEY = 'cachebender-theme';
  var root = document.documentElement;

  function storedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null; // private mode, blocked storage: fall back to OS
    }
  }

  function storeTheme(value) {
    try {
      if (value) {
        localStorage.setItem(STORAGE_KEY, value);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      /* nothing to do: the toggle still works for this page view */
    }
  }

  function applyTheme(value) {
    if (value === 'light' || value === 'dark') {
      root.setAttribute('data-theme', value);
    } else {
      root.removeAttribute('data-theme');
    }
  }

  function currentlyDark() {
    var stamped = root.getAttribute('data-theme');
    if (stamped) return stamped === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  applyTheme(storedTheme());

  var toggles = Array.prototype.slice.call(document.querySelectorAll('[data-theme-toggle]'));
  var themeColor = document.querySelector('meta[name="theme-color"]');

  function updateThemeControl() {
    var dark = currentlyDark();
    var nextLabel = dark ? 'Light' : 'Dark';

    toggles.forEach(function (toggle) {
      toggle.setAttribute('aria-pressed', String(dark));
      toggle.setAttribute('aria-label', 'Switch to ' + nextLabel.toLowerCase() + ' theme');
      toggle.setAttribute('title', 'Switch to ' + nextLabel.toLowerCase() + ' theme');
      var label = toggle.querySelector('[data-theme-label]');
      if (label) label.textContent = nextLabel;
    });
    if (themeColor) themeColor.setAttribute('content', dark ? '#0F1418' : '#EFF1F2');
  }

  toggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentlyDark() ? 'light' : 'dark';
      applyTheme(next);
      storeTheme(next);
      updateThemeControl();
    });
  });
  updateThemeControl();

  /* Reading progress is handled by a CSS scroll timeline. */
  var totop = document.getElementById('totop');

  if (totop) {
    var masthead = document.querySelector('.masthead, .book');
    if (masthead && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        totop.classList.toggle('show', !entries[0].isIntersecting);
      }, { threshold: 0 }).observe(masthead);
    }

    totop.addEventListener('click', function () {
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- course progress and resume ---------- */

  var PROGRESS_KEY = 'cachebender-progress';
  var COMPLETED_KEY = 'cachebender-completed';
  var lessonHead = document.querySelector('.lesson-head[id]');

  function readJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch (e) { return fallback; }
  }

  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { /* progress is optional */ }
  }

  if (lessonHead) {
    var lessonId = document.body.getAttribute('data-course-lesson') || lessonHead.id;
    var lessonNumber = parseInt(lessonId.slice(1), 10);
    var lessonTitle = (lessonHead.querySelector('h2') || {}).textContent || ('Lesson ' + lessonNumber);
    writeJson(PROGRESS_KEY, {
      id: lessonId,
      href: 'l' + lessonNumber + '.html#' + lessonId,
      title: lessonTitle
    });

    var lessonEnd = document.querySelector('[data-lesson-end="' + lessonId + '"]');
    if (lessonEnd && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries, observer) {
        if (!entries[0].isIntersecting) return;
        var complete = readJson(COMPLETED_KEY, []);
        if (complete.indexOf(lessonId) < 0) complete.push(lessonId);
        writeJson(COMPLETED_KEY, complete);
        if (lessonNumber < 14) {
          writeJson(PROGRESS_KEY, {
            id: 'l' + (lessonNumber + 1),
            href: 'l' + (lessonNumber + 1) + '.html#l' + (lessonNumber + 1),
            title: 'Lesson ' + (lessonNumber + 1)
          });
        }
        observer.disconnect();
      }, { threshold: 0.25 }).observe(lessonEnd);
    }
  }

  if (document.body.classList.contains('home-page')) {
    var saved = readJson(PROGRESS_KEY, null);
    var completed = readJson(COMPLETED_KEY, []);
    if (saved && saved.href) {
      var actions = document.querySelector('.hero-actions, .home-actions, .cta-row');
      if (actions) {
        var resume = document.createElement('a');
        resume.className = 'resume-course';
        resume.href = saved.href;
        resume.innerHTML = '<small>Continue your journey</small><strong>' + saved.title + ' →</strong>';
        actions.appendChild(resume);
      }
    }
    completed.forEach(function (id) {
      document.querySelectorAll('a[href$="#' + id + '"]').forEach(function (link) {
        link.classList.add('lesson-complete');
      });
    });
  }

  /* ---------- mobile nav closes on selection ---------- */

  document.querySelectorAll('.mobile-nav a').forEach(function (a) {
    a.addEventListener('click', function () {
      var panel = a.closest('details');
      if (panel) panel.removeAttribute('open');
    });
  });
})();
