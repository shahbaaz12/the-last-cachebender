**The Last Cachebender — review and implementation status**

Reviewed 14 September 2026. Learner-facing copy and technical explanations were applied on 14–15 September 2026.

**Implementation status — 15 September 2026.** Sections A and B have been applied across the standalone lessons, grouped book pages, course page, reference page, and shared lesson copy. The text items in C2, C5, and C6, along with the readability, homepage-diagram, and standalone-opening changes in C3, C4, and C7, are also applied. For A1, the accepted policy is `max-age=10, must-revalidate`; this is stricter than the report's initial 60-second suggestion and is now used consistently in the price examples.

The metadata, social-image, and README cleanup in D are applied. The source-of-truth cleanup remains pending.

The elemental setting, the Latency Lord, and the recurring storefront give this course a clear identity. Keep them. The biggest opportunity is to make the teaching voice more direct: explain the idea plainly, use the story to make it memorable, and avoid repeating why the course was designed this way. Some passages also need correction because their examples and conclusions disagree.

Start our discussion with A1–A4 and A9–A11. These affect what the learner understands. The B items are proposed wording edits; the C items concern theme, readability, and navigation. They can be accepted individually.

**A. Corrections and continuity**

**A1. Give the price example one consistent freshness promise.**

Locations: [l3.html:728](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l3.html:728), [book-air.html:909](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-air.html:909), [l11.html:573](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l11.html:573), [book-spirit.html:2461](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-spirit.html:2461), [l14.html:114](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l14.html:114), [l14.html:136](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l14.html:136), [book-war.html:578](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-war.html:578), [book-war.html:606](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-war.html:606).

The price policy uses `max-age=60, stale-while-revalidate=300`, but the final example calls 60 seconds a “hard ceiling” and says “Worst-case staleness: 60 seconds.” Those settings allow 60 seconds of freshness plus 300 seconds of stale reuse. That is a potential response age of six minutes. [RFC 5861, section 3.1](https://www.rfc-editor.org/rfc/rfc5861.html#section-3.1).

Proposed direction: retain a 60-second browser reuse limit for the example, remove stale-while-revalidate from the price response, and require validation after expiry. Suggested browser policy: `max-age=60, must-revalidate`, with the appropriate public/private policy and variant key.

Suggested explanation: “The browser can reuse the price response for up to 60 seconds. After that, it must check for an update.”

Do not label this a proven limit for the whole system. The worked example must also account for upstream copies, invalidation delays, and failed purges. Its diagram says the CDN purge takes “~seconds,” while the paragraph says everything reachable is corrected in under a second. Align the diagram, table, paragraph, and failure alert. This is a content decision to settle before polishing the wording.

**A2. Make the final example agree about using a local cache.**

Locations: [l14.html:109](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l14.html:109), [l14.html:144](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l14.html:144), [l14.html:156](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l14.html:156); duplicates [book-war.html:571](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-war.html:571), [book-war.html:616](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-war.html:616), [book-war.html:632](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-war.html:632).

Current: “Browser, CDN, Redis. Not local cache: it changes too often to risk per-server divergence.” Later, both the hot-key defense and failure plan depend on a five-second local cache.

Proposed: “Browser, CDN, and Redis, with a five-second local cache for the most popular products.”

If we keep that design, add the local cache to the key/TTL table and invalidation path, and explain its contribution to the freshness budget. A local TTL limits reuse of that copy; it does not by itself guarantee that the value is only five seconds behind the database. Otherwise, remove the local cache throughout and replace the defense and fallback that depend on it.

Also change the diagram's `Redis DELETE price:42:*` to “Invalidate all affected price keys.” The diagram should read clearly as a design step, with the actual invalidation mechanism explained separately.

**A3. Correct the explanation of HTML caching.**

Locations: [l3.html:564](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l3.html:564), [l3.html:570](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l3.html:570); duplicates [book-air.html:725](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-air.html:725), [book-air.html:736](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-air.html:736).

Current: “The HTML is not cached.” The accompanying header is `Cache-Control: no-cache`.

Proposed: “The HTML is checked before every reuse.”

Replace the following paragraph with: “The HTML lists the current asset filenames. The browser may keep a copy, but it checks with the server before using it again. Each versioned asset keeps the same contents and can be cached for a long time.”

This matches the earlier explanation: `no-cache` requires validation; `no-store` prohibits storage. [RFC 9111, sections 5.2.2.4–5.2.2.5](https://www.rfc-editor.org/rfc/rfc9111.html#section-5.2.2.4).

**A4. Explain background refresh without promising that nobody waits.**

Locations: [l3.html:488](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l3.html:488), [l3.html:493](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l3.html:493), [l3.html:499](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l3.html:499); duplicates [book-air.html:634](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-air.html:634), [book-air.html:639](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-air.html:639), [book-air.html:645](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-air.html:645). Related passage: [l8.html:364](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l8.html:364), [book-spirit.html:611](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-spirit.html:611).

Current: “The effect is that the user never waits” and “For content where being 60 seconds out of date is harmless…” The example uses `max-age=60, stale-while-revalidate=3600`.

Proposed: “This response is fresh for 60 seconds. It may then be served stale for another hour while the browser checks for an update. A request may still wait if there is no usable cached copy.” The potential response age here is 61 minutes. [RFC 5861, section 3.1](https://www.rfc-editor.org/rfc/rfc5861.html#section-3.1).

Both Lessons 3 and 8 also equate this with refresh-ahead. Replace that connection with: “These are related ideas. Stale-while-revalidate refreshes a stale copy when a request arrives. Refresh-ahead starts before the copy expires.” This follows the timing distinction already taught in Lesson 8.

**A5. Describe responses rather than claiming that pages cannot be cached.**

Locations: [l3.html:211](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l3.html:211), [l3.html:212](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l3.html:212); duplicates [book-air.html:322](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-air.html:322), [book-air.html:324](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-air.html:324).

Current: “The browser cache stores files, not pages” and “There is no cached copy of your product page.”

Proposed heading: “Each response has its own caching rules.”

Proposed paragraph: “A page uses several responses: HTML, images, styles, scripts, and API data. Each can have its own caching rules. Here, we fetch changing product fields separately so they can have different lifetimes.”

This makes the example's architecture explicit and leaves room for HTML caching. [RFC 9111, section 2](https://www.rfc-editor.org/rfc/rfc9111.html#section-2).

**A6. Fix the N+1 example's query count.**

Locations: [l7.html:135](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l7.html:135), [book-fire.html:184](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-fire.html:184).

Current: “Two queries become one. Nothing to invalidate, nothing to expire, nothing to go stale — the work is simply gone.” The example above describes one query plus 50 more.

Proposed: “Fifty-one queries become one joined query. There is no extra cache to invalidate or keep fresh.”

For the following ORM sentence: “Your ORM may call this eager loading or include; some implementations use two queries instead of a join.” This keeps the explanation consistent with the shown example without promising that every ORM implements it identically.

**A7. Remove editorial placeholders from learner-facing content.**

Locations: [l12.html:150](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l12.html:150), [book-war.html:198](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-war.html:198), [book-war.html:686](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-war.html:686), [js/lesson-card.js:56](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/js/lesson-card.js:56).

Current: “Placeholder — Bloom filters” / “The second defense for this attack, deferred by decision.” The War book also exposes “Appendix — Open Placeholders,” including deferred Bloom filters and unplaced service-worker material.

Proposed: move these notes to the development documentation. Until Bloom filters are explained, remove them from the lesson's “Key takeaways” claim. Keep the negative-caching explanation that is already present. The learner should not encounter production notes or be told they learned material that is missing.

**A8. Correct the p99 example without losing its point.**

Locations: [l13.html:119](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l13.html:119), [book-war.html:405](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-war.html:405).

Current: “At 1,000 requests per second, it is 10 users every second, and a user loading a page with 20 requests will very likely hit it at least once.”

Proposed: “At 1,000 requests per second, the slowest 1% is 10 requests every second. Pages that make many requests have more chances to encounter a slow response.”

Requests are not necessarily distinct users. Under a simple independence assumption, 20 requests give about an 18% chance of at least one falling in the slowest 1%; “very likely” is too strong.

**A9. State the cart policy as a choice for this example.**

Locations: [course.html:290](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/course.html:290), [l4.html:464](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l4.html:464), [book-water.html:622](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-water.html:622), [l14.html:159](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l14.html:159), [l14.html:160](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l14.html:160), [book-earth.html:364](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-earth.html:364), [js/lesson-card.js:64](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/js/lesson-card.js:64).

Current: “never cached, in any realm, at any layer,” because the cart differs per user. Elsewhere, the course explains private browser caching and recommends Redis for cart/session data. Lesson 1 labels the cart “private, never shared,” rather than consistently “never,” as the ending claims.

Proposed: “For this storefront, we leave the cart badge response uncached to keep the policy simple. It belongs to one user and must never be reused as another user's answer. Cart data stored in Redis under a user-specific key is a separate decision.”

Replace “It has been in every table … always marked ‘never’” with “The cart has needed a separate policy throughout the course.” Replace the final takeaway's “leave private data out” with “keep each user's data separate.”

HTTP `private` permits private-cache storage; it prohibits shared-cache storage. [RFC 9111, section 5.2.2.7](https://www.rfc-editor.org/rfc/rfc9111.html#section-5.2.2.7).

**A10. Keep local memory and Redis within the same realm.**

Locations: [l5.html:129](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l5.html:129), [book-earth.html:176](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-earth.html:176), [l6.html:207](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l6.html:207), [book-earth.html:404](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-earth.html:404), [l12.html:194](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l12.html:194), [book-war.html:266](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-war.html:266).

Current: “They are not the same realm at all” and “Two realms, used together, on purpose.” Both are presented as part of Earth, the application realm.

Proposed: “Both belong to the application layer, but they have different costs: a local cache stays inside one process; Redis is shared over the network.”

For the closing line: “Local and shared caching, used together.” Lesson 12 repeats the same mismatch in its hot-key defense. Replace that explanation with: “This defense combines a local cache with a distributed cache, the two parts of the application realm from Book Three.” This preserves the four-realm model.

**A11. Match Lesson 6's promises to what it teaches.**

Locations: [l6.html:87](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l6.html:87), [l6.html:94](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l6.html:94), [l6.html:207](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l6.html:207), [book-earth.html:220](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-earth.html:220), [book-earth.html:232](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-earth.html:232), [book-earth.html:404](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-earth.html:404), [js/lesson-card.js:29](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/js/lesson-card.js:29).

Current: “The scenario that ended Lesson 5, now with ten servers instead of two.” That scenario is not at the end of Lesson 5.

Proposed: “Imagine ten servers running the same code, each with its own cached copy of the price. What happens when the price changes?”

The lesson also promises “one cache spread across many nodes,” and asks readers to “Pick a key scheme and a shard key,” but does not explain partitioning and replication enough to support those outcomes. Proposed addition: a short section showing how keys are divided between cache nodes, what replicas do, and what changes when a node fails. If the lesson remains about using shared Redis, narrow the technique description to “sharing a cache across application servers” and the exercise to “Choose a key scheme that includes every input that changes the answer.” Synchronize the overview and technique index with that choice.

**A12. Keep the recurring storefront recognizable.**

Locations: [course.html:192](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/course.html:192), [course.html:234](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/course.html:234), [l3.html:152](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l3.html:152), [l3.html:165](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l3.html:165), [l3.html:538](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l3.html:538), [l4.html:348](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l4.html:348), [l6.html:147](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l6.html:147), [l6.html:171](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l6.html:171); matching book passages at [book-air.html:252](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-air.html:252), [book-water.html:486](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-water.html:486), [book-earth.html:310](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-earth.html:310).

The course promises one product page and shows the Four Realms Atlas at $84, but later storefront examples switch to `/headphones.jpg` and `{name: Headphones, price: 25}`.

Proposed: use `/four-realms-atlas.jpg`, `four-realms-atlas-v2.jpg`, and the Atlas name in the recurring example. Carry a consistent starting price and currency through related demonstrations. Clearly label any intentionally separate examples. Generic search examples can still use other products.

**A13. Qualify the invalidation advice.**

Locations: [l11.html:587](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l11.html:587), [book-spirit.html:2477](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-spirit.html:2477), [index.html:363](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/index.html:363), [l14.html:124](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l14.html:124).

Current: concurrent writes leave “a permanently wrong value that no test will reproduce.” “Delete instead. It costs one miss and eliminates the bug class.” The homepage condenses this to “Delete, never update.”

Proposed lesson text: “Concurrent writes can reach the cache in a different order from the database. The cached value may then be wrong until it expires or is invalidated. Deleting it avoids this particular write-ordering problem, but you still need to consider concurrent reads that refill the cache.”

Proposed homepage text: “Learn when to delete a cached entry, when to change its key, and how to handle browser copies you cannot purge.”

This removes unsupported claims about permanence and testing, and makes clear which problem the advice addresses.

**A14. Label example measurements as assumptions or results.**

Location: [l14.html:156](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l14.html:156), [book-war.html:632](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-war.html:632).

Current: “Database load rises roughly 4×, which is within capacity. … Tested under load in staging.”

Proposed: “If Redis is unavailable, reads that miss the local cache fall back to the database. For this example, assume the database can handle four times its usual load. Verify that assumption with a staging load test.”

If there is an actual test supporting those numbers, retain it as a result and identify the test conditions. As written, the worked example does not tell the reader whether the numbers are assumptions or measured evidence.

**B. Suggested wording for a natural, simple voice**

These are editorial proposals, not all errors. Quoted excerpts normalize HTML whitespace. Keep the strongest short story passages; simplify the practical explanations and prompts.

| ID / location | Current wording | Proposed wording |
|---|---|---|
| B1 · [index.html:77](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/index.html:77) | “Four places to keep a copy, and the cost of every one.” | “Learn where to cache and what each choice costs.” |
| B2 · [index.html:141](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/index.html:141) | “Every lesson works on the same product page, because the interesting decisions only appear when the same page holds things that disagree about how stale they may be.” | “Every lesson uses the same product page. Its images, price, stock, and cart need different caching rules.” |
| B3 · [index.html:175](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/index.html:175) | “Every realm that answers is a trip the request never takes. The course is about deciding which ones are allowed to.” | “When a cache answers, the request can skip the layers below it. You will learn when it is safe to reuse that answer.” |
| B4 · [index.html:252](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/index.html:252) | The two paragraphs about watching weapons being forged and why Lesson 12 grants no new technique. | “As you learn, the Latency Lord studies your caches and prepares five attacks. In Lesson 12, you use techniques from earlier lessons to defend against them.” |
| B5 · [index.html:277](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/index.html:277) | “The heaviest lesson” | “Keys and lifetimes” |
| B6 · [index.html:303](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/index.html:303) | “A CDN does not make anything faster. It makes things closer. Learn what its cache key is really made of.” | “A CDN serves shared content closer to users. Learn how its cache key decides which requests can reuse a response.” |
| B7 · [index.html:315](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/index.html:315) | “The fastest cache there is, and the reason two servers can disagree about the same price.” | “Reuse data inside your application process, and see why two servers can hold different prices.” |
| B8 · [index.html:321](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/index.html:321) | “What Redis actually gives you beyond being shared, where it genuinely shines, and what it costs.” | “What Redis adds beyond a shared cache, when it helps, and what it costs.” |
| B9 · [index.html:375](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/index.html:375) | “Four of the five are caused by your own settings.” | “Explore five cache failure modes and the design choices that help prevent them.” |
| B10 · [course.html:177](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/course.html:177) | “Built around one product page and the seven things on it that each want a different answer.” | “We follow one product page, with seven parts that need different caching rules.” |
| B11 · [l1.html:342](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l1.html:342) / [course.html:622](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/course.html:622) | “Each limit protects a different consequence.” | “Each limit reflects what happens if the answer is out of date.” |
| B12 · [l2.html:145](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l2.html:145) / [course.html:806](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/course.html:806) | “Two things worth noticing in that number.” | “Two things stand out:” |
| B13 · [l2.html:203](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l2.html:203) / [course.html:884](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/course.html:884) | “Read it again. Nearly every cache bug in this course is a violation of that one sentence.” | “Keep this rule in mind. Missing inputs cause many of the cache bugs we'll meet.” |
| B14 · [l6.html:90](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l6.html:90) / [book-earth.html:224](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-earth.html:224) | “The problem, stated properly” | “When each server keeps its own copy” |
| B15 · [l6.html:133](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l6.html:133) / [book-earth.html:291](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-earth.html:291) | “Where Redis is genuinely excellent” | “When Redis helps” |
| B16 · [l6.html:193](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l6.html:193) / [book-earth.html:382](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-earth.html:382) | “Yes — put it in Redis, and pay the network trip for the privilege.” | “Yes. Use a shared cache such as Redis, and allow for the network round trip.” |
| B17 · [book-fire.html:91](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-fire.html:91) | “Fire is the most powerful realm, and the one you build in least,” followed by the extended fire metaphor. | “The fire is already burning: your database caches data on its own. In this realm, you learn to understand and tune those caches before adding another.” |
| B18 · [l7.html:139](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l7.html:139) / [book-fire.html:190](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-fire.html:190) | An index is “paid for … once, rather than in correctness, forever.” | “Indexes use storage and add work to writes, but the database keeps them in sync for you.” Or remove this repeated paragraph; the cost is already explained earlier. |
| B19 · [l7.html:144](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l7.html:144) / [book-fire.html:200](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-fire.html:200) | “A cache that was removed because it could not be kept correct” | “When keeping a cache up to date costs too much.” This matches the following explanation about overhead. |
| B20 · [l8.html:183](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l8.html:183) / [book-spirit.html:322](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-spirit.html:322) | “The cache going down is survivable … the app is slower but alive.” | “If the cache is unavailable, the app can fall back to the database, as long as the database can handle the extra load.” |
| B21 · [l9.html:377](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l9.html:377) / [book-spirit.html:1265](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-spirit.html:1265) | “The cache is stepped around, not written to” | “Write to the database, then remove any cached copy.” |
| B22 · [l10.html:226](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l10.html:226) / [book-spirit.html:1577](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-spirit.html:1577) | “LRU is the sensible default and what you should choose absent a reason.” | “Recently used items are often used again soon. That makes LRU a useful starting point.” |
| B23 · [l13.html:104](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l13.html:104) / [book-war.html:382](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-war.html:382) | “A global number can only tell you that everything is fine — which is the one thing you did not need to know.” | “Measure hit ratio by key prefix as well as overall. The breakdown shows which data benefits from caching and which misses are still expensive.” |
| B24 · [l14.html:107](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l14.html:107) / [book-war.html:567](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-war.html:567) | “Here is requirement-complete coverage of one element … as a model for the shape expected. Do the other six yourself.” | “Here is a worked example for the price, covering each requirement. Use the same structure for the other six parts.” |
| B25 · [l14.html:92](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l14.html:92) / [book-war.html:548](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-war.html:548) | “This is assembly, not invention — and if it feels like assembly, the course worked.” | “Bring together the techniques from the earlier lessons to design one complete caching strategy.” |
| B26 · [js/lesson-card.js:39](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/js/lesson-card.js:39) | “This lesson changes dimension: it decides how a read reaches, fills and refreshes those copies.” | “Now choose how reads use, fill, and refresh those caches.” |
| B27 · [js/lesson-card.js:55](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/js/lesson-card.js:55) | “use the linked lesson previews whenever a defense feels distant” | “follow the lesson links if you need a refresher” |
| B28 · [techniques.html:102](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/techniques.html:102) | “Use the database's existing heat before adding another cache.” | “Use the database's built-in caches before adding another layer.” |
| B29 · [techniques.html:126](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/techniques.html:126) | “Instrument the cache and remove what earns no place.” | “Measure how the cache performs, and remove it if it no longer helps.” |
| B30 · [js/journey-map.js:12](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/js/journey-map.js:12) | “Buffers, plans and indexes are caches the database already maintains.” | “Databases reuse data pages and query plans. Indexes also help reduce query work.” |

The style rule behind these edits: prefer concrete verbs and short explanations. Use words such as “never,” “always,” “free,” and “instant” only where the stated conditions support them. Keep emphasis where it helps the learner; reduce passages that sound scolding, sales-like, or focused on the author's teaching method.

**C. Theme, readability, and shared labels**

**C1. Preserve the theme, but pair invented names with plain meanings.**

Keep Air/Browser, Water/CDN, Earth/Application, Fire/Database, the technique names, and short Forge/Storefront scenes. The colours and illustrations make those groupings recognizable in the running site. In reference pages and summaries, put the practical meaning immediately beside the fantasy name. B28–B29 show the intended balance.

**C2. Make the learning map describe course position accurately.**

Locations: [js/journey-map.js:63](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/js/journey-map.js:63), [js/journey-map.js:92](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/js/journey-map.js:92), [js/journey-map.js:128](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/js/journey-map.js:128), [js/journey-map.js:138](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/js/journey-map.js:138).

Browser observation: opening Lesson 14 directly marks earlier lessons “Learned earlier” and shows completed-stage check marks, even though those lessons were skipped. This is inferred from the current lesson number.

Proposed labels: “Earlier lesson,” “Current lesson,” “Later lesson,” and “Open Lesson …”. Use completion marks only if actual completion is tracked. Suggested title: “The learning map.” Suggested introduction: “Select a lesson to see its main ideas and how it connects to the rest of the course.” Use “What this lesson covers” and “Why it matters” in the detail panel.

**C3. Make upcoming lessons readable and visibly available.**

Location: [css/styles.css:1512](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/css/styles.css:1512), [css/styles.css:1516](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/css/styles.css:1516).

Browser observation: the light-theme learning map makes later lesson cards very faint. The stylesheet applies 46% opacity to the whole card, including small supporting text, although the cards remain interactive.

Proposed: keep text at full opacity, enlarge supporting/status text, and use the border or a “Later lesson” label to indicate position. This is a visual readability recommendation, not a formal accessibility-conformance finding.

**C4. Reduce the repeated introduction on individual lesson pages.**

Example: [l1.html:96](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l1.html:96), [l1.html:102](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l1.html:102).

Browser observation: the standalone lesson starts with a book banner, repeats the lesson title in that banner, then shows a second large lesson banner, a technique panel, and an overview before the explanation begins. On Lesson 1, “The Forgotten Art” appears repeatedly.

Proposed: keep one illustrated lesson title, make the book/realm a small label above it, and retain a compact technique summary and lesson outline. The grouped book pages can keep their book introductions. This should make the reading flow lighter while preserving the artwork.

**C5. Correct and simplify the technique index.**

Locations: [techniques.html:50](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/techniques.html:50), [techniques.html:75](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/techniques.html:75), [techniques.html:134](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/techniques.html:134).

Current: “Fourteen techniques, one line each.” Lesson 12 explicitly introduces no new technique.

Proposed: “A quick reference to all fourteen lessons. Find a concept and return to the lesson that explains it.”

The running page also displays “Book Five · War” under the brand and “Previous — Interlude · Spirit” in the footer. Use “Course reference” under the brand, and a clear “Back to lessons” link in the footer. This page covers the whole course.

**C6. Use consistent, approachable utility labels.**

| Location | Current | Proposed |
|---|---|---|
| [js/lesson-card.js:151](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/js/lesson-card.js:151) | “Where this sits” | “How this lesson fits” |
| [js/lesson-card.js:155](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/js/lesson-card.js:155) | “Carries into” | “Used in” |
| [js/lesson-card.js:167](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/js/lesson-card.js:167) | “What you carry forward” | “Key takeaways” |
| [course.html:1067](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/course.html:1067), [book-air.html:935](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-air.html:935), [book-water.html:635](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-water.html:635), [book-earth.html:201](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/book-earth.html:201) and matching lesson callouts | “The misconception to kill” | “Common misconception” |
| [js/journey-map.js:16](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/js/journey-map.js:16) | “Keep every copy truthful” / “Stops stale data across layers” | “Keep copies up to date” / “Limits stale data across layers” |
| [index.html:151](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/index.html:151), [index.html:158](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/index.html:158) | “On the reader's own disk” / “A few miles from the reader” | “On the user's device” / “At a nearby CDN location” |
| [index.html:109](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/index.html:109) | “One request / 900 ms” in the decorative diagram | “Example uncached request / 900 ms” |

Use “user” when describing system behaviour and “you” when addressing the learner. Choose one spelling convention: the current UI mixes “Recognize” with “Recognise.” Keep the distinction between the homepage's lesson list and the interactive learning map clear in their link labels.

**C7. Give the homepage diagram's centre label enough room.**

Location: [css/home.css:180](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/css/home.css:180).

The three-line “Example uncached request” label was cramped inside an 84px circle and looked off-centre. The circle is now 104px on larger screens and 96px on smaller screens, with padding, centred text, and a consistent line height. Applied 15 September 2026.

**D. Supporting cleanup after wording decisions**

- Metadata: [techniques.html:8](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/techniques.html:8) through its metadata block still describe Lesson 14 and use its canonical URL. Set the description to “A quick reference to the caching concepts covered in all fourteen lessons,” and use the index's own URL and title.
- Social images: [l1.html:14](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l1.html:14), [l14.html:14](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/l14.html:14), [techniques.html:15](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/techniques.html:15) and other lesson/book metadata refer to `public/og.png`; the local project contains `public/og.webp`. Update those references and verify the dimensions. This was a local asset check, not a test of deployed social previews.
- README: [README.md:23](C:/a/Arena/Learnings/SystemDesigns/HLD/the-last-cachebender/README.md:23) lists the grouped book pages but omits the main individual lesson routes and technique index. Add them and update the social-image filename.
- Duplicate content: the individual lesson files and the grouped book files contain matching lesson copy. Apply any accepted edit to both versions. Shared JavaScript also supplies introductions, learning outcomes, and takeaways; those need to agree with the body text. Choosing a single source for future generation would reduce drift, but is a separate implementation decision.

**Review coverage and checks**

Ran the site with `python -m http.server 8000 --bind 127.0.0.1`. All 23 course HTML routes returned HTTP 200. A static check found no missing local `href`/`src` targets or static anchor targets in those pages. External links and deployed previews were outside that check.

Read the learner-facing content of Lessons 1–14, the Prologue and all grouped book pages, including their unique introductions and appendices. Reviewed the homepage, technique index, shared UI copy, relevant styles, and README. Browser checks covered the homepage, Lesson 1, Lesson 14, learning-map interactions, and the technique index in the default desktop viewport; both light and dark themes were inspected. This was not a full responsive, accessibility, performance, or architecture audit.

The learner-facing scope excludes design-export prototypes, image-generation folders, and internal planning documents. The technical references above were consulted only to settle specific contradictory explanations.

The remaining items are proposals for discussion. This report records the original findings as well as the implementation status above.
