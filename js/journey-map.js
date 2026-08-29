/* Progressive learning map shared by the home page and every course page. */
(function () {
  'use strict';

  var LESSONS = [
    {n:1, realm:'prologue', stage:0, title:'The Forgotten Art of Caching', technique:'The Sight', insight:'Recognize repeated work', impact:'Reveals where caching can help', learned:'A cache is a copy of an answer kept closer to where it is needed.', helped:'You can now spot repeated work before choosing a caching tool.', from:[], to:[2,3]},
    {n:2, realm:'prologue', stage:0, title:'The Trial of Hits and Misses', technique:'The Naming', insight:'Design safe cache keys', impact:'Prevents quietly wrong answers', learned:'Keys, values, hits, misses, TTL and warming give every later decision a precise name.', helped:'You can tell an expected miss from a dangerous wrong hit.', from:[1], to:[3,4,5,8,10,12]},
    {n:3, realm:'air', stage:1, title:'The Browser Realm', technique:'Windkeeping', insight:'Control browser reuse', impact:'Removes network trips safely', learned:'HTTP policy controls whether the browser reuses, validates or refuses to store a response.', helped:'You can keep assets closest to the reader without trapping old versions.', from:[2], to:[4,11,12]},
    {n:4, realm:'water', stage:1, title:'The Edge Kingdom', technique:'Tidecall', insight:'Place copies at the edge', impact:'Reduces distance and origin load', learned:'A CDN serves shared copies near users, using an edge cache key and freshness policy.', helped:'You can move load away from the origin while protecting variants and private responses.', from:[2,3], to:[8,11,12]},
    {n:5, realm:'earth', stage:1, title:'The Application Sanctum', technique:'Stonehold', insight:'Reuse work in-process', impact:'Provides the fastest local hits', learned:'In-process caches and memoization trade shared visibility for extreme speed.', helped:'You can remove repeated computation when one process owns the answer.', from:[2], to:[6,8,12]},
    {n:6, realm:'earth', stage:1, title:'The Distributed Cache Tribes', technique:'Stonesplit', insight:'Share cache across servers', impact:'Keeps application instances aligned', learned:'Partitioning and replication let many servers share one cache.', helped:'You can make instances agree and predict node loss, movement and hot keys.', from:[5], to:[8,12]},
    {n:7, realm:'fire', stage:1, title:'The Database Depths', technique:'Emberdraw', insight:'Use database caches first', impact:'Avoids unnecessary cache layers', learned:'Buffers, plans and indexes are caches the database already maintains.', helped:'You can tune existing heat before adding another copy to the system.', from:[5,6], to:[13,14]},
    {n:8, realm:'spirit', stage:2, title:'The Three Reading Techniques', technique:'The Three Draws', insight:'Choose the read path', impact:'Controls misses, filling and refresh', learned:'Cache-aside, read-through and refresh-ahead differ by who owns a miss and when refresh happens.', helped:'You can design a read path and coalesce concurrent misses with single-flight.', from:[2,4,6], to:[9,11,12,14]},
    {n:9, realm:'spirit', stage:2, title:'The Three Writing Techniques', technique:'The Three Seals', insight:'Choose the write path', impact:'Balances consistency, speed and risk', learned:'Write-through, write-behind and write-around place durability, speed and cache pollution differently.', helped:'You can choose a write path from the failure your workload can tolerate.', from:[8], to:[11,14]},
    {n:10, realm:'spirit', stage:2, title:'The Temple of Eviction', technique:'The Letting Go', insight:'Control expiry and eviction', impact:'Prevents pressure and expiry spikes', learned:'Expiration controls age; eviction controls space; policies predict which entry leaves.', helped:'You can choose TTL and eviction deliberately and prevent synchronized expiry.', from:[2,6], to:[11,12,13]},
    {n:11, realm:'spirit', stage:2, title:'The Invalidation Paradox', technique:'The Truthbinding', insight:'Keep every copy truthful', impact:'Stops stale data across layers', learned:'Delete-on-write, versioned keys and events keep copies aligned with their source.', helped:'You can trace one update through every layer that might answer.', from:[2,3,4,9,10], to:[12,14]},
    {n:12, realm:'war', stage:3, title:'The Latency Lord’s Attacks', technique:'The Trial', insight:'Defend cache failure modes', impact:'Turns prior lessons into resilience', learned:'Stampede, penetration, avalanche, hot keys and poisoning are pressure tests of earlier choices.', helped:'You can derive defenses from keys, TTL, single-flight, validation and replication.', from:[2,3,4,6,8,10,11], to:[13,14]},
    {n:13, realm:'war', stage:3, title:'Restoring Balance', technique:'The Measure', insight:'Measure whether caching helps', impact:'Shows what to tune or remove', learned:'Per-key hit ratio, tail latency and memory cost reveal whether a cache earns its place.', helped:'You can optimize the right bottleneck—or remove a cache that no longer helps.', from:[12], to:[14]},
    {n:14, realm:'war', stage:3, title:'The Final Battle', technique:'The Convergence', insight:'Assemble the full strategy', impact:'Makes every trade-off explicit', learned:'A complete strategy combines locations, keys, reads, writes, lifetimes, invalidation and defenses.', helped:'You can justify the whole design and state clearly what must never be cached.', from:[1,2,8,9,10,11,12,13], to:[]}
  ];

  var STAGES = [
    {name:'Foundations', range:'Lessons 1–2'},
    {name:'The four realms', range:'Lessons 3–7'},
    {name:'Control the copies', range:'Lessons 8–11'},
    {name:'Defend the system', range:'Lessons 12–14'}
  ];

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function currentLessonNumber() {
    var direct = document.body.getAttribute('data-course-lesson');
    var head = document.querySelector('.lesson-head[id]');
    var id = direct || (head && head.id);
    if (id) return Math.max(1, Math.min(14, parseInt(id.slice(1), 10)));
    try {
      var saved = JSON.parse(localStorage.getItem('cachebender-progress'));
      if (saved && saved.id) return Math.max(1, Math.min(14, parseInt(saved.id.slice(1), 10)));
    } catch (e) { /* begin at the start */ }
    return 1;
  }

  var current = currentLessonNumber();
  var selected = current;

  function mapIcon() {
    return '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="12"></circle><path d="M16 4a12 12 0 0 1 12 12"></path><path d="M28 16a12 12 0 0 1-12 12"></path><path d="M16 28A12 12 0 0 1 4 16"></path><path d="M4 16A12 12 0 0 1 16 4"></path><path d="m16 10 6 6-6 6-6-6Z"></path><circle cx="16" cy="16" r="2"></circle></svg>';
  }

  var dialog = el('dialog', 'journey-map-modal');
  dialog.setAttribute('aria-labelledby', 'journey-map-title');
  var shell = el('div', 'journey-map-shell');

  var header = el('header', 'journey-map-header');
  var heading = el('div');
  heading.appendChild(el('span', 'journey-map-kicker', 'Your path through the four realms'));
  var h2 = el('h2', null, 'What you know — and what comes next'); h2.id = 'journey-map-title'; heading.appendChild(h2);
  heading.appendChild(el('p', null, 'Select a concept to see what it taught you, how it helped and what it unlocks.'));
  header.appendChild(heading);
  var close = el('button', 'journey-map-close', 'Close'); close.type = 'button'; close.setAttribute('aria-label', 'Close learning map'); header.appendChild(close);
  shell.appendChild(header);

  var progress = el('div', 'journey-map-progress');
  var progressText = el('span', null, 'Lesson ' + current + ' of 14');
  var progressTrack = el('div', 'journey-map-track');
  var progressBar = el('span'); progressBar.style.width = ((current / 14) * 100) + '%'; progressTrack.appendChild(progressBar);
  progress.appendChild(progressText); progress.appendChild(progressTrack); shell.appendChild(progress);

  var stageRail = el('ol', 'journey-stage-rail');
  STAGES.forEach(function (stage, index) {
    var li = el('li', index < LESSONS[current - 1].stage ? 'is-complete' : (index === LESSONS[current - 1].stage ? 'is-current' : 'is-ahead'));
    li.appendChild(el('span', 'journey-stage-dot', index < LESSONS[current - 1].stage ? '✓' : String(index + 1)));
    var copy = el('span'); copy.appendChild(el('b', null, stage.name)); copy.appendChild(el('small', null, stage.range)); li.appendChild(copy); stageRail.appendChild(li);
  });
  shell.appendChild(stageRail);

  var body = el('div', 'journey-map-body');
  var path = el('div', 'journey-map-path');
  path.setAttribute('aria-label', 'Course lesson map');
  var nodeByNumber = {};

  STAGES.forEach(function (stage, stageIndex) {
    var group = el('section', 'journey-map-group stage-' + stageIndex);
    var groupHead = el('div', 'journey-map-group-head'); groupHead.appendChild(el('b', null, stage.name)); groupHead.appendChild(el('span', null, stage.range)); group.appendChild(groupHead);
    var nodes = el('div', 'journey-map-nodes');
    LESSONS.filter(function (lesson) { return lesson.stage === stageIndex; }).forEach(function (lesson) {
      var state = lesson.n < current ? 'is-mastered' : (lesson.n === current ? 'is-current' : 'is-ahead');
      var button = el('button', 'journey-node realm-' + lesson.realm + ' ' + state);
      button.type = 'button'; button.setAttribute('data-lesson', String(lesson.n)); button.setAttribute('aria-pressed', lesson.n === selected ? 'true' : 'false');
      button.appendChild(el('span', 'journey-node-number', String(lesson.n).padStart(2, '0')));
      var nodeCopy = el('span'); nodeCopy.appendChild(el('b', null, lesson.insight)); nodeCopy.appendChild(el('small', null, lesson.impact)); button.appendChild(nodeCopy);
      button.appendChild(el('span', 'journey-node-state', lesson.n < current ? 'Learned earlier' : (lesson.n === current ? 'Learning now' : 'Learn later')));
      button.addEventListener('click', function () { selectLesson(lesson.n); });
      nodes.appendChild(button); nodeByNumber[lesson.n] = button;
    });
    group.appendChild(nodes); path.appendChild(group);
  });
  body.appendChild(path);

  var detail = el('aside', 'journey-map-detail'); detail.setAttribute('aria-live', 'polite'); body.appendChild(detail);
  shell.appendChild(body); dialog.appendChild(shell); document.body.appendChild(dialog);

  function relationLinks(label, values) {
    var row = el('div', 'journey-relation-row'); row.appendChild(el('span', null, label));
    var links = el('div');
    if (!values.length) links.appendChild(el('em', null, label === 'Builds on' ? 'Starting point' : 'Final convergence'));
    values.forEach(function (n) { var a = el('a', null, 'Lesson ' + n); a.href = 'l' + n + '.html#l' + n; links.appendChild(a); });
    row.appendChild(links); return row;
  }

  function selectLesson(number) {
    selected = number;
    var lesson = LESSONS[number - 1];
    Object.keys(nodeByNumber).forEach(function (key) {
      var node = nodeByNumber[key]; var n = parseInt(key, 10);
      node.classList.toggle('is-selected', n === number);
      node.classList.toggle('is-source', lesson.from.indexOf(n) >= 0);
      node.classList.toggle('is-destination', lesson.to.indexOf(n) >= 0);
      node.setAttribute('aria-pressed', n === number ? 'true' : 'false');
    });

    detail.textContent = '';
    var status = number < current ? 'Learned earlier' : (number === current ? 'Learning now' : 'Learn later');
    detail.appendChild(el('span', 'journey-detail-status realm-' + lesson.realm, status));
    detail.appendChild(el('div', 'journey-detail-number', 'Lesson ' + number + ' · ' + lesson.technique));
    detail.appendChild(el('h3', null, lesson.insight));

    var learnedHeading = number < current ? 'What you learned earlier' : (number === current ? 'What you are learning now' : 'What this will teach');
    var helpedHeading = number < current ? 'How it helped' : 'Why it matters';
    var learned = el('section'); learned.appendChild(el('h4', null, learnedHeading)); learned.appendChild(el('p', null, lesson.learned)); detail.appendChild(learned);
    var helped = el('section', 'journey-helped'); helped.appendChild(el('h4', null, helpedHeading)); helped.appendChild(el('p', null, lesson.helped)); detail.appendChild(helped);
    var relations = el('section', 'journey-relations'); relations.appendChild(el('h4', null, 'How it connects')); relations.appendChild(relationLinks('Builds on', lesson.from)); relations.appendChild(relationLinks('Unlocks', lesson.to)); detail.appendChild(relations);
    var open = el('a', 'journey-open-lesson', number <= current ? 'Review Lesson ' + number + ' →' : 'Preview Lesson ' + number + ' →'); open.href = 'l' + number + '.html#l' + number; detail.appendChild(open);
  }

  selectLesson(selected);

  function openMap() {
    selected = current; selectLesson(current);
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
  }
  function closeMap() { if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open'); }
  close.addEventListener('click', closeMap);
  dialog.addEventListener('click', function (event) { if (event.target === dialog) closeMap(); });

  function addMenuTrigger(container, before) {
    if (!container || container.querySelector('.journey-map-trigger')) return;
    var button = el('button', 'journey-map-trigger', 'Learning map'); button.type = 'button'; button.addEventListener('click', openMap);
    if (before) container.insertBefore(button, before); else container.appendChild(button);
  }

  document.querySelectorAll('.course-books').forEach(function (nav) { addMenuTrigger(nav, nav.querySelector('.course-lesson-menu')); });
  document.querySelectorAll('.mobile-nav .inner').forEach(function (inner) { addMenuTrigger(inner, inner.firstChild); });
  var homeMenu = document.querySelector('.top-end'); if (homeMenu) addMenuTrigger(homeMenu, homeMenu.querySelector('.theme-toggle'));

  var fab = el('button', 'journey-map-fab'); fab.type = 'button'; fab.setAttribute('aria-label', 'Open learning map'); fab.innerHTML = mapIcon() + '<span>Learning map</span>'; fab.addEventListener('click', openMap); document.body.appendChild(fab);
})();
