import { clientIp, fieldsHtml, isEmail, makeLimiter, notifyOwner } from "@/lib/notify";

export const runtime = "nodejs";

/**
 * Contact form → an email to the site owner (lib/notify.ts, via Resend).
 * Reply-to is the visitor, so answering the email answers them.
 */

const limited = makeLimiter(5, 10 * 60_000);
const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

export async function POST(req: Request) {
  if (limited(clientIp(req))) return Response.json({ ok: false, error: "rate" }, { status: 429 });

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad-request" }, { status: 400 });
  }
  // A filled honeypot means a bot: pretend it worked, send nothing.
  if (clip(body.website, 200)) return Response.json({ ok: true });

  const name = clip(body.name, 120);
  const business = clip(body.business, 160);
  const email = clip(body.email, 200);
  const phone = clip(body.phone, 60);
  const trade = clip(body.trade, 80);
  const message = clip(body.message, 4000);
  const services = Array.isArray(body.services) ? body.services.filter((s): s is string => typeof s === "string").slice(0, 12).map((s) => s.slice(0, 80)) : [];
  if (!name || !business || !isEmail(email)) return Response.json({ ok: false, error: "invalid" }, { status: 400 });

  const fields: [string, string][] = [
    ["Name", name],
    ["Business", business],
    ["Trade", trade],
    ["Email", email],
    ["Phone", phone],
    ["Interested in", services.join(", ")],
    ["Message", message],
  ];
  const result = await notifyOwner({
    subject: `New inquiry from ${business || name}`,
    html: fieldsHtml("New inquiry from the contact page", fields, "Reply to this email to answer them directly."),
    text: fields.map(([k, v]) => `${k}: ${v || "(not given)"}`).join("\n"),
    replyTo: email,
  });
  if (!result.sent) {
    console.error("[contact] email not sent:", result.error);
    return Response.json({ ok: false, error: "send-failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
