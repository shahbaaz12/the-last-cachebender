/* Course continuity, lesson navigation, cross-references and learning aids. */
(function () {
  'use strict';

  var WORDS_PER_MINUTE = 220;
  var RAIL_MIN_WIDTH = 1100;

  var DATA = {
    l1: { title:'The Forgotten Art of Caching', technique:'The Sight', gloss:'see repeated work before reaching for a cache',
      does:['Explain what a cache is and why it exists','Describe the speed, freshness and memory trade-off','Spot repeated work in a request path'],
      bridge:'This is the starting point: learn to see repeated work and the copy that can replace it.',
      carry:['A cache is a copy of an answer kept closer to where it is needed.','Caching trades freshness and memory for speed.','The first question is not “where can I cache?” but “what work is being repeated?”'], feeds:['l2','l3'] },
    l2: { title:'The Trial of Hits and Misses', technique:'The Naming', gloss:'name keys, values, lifetimes, hits and misses precisely',
      does:['Define hit, miss, hit ratio, cold and warm','Design a key that cannot serve a wrong answer','Choose what to store and for how long','Warm a cache deliberately'],
      from:['l1'], bridge:'Lesson 1 gave you the reason for a cache. Now you name every moving part so later techniques have a shared vocabulary.',
      carry:['A key must include every input that changes the answer.','A miss is expected work; a wrong hit is a correctness failure.','TTL controls freshness, while warming controls the first requests.'], feeds:['l3','l8','l10','l12'] },
    l3: { title:'The Browser Realm', technique:'Windkeeping', gloss:'hold a copy closest to the user',
      does:['Control browser caching through HTTP headers','Revalidate instead of re-downloading','Cache for a year without stranding anyone'],
      from:['l2'], bridge:'Lesson 2 defined keys, values and lifetimes. The browser is the first place where those choices become real HTTP policy.',
      carry:['The browser is the closest, cheapest cache.','Cache-Control sets reuse policy; validators make rechecks cheap.','Fingerprint immutable assets so a new version gets a new URL.'], feeds:['l4','l11','l12'] },
    l4: { title:'The Edge Kingdom', technique:'Tidecall', gloss:'push reusable copies outward to the edge',
      does:['Explain how a CDN serves, misses and refreshes','Reason about what makes two edge requests the same','Choose between TTL, purge and versioning'],
      from:['l2','l3'], bridge:'The browser proved that HTTP can control a cache. At the edge, the same signals operate on shared copies and a much more dangerous cache key.',
      carry:['A CDN makes content closer, not intrinsically faster.','The edge key must vary on every request input that changes the response.','TTL, purge and versioning solve different freshness problems.'], feeds:['l8','l11','l12'] },
    l5: { title:'The Application Sanctum', technique:'Stonehold', gloss:'hold data inside the application process',
      does:['Cache inside the application process','Memoize pure computation','Recognise where in-process caching stops working'],
      from:['l2'], bridge:'Lesson 2 gave every cached answer a key and lifetime. Here you place that answer in the fastest memory your own code controls.',
      carry:['In-process memory is fast and simple.','Memoization is safe when the same inputs always produce the same output.','Each application instance owns a different local cache.'], feeds:['l6','l8','l12'] },
    l6: { title:'The Distributed Cache Tribes', technique:'Stonesplit', gloss:'spread one shared cache across many nodes',
      does:['Explain why instances share a cache','Describe partitioning and replication','Predict what happens when a node is added or lost'],
      from:['l5'], bridge:'Lesson 5 exposed the limit of local memory: each server can disagree. A distributed cache gives those servers one shared realm.',
      carry:['Partitioning decides which node owns a key.','Replication trades memory for availability.','Hot keys and node movement must be designed for, not discovered in production.'], feeds:['l8','l12'] },
    l7: { title:'The Database Depths', technique:'Emberdraw', gloss:'draw on the database’s own caches before adding another',
      does:['Describe the caches the database already keeps','Separate what you tune from what you build','Recognise ORM caching and its traps'],
      from:['l5','l6'], bridge:'Application caches are not the first caches in the system. Before adding another copy, inspect the buffers, plans and indexes already beneath you.',
      carry:['A database is already a caching system.','An index often removes more work than a query cache.','ORM identity maps are scoped caches with consistency limits.'], feeds:['l13','l14'] },
    l8: { title:'The Three Reading Techniques', technique:'The Three Draws', gloss:'choose who owns a miss and when refresh happens',
      does:['Implement cache-aside','Distinguish read-through by who owns the miss','Handle concurrent misses on one key'],
      from:['l2','l4','l6'], bridge:'You now know where copies can live. This lesson changes dimension: it decides how a read reaches, fills and refreshes those copies.',
      carry:['Cache-aside leaves miss handling in application code.','Read-through gives miss handling to the cache abstraction.','Refresh-ahead updates before expiry; single-flight coalesces concurrent misses.'], feeds:['l9','l11','l12','l14'] },
    l9: { title:'The Three Writing Techniques', technique:'The Three Seals', gloss:'choose when the cache and source are updated',
      does:['Compare write-through, write-behind and write-around','Choose from workload and tolerable failure','Say which realms participate in writes'],
      from:['l8'], bridge:'Lesson 8 followed reads through the cache. Writes reverse the pressure: now you must decide when the copy and source of truth change.',
      carry:['Write-through favors consistency.','Write-behind favors throughput but risks queued writes.','Write-around avoids polluting the cache with data that may not be read.'], feeds:['l11','l14'] },
    l10: { title:'The Temple of Eviction', technique:'The Letting Go', gloss:'control expiry and choose what leaves under pressure',
      does:['Tell expiration from eviction','Choose an eviction policy for a workload','Set lifetimes deliberately'],
      from:['l2','l6'], bridge:'Lesson 2 introduced lifetimes. This lesson separates time-based expiration from capacity-based eviction and makes both deliberate.',
      carry:['Expiration is about age; eviction is about space.','LRU, LFU and FIFO encode different beliefs about future value.','TTL jitter prevents synchronized expiry.'], feeds:['l11','l12','l13'] },
    l11: { title:'The Invalidation Paradox', technique:'The Truthbinding', gloss:'keep every copy aligned with the source of truth',
      does:['Explain why invalidation is hard','Delete on write and version keys','Invalidate across all four realms'],
      from:['l2','l3','l4','l9','l10'], bridge:'Every earlier lesson created or retained a copy. Now one source update must find those copies—or make their keys impossible to reuse.',
      carry:['Invalidation must reach every layer that can answer.','Versioned keys make old entries unreachable.','Events propagate change, but consumers must tolerate delay and replay.'], feeds:['l12','l14'] },
    l12: { title:'The Latency Lord’s Attacks', technique:'The Trial', gloss:'derive defenses from techniques already mastered',
      does:['Recognise all five cache attacks','Derive every defense from an earlier lesson','Notice which failures are self-inflicted'],
      from:['l2','l3','l4','l6','l8','l10','l11'], bridge:'This lesson grants no new technique. Each attack is a pressure test for something you already learned; use the linked lesson previews whenever a defense feels distant.',
      carry:['Single-flight stops a stampede.','Negative caching or Bloom filters stop repeated impossible lookups.','TTL jitter, hot-key replication and complete cache keys defend the remaining attacks.'], feeds:['l13','l14'] },
    l13: { title:'Restoring Balance', technique:'The Measure', gloss:'instrument the cache and remove what no longer earns its place',
      does:['Instrument a cache properly','Raise hit ratio deliberately','Decide what not to cache'],
      from:['l12'], bridge:'Lesson 12 showed how caches fail under pressure. Measurement tells you which failure is happening and whether the cache is still worth its cost.',
      carry:['Measure per-key hit ratio and tail latency, not averages alone.','A high hit ratio can still hide expensive misses.','The best optimization is sometimes deleting the cache.'], feeds:['l14'] },
    l14: { title:'The Final Battle', technique:'The Convergence', gloss:'combine all four realms into one defended design',
      does:['Design across four cache realms','Justify every layer, key and lifetime','State what must not be cached'],
      from:['l1','l2','l8','l9','l10','l11','l12','l13'], bridge:'Nothing new is introduced here. Assemble the locations, read and write paths, lifetimes, invalidation and defenses you have already earned.',
      carry:['Choose where each answer may live.','Choose how reads and writes interact with each copy.','Defend every key, lifetime and invalidation path—and leave private data out.'] }
  };

  var GROUPS = [
    ['Prologue',['l1','l2']], ['Book One · Air',['l3']], ['Book Two · Water',['l4']],
    ['Book Three · Earth',['l5','l6']], ['Book Four · Fire',['l7']],
    ['Interlude · Spirit',['l8','l9','l10','l11']], ['Book Five · War',['l12','l13','l14']]
  ];

  function numberOf(id){ return parseInt(id.slice(1),10); }
  function lessonLabel(id){ return 'Lesson ' + numberOf(id); }
  function href(id){ return 'l' + numberOf(id) + '.html#' + id; }
  function el(tag, cls, text){ var n=document.createElement(tag); if(cls)n.className=cls; if(text!=null)n.textContent=text; return n; }

  function currentLessonId(){
    var bodyId=document.body.getAttribute('data-course-lesson');
    var head=document.querySelector('.lesson-head[id]');
    return bodyId || (head && head.id) || '';
  }

  function lessonLink(id, cls){
    var a=el('a',cls,lessonLabel(id)); a.href=href(id); return a;
  }

  function buildGroupedList(current){
    var root=el('div','lesson-nav-groups');
    GROUPS.forEach(function(group){
      var section=el('section','lesson-nav-group');
      section.appendChild(el('div','lesson-nav-book',group[0]));
      var ul=el('ul');
      group[1].forEach(function(id){
        var li=el('li'); var a=el('a',null,numberOf(id)+' · '+DATA[id].title); a.href=href(id);
        if(id===current){ a.classList.add('here'); a.setAttribute('aria-current','page'); }
        li.appendChild(a); ul.appendChild(li);
      });
      section.appendChild(ul); root.appendChild(section);
    });
    return root;
  }

  function rebuildNavigation(current){
    document.querySelectorAll('.course-books').forEach(function(nav){
      nav.textContent='';
      var home=el('a',null,'Home'); home.href='index.html'; nav.appendChild(home);
      var techniques=el('a',null,'Techniques'); techniques.href='techniques.html'; nav.appendChild(techniques);
      var menu=el('details','course-lesson-menu');
      menu.appendChild(el('summary',null,current && DATA[current] ? lessonLabel(current)+' of 14' : '14 lessons'));
      menu.appendChild(buildGroupedList(current)); nav.appendChild(menu);
    });
    document.querySelectorAll('.mobile-nav').forEach(function(nav){
      var summary=nav.querySelector('summary');
      if(summary) summary.textContent=current && DATA[current] ? lessonLabel(current)+' of 14 · '+DATA[current].title : 'All fourteen lessons';
      var inner=nav.querySelector('.inner') || el('div','inner'); inner.textContent='';
      inner.appendChild(buildGroupedList(current));
      var tech=el('a','mobile-techniques','Technique Index'); tech.href='techniques.html'; inner.appendChild(tech);
      if(!inner.parentNode) nav.appendChild(inner);
    });
  }

  function autolinkReferences(){
    var re=/\bLesson\s+(1[0-4]|[1-9])\b|\bL(1[0-4]|[1-9])\b/g;
    document.querySelectorAll('main .wrap').forEach(function(scope){
      var walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT,{acceptNode:function(node){
        var p=node.parentElement;
        if(!p || p.closest('a,pre,code,h1,h2,h3,h4,nav,.lesson-card,.lesson-compact-toc,.lesson-end')) return NodeFilter.FILTER_REJECT;
        re.lastIndex=0; return re.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }});
      var nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function(node){
        var text=node.nodeValue, frag=document.createDocumentFragment(), last=0, match; re.lastIndex=0;
        while((match=re.exec(text))){
          frag.appendChild(document.createTextNode(text.slice(last,match.index)));
          var id='l'+(match[1]||match[2]); var a=el('a','xref',match[0]); a.href=href(id);
          a.setAttribute('data-xref-preview',DATA[id].title+' — '+DATA[id].technique+': '+DATA[id].gloss+'.');
          frag.appendChild(a); last=re.lastIndex;
        }
        frag.appendChild(document.createTextNode(text.slice(last))); node.parentNode.replaceChild(frag,node);
      });
    });
  }

  function renderLessonCard(lesson){
    var info=DATA[lesson.id]||{}; var body=lesson.body;
    var words=(body.textContent||'').trim().split(/\s+/).length;
    var card=el('aside','lesson-card'); card.setAttribute('aria-label',lesson.label+' overview');
    var top=el('div','lc-top'); top.appendChild(el('span','lc-eyebrow','In this lesson')); top.appendChild(el('span','lc-meta',Math.max(1,Math.round(words/WORDS_PER_MINUTE))+' min read · '+lesson.headings.length+' parts')); card.appendChild(top);
    var list=el('ol','lc-contents'); lesson.headings.forEach(function(h){ var li=el('li'); var a=el('a',null,h.textContent.trim()); a.href='#'+h.id; li.appendChild(a); list.appendChild(li); }); card.appendChild(list);
    var bridge=el('div','lc-bridge'); bridge.appendChild(el('span','lc-eyebrow','Where this sits')); bridge.appendChild(el('p',null,info.bridge));
    if(info.from && info.from.length){ var deps=el('div','lc-deps'); info.from.forEach(function(id){ var b=el('span','lc-dep'); b.appendChild(el('span','lc-dep-tag','Builds on')); b.appendChild(lessonLink(id)); deps.appendChild(b); }); bridge.appendChild(deps); }
    card.appendChild(bridge);
    var obj=el('div','lc-objectives'); obj.appendChild(el('span','lc-eyebrow','By the end you can')); var ul=el('ul'); (info.does||[]).forEach(function(d){ul.appendChild(el('li',null,d));}); obj.appendChild(ul); card.appendChild(obj);
    if(info.feeds && info.feeds.length){ var feed=el('div','lc-feeds'); feed.appendChild(el('span','lc-dep-tag','Carries into')); info.feeds.forEach(function(id){feed.appendChild(lessonLink(id));}); card.appendChild(feed); }
    var anchor=body.querySelector(':scope > .technique, :scope > .trial');
    if(anchor) anchor.insertAdjacentElement('afterend',card); else body.insertBefore(card,body.firstChild);

    var compact=el('details','lesson-compact-toc'); compact.appendChild(el('summary',null,'In this lesson · '+lesson.headings.length+' parts')); var compactList=list.cloneNode(true); compact.appendChild(compactList); card.insertAdjacentElement('afterend',compact);
    lesson.card=card;
  }

  function renderLessonEnd(lesson){
    var info=DATA[lesson.id]||{}; var end=document.querySelector('[data-lesson-end="'+lesson.id+'"]');
    if(!end){ end=lesson.body.nextElementSibling; if(!end || !end.classList.contains('lesson-end')) return; }
    end.textContent='';
    var carry=el('section','lesson-carry'); carry.appendChild(el('span','lc-eyebrow','What you carry forward')); carry.appendChild(el('h3',null,lesson.label+' complete'));
    var ul=el('ul'); (info.carry||[]).forEach(function(item){ul.appendChild(el('li',null,item));}); carry.appendChild(ul); end.appendChild(carry);
    var nav=el('nav','lesson-step-nav'); nav.setAttribute('aria-label','Lesson navigation'); var n=numberOf(lesson.id);
    if(n>1){ var prev=el('a','lesson-step previous','← Lesson '+(n-1)); prev.href=href('l'+(n-1)); nav.appendChild(prev); }
    var map=el('a','lesson-step map','Course map'); map.href='index.html#lessons'; nav.appendChild(map);
    if(n<14){ var next=el('a','lesson-step next','Lesson '+(n+1)+' →'); next.href=href('l'+(n+1)); nav.appendChild(next); }
    else { var tech=el('a','lesson-step next','Technique Index →'); tech.href='techniques.html'; nav.appendChild(tech); }
    end.appendChild(nav);
  }

  function rebuildFooter(current){
    if(!current) return; var n=numberOf(current);
    document.querySelectorAll('.course-footer-nav').forEach(function(nav){ nav.textContent='';
      var prev=el('a','course-step previous',n>1?'← Lesson '+(n-1):'← Home'); prev.href=n>1?href('l'+(n-1)):'index.html'; nav.appendChild(prev);
      var map=el('a','course-map-link','All fourteen lessons'); map.href='index.html#lessons'; nav.appendChild(map);
      var next=el('a','course-step next',n<14?'Lesson '+(n+1)+' →':'Technique Index →'); next.href=n<14?href('l'+(n+1)):'techniques.html'; nav.appendChild(next);
    });
  }

  var current=currentLessonId(); rebuildNavigation(current); rebuildFooter(current);
  autolinkReferences();

  var heads=Array.prototype.slice.call(document.querySelectorAll('.lesson-head[id]'));
  if(!heads.length) return;
  var lessons=[];
  heads.forEach(function(head){
    var body=head.nextElementSibling; if(!body || !body.classList.contains('wrap')) return;
    var headings=Array.prototype.slice.call(body.querySelectorAll(':scope > h3'));
    headings.forEach(function(h,i){if(!h.id)h.id=head.id+'-s'+(i+1);});
    var lesson={id:head.id,label:lessonLabel(head.id),title:DATA[head.id].title,body:body,headings:headings}; renderLessonCard(lesson); renderLessonEnd(lesson); lessons.push(lesson);
  });

  var rail=el('aside','lesson-rail'); rail.setAttribute('aria-label','Lesson contents'); rail.hidden=true;
  var railTitle=el('div','lr-title'), railList=el('ol','lr-contents'); rail.appendChild(el('span','lc-eyebrow','In this lesson')); rail.appendChild(railTitle); rail.appendChild(railList); document.body.appendChild(rail);
  var railFor=null, railLinks=[];
  function renderRail(lesson){ if(railFor===lesson.id)return; railFor=lesson.id; railTitle.textContent=lesson.label+' · '+lesson.title; railList.textContent=''; railLinks=lesson.headings.map(function(h){var li=el('li'),a=el('a',null,h.textContent.trim());a.href='#'+h.id;li.appendChild(a);railList.appendChild(li);return a;}); }
  function markCurrent(lesson){var best=0;lesson.headings.forEach(function(h,i){if(h.getBoundingClientRect().top<=150)best=i;});railLinks.forEach(function(a,i){a.classList.toggle('here',i===best);});}
  function refresh(){
    if(window.innerWidth<RAIL_MIN_WIDTH){rail.hidden=true;rail.classList.remove('show');return;}
    var active=lessons.filter(function(l){var r=l.body.getBoundingClientRect();return r.top<innerHeight*.55&&r.bottom>120;})[0];
    if(!active || active.card.getBoundingClientRect().bottom>110){rail.hidden=true;rail.classList.remove('show');return;}
    renderRail(active);markCurrent(active);rail.hidden=false;requestAnimationFrame(function(){rail.classList.add('show');});
  }
  var ticking=false; window.addEventListener('scroll',function(){if(ticking)return;ticking=true;requestAnimationFrame(function(){ticking=false;refresh();});},{passive:true}); window.addEventListener('resize',refresh); refresh();
})();
