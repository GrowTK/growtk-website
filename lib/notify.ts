/**
 * Server only (API routes): reads secrets from the env. Owner notifications by email, through Resend's REST API (no SDK).
 *
 * Env:
 * - RESEND_API_KEY (required to send; without it nothing is sent and callers carry on)
 * - RESEND_FROM    (optional) a sender on a domain verified in Resend. Defaults to notifications@growtk.co.
 * - NOTIFY_TO      (optional) where notifications go. Defaults to the site owner.
 */

const DEFAULT_TO = "anique.cs@gmail.com";
// growtk.co is the domain verified in Resend; any address on it can send.
const DEFAULT_FROM = "Growtk <notifications@growtk.co>";

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export const isEmail = (s: string) => /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/.test(s);

/** A plain two-column table of fields, for the email body. */
export function fieldsHtml(title: string, fields: [string, string][], footer?: string) {
  const rows = fields
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#6b6b70;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td><td style="padding:6px 0;color:#26262a;white-space:pre-wrap">${escapeHtml(v || "(not given)")}</td></tr>`,
    )
    .join("");
  return `<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5"><h2 style="margin:0 0 12px;color:#26262a">${escapeHtml(title)}</h2><table style="border-collapse:collapse">${rows}</table>${footer ? `<p style="margin-top:16px;color:#6b6b70;font-size:13px">${escapeHtml(footer)}</p>` : ""}</div>`;
}

export async function notifyOwner({
  subject,
  html,
  text,
  replyTo,
}: {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<{ sent: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY || process.env.RESEND_TOKEN;
  if (!key) return { sent: false, error: "no-key" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || DEFAULT_FROM,
        to: [process.env.NOTIFY_TO || DEFAULT_TO],
        subject,
        html,
        text,
        ...(replyTo && isEmail(replyTo) ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) return { sent: false, error: `resend ${res.status}: ${(await res.text().catch(() => "")).slice(0, 200)}` };
    return { sent: true };
  } catch (err) {
    return { sent: false, error: (err as Error).message };
  }
}

/** A small per-IP sliding-window limiter, per route (in memory, per instance). */
export function makeLimiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (ip: string) => {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5000) hits.clear();
    return recent.length > max;
  };
}

export const clientIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
