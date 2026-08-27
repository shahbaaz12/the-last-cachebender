/* The Last Cachebender — site behaviour
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
      return null; // private mode, blocked storage — fall back to OS
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
      /* nothing to do — the toggle still works for this page view */
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
    if (themeColor) themeColor.setAttribute('content', dark ? '#091310' : '#F3EFE3');
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

  /* ---------- reading progress ---------- */

  var bar = document.getElementById('progress');
  var totop = document.getElementById('totop');
  var ticking = false;

  function onScroll() {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var y = window.scrollY;

    if (bar) {
      bar.style.width = (scrollable > 0 ? (y / scrollable) * 100 : 0) + '%';
    }
    if (totop) {
      totop.classList.toggle('show', y > 900);
    }
    ticking = false;
  }

  /* Only listen when there is something on the page to update.
     The home page has neither, so it attaches no scroll work at all. */
  if (bar || totop) {
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
    onScroll();
  }

  if (totop) {
    totop.addEventListener('click', function () {
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- sidebar scroll-spy ---------- */

  var links = Array.prototype.slice.call(
    document.querySelectorAll('#toc ul a')
  );
  var targets = links.map(function (a) {
    return document.getElementById(a.getAttribute('href').slice(1));
  });

  var spying = false;

  function spy() {
    var best = 0;
    for (var i = 0; i < targets.length; i++) {
      if (targets[i] && targets[i].getBoundingClientRect().top <= 120) {
        best = i;
      }
    }
    links.forEach(function (a, i) {
      a.classList.toggle('here', i === best);
    });
    spying = false;
  }

  if (links.length) {
    window.addEventListener('scroll', function () {
      if (!spying) {
        window.requestAnimationFrame(spy);
        spying = true;
      }
    }, { passive: true });
    spy();
  }

  /* ---------- mobile nav closes on selection ---------- */

  document.querySelectorAll('.mobile-nav a').forEach(function (a) {
    a.addEventListener('click', function () {
      var panel = a.closest('details');
      if (panel) panel.removeAttribute('open');
    });
  });
})();
