/**
 * Booking widget -> the factory's `book` Edge Function. Plain fetch, no
 * Supabase SDK, no secret: the widget only ever sends a POST, the Edge
 * Function decides which site the request belongs to from the request's own
 * Origin header. Every site built by this factory lives on the same
 * Supabase project, so this URL is a public constant, not per-site config.
 */
const ENDPOINT = "https://itagbnqwayvjvyscogjl.supabase.co/functions/v1/book";

export type BookingPayload = {
  activity: string;
  activitySlug?: string;
  date: string; // yyyy-mm-dd
  time: string;
  guests: number;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  /** Only needed on localhost, where there's no real domain to resolve by. */
  slug?: string;
};

export type BookingResult =
  | { ok: true; duplicate: boolean }
  | { ok: false; error: string };

export async function submitBooking(payload: BookingPayload): Promise<BookingResult> {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: body?.error || `request failed (${res.status})` };
    return { ok: true, duplicate: Boolean(body?.duplicate) };
  } catch {
    return { ok: false, error: "Could not reach the booking service. Check your connection and try again." };
  }
}

export const isLocalDev = () =>
  typeof window !== "undefined" && /^localhost$|^127\.0\.0\.1$/.test(window.location.hostname);
