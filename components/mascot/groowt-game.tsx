"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Crosshair, Megaphone, Play, RotateCcw, X } from "lucide-react";
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

type Pillar = { x: number; gapY: number; color: string; scored: boolean };
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

function drawGroowt(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number, flap: number, face: "fly" | "panic" | "dead", boil: number, look: { x: number; y: number }) {
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
    [s.wingL, s.wingLLines, 26, -1, "#FFB25C"],
    [s.wingR, s.wingRLines, 66, 1, "#FFB25C"],
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
  ctx.fillStyle = "#F59E5B";
  ctx.fill(s.tail);
  ctx.restore();
  sketch(ctx, s.tail, 1.5, boil);

  // Body colour, off register and a touch small inside its line.
  ctx.save();
  ctx.translate(46 + MIS.x + 0.6, 46 + MIS.y + 0.8);
  ctx.scale(0.95, 0.95);
  ctx.translate(-46, -46);
  const g = ctx.createRadialGradient(31, 20, 2, 40, 42, 62);
  g.addColorStop(0, "#FFF3B0");
  g.addColorStop(0.34, "#FFDE59");
  g.addColorStop(0.72, "#FFC46E");
  g.addColorStop(1, "#FFA867");
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
  ctx.fillStyle = "#FFF6D2";
  ctx.fill(s.belly);
  ctx.restore();
  sketch(ctx, s.bodyLine, 1.7, boil);
  ctx.lineWidth = 1.6;
  ctx.stroke(s.tuft);

  // Beak
  ctx.save();
  ctx.translate(MIS.x * 0.8, MIS.y * 0.8);
  ctx.fillStyle = "#FF9F43";
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
type Zombie = { x: number; y: number; vx: number; vy: number; hp: number; onGround: boolean; dir: 1 | -1; jumpAt: number; flash: number; wobble: number; speed: number };
type Shot = { x: number; y: number; vx: number; vy: number; rot: number; life: number };
type Puff = { x: number; y: number; vx: number; vy: number; life: number; color: string; r: number };
type Pickup = { x: number; y: number; born: number };
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
function drawNight(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, a: number, stars: { x: number; y: number; r: number; p: number }[]) {
  ctx.save();
  ctx.globalAlpha = a;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#1F1A3D");
  sky.addColorStop(0.55, "#4A3470");
  sky.addColorStop(1, "#8E5E9E");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
  // Stars
  ctx.fillStyle = "#FFF3B0";
  for (const st of stars) {
    ctx.globalAlpha = a * (0.5 + 0.5 * Math.sin(t * 3 + st.p));
    ctx.beginPath();
    ctx.arc(st.x * W, st.y * H, st.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = a;
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
  ctx.restore();
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

/** A spinning sticky note: the Blaster's ammo. */
function drawShot(ctx: CanvasRenderingContext2D, b: Shot, size: number) {
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.rotate(b.rot);
  ctx.fillStyle = "#FFDE59";
  ctx.fillRect(-size / 2 + 1.5, -size / 2 + 1.2, size, size);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.6;
  ctx.strokeRect(-size / 2, -size / 2, size, size);
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-size * 0.28, -size * 0.1);
  ctx.lineTo(size * 0.28, -size * 0.1);
  ctx.moveTo(-size * 0.28, size * 0.14);
  ctx.lineTo(size * 0.12, size * 0.14);
  ctx.stroke();
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

/** The Megaphone power-up, bobbing where a zombie fell. */
function drawPickup(ctx: CanvasRenderingContext2D, p: Pickup, t: number) {
  const s = getZShapes();
  ctx.save();
  ctx.translate(p.x - 16, p.y - 13 + Math.sin((t - p.born) * 4) * 4);
  ctx.globalAlpha = t - p.born > 7 ? 0.5 + 0.5 * Math.sin(t * 20) : 1;
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
  const [power, setPower] = React.useState(false);
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

  // Lock page scroll while the sky is up.
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
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
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    };
    resize();
    window.addEventListener("resize", resize);

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
    const grainPattern = ctx.createPattern(grain, "repeat");

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
    let zstage = 0, zToSpawn = 0, zSpawned = 0, kills = 0, nextSpawn = 0, nextShot = 0, muzzleAt = -1, powerUntil = 0, powerOn = false, clearAt = 0, platAlpha = 0;
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
    const jumpZ = () => -H * 1.0;

    const startZombies = () => {
      zstage += 1;
      pillars = [];
      platforms = makePlatforms(W, H, H - groundH());
      zombies = [];
      shots = [];
      puffs = [];
      pickups = [];
      floats = [];
      zToSpawn = Math.min(16, 4 + zstage * 2);
      zSpawned = 0;
      kills = 0;
      nextSpawn = t + 1.8;
      graceUntil = t + 1.5;
      pvx = 0;
      vy = 0;
      onGround = true;
      flutter = true;
      facing = 1;
      powerUntil = 0;
      powerOn = false;
      platAlpha = 0;
      setPower(false);
      setZLeft(zToSpawn);
      setZBanner(true);
      window.setTimeout(() => setZBanner(false), 3200);
      go("zombies");
    };

    const shoot = () => {
      const S = size();
      const ang = powerOn ? [-0.2, 0, 0.2] : [0];
      const sp = Math.max(700, W * 0.75);
      for (const a of ang) shots.push({ x: px + facing * S * 0.62, y: birdY + S * 0.11, vx: facing * sp * Math.cos(a), vy: sp * Math.sin(a) - 10, rot: Math.random(), life: 1.2 });
      muzzleAt = t;
      nextShot = t + 0.24;
    };

    const kill = (z: Zombie) => {
      for (let i = 0; i < 16; i++) {
        const a = Math.random() * Math.PI * 2, v = 80 + Math.random() * 220;
        puffs.push({ x: z.x, y: z.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, life: 0.5 + Math.random() * 0.4, color: [ZOMBIE_FILL, ZOMBIE_SHIRT, INK, "#FFDE59"][i % 4]!, r: 3 + Math.random() * 5 });
      }
      floats.push({ x: z.x, y: z.y - zSize() * 0.5, life: 0.9, text: "+2" });
      kills += 1;
      pts += 2;
      setScore(pts);
      setZLeft(zToSpawn - kills);
      if (kills % 4 === 0) pickups.push({ x: z.x, y: Math.min(z.y, H - groundH() - 40), born: t });
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
      powerOn = false;
      setPower(false);
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
        // ---- the zombie stage: run, jump, drop, shoot ----
        const inp = inputRef.current;
        const left = keys.has("ArrowLeft") || keys.has("KeyA") || inp.left;
        const right = keys.has("ArrowRight") || keys.has("KeyD") || inp.right;
        const down = keys.has("ArrowDown") || keys.has("KeyS") || inp.down;
        const fire = keys.has("KeyF") || keys.has("KeyJ") || keys.has("KeyX") || inp.fire;
        pvx = ((right ? 1 : 0) - (left ? 1 : 0)) * Math.max(240, W * 0.26);
        if (pvx) facing = pvx > 0 ? 1 : -1;
        const gTop = H - GH;
        const onLedge = onGround && birdY + FOOT() < gTop - 2;
        if (down && onLedge) {
          dropUntil = t + 0.28;
          onGround = false;
        }
        vy += gravity() * dt;
        px = Math.max(r, Math.min(W - r, px + pvx * dt));
        const prevFeet = birdY + FOOT();
        birdY += vy * dt;
        let feet = birdY + FOOT();
        let landed = false;
        if (vy >= 0 && t > dropUntil) {
          for (const p of platforms) {
            if (px > p.x - 8 && px < p.x + p.w + 8 && prevFeet <= p.y + 2 && feet >= p.y) {
              birdY = p.y - FOOT();
              landed = true;
              break;
            }
          }
        }
        feet = birdY + FOOT();
        if (feet >= gTop) {
          birdY = gTop - FOOT();
          landed = true;
        }
        if (landed) {
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
        platAlpha = Math.min(1, platAlpha + dt * 2.5);

        if (state === "zombies") {
          // Fire
          if (fire && t >= nextShot) shoot();
          // Spawn: in from the sides along the ground, or dropping from the sky onto a ledge
          if (zSpawned < zToSpawn && t >= nextSpawn) {
            zSpawned += 1;
            const fromSky = platforms.length && Math.random() < 0.35;
            const p = platforms[Math.floor(Math.random() * platforms.length)]!;
            const side = zSpawned % 2 ? -1 : 1;
            zombies.push({
              x: fromSky ? p.x + p.w * (0.2 + Math.random() * 0.6) : side < 0 ? -40 : W + 40,
              y: fromSky ? -80 : gTop - ZFOOT(),
              vx: 0,
              vy: 0,
              hp: 2,
              onGround: !fromSky,
              dir: side < 0 ? 1 : -1,
              jumpAt: t + 1 + Math.random() * 2,
              flash: 0,
              wobble: Math.random() * 6,
              speed: (Math.max(55, W * 0.045) + zstage * 9) * (0.85 + Math.random() * 0.3),
            });
            nextSpawn = t + Math.max(0.55, 1.5 - zstage * 0.12) + Math.random() * 0.5;
          }
        }
        // Zombies: shamble toward Groowt, fall off edges, hop up to reach him
        for (const z of zombies) {
          z.dir = px < z.x ? -1 : 1;
          if (z.onGround) z.vx = z.dir * z.speed;
          const above = birdY + FOOT() < z.y + ZFOOT() - 40;
          if (z.onGround && above && Math.abs(px - z.x) < W * 0.28 && t > z.jumpAt) {
            z.vy = jumpZ();
            z.onGround = false;
            z.jumpAt = t + 1.8 + Math.random() * 1.6;
          }
          z.vy += gravity() * dt;
          const zPrev = z.y + ZFOOT();
          z.x += z.vx * dt;
          z.y += z.vy * dt;
          let zLanded = false;
          if (z.vy >= 0) {
            for (const p of platforms) {
              const zf = z.y + ZFOOT();
              if (z.x > p.x - 4 && z.x < p.x + p.w + 4 && zPrev <= p.y + 2 && zf >= p.y) {
                z.y = p.y - ZFOOT();
                zLanded = true;
                break;
              }
            }
          }
          if (z.y + ZFOOT() >= gTop) {
            z.y = gTop - ZFOOT();
            zLanded = true;
          }
          if (zLanded) {
            z.vy = 0;
            z.onGround = true;
          } else if (z.vy > 0) z.onGround = false;
          z.flash -= dt;
          // Touch him and he's out.
          if (state === "zombies" && t > graceUntil && Math.abs(z.x - px) < r + zSize() * 0.22 && Math.abs(z.y - birdY) < r + zSize() * 0.32) die();
        }
        // Shots
        const zs = zSize();
        for (const b of shots) {
          // Sticky notes home in, gently, on the nearest zombie ahead of them.
          let best: Zombie | null = null, bd = Infinity;
          for (const z of zombies) {
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
            let diff = want - cur;
            diff = Math.atan2(Math.sin(diff), Math.cos(diff));
            const turn = Math.max(-3.2 * dt, Math.min(3.2 * dt, diff));
            b.vx = Math.cos(cur + turn) * sp;
            b.vy = Math.sin(cur + turn) * sp;
          }
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          b.rot += 14 * dt * Math.sign(b.vx || 1);
          b.life -= dt;
          for (const z of zombies) {
            if (z.hp > 0 && b.life > 0 && Math.abs(b.x - z.x) < zs * 0.32 && Math.abs(b.y - z.y) < zs * 0.42) {
              z.hp -= 1;
              z.flash = 0.12;
              z.x += Math.sign(b.vx) * 10;
              b.life = 0;
              if (z.hp <= 0) kill(z);
            }
          }
        }
        shots = shots.filter((b) => b.life > 0 && b.x > -40 && b.x < W + 40);
        zombies = zombies.filter((z) => z.hp > 0);
        // Megaphone pickups
        for (const p of pickups) {
          if (Math.hypot(p.x - px, p.y - birdY) < r + 22) {
            powerUntil = t + 8;
            p.born = -999;
          }
        }
        pickups = pickups.filter((p) => p.born > -999 && t - p.born < 9);
        if (!powerOn && t < powerUntil) {
          powerOn = true;
          setPower(true);
        } else if (powerOn && t >= powerUntil) {
          powerOn = false;
          setPower(false);
        }
        // Every zombie gone: all clear, then back to the sky.
        if (state === "zombies" && zSpawned >= zToSpawn && zombies.length === 0) {
          clearAt = t;
          go("cleared");
        }
        if (state === "cleared" && t - clearAt > 1.6) {
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
        if (Math.abs(H * 0.45 - birdY) < 8 && Math.abs(birdX() - px) < 8) {
          platforms = [];
          spawned = 0;
          vy = jumpV() * 0.6;
          go("playing");
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
          pillars.push({ x: W + 40, gapY: margin + g / 2 + Math.random() * Math.max(10, H - GH - 2 * margin - g), color: PILLAR_COLORS[colorIdx++ % PILLAR_COLORS.length]!, scored: false });
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
        if (state === "playing" && spawned >= REST_EVERY && pillars.every((p) => p.scored)) go("landing");
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

      // ---- draw ----
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#4FAEF0");
      sky.addColorStop(0.6, "#8CCBF7");
      sky.addColorStop(1, "#CDEBFF");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);
      if (grainPattern) {
        ctx.save();
        ctx.globalAlpha = 0.08;
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = grainPattern;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      if (platAlpha > 0) drawNight(ctx, W, H, t, platAlpha, stars);

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
        drawPillar(ctx, p.x, -20, p.gapY - g / 2 + 20, pw, p.color, true, boil);
        drawPillar(ctx, p.x, p.gapY + g / 2, H - GH - (p.gapY + g / 2) + 20, pw, p.color, false, boil);
      }

      // Ground: a grassy strip with scrolling tufts.
      ctx.save();
      ctx.fillStyle = "#A8E6B8";
      ctx.fillRect(0, H - GH + 3, W, GH);
      ctx.fillStyle = "#8FD7A2";
      ctx.fillRect(0, H - GH * 0.45, W, GH * 0.45);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, H - GH);
      for (let x = -groundOff; x <= W + 40; x += 20) ctx.quadraticCurveTo(x + 10, H - GH - 4, x + 20, H - GH);
      ctx.stroke();
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let x = -groundOff; x <= W + 40; x += 40) {
        ctx.moveTo(x + 8, H - GH * 0.55);
        ctx.lineTo(x + 12, H - GH * 0.7);
        ctx.moveTo(x + 14, H - GH * 0.55);
        ctx.lineTo(x + 16, H - GH * 0.72);
      }
      ctx.stroke();
      ctx.restore();

      if (platAlpha > 0) drawGraveyard(ctx, W, H, GH, platAlpha, boil);
      if (platforms.length) {
        ctx.save();
        ctx.globalAlpha = platAlpha;
        for (const p of platforms) drawPlatform(ctx, p, boil, t);
        ctx.restore();
      }
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
      if (zMode) drawBlaster(ctx, S, t - muzzleAt < 0.07, powerOn);
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
      window.removeEventListener("resize", resize);
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
              {power && (
                <motion.span
                  initial={{ scale: 0.6 }}
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="inline-flex items-center gap-1.5 rounded-md border-2 border-[#2a2a2e] bg-[#FFBA7B] px-3 py-1 text-sm font-bold text-[#2a2a2e]"
                >
                  <Megaphone aria-hidden className="size-4" />
                  {copy.zombies.power}
                </motion.span>
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

/** A Play button that opens the game, for pages (the corner one lives on Groowt himself, on hover). */
export function GroowtPlayButton({ className }: { className?: string }) {
  const { open, game } = useGroowt();
  if (open || game) return null;
  return (
    <motion.button
      type="button"
      onClick={() => groowtStore.play()}
      aria-label={groowt.game.playLabel}
      whileHover={{ y: -2, rotate: -2 }}
      whileTap={{ scale: 0.94 }}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-md border-2 border-[#2a2a2e] bg-white px-3 py-1.5 text-sm font-bold text-[#2a2a2e] shadow-[3px_3px_0_0_#FFDE59] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a2a2e]/40 focus-visible:ring-offset-2",
        className,
      )}
    >
      <Play className="size-3.5 fill-current" />
      {groowt.game.play}
    </motion.button>
  );
}
