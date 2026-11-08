/* Live replicas of the UMR widget and dashboard, shared by the deck and the landing page.
   UMR.fit(el)            scale a fixed-size child to the element's width (or height with data-by="h")
   UMR.widget(el, opts)   mount the chat widget; opts.onSubmit(lead) fires when a case is confirmed
   UMR.dash(el, opts)     mount the business dashboard; opts.screen picks the first screen */
(function () {
  const $ = (h) => { const t = document.createElement("template"); t.innerHTML = h.trim(); return t.content.firstElementChild; };
  const ic = {
    quote: '<path d="M9 7h6M9 11h6M9 15h3"/><rect x="4" y="3" width="16" height="18" rx="2"/>',
    box: '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/>',
    rep: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="2" y="14" width="5" height="6" rx="2"/><rect x="17" y="14" width="5" height="6" rx="2"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z"/>',
    send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
    back: '<path d="M15 18l-6-6 6-6"/>', x: '<path d="M18 6L6 18M6 6l12 12"/>',
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    ticket: '<path d="M3 8V6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a2 2 0 0 0 0 4v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a2 2 0 0 0 0-4z"/>',
    file: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/>',
    widget: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 15h8"/>',
    up: '<path d="M18 15l-6-6-6 6"/>', down: '<path d="M6 9l6 6 6-6"/>', trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>',
    check: '<path d="M20 6L9 17l-5-5"/>', pin: '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  };
  const I = (n, s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ic[n]}</svg>`;
  const asset = (p) => (window.UMR_ASSETS || "assets/") + p;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));

  /* ---------- fit ---------- */
  const fits = new Set();
  function fit(el) {
    const inner = el.firstElementChild; inner.classList.add("fit-in");
    const w = +el.dataset.w, h = +el.dataset.h;
    const run = () => {
      if (el.dataset.by === "contain") { // fill a box of fixed size, centred
        const s = Math.min(el.clientWidth / w, el.clientHeight / h, +(el.dataset.max || 9));
        inner.style.transform = `translate(${(el.clientWidth - w * s) / 2}px,${(el.clientHeight - h * s) / 2}px) scale(${s})`;
        return;
      }
      let s = el.dataset.by === "h" ? el.clientHeight / h : el.clientWidth / w;
      if (el.dataset.max) s = Math.min(s, +el.dataset.max);
      inner.style.transform = `scale(${s})`;
      if (el.dataset.by !== "h") el.style.height = h * s + "px"; else el.style.width = w * s + "px";
    };
    inner.style.width = w + "px"; inner.style.height = h + "px";
    run(); new ResizeObserver(run).observe(el.dataset.by ? el : el.parentElement || el); fits.add(run);
    return run;
  }
  addEventListener("resize", () => fits.forEach((f) => f()));

  /* ---------- shared rep rotation (Talk to a Rep round robin) ---------- */
  const reps = [
    { n: "Ryan Rhodes", e: "ryan@example.com", on: true },
    { n: "Ethan Soto", e: "ethan@example.com", on: true },
    { n: "Blake Dunn", e: "blake@example.com", on: true },
  ];
  let rrIdx = 1;
  const nextRep = () => { const act = reps.filter((r) => r.on); if (!act.length) return null; const r = act[rrIdx % act.length]; rrIdx++; return r; };
  const initials = (n) => n.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  let ticketNo = 1043;

  /* ---------- widget ---------- */
  function widget(root, opts = {}) {
    const el = $(`<div class="uw ${opts.open === false ? "closed" : ""}">
      <div class="uw-panel" role="dialog" aria-label="Ultra Modern Rails chat">
        <div class="uw-head">
          <button class="uw-back" aria-label="Back" hidden>${I("back")}</button>
          <div class="uw-av"><img src="${asset("rails.webp")}" alt=""></div>
          <div><b>Ultra Modern Rails</b><small>Typically replies in a few minutes</small></div>
          <button class="uw-x" aria-label="Close chat">${I("x")}</button>
        </div>
        <div class="uw-body" aria-live="polite"></div>
        <form class="uw-comp"><input placeholder="Type a message…" aria-label="Message"><button class="uw-send" aria-label="Send">${I("send", 16)}</button></form>
      </div>
      <div class="uw-nudge">Have a question? We're here to help.</div>
      <button class="uw-launch" aria-label="Open chat">${I("chat", 26)}<span class="uw-badge">1</span></button>
    </div>`);
    root.appendChild(el);
    const body = el.querySelector(".uw-body"), back = el.querySelector(".uw-back");
    let run = 0; // cancels stale flows when the visitor navigates
    const add = (h) => { const n = $(h); body.appendChild(n); body.scrollTop = body.scrollHeight; return n; };
    const bot = async (t, my) => { const ty = add('<div class="uw-typing"><span></span><span></span><span></span></div>'); await wait(650); ty.remove(); if (my !== run) return false; add(`<div class="uw-msg bot">${t}</div>`); return true; };
    const me = (t) => add(`<div class="uw-msg me">${t}</div>`);
    const chips = (q, list) => new Promise((res) => {
      if (q) add(`<div class="uw-q">${q}</div>`);
      const c = add(`<div class="uw-chips">${list.map((x) => `<button class="uw-chip">${x}</button>`).join("")}</div>`);
      c.querySelectorAll("button").forEach((b) => b.onclick = () => { c.remove(); me(b.textContent); res(b.textContent); });
    });
    const cats = [
      ["quote", "Custom Quote", "Get a detailed quote for a new project"],
      ["box", "Existing Order", "Track, update, or ask about an order"],
      ["help", "Support", "Installation help or a general question"],
      ["rep", "Talk to a Rep", "Have someone reach out directly"],
    ];
    function home() {
      run++; back.hidden = true; body.innerHTML = "";
      add(`<div><div class="uw-hi">Hi there! 👋</div></div>`);
      add(`<div class="uw-sub">How can we help you today? Pick an option to get started.</div>`);
      cats.forEach(([i, t, d]) => { const b = add(`<button class="uw-cat"><i>${I(i)}</i><div><b>${t}</b><span>${d}</span></div></button>`); b.onclick = () => flow(t); });
    }
    async function confirmCard(kind, rows, my) {
      const card = add(`<div class="uw-card"><h5>Review Your Case <span class="uw-pill">${kind}</span></h5><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl><button class="uw-btn">Confirm &amp; Submit</button></div>`);
      add(`<div class="uw-q">Or just reply "yes" below to confirm.</div>`);
      await new Promise((r) => { card.querySelector("button").onclick = r; el._yes = r; });
      el._yes = null; if (my !== run) return;
      card.querySelector("button").remove(); me("Confirm & Submit");
      const rep = nextRep(); const id = "UMR-" + ticketNo++;
      await wait(500); if (my !== run) return;
      add(`<div class="uw-card"><h5><span class="uw-ok">✓</span> Case Opened</h5><dl><dt>Ticket</dt><dd><b>${id}</b></dd><dt>Assigned to</dt><dd>${rep ? rep.n : "Your team"}</dd></dl></div>`);
      opts.onSubmit && opts.onSubmit({ id, kind, rep, rows });
    }
    async function flow(t) {
      const my = ++run; back.hidden = false; body.innerHTML = ""; me(t);
      if (t === "Custom Quote") {
        if (!(await bot("Let's get your free quote started. A few quick questions about the project.", my))) return;
        const who = await chips("I am a:", ["Homeowner", "General Contractor", "Architect or Designer", "Property Manager"]);
        const on = await chips("Rail System will be Installed on:", ["Deck", "Concrete", "Composite Decking", "Fascia-Mounted"]);
        const bud = await chips("My Budget", ["$5,000 to $10,000", "$10,000 to $25,000", "$25,000+"]);
        if (my !== run) return;
        if (!(await bot("Got it. You can add a photo of your project area or a drawing with measurements anytime.", my))) return;
        await confirmCard("Custom Quote", [["I am a", who], ["Installed on", on], ["Budget", bud]], my);
      } else if (t === "Existing Order") {
        if (!(await bot("Tell us about your order. What's the order number?", my))) return;
        const o = await chips("", ["Order #1623", "I don't have it handy"]);
        if (!(await bot("Thanks. What do you need help with?", my))) return;
        const w = await chips("", ["Delivery status", "Change finish to stainless", "Add hardware"]);
        await confirmCard("Existing Order", [["Order", o.replace("Order ", "")], ["Request", w]], my);
      } else if (t === "Support") {
        if (!(await bot("Tell us what's going on. Describe the issue, e.g. missing parts, damage, order status…", my))) return;
        const w = await chips("", ["Missing parts", "Cable tension help", "Damaged in shipping"]);
        await confirmCard("Support", [["Issue", w], ["Photos", "Add from the composer"]], my);
      } else {
        const rep = nextRep();
        if (!(await bot("Connected. We'll hand this to a person on our team.", my))) return;
        add(`<div class="uw-card"><h5><span class="uw-ok">✓</span> ${rep ? rep.n : "A rep"} will reach out directly</h5><div style="font-size:12.5px;color:#6B7280">Reps take requests in turn, so you get the next person free.</div></div>`);
        opts.onSubmit && opts.onSubmit({ id: "REP", kind: "Talk to a Rep", rep, rows: [] });
      }
    }
    back.onclick = home;
    el.querySelector(".uw-x").onclick = () => el.classList.add("closed");
    el.querySelector(".uw-launch").onclick = () => { el.classList.toggle("closed"); el.querySelector(".uw-badge").remove?.(); };
    el.querySelector("form").onsubmit = async (e) => {
      e.preventDefault(); const inp = e.target.querySelector("input"); const v = inp.value.trim(); if (!v) return; inp.value = "";
      if (/^y(es)?$/i.test(v) && el._yes) { el._yes(); return; }
      back.hidden = false; const my = ++run; if (body.querySelector(".uw-cat")) body.innerHTML = "";
      me(v.replace(/</g, "&lt;"));
      await bot("Thanks! I can help with quotes, orders and support, or pass you to a rep. Pick one of the options to get started.", my);
    };
    home();
    return { el, home, flow };
  }

  /* ---------- dashboard ---------- */
  const T = [
    ["UMR-1042", "John Reeves", "Custom Quote", "open", "Bronze metal posts, 36\" stairs and 42\" horizontal segments on concrete.", "Los Angeles, California, US", "America/Los_Angeles", "john.r@example.com", "+1 323 555 0161"],
    ["UMR-1041", "Daniel Brooks", "Existing Order", "progress", "Wants pricing on stainless, not black, for order #1623.", "Glendale, California, US", "America/Los_Angeles", "daniel.b@example.com", "(301) 555-0148"],
    ["UMR-1040", "Andrea Moss", "Custom Quote", "open", "I want a price for a glass rail on a composite deck.", "Westfield, Massachusetts, US", "America/New_York", "andrea.m@example.com", "(413) 555-0147"],
    ["UMR-1039", "Graham Lowe", "Support", "closed", "Question about re-tensioning cables after the first season.", "Portland, Maine, US", "America/New_York", "graham.l@example.com", "(207) 555-0199"],
    ["UMR-1038", "Adam Bennett", "Custom Quote", "progress", "Commercial rooftop, roughly 140 linear feet, fascia-mounted.", "Austin, Texas, US", "America/Chicago", "andrew.b@example.com", "(512) 555-0110"],
    ["UMR-1037", "Jordan Gale", "Talk to a Rep", "open", "Wants to talk through post spacing with someone.", "Denver, Colorado, US", "America/Denver", "jordan.g@example.com", "(720) 555-0102"],
  ];
  const ST = { open: "Open", progress: "In progress", closed: "Closed" };

  function dash(root, opts = {}) {
    const tickets = T.map((t) => ({ id: t[0], n: t[1], c: t[2], s: t[3], d: t[4], loc: t[5], tz: t[6], em: t[7], ph: t[8] }));
    const el = $(`<div class="ud">
      <nav class="ud-nav" aria-label="Dashboard">
        <div class="ud-org"><i>${I("chat", 17)}</i><div><b>Ultra Modern Rails</b><small>Business dashboard</small></div></div>
        ${[["overview", "home", "Overview"], ["sessions", "list", "Sessions"], ["tickets", "ticket", "Tickets"], ["quotes", "file", "Quotes"], ["widget", "widget", "Widget"]].map(([k, i, l]) => `<button data-k="${k}">${I(i)}${l}</button>`).join("")}
        <div class="foot"><span>AM</span>Anique M.</div>
      </nav>
      <main class="ud-main"></main>
      <div class="ud-bulk"><span class="n"></span><span style="opacity:.6;margin:0 4px">Set status:</span><button data-s="open">Open</button><button data-s="progress">In progress</button><button data-s="closed">Closed</button></div>
      <div class="ud-shade"></div><aside class="ud-sheet" aria-label="Details"></aside>
    </div>`);
    root.appendChild(el);
    const main = el.querySelector(".ud-main"), sheet = el.querySelector(".ud-sheet"), shade = el.querySelector(".ud-shade"), bulk = el.querySelector(".ud-bulk");
    const sel = new Set();
    const toast = (t) => { el.querySelector(".ud-toast")?.remove(); const n = $(`<div class="ud-toast"><span class="uw-ok">✓</span>${t}</div>`); el.appendChild(n); setTimeout(() => n.remove(), 2200); };
    const close = () => { sheet.classList.remove("on"); shade.classList.remove("on"); };
    shade.onclick = close;
    const loc = (t) => `<dt>Location</dt><dd>${I("pin", 14)} ${t.loc}</dd><dt>Timezone</dt><dd>${t.tz}</dd>`;

    function openTicket(t, tab = "Ticket") {
      const tabs = ["Client", "Ticket", "Chat", "Images"];
      const render = (tb) => {
        sheet.innerHTML = `<div class="ud-sh-h"><div style="display:flex;justify-content:space-between;align-items:start"><div><span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#6e6e73">${t.id}</span><div class="ud-h" style="font-size:21px;margin-top:4px">${t.n}</div><div class="ud-sub">${t.c}</div></div><button class="ud-ib cl" aria-label="Close">${I("x")}</button></div></div>
          <div class="ud-tabs">${tabs.map((x) => `<button class="${x === tb ? "on" : ""}">${x}</button>`).join("")}</div>
          <div class="ud-sh-b">${{
            Client: `<dl class="ud-dl"><dt>Name</dt><dd>${t.n}</dd><dt>Email</dt><dd>${t.em}</dd><dt>Phone</dt><dd>${t.ph}</dd>${loc(t)}</dl>`,
            Ticket: `<div style="margin-bottom:16px;font-size:12.5px;color:#6e6e73">Change status</div><div style="display:flex;gap:6px;margin:-8px 0 18px">${Object.keys(ST).map((s) => `<button class="ud-st ${s}" data-s="${s}" style="${t.s === s ? "" : "opacity:.45"}">${ST[s]}</button>`).join("")}</div>
              <dl class="ud-dl"><dt>Ticket #</dt><dd>${t.id}</dd><dt>Category</dt><dd>${t.c}</dd><dt>Order #</dt><dd>${t.c === "Existing Order" ? "1623" : "None"}</dd><dt>Created</dt><dd>Today, 9:32 AM</dd><dt>Summary</dt><dd>${t.d}</dd></dl>`,
            Chat: `<div style="display:flex;flex-direction:column;gap:8px;font-family:Inter;font-size:13px"><div class="uw-msg me" style="background:#C25B41">${t.c}</div><div class="uw-msg bot">Happy to help. Can you tell me a bit about the project?</div><div class="uw-msg me" style="background:#C25B41">${t.d}</div><div class="uw-msg bot">Thanks, ${t.n.split(" ")[0]}. I've opened a case and a rep will follow up.</div></div>`,
            Images: t.c === "Custom Quote" ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div style="aspect-ratio:1;border-radius:10px;background:linear-gradient(160deg,#9ec5e0,#e9d8c4 60%,#b49779)"></div><div style="aspect-ratio:1;border-radius:10px;background:repeating-linear-gradient(0deg,#fff 0 13px,#dcdcdc 13px 14px),#fff;border:1px solid #eee"></div></div>` : `<p style="color:#6e6e73">No photos attached to this case.</p>`,
          }[tb]}</div>`;
        sheet.querySelector(".cl").onclick = close;
        sheet.querySelectorAll(".ud-tabs button").forEach((b) => b.onclick = () => render(b.textContent));
        sheet.querySelectorAll("[data-s]").forEach((b) => b.onclick = () => { t.s = b.dataset.s; toast("Ticket status updated."); render("Ticket"); if (cur === "tickets") screens.tickets(); });
      };
      render(tab); sheet.classList.add("on"); shade.classList.add("on");
    }

    let cur;
    const head = (h, s, right = "") => `<div class="ud-row" style="align-items:end"><div><div class="ud-h">${h}</div><div class="ud-sub">${s}</div></div>${right}</div>`;
    const screens = {
      overview() {
        const open = tickets.filter((t) => t.s !== "closed").length;
        main.innerHTML = head("Overview", "Ultra Modern Rails") + `<div class="ud-grid" style="margin-bottom:12px">${[["Open tickets", open], ["Quote requests", 18], ["Chat sessions today", 27]].map(([k, v]) => `<div class="ud-stat"><small>${k}</small><b>${v}</b></div>`).join("")}</div>
          <div class="ud-card"><b>Your widget</b><dl class="ud-dl" style="margin-top:12px"><dt>Slug</dt><dd>ultra-modern-rails</dd><dt>Ticket prefix</dt><dd>UMR</dd></dl></div>`;
      },
      tickets() {
        main.innerHTML = head("Tickets", `${tickets.length} tickets`, `<div class="ud-search">Search by ticket #, name, email, category...</div>`) + `<div class="ud-grid">${tickets.map((t, i) => `
          <div class="ud-tk ${sel.has(t.id) ? "sel" : ""}" data-i="${i}" style="animation-delay:${i * 40}ms">
            <div class="top"><div style="display:flex;gap:9px;align-items:center"><span class="ud-ck" role="checkbox" aria-label="Select ${t.id}">${sel.has(t.id) ? "✓" : ""}</span><span class="num">${t.id}</span></div>
            <button class="ud-st ${t.s}" data-q>${ST[t.s]}</button></div>
            <b>${t.n}</b><p>${t.d}</p><div class="meta"><span>${t.c}</span><span>${t.loc.split(",")[0]}</span></div></div>`).join("")}</div>`;
        main.querySelectorAll(".ud-tk").forEach((c) => {
          const t = tickets[c.dataset.i];
          c.onclick = (e) => {
            if (e.target.closest(".ud-ck")) { sel.has(t.id) ? sel.delete(t.id) : sel.add(t.id); syncBulk(); screens.tickets(); return; }
            if (e.target.closest("[data-q]")) {
              e.stopPropagation(); const st = e.target.closest("[data-q]"); if (st.querySelector(".ud-menu")) return st.querySelector(".ud-menu").remove();
              const m = $(`<div class="ud-menu">${Object.keys(ST).map((s) => `<button data-v="${s}">${ST[s]}</button>`).join("")}</div>`); st.appendChild(m);
              m.querySelectorAll("button").forEach((b) => b.onclick = (ev) => { ev.stopPropagation(); t.s = b.dataset.v; toast("Ticket status updated."); screens.tickets(); });
              return;
            }
            openTicket(t);
          };
        });
      },
      sessions() {
        main.innerHTML = head("Sessions", "Every conversation with your widget", `<div class="ud-search">Search by name, email, or category...</div>`) + `<table class="ud-table"><thead><tr><th>Visitor</th><th>Category</th><th>Location</th><th>Started</th></tr></thead><tbody>${tickets.map((t, i) => `<tr data-i="${i}"><td><b>${t.n}</b><div style="font-size:12px;color:#a1a1a6">${t.em}</div></td><td>${t.c}</td><td>${t.loc}</td><td>${9 - i}:${(12 + i * 7) % 60 < 10 ? "0" : ""}${(12 + i * 7) % 60} AM</td></tr>`).join("")}</tbody></table>`;
        main.querySelectorAll("tr[data-i]").forEach((r) => r.onclick = () => openTicket(tickets[r.dataset.i], "Client"));
      },
      quotes() {
        const q = tickets.filter((t) => t.c === "Custom Quote");
        main.innerHTML = head("Quotes", "Quote requests from the widget", `<div class="ud-search">Search by name or email...</div>`) + `<table class="ud-table"><thead><tr><th>Name</th><th>Email</th><th>Budget</th><th>Installed on</th></tr></thead><tbody>${q.map((t, i) => `<tr data-id="${t.id}"><td><b>${t.n}</b></td><td>${t.em}</td><td>${["$10,000 to $25,000", "$5,000 to $10,000", "$25,000+"][i % 3]}</td><td>${["Concrete", "Composite Decking", "Fascia-Mounted"][i % 3]}</td></tr>`).join("")}</tbody></table>`;
        main.querySelectorAll("tr[data-id]").forEach((r) => r.onclick = () => openTicket(tickets.find((t) => t.id === r.dataset.id)));
      },
      widget(tab = opts.widgetTab || "Overview") {
        const tabs = ["Overview", "Live Preview", "Reps", "Settings"];
        main.innerHTML = head("Widget", "How your chat widget is set up") + `<div class="ud-wt">${tabs.map((t) => `<button class="${t === tab ? "on" : ""}">${t}</button>`).join("")}</div><div class="wb"></div>`;
        main.querySelectorAll(".ud-wt button").forEach((b) => b.onclick = () => screens.widget(b.textContent));
        const wb = main.querySelector(".wb");
        if (tab === "Overview") {
          wb.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1.3fr;gap:12px"><div class="ud-card"><b>Widget ID</b><p class="ud-sub" style="margin:4px 0 10px">Reference this ID when building or configuring this widget's code.</p><div class="ud-mono"><span>wgt_7f3a9c21-umr</span><button class="ud-ib cp" aria-label="Copy widget ID">${I("copy", 15)}</button></div>
            <dl class="ud-dl" style="margin-top:14px;font-size:13px"><dt>Slug</dt><dd>ultra-modern-rails</dd><dt>Ticket prefix</dt><dd>UMR</dd></dl></div>
            <div class="ud-card"><b>How it works</b><p class="ud-sub" style="margin:4px 0 12px">A visitor opens the widget and picks one of four categories below. Once they confirm a quote or support case, it's posted to your configured CRM webhook.</p>
            <div class="ud-how"><div><b>Custom Quote</b><p>Walks a visitor through describing a job so they can request a price estimate.</p></div><div><b>Support</b><p>Opens a support ticket for an issue with an existing order or service.</p></div><div><b>Existing Order</b><p>Look up or ask a question about an order they already placed.</p></div><div><b>Talk to a Rep</b><p>Hands the conversation off to a live representative.</p></div></div></div></div>`;
          wb.querySelector(".cp").onclick = () => { navigator.clipboard?.writeText("wgt_7f3a9c21-umr").catch(() => {}); toast("Widget ID copied."); };
        } else if (tab === "Live Preview") {
          wb.innerHTML = `<div style="background:#FFFBEB;border:1px solid #FDE68A;color:#92400E;border-radius:10px;padding:10px 14px;font-size:13px;margin-bottom:12px">This loads your real, live widget. Any conversation you have here creates real data in your account, the same as a real visitor.</div><div class="lp" style="background:#fff;border-radius:14px;border:1px solid #eee;height:470px;position:relative;overflow:hidden"><div style="position:absolute;right:20px;bottom:20px;transform:scale(.72);transform-origin:100% 100%"></div></div>`;
          widget(wb.querySelector(".lp>div"), { onSubmit: (l) => { if (l.rep) toast(`${l.kind} sent to ${l.rep.n}.`); } });
        } else if (tab === "Reps") {
          const draw = () => {
            const act = reps.filter((r) => r.on); const nx = act[rrIdx % (act.length || 1)];
            wb.innerHTML = `<p class="ud-sub" style="margin:-4px 0 14px">Talk to a Rep cycles through these people in order, one per request, then wraps back to the top.</p>
              <div class="ud-card" style="padding:4px 4px">${reps.length ? reps.map((r, i) => `<div class="ud-rep ${r === nx ? "next" : ""}"><span class="av">${initials(r.n)}</span><div style="flex:1"><b>${r.n}</b>${r === nx ? ' <span class="uw-pill">Next up</span>' : ""}<div style="font-size:12.5px;color:#6e6e73">${r.e}</div></div>
                <button class="ud-sw ${r.on ? "on" : ""}" data-a="t" data-i="${i}" aria-label="Active"></button><button class="ud-ib" data-a="u" data-i="${i}" aria-label="Move up">${I("up", 15)}</button><button class="ud-ib" data-a="d" data-i="${i}" aria-label="Move down">${I("down", 15)}</button><button class="ud-ib" data-a="x" data-i="${i}" aria-label="Remove">${I("trash", 15)}</button></div>`).join("") : `<p style="padding:16px;color:#6e6e73">No reps yet. Add the first one below.</p>`}</div>
              <form style="display:flex;gap:8px;margin-top:12px"><input class="ud-in" name="n" placeholder="Blake" aria-label="Name" style="flex:1"><input class="ud-in" name="e" placeholder="blake@example.com" aria-label="Email" style="flex:1.4"><button class="ud-pillbtn">Add rep</button></form>`;
            wb.querySelectorAll("[data-a]").forEach((b) => b.onclick = () => {
              const i = +b.dataset.i, a = b.dataset.a;
              if (a === "t") reps[i].on = !reps[i].on;
              if (a === "u" && i > 0) [reps[i - 1], reps[i]] = [reps[i], reps[i - 1]];
              if (a === "d" && i < reps.length - 1) [reps[i + 1], reps[i]] = [reps[i], reps[i + 1]];
              if (a === "x") { const [r] = reps.splice(i, 1); toast(`${r.n} removed from the rotation.`); }
              draw();
            });
            wb.querySelector("form").onsubmit = (e) => { e.preventDefault(); const f = e.target; const n = f.n.value.trim(); if (!n) return f.n.focus(); reps.push({ n, e: f.e.value.trim() || n.toLowerCase().split(" ")[0] + "@example.com", on: true }); toast("Rep added to the rotation."); draw(); };
          };
          draw();
        } else {
          wb.innerHTML = `<div class="ud-card" style="display:grid;gap:14px;max-width:640px">${[["Widget name", "Ultra Modern Rails", ""], ["CRM webhook URL", "https://hooks.zapier.com/hooks/catch/…", "New tickets and quotes are posted here, if set."], ["Avatar URL", "https://ultramodernrails.com/rails.png", "Shown as the chat widget's avatar on your site."], ["Slug", "ultra-modern-rails", "Read only"], ["Ticket prefix", "UMR", "Read only"]].map(([l, v, h]) => `<label style="display:grid;gap:5px;font-size:13px;font-weight:700">${l}<input class="ud-in" value="${v}" ${h === "Read only" ? "readonly style='background:#f6f6f6'" : ""}><span style="font-weight:400;color:#a1a1a6;font-size:12px">${h}</span></label>`).join("")}</div>`;
        }
      },
    };
    function syncBulk() { bulk.classList.toggle("on", sel.size > 0); bulk.querySelector(".n").textContent = `${sel.size} selected`; }
    bulk.querySelectorAll("button").forEach((b) => b.onclick = () => { const n = sel.size; tickets.forEach((t) => sel.has(t.id) && (t.s = b.dataset.s)); sel.clear(); syncBulk(); toast(`${n} tickets updated.`); screens.tickets(); });
    function go(k) { cur = k; close(); el.querySelectorAll(".ud-nav button[data-k]").forEach((b) => b.classList.toggle("on", b.dataset.k === k)); screens[k](); }
    el.querySelectorAll(".ud-nav button[data-k]").forEach((b) => b.onclick = () => go(b.dataset.k));
    go(opts.screen || "tickets");
    return {
      el, go, openTicket,
      addLead(l) { tickets.unshift({ id: l.id, n: l.name || "New visitor", c: l.kind, s: "open", d: l.rows.map((r) => r[1]).join(" · "), loc: "Westfield, Massachusetts, US", tz: "America/New_York", em: "visitor@example.com", ph: "Not given" }); if (cur === "tickets") screens.tickets(); },
    };
  }

  window.UMR = { fit, widget, dash, icon: I, wait, nextRep, reps };
})();
