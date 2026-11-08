/* Slack replica for the deck.
   Slack.window(el, {channel})  full desktop window; returns { show(channel), post(channel, html) }
   Slack.msg.quote/support/order/won(data)  message HTML, reusable in Slack.mini(channel, html)
   Sample customers only: this deck is public, so no real customer contact details. */
(function () {
  const A = (window.UMR_ASSETS || "assets/");
  const $ = (h) => { const t = document.createElement("template"); t.innerHTML = h.trim(); return t.content.firstElementChild; };
  const tm = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const head = (bot) => `<span class="ap"><img src="${A}rails.webp" alt=""></span><div style="flex:1;min-width:0"><div class="nm">${bot}<em>APP</em><time>${tm()}</time></div>`;
  const L = (h) => `<div class="ln">${h}</div>`, G = '<div class="gap"></div>';

  const msg = {
    quote: (d = {}) => `<div class="skm">${head("UMR Quote")}
      ${L("New Lead")}${G}${L(`<b>Customer:</b> ${d.name || "John Reeves"}`)}${L(`<b>Email:</b> <a>${d.email || "john.r@example.com"}</a>`)}${L(`<b>Phone:</b> ${d.phone || "+1 323 555 0161"}`)}${G}
      ${L(`<b>Customer Type:</b> ${d.type || "Home Owner"}`)}${L(`<b>Project Type:</b> Residential`)}${L(`<b>Budget:</b> ${d.budget || "$10,000-$25,000"}`)}${L(`<b>To Be Installed On:</b> ${d.on || "Concrete"}`)}${L(`<b>Railing Height:</b> 36" Stairs, 42" Horizontal Segments`)}${G}
      ${L(`<b>Assigned to Rep:</b> <span class="men">@${d.rep || "Ethan Soto"}</span>`)}${L('<span class="via">Sent by Zapier</span>')}
      <div class="ph"><img src="${A}house.webp" alt="Customer's project photo"></div></div></div>`,
    support: (d = {}) => `<div class="skm">${head("UMR Support")}
      ${L(`<b>New Support Case: #${d.id || "UMR-1045"}</b>`)}${L(`<b>Name:</b> ${d.name || "Daniel Brooks"}`)}${L(`<b>Email:</b> <a>${d.email || "daniel.b@example.com"}</a>`)}${L(`<b>Phone:</b> ${d.phone || "+1 802 555 0136"}`)}${L(`<b>Order #:</b> ${d.order || "1645"}`)}${G}
      ${L("<b>Customer said:</b>")}${L(`<div class="q">${d.said || 'I am having an issue with the 78" cable run between the green corner post and the gray angled post.'}</div>`)}${G}
      ${L('<b>Photo 1:</b> <a>View</a>')}${L('<b>Photo 2:</b> <a>View</a>')}
      <div class="ph"><img src="${A}support-photo.webp" alt="Customer's photo of the posts on their deck"></div></div></div>`,
    order: (d = {}) => `<div class="skm">${head("UMR Support")}
      ${L(`<b>Existing Order Inquiry: #${d.id || "UMR-1046"}</b>`)}${L(`<b>Name:</b> ${d.name || "Daniel Brooks"}`)}${L(`<b>Email:</b> <a>${d.email || "daniel.b@example.com"}</a>`)}${L(`<b>Order #:</b> ${d.order || "1623"}`)}${G}
      ${L("<b>Customer said:</b>")}${L(`<div class="q">${d.said || "Can I switch the finish on my order to stainless instead of black?"}</div>`)}</div></div>`,
    won: (d = {}) => `<div class="skm">${head("Sales Bot")}
      ${L("<b>🏆 Deal Closed! 🏆</b>")}${G}${L(`<span class="men">@${d.rep || "Blake Dunn"}</span> just closed a deal worth <b>${d.value || "$677.42"}</b>! 💰🔥`)}${G}
      ${L(`👤 <b>Customer:</b> ${d.name || "Bruce A Willins"}`)}${L(`📧 <b>Email:</b> <a>${d.email || "bruce.w@example.com"}</a>`)}${L(`📞 <b>Phone:</b> <a>${d.phone || "(631) 555-0148"}</a>`)}${G}${L("Congrats, team! 🚀🎉")}</div></div>`,
  };
  const CH = {
    "customer-support-requests": () => msg.support(), customersupport: null, general: null, "inventory-replacement": null,
    "orders-and-sales-wins": () => msg.won(), quoterequests: () => msg.quote(), "wood-orders": null,
  };
  const DMS = [["Ryan Rhodes", "#B54708"], ["Blake Dunn", "#3538CD"], ["Ethan Soto", "#027A48"], ["Jake", "#C11574"], ["Lucan", "#6941C6"]];
  const ICO = {
    home: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    dm: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5Z"/></svg>',
    bell: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/></svg>',
    file: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M8 12h8"/></svg>',
  };

  function win(root, opts = {}) {
    let cur = opts.channel || "quoterequests";
    const el = $(`<div class="sk" style="width:${opts.w || 1080}px;height:${opts.h || 1000}px">
      <div class="sk-top"><span class="tl"><i style="background:#FF5F57"></i><i style="background:#FEBC2E"></i><i style="background:#28C840"></i></span><span style="opacity:.8">←  →  🕘</span><span class="sr">⌕ Search Ultramodernrails</span><span>?</span></div>
      <div class="sk-body">
        <nav class="sk-rail"><span class="ws"><img src="${A}rails.webp" alt="Ultramodernrails"></span><span class="on"><i>${ICO.home}</i>Home</span><span><i>${ICO.dm}</i>DMs</span><span><i>${ICO.bell}</i>Activity</span><span><i>${ICO.file}</i>Files</span></nav>
        <aside class="sk-side"><h3>Ultramodernrails ⌄</h3><div class="fc">Find a conversation…</div><div class="gh">▾ Channels</div><div class="chs"></div>
          <div class="gh" style="margin-top:8px">▾ Direct messages</div>${DMS.map(([n, c]) => `<div class="dm"><i style="background:${c}">${n.split(" ").map((p) => p[0]).join("")}</i>${n}</div>`).join("")}
          <div class="gh" style="margin-top:8px">▾ Agents and apps</div><div class="dm"><i style="background:#7a4b7c">RR</i>Round Robin</div></aside>
        <main class="sk-main"><div class="sk-hd"></div><div class="sk-tabs"><span class="on">💬 Messages</span><span>Add canvas</span><span>+</span></div>
          <div class="sk-msgs"></div>
          <div class="sk-cmp"><div class="tb"><span>B</span><span><i>I</i></span><span><u>U</u></span><span><s>S</s></span><span>🔗</span><span>≡</span><span>&lt;/&gt;</span></div><div class="in cmpt"></div><div class="bt"><span style="width:26px;height:26px;border-radius:50%;background:#2C2D30;display:grid;place-items:center">+</span><span>Aa</span><span>☺</span><span>@</span><span style="margin-left:auto">➤</span></div></div>
        </main></div></div>`);
    root.appendChild(el);
    const chs = el.querySelector(".chs"), msgs = el.querySelector(".sk-msgs");
    const unread = new Set(["wood-orders"]);
    function side() {
      chs.innerHTML = Object.keys(CH).map((c) => `<div class="ch ${c === cur ? "on" : ""} ${unread.has(c) && c !== cur ? "unread" : ""}" data-c="${c}"><span class="h">#</span>${c}</div>`).join("");
      chs.querySelectorAll(".ch").forEach((x) => x.onclick = () => { if (CH[x.dataset.c]) show(x.dataset.c); });
    }
    async function reveal(node) {
      node.classList.add("anim"); const parts = node.querySelectorAll(".ln,.ph,.gap");
      for (const p of parts) { await new Promise((r) => setTimeout(r, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 55)); p.classList.add("on"); }
    }
    function show(c, animate = true) {
      cur = c; unread.delete(c); side();
      el.querySelector(".sk-hd").innerHTML = `☆ <span># ${c}</span><span class="r">👤 ${c === "orders-and-sales-wins" ? 6 : 4}  🔔  ⌕  ⋮</span>`;
      el.querySelector(".cmpt").textContent = `Message #${c}`;
      msgs.innerHTML = `<div class="sk-day">Today ⌄</div>`;
      const n = $(CH[c]()); msgs.appendChild(n); if (animate) reveal(n);
    }
    function post(c, html) {
      if (c !== cur) { cur = c; show(c, false); }
      msgs.querySelectorAll(".skm").forEach((m, k, all) => { if (all.length > 1 && k < all.length - 1) m.remove(); });
      const n = $(html); msgs.appendChild(n); reveal(n);
      while (msgs.children.length > 3) msgs.children[1].remove();
    }
    show(cur);
    return { el, show, post, current: () => cur };
  }
  const mini = (channel, html) => `<div class="skmini"><div class="chn">Slack · <b># ${channel}</b></div>${html}</div>`;
  window.Slack = { window: win, msg, mini };
})();
