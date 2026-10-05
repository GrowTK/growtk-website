"use client";

import * as React from "react";
import { AnimatePresence, animate, motion, useAnimationControls, useMotionValue, useReducedMotion } from "motion/react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { NoiseTexture } from "@/components/blocks/magicui/noise-texture";
import { handFont } from "@/lib/hand-font";
import { groowt } from "@/content/groowt";
import { usePathname, useRouter } from "next/navigation";
import { groowtStore, useGroowt, type GroowtMood } from "@/components/mascot/groowt-store";

/**
 * Groowt: the Growtk mascot, a small rounded-square bird. Body is a yellow-to-orange
 * gradient with magicui's NoiseTexture grain, clipped to an irregular blob;
 * eyes, beak, wing, tail and feet are drawn over it in the same ink as the
 * sticky-note doodles. Everything is drawn in an 88 × 88 box and scaled to
 * `size`, so the corner bird, the big one on /groowt and the chat avatar are
 * the same drawing.
 *
 * Life: bobs while idle, blinks, wags now and then, watches the pointer,
 * hops and flaps on hover, and opens the chat on tap (see groowt-chat.tsx).
 * Moods come from the shared store: "thinking" looks up and tilts his head
 * while a reply is on its way, "talking" works his beak while it streams in.
 * The corner variant also flies in and greets once. Under prefers-reduced-motion it just sits
 * there (blinks and speech only).
 */

const BOX = 88;
export const INK = "#2a2a2e";
// A soft, slightly irregular rounded square. Shared by the colour clip.
export const BODY = "M30 15 C38 13.5 54 13.5 62 15 C71 16.5 76 21.5 77 31 C78 40 78 52 76.5 60 C75 69 70 74.5 61 75.5 C52 76.8 38 76.8 29 75.5 C20 74 15 69 14 60 C12.8 51 12.8 39 14 30 C15.2 21 20.5 16.2 30 15 Z";
export const BELLY = "M45 50 C56 48.5 66 49 69 54 C71.5 59 70 67 65 70 C58 73 47 73 42.5 69 C39 65.5 39.5 53 45 50 Z";
export const WING = "M29 47 C22 51 23 62 32 64 C41 66 46 58 43 51 C40 45 33 44 29 47 Z";
export const TAIL = "M17 50 C8 49 3 43 4 38 C9 41 13 43 17 44 C11 39 10 33 12 30 C17 35 20 40 22 45 Z";
// The ink line for the body: deliberately not the fill's outline. Drawn
// freehand around it, slightly off, and left open at the top like a sketch.
export const BODY_LINE = "M47 14.7 C55 14.6 62 15.2 66 16.5 C73 18.6 76 23.5 76.6 32 C77.4 41 77.2 52 75.8 60.5 C74.4 69 69.4 73.8 60.6 74.8 C51.5 75.9 38.5 75.8 29.6 74.6 C21 73.4 16.2 68.6 15.1 59.8 C14 51 14.1 39.5 15.3 30.6 C16.5 21.8 21.4 17 30.2 15.8 C33.5 15.4 36.8 15.1 40.2 15";
// Beak on the face, between and just under the eyes, pointing forward.
export const BEAK = "M52 43.6 Q57.6 41.4 63.6 43.8 Q61.4 49.6 57 50.4 Q53 49.2 52 43.6 Z";
export const BEAK_LINE = "M52.4 43.4 Q57.8 41.6 63.2 44.2 Q60.8 49.4 56.8 50.2 Q53.4 48.6 52.4 43.4";

/** Misregistration: every colour layer sits this far off its ink line. */
export const MIS = { x: 2.4, y: 1.8 };

// Spread wing, for flying: a soft bird's wing reaching up and out, its trailing
// edge four rounded flight feathers. Drawn for the left side; the right is its mirror.
export const WING_SPREAD = "M26.5 37.5 C18 31.5 6 25.5 -10.5 19.5 Q-13.6 26.4 -5.6 29.2 Q-8 35.6 0.6 36.6 Q-0.4 42.6 7.8 42.8 Q7.6 48.6 15.8 47.8 Q17.6 52.8 26.2 51.4 Z";
export const WING_SPREAD_LINES = "M24.6 41.6 Q10 34 -5.6 29.2 M24.4 44.6 Q12.6 39 0.6 36.6 M24.8 47.6 Q15.6 43.8 7.8 42.8 M25.6 39.4 Q19.4 39.4 16.6 44.6";
/** Mirror a path of absolute x,y pairs across the bird's centre line. */
const mirrorX = (d: string, axis = 92) => {
  let i = 0;
  return d.replace(/-?\d*\.?\d+/g, (n) => (i++ % 2 === 0 ? String(Math.round((axis - Number(n)) * 100) / 100) : n));
};
export const WING_SPREAD_R = mirrorX(WING_SPREAD);
export const WING_SPREAD_LINES_R = mirrorX(WING_SPREAD_LINES);
// Laughing: the beak hangs open, all teeth.
const MOUTH_TOP = "M51.6 42.4 Q57.6 40 64 42.8 Q60.6 45.2 57.6 45.4 Q54 45 51.6 42.4 Z";
const MOUTH_OPEN = "M53 44.4 Q57.6 46.6 62.6 44.4 Q61.4 52.6 57.6 53.4 Q53.8 52.6 53 44.4 Z";

export const EYES = [
  { cx: 50, cy: 36, r: 6.6 },
  { cx: 64.5, cy: 35, r: 5.6 },
];
/** Nudge for the beak below its drawn position (0 = as drawn). */
const BEAK_DROP = 0;

export function Groowt({
  variant = "corner",
  size = BOX,
  className,
}: {
  /** corner: fixed bottom right, greets, toggles the chat. stage: big, opens the chat. avatar: decoration in the chat header. */
  variant?: "corner" | "stage" | "avatar";
  size?: number;
  className?: string;
}) {
  const { open: chatOpen, mood, travel, game } = useGroowt();
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const body = useAnimationControls();
  const wing = useAnimationControls();
  const tail = useAnimationControls();
  const ref = React.useRef<HTMLButtonElement>(null);
  const [look, setLook] = React.useState({ x: 0, y: 0 });
  const [blink, setBlink] = React.useState(false);
  const [happy, setHappy] = React.useState(false);
  const [say, setSay] = React.useState<string | null>(null);
  const sayTimer = React.useRef<number | undefined>(undefined);
  const corner = variant === "corner";
  // Dragging (corner only): where he has been dragged to, whether he is in
  // someone's hand right now, and whether that pointer gesture was a drag
  // (so letting go doesn't also count as a tap that opens the chat).
  const dx = useMotionValue(0);
  const dy = useMotionValue(0);
  const [dragging, setDragging] = React.useState(false);
  const [bounds, setBounds] = React.useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const dragged = React.useRef(false);
  const flyHome = React.useRef<number | undefined>(undefined);
  const flight = React.useRef<{ stop: () => void }[]>([]);
  const homeRef = React.useRef<HTMLDivElement>(null);
  const boundsRef = React.useRef({ left: 0, right: 0, top: 0, bottom: 0 });
  // Holding on: how long he has been held, how far he has puffed up, and the pop.
  const [held, setHeld] = React.useState(false);
  const holdTimer = React.useRef<number | undefined>(undefined);
  const holdPhase = React.useRef(0);
  const inflate = useMotionValue(1);
  const tilt = useMotionValue(0);
  const [popped, setPopped] = React.useState(false);
  const poppedRef = React.useRef(false);
  const [burst, setBurst] = React.useState<{ id: number; x: number; y: number } | null>(null);
  // Flying (wings spread) and laughing (after he comes back from the pop).
  const [flying, setFlying] = React.useState(false);
  const [laughing, setLaughing] = React.useState(false);
  const laughTimer = React.useRef<number | undefined>(undefined);
  // The Play button beside him: shown while he (or it) is hovered.
  const [showPlay, setShowPlay] = React.useState(false);
  const playHide = React.useRef<number | undefined>(undefined);
  const peekPlay = (on: boolean) => {
    window.clearTimeout(playHide.current);
    if (on) {
      setShowPlay(true);
      // Start downloading the game the moment Play shows up, so pressing it opens instantly.
      void import("@/components/mascot/groowt-game");
    }
    else playHide.current = window.setTimeout(() => setShowPlay(false), 700);
  };
  // Throwing: the fling speed at release, the spin he picks up, and the parachute back.
  const throwVel = React.useRef({ x: 0, y: 0 });
  const spin = useMotionValue(0);
  const [parachute, setParachute] = React.useState(false);
  const avatar = variant === "avatar";
  const roughId = "groowt-rough-" + React.useId().replace(/[^a-zA-Z0-9-]/g, "");
  const [seed, setSeed] = React.useState(1);
  const scale = size / BOX;

  const speak = React.useCallback((text: string, ms = 3600) => {
    setSay(text);
    window.clearTimeout(sayTimer.current);
    sayTimer.current = window.setTimeout(() => setSay(null), ms);
  }, []);

  // Greeting, once, after the landing (corner only).
  React.useEffect(() => {
    if (!corner) return;
    const t = window.setTimeout(() => speak(groowt.greeting, 4200), reduce ? 900 : 2300);
    return () => window.clearTimeout(t);
  }, [corner, reduce, speak]);

  // Blink every few seconds, at a slightly irregular rhythm.
  React.useEffect(() => {
    let t: number;
    const loop = () => {
      t = window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => setBlink(false), 140);
        loop();
      }, 2600 + Math.random() * 2600);
    };
    loop();
    return () => window.clearTimeout(t);
  }, []);

  // Line boil: the wobble re-seeds a few times a second, like frames redrawn by hand.
  React.useEffect(() => {
    if (reduce || game) return;
    const id = window.setInterval(() => setSeed((n) => (n % 4) + 1), 160);
    return () => window.clearInterval(id);
  }, [reduce, game]);

  // A wag every so often.
  React.useEffect(() => {
    if (reduce) return;
    if (game) return;
    const id = window.setInterval(() => tail.start({ rotate: [0, -16, 9, -6, 0], transition: { duration: 0.7, ease: "easeInOut" } }), 5200);
    return () => window.clearInterval(id);
  }, [reduce, tail, game]);

  // Eyes follow the pointer.
  React.useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const dx = e.clientX - (r.left + r.width * 0.6), dy = e.clientY - (r.top + r.height * 0.4);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / (220 * scale)) * 1.9;
      setLook({ x: (dx / d) * k, y: (dy / d) * k });
    };
    if (game) return;
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [scale, game]);

  const hop = () => {
    if (reduce) return;
    body.start({ y: [0, -14 * scale, 0, -4 * scale, 0], scaleY: [1, 1.04, 0.92, 1.02, 1], transition: { duration: 0.6, ease: "easeOut" } });
    wing.start({ rotate: [0, -38, 8, -26, 0], transition: { duration: 0.55, ease: "easeInOut" } });
    tail.start({ rotate: [0, 14, -8, 0], transition: { duration: 0.5 } });
  };

  /* ---------- grabbing him: shout, protest, inflate, pop, come back; or a slow lap home ---------- */

  const flap = (on: boolean) => {
    if (reduce) return;
    if (on) {
      wing.start({ rotate: [0, -44, 12, -44, 0], transition: { duration: 0.32, repeat: Infinity, ease: "easeInOut" } });
      tail.start({ rotate: [0, 18, -12, 18, 0], transition: { duration: 0.4, repeat: Infinity } });
    } else {
      wing.start({ rotate: 0, transition: { duration: 0.2 } });
      tail.start({ rotate: 0, transition: { duration: 0.2 } });
    }
  };

  // Keep him on screen: the drag and the lap can go as far as the window edges.
  const measureBounds = () => {
    const r = homeRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = dx.get(), y = dy.get();
    const b = { left: -(r.left - x), right: window.innerWidth - (r.right - x), top: -(r.top - y), bottom: window.innerHeight - (r.bottom - y) };
    boundsRef.current = b;
    setBounds(b);
  };

  const stopFlight = () => {
    window.clearTimeout(flyHome.current);
    flight.current.forEach((a) => a.stop());
    flight.current = [];
  };

  // Bank into the turns while he flies: tilt follows horizontal speed.
  React.useEffect(
    () =>
      dx.on("change", () => {
        if (!reduce) tilt.set(Math.max(-18, Math.min(18, dx.getVelocity() / 45)));
      }),
    [dx, tilt, reduce],
  );

  /** Let go: straight off on a slow flight around the screen, then home. */
  const lapHome = () => {
    measureBounds();
    const b = boundsRef.current;
    const rnd = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
    const xs = [dx.get(), rnd(b.left * 0.85, b.left * 0.15), rnd(b.left * 0.9, b.left * 0.4), rnd(b.left * 0.5, b.left * 0.05), 0];
    const ys = [dy.get(), rnd(b.top * 0.8, b.top * 0.2), rnd(b.top * 0.5, b.top * 0.05), rnd(b.top * 0.9, b.top * 0.35), 0];
    setFlying(true);
    const opts = reduce ? { duration: 0.01 } : { duration: 6.5, times: [0, 0.27, 0.52, 0.78, 1], ease: "easeInOut" as const };
    const a = animate(dx, reduce ? 0 : xs, opts);
    const c = animate(dy, reduce ? 0 : ys, opts);
    flight.current = [a, c];
    Promise.all([a.finished, c.finished]).then(() => {
      if (!flight.current.length) return;
      flight.current = [];
      tilt.set(0);
      setFlying(false);
      hop();
    }, () => {});
  };

  /** Held too long: pop into feathers, then rise back up from below the screen, laughing. */
  const pop = () => {
    window.clearInterval(holdTimer.current);
    const r = ref.current?.getBoundingClientRect();
    if (r) setBurst({ id: Date.now(), x: r.left + r.width / 2, y: r.top + r.height / 2 });
    poppedRef.current = true;
    // The hold is over: forget it, so letting go of the mouse later doesn't start a lap.
    holdPhase.current = 0;
    dragged.current = false;
    // End the drag gesture Motion is still tracking (the pointer may well still be down),
    // or it keeps steering x/y and he comes back wherever he was being held.
    window.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerId: 1, isPrimary: true }));
    setPopped(true);
    setDragging(false);
    setHeld(false);
    setSay(null);
    flap(false);
    stopFlight();
    inflate.set(1);
    tilt.set(0);
    dx.set(0);
    dy.set(0);
    flyHome.current = window.setTimeout(() => {
      dx.set(0);
      dy.set(0);
      const home = homeRef.current?.getBoundingClientRect();
      dy.set(home ? window.innerHeight - home.top + 40 : 400);
      poppedRef.current = false;
      setPopped(false);
      setBurst(null);
      setFlying(true);
      const rise = animate(dy, 0, reduce ? { duration: 0.01 } : { type: "spring", stiffness: 60, damping: 11 });
      flight.current = [rise];
      rise.finished.then(() => {
        flight.current = [];
        setFlying(false);
        setLaughing(true);
        speak(groowt.drag.reborn, 4800);
        window.clearTimeout(laughTimer.current);
        laughTimer.current = window.setTimeout(() => setLaughing(false), 4600);
      }, () => {});
    }, 2800);
  };

  /** Thrown off the screen: a beat offstage, then he floats back down from the top on a parachute. */
  const parachuteBack = () => {
    measureBounds();
    const b = boundsRef.current;
    const x0 = b.left * (0.25 + Math.random() * 0.55);
    spin.set(0);
    dx.set(x0);
    dy.set(b.top - size * 2.4); // above the top edge, chute and all
    setParachute(true);
    const opts = reduce ? { duration: 0.01 } : { duration: 6.5, ease: "easeInOut" as const };
    const sway = 55;
    const a = animate(dx, reduce ? 0 : [x0, x0 + sway, x0 * 0.66 - sway, x0 * 0.33 + sway * 0.6, 0], { ...opts, times: [0, 0.25, 0.5, 0.75, 1] });
    const c = animate(dy, 0, reduce ? { duration: 0.01 } : { duration: 6.5, ease: [0.3, 0, 0.4, 1] });
    flight.current = [a, c];
    Promise.all([a.finished, c.finished]).then(() => {
      if (!flight.current.length) return;
      flight.current = [];
      tilt.set(0);
      setParachute(false);
      hop();
      speak(groowt.drag.landed, 2800);
    }, () => {});
  };

  /** Flung hard: keep his momentum, spinning. Off the screen means a parachute back; otherwise fly home. */
  const throwHim = (vx: number, vy: number) => {
    measureBounds();
    const b = boundsRef.current;
    const speed = Math.hypot(vx, vy);
    const k = Math.min(1, 2600 / speed); // cap the throw so he can't vanish into the next postcode
    const x0 = dx.get(), y0 = dy.get();
    let x1 = x0 + vx * k * 0.55;
    let y1 = y0 + vy * k * 0.55 + 90; // a little gravity
    const margin = size * 0.6;
    const off = x1 < b.left - margin || x1 > b.right + margin || y1 < b.top - margin || y1 > b.bottom + margin;
    if (off) {
      // Make sure he really clears the edge.
      x1 += Math.sign(vx) * size * 2;
      y1 += Math.sign(vy) * size * 2;
    } else {
      x1 = Math.max(b.left, Math.min(b.right, x1));
      y1 = Math.max(b.top, Math.min(b.bottom, y1));
    }
    speak(groowt.drag.thrown, 1600);
    setFlying(true);
    const opts = reduce ? { duration: 0.01 } : { duration: 0.75, ease: [0.15, 0.6, 0.35, 1] as [number, number, number, number] };
    const a = animate(dx, x1, opts);
    const c = animate(dy, y1, opts);
    const r = animate(spin, spin.get() + Math.sign(vx || 1) * (off ? 900 : 540), opts);
    flight.current = [a, c, r];
    Promise.all([a.finished, c.finished]).then(() => {
      if (!flight.current.length) return;
      flight.current = [];
      spin.set(0);
      setFlying(false);
      if (off) {
        setSay(null);
        flyHome.current = window.setTimeout(parachuteBack, 900);
      } else {
        lapHome();
      }
    }, () => {});
  };

  /* ---------- tour guide: take off with the visitor, change page, land ---------- */

  const arriving = React.useRef<string | null>(null);

  /** Fly in from above the screen and land in the corner, then say "here you go". */
  const land = () => {
    measureBounds();
    const b = boundsRef.current;
    dx.set(b.left * 0.35);
    dy.set(b.top - size * 2);
    setFlying(true);
    const opts = reduce ? { duration: 0.01 } : { duration: 1.5, ease: [0.2, 0.8, 0.3, 1] as [number, number, number, number] };
    const a = animate(dx, 0, opts);
    const c = animate(dy, 0, opts);
    flight.current = [a, c];
    Promise.all([a.finished, c.finished]).then(() => {
      flight.current = [];
      tilt.set(0);
      setFlying(false);
      hop();
      speak(groowt.travel.arrived, 5500);
    }, () => {});
  };

  // The chat asked him to fly the visitor somewhere: take off up and out, then go.
  React.useEffect(() => {
    if (!corner || !travel) return;
    groowtStore.clearTravel();
    stopFlight();
    window.clearInterval(holdTimer.current);
    setParachute(false);
    spin.set(0);
    speak(groowt.travel.going, 1800);
    measureBounds();
    const b = boundsRef.current;
    setFlying(true);
    const go = () => {
      arriving.current = travel;
      router.push(travel);
      // Same page (a #section link): the path won't change, so land on a timer.
      if (travel.split("#")[0] === pathname) window.setTimeout(() => {
        if (arriving.current) {
          arriving.current = null;
          land();
        }
      }, 450);
    };
    if (reduce) return go();
    const opts = { duration: 1.1, ease: [0.55, 0, 0.8, 0.3] as [number, number, number, number] };
    const a = animate(dx, b.left * 0.35, opts);
    const c = animate(dy, b.top - size * 2.2, opts);
    flight.current = [a, c];
    Promise.all([a.finished, c.finished]).then(go, () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travel, corner]);

  // New page: if he was flying the visitor here, land.
  React.useEffect(() => {
    if (!corner || !arriving.current) return;
    if (arriving.current.split("#")[0] !== pathname) return;
    arriving.current = null;
    land();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, corner]);

  /** Released: a real fling is a throw; anything gentler is a flight home. */
  const afterRelease = () => {
    const { x, y } = throwVel.current;
    throwVel.current = { x: 0, y: 0 };
    if (!reduce && Math.hypot(x, y) > 900) throwHim(x, y);
    else lapHome();
  };

  /** Pointer down on him: start the hold clock. */
  const startHold = () => {
    stopFlight();
    setParachute(false);
    spin.set(0);
    throwVel.current = { x: 0, y: 0 };
    window.clearInterval(holdTimer.current);
    holdPhase.current = 0;
    const t0 = performance.now();
    holdTimer.current = window.setInterval(() => {
      const t = (performance.now() - t0) / 1000;
      if (t >= 0.6 && holdPhase.current < 1) {
        holdPhase.current = 1;
        dragged.current = true; // a long press is not a tap
        setHeld(true);
        speak(groowt.drag.shout, 60_000);
        flap(true);
      }
      if (t >= 2 && holdPhase.current < 2) {
        holdPhase.current = 2;
        speak(groowt.drag.stop, 60_000);
      }
      if (t >= 4 && holdPhase.current < 3) {
        holdPhase.current = 3;
        speak(groowt.drag.inflating, 60_000);
      }
      if (t >= 6.4 && holdPhase.current < 4) {
        holdPhase.current = 4;
        speak(groowt.drag.gonnaPop, 60_000);
      }
      if (t >= 4) {
        // From 4s: balloon up fast, accelerating, to ~4.6x, wobbling harder the fuller he gets.
        const k = Math.min(1, (t - 4) / 4.2);
        inflate.set(1 + 3.6 * Math.pow(k, 1.5) + (reduce ? 0 : Math.sin(t * 18) * 0.05 * (0.3 + k)));
      }
      if (t >= 8.4) pop();
    }, 50);
  };

  /** Pointer up anywhere: deflate if puffed, and if he was grabbed, a lap home. */
  const endHold = () => {
    window.clearInterval(holdTimer.current);
    if (poppedRef.current) return;
    const wasHeld = holdPhase.current > 0 || dragged.current;
    holdPhase.current = 0;
    setHeld(false);
    setDragging(false);
    if (inflate.get() > 1.01) animate(inflate, 1, reduce ? { duration: 0.01 } : { type: "spring", stiffness: 300, damping: 9 });
    if (!wasHeld) return;
    flap(false);
    setSay(null);
    // A beat later, not now: Motion's own drag-end runs on this same pointerup and would
    // stop a flight started in the same tick. 80ms is invisible but lets it finish first.
    flyHome.current = window.setTimeout(afterRelease, 80);
  };

  React.useEffect(() => {
    if (!corner) return;
    window.addEventListener("pointerup", endHold);
    window.addEventListener("pointercancel", endHold);
    return () => {
      window.removeEventListener("pointerup", endHold);
      window.removeEventListener("pointercancel", endHold);
      window.clearInterval(holdTimer.current);
      window.clearTimeout(flyHome.current);
      window.clearTimeout(laughTimer.current);
      window.clearTimeout(playHide.current);
    };
    // endHold only reads refs and stable setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corner]);

  const onDragStart = () => {
    if (poppedRef.current) return;
    setDragging(true);
    setHappy(false);
    if (holdPhase.current < 1) {
      speak(groowt.drag.shout, 60_000);
      flap(true);
    }
  };

  const onTap = () => {
    if (dragged.current) {
      dragged.current = false;
      return;
    }
    hop();
    setSay(null);
    if (corner) groowtStore.toggle();
    else if (!avatar) groowtStore.open();
  };

  // Hop when a reply starts streaming in, like he is about to speak.
  const prevMood = React.useRef<GroowtMood>(mood);
  React.useEffect(() => {
    if (prevMood.current === "thinking" && mood === "talking") hop();
    prevMood.current = mood;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood]);

  const thinking = mood === "thinking";
  const grabbed = dragging || held;
  const talking = (mood === "talking" || grabbed) && !reduce;
  // While thinking he looks up and away, whatever the pointer is doing.
  const eyes = thinking ? { x: 1.4, y: -1.8 } : look;
  const squint = (happy || laughing) && !blink && !thinking && !grabbed;

  return (
    <div
      className={cn(corner ? "pointer-events-none fixed right-4 bottom-3 z-50 sm:right-6 sm:bottom-5" : "relative", className)}
      style={{ width: size, display: game && corner ? "none" : undefined }}
    >
      {/* The draggable layer (corner only): carries the bird and his bubble together. */}
      <motion.div
        ref={homeRef}
        className="relative"
        style={{ x: dx, y: dy, opacity: popped ? 0 : 1, pointerEvents: popped ? "none" : undefined }}
        drag={corner && !popped}
        dragMomentum={false}
        dragElastic={0.08}
        dragConstraints={bounds}
        onPointerDownCapture={() => {
          dragged.current = false;
          if (!corner) return;
          measureBounds();
          startHold();
        }}
        onDrag={() => {
          dragged.current = true;
        }}
        onDragStart={onDragStart}
        onDragEnd={(_, info) => {
          throwVel.current = { x: info.velocity.x, y: info.velocity.y };
        }}
        animate={grabbed && !reduce ? { rotate: [-8, 8, -8] } : { rotate: 0 }}
        transition={grabbed ? { duration: 0.35, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
      >
      {/* Speech bubble */}
      <AnimatePresence>
        {say && !chatOpen && !avatar && (
          <motion.div
            key={say}
            role="status"
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute bottom-full mb-1 w-max max-w-[220px] rounded-2xl bg-white px-3.5 py-2.5 text-[13px] leading-snug font-medium text-foreground shadow-[0_8px_24px_rgba(0,0,0,.12)] ring-1 ring-black/5",
              [groowt.drag.shout, groowt.drag.stop, groowt.drag.gonnaPop].includes(say) && "px-4 py-2 text-xl font-black tracking-wide",
              corner ? "right-2 origin-bottom-right rounded-br-md" : "left-[70%] origin-bottom-left rounded-bl-md text-base",
            )}
          >
            {say}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parachute: opens over him when he comes back from being thrown off the screen. */}
      <AnimatePresence>
        {parachute && (
          <motion.div
            key="chute"
            aria-hidden
            className="pointer-events-none absolute left-1/2"
            style={{ width: size * 1.6, bottom: size * 0.8, marginLeft: -size * 0.8, transformOrigin: "50% 100%" }}
            initial={{ scaleY: 0.2, scaleX: 0.5, opacity: 0 }}
            animate={{ scaleY: 1, scaleX: 1, opacity: 1, rotate: reduce ? 0 : [-5, 5, -5] }}
            exit={{ scaleY: 0.1, scaleX: 0.4, opacity: 0, y: size * 0.5, transition: { duration: 0.4 } }}
            transition={{ scaleY: { type: "spring", stiffness: 220, damping: 14 }, scaleX: { type: "spring", stiffness: 220, damping: 14 }, opacity: { duration: 0.2 }, rotate: { duration: 2.2, repeat: Infinity, ease: "easeInOut" } }}
          >
            <Parachute />
          </motion.div>
        )}
      </AnimatePresence>

      {/* The corner bird flies in from the right; the big one drops in. */}
      <motion.div
        initial={reduce || avatar ? false : corner ? { x: 140, y: -90, rotate: 18, opacity: 0 } : { y: -40, opacity: 0 }}
        animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
        transition={{ delay: corner ? 1 : 0.2, type: "spring", stiffness: 120, damping: 14 }}
      >
        {/* Idle bob */}
        <motion.div style={{ rotate: tilt }} animate={reduce ? undefined : { y: [0, -2.5 * scale, 0] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}>
          {/* Balloon: he swells from the middle while held on to. Laughing: he shakes with it. */}
          <motion.div
            style={{ scale: inflate, transformOrigin: "50% 60%" }}
            animate={laughing && !reduce ? { y: [0, -3 * scale, 0, -2 * scale, 0], rotate: [0, -3, 2, -2, 0] } : { y: 0, rotate: 0 }}
            transition={laughing ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
          >
          <motion.div style={{ rotate: spin }}>
          <motion.button
            ref={ref}
            type="button"
            aria-label={groowt.label}
            aria-hidden={avatar || undefined}
            tabIndex={avatar ? -1 : undefined}
            aria-expanded={corner ? chatOpen : undefined}
            onClick={onTap}
            onHoverStart={() => {
              setHappy(true);
              hop();
              if (corner) peekPlay(true);
            }}
            onHoverEnd={() => {
              setHappy(false);
              if (corner) peekPlay(false);
            }}
            animate={body}
            className={cn("pointer-events-auto relative block rounded-full", corner ? (grabbed ? "cursor-grabbing" : "cursor-grab") : "cursor-pointer", "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2")}
            style={{ width: size, height: size, transformOrigin: "50% 100%" }}
          >
            {/* The drawing lives in its own 88 × 88 box, scaled to `size`. */}
            <div aria-hidden className="absolute top-0 left-0" style={{ width: BOX, height: BOX, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
              <motion.div
                className="absolute inset-0"
                animate={thinking && !reduce ? { rotate: [-7, -3, -7] } : { rotate: 0 }}
                transition={thinking ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
                style={{ transformOrigin: "46px 80px" }}
              >
              {/* Printed like a cheap two-pass job: the colour layers come down first, a little off
                  register, then the ink line lands slightly out of step with them. */}

              {/* Tail (and, in flight, the far wing), behind the body: colour off-register, ink on top. */}
              <svg viewBox={`0 0 ${BOX} ${BOX}`} className="absolute inset-0 overflow-visible">
                {flying &&
                  ([
                    { d: WING_SPREAD, lines: WING_SPREAD_LINES, origin: "26px 44px", beat: [-22, 26, -22] },
                    { d: WING_SPREAD_R, lines: WING_SPREAD_LINES_R, origin: "66px 44px", beat: [22, -26, 22] },
                  ] as const).map((w, i) => (
                    <motion.g
                      key={i}
                      filter={`url(#${roughId})`}
                      animate={reduce ? undefined : { rotate: [...w.beat] }}
                      transition={{ duration: 0.34, repeat: Infinity, ease: "easeInOut" }}
                      style={{ transformBox: "view-box", transformOrigin: w.origin }}
                    >
                      <path d={w.d} fill="#FFB25C" transform={`translate(${MIS.x} ${MIS.y})`} />
                      <path d={w.d} fill="none" stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
                      <path d={w.lines} fill="none" stroke={INK} strokeWidth={0.9} strokeLinecap="round" opacity={0.5} />
                    </motion.g>
                  ))}
                <motion.g animate={tail} filter={`url(#${roughId})`} style={{ transformBox: "view-box", transformOrigin: "20px 47px" }}>
                  <path d={TAIL} fill="#F59E5B" transform={`translate(${MIS.x} ${MIS.y})`} />
                  <path d={TAIL} fill="none" stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
                </motion.g>
              </svg>

              {/* Body colour: gradient + noise, clipped to the blob, smaller than the ink line and
                  pushed off centre, so it sits inside it slightly displaced, like a misprint. */}
              <div className="absolute inset-0" style={{ transform: `translate(${MIS.x + 0.6}px, ${MIS.y + 0.8}px) scale(0.95)`, transformOrigin: "46px 46px" }}>
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: `path('${BODY}')`,
                    background: "radial-gradient(120% 90% at 35% 22%, #FFF3B0 0%, #FFDE59 34%, #FFC46E 72%, #FFA867 100%)",
                  }}
                >
                  <NoiseTexture frequency={0.9 * scale} octaves={4} slope={0.8} noiseOpacity={0.6} className="opacity-40 mix-blend-multiply" />
                </div>
              </div>

              {/* Everything else */}
              <svg viewBox={`0 0 ${BOX} ${BOX}`} className="absolute inset-0 overflow-visible">
                <defs>
                  {/* Hand-drawn wobble: turbulence nudges every stroke a little off true. */}
                  <filter id={roughId} x="-10%" y="-10%" width="120%" height="120%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves={2} seed={seed} result="wobble" />
                    <feDisplacementMap in="SourceGraphic" in2="wobble" scale={1.8} xChannelSelector="R" yChannelSelector="G" />
                  </filter>
                </defs>
                <ellipse cx={46} cy={84} rx={18} ry={2.6} fill="rgba(0,0,0,.14)" />
                <g filter={`url(#${roughId})`}>
                {/* Feet: an orange pass, and a thin ink pass a touch off it. */}
                <g strokeLinecap="round" fill="none">
                  <g stroke="#F2A15A" strokeWidth={2.8} transform={`translate(${MIS.x * 0.6} ${MIS.y * 0.5})`}>
                    <path d="M40 74 q0.4 3.6 0 7" />
                    <path d="M54 73.5 q-0.3 3.8 0.2 7.2" />
                    <path d="M35.5 82 q4.5 -3 9 0" />
                    <path d="M49.8 81.5 q4.6 -3 9.2 0.3" />
                  </g>
                  <g stroke={INK} strokeWidth={1.1} opacity={0.8}>
                    <path d="M40 74 q0.4 3.6 0 7" />
                    <path d="M54 73.5 q-0.3 3.8 0.2 7.2" />
                    <path d="M35.5 82 q4.5 -3 9 0" />
                    <path d="M49.8 81.5 q4.6 -3 9.2 0.3" />
                  </g>
                </g>
                <path d={BELLY} fill="#FFF6D2" opacity={0.75} transform={`translate(${MIS.x} ${MIS.y})`} />
                {/* Body line: loose, open at the top, not the fill's outline. */}
                <path d={BODY_LINE} fill="none" stroke={INK} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
                {/* A lighter second pass, the way a pen goes back over a line. */}
                <path d={BODY_LINE} fill="none" stroke={INK} strokeWidth={0.8} strokeLinecap="round" opacity={0.45} transform="translate(-0.9 0.7) rotate(-1.2 46 46)" />
                <path d="M42 14.5 q-2.6 -7.6 3.8 -9.6 q-1.4 4.4 2.6 7.2" fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
                {/* Wing: folded at rest; in flight, spread long and wide and beating. Colour off-register, ink on top. */}
                {flying ? null : (
                  <motion.g animate={wing} style={{ transformBox: "view-box", transformOrigin: "40px 49px" }}>
                    <path d={WING} fill="#FFB25C" transform={`translate(${MIS.x} ${MIS.y})`} />
                    <path d={WING} fill="none" stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
                    <path d="M31 56 q5 2 9 0" fill="none" stroke={INK} strokeWidth={1.1} strokeLinecap="round" opacity={0.5} />
                  </motion.g>
                )}
                {/* Laughing: beak thrown open, two rows of teeth, jaw going "hehehe". */}
                {laughing ? (
                  <motion.g
                    animate={reduce ? undefined : { y: [0, 1.2, 0, 1.2, 0] }}
                    transition={{ duration: 0.36, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <path d={MOUTH_OPEN} fill="#7a2a3a" />
                    <g fill="#fff" stroke={INK} strokeWidth={0.5}>
                      {[54.4, 56.2, 58, 59.8].map((x) => (
                        <rect key={`t${x}`} x={x} y={44.6} width={1.7} height={2.1} rx={0.4} />
                      ))}
                      {[55.3, 57.1, 58.9].map((x) => (
                        <rect key={`b${x}`} x={x} y={50.2} width={1.7} height={1.9} rx={0.4} />
                      ))}
                    </g>
                    <path d="M55.6 52.2 q2 -1.6 4 0" fill="#ff8fa3" />
                    <path d={MOUTH_OPEN} fill="none" stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />
                    <path d={MOUTH_TOP} fill="#FF9F43" transform={`translate(${MIS.x * 0.6} ${MIS.y * 0.6})`} />
                    <path d={MOUTH_TOP} fill="none" stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />
                  </motion.g>
                ) : (
                <motion.g
                  animate={talking ? { scaleY: [1, 0.55, 1.12, 0.7, 1] } : { scaleY: 1 }}
                  transition={talking ? { duration: 0.42, repeat: Infinity, ease: "easeInOut" } : { duration: 0.15 }}
                  style={{ transformBox: "view-box", transformOrigin: `57.6px ${43 + BEAK_DROP}px` }}
                >
                  <g transform={`translate(0 ${BEAK_DROP})`}>
                  <path d={BEAK} fill="#FF9F43" transform={`translate(${MIS.x * 0.8} ${MIS.y * 0.8})`} />
                  <path d={BEAK_LINE} fill="none" stroke={INK} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M53.6 45.6 q3.6 1.2 8.4 -0.6" fill="none" stroke={INK} strokeWidth={1} strokeLinecap="round" opacity={0.55} />
                  </g>
                </motion.g>
                )}
                {EYES.map((e, i) =>
                  squint ? (
                    <path
                      key={i}
                      d={`M${e.cx - e.r * 0.8} ${e.cy + 1} q${e.r * 0.8} ${-e.r * 1.1} ${e.r * 1.6} 0`}
                      fill="none"
                      stroke={INK}
                      strokeWidth={1.8}
                      strokeLinecap="round"
                    />
                  ) : (
                    <motion.g
                      key={i}
                      animate={{ scaleY: blink ? 0.08 : 1 }}
                      transition={{ duration: 0.07 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      <circle cx={e.cx} cy={e.cy} r={e.r} fill="#fff" stroke={INK} strokeWidth={1.5} />
                      <circle cx={e.cx + eyes.x} cy={e.cy + eyes.y} r={e.r * (grabbed ? 0.3 : 0.56)} fill={INK} />
                      <circle cx={e.cx + eyes.x + 1.1} cy={e.cy + eyes.y - 1.2} r={1.1} fill="#fff" />
                    </motion.g>
                  ),
                )}
                </g>
              </svg>
              </motion.div>
            </div>
          </motion.button>
          </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
      </motion.div>
      {/* Play: appears to his left while he's hovered (always shown on touch screens, which can't hover). */}
      {corner && !chatOpen && !grabbed && !flying && !popped && !parachute && (
        <motion.button
          type="button"
          onClick={() => {
            setShowPlay(false);
            groowtStore.play();
          }}
          onMouseEnter={() => peekPlay(true)}
          onMouseLeave={() => peekPlay(false)}
          onFocus={() => peekPlay(true)}
          onBlur={() => peekPlay(false)}
          aria-label={groowt.game.playLabel}
          initial={false}
          animate={{ opacity: showPlay ? 1 : 0, x: showPlay ? 0 : 10, scale: showPlay ? 1 : 0.9 }}
          whileHover={{ y: -2, rotate: -2 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
          className={cn(
            "absolute right-full bottom-4 mr-2 inline-flex cursor-pointer items-center gap-1.5 rounded-md border-2 border-[#2a2a2e] bg-white px-3 py-1.5 text-sm font-bold whitespace-nowrap text-[#2a2a2e] shadow-[3px_3px_0_0_#FFDE59] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a2a2e]/40 focus-visible:ring-offset-2",
            showPlay ? "pointer-events-auto" : "pointer-events-none [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:!opacity-100 [@media(hover:none)]:!transform-none",
          )}
        >
          <Play aria-hidden className="size-3.5 fill-current" />
          {groowt.game.play}
        </motion.button>
      )}
      {burst && <FeatherBurst key={burst.id} x={burst.x} y={burst.y} word={groowt.drag.pop} />}
    </div>
  );
}

/* ---------- the pop ---------- */

const FEATHER_COLORS = ["#FFDE59", "#FFC46E", "#FFA867", "#FFF3B0", "#F59E5B"];

/** One small feather: a leaf of colour, an ink outline and quill, drawn in a 20 × 40 box. */
function Feather({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 20 40" width="20" height="40" className="overflow-visible">
      <path d="M10 2 C17 9 17 25 10 37 C3 25 3 9 10 2 Z" fill={color} transform="translate(1.2 0.9)" />
      <path d="M10 2 C17 9 17 25 10 37 C3 25 3 9 10 2" fill="none" stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M10 6 Q10.6 22 10 39" fill="none" stroke={INK} strokeWidth={1.1} strokeLinecap="round" />
      <path d="M10 14 L14 11 M10 20 L5.5 17 M10 26 L14.2 23" fill="none" stroke={INK} strokeWidth={0.8} strokeLinecap="round" opacity={0.6} />
    </svg>
  );
}

/**
 * Groowt popping: feathers burst out from where he was, spin, then flutter
 * down and fade; a "POP!" and a shock ring flash at the centre. Fixed to the
 * viewport and never in the way of the page.
 */
function FeatherBurst({ x, y, word }: { x: number; y: number; word: string }) {
  const reduce = useReducedMotion();
  const feathers = React.useMemo(
    () =>
      Array.from({ length: 160 }, (_, i) => {
        // Spread across the whole screen: some close, most flung far out to the edges.
        const reach = Math.max(window.innerWidth, window.innerHeight);
        const angle = Math.random() * Math.PI * 2;
        const dist = 80 + Math.pow(Math.random(), 0.6) * reach * 0.85;
        return {
          id: i,
          tx: Math.cos(angle) * dist,
          ty: Math.sin(angle) * dist * 0.8,
          fall: 160 + Math.random() * 360,
          spin: (Math.random() - 0.5) * 900,
          scale: 0.5 + Math.random() * 0.9,
          delay: Math.random() * 0.12,
          dur: 2.2 + Math.random() * 1.6,
          color: FEATHER_COLORS[i % FEATHER_COLORS.length]!,
        };
      }),
    [],
  );

  return (
    <div aria-hidden className={cn(handFont.variable, "pointer-events-none fixed inset-0 z-[70] overflow-hidden")}>
      <div className="absolute" style={{ left: x, top: y }}>
        {/* Shock ring */}
        <motion.span
          className="absolute -top-10 -left-10 size-20 rounded-full border-[3px] border-[#2a2a2e]"
          initial={{ scale: 0.3, opacity: 0.9 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
        {/* POP! */}
        <motion.span
          className="absolute -translate-x-1/2 -translate-y-1/2 text-5xl font-black whitespace-nowrap text-[#2a2a2e]"
          style={{ fontFamily: "var(--font-hand), cursive", textShadow: "3px 3px 0 #FFDE59" }}
          initial={{ scale: 0.2, rotate: -12, opacity: 0 }}
          animate={{ scale: [0.2, 1.35, 1], rotate: [-12, 6, -4], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.1, times: [0, 0.25, 0.5, 1] }}
        >
          {word}
        </motion.span>
        {feathers.map((f) => (
          <motion.span
            key={f.id}
            className="absolute -top-5 -left-2.5"
            initial={{ x: 0, y: 0, rotate: 0, scale: f.scale * 0.4, opacity: 1 }}
            animate={
              reduce
                ? { opacity: 0 }
                : {
                    x: [0, f.tx, f.tx + f.tx * 0.15],
                    y: [0, f.ty, f.ty + f.fall],
                    rotate: [0, f.spin * 0.6, f.spin],
                    scale: [f.scale * 0.4, f.scale, f.scale],
                    opacity: [1, 1, 0],
                  }
            }
            transition={{ duration: reduce ? 0.6 : f.dur, delay: f.delay, times: [0, 0.3, 1], ease: ["easeOut", "easeIn"] }}
          >
            <Feather color={f.color} />
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ---------- the parachute ---------- */

/**
 * A hand-drawn parachute in the sticky-note colours: a scalloped dome in
 * alternating gores, colour off register under the ink, with strings that
 * meet at his head. Drawn in a 120 × 110 box; the strings end at the bottom centre.
 */
function Parachute() {
  const gores = [
    { d: "M60 16 Q30 18 12 46 Q22 40 30 46 Q40 26 60 16 Z", fill: "#FFDE59" },
    { d: "M60 16 Q40 26 30 46 Q40 40 50 46 Q52 28 60 16 Z", fill: "#F2C4FF" },
    { d: "M60 16 Q52 28 50 46 Q60 40 70 46 Q68 28 60 16 Z", fill: "#FFBA7B" },
    { d: "M60 16 Q68 28 70 46 Q80 40 90 46 Q80 26 60 16 Z", fill: "#A8E6B8" },
    { d: "M60 16 Q80 26 90 46 Q98 40 108 46 Q90 18 60 16 Z", fill: "#FFDE59" },
  ];
  const anchors = [12, 30, 50, 70, 90, 108];
  return (
    <svg viewBox="0 0 120 110" className="block w-full overflow-visible">
      {gores.map((g, i) => (
        <path key={i} d={g.d} fill={g.fill} transform="translate(2 1.6)" />
      ))}
      {gores.map((g, i) => (
        <path key={`l${i}`} d={g.d} fill="none" stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />
      ))}
      {anchors.map((x) => (
        <path key={x} d={`M${x} 46 Q${(x + 60) / 2} ${80 + Math.abs(x - 60) * 0.15} 60 108`} fill="none" stroke={INK} strokeWidth={0.9} strokeLinecap="round" opacity={0.75} />
      ))}
      <path d="M50 30 q4 -7 12 -9" fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" opacity={0.85} />
    </svg>
  );
}
