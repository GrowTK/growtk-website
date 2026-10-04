import { Cam, facing, fit, open, poly, prism, proj, ringAt, rings, rrect, seg, circ, type Ring } from "@/lib/hairline/iso";
import { reducedMotion, spring, stepS, tdone, tset, tval, tween } from "@/lib/hairline/motion";
import { disposer, flatDot, mk, place, put, register, solid } from "@/lib/hairline/stage";

/**
 * The hero's Hairline figure, in a portrait 400 × 480 box: a lead machine.
 * A call rings on the phone, a lead rides a belt into the automation hub,
 * on to the calendar where a day gets booked, and leaves as an invoice that
 * prints a receipt at the terminal. It runs on its own; the pointer speeds
 * the line up and lights the station it is nearest.
 */
export const HERO_VIEWBOX = { w: 400, h: 480 };

const circAt = (cx: number, cy: number, R: number, n = 40): Ring =>
  circ(R, n).map((q) => ({ ...q, u: q.u + cx, v: q.v + cy }));

type Solid = ReturnType<typeof solid>;

export function mountLeadMachine(stage: HTMLElement, svg: SVGSVGElement): () => void {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-12, -18, 0], [16, 106, 0], [-38, 62, 10], [-38, 18, 48], [112, 74, 0], [110, 196, 0], [80, 196, 0], [-15, 75, 28], [12, -12, 30], [95, 172, 40], [176, 160, 0], [176, 160, 34]], 200, 240);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const path = (cls: string, d = "", parent: Element = g) => mk("path", { class: cls, d }, parent);

  // Board and belts: everything low, painted first.
  const belts = [
    { x0: -5, y0: 16, x1: 5, y1: 75, axis: "y" as const },
    { x0: 15, y0: 85, x1: 79, y1: 95, axis: "x" as const },
    { x0: 90, y0: 106, x1: 100, y1: 167, axis: "y" as const },
  ];
  const stripes = belts.map((b) => {
    const [r, i] = rings(b.x0, b.y0, b.x1, b.y1, 2, 0.8);
    put(solid(g), prism(P, front, r, i, 0, 3));
    return path("nf lo");
  });

  // W · a website form standing at the back: its button sends web leads down to the belt.
  // The plane faces +x, where +y runs right to left on screen, so flip y to read left to right.
  const WX = -36, wp = (y: number, z: number) => P(WX, 80 - y, z - 6);
  path("", poly([P(WX - 2, 18, 8), P(WX - 2, 62, 8), P(WX - 2, 62, 48), P(WX - 2, 18, 48)]));
  const site = path("sil", poly([wp(18, 14), wp(62, 14), wp(62, 54), wp(18, 54)]) + seg(P(WX - 2, 62, 8), wp(18, 14)) + seg(P(WX - 2, 62, 48), wp(18, 54)));
  path("nf lo", seg(wp(18, 48), wp(62, 48)) + seg(wp(24, 41), wp(54, 41)) + seg(wp(24, 36), wp(46, 36)) + seg(wp(24, 31), wp(50, 31)));
  for (let k = 0; k < 3; k++) { const d = mk("ellipse", { rx: 1.4, ry: 1.4, class: "dot m" }, g); place(d, wp(22 + k * 3.2, 51)); }
  const btn = path("", poly([wp(24, 18.5), wp(42, 18.5), wp(42, 24.5), wp(24, 24.5)]));
  const caret = path("nf sil");
  const guidePts: [number, number, number][] = [];
  for (let k = 0; k <= 12; k++) { const t = k / 12; guidePts.push([WX + 36 * t, 47 - 6 * t, 12.5 * (1 - t) + 3 * t + 8 * Math.sin(Math.PI * t)]); }
  path("nf dash", open(guidePts.map(([x, y, z]) => P(x, y, z))));
  const webDot = mk("ellipse", { rx: 2, ry: 2, class: "dot", visibility: "hidden" }, g);

  // A · the phone, with ringing rings.
  const phone = solid(g);
  const [pr, pi] = rings(-9, -16, 9, 14, 4, 1.2);
  put(phone, prism(P, front, pr, pi, 0, 3.5));
  path("nf lo", poly(ringAt(P, rrect(-6.5, -13, 6.5, 8.5, 2.5), 3.5)));
  place(flatDot(g, C, 0.9, "dot m"), P(0, 11.3, 3.5));
  const waves = [0, 1, 2].map((k) => ({ el: path("nf sil"), t: k / 3 }));

  // Crates on belt 1 sit behind the hub.
  const lanes = [mk("g", {}, g), null as SVGGElement | null, null as SVGGElement | null];

  // B · the automation hub, lights on its lid.
  const hub = solid(g);
  const [hr, hi] = rings(-15, 75, 15, 105, 4, 1.5);
  put(hub, prism(P, front, hr, hi, 0, 28));
  let slots = "";
  for (const z of [8, 13, 18]) slots += seg(P(-9, 105, z), P(9, 105, z));
  for (const z of [8, 13]) slots += seg(P(15, 82, z), P(15, 96, z));
  path("nf lo", slots);
  const lights: SVGEllipseElement[] = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    const d = flatDot(g, C, 1.3, "dot off");
    place(d, P(-6 + i * 6, 84 + j * 6, 28));
    lights.push(d);
  }
  lanes[1] = mk("g", {}, g);

  // C · the calendar: keys lift as bookings land.
  const cal = solid(g);
  const [cr, ci] = rings(78, 74, 112, 106, 4, 1.5);
  put(cal, prism(P, front, cr, ci, 0, 6));
  const keys: { ring: Ring; inner: Ring; el: Solid; mark: SVGEllipseElement; tw: ReturnType<typeof tween>; drawn: number; cx: number; cy: number }[] = [];
  for (let s = 0; s <= 4; s++) for (let i = 0; i < 3; i++) {
    const j = s - i;
    if (j < 0 || j > 2) continue;
    const x0 = 81 + i * 10.3, y0 = 77 + j * 9.8;
    const [ring, inner] = rings(x0, y0, x0 + 8, y0 + 7.6, 1.8, 0.6);
    const el = solid(g), mark = flatDot(g, C, 0.8, "dot");
    mark.setAttribute("visibility", "hidden");
    keys.push({ ring, inner, el, mark, tw: tween(1.2), drawn: NaN, cx: x0 + 4, cy: y0 + 3.8 });
  }
  lanes[2] = mk("g", {}, g);

  // D · the payment terminal, printing receipts.
  const [dr, di] = rings(80, 166, 110, 194, 4, 1.5);
  put(solid(g), prism(P, front, dr, di, 0, 4));
  const term = solid(g);
  const [tr, ti] = rings(86, 170, 104, 190, 3, 1);
  put(term, prism(P, front, tr, ti, 4, 20));
  path("nf lo", poly(ringAt(P, rrect(88.5, 174, 101.5, 181, 1.5), 20)));
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) place(flatDot(g, C, 0.7, "dot m"), P(90 + i * 4, 184 + j * 3, 20));
  const paper = path("");
  const receipt = tween(2);

  // R · revenue bars: each receipt grows the next one.
  const bars = Array.from({ length: 5 }, (_, i) => {
    const x0 = 132 + i * 9, [ring, inner] = rings(x0, 150, x0 + 6.5, 158, 1.6, 0.6);
    return { ring, inner, el: solid(g), rest: 3 + i * 2, tw: tween(3 + i * 2), drawn: NaN };
  });
  let paid = 0;

  // The sync arc: a packet hops from the hub's lid to the calendar.
  const arcPt = (t: number): [number, number, number] => [95 * t, 90, 28 + (6 - 28) * t + 16 * Math.sin(Math.PI * t)];
  const arcD: [number, number][] = [];
  for (let k = 0; k <= 20; k++) { const q = arcPt(k / 20); arcD.push(P(q[0], q[1], q[2])); }
  path("nf dash", open(arcD));
  const packet = mk("ellipse", { rx: 2.2, ry: 2.2, class: "dot" }, g);

  // Crates: a pool, cubes until the calendar, invoice cards after it.
  // Leads ride in white; the hub colours them, and the day each one books takes its colour.
  const LEAD_COLORS = ["#FFDE59", "#F2C4FF", "#FFBA7B"];
  let colorN = 0;
  const crates = Array.from({ length: 14 }, () => ({ el: solid(lanes[0]!), s: -1, lane: 0, color: "" }));
  const launch = (s0: number) => {
    const c = crates.find((x) => x.s < 0);
    if (c) { c.s = s0; c.color = LEAD_COLORS[colorN++ % LEAD_COLORS.length]; }
  };
  for (const c of crates) c.el.g.setAttribute("visibility", "hidden");

  const STATIONS: { x: number; y: number; r: number; z: number; el: { sil: Element } }[] = [{ x: 0, y: 0, r: 16, z: 4, el: phone }, { x: 0, y: 90, r: 17, z: 28, el: hub }, { x: 95, y: 90, r: 18, z: 6, el: cal }, { x: 95, y: 180, r: 15, z: 20, el: term }, { x: WX, y: 40, r: 0, z: 60, el: { sil: site } }];
  const route = (s: number): [number, number] => (s < 90 ? [0, s] : s < 185 ? [s - 90, 90] : [95, 90 + (s - 185)]);
  const near = (x: number, y: number) => STATIONS.some((st) => st.r > 0 && Math.hypot(x - st.x, y - st.y) < st.r);

  const speed = spring(1);
  let hot = -1, flash = -1, flashUntil = 0, booked = 0, spawn = 0, belt = 0, wave = 0, blink = 0, web = 1.2, webT = -1, arc = 0;

  const tick = (dt: number, now: number) => {
    const still = reducedMotion();
    stepS(speed, dt);
    const v = 24 * speed.x;
    if (!still) { belt += v * dt; wave += dt * 0.55 * speed.x; blink += dt * speed.x; spawn -= dt * speed.x; web -= dt * speed.x; arc += dt * 0.6 * speed.x; }

    // the website: caret blinks; every so often the form sends a web lead down to the belt
    caret.setAttribute("d", Math.floor(blink * 1.6) % 2 ? "" : seg(wp(51, 36), wp(51, 31.5)));
    if (!still && web <= 0 && webT < 0) { web = 3.4; webT = 0; }
    if (webT >= 0) {
      webT += dt * 1.3 * speed.x;
      const k = Math.min(guidePts.length - 1, Math.floor(webT * (guidePts.length - 1)));
      const [x, y, z] = guidePts[k];
      webDot.removeAttribute("visibility");
      place(webDot, P(x, y, z));
      btn.setAttribute("class", webT < 0.35 ? "hi" : "");
      if (webT >= 1) {
        webT = -1;
        webDot.setAttribute("visibility", "hidden");
        launch(41);
      }
    }

    // a packet hops along the sync arc
    const q = arcPt(still ? 0.5 : arc % 1);
    place(packet, P(q[0], q[1], q[2]));

    // belt stripes scroll with the line
    belts.forEach((b, k) => {
      let d = "";
      const len = b.axis === "y" ? b.y1 - b.y0 : b.x1 - b.x0, off = belt % 6;
      for (let u = off; u < len; u += 6) {
        d += b.axis === "y"
          ? seg(P(b.x0 + 0.8, b.y0 + u, 3.05), P(b.x1 - 0.8, b.y0 + u, 3.05))
          : seg(P(b.x0 + u, b.y0 + 0.8, 3.05), P(b.x0 + u, b.y1 - 0.8, 3.05));
      }
      stripes[k].setAttribute("d", d);
    });

    // the phone rings
    waves.forEach((w) => {
      const t = (wave + w.t) % 1, r = 6 + 20 * t;
      w.el.setAttribute("d", still ? "" : poly(ringAt(P, circAt(0, -2, r, 48), 3.6)));
      w.el.setAttribute("class", t < 0.45 ? "nf sil" : "nf lo");
    });

    // hub lights chase round the lid
    lights.forEach((d, k) => {
      const on = Math.floor(blink * 6 + k * 2.3) % 4;
      d.setAttribute("class", on === 0 ? "dot" : on === 1 ? "dot m" : "dot off");
    });

    // new lead
    if (!still && spawn <= 0) {
      spawn = 1.9;
      launch(0);
    }

    for (const c of crates) {
      if (c.s < 0) continue;
      const before = c.s;
      if (!still) c.s += v * dt;
      if (before < 185 && c.s >= 185) {
        const k = keys[booked % keys.length];
        tset(k.tw, 4.6, now, 0);
        k.mark.removeAttribute("visibility");
        k.el.sil.style.fill = c.color;
        booked++;
        flash = 2; flashUntil = now + 700;
        if (booked % keys.length === 0) keys.forEach((kk, n) => { tset(kk.tw, 1.2, now, 1400 + n * 50); });
      }
      if (c.s >= 275) {
        c.s = -1;
        c.el.g.setAttribute("visibility", "hidden");
        const L = tval(receipt, now);
        tset(receipt, L > 16 ? 2 : L + 3.5, now, 0);
        paid++;
        bars.forEach((b, i) => tset(b.tw, b.rest + (i < paid % 6 ? 9 + i * 2.5 : 0), now, i * 50));
        flash = 3; flashUntil = now + 700;
        continue;
      }
      const [x, y] = route(c.s), lane = c.s < 90 ? 0 : c.s < 185 ? 1 : 2;
      if (lane !== c.lane) { c.lane = lane; lanes[lane]!.appendChild(c.el.g); }
      if (near(x, y)) { c.el.g.setAttribute("visibility", "hidden"); continue; }
      c.el.g.removeAttribute("visibility");
      c.el.sil.style.fill = c.s >= 90 ? c.color : "";
      const card = c.s >= 185;
      const [a, b] = card ? rings(x - 4.5, y - 3.2, x + 4.5, y + 3.2, 1.2, 0.5) : rings(x - 3.6, y - 3.6, x + 3.6, y + 3.6, 1.4, 0.6);
      put(c.el, prism(P, front, a, b, 3, card ? 4.6 : 10));
    }

    // calendar keys
    keys.forEach((k) => {
      const h = tval(k.tw, now);
      // Judge by the target, not the height: a key just booked is still low on its first frame.
      if (k.tw.to < 1.5 && h < 1.5) { k.mark.setAttribute("visibility", "hidden"); k.el.sil.style.fill = ""; }
      if (h === k.drawn) return;
      k.drawn = h;
      put(k.el, prism(P, front, k.ring, k.inner, 6, 6 + h));
      place(k.mark, P(k.cx, k.cy, 6 + h));
    });

    // receipt paper rising from the back of the terminal
    const L = tval(receipt, now);
    paper.setAttribute("d", poly([P(89.5, 172, 20), P(100.5, 172, 20), P(100.5, 172, 20 + L), P(89.5, 172, 20 + L)]) + open([P(91, 172, 20 + L * 0.6), P(99, 172, 20 + L * 0.6)]));

    bars.forEach((b) => {
      const h = tval(b.tw, now);
      if (h === b.drawn) return;
      b.drawn = h;
      put(b.el, prism(P, front, b.ring, b.inner, 0, h));
    });

    // one bright mark: the station under the pointer, else the one that just acted
    const lit = hot >= 0 ? hot : now < flashUntil ? flash : 1;
    STATIONS.forEach((st, n) => st.el.sil.classList.toggle("hi", n === lit));

    return !still || !tdone(receipt, now) || keys.some((k) => !tdone(k.tw, now)) || bars.some((b) => !tdone(b.tw, now));
  };

  const B = register(stage, tick);
  bag.add(B.unregister);

  // The viewBox is portrait, so map the pointer through the svg's own matrix.
  const onMove = (e: PointerEvent) => {
    const m = svg.getScreenCTM();
    if (!m) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    let best = -1, bd = 70;
    STATIONS.forEach((st, n) => {
      const q = P(st.x, st.y, st.z / 2), d = Math.hypot(q[0] - p.x, q[1] - p.y);
      if (d < bd) { bd = d; best = n; }
    });
    hot = best;
    speed.t = 2.4;
    B.wake();
  };
  const onLeave = () => { hot = -1; speed.t = 1; B.wake(); };
  bag.on(stage, "pointermove", onMove);
  bag.on(stage, "pointerleave", onLeave);
  bag.add(() => svg.replaceChildren());
  return bag.dispose;
}

