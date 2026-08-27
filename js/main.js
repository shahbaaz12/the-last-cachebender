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
    if (themeColor) themeColor.setAttribute('content', dark ? '#061713' : '#F2EDDD');
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
    var masthead = document.querySelector('.masthead');
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

  /* ---------- sidebar scroll-spy ---------- */

  var links = Array.prototype.slice.call(
    document.querySelectorAll('#toc ul a')
  );
  var targets = links.map(function (a) {
    return document.getElementById(a.getAttribute('href').slice(1));
  });

  function setCurrent(target) {
    var best = targets.indexOf(target);
    if (best < 0) best = 0;
    links.forEach(function (a, i) {
      a.classList.toggle('here', i === best);
    });
  }

  if (links.length) {
    var initial = location.hash ? document.getElementById(location.hash.slice(1)) : targets[0];
    setCurrent(initial || targets[0]);

    if ('IntersectionObserver' in window) {
      var spyObserver = new IntersectionObserver(function (entries) {
        var visible = entries.filter(function (entry) { return entry.isIntersecting; });
        visible.sort(function (a, b) {
          return Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top);
        });
        if (visible.length) setCurrent(visible[0].target);
      }, { rootMargin: '-8% 0px -78% 0px', threshold: 0 });

      targets.forEach(function (target) {
        if (target) spyObserver.observe(target);
      });
    }
  }

  /* ---------- mobile nav closes on selection ---------- */

  document.querySelectorAll('.mobile-nav a').forEach(function (a) {
    a.addEventListener('click', function () {
      var panel = a.closest('details');
      if (panel) panel.removeAttribute('open');
    });
  });
})();
