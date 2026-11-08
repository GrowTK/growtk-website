/* GoHighLevel replicas for the deck.
   GHL.board(el, opts)  Opportunities board; drag a card to another stage.
                        opts.onMove({card, from, to}) fires after every move.
                        Returns { move(name, stageIndex) } for the auto-demo.
   GHL.convos(el)       Conversations inbox; returns { highlight(area) }. */
(function () {
  const $ = (h) => { const t = document.createElement("template"); t.innerHTML = h.trim(); return t.content.firstElementChild; };
  const P = {
    rocket: '<path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.8-.9.7-2.2-.1-3s-2-.9-2.9 0Z"/><path d="m12 15-3-3a22 22 0 0 1 2-4A13 13 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2Z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z"/>',
    cal: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    book: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/>',
    opp: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6h7M6 8.5v7M18 8.5v7M8.5 18h7"/>',
    pay: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>',
    auto: '<circle cx="12" cy="12" r="9"/><path d="M10 8l5 4-5 4z"/>',
    site: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 20V9"/>',
    mem: '<circle cx="12" cy="8" r="5"/><path d="M8.5 12.5 7 21l5-3 5 3-1.5-8.5"/>',
    img: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
    rep: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    app: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M17.5 14v7M14 17.5h7"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
    msg: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5Z"/><path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01"/>',
    tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1"/>',
    doc: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    task: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="m9 12 2 2 4-4"/>',
    appt: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M12 13v5M9.5 15.5h5"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
    down: '<path d="m6 9 6 6 6-6"/>', left: '<path d="m15 18-6-6 6-6"/>', list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    imp: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/>', plus: '<path d="M12 5v14M5 12h14"/>', filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5z"/>',
    sort: '<path d="M7 15l5 5 5-5M7 9l5-5 5 5"/>', inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13l3.5 7v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', play: '<path d="M8 5v14l11-7z"/>', trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>', ext: '<path d="M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
  };
  const I = (n, s = 16, w = 1.8) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${P[n]}</svg>`;
  const LOGO = '<svg width="38" height="34" viewBox="0 0 38 34"><path d="M6 34V12H1L8 2l7 10h-5v22z" fill="#FFBC00"/><path d="M17 34V16h-5l7-10 7 10h-5v18z" fill="#188BF6"/><path d="M28 34V10h-5l7-10 7 10h-5v24z" fill="#37CA37"/></svg>';

  function shell(active) {
    const nav = [["rocket", "Launchpad"], ["grid", "Dashboard"], ["chat", "Conversations"], ["cal", "Calendars"], ["book", "Contacts"], ["opp", "Opportunities"], ["pay", "Payments"], "hr",
      ["spark", "AI Agents"], ["send", "Marketing"], ["auto", "Automation"], ["site", "Sites"], ["mem", "Memberships"], ["img", "Media Storage"], ["star", "Reputation"], ["rep", "Reporting"], ["app", "App Marketplace"]];
    return `<aside class="g-side">
      <div class="g-logo">${LOGO}</div>
      <div class="g-loc"><span class="ic">${I("user", 13)}</span><div style="flex:1;min-width:0"><b>Ultra Modern Rails</b><small>WESTFIELD, MA</small></div>${I("sort", 13)}</div>
      <div class="g-search"><span>${I("search", 13)}Search<kbd>⌘K</kbd></span><i>⚡</i></div>
      <nav class="g-nav">${nav.map((n) => n === "hr" ? "<hr>" : `<a class="${n[1] === active ? "on" : ""}">${I(n[0], 16)}${n[1]}</a>`).join("")}</nav>
      <div class="g-set">${I("gear", 16)}Settings</div>
    </aside>`;
  }
  const me = `<div class="me"><span style="background:#16A34A">${I("phone", 14, 2)}</span><span style="background:#F97316">${I("bell", 14, 2)}<i style="position:absolute;top:1px;right:1px;width:7px;height:7px;border-radius:50%;background:#FDA29B;border:1.5px solid #fff"></i></span><span style="background:#5FB3A6">AM</span></div>`;

  /* ---------------- Opportunities ---------------- */
  const STAGES = [
    { n: "New Quote", c: "#F04438", total: 2, sum: 0 },
    { n: "Contacted", c: "#2E90FA", total: 41, sum: 4420.68 },
    { n: "Quote Sent", c: "#F79009", total: 72, sum: 121998.53 },
    { n: "Won", c: "#12B76A", total: 134, sum: 486210.4 },
  ];
  const CARDS = [
    ["Regency Construction & Remodeling", 0, "chat widget", null, "RR", 8640],
    ["Howard Moore", 0, "external_form", "$1,000-$5,000", "BD", 3120],
    ["Chrissy Ford", 1, "external_form", "$1,000-$5,000", "RR", 2480],
    ["Matthew Wolfe", 1, "chat widget", null, "ES", 4310],
    ["Alexis Rood", 1, "external_form", "$5,000-$10,000", "BD", 7265],
    ["Charles Riesenberg", 1, "external_form", "$1,000-$5,000", "RR", 1940],
    ["Greg Bauer", 2, "external_form", "$1,000-$5,000", "BD", 3477.42],
    ["Glen Dean", 2, "external_form", "$1,000-$5,000", "ES", 4210],
    ["Jake Morton", 2, "external_form", "$1,000-$5,000", "RR", 2895.5],
    ["Nidhi Rajshree", 2, "external_form", "$1,000-$5,000", "BD", 1678],
    ["Bruce A Willins", 3, "external_form", "$1,000-$5,000", "BD", 677.42],
    ["Rose Antony", 3, "chat widget", "$5,000-$10,000", "ES", 6120],
  ];
  const money = (v) => "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function board(root, opts = {}) {
    const stages = STAGES.map((s) => ({ ...s }));
    const cards = CARDS.map(([n, s, src, bud, own, val]) => ({ n, s, src, bud, own, val }));
    const el = $(`<div class="ghl" style="width:1280px;height:800px">${shell("Opportunities")}
      <div class="g-main">
        <div class="g-top"><h1>Opportunities</h1><a class="on">Opportunities</a><a>Forecast</a><a>Pipelines</a><a>Bulk Actions</a>${me}</div>
        <div class="g-bar"><div class="g-sel">Deals Pipeline ${I("down", 14)}</div><span class="g-pill">249 opportunities</span>
          <div class="rt"><div class="g-tog"><span class="on">${I("grid", 15)}</span><span>${I("list", 15)}</span></div><span class="g-btn">${I("imp", 14)}Import</span><span class="g-btn p">${I("plus", 14, 2.2)}Add opportunity</span><span style="color:#98A2B3">⋮</span></div></div>
        <div class="g-sub"><span class="on">${I("list", 14)}Open opportunities</span><span>${I("doc", 14)}New smart list</span><span>${I("plus", 13)}List</span></div>
        <div class="g-fil"><span class="f">${I("filter", 12)}Advanced filters (1)</span><span class="f">${I("sort", 12)}Sort (1)</span><span class="s">${I("search", 14)}Search opportunities</span><span class="m">${I("gear", 15)}Manage fields</span></div>
        <div class="g-board"></div>
      </div></div>`);
    root.appendChild(el);
    const bd = el.querySelector(".g-board"), main = el.querySelector(".g-main");
    const icons = `<div class="g-ico"><span>${I("phone", 14)}</span><span>${I("msg", 14)}</span><span>${I("tag", 14)}<sup>1</sup></span><span>${I("doc", 14)}</span><span>${I("task", 14)}<sup>1</sup></span><span>${I("appt", 14)}</span></div>`;
    const cardHtml = (c, i) => `<div class="g-card" data-i="${i}"><div class="t"><b>${c.n}</b><span class="g-av">${c.own}</span></div><dl><dt>Source:</dt><dd>${c.src}</dd>${c.bud ? `<dt>Budget Range:</dt><dd>${c.bud}</dd>` : ""}</dl>${icons}</div>`;
    function draw(fresh) {
      bd.innerHTML = stages.map((s, k) => `<section class="g-col" data-s="${k}"><div class="g-ch" style="--c:${s.c}"><b>${s.n}<em>‹</em></b><small>${s.total} opportunities<strong>${money(s.sum)}</strong></small></div><div class="g-cards">${cards.map((c, i) => c.s === k ? cardHtml(c, i) : "").join("")}</div></section>`).join("");
      if (fresh != null) bd.querySelector(`.g-card[data-i="${fresh}"]`)?.classList.add("new");
      bd.querySelectorAll(".g-card").forEach((c) => c.addEventListener("pointerdown", startDrag));
    }
    function toast(h) { main.querySelector(".g-toast")?.remove(); const t = $(`<div class="g-toast">${h}</div>`); main.appendChild(t); setTimeout(() => t.remove(), 2600); }
    function commit(i, to) {
      const c = cards[i], from = c.s; if (from === to) return draw();
      stages[from].total--; stages[from].sum = Math.max(0, stages[from].sum - (from ? c.val : 0));
      stages[to].total++; if (to) stages[to].sum += c.val;
      c.s = to; cards.push(cards.splice(i, 1)[0]); // moved card goes to the top of its new column
      cards.unshift(cards.pop());
      draw(0);
      toast(`<b>Opportunity moved</b>${c.n} → ${stages[to].n}`);
      opts.onMove && opts.onMove({ card: { ...c, value: money(c.val) }, from: stages[from].n, to: stages[to].n, toIndex: to });
    }
    // drag inside a scaled container: convert client coords to local coords
    const scale = () => el.getBoundingClientRect().width / el.offsetWidth || 1;
    const local = (x, y) => { const r = el.getBoundingClientRect(), s = scale(); return [(x - r.left) / s, (y - r.top) / s]; };
    let drag = null;
    function startDrag(e) {
      if (e.button !== 0) return;
      const card = e.currentTarget; const [x, y] = local(e.clientX, e.clientY); const cr = card.getBoundingClientRect(), s = scale();
      drag = { card, i: +card.dataset.i, sx: x, sy: y, ox: (e.clientX - cr.left) / s, oy: (e.clientY - cr.top) / s, w: cr.width / s, live: false };
      card.setPointerCapture(e.pointerId);
      card.addEventListener("pointermove", onMove); card.addEventListener("pointerup", onUp, { once: true }); card.addEventListener("pointercancel", onUp, { once: true });
    }
    function colAt(cx, cy) { const hit = document.elementFromPoint(cx, cy); return hit?.closest?.(".g-col"); }
    function onMove(e) {
      const [x, y] = local(e.clientX, e.clientY);
      if (!drag.live) { if (Math.hypot(x - drag.sx, y - drag.sy) < 5) return; drag.live = true; drag.ghost = drag.card.cloneNode(true); drag.ghost.classList.add("g-ghost"); drag.ghost.style.width = drag.w + "px"; el.appendChild(drag.ghost); drag.card.classList.add("lift"); }
      drag.ghost.style.left = x - drag.ox + "px"; drag.ghost.style.top = y - drag.oy + "px";
      bd.querySelectorAll(".g-col").forEach((c) => c.classList.remove("over"));
      colAt(e.clientX, e.clientY)?.classList.add("over");
    }
    function onUp(e) {
      const d = drag; drag = null; d.card.removeEventListener("pointermove", onMove);
      if (!d.live) return;
      const col = colAt(e.clientX, e.clientY); d.ghost.remove(); bd.querySelectorAll(".g-col").forEach((c) => c.classList.remove("over"));
      if (col) commit(d.i, +col.dataset.s); else draw();
    }
    // animated move for the auto-demo
    async function move(name, to) {
      const i = cards.findIndex((c) => c.n === name); if (i < 0 || cards[i].s === to) return;
      const card = bd.querySelector(`.g-card[data-i="${i}"]`), col = bd.querySelector(`.g-col[data-s="${to}"] .g-cards`);
      const s = scale(), er = el.getBoundingClientRect(), cr = card.getBoundingClientRect(), tr = col.getBoundingClientRect();
      const g = card.cloneNode(true); g.classList.add("g-ghost"); g.style.width = cr.width / s + "px";
      const x0 = (cr.left - er.left) / s, y0 = (cr.top - er.top) / s, x1 = (tr.left - er.left) / s, y1 = (tr.top - er.top) / s;
      g.style.left = x0 + "px"; g.style.top = y0 + "px"; el.appendChild(g); card.classList.add("lift");
      bd.querySelector(`.g-col[data-s="${to}"]`).classList.add("over");
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches, dur = reduced ? 1 : 950, t0 = performance.now();
      await new Promise((res) => { const f = (t) => { const q = Math.min(1, (t - t0) / dur), e = q < .5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2; g.style.left = x0 + (x1 - x0) * e + "px"; g.style.top = y0 + (y1 - y0) * e - Math.sin(Math.PI * e) * 40 + "px"; q < 1 ? requestAnimationFrame(f) : res(); }; requestAnimationFrame(f); });
      g.remove(); bd.querySelector(`.g-col[data-s="${to}"]`)?.classList.remove("over");
      commit(i, to);
    }
    draw();
    return { el, move, stages: () => stages.map((s) => s.n), cardsIn: (k) => cards.filter((c) => c.s === k).map((c) => c.n) };
  }

  /* ---------------- Conversations ---------------- */
  const THREADS = [
    { n: "Daniel Brooks", ini: "DB", t: "7:02 AM", last: "I'll let you know", own: "Ryan Rhodes", oi: "RR", em: "daniel.b@example.com", ph: "(301) 555-0148",
      body: (r) => `<div class="cv-in">I definitely want the pricing on stainless, not black.</div><div class="cv-meta" style="align-self:flex-start">06:55 AM</div>
        <div class="cv-eml" data-area="email"><div class="h">Ball Park Quote / 3D Rendering ${I("ext", 13)}</div><div class="bd"><span class="cv-rav">${r}</span><div style="min-width:0"><b>Ryan Rhodes</b><p>Here you go, Daniel! This pricing is for the complete system in 316 marine-grade stainless steel…</p></div><time>06:05 PM</time></div></div>
        <div class="cv-day">${I("cal", 12)} Sep 24</div>
        <div class="cv-call" data-area="call"><b style="display:flex;gap:6px;align-items:center;color:#039855">${I("phone", 13)} Call completed</b><div class="w"><span class="pl">${I("play", 12, 2)}</span>ılıılıılıılıılı 0:00 / 1:06</div></div><div class="cv-meta">09:11 PM</div>
        <div class="cv-out" data-area="follow">Hey Daniel, just checking that you didn't run into any questions with the final order or payment link for your railing system. If you need me to change anything before placing the order, just let me know. · Ryan</div><div class="cv-meta">10:49 PM</div>
        <div class="cv-day">${I("cal", 12)} Yesterday</div>
        <div class="cv-eml"><div class="h">Anything we need to change? ${I("ext", 13)}</div><div class="bd"><span class="cv-rav">${r}</span><div style="min-width:0"><b>Ryan Rhodes</b><p>Hi Daniel, I wanted to check back on the final railing project we put together for you. If everything…</p></div><time>10:49 PM</time></div></div>` },
    { n: "Graham Lowe", ini: "GL", t: "5:37 AM", last: "I did not, Ryan. They never r…", own: "Ryan Rhodes", oi: "RR", em: "graham.l@example.com", ph: "(207) 555-0199",
      body: (r) => `<div class="cv-out">Hi Graham, did the replacement tensioners arrive yesterday? · Ryan</div><div class="cv-meta">Yesterday 4:12 PM</div>
        <div class="cv-in">I did not, Ryan. They never reached me, tracking still says in transit.</div>
        <div class="cv-call" data-area="call"><b style="display:flex;gap:6px;align-items:center;color:#039855">${I("phone", 13)} Call completed</b><div class="w"><span class="pl">${I("play", 12, 2)}</span>ılıılıılıılı 0:00 / 2:14</div></div><div class="cv-meta">05:20 AM</div>
        <div class="cv-out" data-area="follow">Sorry about that, Graham. I've reshipped them overnight and sent the tracking number to your email. · Ryan</div><div class="cv-meta">05:37 AM</div>` },
    { n: "Andrea", ini: "AN", t: "5:35 AM", last: "I want a price", own: "Ethan Soto", oi: "ES", em: "andrea.m@example.com", ph: "(413) 555-0147",
      body: (r) => `<div class="cv-in">I want a price</div><div class="cv-meta" style="align-self:flex-start">05:31 AM</div>
        <div class="cv-out" data-area="follow">Hi Andrea, this is Ethan with Ultra Modern Rails. Happy to help! Could you send a photo of the area and rough measurements? · Ethan</div><div class="cv-meta">05:35 AM</div>` },
    { n: "Adam Bennett", ini: "AB", t: "5:18 AM", last: "I want to know more" }, { n: "Jordan Gale", ini: "JG", t: "4:57 AM", last: "I want to know more" }, { n: "Derek Grant", ini: "DG", t: "4:18 AM", last: "I live in Glendale, California" },
  ];
  function convos(root) {
    const el = $(`<div class="ghl" style="width:1200px;height:900px">${shell("Conversations")}
      <div class="g-main"><div class="g-top cv-top"><h1>Conversations</h1><a class="on">Conversations</a><a>Manual Actions</a><a>Snippets</a><a>Trigger Links</a><a>Analytics</a>${me}</div>
      <div class="cv"><div class="cv-rail"><span class="on">${I("inbox", 16)}</span><span>${I("search", 16)}</span><span>${I("user", 16)}</span><span>${I("tag", 16)}</span></div>
        <div class="cv-list" data-area="inbox"><div class="cv-lh">Team inbox <span style="display:flex;gap:10px;color:#667085">${I("filter", 15)}${I("sort", 15)}</span></div>
          <div class="cv-tabs"><span class="on">${I("mail", 15)}Unread<sup>26</sup></span><span>${I("inbox", 15)}All</span><span>${I("clock", 15)}Recent</span><span>${I("star", 15)}Starred</span></div>
          <div class="cv-sel"><span style="width:14px;height:14px;border:1.5px solid #D0D5DD;border-radius:3px"></span>Select all</div><div class="cv-items"></div></div>
        <div class="cv-th"></div><div class="cv-ct" data-area="owner"></div></div></div></div>`);
    root.appendChild(el);
    const items = el.querySelector(".cv-items"), th = el.querySelector(".cv-th"), ct = el.querySelector(".cv-ct");
    let cur = 0;
    function draw() {
      items.innerHTML = THREADS.map((t, k) => `<div class="cv-item ${k === cur ? "on" : ""}" data-k="${k}"><span class="ck"></span><span class="cv-av">${t.ini}</span><div class="b"><div class="r1"><b>${t.n}</b><small>${t.t}<em>1</em></small></div><p>${t.last}</p></div></div>`).join("");
      items.querySelectorAll(".cv-item").forEach((x) => x.onclick = () => { const k = +x.dataset.k; if (THREADS[k].body) { cur = k; draw(); } });
      const t = THREADS[cur];
      th.innerHTML = `<div class="cv-thh"><span class="cv-av">${t.ini}</span>${t.n}<span class="ic">${I("phone", 17)}${I("star", 17)}${I("mail", 17)}${I("trash", 17)}</span></div><div class="cv-msgs">${t.body(t.oi)}</div><div class="cv-cmp"><span>Type a message…</span><i>Send</i></div>`;
      ct.innerHTML = `<h4>Contact Details <span style="color:#98A2B3">✕</span></h4><div class="cv-card"><div class="who"><span class="cv-av">${t.ini}</span>${t.n}</div><div class="lbl">Owner</div><span class="own"><i>${t.oi}</i>${t.own} ✕</span><div class="lbl">Tags ⊕</div></div>
        <div class="tabs"><span class="on">All fields</span><span>DND</span><span>Actions</span></div>
        <dl><dt>First name</dt><dd>${t.n.split(" ")[0]}</dd><dt>Last name</dt><dd>${t.n.split(" ")[1] || "Not given"}</dd><dt>Email</dt><dd>${t.em}</dd><dt>Phone</dt><dd>🇺🇸 ${t.ph}</dd></dl>`;
    }
    draw();
    return {
      el,
      highlight(area) { el.querySelectorAll(".g-hl").forEach((x) => x.classList.remove("g-hl")); if (area) el.querySelector(`[data-area="${area}"]`)?.classList.add("g-hl"); },
      open(k) { cur = k; draw(); },
    };
  }

  window.GHL = { board, convos, icon: I };
})();
