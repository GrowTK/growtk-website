import { Cam, circ, facing, fit, poly, prism, proj, ringAt, rings, rrect, seg, unproj, type Camera, type Ring, type Vec3 } from "@/lib/hairline/iso";
import { reducedMotion, spring, stepS, tdone, tset, tval, tween } from "@/lib/hairline/motion";
import { disposer, flatDot, mk, place, pointer, put, register, solid, type FigureMount } from "@/lib/hairline/stage";

/**
 * Hairline figures for the five kinds of service an industry page lists
 * (see SERVICE_KIND below), in the same vocabulary as trade-figures.ts:
 * rounded solids, one stroke palette, tweens for discrete changes, springs
 * for the pointer. Each one idles on its own and answers the pointer.
 */

const circAt = (cx: number, cy: number, R: number, n = 40): Ring => circ(R, n).map((q) => ({ ...q, u: q.u + cx, v: q.v + cy }));

function stageOf(svg: SVGSVGElement, S: number, pts: Vec3[]) {
  const C: Camera = Cam(45, 0.5, S);
  fit(C, pts, 200, 166);
  return { C, P: proj(C), front: facing(C), g: mk("g", {}, svg) };
}

const path = (g: Element, cls: string, d = "") => mk("path", { class: cls, d }, g);

/* ---------- Site: a phone whose page builds itself, block by block ---------- */

const site: FigureMount = ({ stage, svg }) => {
  const bag = disposer();
  const { C, P, front, g } = stageOf(svg, 3.2, [[-4, -4, -4], [64, 94, -4], [64, -4, -4], [-4, 94, -4], [30, 45, 16]]);
  const [br, bi] = rings(-4, -4, 64, 94, 6, 1.6);
  put(solid(g), prism(P, front, br, bi, -4, 0));
  const [pr, pi] = rings(6, 4, 54, 86, 7, 1.8);
  put(solid(g), prism(P, front, pr, pi, 0, 6));
  path(g, "nf lo", poly(ringAt(P, rrect(10, 10, 50, 80, 4, 6), 6)));
  place(flatDot(g, C, 0.9, "dot m"), P(30, 83, 6));
  // Header, three content cards, and the call-to-action button.
  const spec = [
    { y0: 14, y1: 21, x0: 14, x1: 46 },
    { y0: 25, y1: 36, x0: 14, x1: 46 },
    { y0: 40, y1: 51, x0: 14, x1: 46 },
    { y0: 55, y1: 62, x0: 14, x1: 46 },
    { y0: 67, y1: 75, x0: 19, x1: 41, cta: true },
  ];
  const blocks = spec.map((b) => {
    const [ring, inner] = rings(b.x0, b.y0, b.x1, b.y1, b.cta ? 3.5 : 2, 0.7);
    return { ...b, ring, inner, el: solid(g), tw: tween(1.2), drawn: NaN };
  });
  let over = -1, idle = 0, idleAt = 0, hovering = false;
  let B: ReturnType<typeof register> | undefined;
  B = register(stage, (_dt, now) => {
    let moving = false;
    if (!hovering && !reducedMotion()) {
      moving = true;
      if (now - idleAt > 650) { idleAt = now; idle = (idle + 1) % (blocks.length + 2); over = idle < blocks.length ? idle : -1; retarget(); }
    }
    blocks.forEach((b, i) => {
      const h = tval(b.tw, now);
      if (!tdone(b.tw, now)) moving = true;
      b.el.sil.classList.toggle("hi", i === over || (over === -1 && !!b.cta));
      if (h === b.drawn) return;
      b.drawn = h;
      put(b.el, prism(P, front, b.ring, b.inner, 6, 6 + h));
    });
    return moving;
  });
  bag.add(B.unregister);
  function retarget() {
    const now = performance.now();
    blocks.forEach((b, i) => tset(b.tw, i === over ? 5 : b.cta ? 2.4 : 1.2, now, 0));
    B?.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const q = unproj(C, p[0], p[1], 7);
      const i = blocks.findIndex((b) => q[0] >= b.x0 - 2 && q[0] <= b.x1 + 2 && q[1] >= b.y0 - 2 && q[1] <= b.y1 + 2);
      hovering = true;
      if (i !== over) { over = i; retarget(); }
    },
    leave: () => { hovering = false; over = -1; idleAt = 0; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
};

/* ---------- Estimate: a calculator that types out a quote ---------- */

const estimate: FigureMount = ({ stage, svg }) => {
  const bag = disposer();
  const { C, P, front, g } = stageOf(svg, 3.1, [[-4, -4, -4], [70, 90, -4], [70, -4, -4], [-4, 90, -4], [33, 43, 18]]);
  const [pr, pi] = rings(-4, -4, 70, 90, 6, 1.6);
  put(solid(g), prism(P, front, pr, pi, -4, 0));
  const [br, bi] = rings(2, 2, 64, 84, 7, 1.8);
  put(solid(g), prism(P, front, br, bi, 0, 9));
  const [dr, di] = rings(8, 8, 58, 22, 3, 0.8);
  put(solid(g), prism(P, front, dr, di, 9, 10.5));
  const digits = Array.from({ length: 5 }, () => flatDot(g, C, 1, "dot off"));
  digits.forEach((d, k) => place(d, P(16 + k * 8.5, 15, 10.5)));
  const keys: { i: number; j: number; ring: Ring; inner: Ring; el: ReturnType<typeof solid>; tw: ReturnType<typeof tween>; drawn: number }[] = [];
  const order: [number, number][] = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) order.push([i, j]);
  order.sort((a, b) => a[0] + a[1] - b[0] - b[1]);
  for (const [i, j] of order) {
    const x0 = 8 + i * 13, y0 = 28 + j * 13.5;
    const [ring, inner] = rings(x0, y0, x0 + 10, y0 + 10, 2.2, 0.7);
    keys.push({ i, j, ring, inner, el: solid(g), tw: tween(3.2, 260), drawn: NaN });
  }
  let pressed: { i: number; j: number } | null = null, typed = 0, idleAt = 0, hovering = false;
  const SEQ: [number, number][] = [[0, 0], [2, 1], [1, 2], [3, 0], [1, 1], [3, 3]];
  let step = 0;
  let B: ReturnType<typeof register> | undefined;
  const press = (k: { i: number; j: number } | null) => {
    pressed = k;
    const now = performance.now();
    for (const key of keys) tset(key.tw, k && key.i === k.i && key.j === k.j ? 0.8 : 3.2, now, 0);
    if (k) { typed = (typed + 1) % (digits.length + 1); digits.forEach((d, n) => d.setAttribute("class", n < typed ? "dot" : "dot off")); }
    B?.wake();
  };
  B = register(stage, (_dt, now) => {
    let moving = false;
    if (!hovering && !reducedMotion()) {
      moving = true;
      if (now - idleAt > 520) {
        idleAt = now;
        if (pressed) press(null);
        else { press({ i: SEQ[step]![0], j: SEQ[step]![1] }); step = (step + 1) % SEQ.length; }
      }
    }
    for (const k of keys) {
      const h = tval(k.tw, now);
      if (!tdone(k.tw, now)) moving = true;
      k.el.sil.classList.toggle("hi", !!pressed && pressed.i === k.i && pressed.j === k.j);
      if (h === k.drawn) continue;
      k.drawn = h;
      put(k.el, prism(P, front, k.ring, k.inner, 9, 9 + h));
    }
    return moving;
  });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (p) => {
      const q = unproj(C, p[0], p[1], 12);
      const i = Math.floor((q[0] - 8) / 13), j = Math.floor((q[1] - 28) / 13.5);
      hovering = true;
      const next = i >= 0 && i < 4 && j >= 0 && j < 4 ? { i, j } : null;
      if (next?.i !== pressed?.i || next?.j !== pressed?.j) press(next);
    },
    leave: () => { hovering = false; idleAt = 0; press(null); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
};

/* ---------- Schedule: a renewal loop; a booking travels the ring of visits ---------- */

const schedule: FigureMount = ({ stage, svg }) => {
  const bag = disposer();
  const { C, P, front, g } = stageOf(svg, 3.0, [[-4, -4, -4], [84, 84, -4], [84, -4, -4], [-4, 84, -4], [40, 40, 16]]);
  const CX = 40, CY = 40, R = 28, N = 8;
  const [pr, pi] = rings(-4, -4, 84, 84, 8, 1.8);
  put(solid(g), prism(P, front, pr, pi, -4, 0));
  path(g, "nf lo", poly(ringAt(P, circAt(CX, CY, R, 64), 0)));
  const pads = Array.from({ length: N }, (_, k) => {
    const a = (k / N) * Math.PI * 2;
    const cx = CX + R * Math.cos(a), cy = CY + R * Math.sin(a);
    return { a, cx, cy, ring: circAt(cx, cy, 6.2, 32), inner: circAt(cx, cy, 5.4, 32), el: null as ReturnType<typeof solid> | null, dot: null as SVGEllipseElement | null, h: 1.4, drawn: NaN };
  }).sort((p, q) => p.cx + p.cy - q.cx - q.cy);
  // Hub drawn mid-order, so the far pads sit behind it and the near ones in front.
  const hubAt = pads.findIndex((p) => p.cx + p.cy > CX + CY);
  pads.forEach((p, n) => {
    if (n === hubAt) {
      put(solid(g), prism(P, front, circAt(CX, CY, 11, 48), circAt(CX, CY, 10, 48), 0, 9));
      path(g, "nf lo", poly(ringAt(P, circAt(CX, CY, 6, 32), 9)));
    }
    p.el = solid(g);
    p.dot = flatDot(g, C, 0.9, "dot m");
  });
  const token = flatDot(g, C, 1.5, "dot");
  const speed = spring(0.9);
  let th = 0;
  const B = register(stage, (dt) => {
    stepS(speed, dt);
    if (!reducedMotion()) th = (th + speed.x * dt) % (Math.PI * 2);
    for (const p of pads) {
      const d = Math.abs(((p.a - th + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      const target = 1.4 + 6 * Math.max(0, 1 - d / 0.7);
      p.h += (target - p.h) * Math.min(1, dt * 10);
      if (Math.abs(p.h - p.drawn) < 0.02) continue;
      p.drawn = p.h;
      put(p.el!, prism(P, front, p.ring, p.inner, 0, p.h));
      p.el!.sil.classList.toggle("hi", p.h > 4);
      place(p.dot!, P(p.cx, p.cy, p.h));
    }
    place(token, P(CX + R * Math.cos(th), CY + R * Math.sin(th), 9));
    return !reducedMotion();
  });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (p) => { const q = unproj(C, p[0], p[1], 0); speed.t = 0.9 + 3.2 * Math.max(0, 1 - Math.hypot(q[0] - CX, q[1] - CY) / 46); B.wake(); },
    leave: () => { speed.t = 0.9; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
};

/* ---------- Voice: a speaker puck; calls ripple out, faster when you lean in ---------- */

const voice: FigureMount = ({ stage, svg }) => {
  const bag = disposer();
  const { C, P, front, g } = stageOf(svg, 3.0, [[-4, -4, -4], [84, 84, -4], [84, -4, -4], [-4, 84, -4], [40, 40, 22]]);
  const CX = 40, CY = 40;
  const [pr, pi] = rings(-4, -4, 84, 84, 8, 1.8);
  put(solid(g), prism(P, front, pr, pi, -4, 0));
  const ripples = Array.from({ length: 4 }, () => ({ el: path(g, "nf lo"), r: -1 }));
  put(solid(g), prism(P, front, circAt(CX, CY, 15, 56), circAt(CX, CY, 14, 56), 0, 14));
  for (const r of [10.5, 7, 3.5]) path(g, r === 10.5 ? "nf" : "nf lo", poly(ringAt(P, circAt(CX, CY, r, 48), 14)));
  const led = flatDot(g, C, 1.2, "dot");
  place(led, P(CX + 12.2, CY - 2, 9));
  const rate = spring(0.9);
  let acc = 0;
  const B = register(stage, (dt) => {
    stepS(rate, dt);
    if (reducedMotion()) {
      ripples.forEach((rp, k) => rp.el.setAttribute("d", k < 2 ? poly(ringAt(P, circAt(CX, CY, 22 + k * 8, 56), 0)) : ""));
      return false;
    }
    acc += dt * rate.x;
    if (acc > 0.75) {
      acc = 0;
      const rp = ripples.find((x) => x.r < 0);
      if (rp) rp.r = 16;
    }
    for (const rp of ripples) {
      if (rp.r < 0) continue;
      rp.r += 14 * dt * Math.max(1, rate.x * 0.7);
      if (rp.r > 40) { rp.r = -1; rp.el.setAttribute("d", ""); continue; }
      rp.el.setAttribute("class", rp.r < 26 ? "nf sil" : "nf lo");
      rp.el.setAttribute("d", poly(ringAt(P, circAt(CX, CY, rp.r, 56), 0)));
    }
    led.setAttribute("class", acc < 0.2 ? "dot" : "dot m");
    return true;
  });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (p) => { const q = unproj(C, p[0], p[1], 0); rate.t = 0.9 + 3 * Math.max(0, 1 - Math.hypot(q[0] - CX, q[1] - CY) / 48); B.wake(); },
    leave: () => { rate.t = 0.9; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
};

/* ---------- Connect: three systems in a row, data passing between them ---------- */

const connect: FigureMount = ({ stage, svg }) => {
  const bag = disposer();
  const { C, P, front, g } = stageOf(svg, 2.8, [[-4, -4, -4], [104, 60, -4], [104, -4, -4], [-4, 60, -4], [50, 28, 20]]);
  const [pr, pi] = rings(-4, -4, 104, 60, 7, 1.8);
  put(solid(g), prism(P, front, pr, pi, -4, 0));
  path(g, "nf lo", seg(P(24, 28, 3), P(38, 28, 3)) + seg(P(62, 28, 3), P(76, 28, 3)));
  const boxes = [0, 38, 76].map((x0) => {
    const [ring, inner] = rings(x0, 16, x0 + 24, 40, 4, 1);
    return { x0, ring, inner, el: solid(g), tw: tween(9), drawn: NaN, light: flatDot(g, C, 0.9, "dot off") };
  });
  const packet = flatDot(g, C, 1.4, "dot");
  let over = -1, t = 0;
  let B: ReturnType<typeof register> | undefined;
  B = register(stage, (dt, now) => {
    let moving = false;
    if (!reducedMotion()) { t = (t + dt * 0.45) % 2; moving = true; }
    const u = t < 1 ? t : 2 - t;
    const x = 12 + u * 76;
    place(packet, P(x, 28, 3.6));
    boxes.forEach((b, i) => {
      const h = tval(b.tw, now);
      if (!tdone(b.tw, now)) moving = true;
      const near = Math.abs(x - (b.x0 + 12)) < 10;
      b.el.sil.classList.toggle("hi", i === over || near);
      b.light.setAttribute("class", near ? "dot" : "dot off");
      if (h === b.drawn) return;
      b.drawn = h;
      put(b.el, prism(P, front, b.ring, b.inner, 0, h));
      place(b.light, P(b.x0 + 12, 28, h));
    });
    return moving;
  });
  bag.add(B.unregister);
  const retarget = () => {
    const now = performance.now();
    boxes.forEach((b, i) => tset(b.tw, i === over ? 16 : 9, now, 0));
    B?.wake();
  };
  bag.add(pointer(stage, {
    move: (p) => {
      const q = unproj(C, p[0], p[1], 9);
      const i = boxes.findIndex((b) => q[0] >= b.x0 - 3 && q[0] <= b.x0 + 27 && q[1] >= 12 && q[1] <= 44);
      if (i !== over) { over = i; retarget(); }
    },
    leave: () => { over = -1; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
};

/* ---------- Rank: search results climb one by one; the top spot gets the pin ---------- */

const rank: FigureMount = ({ stage, svg }) => {
  const bag = disposer();
  const { C, P, front, g } = stageOf(svg, 3.0, [[-4, -4, -4], [88, 44, -4], [88, -4, -4], [-4, 44, -4], [70, 20, 26]]);
  const [pr, pi] = rings(-4, -4, 88, 44, 7, 1.8);
  put(solid(g), prism(P, front, pr, pi, -4, 0));
  path(g, "nf lo", seg(P(2, 34, 0), P(82, 34, 0)));
  const TOP = [4, 8, 12, 18];
  const bars = TOP.map((top, k) => {
    const x0 = 4 + k * 20;
    const [ring, inner] = rings(x0, 10, x0 + 14, 26, 3, 0.8);
    return { x0, top, ring, inner, el: solid(g), tw: tween(1.4, 520), drawn: NaN };
  });
  const pin = flatDot(g, C, 1.5, "dot");
  let up = 0, over = -1, idleAt = 0, hovering = false;
  let B: ReturnType<typeof register> | undefined;
  const retarget = () => {
    const now = performance.now();
    bars.forEach((b, i) => tset(b.tw, i === over ? b.top + 5 : i < up ? b.top : 1.4, now, 0));
    B?.wake();
  };
  B = register(stage, (_dt, now) => {
    let moving = false;
    if (!hovering && !reducedMotion()) {
      moving = true;
      if (now - idleAt > 640) { idleAt = now; up = (up + 1) % (bars.length + 3); retarget(); }
    } else if (reducedMotion() && up !== bars.length) { up = bars.length; retarget(); }
    bars.forEach((b, i) => {
      const h = tval(b.tw, now);
      if (!tdone(b.tw, now)) moving = true;
      const lead = i === bars.length - 1 && h > b.top - 1;
      b.el.sil.classList.toggle("hi", i === over || lead);
      if (lead) place(pin, P(b.x0 + 7, 18, h + 2));
      pin.setAttribute("class", bars[bars.length - 1]!.drawn > 15 ? "dot" : "dot off");
      if (h === b.drawn) return;
      b.drawn = h;
      put(b.el, prism(P, front, b.ring, b.inner, 0, h));
    });
    return moving;
  });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (p) => {
      const q = unproj(C, p[0], p[1], 8);
      const i = bars.findIndex((b) => q[0] >= b.x0 - 3 && q[0] <= b.x0 + 17 && q[1] >= 6 && q[1] <= 30);
      hovering = true;
      if (i !== over) { over = i; up = bars.length; retarget(); }
    },
    leave: () => { hovering = false; over = -1; idleAt = 0; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
};

export const SERVICE_FIGURES: Record<string, FigureMount> = { site, estimate, schedule, voice, connect, rank };

/** Every service icon used in content/industries/*.ts, grouped into the five figures. */
const SERVICE_KIND: Record<string, keyof typeof SERVICE_FIGURES> = {
  Smartphone: "site",
  Globe: "site",
  Ruler: "site",
  Calculator: "estimate",
  ClipboardCheck: "estimate",
  Bug: "estimate",
  SquareSplitVertical: "estimate",
  RefreshCw: "schedule",
  Repeat: "schedule",
  CalendarClock: "schedule",
  CalendarCheck: "schedule",
  CloudLightning: "schedule",
  Mic: "voice",
  PhoneCall: "voice",
  Headset: "voice",
  Siren: "voice",
  BellRing: "voice",
  Zap: "voice",
  Plug: "connect",
  Star: "connect",
  Search: "rank",
  TrendingUp: "rank",
};

export const serviceFigureFor = (icon?: string) => (icon && SERVICE_KIND[icon]) || "connect";
