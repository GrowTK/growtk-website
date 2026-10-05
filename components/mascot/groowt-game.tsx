"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Crosshair, Egg, Megaphone, Play, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { handFont } from "@/lib/hand-font";
import { groowt } from "@/content/groowt";
import { groowtStore, useGroowt } from "@/components/mascot/groowt-store";
import { BEAK, BEAK_LINE, BELLY, BODY, BODY_LINE, EYES, INK, MIS, TAIL, WING_SPREAD, WING_SPREAD_LINES, WING_SPREAD_R, WING_SPREAD_LINES_R } from "@/components/mascot/groowt";

/**
 * Groowt Flies: a small flappy-style game. Opening it asks for a name (and
 * optionally an email), shows the rules, and lets the owner know someone is
 * playing (/api/groowt-play). Then the screen turns to sky: Space or tap to
 * jump through hand-drawn pillars. Every 8 pillars Groowt glides down and lands
 * on the grass for a rest; Space takes off again.
 *
 * The world is one canvas (60fps, drawn from Groowt's own SVG paths through
 * Path2D, in the same off-register colour + ink style); the score, the start
 * hint and the game-over card are HTML on top. Opened from the store
 * (groowtStore.play()), mounted once in site-chrome.tsx.
 */

const BEST_KEY = "groowt-flies-best";
const PLAYER_KEY = "groowt-flies-player";
/** Pillars per stretch, back to back with no rest; after each stretch, a zombie stage. */
const REST_EVERY = 20;
const PILLAR_COLORS = ["#FFDE59", "#F2C4FF", "#FFBA7B", "#A8E6B8"];

type Pillar = { x: number; gapY: number; color: string; scored: boolean; top?: HTMLCanvasElement; bottom?: HTMLCanvasElement };
type Cloud = { x: number; y: number; s: number; v: number };
type Phase = "intro" | "ready" | "playing" | "landing" | "rest" | "zombies" | "cleared" | "takeoff" | "over";

/* ---------- drawing helpers ---------- */

const P = (d: string) => new Path2D(d);
let shapes: Record<string, Path2D> | null = null;
function getShapes() {
  if (!shapes) {
    shapes = {
      body: P(BODY),
      bodyLine: P(BODY_LINE),
      belly: P(BELLY),
      tail: P(TAIL),
      beak: P(BEAK),
      beakLine: P(BEAK_LINE),
      wingL: P(WING_SPREAD),
      wingLLines: P(WING_SPREAD_LINES),
      wingR: P(WING_SPREAD_R),
      wingRLines: P(WING_SPREAD_LINES_R),
      tuft: P("M42 14.5 q-2.6 -7.6 3.8 -9.6 q-1.4 4.4 2.6 7.2"),
      feet: P("M40 74 q0.4 3.6 0 7 M54 73.5 q-0.3 3.8 0.2 7.2 M35.5 82 q4.5 -3 9 0 M49.8 81.5 q4.6 -3 9.2 0.3"),
      cloud: P("M20 40 C8 40 4 28 14 24 C14 12 30 8 36 18 C42 6 62 8 62 22 C74 20 80 34 70 40 Z"),
    };
  }
  return shapes;
}

/** A gentle sketch: the main ink line, plus a lighter second pass that shifts each "boil" frame. */
function sketch(ctx: CanvasRenderingContext2D, path: Path2D, width: number, boil: number) {
  ctx.lineWidth = width;
  ctx.strokeStyle = INK;
  ctx.globalAlpha = 1;
  ctx.stroke(path);
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = width * 0.5;
  ctx.translate(boil % 2 ? 0.7 : -0.6, boil % 3 ? -0.5 : 0.6);
  ctx.stroke(path);
  ctx.restore();
}

type Palette = { wing: string; tail: string; body: [string, string, string, string]; belly: string; beak: string };
const GROOWT_PAL: Palette = { wing: "#FFB25C", tail: "#F59E5B", body: ["#FFF3B0", "#FFDE59", "#FFC46E", "#FFA867"], belly: "#FFF6D2", beak: "#FF9F43" };
/** Groowt's friends, one caged per zombie stage, in order (names in content/groowt.ts, game.zombies.friends). */
const FRIEND_PALS: Palette[] = [
  { wing: "#E7A6F5", tail: "#D98BEA", body: ["#FFF0FA", "#F9D2F6", "#F2C4FF", "#E3A3F2"], belly: "#FFF0FA", beak: "#FF9F43" },
  { wing: "#9CC8F5", tail: "#7DB2EE", body: ["#EEF7FF", "#CDE6FF", "#A6D2FF", "#86BDF5"], belly: "#F3F9FF", beak: "#FF9F43" },
  { wing: "#8FD7A2", tail: "#6FC487", body: ["#F0FFF4", "#CFF3DA", "#A8E6B8", "#86D69C"], belly: "#F2FFF6", beak: "#FF9F43" },
  { wing: "#B9A2E8", tail: "#A28BDE", body: ["#F6F1FF", "#E2D6FF", "#C9B6F7", "#B39CEB"], belly: "#F7F3FF", beak: "#FF9F43" },
  { wing: "#FFA494", tail: "#F58A78", body: ["#FFF1EE", "#FFD6CE", "#FFBDB1", "#FFA494"], belly: "#FFF3F0", beak: "#FF9F43" },
];

function drawGroowt(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number, flap: number, face: "fly" | "panic" | "dead", boil: number, look: { x: number; y: number }, pal: Palette = GROOWT_PAL) {
  const s = getShapes();
  const k = size / 88;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(k, k);
  ctx.translate(-46, -46);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // Wings, spread and beating, behind the body.
  const a = Math.sin(flap) * 0.42;
  for (const [wing, lines, ox, dir, fill] of [
    [s.wingL, s.wingLLines, 26, -1, pal.wing],
    [s.wingR, s.wingRLines, 66, 1, pal.wing],
  ] as const) {
    ctx.save();
    ctx.translate(ox, 44);
    ctx.rotate(dir * a);
    ctx.translate(-ox, -44);
    ctx.save();
    ctx.translate(MIS.x, MIS.y);
    ctx.fillStyle = fill;
    ctx.fill(wing);
    ctx.restore();
    sketch(ctx, wing, 1.4, boil);
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 0.9;
    ctx.stroke(lines);
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // Tail
  ctx.save();
  ctx.translate(MIS.x, MIS.y);
  ctx.fillStyle = pal.tail;
  ctx.fill(s.tail);
  ctx.restore();
  sketch(ctx, s.tail, 1.5, boil);

  // Body colour, off register and a touch small inside its line.
  ctx.save();
  ctx.translate(46 + MIS.x + 0.6, 46 + MIS.y + 0.8);
  ctx.scale(0.95, 0.95);
  ctx.translate(-46, -46);
  const g = ctx.createRadialGradient(31, 20, 2, 40, 42, 62);
  g.addColorStop(0, pal.body[0]);
  g.addColorStop(0.34, pal.body[1]);
  g.addColorStop(0.72, pal.body[2]);
  g.addColorStop(1, pal.body[3]);
  ctx.fillStyle = g;
  ctx.fill(s.body);
  ctx.restore();

  // Feet
  ctx.save();
  ctx.translate(MIS.x * 0.6, MIS.y * 0.5);
  ctx.strokeStyle = "#F2A15A";
  ctx.lineWidth = 2.8;
  ctx.stroke(s.feet);
  ctx.restore();
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.1;
  ctx.stroke(s.feet);
  ctx.globalAlpha = 1;

  // Belly, body line, tuft
  ctx.save();
  ctx.translate(MIS.x, MIS.y);
  ctx.globalAlpha = 0.75;
  ctx.fillStyle = pal.belly;
  ctx.fill(s.belly);
  ctx.restore();
  sketch(ctx, s.bodyLine, 1.7, boil);
  ctx.lineWidth = 1.6;
  ctx.stroke(s.tuft);

  // Beak
  ctx.save();
  ctx.translate(MIS.x * 0.8, MIS.y * 0.8);
  ctx.fillStyle = pal.beak;
  ctx.fill(s.beak);
  ctx.restore();
  ctx.lineWidth = 1.4;
  ctx.stroke(s.beakLine);

  // Eyes
  for (const e of EYES) {
    if (face === "dead") {
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(e.cx - e.r * 0.7, e.cy - e.r * 0.7);
      ctx.lineTo(e.cx + e.r * 0.7, e.cy + e.r * 0.7);
      ctx.moveTo(e.cx + e.r * 0.7, e.cy - e.r * 0.7);
      ctx.lineTo(e.cx - e.r * 0.7, e.cy + e.r * 0.7);
      ctx.stroke();
      continue;
    }
    ctx.beginPath();
    ctx.arc(e.cx, e.cy, e.r, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(e.cx + look.x, e.cy + look.y, e.r * (face === "panic" ? 0.3 : 0.56), 0, Math.PI * 2);
    ctx.fillStyle = INK;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(e.cx + look.x + 1.1, e.cy + look.y - 1.2, 1.1, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
  }
  ctx.restore();
}

function drawPillar(ctx: CanvasRenderingContext2D, x: number, top: number, h: number, w: number, color: string, capAtBottom: boolean, boil: number) {
  if (h <= 0) return;
  const lip = 12;
  const capH = Math.min(26, h);
  const capY = capAtBottom ? top + h - capH : top;
  const body = new Path2D();
  body.roundRect(x, capAtBottom ? top - 20 : top + capH - 6, w, h - capH + 26, 10);
  const cap = new Path2D();
  cap.roundRect(x - lip / 2, capY, w + lip, capH, 9);
  for (const path of [body, cap]) {
    ctx.save();
    ctx.translate(3.2, 2.4);
    ctx.fillStyle = color;
    ctx.fill(path);
    ctx.restore();
  }
  // A light streak down the pillar, like a highlight on paint.
  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = "#fff";
  ctx.fillRect(x + w * 0.2, capAtBottom ? top : top + capH, 5, Math.max(0, h - capH - 4));
  ctx.restore();
  ctx.lineJoin = "round";
  sketch(ctx, body, 2.2, boil);
  sketch(ctx, cap, 2.2, boil + 1);
}

/* ---------- zombie stage: ledges, cold-lead zombies, the Sticky-Note Blaster ---------- */

type Platform = { x: number; y: number; w: number; color: string };
/** free: walking and deadly. egg: sealed in egg, harmless, can be pushed, hatches out in time. roll: kicked, knocks out others. */
type Zombie = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  onGround: boolean;
  dir: 1 | -1;
  jumpAt: number;
  flash: number;
  wobble: number;
  speed: number;
  state: "free" | "egg" | "roll";
  cover: number;
  lastHit: number;
  hatchAt: number;
  rot: number;
  rollT: number;
  bounces: number;
  chain: number;
  dead: boolean;
};
/** Coats of egg it takes to seal a zombie in. */
const EGG_FULL = 4;
type Shot = { x: number; y: number; vx: number; vy: number; rot: number; life: number; big: boolean };
type Puff = { x: number; y: number; vx: number; vy: number; life: number; color: string; r: number };
type Pickup = { x: number; y: number; born: number; kind: "big" | "triple" };
type FloatText = { x: number; y: number; life: number; text: string };

/** The handwriting font, resolved for canvas (which can't read CSS variables). Set when the game opens. */
let HAND = "cursive";

const ZOMBIE_FILL = "#86B86A";
const ZOMBIE_SHIRT = "#B9A9D9";

let zShapes: Record<string, Path2D> | null = null;
function getZShapes() {
  if (!zShapes) {
    zShapes = {
      body: P("M30 20 C44 12 66 14 74 26 C80 40 80 64 76 80 C70 90 34 92 26 82 C20 66 20 34 30 20 Z"),
      line: P("M33 19 C46 13 65 15 73 27 C79 41 78.5 63 75 79 C69 89 35 90.5 27 81 C21.5 65 21 36 29.5 22"),
      stitches: P("M40 18 L42 26 M46 16 L47 24 M52 16 L52 24 M38 21 Q46 19 54 20"),
      mouth: P("M38 62 L42 58 L46 63 L50 58 L54 63 L58 58 L62 62"),
      megaphone: P("M4 10 L18 4 L18 22 L4 16 Z M18 6 L28 0 L28 26 L18 20"),
    };
  }
  return zShapes;
}

/** Make the ledges for a zombie stage, relative to the screen. */
function makePlatforms(W: number, H: number, groundTop: number): Platform[] {
  const spots: [number, number, number][] = [
    [0.05, 0.19, 0.24],
    [0.71, 0.19, 0.24],
    [0.37, 0.35, 0.26],
    [0.09, 0.51, 0.2],
    [0.71, 0.51, 0.2],
  ];
  return spots.map(([x, dy, w], i) => ({ x: W * x, y: groundTop - H * dy, w: W * w, color: PILLAR_COLORS[i % PILLAR_COLORS.length]! }));
}

/** A haunted ledge: a mossy stone slab with a dark wedge underneath, dripping green slime. */
function drawPlatform(ctx: CanvasRenderingContext2D, p: Platform, boil: number, t: number) {
  const h = 18;
  const slab = new Path2D();
  slab.roundRect(p.x, p.y, p.w, h, 8);
  const wedge = new Path2D();
  wedge.moveTo(p.x + 10, p.y + h - 3);
  wedge.lineTo(p.x + p.w - 10, p.y + h - 3);
  wedge.quadraticCurveTo(p.x + p.w * 0.72, p.y + h + 18, p.x + p.w * 0.56, p.y + h + 34);
  wedge.lineTo(p.x + p.w * 0.47, p.y + h + 40);
  wedge.quadraticCurveTo(p.x + p.w * 0.3, p.y + h + 16, p.x + 10, p.y + h - 3);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  for (const [path, fill] of [
    [wedge, "#4A3B5C"],
    [slab, "#8B7BA8"],
  ] as const) {
    ctx.save();
    ctx.translate(3, 2.4);
    ctx.fillStyle = fill;
    ctx.fill(path);
    ctx.restore();
    sketch(ctx, path, 2, boil);
  }
  // Cracks in the stone
  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  for (let x = p.x + 30; x < p.x + p.w - 20; x += 70) {
    ctx.moveTo(x, p.y + 4);
    ctx.lineTo(x + 5, p.y + 9);
    ctx.lineTo(x + 2, p.y + 14);
  }
  ctx.stroke();
  ctx.restore();
  // Slime along the top edge, with drips that stretch and wobble
  ctx.save();
  ctx.fillStyle = "#9BE36A";
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.2;
  const slime = new Path2D();
  slime.moveTo(p.x + 6, p.y + 1);
  slime.lineTo(p.x + p.w - 6, p.y + 1);
  slime.lineTo(p.x + p.w - 6, p.y + 5);
  let i = 0;
  for (let x = p.x + p.w - 14; x > p.x + 10; x -= 22) {
    const len = 6 + ((i * 7) % 11) + Math.sin(t * 2 + i) * 2.5;
    slime.lineTo(x + 4, p.y + 5);
    slime.quadraticCurveTo(x + 3, p.y + 5 + len, x, p.y + 5 + len);
    slime.quadraticCurveTo(x - 3, p.y + 5 + len, x - 4, p.y + 5);
    i++;
  }
  slime.lineTo(p.x + 6, p.y + 5);
  slime.closePath();
  ctx.fill(slime);
  ctx.stroke(slime);
  ctx.restore();
}

/** Night falls for the zombie stage: dusk sky, stars, a sleepy moon, bats. Fades in with `a`. */
/**
 * Night falls for the zombie stage. `part: "static"` paints the dusk sky and the
 * sleepy moon (pre-rendered once into a layer); `part: "live"` paints what moves:
 * twinkling stars and bats. Fades in with `a`.
 */
function drawNight(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, a: number, stars: { x: number; y: number; r: number; p: number }[], part: "static" | "live") {
  ctx.save();
  ctx.globalAlpha = a;
  if (part === "live") {
    drawNightLive(ctx, W, H, t, a, stars);
    ctx.restore();
    return;
  }
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#1F1A3D");
  sky.addColorStop(0.55, "#4A3470");
  sky.addColorStop(1, "#8E5E9E");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
  // The moon, sleepy and smiling
  const mx = W * 0.82, my = H * 0.17, mr = Math.max(40, H * 0.07);
  ctx.fillStyle = "rgba(255,243,176,.18)";
  ctx.beginPath();
  ctx.arc(mx, my, mr * 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FFEFA8";
  ctx.beginPath();
  ctx.arc(mx + 3, my + 2.4, mr, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(mx, my, mr, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(42,42,46,.12)";
  for (const [cx, cy, cr] of [
    [-0.4, -0.3, 0.16],
    [0.35, 0.35, 0.12],
    [0.45, -0.2, 0.08],
  ]) {
    ctx.beginPath();
    ctx.arc(mx + cx * mr, my + cy * mr, cr * mr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(mx - mr * 0.3, my - mr * 0.05, mr * 0.13, 0.2, Math.PI - 0.2);
  ctx.moveTo(mx + mr * 0.43, my - mr * 0.05);
  ctx.arc(mx + mr * 0.3, my - mr * 0.05, mr * 0.13, 0.2, Math.PI - 0.2);
  ctx.moveTo(mx - mr * 0.18, my + mr * 0.32);
  ctx.quadraticCurveTo(mx, my + mr * 0.45, mx + mr * 0.18, my + mr * 0.32);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,143,163,.5)";
  ctx.beginPath();
  ctx.ellipse(mx - mr * 0.5, my + mr * 0.22, mr * 0.12, mr * 0.07, 0, 0, Math.PI * 2);
  ctx.ellipse(mx + mr * 0.5, my + mr * 0.22, mr * 0.12, mr * 0.07, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawNightLive(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, a: number, stars: { x: number; y: number; r: number; p: number }[]) {
  // Stars
  ctx.fillStyle = "#FFF3B0";
  for (const st of stars) {
    ctx.globalAlpha = a * (0.5 + 0.5 * Math.sin(t * 3 + st.p));
    ctx.beginPath();
    ctx.arc(st.x * W, st.y * H, st.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = a;
  ctx.globalAlpha = a;
  // Bats, flapping across
  for (let i = 0; i < 4; i++) {
    const bx = ((t * (40 + i * 12) + i * W * 0.3) % (W + 120)) - 60;
    const by = H * (0.1 + i * 0.08) + Math.sin(t * 2 + i * 2) * 14;
    const f = Math.sin(t * 14 + i) * 7;
    const s = 0.8 + (i % 2) * 0.3;
    ctx.save();
    ctx.translate(bx, by);
    ctx.scale(s, s);
    ctx.fillStyle = "#2A2238";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-10, -8 - f, -22, -2 - f);
    ctx.quadraticCurveTo(-16, 0, -14, 4);
    ctx.quadraticCurveTo(-8, 2, 0, 5);
    ctx.quadraticCurveTo(8, 2, 14, 4);
    ctx.quadraticCurveTo(16, 0, 22, -2 - f);
    ctx.quadraticCurveTo(10, -8 - f, 0, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 1, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFDE59";
    ctx.beginPath();
    ctx.arc(-1.8, 0.5, 1.1, 0, Math.PI * 2);
    ctx.arc(1.8, 0.5, 1.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/** The grass turns into a cute graveyard: dark turf, wonky tombstones, a pumpkin. */
function drawGraveyard(ctx: CanvasRenderingContext2D, W: number, H: number, GH: number, a: number, boil: number) {
  ctx.save();
  ctx.globalAlpha = a;
  ctx.fillStyle = "#3E4A3A";
  ctx.fillRect(0, H - GH + 3, W, GH);
  ctx.fillStyle = "#323D30";
  ctx.fillRect(0, H - GH * 0.45, W, GH * 0.45);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(0, H - GH);
  for (let x = 0; x <= W + 40; x += 20) ctx.quadraticCurveTo(x + 10, H - GH - 4, x + 20, H - GH);
  ctx.stroke();
  const gTop = H - GH;
  const stones: [number, number, number, string][] = [
    [0.18, 26, -0.08, "RIP"],
    [0.46, 22, 0.06, "boo"],
    [0.63, 28, -0.05, "RIP"],
    [0.9, 24, 0.09, "zzz"],
  ];
  for (const [fx, w, tilt, word] of stones) {
    const x = W * fx;
    ctx.save();
    ctx.translate(x, gTop + 6);
    ctx.rotate(tilt);
    const stone = new Path2D();
    stone.moveTo(-w / 2, 0);
    stone.lineTo(-w / 2, -w * 0.9);
    stone.quadraticCurveTo(-w / 2, -w * 1.5, 0, -w * 1.5);
    stone.quadraticCurveTo(w / 2, -w * 1.5, w / 2, -w * 0.9);
    stone.lineTo(w / 2, 0);
    stone.closePath();
    ctx.save();
    ctx.translate(2.4, 1.8);
    ctx.fillStyle = "#B9B2C9";
    ctx.fill(stone);
    ctx.restore();
    sketch(ctx, stone, 1.8, boil);
    ctx.fillStyle = INK;
    ctx.font = `bold ${Math.round(w * 0.38)}px ${HAND}`;
    ctx.textAlign = "center";
    ctx.fillText(word, 0, -w * 0.75);
    ctx.restore();
  }
  // A pumpkin
  const px = W * 0.31, py = gTop + 2, pr = 16;
  ctx.save();
  ctx.translate(2.4, 1.8);
  ctx.fillStyle = "#FFA867";
  ctx.beginPath();
  ctx.ellipse(px, py - pr * 0.8, pr * 1.2, pr * 0.9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.ellipse(px, py - pr * 0.8, pr * 1.2, pr * 0.9, 0, 0, Math.PI * 2);
  ctx.moveTo(px, py - pr * 1.7);
  ctx.lineTo(px + 3, py - pr * 2.2);
  ctx.moveTo(px - pr * 0.4, py - pr * 1.6);
  ctx.quadraticCurveTo(px - pr * 0.55, py - pr * 0.8, px - pr * 0.4, py);
  ctx.moveTo(px + pr * 0.4, py - pr * 1.6);
  ctx.quadraticCurveTo(px + pr * 0.55, py - pr * 0.8, px + pr * 0.4, py);
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(px - pr * 0.35, py - pr * 0.95, 2.2, 0, Math.PI * 2);
  ctx.arc(px + pr * 0.35, py - pr * 0.95, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(px, py - pr * 0.6, pr * 0.3, 0.2, Math.PI - 0.2);
  ctx.stroke();
  ctx.restore();
}

function drawZombie(ctx: CanvasRenderingContext2D, z: Zombie, size: number, t: number, boil: number, target: { x: number; y: number }) {
  if (z.state !== "free") return drawEgg(ctx, z, size * 0.5, t, boil);
  const cover = Math.min(1, z.cover / EGG_FULL);
  const s = getZShapes();
  const k = size / 100;
  ctx.save();
  ctx.translate(z.x, z.y);
  ctx.scale(k * z.dir, k);
  ctx.translate(-50, -50);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const step = z.onGround ? Math.sin(t * 9 + z.wobble) : 0.6;
  // Legs
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(40, 86);
  ctx.lineTo(37 + step * 5, 99);
  ctx.moveTo(60, 86);
  ctx.lineTo(63 - step * 5, 99);
  ctx.stroke();
  // Arms, reaching forward
  const sway = Math.sin(t * 5 + z.wobble) * 3;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(70, 44);
  ctx.quadraticCurveTo(86, 40 + sway, 99, 41 + sway);
  ctx.moveTo(70, 56);
  ctx.quadraticCurveTo(88, 54 - sway, 100, 54 - sway);
  ctx.stroke();
  // Body: colour off register, a torn shirt, then the loose ink line
  ctx.save();
  ctx.translate(3, 2.4);
  ctx.fillStyle = z.flash > 0 ? "#ffffff" : ZOMBIE_FILL;
  ctx.fill(s.body);
  ctx.clip(s.body);
  ctx.fillStyle = z.flash > 0 ? "#ffffff" : ZOMBIE_SHIRT;
  ctx.beginPath();
  ctx.moveTo(0, 68);
  for (let x = 0; x <= 100; x += 8) ctx.lineTo(x, 66 + ((x / 8) % 2 ? 6 : 0));
  ctx.lineTo(100, 100);
  ctx.lineTo(0, 100);
  ctx.fill();
  // Egg coating, rising from the feet as it gets hit
  if (cover > 0) {
    const top = 96 - cover * 84;
    ctx.fillStyle = "rgba(255,255,255,.94)";
    ctx.beginPath();
    ctx.moveTo(0, top);
    for (let x = 0; x <= 100; x += 10) ctx.quadraticCurveTo(x + 5, top + ((x / 10) % 2 ? -7 : 7), x + 10, top);
    ctx.lineTo(100, 100);
    ctx.lineTo(0, 100);
    ctx.fill();
    ctx.fillStyle = "#FFDE59";
    ctx.beginPath();
    ctx.arc(40, Math.max(top + 12, 70), 6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  sketch(ctx, s.line, 2.2, boil);
  ctx.lineWidth = 1.4;
  ctx.globalAlpha = 0.7;
  ctx.stroke(s.stitches);
  ctx.globalAlpha = 1;
  // Hands
  ctx.fillStyle = ZOMBIE_FILL;
  for (const [hx, hy] of [
    [100, 41 + sway],
    [101, 54 - sway],
  ]) {
    ctx.beginPath();
    ctx.arc(hx, hy, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1.8;
    ctx.stroke();
  }
  // Eyes: one big wobbly one watching Groowt, one stitched shut
  const dx = (target.x - z.x) * z.dir, dy = target.y - z.y;
  const d = Math.hypot(dx, dy) || 1;
  ctx.beginPath();
  ctx.arc(46, 38, 9.5, 0, Math.PI * 2);
  ctx.fillStyle = "#FFF6D2";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(46 + (dx / d) * 4, 38 + (dy / d) * 4, 3.6, 0, Math.PI * 2);
  ctx.fillStyle = INK;
  ctx.fill();
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(60, 32);
  ctx.lineTo(68, 40);
  ctx.moveTo(68, 32);
  ctx.lineTo(60, 40);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.stroke(s.mouth);
  ctx.restore();
}

/** A zombie sealed in egg: shell with speckles, the zombie's eye peeking through, cracks as it nears hatching. */
function drawEgg(ctx: CanvasRenderingContext2D, z: Zombie, R: number, t: number, boil: number) {
  const left = z.hatchAt - t;
  const shake = z.state === "egg" && left < 2 ? Math.sin(t * 45) * (2 - left) * 1.6 : 0;
  ctx.save();
  ctx.translate(z.x + shake, z.y);
  ctx.rotate(z.state === "roll" ? z.rot : shake * 0.02);
  const shell = new Path2D();
  shell.moveTo(0, -R * 1.1);
  shell.bezierCurveTo(R * 0.85, -R * 1.1, R * 1.02, R * 0.15, R * 0.9, R * 0.55);
  shell.bezierCurveTo(R * 0.72, R * 1.02, -R * 0.72, R * 1.02, -R * 0.9, R * 0.55);
  shell.bezierCurveTo(-R * 1.02, R * 0.15, -R * 0.85, -R * 1.1, 0, -R * 1.1);
  ctx.save();
  ctx.translate(3, 2.4);
  ctx.fillStyle = "#FFF9EC";
  ctx.fill(shell);
  ctx.restore();
  ctx.save();
  ctx.clip(shell);
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = ZOMBIE_FILL;
  ctx.beginPath();
  ctx.ellipse(0, R * 0.1, R * 0.62, R * 0.72, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // The eye inside, still watching
  ctx.fillStyle = "#FFF6D2";
  ctx.beginPath();
  ctx.arc(-R * 0.12, -R * 0.12, R * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(-R * 0.08, -R * 0.1, R * 0.08, 0, Math.PI * 2);
  ctx.fill();
  // Speckles
  ctx.fillStyle = "rgba(217,179,140,.7)";
  for (const [sx, sy] of [
    [0.4, -0.5],
    [-0.5, 0.3],
    [0.3, 0.5],
    [0.55, 0.05],
    [-0.3, -0.7],
  ]) {
    ctx.beginPath();
    ctx.arc(sx * R, sy * R, R * 0.06, 0, Math.PI * 2);
    ctx.fill();
  }
  sketch(ctx, shell, 2.2, boil);
  // Cracks as it's about to hatch
  if (z.state === "egg" && left < 3) {
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-R * 0.6, -R * 0.2);
    ctx.lineTo(-R * 0.3, R * 0.05);
    ctx.lineTo(-R * 0.05, -R * 0.25);
    if (left < 1.8) {
      ctx.lineTo(R * 0.25, R * 0.02);
      ctx.lineTo(R * 0.55, -R * 0.3);
    }
    ctx.stroke();
  }
  ctx.restore();
}

/** An egg in flight: the Egg Blaster's ammo. */
function drawShot(ctx: CanvasRenderingContext2D, b: Shot, size: number) {
  const s = b.big ? size * 1.7 : size;
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.rotate(b.rot);
  ctx.fillStyle = "#FFF9EC";
  ctx.beginPath();
  ctx.ellipse(1.4, 1.1, s * 0.42, s * 0.54, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = b.big ? 2 : 1.5;
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.42, s * 0.54, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#FFDE59";
  ctx.beginPath();
  ctx.arc(0, s * 0.1, s * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Pip's cage: a round-topped birdcage with bars and a padlock; the bars lift away when she's freed. */
function drawCage(ctx: CanvasRenderingContext2D, cx: number, bottom: number, w: number, h: number, lift: number, boil: number) {
  const x0 = cx - w / 2, top = bottom - h;
  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const base = new Path2D();
  base.roundRect(x0 - 6, bottom - 8, w + 12, 10, 4);
  ctx.save();
  ctx.translate(2.4, 1.8);
  ctx.fillStyle = "#C3A6FF";
  ctx.fill(base);
  ctx.restore();
  sketch(ctx, base, 2, boil);
  // Roof, hook and bars lift together like a lid when she's freed
  ctx.save();
  ctx.translate(0, -lift * h * 1.4);
  ctx.globalAlpha = Math.max(0, 1 - lift);
  const roof = new Path2D();
  roof.moveTo(x0, top + w * 0.3);
  roof.quadraticCurveTo(cx, top - w * 0.25, x0 + w, top + w * 0.3);
  sketch(ctx, roof, 2.4, boil);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, top - w * 0.06 - 8, 6, Math.PI * 0.2, Math.PI * 1.8);
  ctx.stroke();
  for (let i = 0; i <= 5; i++) {
    const x = x0 + (w * i) / 5;
    const yTop = top + w * 0.3 - Math.sin((i / 5) * Math.PI) * w * 0.25;
    ctx.beginPath();
    ctx.moveTo(x, yTop);
    ctx.lineTo(x + (i % 2 ? 0.8 : -0.6), bottom - 8);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(x0, top + h * 0.55);
  ctx.lineTo(x0 + w, top + h * 0.55);
  ctx.stroke();
  const lx = cx, ly = bottom - 22;
  ctx.fillStyle = "#FFDE59";
  ctx.fillRect(lx - 7, ly, 14, 11);
  ctx.strokeRect(lx - 7, ly, 14, 11);
  ctx.beginPath();
  ctx.arc(lx, ly, 4.5, Math.PI, 0);
  ctx.stroke();
  ctx.restore();
  ctx.restore();
}


/** The Sticky-Note Blaster, held in front of Groowt (local coords, facing right). */
function drawBlaster(ctx: CanvasRenderingContext2D, size: number, firing: boolean, powered: boolean) {
  const k = size / 88;
  ctx.save();
  ctx.scale(k, k);
  ctx.translate(26, 10);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const body = new Path2D();
  body.roundRect(-6, -6, 30, 13, 4);
  const barrel = new Path2D();
  barrel.roundRect(22, -3.5, 14, 7, 2);
  const grip = new Path2D();
  grip.roundRect(-2, 5, 8, 11, 2);
  const mag = new Path2D();
  mag.rect(4, -14, 11, 9);
  for (const [path, fill] of [
    [grip, "#F2C4FF"],
    [body, powered ? "#FFBA7B" : "#F2C4FF"],
    [barrel, "#C3A6FF"],
    [mag, "#FFDE59"],
  ] as const) {
    ctx.save();
    ctx.translate(1.4, 1.1);
    ctx.fillStyle = fill;
    ctx.fill(path);
    ctx.restore();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.5;
    ctx.stroke(path);
  }
  if (firing) {
    ctx.fillStyle = "#FFDE59";
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const r = i % 2 ? 4 : 10;
      ctx.lineTo(42 + Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
  ctx.restore();
}

/** A power-up, bobbing where a zombie fell: a big egg (big shots) or a megaphone (triple shot). */
function drawPickup(ctx: CanvasRenderingContext2D, p: Pickup, t: number) {
  const s = getZShapes();
  ctx.save();
  ctx.translate(p.x - 16, p.y - 13 + Math.sin((t - p.born) * 4) * 4);
  ctx.globalAlpha = t - p.born > 7 ? 0.5 + 0.5 * Math.sin(t * 20) : 1;
  if (p.kind === "big") {
    ctx.fillStyle = "#FFF9EC";
    ctx.beginPath();
    ctx.ellipse(17.4, 14.2, 11, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(16, 13, 11, 14, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#FFDE59";
    ctx.beginPath();
    ctx.arc(16, 16, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = `bold 13px ${HAND}`;
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("BIG", 16, -5);
    ctx.restore();
    return;
  }
  ctx.save();
  ctx.translate(1.6, 1.2);
  ctx.fillStyle = "#FFBA7B";
  ctx.fill(s.megaphone);
  ctx.restore();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.6;
  ctx.lineJoin = "round";
  ctx.stroke(s.megaphone);
  ctx.globalAlpha *= 0.7;
  ctx.beginPath();
  ctx.arc(30, 13, 5, -0.8, 0.8);
  ctx.arc(30, 13, 10, 0.8, -0.8, true);
  ctx.stroke();
  ctx.restore();
}

/* ---------- the game ---------- */

const inputCls =
  "w-full rounded-md border-2 border-[#2a2a2e] bg-white px-3 py-2.5 text-[15px] text-[#2a2a2e] outline-none placeholder:text-[#2a2a2e]/40 focus-visible:shadow-[3px_3px_0_0_#FFDE59]";

export function GroowtGame() {
  const { game: open } = useGroowt();
  const copy = groowt.game;
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = React.useState<Phase>("intro");
  const [score, setScore] = React.useState(0);
  const [best, setBest] = React.useState(0);
  const [newBest, setNewBest] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [passed, setPassed] = React.useState(0);
  const [zLeft, setZLeft] = React.useState(0);
  const [zBanner, setZBanner] = React.useState(false);
  const [powers, setPowers] = React.useState({ big: false, triple: false });
  const [friend, setFriend] = React.useState("");
  // Held controls for the zombie stage (touch buttons and mouse write here; keys are tracked in the loop).
  const inputRef = React.useRef({ left: false, right: false, down: false, fire: false });
  const flapRef = React.useRef<() => void>(() => {});
  const restartRef = React.useRef<() => void>(() => {});

  // Remember the player on this device, and their best.
  React.useEffect(() => {
    try {
      setBest(Number(localStorage.getItem(BEST_KEY)) || 0);
      const saved = JSON.parse(localStorage.getItem(PLAYER_KEY) || "{}") as { name?: string; email?: string };
      if (saved.name) setName(saved.name);
      if (saved.email) setEmail(saved.email);
    } catch {
      // storage blocked: nothing is remembered
    }
  }, []);

  // Every time the game opens, start at the sign-in card.
  React.useEffect(() => {
    if (open) setPhase("intro");
  }, [open]);

  // While the sky is up, the website underneath is switched off: hidden (so it stops painting,
  // and its own animations go to sleep), videos paused, scroll locked. All restored on close.
  React.useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const videos = Array.from(document.querySelectorAll("video")).filter((v) => !v.paused);
    videos.forEach((v) => v.pause());
    // Hide after the sky has faded in, so opening still looks smooth.
    let hidden: HTMLElement[] = [];
    const t = window.setTimeout(() => {
      hidden = Array.from(document.querySelectorAll<HTMLElement>("main, header, footer, nav")).filter((el) => !el.closest("[data-groowt-game]") && el.style.display !== "none");
      hidden.forEach((el) => (el.style.display = "none"));
    }, 400);
    return () => {
      window.clearTimeout(t);
      hidden.forEach((el) => (el.style.display = ""));
      document.body.style.overflow = prev;
      window.scrollTo(0, scrollY);
      videos.forEach((v) => v.play().catch(() => {}));
    };
  }, [open]);

  function start(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    const em = email.trim();
    try {
      localStorage.setItem(PLAYER_KEY, JSON.stringify({ name: n, email: em }));
    } catch {
      // ignore
    }
    // Let the team know someone is playing. Fire and forget: never blocks the game.
    fetch("/api/groowt-play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: n, email: em, page: window.location.pathname }),
      keepalive: true,
    }).catch(() => {});
    restartRef.current();
  }

  // The game loop: lives only while open.
  React.useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    HAND = `${getComputedStyle(canvas).getPropertyValue("--font-hand").trim() || "Caveat"}, cursive`;
    let W = 0, H = 0, dpr = 1;
    const resize = () => {
      // 1.5x is crisp enough for hand-drawn lines and far cheaper to fill than 2x.
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    };
    resize();

    /** Paint something once into an offscreen canvas at the current resolution. */
    const layer = (w: number, h: number, paint: (c: CanvasRenderingContext2D) => void) => {
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.ceil(w * dpr));
      c.height = Math.max(1, Math.ceil(h * dpr));
      const x = c.getContext("2d")!;
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(x);
      return c;
    };
    const blit = (c: HTMLCanvasElement, x: number, y: number) => ctx.drawImage(c, x, y, c.width / dpr, c.height / dpr);
    // Built when needed: the day sky and ground on open/resize, the night and graveyard only when a zombie stage arrives.
    let skyLayer: HTMLCanvasElement | null = null;
    let groundLayer: HTMLCanvasElement | null = null;
    let nightLayer: HTMLCanvasElement | null = null;
    let graveLayer: HTMLCanvasElement | null = null;
    const invalidate = () => {
      skyLayer = groundLayer = nightLayer = graveLayer = null;
    };
    const onResize = () => {
      resize();
      invalidate();
    };
    window.addEventListener("resize", onResize);

    // Paper grain over the sky, made once.
    const grain = document.createElement("canvas");
    grain.width = grain.height = 160;
    const gctx = grain.getContext("2d")!;
    const img = gctx.createImageData(160, 160);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 100 + Math.random() * 155;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    gctx.putImageData(img, 0, 0);

    const size = () => Math.max(52, Math.min(84, H * 0.085));
    const groundH = () => Math.max(56, H * 0.09);
    // "intro" while the sign-in card is up; the world idles behind it.
    let state: Phase = "intro";
    let t = 0, last = performance.now(), boil = 0, boilT = 0;
    let birdY = H * 0.45, vy = 0, flap = 0, rot = 0;
    let pillars: Pillar[] = [];
    const clouds: Cloud[] = Array.from({ length: 6 }, () => ({ x: Math.random() * W, y: 40 + Math.random() * H * 0.45, s: 0.8 + Math.random() * 1.3, v: 12 + Math.random() * 18 }));
    let pts = 0, colorIdx = 0, groundOff = 0, spawned = 0, overAt = 0, passedCount = 0;
    // Zombie stage
    let px = W * 0.28, pvx = 0, onGround = false, flutter = true, facing: 1 | -1 = 1, dropUntil = 0, graceUntil = 0;
    let platforms: Platform[] = [], zombies: Zombie[] = [], shots: Shot[] = [], puffs: Puff[] = [], pickups: Pickup[] = [], floats: FloatText[] = [];
    let zstage = 0, zToSpawn = 0, zSpawned = 0, kills = 0, nextSpawn = 0, nextShot = 0, muzzleAt = -1, clearAt = 0, platAlpha = 0, autoUntil = 0;
    let bigUntil = 0, tripleUntil = 0, powersShown = "";
    type Friend = { x: number; y: number; state: "caged" | "free" | "gone"; at: number; pal: Palette };
    let pip: Friend | null = null;
    // Birds already rescued: they fly with Groowt from then on.
    let flock: Friend[] = [];
    const stars = Array.from({ length: 40 }, () => ({ x: Math.random(), y: Math.random() * 0.6, r: 0.8 + Math.random() * 1.6, p: Math.random() * 6 }));
    const keys = new Set<string>();
    const onKeyDown = (e: KeyboardEvent) => {
      keys.add(e.code);
      if (["ArrowLeft", "ArrowRight", "ArrowDown"].includes(e.code) && state !== "intro") e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.code);
    const onPointerUp = () => {
      inputRef.current.fire = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    const birdX = () => W * 0.28;
    const gap = () => Math.max(size() * 2.8, H * 0.28);
    const spacing = () => Math.max(260, Math.min(460, W * 0.38));
    const speed = () => (220 + Math.min(120, pts * 5)) * Math.max(0.75, Math.min(1.25, W / 1280));
    const gravity = () => H * 2.5;
    const jumpV = () => -H * 0.72;
    const restY = () => H - groundH() - size() * 0.36;
    const FOOT = () => size() * 0.41;
    const zSize = () => size() * 1.05;
    const ZFOOT = () => zSize() * 0.48;
    const eggR = () => zSize() * 0.5;
    const jumpZ = () => -H * 1.0;
    const rollSpeed = () => Math.max(520, W * 0.48);
    const cagePos = () => {
      const p = platforms[2];
      return p ? { x: p.x + p.w / 2, bottom: p.y, w: size() * 1.25, h: size() * 1.45 } : null;
    };

    /** One-way landing for anything with feet: returns the surface y it lands on, or null. */
    const landOn = (x: number, prevFeet: number, feet: number, v: number, half: number) => {
      if (v < 0) return null;
      for (const p of platforms) if (x > p.x - half && x < p.x + p.w + half && prevFeet <= p.y + 2 && feet >= p.y) return p.y;
      if (feet >= H - groundH()) return H - groundH();
      return null;
    };

    const startZombies = () => {
      zstage += 1;
      platforms = makePlatforms(W, H, H - groundH());
      zombies = [];
      shots = [];
      puffs = [];
      pickups = [];
      floats = [];
      zToSpawn = Math.min(30, 10 + zstage * 4);
      zSpawned = 0;
      kills = 0;
      // A short auto-flight first, while night falls and the stage builds.
      autoUntil = t + 3;
      nextSpawn = autoUntil + 0.6;
      graceUntil = autoUntil + 1.2;
      pvx = 0;
      vy = 0;
      onGround = false;
      flutter = true;
      facing = 1;
      bigUntil = 0;
      tripleUntil = 0;
      powersShown = "";
      platAlpha = 0;
      const c = cagePos();
      const fi = (zstage - 1) % FRIEND_PALS.length;
      pip = c ? { x: c.x, y: c.bottom - size() * 0.8 * 0.45, state: "caged", at: t, pal: FRIEND_PALS[fi]! } : null;
      setFriend(copy.zombies.friends[fi % copy.zombies.friends.length]!);
      setPowers({ big: false, triple: false });
      setZLeft(zToSpawn);
      setZBanner(true);
      window.setTimeout(() => setZBanner(false), 4200);
      go("zombies");
    };

    const shoot = () => {
      const S = size();
      const big = t < bigUntil;
      const ang = t < tripleUntil ? [-0.22, 0, 0.22] : [0];
      const sp = Math.max(700, W * 0.75);
      for (const a of ang) shots.push({ x: px + facing * S * 0.62, y: birdY + S * 0.11, vx: facing * sp * Math.cos(a), vy: sp * Math.sin(a) - 10, rot: Math.random(), life: 1.2, big });
      muzzleAt = t;
      nextShot = t + (big ? 0.3 : 0.22);
    };

    const burst = (x: number, y: number, colors: string[], n = 16) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, v = 80 + Math.random() * 240;
        puffs.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, life: 0.5 + Math.random() * 0.4, color: colors[i % colors.length]!, r: 3 + Math.random() * 5 });
      }
    };

    /** A zombie is gone for good: points (doubling down a rolling-egg combo), maybe a power-up. */
    const kill = (z: Zombie, chain = 1) => {
      z.dead = true;
      burst(z.x, z.y, [ZOMBIE_FILL, "#FFF9EC", INK, "#FFDE59"]);
      const gain = 2 * Math.pow(2, Math.min(4, chain - 1));
      floats.push({ x: z.x, y: z.y - zSize() * 0.5, life: 1, text: chain > 1 ? `+${gain} combo!` : `+${gain}` });
      kills += 1;
      pts += gain;
      setScore(pts);
      setZLeft(zToSpawn - kills);
      if (Math.random() < 0.4) pickups.push({ x: z.x, y: Math.min(z.y, H - groundH() - 40), born: t, kind: Math.random() < 0.5 ? "big" : "triple" });
    };

    const seal = (z: Zombie) => {
      const feet = z.y + ZFOOT();
      z.state = "egg";
      z.cover = EGG_FULL;
      z.vx = 0;
      z.hatchAt = t + 7;
      z.y = feet - eggR() * 0.95;
      floats.push({ x: z.x, y: z.y - eggR(), life: 0.8, text: "Egged!" });
    };

    const kick = (z: Zombie, dir: number, chain = 1) => {
      z.state = "roll";
      z.vx = Math.sign(dir || 1) * rollSpeed();
      z.rollT = 0;
      z.bounces = 0;
      z.chain = chain;
    };

    const go = (p: Phase) => {
      state = p;
      setPhase(p);
    };

    const reset = () => {
      t = 0;
      birdY = H * 0.45;
      vy = 0;
      rot = 0;
      pillars = [];
      pts = 0;
      spawned = 0;
      passedCount = 0;
      px = birdX();
      zstage = 0;
      platforms = [];
      zombies = [];
      shots = [];
      puffs = [];
      pickups = [];
      floats = [];
      pip = null;
      flock = [];
      bigUntil = 0;
      tripleUntil = 0;
      setPowers({ big: false, triple: false });
      setPassed(0);
      setZLeft(0);
      setZBanner(false);
      setScore(0);
      setNewBest(false);
      go("ready");
    };

    const die = () => {
      if (state === "over") return;
      state = "over";
      overAt = t;
      vy = Math.min(vy, -H * 0.35);
      try {
        const prev = Number(localStorage.getItem(BEST_KEY)) || 0;
        if (pts > prev) {
          localStorage.setItem(BEST_KEY, String(pts));
          setNewBest(true);
        }
        setBest(Math.max(prev, pts));
      } catch {
        setBest((b) => Math.max(b, pts));
      }
      window.setTimeout(() => setPhase("over"), 650);
    };

    flapRef.current = () => {
      if (state === "zombies" || state === "cleared") {
        if (t < autoUntil) return;
        if (onGround) {
          vy = jumpZ();
          onGround = false;
          flutter = true;
        } else if (flutter) {
          vy = jumpZ() * 0.8;
          flutter = false;
        }
        flap = 0;
        return;
      }
      if (state === "ready") go("playing");
      else if (state === "rest") {
        spawned = 0;
        go("playing");
      } else if (state !== "playing") return;
      vy = jumpV();
      flap = 0;
    };
    restartRef.current = reset;

    // Read-only peek for automated testing, only with ?groowt-debug in the URL.
    if (new URLSearchParams(window.location.search).has("groowt-debug")) {
      (window as unknown as { __groowtZombies?: () => void }).__groowtZombies = () => startZombies();
      // Test-only: a sealed egg on the ground beside Groowt, with no other zombies coming.
      (window as unknown as { __groowtEggTest?: (offset: number) => void }).__groowtEggTest = (offset: number) => {
        zSpawned = zToSpawn;
        zombies = [];
        const gTop = H - groundH();
        px = W * 0.5;
        birdY = gTop - FOOT();
        const z: Zombie = { x: px + offset, y: gTop - ZFOOT(), vx: 0, vy: 0, onGround: true, dir: -1, jumpAt: 1e9, flash: 0, wobble: 0, speed: 0, state: "free", cover: 0, lastHit: t, hatchAt: 0, rot: 0, rollT: 0, bounces: 0, chain: 1, dead: false };
        zombies.push(z);
        seal(z);
        z.hatchAt = t + 60;
        // a second zombie farther along, to check the rolling egg knocks it out
        zombies.push({ ...z, x: px + offset * 3, y: gTop - ZFOOT(), state: "free", cover: 0, hatchAt: 0, speed: 0, jumpAt: 1e9 });
        zToSpawn = zSpawned = 2;
        kills = 0;
        graceUntil = t + 1e9;
      };
      (window as unknown as { __groowtClear?: () => void }).__groowtClear = () => {
        zSpawned = zToSpawn;
        for (const z of zombies) kill(z);
        zombies = [];
      };
      (window as unknown as { __groowtFlies?: () => object }).__groowtFlies = () => {
        const next = pillars.find((p) => !p.scored);
        return { phase: state, y: birdY, vy, H, W, target: next ? next.gapY : H * 0.45, pts, passed: passedCount, px, zombies: zombies.map((z) => ({ x: z.x, y: z.y })), zLeft: zToSpawn - kills };
      };
    }

    let raf = 0;
    const frame = (now: number) => {
      const dt = Math.min(1 / 30, (now - last) / 1000);
      last = now;
      t += dt;
      boilT += dt;
      if (boilT > 0.14) {
        boilT = 0;
        boil = (boil + 1) % 6;
      }
      const S = size(), GH = groundH();
      const zMode = state === "zombies" || state === "cleared";
      if (!zMode && state !== "over") px += (birdX() - px) * Math.min(1, dt * 3);
      const bx = px;
      const r = S * 0.36;
      const moving = state === "playing" || state === "landing";

      // ---- update ----
      for (const c of clouds) {
        c.x -= c.v * dt * (moving ? 1.6 : 1);
        if (c.x < -120 * c.s) {
          c.x = W + 40;
          c.y = 40 + Math.random() * H * 0.45;
        }
      }
      if (state !== "over" && state !== "rest" && !zMode) groundOff = (groundOff + speed() * dt * (moving ? 1 : 0.4)) % 40;

      if (state === "intro" || state === "ready") {
        birdY = H * 0.45 + Math.sin(t * 3) * 10;
        flap += dt * 14;
        rot = Math.sin(t * 3) * 0.06;
      } else if (state === "landing") {
        // Glide down to the grass, wings slowing.
        birdY += (restY() - birdY) * Math.min(1, dt * 2.6);
        rot += (0.08 - rot) * Math.min(1, dt * 4);
        flap += dt * 8;
        if (Math.abs(restY() - birdY) < 1.5) {
          birdY = restY();
          startZombies();
        }
      } else if (zMode) {
        // ---- the zombie stage: Snow Bros rules. Egg them, then push or kick the egg. ----
        const gTop = H - GH;
        const auto = t < autoUntil;
        const zs = zSize(), R = eggR();
        platAlpha = Math.min(1, platAlpha + dt * 0.55);
        // The last stretch's pillars scroll away while night falls.
        if (pillars.length) {
          for (const p of pillars) p.x -= speed() * dt;
          pillars = pillars.filter((p) => p.x > -S * 1.25 - 40);
        }
        if (auto) {
          // Auto-flight: no controls yet, just Groowt cruising while the stage builds.
          groundOff = (groundOff + speed() * dt * 0.5) % 40;
          birdY += (H * 0.32 + Math.sin(t * 3) * 10 - birdY) * Math.min(1, dt * 2.5);
          px += (W * 0.24 - px) * Math.min(1, dt * 2.5);
          vy = 0;
          flap += dt * 22;
          rot += (-0.1 - rot) * Math.min(1, dt * 5);
          onGround = false;
          flutter = true;
        } else {
          const inp = inputRef.current;
          const left = keys.has("ArrowLeft") || keys.has("KeyA") || inp.left;
          const right = keys.has("ArrowRight") || keys.has("KeyD") || inp.right;
          const down = keys.has("ArrowDown") || keys.has("KeyS") || inp.down;
          const fire = keys.has("KeyF") || keys.has("KeyJ") || keys.has("KeyX") || inp.fire;
          pvx = ((right ? 1 : 0) - (left ? 1 : 0)) * Math.max(240, W * 0.26);
          if (pvx) facing = pvx > 0 ? 1 : -1;
          if (down && onGround && birdY + FOOT() < gTop - 2) {
            dropUntil = t + 0.28;
            onGround = false;
          }
          vy += gravity() * dt;
          px = Math.max(r, Math.min(W - r, px + pvx * dt));
          const prevFeet = birdY + FOOT();
          birdY += vy * dt;
          let landY: number | null = null;
          if (t > dropUntil) landY = landOn(px, prevFeet, birdY + FOOT(), vy, 8);
          else if (birdY + FOOT() >= gTop) landY = gTop;
          if (landY !== null) {
            birdY = landY - FOOT();
            vy = 0;
            onGround = true;
            flutter = true;
          } else if (vy > 0) onGround = false;
          if (birdY - r < 0) {
            birdY = r;
            vy = Math.max(0, vy);
          }
          flap += dt * (onGround ? (pvx ? 9 : 2) : 22);
          const targetRot = onGround ? 0 : Math.max(-0.2, Math.min(0.3, vy / (H * 2)));
          rot += (targetRot - rot) * Math.min(1, dt * 8);
          if (state === "zombies" && fire && t >= nextShot) shoot();
        }

        if (state === "zombies" && !auto) {
          // Spawn: in from the sides, or dropping from the sky onto a ledge, with a cap on how many are out at once
          const alive = zombies.length;
          const maxAlive = Math.min(11, 6 + zstage);
          if (zSpawned < zToSpawn && alive < maxAlive && t >= nextSpawn) {
            zSpawned += 1;
            const fromSky = Math.random() < 0.35;
            const p = platforms[Math.floor(Math.random() * platforms.length)]!;
            const side = zSpawned % 2 ? -1 : 1;
            zombies.push({
              x: fromSky ? p.x + p.w * (0.2 + Math.random() * 0.6) : side < 0 ? -40 : W + 40,
              y: fromSky ? -80 : gTop - ZFOOT(),
              vx: 0,
              vy: 0,
              onGround: !fromSky,
              dir: side < 0 ? 1 : -1,
              jumpAt: t + 1 + Math.random() * 2,
              flash: 0,
              wobble: Math.random() * 6,
              speed: (Math.max(55, W * 0.045) + zstage * 8) * (0.85 + Math.random() * 0.3),
              state: "free",
              cover: 0,
              lastHit: 0,
              hatchAt: 0,
              rot: 0,
              rollT: 0,
              bounces: 0,
              chain: 1,
              dead: false,
            });
            nextSpawn = t + Math.max(0.45, 1.3 - zstage * 0.12) + Math.random() * 0.5;
          }
        }

        for (const z of zombies) {
          if (z.dead) continue;
          const foot = z.state === "free" ? ZFOOT() : R * 0.95;
          if (z.state === "free") {
            z.dir = px < z.x ? -1 : 1;
            const slow = 1 - Math.min(1, z.cover / EGG_FULL) * 0.75;
            if (z.onGround) z.vx = z.dir * z.speed * slow;
            // Egg melts off if you stop hitting them.
            if (z.cover > 0 && t - z.lastHit > 2.6) z.cover = Math.max(0, z.cover - dt * 0.9);
            const above = birdY + FOOT() < z.y + ZFOOT() - 40;
            if (z.cover < 2 && z.onGround && above && Math.abs(px - z.x) < W * 0.28 && t > z.jumpAt && !auto) {
              z.vy = jumpZ();
              z.onGround = false;
              z.jumpAt = t + 1.8 + Math.random() * 1.6;
            }
          } else if (z.state === "egg") {
            z.vx = 0;
            if (t > z.hatchAt) {
              // Left too long: it cracks open and the zombie climbs out, angrier.
              const feet = z.y + R * 0.95;
              z.state = "free";
              z.cover = 0;
              z.speed *= 1.15;
              z.flash = 0.3;
              z.y = feet - ZFOOT();
              burst(z.x, z.y, ["#FFF9EC", "#FFDE59"], 10);
              floats.push({ x: z.x, y: z.y - zs * 0.5, life: 0.9, text: "Grr!" });
            }
          } else {
            z.rot += (z.vx / R) * dt;
            z.rollT += dt;
          }
          z.vy += gravity() * dt;
          const prev = z.y + foot;
          z.x += z.vx * dt;
          z.y += z.vy * dt;
          const landY = landOn(z.x, prev, z.y + (z.state === "free" ? ZFOOT() : R * 0.95), z.vy, 4);
          if (landY !== null) {
            z.y = landY - (z.state === "free" ? ZFOOT() : R * 0.95);
            z.vy = 0;
            z.onGround = true;
          } else if (z.vy > 0) z.onGround = false;
          if (z.state !== "free") z.x = Math.max(R, Math.min(W - R, z.x));
          if (z.state === "roll") {
            if (z.x <= R || z.x >= W - R) {
              kill(z, z.chain);
              continue;
            }
            // Bowling: knock out everything it rolls into; sealed eggs get sent rolling too.
            for (const o of zombies) {
              if (o === z || o.dead || o.state === "roll") continue;
              if (Math.abs(o.x - z.x) < R + zs * 0.3 && Math.abs(o.y - z.y) < R + zs * 0.35) {
                if (o.state === "egg") kick(o, z.vx, z.chain + 1);
                else {
                  z.chain += 1;
                  kill(o, z.chain);
                }
              }
            }
            if (z.rollT > 6) kill(z, z.chain);
          }
          z.flash -= dt;
          if (state !== "zombies" || auto) continue;
          const dx = z.x - px, dy = z.y - birdY;
          if (z.state === "free") {
            // Touch a zombie and he's out (egg-coated or not).
            if (t > graceUntil && Math.abs(dx) < r + zs * 0.22 && Math.abs(dy) < r + zs * 0.32) die();
          } else if (z.state === "egg" && Math.abs(dy) < R + r * 0.5) {
            // Push it: walk into a sealed egg and it slides along in front of him.
            const overlap = R * 0.85 + r * 0.7 - Math.abs(dx);
            if (overlap > 0) {
              const side = Math.sign(dx) || facing;
              // Pushing into it starts it rolling (Snow Bros style); otherwise it's just in the way.
              if (pvx && Math.sign(pvx) === side) kick(z, side);
              else px -= side * overlap;
            }
          }
        }

        // Shots: coat free zombies in egg; a shot into a sealed egg kicks it rolling.
        for (const b of shots) {
          let best: Zombie | null = null, bd = Infinity;
          for (const z of zombies) {
            if (z.dead || z.state === "roll") continue;
            const ahead = (z.x - b.x) * Math.sign(b.vx);
            const d = Math.hypot(z.x - b.x, z.y - b.y);
            if (ahead > 0 && d < bd) {
              bd = d;
              best = z;
            }
          }
          if (best) {
            const sp = Math.hypot(b.vx, b.vy);
            const want = Math.atan2(best.y - b.y, best.x - b.x);
            const cur = Math.atan2(b.vy, b.vx);
            const diff = Math.atan2(Math.sin(want - cur), Math.cos(want - cur));
            const turn = Math.max(-3 * dt, Math.min(3 * dt, diff));
            b.vx = Math.cos(cur + turn) * sp;
            b.vy = Math.sin(cur + turn) * sp;
          }
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          b.rot += 12 * dt * Math.sign(b.vx || 1);
          b.life -= dt;
          for (const z of zombies) {
            if (z.dead || z.state === "roll" || b.life <= 0) continue;
            const hitR = z.state === "egg" ? R : zs * 0.34;
            if (Math.abs(b.x - z.x) < hitR + (b.big ? 8 : 0) && Math.abs(b.y - z.y) < (z.state === "egg" ? R : zs * 0.44) + (b.big ? 8 : 0)) {
              b.life = 0;
              burst(b.x, b.y, ["#FFF9EC", "#FFDE59"], 5);
              if (z.state === "egg") {
                // Splat: shots don't move a sealed egg. Only pushing does.
              } else {
                z.cover += b.big ? 2 : 1;
                z.lastHit = t;
                z.flash = 0.1;
                z.x += Math.sign(b.vx) * 6;
                if (z.cover >= EGG_FULL) seal(z);
              }
            }
          }
        }
        shots = shots.filter((b) => b.life > 0 && b.x > -40 && b.x < W + 40 && b.y < H);
        zombies = zombies.filter((z) => !z.dead);

        // Power-ups: Big Egg (bigger shots that coat twice as fast) or Triple Shot, 10s each
        for (const p of pickups) {
          if (Math.hypot(p.x - px, p.y - birdY) < r + 24) {
            if (p.kind === "big") bigUntil = t + 10;
            else tripleUntil = t + 10;
            floats.push({ x: p.x, y: p.y - 30, life: 1, text: p.kind === "big" ? "Big eggs!" : "Triple shot!" });
            p.born = -999;
          }
        }
        pickups = pickups.filter((p) => p.born > -999 && t - p.born < 9);
        const shown = `${t < bigUntil ? 1 : 0}${t < tripleUntil ? 1 : 0}`;
        if (shown !== powersShown) {
          powersShown = shown;
          setPowers({ big: t < bigUntil, triple: t < tripleUntil });
        }

        // Every zombie gone: the cage opens and Pip is free.
        if (state === "zombies" && !auto && zSpawned >= zToSpawn && zombies.length === 0) {
          clearAt = t;
          if (pip) {
            pip.state = "free";
            pip.at = t;
          }
          if (pip) floats.push({ x: pip.x, y: pip.y - S * 0.7, life: 1.4, text: copy.zombies.thanks });
          go("cleared");
        }
        if (pip && pip.state === "free" && state === "cleared" && t - pip.at > 0.5) {
          pip.x += (px - facing * S * 1.1 - pip.x) * Math.min(1, dt * 3);
          pip.y += (birdY - S * 0.4 - pip.y) * Math.min(1, dt * 3);
        }
        if (state === "cleared" && t - clearAt > 2.8) {
          shots = [];
          pickups = [];
          go("takeoff");
        }
      } else if (state === "takeoff") {
        // Spread the wings and rise back to flying height, then the pillars return.
        birdY += (H * 0.45 - birdY) * Math.min(1, dt * 3);
        px += (birdX() - px) * Math.min(1, dt * 3);
        flap += dt * 24;
        rot += (-0.15 - rot) * Math.min(1, dt * 6);
        platAlpha = Math.max(0, platAlpha - dt * 2);
        if (pip) {
          pip.x += (px - S * 1.15 - pip.x) * Math.min(1, dt * 4);
          pip.y += (birdY - S * 0.35 - pip.y) * Math.min(1, dt * 4);
        }
        if (Math.abs(H * 0.45 - birdY) < 8 && Math.abs(birdX() - px) < 8) {
          platforms = [];
          spawned = 0;
          vy = 0;
          // Hover until the player flaps, so the switch back to pillars is never a surprise.
          go("ready");
        }
      } else if (state === "rest") {
        birdY = restY();
        rot += (0 - rot) * Math.min(1, dt * 6);
        flap = Math.PI; // wings tucked down
      } else {
        vy += gravity() * dt;
        birdY += vy * dt;
        flap += dt * (vy < 0 ? 26 : 10);
        const targetRot = Math.max(-0.45, Math.min(state === "over" ? 1.6 : 1.1, vy / (H * 1.1)));
        rot += (targetRot - rot) * Math.min(1, dt * 8);
        if (birdY - r < 0) {
          birdY = r;
          vy = 0;
        }
        if (birdY + r > H - GH) {
          birdY = H - GH - r;
          if (state === "playing") die();
          vy = 0;
        }
      }

      const pw = S * 1.25;
      if (moving) {
        const sp = speed();
        const lastP = pillars[pillars.length - 1];
        if (state === "playing" && spawned < REST_EVERY && (!lastP || lastP.x < W - spacing())) {
          const margin = 70;
          const g = gap();
          const gapY = margin + g / 2 + Math.random() * Math.max(10, H - GH - 2 * margin - g);
          const color = PILLAR_COLORS[colorIdx++ % PILLAR_COLORS.length]!;
          const pwid = S * 1.25;
          const hTop = gapY - g / 2 + 20;
          const hBot = H - GH - (gapY + g / 2) + 20;
          // Each pillar is drawn once into its own image, then just slides across.
          pillars.push({
            x: W + 40,
            gapY,
            color,
            scored: false,
            top: layer(pwid + 24, hTop + 50, (c) => drawPillar(c, 10, 24, hTop, pwid, color, true, 1)),
            bottom: layer(pwid + 24, hBot + 50, (c) => drawPillar(c, 10, 24, hBot, pwid, color, false, 2)),
          });
          spawned += 1;
        }
        for (const p of pillars) {
          p.x -= sp * dt;
          if (!p.scored && p.x + pw < bx - r) {
            p.scored = true;
            pts += 1;
            passedCount += 1;
            setScore(pts);
            setPassed(passedCount);
          }
          if (state !== "playing") continue;
          const g = gap();
          const top = p.gapY - g / 2, bottom = p.gapY + g / 2;
          for (const [ry0, ry1] of [
            [0, top],
            [bottom, H - GH],
          ]) {
            const cx = Math.max(p.x - 6, Math.min(bx, p.x + pw + 6));
            const cy = Math.max(ry0, Math.min(birdY, ry1));
            if (Math.hypot(bx - cx, birdY - cy) < r * 0.92) die();
          }
        }
        pillars = pillars.filter((p) => p.x > -pw - 40);
        // The stretch is done once every pillar of it is behind him: land.
        if (state === "playing" && spawned >= REST_EVERY && pillars.every((p) => p.scored)) startZombies();
      }

      for (const f of puffs) {
        f.vy += gravity() * 0.35 * dt;
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        f.life -= dt;
      }
      puffs = puffs.filter((f) => f.life > 0);
      for (const f of floats) {
        f.y -= 60 * dt;
        f.life -= dt;
      }
      floats = floats.filter((f) => f.life > 0);

      if (pip && pip.state === "free" && !zMode && state !== "takeoff") {
        flock.push(pip);
        if (flock.length > 6) flock.shift();
        pip = null;
      }
      // The flock trails Groowt through the pillars, and watches from the top during a zombie stage.
      flock.forEach((f, i) => {
        const tx = zMode ? W * (0.34 + i * 0.065) : px - S * (1.15 + i * 0.8);
        const ty = zMode ? H * 0.1 + Math.sin(t * 2 + i) * 6 : birdY - S * 0.25 + Math.sin(t * 3 + i * 1.3) * 8;
        const k = Math.min(1, dt * Math.max(1.4, 3.2 - i * 0.3));
        f.x += (tx - f.x) * k;
        f.y += (ty - f.y) * k;
      });

      // ---- draw ----
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!skyLayer)
        skyLayer = layer(W, H, (c) => {
          const sky = c.createLinearGradient(0, 0, 0, H);
          sky.addColorStop(0, "#4FAEF0");
          sky.addColorStop(0.6, "#8CCBF7");
          sky.addColorStop(1, "#CDEBFF");
          c.fillStyle = sky;
          c.fillRect(0, 0, W, H);
          const pattern = c.createPattern(grain, "repeat");
          if (pattern) {
            c.globalAlpha = 0.08;
            c.globalCompositeOperation = "multiply";
            c.fillStyle = pattern;
            c.fillRect(0, 0, W, H);
          }
        });
      if (platAlpha < 1) blit(skyLayer, 0, 0);

      if (platAlpha > 0) {
        if (!nightLayer) nightLayer = layer(W, H, (c) => drawNight(c, W, H, 0, 1, [], "static"));
        ctx.save();
        ctx.globalAlpha = platAlpha;
        blit(nightLayer, 0, 0);
        ctx.restore();
        drawNight(ctx, W, H, t, platAlpha, stars, "live");
      }

      const shapes = getShapes();
      for (const c of clouds) {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.scale(c.s * 1.6, c.s * 1.6);
        ctx.globalAlpha = 1 - platAlpha * 0.7;
        ctx.fillStyle = "rgba(255,255,255,.92)";
        ctx.fill(shapes.cloud);
        ctx.globalAlpha = 0.4 * (1 - platAlpha * 0.7);
        ctx.strokeStyle = INK;
        ctx.lineWidth = 1.4 / (c.s * 1.6);
        ctx.stroke(shapes.cloud);
        ctx.restore();
      }

      for (const p of pillars) {
        const g = gap();
        if (p.top && p.bottom) {
          blit(p.top, p.x - 10, -20 - 24);
          blit(p.bottom, p.x - 10, p.gapY + g / 2 - 24);
        } else {
          drawPillar(ctx, p.x, -20, p.gapY - g / 2 + 20, pw, p.color, true, boil);
          drawPillar(ctx, p.x, p.gapY + g / 2, H - GH - (p.gapY + g / 2) + 20, pw, p.color, false, boil);
        }
      }

      // Ground: a grassy strip with tufts, painted once and slid along (it repeats every 40px).
      if (!groundLayer)
        groundLayer = layer(W + 80, GH + 8, (c) => {
          c.fillStyle = "#A8E6B8";
          c.fillRect(0, 7, W + 80, GH);
          c.fillStyle = "#8FD7A2";
          c.fillRect(0, 4 + GH * 0.55, W + 80, GH * 0.45 + 4);
          c.strokeStyle = INK;
          c.lineWidth = 2.2;
          c.beginPath();
          c.moveTo(0, 4);
          for (let x = 0; x <= W + 80; x += 20) c.quadraticCurveTo(x + 10, 0, x + 20, 4);
          c.stroke();
          c.globalAlpha = 0.5;
          c.lineWidth = 1.4;
          c.beginPath();
          for (let x = 0; x <= W + 80; x += 40) {
            c.moveTo(x + 8, 4 + GH * 0.45);
            c.lineTo(x + 12, 4 + GH * 0.3);
            c.moveTo(x + 14, 4 + GH * 0.45);
            c.lineTo(x + 16, 4 + GH * 0.28);
          }
          c.stroke();
        });
      if (platAlpha < 1) blit(groundLayer, -groundOff, H - GH - 4);

      if (platAlpha > 0) {
        if (!graveLayer) graveLayer = layer(W, GH + 60, (c) => {
          c.translate(0, -(H - GH - 60));
          drawGraveyard(c, W, H, GH, 1, 1);
        });
        ctx.save();
        ctx.globalAlpha = platAlpha;
        blit(graveLayer, 0, H - GH - 60);
        ctx.restore();
      }
      if (platforms.length) {
        ctx.save();
        ctx.globalAlpha = platAlpha;
        for (const p of platforms) drawPlatform(ctx, p, boil, t);
        ctx.restore();
      }
      const cage = cagePos();
      if (cage && (zMode || state === "takeoff")) {
        ctx.save();
        ctx.globalAlpha = platAlpha;
        drawCage(ctx, cage.x, cage.bottom, cage.w, cage.h, pip && pip.state !== "caged" ? Math.min(1, (t - pip.at) / 0.7) : 0, boil);
        ctx.restore();
      }
      if (pip) {
        ctx.save();
        ctx.globalAlpha = pip.state === "caged" ? platAlpha : 1;
        const bob = pip.state === "caged" ? Math.sin(t * 2.4) * 2 : 0;
        drawGroowt(ctx, pip.x, pip.y + bob, S * 0.8, pip.state === "caged" ? Math.sin(t * 3) * 0.06 : -0.12, t * (pip.state === "caged" ? 6 : 24), "fly", boil, { x: pip.state === "caged" ? Math.sin(t) * 1.6 : 1.4, y: 0 }, pip.pal);
        ctx.restore();
        // Bars over her while she's still locked in
        if (cage && pip.state === "caged") {
          ctx.save();
          ctx.globalAlpha = platAlpha;
          drawCage(ctx, cage.x, cage.bottom, cage.w, cage.h, 0, boil);
          ctx.restore();
        }
      }
      flock.forEach((f, i) => drawGroowt(ctx, f.x, f.y, S * 0.7, -0.1, t * 24 + i, "fly", boil, { x: 1.4, y: 0 }, f.pal));
      for (const p of pickups) drawPickup(ctx, p, t);
      for (const z of zombies) drawZombie(ctx, z, zSize(), t, boil, { x: px, y: birdY });
      for (const b of shots) drawShot(ctx, b, Math.max(12, S * 0.2));
      for (const f of puffs) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, f.life * 2);
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      const face = state === "over" ? (t - overAt > 0.15 ? "dead" : "panic") : vy > H * 0.6 && state === "playing" ? "panic" : "fly";
      ctx.save();
      ctx.translate(bx, birdY);
      if (zMode && facing < 0) ctx.scale(-1, 1);
      drawGroowt(ctx, 0, 0, S, rot, flap, face, boil, { x: 1.4, y: state === "playing" ? Math.max(-1.6, Math.min(1.6, vy / (H * 0.8))) : 0 });
      if (zMode && t >= autoUntil) drawBlaster(ctx, S, t - muzzleAt < 0.07, t < bigUntil || t < tripleUntil);
      ctx.restore();
      for (const f of floats) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, f.life * 2);
        ctx.font = `bold 28px ${HAND}`;
        ctx.textAlign = "center";
        ctx.lineWidth = 4;
        ctx.strokeStyle = INK;
        ctx.strokeText(f.text, f.x, f.y);
        ctx.fillStyle = "#FFDE59";
        ctx.fillText(f.text, f.x, f.y);
        ctx.restore();
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [open]);

  // Keys: Space / Up / W jump, Enter restarts after a crash, Esc closes. Typing in the form is left alone.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return groowtStore.stopGame();
      const el = e.target as HTMLElement | null;
      if (phase === "intro" || el?.tagName === "INPUT" || el?.tagName === "TEXTAREA") return;
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        if (phase === "over") restartRef.current();
        else flapRef.current();
      } else if (e.key === "Enter" && phase === "over") {
        e.preventDefault();
        restartRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, phase]);

  const hand = { fontFamily: "var(--font-hand), cursive" } as const;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="groowt-game"
          role="dialog"
          aria-modal="true"
          aria-label={copy.title}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          data-groowt-game
          className={cn(handFont.variable, "fixed inset-0 z-[90] touch-none overflow-hidden bg-[#4FAEF0] select-none")}
          onPointerDown={(e) => {
            if ((e.target as HTMLElement).closest("button, input, form")) return;
            if (phase === "zombies" || phase === "cleared") inputRef.current.fire = true;
            else if (phase !== "over" && phase !== "intro") flapRef.current();
          }}
        >
          <canvas ref={canvasRef} aria-hidden className="absolute inset-0 block" />

          {/* Score */}
          {phase !== "intro" && phase !== "ready" && (
            <div className="pointer-events-none absolute inset-x-0 top-6 text-center" aria-live="polite">
              <motion.span
                key={score}
                initial={{ scale: 1.35 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                className="inline-block text-7xl leading-none font-bold text-white"
                style={{ ...hand, textShadow: "3px 3px 0 #2a2a2e" }}
              >
                {score}
              </motion.span>
            </div>
          )}

          {/* Zombie stage HUD */}
          {(phase === "zombies" || phase === "cleared") && (
            <div className="pointer-events-none absolute top-5 left-5 flex flex-col items-start gap-2">
              <span className="rounded-md border-2 border-[#2a2a2e] bg-white px-3 py-1 text-lg font-bold text-[#2a2a2e] shadow-[3px_3px_0_0_#86B86A]" style={hand}>
                {copy.zombies.left}: {zLeft}
              </span>
              <span className="rounded-md border-2 border-[#2a2a2e] bg-[#F2C4FF] px-3 py-1 text-sm font-bold text-[#2a2a2e]">{copy.zombies.weapon}</span>
              {(
                [
                  [powers.big, Egg, copy.zombies.powerBig, "#FFF9EC"],
                  [powers.triple, Megaphone, copy.zombies.power, "#FFBA7B"],
                ] as const
              ).map(([on, Icon, label, bg]) =>
                on ? (
                  <motion.span
                    key={label}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="inline-flex items-center gap-1.5 rounded-md border-2 border-[#2a2a2e] px-3 py-1 text-sm font-bold text-[#2a2a2e]"
                    style={{ background: bg }}
                  >
                    <Icon aria-hidden className="size-4" />
                    {label}
                  </motion.span>
                ) : null,
              )}
            </div>
          )}
          <AnimatePresence>
            {phase === "zombies" && zBanner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: -1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="pointer-events-none absolute inset-x-0 top-[18%] flex flex-col items-center gap-3 px-6 text-center"
              >
                <h2 className="text-6xl font-bold text-white sm:text-7xl" style={{ ...hand, textShadow: "4px 4px 0 #2a2a2e" }}>
                  {copy.zombies.title}
                </h2>
                <p className="max-w-lg rounded-md border-2 border-[#2a2a2e] bg-white px-4 py-2 text-lg font-bold text-[#2a2a2e] shadow-[3px_3px_0_0_#86B86A]" style={hand}>
                  <span className="[@media(hover:none)]:hidden">{copy.zombies.controls}</span>
                  <span className="hidden [@media(hover:none)]:inline">{copy.zombies.controlsTouch}</span>
                </p>
                <p className="max-w-lg rounded-md border-2 border-[#2a2a2e] bg-[#F2C4FF] px-4 py-2 text-lg font-bold text-[#2a2a2e]" style={hand}>
                  {copy.zombies.howTo.replace("{name}", friend)}
                </p>
              </motion.div>
            )}
            {phase === "cleared" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-x-0 top-[20%] flex flex-col items-center gap-2 text-center"
              >
                <h2 className="text-6xl font-bold text-white sm:text-7xl" style={{ ...hand, textShadow: "4px 4px 0 #2a2a2e" }}>
                  {copy.zombies.cleared}
                </h2>
                <p className="text-2xl font-bold text-white" style={{ ...hand, textShadow: "2px 2px 0 #2a2a2e" }}>
                  {copy.zombies.clearedBody}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Touch controls for the zombie stage (only on screens without hover) */}
          {(phase === "zombies" || phase === "cleared") && (
            <div className="absolute inset-x-0 bottom-4 hidden items-end justify-between px-4 [@media(hover:none)]:flex">
              <div className="flex gap-2">
                {(
                  [
                    ["left", ArrowLeft, copy.zombies.moveLeft],
                    ["down", ArrowDown, copy.zombies.drop],
                    ["right", ArrowRight, copy.zombies.moveRight],
                  ] as const
                ).map(([k, Icon, label]) => (
                  <button
                    key={k}
                    type="button"
                    aria-label={label}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      inputRef.current[k] = true;
                    }}
                    onPointerUp={() => (inputRef.current[k] = false)}
                    onPointerLeave={() => (inputRef.current[k] = false)}
                    onPointerCancel={() => (inputRef.current[k] = false)}
                    className="flex size-14 cursor-pointer items-center justify-center rounded-md border-2 border-[#2a2a2e] bg-white/90 text-[#2a2a2e] shadow-[3px_3px_0_0_#FFDE59] active:translate-y-0.5"
                  >
                    <Icon className="size-6" />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label={copy.zombies.jump}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    flapRef.current();
                  }}
                  className="flex size-14 cursor-pointer items-center justify-center rounded-md border-2 border-[#2a2a2e] bg-white/90 text-[#2a2a2e] shadow-[3px_3px_0_0_#A8E6B8] active:translate-y-0.5"
                >
                  <ArrowUp className="size-6" />
                </button>
                <button
                  type="button"
                  aria-label={copy.zombies.fire}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    inputRef.current.fire = true;
                  }}
                  onPointerUp={() => (inputRef.current.fire = false)}
                  onPointerLeave={() => (inputRef.current.fire = false)}
                  className="flex size-16 cursor-pointer items-center justify-center rounded-md border-2 border-[#2a2a2e] bg-[#F2C4FF] text-[#2a2a2e] shadow-[3px_3px_0_0_#FFBA7B] active:translate-y-0.5"
                >
                  <Crosshair className="size-7" />
                </button>
              </div>
            </div>
          )}

          {/* Close */}
          <button
            type="button"
            onClick={() => groowtStore.stopGame()}
            aria-label={copy.close}
            className="absolute top-4 right-4 z-10 flex size-11 cursor-pointer items-center justify-center rounded-full border-2 border-[#2a2a2e] bg-white text-[#2a2a2e] shadow-[3px_3px_0_0_#FFDE59] transition hover:rotate-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="size-5" />
          </button>

          {/* Sign in + rules */}
          <AnimatePresence>
            {phase === "intro" && (
              <motion.form
                key="intro"
                onSubmit={start}
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: -1 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="absolute top-1/2 left-1/2 w-[min(400px,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-[#2a2a2e] bg-white p-6 text-[#2a2a2e] shadow-[6px_6px_0_0_#FFDE59]"
              >
                <h2 className="text-5xl leading-none font-bold" style={hand}>
                  {copy.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-1.5 text-[14px]">
                  {copy.rules.map((rule, i) => (
                    <li key={rule} className="flex gap-2.5">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-[#FFDE59] text-[11px] font-bold tabular-nums">{i + 1}</span>
                      {rule}
                    </li>
                  ))}
                </ul>
                <label className="mt-5 block text-[13px] font-semibold">
                  {copy.nameLabel}
                  <input
                    autoFocus
                    required
                    maxLength={40}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={copy.namePlaceholder}
                    autoComplete="given-name"
                    className={cn(inputCls, "mt-1.5")}
                  />
                </label>
                <label className="mt-3 block text-[13px] font-semibold">
                  {copy.emailLabel}
                  <input
                    type="email"
                    maxLength={120}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={copy.emailPlaceholder}
                    autoComplete="email"
                    className={cn(inputCls, "mt-1.5")}
                  />
                </label>
                <p className="mt-2 text-[12px] text-[#2a2a2e]/60">{copy.privacy}</p>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#2a2a2e] px-5 py-3 text-[15px] font-semibold text-white transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a2a2e]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  <Play className="size-4 fill-current" />
                  {copy.start}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Ready */}
          <AnimatePresence>
            {phase === "ready" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="pointer-events-none absolute inset-x-0 top-[14%] flex flex-col items-center gap-3 px-6 text-center"
              >
                <h2 className="text-6xl font-bold text-white sm:text-7xl" style={{ ...hand, textShadow: "4px 4px 0 #2a2a2e" }}>
                  {copy.greet.replace("{name}", name.trim() || copy.title)}
                </h2>
                <p className="rounded-md border-2 border-[#2a2a2e] bg-white px-4 py-2 text-xl font-bold text-[#2a2a2e] shadow-[3px_3px_0_0_#FFDE59]" style={hand}>
                  {copy.hint}
                </p>
                {best > 0 && (
                  <p className="text-sm font-semibold text-white">
                    {copy.best}: {best}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rest stop */}
          <AnimatePresence>
            {phase === "rest" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                className="pointer-events-none absolute inset-x-0 top-[22%] flex flex-col items-center gap-3 px-6 text-center"
              >
                <h2 className="text-6xl font-bold text-white sm:text-7xl" style={{ ...hand, textShadow: "4px 4px 0 #2a2a2e" }}>
                  {copy.restTitle}
                </h2>
                <p className="rounded-md border-2 border-[#2a2a2e] bg-white px-4 py-2 text-xl font-bold text-[#2a2a2e] shadow-[3px_3px_0_0_#A8E6B8]" style={hand}>
                  {copy.restBody.replace("{n}", String(passed))}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game over */}
          <AnimatePresence>
            {phase === "over" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute top-1/2 left-1/2 w-[min(340px,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-[#2a2a2e] bg-white p-6 text-center shadow-[6px_6px_0_0_#FFDE59]"
              >
                <p className="text-5xl font-bold text-[#2a2a2e]" style={hand}>
                  {copy.over}
                </p>
                <div className="mt-4 flex justify-center gap-8">
                  <div>
                    <p className="text-xs font-semibold text-[#2a2a2e]/60">{copy.score}</p>
                    <p className="text-4xl font-bold text-[#2a2a2e] tabular-nums">{score}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#2a2a2e]/60">{copy.best}</p>
                    <p className="text-4xl font-bold text-[#2a2a2e] tabular-nums">{best}</p>
                  </div>
                </div>
                {newBest && (
                  <p className="mt-2 inline-block -rotate-2 rounded-md bg-[#FFDE59] px-2 py-0.5 text-lg font-bold" style={hand}>
                    {copy.newBest}
                  </p>
                )}
                <div className="mt-5 flex justify-center gap-2">
                  <button
                    type="button"
                    autoFocus
                    onClick={() => restartRef.current()}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#2a2a2e] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a2a2e]/40 focus-visible:ring-offset-2"
                  >
                    <RotateCcw className="size-4" />
                    {copy.again}
                  </button>
                  <button
                    type="button"
                    onClick={() => groowtStore.stopGame()}
                    className="inline-flex cursor-pointer items-center rounded-md border-2 border-[#2a2a2e] px-5 py-3 text-sm font-semibold text-[#2a2a2e] transition hover:bg-[#2a2a2e]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a2a2e]/40"
                  >
                    {copy.close}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
