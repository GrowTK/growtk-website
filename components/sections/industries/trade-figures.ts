import {
  Cam, circ, clamp, facing, fit, hull, lerp, open, poly, prism, proj, ringAt, rings, rrect, run, seg, unproj,
  type Camera, type Projector, type Ring, type Sample, type Vec2, type Vec3,
} from "@/lib/hairline/iso";
import { reducedMotion, spring, stepS, tdone, tset, tval, tween } from "@/lib/hairline/motion";
import { disposer, flatDot, mk, place, pointer, put, register, solid, type FigureMount } from "@/lib/hairline/stage";

/**
 * One Hairline figure per trade, keyed by the industry card's icon name. Each
 * is an isometric line drawing on the vendored Hairline kernel (lib/hairline):
 * rounded solids, one stroke palette, springs for where the pointer is and
 * tweens for which part it chose. The one-time draw-in lives in trade-figure.tsx.
 */

/* ---------- shared bits ---------- */

const circAt = (cx: number, cy: number, R: number, n = 40): Ring =>
  circ(R, n).map((q) => ({ ...q, u: q.u + cx, v: q.v + cy }));

/** Turns a ring about (cx, cy) on the ground, normals with it. */
const rotRing = (ring: Ring, cx: number, cy: number, a: number): Ring => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q: Sample) => ({
    u: cx + (q.u - cx) * c - (q.v - cy) * s, v: cy + (q.u - cx) * s + (q.v - cy) * c,
    nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c,
  }));
};

/** A solid whose top is smaller than its foot: the silhouette is the hull of both rings. */
const taper = (P: Projector, front: (q: Sample) => boolean, foot: Ring, top: Ring, inner: Ring | null, z0: number, z1: number) => ({
  sil: poly(hull(ringAt(P, foot, z0).concat(ringAt(P, top, z1)))),
  crease: inner ? open(ringAt(P, run(inner, front), z1)) : "",
});

function stageOf(svg: SVGSVGElement, S: number, pts: Vec3[]) {
  const C: Camera = Cam(45, 0.5, S);
  fit(C, pts, 200, 166);
  return { C, P: proj(C), front: facing(C), g: mk("g", {}, svg) };
}

const path = (g: Element, cls: string, d = "") => mk("path", { class: cls, d }, g);

/** Terrain's falloff: 1 at the pointer, .31 at 42% of the radius, .09 beyond. */
const falloff = (u: number) =>
  u <= 0 ? 1 : u <= 0.417 ? 1 - (u / 0.417) * 0.6875 : u <= 1 ? 0.3125 - ((u - 0.417) / 0.583) * 0.2185 : 0.094;

/* ---------- HVAC: a condenser whose fan spins up under the pointer ---------- */

const hvac: FigureMount = ({ stage, svg }, value) => {
  const bag = disposer();
  const { C, P, front, g } = stageOf(svg, 2.3, [[-4, -4, -4], [64, 64, -4], [64, -4, -4], [-4, 64, -4], [0, 0, 44], [60, 60, 44]]);
  const Z = 42, K = 30;
  const [pr, pi] = rings(-4, -4, 64, 64, 6, 1.6);
  put(solid(g), prism(P, front, pr, pi, -4, 0));
  const [br, bi] = rings(2, 2, 58, 58, 8, 1.8);
  put(solid(g), prism(P, front, br, bi, 0, Z));
  let lv = "";
  for (let z = 7; z <= 35; z += 4) lv += seg(P(58, 12, z), P(58, 48, z)) + seg(P(12, 58, z), P(48, 58, z));
  path(g, "nf lo", lv);
  const blades = [0, 1, 2].map((k) => path(g, k === 0 ? "hi" : ""));
  for (const R of [21, 15.5, 10]) path(g, R === 21 ? "nf sil" : "nf lo", poly(ringAt(P, circAt(K, K, R, 64), Z + 0.3)));
  path(g, "", poly(ringAt(P, circAt(K, K, 3.6), Z + 0.4)));

  const blade = (a: number) => {
    const pts: Vec2[] = [];
    for (let t = 0; t <= 4; t++) { const b = a - 0.35 + (0.7 * t) / 4; pts.push(P(K + 4.4 * Math.cos(b), K + 4.4 * Math.sin(b), Z + 0.2)); }
    for (let t = 0; t <= 6; t++) { const b = a + 0.55 - (0.75 * t) / 6; pts.push(P(K + 19 * Math.cos(b), K + 19 * Math.sin(b), Z + 0.2)); }
    return poly(pts);
  };
  let th = 0.4, R = 24 + 24 * value;
  const w = spring(0.9);
  const B = register(stage, (dt) => {
    stepS(w, dt);
    if (!reducedMotion()) th += w.x * dt;
    blades.forEach((b, k) => b.setAttribute("d", blade(th + (k * 2 * Math.PI) / 3)));
    return !reducedMotion();
  });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (p) => { const q = unproj(C, p[0], p[1], Z); w.t = 0.9 + 11 * falloff(Math.hypot(q[0] - K, q[1] - K) / R); B.wake(); },
    leave: () => { w.t = 0.9; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { R = 24 + 24 * v; }, destroy: bag.dispose };
};

/* ---------- Plumbing: a faucet dripping into a basin; nearer pours faster ---------- */

const plumbing: FigureMount = ({ stage, svg }) => {
  const bag = disposer();
  const { C, P, front, g } = stageOf(svg, 2.5, [[0, 0, -6], [80, 56, -6], [80, 0, -6], [0, 56, -6], [44, 4, 38], [52, 6, 38]]);
  const W = 12.5, TX = 44, TY = 30;
  const [cr, ci] = rings(0, 0, 80, 56, 6, 1.8);
  put(solid(g), prism(P, front, cr, ci, -6, 0));
  put(solid(g), prism(P, front, circAt(44, 6, 3.2), circAt(44, 6, 2.4), 0, 34));
  put(solid(g), prism(P, front, rrect(22, 14, 66, 50, 15), null, 0, 15));
  path(g, "nf", poly(ringAt(P, rrect(25, 17, 63, 47, 12, 8), 15)));
  path(g, "nf lo", poly(ringAt(P, rrect(29, 21, 59, 43, 9, 8), W)));
  const ripples = [0, 1, 2].map(() => ({ el: path(g, "nf lo"), r: -1 }));
  const [sr, si] = rings(42, 3, 46, TY + 1, 2, 0.8);
  put(solid(g), prism(P, front, sr, si, 30, 34));
  const lever = solid(g);
  const drops = [0, 1, 2].map(() => ({ el: mk("ellipse", { rx: 1.5, ry: 2.1, class: "dot", visibility: "hidden" }, g), z: 0, v: 0, live: false }));

  const f = spring(0.12);
  let acc = 0, drawnLever = NaN;
  const B = register(stage, (dt) => {
    stepS(f, dt);
    const a = -0.25 - 0.95 * f.x;
    if (a !== drawnLever) {
      drawnLever = a;
      put(lever, prism(P, front, rotRing(rrect(43, 4.6, 57, 7.4, 1.4), 44, 6, a), rotRing(rrect(43.6, 5.2, 56.4, 6.8, 0.8), 44, 6, a), 34, 36.6));
    }
    if (reducedMotion()) return false;
    acc += dt;
    if (acc > lerp(1.6, 0.22, f.x)) {
      acc = 0;
      const d = drops.find((x) => !x.live);
      if (d) { d.live = true; d.z = 29.5; d.v = 0; }
    }
    for (const d of drops) {
      if (!d.live) { d.el.setAttribute("visibility", "hidden"); continue; }
      d.v += 240 * dt; d.z -= d.v * dt;
      if (d.z <= W) {
        d.live = false;
        const r = ripples.find((x) => x.r < 0);
        if (r) r.r = 0.8;
        continue;
      }
      d.el.removeAttribute("visibility");
      place(d.el, P(TX, TY, d.z));
    }
    for (const r of ripples) {
      if (r.r < 0) continue;
      r.r += 10 * dt;
      if (r.r > 9) { r.r = -1; r.el.setAttribute("d", ""); continue; }
      r.el.setAttribute("class", r.r < 4.5 ? "nf sil" : "nf lo");
      r.el.setAttribute("d", poly(ringAt(P, circAt(TX, TY, r.r, 32), W)));
    }
    return true;
  });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (p) => { const q = unproj(C, p[0], p[1], 15); f.t = 0.12 + 0.88 * clamp(1 - Math.hypot(q[0] - 44, q[1] - 32) / 40, 0, 1); B.wake(); },
    leave: () => { f.t = 0.12; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
};

/* ---------- Electrical: a breaker panel; the breaker under the pointer flips ---------- */

const electrical: FigureMount = ({ stage, svg }) => {
  const bag = disposer();
  const { P, front, g } = stageOf(svg, 2.25, [[-3, -6, -6], [16, 66, -6], [-3, 66, 100], [16, -6, 100], [-3, -6, 100], [16, 66, 100]]);
  const ON = 2.4, OFF = -2.4, TRIP = 0, T = 7;
  const [wr, wi] = rings(-3, -6, 0, 66, 1.5, 0.6);
  put(solid(g), prism(P, front, wr, wi, -6, 96));
  const [pr, pi] = rings(0, 0, 10, 60, 3, 1.2);
  put(solid(g), prism(P, front, pr, pi, 0, 86));
  put(solid(g), prism(P, front, circAt(5, 30, 3), circAt(5, 30, 2.2), 86, 100));
  const items: { y: number; zc: number; lv: ReturnType<typeof solid>; tw: ReturnType<typeof tween>; drawn: number; at: Vec2 }[] = [];
  for (const [y0, y1] of [[8, 27], [33, 52]]) for (let r = 5; r >= 0; r--) {
    const zc = 14 + r * 12, y = (y0 + y1) / 2;
    const [a, b] = rings(10, y0, 12.6, y1, 0.8, 0.4);
    put(solid(g), prism(P, front, a, b, zc - 4, zc + 4));
    items.push({ y, zc, lv: solid(g), tw: tween(items.length === T ? TRIP : ON), drawn: NaN, at: P(12.6, y, zc) });
  }
  let over = -1, idle = -1, idleAt = 0;
  // Declared ahead: the first tick runs inside register() and may already retarget.
  let B: ReturnType<typeof register> | undefined = undefined;
  B = register(stage, (_dt, now) => {
    let moving = false;
    // Idle: a breaker flips, then the next, round the panel, until the pointer takes over.
    if (over < 0 && !reducedMotion()) {
      moving = true;
      if (now - idleAt > 900) { idleAt = now; idle = (idle + 1) % items.length; retarget(); }
    }
    const cur = over >= 0 ? over : idle;
    items.forEach((it, i) => {
      const o = tval(it.tw, now);
      if (!tdone(it.tw, now)) moving = true;
      if (o !== it.drawn) {
        it.drawn = o;
        const [a, b] = rings(12.6, it.y - 1.8, 15.2, it.y + 1.8, 0.7, 0.3);
        put(it.lv, prism(P, front, a, b, it.zc + o - 1.3, it.zc + o + 1.3));
      }
      it.lv.sil.classList.toggle("hi", cur >= 0 ? i === cur : i === T);
    });
    return moving;
  });
  bag.add(B.unregister);
  function retarget() {
    const now = performance.now(), cur = over >= 0 ? over : idle;
    items.forEach((it, i) => tset(it.tw, i === cur ? OFF : cur < 0 && i === T ? TRIP : ON, now, cur < 0 ? 0 : Math.abs(i - cur) * 40));
    B?.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      let best = -1, bd = 26;
      items.forEach((it, i) => { const d = Math.hypot(it.at[0] - p[0], it.at[1] - p[1]); if (d < bd) { bd = d; best = i; } });
      if (best !== over) { over = best; retarget(); }
    },
    leave: () => { over = -1; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
};

/* ---------- Roofing: a gable roof whose shingles lift like storm damage ---------- */

const roofing: FigureMount = ({ stage, svg }, value) => {
  const bag = disposer();
  const { C, P, front, g } = stageOf(svg, 2.35, [[-4, -5, 0], [74, 55, 0], [74, -5, 0], [-4, 55, 0], [-4, 25, 56], [74, 25, 56], [17, 12, 66]]);
  put(solid(g), prism(P, front, rrect(0, 0, 70, 50, 1.2), null, 0, 32));
  path(g, "nf", poly([P(46, 50, 0), P(56, 50, 0), P(56, 50, 18), P(46, 50, 18)]));
  path(g, "nf", poly([P(14, 50, 12), P(28, 50, 12), P(28, 50, 22), P(14, 50, 22)]) + seg(P(21, 50, 12), P(21, 50, 22)));
  path(g, "", poly([P(70, 0, 32), P(70, 50, 32), P(70, 25, 50)]));
  const vent: Vec2[] = [];
  for (let k = 0; k < 24; k++) { const t = (k / 24) * Math.PI * 2; vent.push(P(70, 25 + 3.5 * Math.cos(t), 40 + 3.5 * Math.sin(t))); }
  path(g, "nf lo", poly(vent));
  const [hr, hi] = rings(12, 6, 22, 15, 1.5, 0.7);
  put(solid(g), prism(P, front, hr, hi, 36, 64));
  path(g, "sil", poly([P(-4, 25, 52), P(74, 25, 52), P(74, -5, 31), P(-4, -5, 31)]));
  path(g, "", poly([P(74, 25, 52), P(74, -5, 31), P(74, -5, 29), P(74, 25, 50)]));
  path(g, "sil", poly([P(-4, 25, 52), P(74, 25, 52), P(74, 55, 31), P(-4, 55, 31)]));
  path(g, "", poly([P(-4, 55, 31), P(74, 55, 31), P(74, 55, 29), P(-4, 55, 29)]));
  path(g, "", poly([P(74, 25, 52), P(74, 55, 31), P(74, 55, 29), P(74, 25, 50)]));

  // Plane point at x and slope t (0 ridge, 1 eave), lifted L along the roof's normal.
  const nY = 21 / 36.6, nZ = 30 / 36.6;
  const at = (x: number, t: number, L: number) => P(x, 25 + 30 * t + nY * L, 52 - 21 * t + nZ * L);
  const REST: Record<string, number> = { "5,1": 7, "6,1": 3, "5,2": 3.5 };
  const tiles: { x0: number; x1: number; t0: number; t1: number; cx: number; cy: number; rest: number; sp: ReturnType<typeof spring>; el: SVGPathElement; drawn: number }[] = [];
  for (let j = 0; j < 4; j++) for (let i = 0; i < 7; i++) {
    const x0 = -3 + i * 11 + 0.6, t0 = j / 4 + 0.02, t1 = (j + 1) / 4 - 0.02, rest = REST[`${i},${j}`] ?? 0;
    tiles.push({ x0, x1: x0 + 9.8, t0, t1, cx: x0 + 4.9, cy: 25 + 30 * ((t0 + t1) / 2), rest, sp: spring(rest, { eps: 0.03 }), el: path(g, ""), drawn: NaN });
  }
  let over: [number, number] | null = null, R = 10 + 12 * value;
  const B = register(stage, (dt, now) => {
    let moving = false, top = tiles[0];
    if (!over && !reducedMotion()) {
      moving = true;
      const gx = -14 + ((now / 1000) * 16) % 104, gy = 25 + 30 * (0.5 + 0.35 * Math.sin(now / 1300));
      for (const t of tiles) t.sp.t = Math.max(t.rest, 6 * falloff(Math.hypot(t.cx - gx, t.cy - gy) / 13));
    }
    for (const t of tiles) {
      if (stepS(t.sp, dt)) moving = true;
      if (t.sp.t > top.sp.t) top = t;
      const L = t.sp.x;
      if (L === t.drawn) continue;
      t.drawn = L;
      t.el.setAttribute("d", poly([at(t.x0, t.t0, L * 0.2), at(t.x1, t.t0, L * 0.2), at(t.x1, t.t1, L), at(t.x0, t.t1, L)]));
    }
    for (const t of tiles) t.el.setAttribute("class", t === top && t.sp.t > 1 ? "hi" : t.sp.x > 2 ? "sil" : "");
    return moving;
  });
  bag.add(B.unregister);
  const retarget = () => {
    for (const t of tiles) t.sp.t = over ? 10 * falloff(Math.hypot(t.cx - over[0], t.cy - over[1]) / R) : t.rest;
    B.wake();
  };
  bag.add(pointer(stage, {
    move: (p) => { over = unproj(C, p[0], p[1], 41); retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { R = 10 + 12 * v; if (over) retarget(); }, destroy: bag.dispose };
};

/* ---------- Fencing: a scalloped picket fence; pickets rise under the pointer ---------- */

const fencing: FigureMount = ({ stage, svg }, value) => {
  const bag = disposer();
  const N = 10, SP = 9, LIFT = 15;
  const h0 = (i: number) => 34 + 9 * Math.sin((Math.PI * i) / (N - 1));
  const { P, front, g } = stageOf(svg, 2.6, [[-10, -10, -3], [96, 12, -3], [96, -10, -3], [-10, 12, -3], [-6, 0, 60], [90, 0, 60], [40, 0, 64]]);
  const [gr, gi] = rings(-10, -10, 96, 12, 4, 1.5);
  put(solid(g), prism(P, front, gr, gi, -3, 0));
  for (const z of [11, 31]) { const [a, b] = rings(-4, -2.8, 90, -0.4, 0.8, 0.3); put(solid(g), prism(P, front, a, b, z, z + 3)); }
  const post = (x: number) => { const [a, b] = rings(x, -3.4, x + 5, 2.6, 1.2, 0.5); put(solid(g), prism(P, front, a, b, 0, 50)); };
  post(-7);
  const pk = Array.from({ length: N }, (_, i) => {
    const x0 = i * SP, ring = rrect(x0, 0, x0 + 6.4, 2.2, 0.8), inner = rrect(x0 + 0.4, 0.4, x0 + 6, 1.8, 0.4), tip = circAt(x0 + 3.2, 1.1, 0.5, 12);
    return { ring, inner, tip, sp: spring(h0(i), { eps: 0.03 }), el: solid(g), drawn: NaN, sx: P(x0 + 3.2, 1.1, 0)[0] };
  });
  post(88);
  let a = -1, reach = 1.5 + 2.5 * value;
  const B = register(stage, (dt, now) => {
    let moving = false, crest = -1;
    if (a < 0 && !reducedMotion()) {
      moving = true;
      const pos = ((now / 1000) * 3.2) % (N + 6) - 3;
      crest = Math.round(pos);
      pk.forEach((k, i) => { k.sp.t = h0(i) + 8 * Math.max(0, Math.cos((i - pos) * 0.75)) ** 2; });
    }
    pk.forEach((k, i) => {
      if (stepS(k.sp, dt)) moving = true;
      const h = k.sp.x;
      if (h !== k.drawn) {
        k.drawn = h;
        put(k.el, {
          sil: poly(hull(ringAt(P, k.ring, 0).concat(ringAt(P, k.ring, h), ringAt(P, k.tip, h + 5)))),
          crease: open(ringAt(P, run(k.inner, front), h)),
        });
      }
      k.el.sil.classList.toggle("hi", a >= 0 ? i === a : crest >= 0 ? i === crest : i === 4);
    });
    return moving;
  });
  bag.add(B.unregister);
  const retarget = () => {
    pk.forEach((k, i) => { k.sp.t = h0(i) + (a < 0 ? 0 : LIFT * Math.max(0, 1 - Math.abs(i - a) / reach)); });
    B.wake();
  };
  bag.add(pointer(stage, {
    move: (p) => {
      let best = 0;
      pk.forEach((k, i) => { if (Math.abs(k.sx - p[0]) < Math.abs(pk[best].sx - p[0])) best = i; });
      if (best !== a) { a = best; retarget(); }
    },
    leave: () => { a = -1; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = 1.5 + 2.5 * v; retarget(); }, destroy: bag.dispose };
};

/* ---------- Landscaping: a lawn with a tree; the grass parts around the pointer ---------- */

const landscaping: FigureMount = ({ stage, svg }, value) => {
  const bag = disposer();
  const { C, P, front, g } = stageOf(svg, 2.3, [[0, 0, -5], [96, 72, -5], [96, 0, -5], [0, 72, -5], [22, 20, 52]]);
  const TX = 22, TY = 20;
  const [lr, li] = rings(0, 0, 96, 72, 8, 2);
  put(solid(g), prism(P, front, lr, li, -5, 0));
  const stones = [[46, 62], [58, 52], [68, 41], [80, 32]];
  const tufts: { x: number; y: number; bx: number; by: number; sx: ReturnType<typeof spring>; sy: ReturnType<typeof spring> }[] = [];
  for (let i = 0; i < 11; i++) for (let j = 0; j < 8; j++) {
    const x = 6 + i * 8.4 + (j % 2) * 3, y = 6 + j * 8.4;
    if (x > 92 || y > 68 || Math.hypot(x - TX, y - TY) < 16 || stones.some(([sx, sy]) => Math.hypot(x - sx, y - sy) < 8)) continue;
    const bx = 1.6 + 0.8 * Math.sin(x * 0.2 + y * 0.1), by = -1.2 + 0.6 * Math.cos(x * 0.13 - y * 0.2);
    tufts.push({ x, y, bx, by, sx: spring(bx, { eps: 0.02 }), sy: spring(by, { eps: 0.02 }) });
  }
  const back = path(g, "nf");
  put(solid(g), prism(P, front, circAt(TX, TY, 2.6), null, 0, 20));
  const crown: Vec2[] = [];
  for (let k = 0; k <= 8; k++) { const a = (k / 8) * Math.PI; crown.push(...ringAt(P, circAt(TX, TY, 3 + 15 * Math.sin(a)), 34 - 16 * Math.cos(a))); }
  path(g, "hi", poly(hull(crown)));
  path(g, "nf lo", open(ringAt(P, run(circAt(TX, TY, 15), front), 30)) + open(ringAt(P, run(circAt(TX, TY, 10.5), front), 42)));
  for (const [sx, sy] of stones) put(solid(g), prism(P, front, rrect(sx - 5, sy - 3.6, sx + 5, sy + 3.6, 3.4), rrect(sx - 4, sy - 2.6, sx + 4, sy + 2.6, 2.4), 0, 1.2));
  const near = path(g, "nf");

  const BLADES: [number, number, number, number][] = [[-0.9, 0.5, 4.2, 0.8], [0, 0, 5.6, 1], [0.8, -0.4, 4, 0.9]];
  const draw = () => {
    let a = "", b = "";
    for (const t of tufts) {
      let d = "";
      for (const [ox, oy, h, k] of BLADES) d += seg(P(t.x + ox, t.y + oy, 0), P(t.x + ox + t.sx.x * k, t.y + oy + t.sy.x * k, h));
      if (t.x + t.y < TX + TY + 20) a += d; else b += d;
    }
    back.setAttribute("d", a); near.setAttribute("d", b);
  };
  let over: [number, number] | null = null, R = 12 + 12 * value;
  const B = register(stage, (dt, now) => {
    const breeze = !reducedMotion(), s = now / 1000;
    let moving = breeze;
    for (const t of tufts) {
      const dx = t.x - (over?.[0] ?? 0), dy = t.y - (over?.[1] ?? 0), d = Math.max(0.5, Math.hypot(dx, dy));
      const push = over && d < R ? 6 * (1 - d / R) : 0;
      const wx = breeze ? 1.5 * Math.sin(s * 1.9 - t.x * 0.09 - t.y * 0.05) : 0, wy = breeze ? 0.7 * Math.sin(s * 1.4 - t.y * 0.08) : 0;
      t.sx.t = t.bx + wx + (dx / d) * push; t.sy.t = t.by + wy + (dy / d) * push;
      if (stepS(t.sx, dt)) moving = true;
      if (stepS(t.sy, dt)) moving = true;
    }
    draw();
    return moving;
  });
  bag.add(B.unregister);
  const retarget = () => B.wake();
  bag.add(pointer(stage, {
    move: (p) => { over = unproj(C, p[0], p[1], 0); retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { R = 12 + 12 * v; }, destroy: bag.dispose };
};

/* ---------- Pest control: a pump sprayer; pumping builds pressure and mist ---------- */

const pest: FigureMount = ({ stage, svg }) => {
  const bag = disposer();
  const { C, P, front, g } = stageOf(svg, 2.1, [[4, 4, -4], [104, 60, -4], [104, 4, -4], [4, 60, -4], [30, 30, 88], [118, 30, 54]]);
  const [gr, gi] = rings(4, 4, 104, 60, 8, 2);
  put(solid(g), prism(P, front, gr, gi, -4, 0));
  put(solid(g), prism(P, front, circAt(30, 30, 15, 48), null, 0, 44));
  path(g, "nf lo", open(ringAt(P, run(circAt(30, 30, 15, 48), front), 12)) + open(ringAt(P, run(circAt(30, 30, 15, 48), front), 34)));
  put(solid(g), taper(P, front, circAt(30, 30, 15, 48), circAt(30, 30, 7, 32), circAt(30, 30, 6.2, 32), 44, 51));
  put(solid(g), prism(P, front, circAt(30, 30, 5.5), circAt(30, 30, 4.7), 51, 55));
  const rod = path(g, "nf sil");
  const handle = solid(g);
  path(g, "nf sil", open([P(43, 37, 6), P(54, 48, 1.5), P(66, 50, 4), P(72, 46, 14)]));
  const [hr, hn] = rings(70, 44, 75, 48, 1.6, 0.6);
  put(solid(g), prism(P, front, hr, hn, 12, 24));
  path(g, "nf sil", seg(P(73, 45, 22), P(100, 36, 38)) + seg(P(73, 47.4, 21), P(100, 38.4, 37)));
  const nozzle = flatDot(g, C, 1.3, "dot");
  place(nozzle, P(100.5, 37.2, 37.6));
  const mist = Array.from({ length: 18 }, () => ({ el: flatDot(g, C, 0.9, "dot m"), x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, age: 9 }));
  for (const m of mist) m.el.setAttribute("visibility", "hidden");

  const ph = spring(22, { eps: 0.05 });
  let pressure = 0.25, acc = 0, lastH = 22, drawnH = NaN;
  const B = register(stage, (dt) => {
    stepS(ph, dt);
    const h = ph.x;
    if (h !== drawnH) {
      drawnH = h;
      rod.setAttribute("d", seg(P(30, 30, 55), P(30, 30, 55 + h)));
      const [a, b] = rings(28.6, 21, 31.4, 39, 1.3, 0.5);
      put(handle, prism(P, front, a, b, 55 + h, 57.6 + h));
    }
    pressure = clamp(pressure + Math.max(0, lastH - h) * 0.045 - dt * 0.3, 0.18, 1);
    lastH = h;
    if (reducedMotion()) return false;
    acc += dt;
    const every = 1 / lerp(5, 30, pressure);
    while (acc > every) {
      acc -= every;
      const m = mist.find((x) => x.age > 0.9);
      if (!m) break;
      const s = 26 + 30 * pressure;
      Object.assign(m, { x: 100.5, y: 37.2, z: 37.6, vx: s, vy: -s * 0.3 + (Math.random() - 0.5) * 16, vz: s * 0.35 + (Math.random() - 0.5) * 14, age: 0 });
    }
    for (const m of mist) {
      if (m.age > 0.9) { m.el.setAttribute("visibility", "hidden"); continue; }
      m.age += dt; m.x += m.vx * dt; m.y += m.vy * dt; m.z += m.vz * dt; m.vz -= 14 * dt;
      m.el.removeAttribute("visibility");
      m.el.setAttribute("class", m.age < 0.45 ? "dot m" : "dot off");
      place(m.el, P(m.x, m.y, m.z));
    }
    return true;
  });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (p) => { ph.t = lerp(30, 6, clamp((p[1] - 40) / 220, 0, 1)); B.wake(); },
    leave: () => { ph.t = 22; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
};

/* ---------- Cleaning: a tiled floor and a mop bucket; tiles shine where you sweep ---------- */

const cleaning: FigureMount = ({ stage, svg }, value) => {
  const bag = disposer();
  const { C, P, front, g } = stageOf(svg, 2.2, [[-3, -3, -4], [93, 78, -4], [93, -3, -4], [-3, 78, -4], [16, 16, 30], [6, 30, 60]]);
  const T = 15, BX = 16, BY = 16;
  const [pr, pi] = rings(-3, -3, 93, 78, 6, 2);
  put(solid(g), prism(P, front, pr, pi, -4, 0));
  const tiles: { cx: number; cy: number; ring: Ring; inner: Ring; rest: number; gloss: number; el: ReturnType<typeof solid>; dot: SVGEllipseElement; drawn: number }[] = [];
  const order: [number, number][] = [];
  for (let i = 0; i < 6; i++) for (let j = 0; j < 5; j++) order.push([i, j]);
  order.sort((a, b) => a[0] + a[1] - b[0] - b[1]);
  const bucketAt = order.findIndex(([i, j]) => i + j > 2);
  const bucket = () => {
    put(solid(g), taper(P, front, circAt(BX, BY, 9, 48), circAt(BX, BY, 11.5, 48), null, 1.2, 19));
    path(g, "nf", poly(ringAt(P, circAt(BX, BY, 10.4, 48), 19)));
    path(g, "nf sil", seg(P(BX + 3, BY + 3, 10), P(4, 32, 62)));
    const arc: Vec2[] = [];
    for (let k = 0; k <= 16; k++) { const t = (k / 16) * Math.PI; arc.push(P(BX + 11.5 * Math.cos(t), BY, 19 + 10 * Math.sin(t))); }
    path(g, "nf sil", open(arc));
  };
  order.forEach(([i, j], n) => {
    if (n === bucketAt) bucket();
    const x0 = i * T, y0 = j * T, streak = Math.abs(i - j - 0.5) < 1 ? 0.3 : 0;
    const rest = i === 3 && j === 2 ? 0.8 : streak;
    const el = solid(g);
    tiles.push({ cx: x0 + 6.8, cy: y0 + 6.8, ring: rrect(x0, y0, x0 + 13.6, y0 + 13.6, 2.2), inner: rrect(x0 + 0.8, y0 + 0.8, x0 + 12.8, y0 + 12.8, 1.4), rest, gloss: rest, el, dot: flatDot(g, C, 0.9, "dot"), drawn: NaN });
  });
  let over: [number, number] | null = null, R = 9 + 10 * value;
  const B = register(stage, (dt, now) => {
    let moving = false;
    const s = now / 1000, sweep: [number, number] | null = over ?? (reducedMotion() ? null : [45 + 36 * Math.sin(s * 0.8), 37 + 28 * Math.sin(s * 1.3)]);
    const r = over ? R : 11;
    for (const t of tiles) {
      if (sweep) {
        const d = Math.hypot(t.cx - sweep[0], t.cy - sweep[1]);
        if (d < r) t.gloss = Math.max(t.gloss, 1 - (d / r) * 0.5);
      }
      if (t.gloss !== t.rest) { moving = true; t.gloss = t.gloss > t.rest ? Math.max(t.rest, t.gloss - dt / 1.8) : t.rest; }
      const h = 1.2 + 2.8 * t.gloss;
      if (h !== t.drawn) {
        t.drawn = h;
        put(t.el, prism(P, front, t.ring, t.inner, 0, h));
        t.el.sil.setAttribute("class", t.gloss > 0.6 ? "sil hi" : "sil");
        t.dot.setAttribute("visibility", t.gloss > 0.6 ? "visible" : "hidden");
        place(t.dot, P(t.cx + 2.5, t.cy - 2.5, h));
      }
    }
    return moving || !!sweep;
  });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (p) => { over = unproj(C, p[0], p[1], 2); B.wake(); },
    leave: () => { over = null; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { R = 9 + 10 * v; }, destroy: bag.dispose };
};

/* ---------- Healthcare: a booking calendar; the day under the pointer lifts ---------- */

const healthcare: FigureMount = ({ stage, svg }) => {
  const bag = disposer();
  const { C, P, front, g } = stageOf(svg, 2.25, [[0, 0, 0], [90, 70, 0], [90, 0, 0], [0, 70, 0], [45, 35, 22]]);
  const S = 11.6, KEY = 9.6, FREE = 1.4, BOOKED = 4.2, UP = 10;
  const booked = new Set(["1,0", "4,0", "2,1", "5,1", "0,2", "3,2", "6,3", "2,3"]), today = "3,1";
  const [sr, si] = rings(0, 0, 90, 70, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, 8));
  const [hr, hi] = rings(4, 4, 86, 15, 3, 1);
  put(solid(g), prism(P, front, hr, hi, 8, 12));
  for (let k = 0; k < 6; k++) place(flatDot(g, C, 0.9, "dot m"), P(14 + k * 12.4, 9.5, 12));
  const order: [number, number][] = [];
  for (let i = 0; i < 7; i++) for (let j = 0; j < 4; j++) order.push([i, j]);
  order.sort((a, b) => a[0] + a[1] - b[0] - b[1]);
  const keys = order.map(([i, j]) => {
    const x0 = 6 + i * S, y0 = 20 + j * S, id = `${i},${j}`, rest = booked.has(id) || id === today ? BOOKED : FREE;
    const [ring, inner] = rings(x0, y0, x0 + KEY, y0 + KEY, 2, 0.7);
    const el = solid(g), mark = booked.has(id) || id === today ? flatDot(g, C, 0.9, id === today ? "dot" : "dot m") : null;
    return { i, j, id, ring, inner, rest, el, mark, tw: tween(rest), drawn: NaN, cx: x0 + KEY / 2, cy: y0 + KEY / 2 };
  });
  let over: { i: number; j: number } | null = null, idle: { i: number; j: number } | null = null, step = -1, idleAt = 0, hovering = false;
  const WALK: [number, number][] = [[0, 0], [1, 1], [2, 0], [3, 1], [4, 2], [5, 1], [6, 2], [5, 3], [4, 3], [3, 2], [2, 3], [1, 2]];
  // Declared ahead: the first tick runs inside register() and may already retarget.
  let B: ReturnType<typeof register> | undefined = undefined;
  B = register(stage, (_dt, now) => {
    let moving = false;
    // Idle: a booking hops from day to day, the way a week fills, until the pointer takes over.
    if (!hovering && !reducedMotion()) {
      moving = true;
      if (now - idleAt > 1100) { idleAt = now; step = (step + 1) % WALK.length; idle = { i: WALK[step][0], j: WALK[step][1] }; over = idle; retarget(); }
    }
    for (const k of keys) {
      const h = tval(k.tw, now);
      if (!tdone(k.tw, now)) moving = true;
      const lit = over ? k.i === over.i && k.j === over.j : k.id === today;
      k.el.sil.classList.toggle("hi", lit);
      if (h === k.drawn) continue;
      k.drawn = h;
      put(k.el, prism(P, front, k.ring, k.inner, 8, 8 + h));
      if (k.mark) place(k.mark, P(k.cx, k.cy, 8 + h));
    }
    return moving;
  });
  bag.add(B.unregister);
  function retarget() {
    const now = performance.now();
    for (const k of keys) {
      if (!over) { tset(k.tw, k.rest, now, 0); continue; }
      const d = Math.abs(k.i - over.i) + Math.abs(k.j - over.j);
      tset(k.tw, d === 0 ? UP : d === 1 ? Math.max(k.rest, 5.5) : k.rest, now, d * 40);
    }
    B?.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const q = unproj(C, p[0], p[1], 9.5);
      const i = Math.floor((q[0] - 6) / S), j = Math.floor((q[1] - 20) / S);
      const next = i >= 0 && i < 7 && j >= 0 && j < 4 ? { i, j } : null;
      hovering = true;
      if (next?.i !== over?.i || next?.j !== over?.j) { over = next; retarget(); }
    },
    leave: () => { hovering = false; over = null; idleAt = 0; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
};

/**
 * Mounts one Hairline trade figure and draws it in once: the first time the
 * card scrolls into view every stroke traces itself back to front, then the
 * drawing stays and answers the pointer. Nothing replays on hover.
 */
export function drawIn(stage: HTMLElement, svg: SVGSVGElement): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const all = Array.from(svg.querySelectorAll<SVGGeometryElement>("path,ellipse"));
  const lines = all.filter((e) => !e.classList.contains("dot"));
  const dots = all.filter((e) => e.classList.contains("dot"));
  // pathLength 1 keeps the dash honest while the figure rewrites its paths; the
  // stroke scales with the svg for the trace so the dash is in path units.
  for (const e of lines) {
    e.setAttribute("pathLength", "1");
    Object.assign(e.style, { strokeDasharray: "1 1", strokeDashoffset: "1", vectorEffect: "none" });
  }
  for (const d of dots) d.style.opacity = "0";

  let anims: Animation[] = [];
  const clear = () => {
    for (const e of lines) {
      e.removeAttribute("pathLength");
      Object.assign(e.style, { strokeDasharray: "", strokeDashoffset: "", vectorEffect: "" });
    }
    for (const d of dots) d.style.opacity = "";
    anims.forEach((a) => a.cancel());
    anims = [];
  };
  const io = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return;
    io.disconnect();
    const span = 1300, n = Math.max(1, lines.length - 1);
    lines.forEach((e, i) => anims.push(e.animate(
      [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
      { duration: 1000, delay: (i / n) * span, easing: "cubic-bezier(.32,.72,0,1)", fill: "forwards" },
    )));
    dots.forEach((d) => anims.push(d.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: span + 400, fill: "forwards" })));
    Promise.all(anims.map((a) => a.finished)).then(clear, () => {});
  }, { threshold: 0.35 });
  io.observe(stage);
  return () => { io.disconnect(); anims.forEach((a) => a.cancel()); };
}

export const TRADE_FIGURES: Record<string, FigureMount> = {
  Wind: hvac,
  Droplets: plumbing,
  Zap: electrical,
  HardHat: roofing,
  Fence: fencing,
  Trees: landscaping,
  Bug: pest,
  SprayCan: cleaning,
  HeartPulse: healthcare,
};
