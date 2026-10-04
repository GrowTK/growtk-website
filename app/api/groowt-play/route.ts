import { clientIp, fieldsHtml, isEmail, makeLimiter, notifyOwner } from "@/lib/notify";

export const runtime = "nodejs";

/**
 * Someone started Groowt Flies → a heads-up email to the site owner
 * (lib/notify.ts, via Resend). Fire and forget from the game: the game never
 * waits on it, and a failure here never stops anyone playing.
 */

const limited = makeLimiter(4, 10 * 60_000);
const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

export async function POST(req: Request) {
  if (limited(clientIp(req))) return Response.json({ ok: false, error: "rate" }, { status: 429 });
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad-request" }, { status: 400 });
  }
  const name = clip(body.name, 60);
  const email = clip(body.email, 200);
  const page = clip(body.page, 200);
  if (!name) return Response.json({ ok: false, error: "invalid" }, { status: 400 });

  const when = new Date().toUTCString();
  const fields: [string, string][] = [
    ["Name", name],
    ["Email", email && isEmail(email) ? email : ""],
    ["Played from", page],
    ["When", when],
  ];
  const result = await notifyOwner({
    subject: `${name} just played Groowt Flies`,
    html: fieldsHtml("Someone played Groowt Flies", fields),
    text: fields.map(([k, v]) => `${k}: ${v || "(not given)"}`).join("\n"),
    replyTo: email && isEmail(email) ? email : undefined,
  });
  if (!result.sent) console.error("[groowt-play] email not sent:", result.error);
  return Response.json({ ok: result.sent });
}
