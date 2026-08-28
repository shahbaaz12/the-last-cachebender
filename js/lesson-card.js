/* Lesson cards.

   Every lesson gets an overview card under its technique badge: what is in the
   lesson, what the reader will be able to do, and how it connects to the rest
   of the course.

   Once that card scrolls out of view the contents list reappears as a sticky
   rail on the right, tracking the section being read. The rail is hidden when
   the viewport is too narrow to hold it beside the text.

   Section titles are read from the DOM, so this stays correct as prose changes.
   Only the objectives and the lesson-to-lesson links are authored here. */

(function () {
  'use strict';

  var WORDS_PER_MINUTE = 220;
  var RAIL_MIN_WIDTH = 1440; // keep in step with the media query in styles.css

  var PAGES = {
    l1: 'course.html', l2: 'course.html',
    l3: 'book-air.html',
    l4: 'book-water.html',
    l5: 'book-earth.html', l6: 'book-earth.html',
    l7: 'book-fire.html',
    l8: 'book-spirit.html', l9: 'book-spirit.html',
    l10: 'book-spirit.html', l11: 'book-spirit.html',
    l12: 'book-war.html', l13: 'book-war.html', l14: 'book-war.html'
  };

  /* does  — what the reader can do afterwards
     from  — the lesson this one leans on
     feeds — how many of Lesson 12's five defenses trace back to here */
  var DATA = {
    l1: {
      does: ['Explain what a cache is and why it exists',
             'Describe the latency and storage trade-off',
             'Spot repeated work in a request path']
    },
    l2: {
      does: ['Define hit, miss, hit ratio, cold and warm',
             'Design a key that cannot serve a wrong answer',
             'Choose what to store, and for how long',
             'Warm a cache deliberately'],
      from: 'l1', feeds: 3
    },
    l3: {
      does: ['Control browser caching through HTTP headers',
             'Revalidate instead of re-downloading',
             'Cache for a year without stranding anyone'],
      from: 'l2', feeds: 1
    },
    l4: {
      does: ['Explain how a CDN serves, misses and refreshes',
             'Reason about what makes two requests "the same"',
             'Choose between TTL, purge and versioning'],
      from: 'l3', feeds: 1
    },
    l5: {
      does: ['Cache inside the application process',
             'Memoize pure computation',
             'Recognise where in-process caching stops working'],
      from: 'l2', feeds: 1
    },
    l6: {
      does: ['Explain why instances must share a cache',
             'Describe partitioning and replication',
             'Predict what happens when a node is added or lost'],
      from: 'l5', feeds: 1
    },
    l7: {
      does: ['Describe the caches the database already keeps',
             'Separate what you tune from what you build',
             'Recognise ORM caching and its traps'],
      from: 'l5'
    },
    l8: {
      does: ['Implement cache-aside',
             'Tell cache-aside from read-through by who owns the miss',
             'Handle a thousand concurrent misses on one key'],
      from: 'l2', feeds: 2
    },
    l9: {
      does: ['Compare the three write strategies',
             'Choose one from the workload and the tolerable failure',
             'Say which realms take part in writes at all'],
      from: 'l8'
    },
    l10: {
      does: ['Tell expiration from eviction',
             'Choose an eviction policy for a workload',
             'Set lifetimes deliberately rather than by habit'],
      from: 'l2', feeds: 2
    },
    l11: {
      does: ['Explain why invalidation is genuinely hard',
             'Delete on write, and version keys instead',
             'Invalidate across all four realms at once'],
      from: 'l10'
    },
    l12: {
      does: ['Recognise all five attacks as they happen',
             'Derive every defense from an earlier lesson',
             'Notice that four of the five are self-inflicted'],
      from: 'l11'
    },
    l13: {
      does: ['Instrument a cache properly',
             'Raise a hit ratio deliberately',
             'Decide what not to cache at all'],
      from: 'l12'
    },
    l14: {
      does: ['Design a caching strategy across four realms',
             'Justify every layer, key and lifetime',
             'State plainly what you chose not to cache'],
      from: 'l13'
    }
  };

  function lessonLabel(id) { return 'Lesson ' + id.slice(1); }

  function href(id) {
    var page = PAGES[id] || '';
    var here = location.pathname.split('/').pop() || 'index.html';
    return (page === here ? '' : page) + '#' + id;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  var heads = Array.prototype.slice.call(document.querySelectorAll('.lesson-head[id]'));
  if (!heads.length) return;

  var lessons = [];

  heads.forEach(function (head) {
    var id = head.id;
    var body = head.nextElementSibling;
    if (!body || !body.classList.contains('wrap')) return;

    var info = DATA[id] || {};

    /* Direct children only — this skips the h3 inside the storefront mock. */
    var headings = Array.prototype.slice.call(body.querySelectorAll(':scope > h3'));
    if (!headings.length) return;

    headings.forEach(function (h, i) {
      if (!h.id) h.id = id + '-s' + (i + 1);
    });

    var words = (body.textContent || '').trim().split(/\s+/).length;
    var minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));

    /* ---------- the inline card ---------- */

    var card = el('aside', 'lesson-card');
    card.setAttribute('aria-label', lessonLabel(id) + ' overview');

    var top = el('div', 'lc-top');
    top.appendChild(el('span', 'lc-eyebrow', 'In this lesson'));
    top.appendChild(el('span', 'lc-meta', minutes + ' min read · ' + headings.length + ' parts'));
    card.appendChild(top);

    var list = el('ol', 'lc-contents');
    headings.forEach(function (h) {
      var li = el('li');
      var a = el('a', null, h.textContent.trim());
      a.href = '#' + h.id;
      li.appendChild(a);
      list.appendChild(li);
    });
    card.appendChild(list);

    if (info.does && info.does.length) {
      var obj = el('div', 'lc-objectives');
      obj.appendChild(el('span', 'lc-eyebrow', 'By the end you can'));
      var ul = el('ul');
      info.does.forEach(function (d) { ul.appendChild(el('li', null, d)); });
      obj.appendChild(ul);
      card.appendChild(obj);
    }

    if (info.from || info.feeds) {
      var deps = el('div', 'lc-deps');

      if (info.from) {
        var b = el('span', 'lc-dep');
        b.appendChild(el('span', 'lc-dep-tag', 'Builds on'));
        var ba = el('a', null, lessonLabel(info.from));
        ba.href = href(info.from);
        b.appendChild(ba);
        deps.appendChild(b);
      }

      if (info.feeds) {
        var f = el('span', 'lc-dep lc-dep-feeds');
        f.appendChild(el('span', 'lc-dep-tag', 'Feeds'));
        var fa = el('a', null, 'Lesson 12');
        fa.href = href('l12');
        f.appendChild(fa);
        f.appendChild(el('span', 'lc-count', '×' + info.feeds));
        f.title = info.feeds + ' of the five defenses in Lesson 12 trace back to this lesson';
        deps.appendChild(f);
      }

      card.appendChild(deps);
    }

    var anchor = body.querySelector(':scope > .technique');
    if (anchor && anchor.nextSibling) {
      body.insertBefore(card, anchor.nextSibling);
    } else {
      body.insertBefore(card, body.firstChild);
    }

    lessons.push({
      id: id,
      title: (head.querySelector('h2') || {}).textContent || lessonLabel(id),
      label: lessonLabel(id),
      body: body,
      card: card,
      headings: headings
    });
  });

  if (!lessons.length) return;

  /* ---------- the sticky rail ---------- */

  var rail = el('aside', 'lesson-rail');
  rail.setAttribute('aria-label', 'Lesson contents');
  rail.hidden = true;

  var railTitle = el('div', 'lr-title');
  var railList = el('ol', 'lr-contents');
  rail.appendChild(el('span', 'lc-eyebrow', 'In this lesson'));
  rail.appendChild(railTitle);
  rail.appendChild(railList);
  document.body.appendChild(rail);

  var railFor = null;
  var railLinks = [];

  function renderRail(lesson) {
    if (railFor === lesson.id) return;
    railFor = lesson.id;
    railTitle.textContent = lesson.label + ' · ' + lesson.title;
    railList.textContent = '';
    railLinks = lesson.headings.map(function (h) {
      var li = el('li');
      var a = el('a', null, h.textContent.trim());
      a.href = '#' + h.id;
      li.appendChild(a);
      railList.appendChild(li);
      return a;
    });
  }

  /* Worked out from geometry rather than from the observer entries: entries go
     stale the moment the reader jumps several headings at once. */
  function markCurrentSection(lesson) {
    var best = 0;
    for (var i = 0; i < lesson.headings.length; i++) {
      if (lesson.headings[i].getBoundingClientRect().top <= 140) best = i;
    }
    railLinks.forEach(function (a, i) { a.classList.toggle('here', i === best); });
  }

  /* Observers rather than a scroll handler: the rest of the site already spies
     this way, it survives any scroll container, and it does no work while the
     page is still. */

  var bodyVisible = {};
  var cardVisible = {};

  function refresh() {
    if (window.innerWidth < RAIL_MIN_WIDTH) {
      rail.classList.remove('show');
      rail.hidden = true;
      return;
    }

    var active = null;
    for (var i = 0; i < lessons.length; i++) {
      if (bodyVisible[lessons[i].id]) { active = lessons[i]; break; }
    }

    /* Hold the rail back until the inline card has gone, so the two never
       say the same thing at the same time. */
    if (!active || cardVisible[active.id]) {
      rail.classList.remove('show');
      rail.hidden = true;
      return;
    }

    renderRail(active);
    markCurrentSection(active);

    if (rail.hidden) {
      rail.hidden = false;
      requestAnimationFrame(function () { rail.classList.add('show'); });
    } else {
      rail.classList.add('show');
    }
  }

  if (!('IntersectionObserver' in window)) return;

  /* Which lesson is being read. The band ignores anything below the upper
     part of the viewport, so the "current" lesson is the one under the eye. */
  var bodyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      bodyVisible[e.target.getAttribute('data-lesson')] = e.isIntersecting;
    });
    refresh();
  }, { rootMargin: '-110px 0px -55% 0px', threshold: 0 });

  var cardObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      cardVisible[e.target.getAttribute('data-lesson')] = e.isIntersecting;
    });
    refresh();
  }, { rootMargin: '-40px 0px 0px 0px', threshold: 0 });

  /* Every heading crossing the band — entering or leaving — is a cue to
     recompute which section is being read. */
  var headingObserver = new IntersectionObserver(function () {
    refresh();
  }, { rootMargin: '-140px 0px -55% 0px', threshold: 0 });

  lessons.forEach(function (l) {
    l.body.setAttribute('data-lesson', l.id);
    l.card.setAttribute('data-lesson', l.id);
    bodyObserver.observe(l.body);
    cardObserver.observe(l.card);
    l.headings.forEach(function (h) { headingObserver.observe(h); });
  });

  /* Scroll is a supplementary cue only — the observers above are the primary
     driver, so the rail still works where scroll events are unavailable. */
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; refresh(); });
  }, { passive: true });

  window.addEventListener('resize', refresh);
  refresh();
})();
