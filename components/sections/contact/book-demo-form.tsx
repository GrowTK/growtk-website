"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { brand } from "@/brand.config";

type Copy = {
  nameLabel: string;
  namePlaceholder: string;
  practiceLabel: string;
  practicePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
  disclaimer: string;
};

const field =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground transition duration-200 ease-out placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none";
const label = "mb-1.5 block text-sm font-medium text-foreground";

/**
 * Bespoke: there is no backend behind this site yet. Submitting builds a
 * mailto: link from the fields and opens the visitor's own email client.
 * Honest by design: no fake "we got your message" success screen, since
 * nothing was actually received by a server.
 */
export function BookDemoForm({ copy }: { copy: Copy }) {
  const [name, setName] = useState("");
  const [practice, setPractice] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [opened, setOpened] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = `Demo request from ${practice || name}`;
    const body = [
      `Name: ${name}`,
      `Practice: ${practice}`,
      `Email: ${email}`,
      "",
      message || "(No additional message.)",
    ].join("\n");
    const href = `mailto:${brand.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setOpened(true);
  }

  return (
    <section className="bg-background py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-2xl px-6">
        <Reveal>
          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-8 sm:p-10">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="bd-name" className={label}>{copy.nameLabel}</label>
                <input
                  id="bd-name" type="text" required value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={copy.namePlaceholder} className={field}
                />
              </div>
              <div>
                <label htmlFor="bd-practice" className={label}>{copy.practiceLabel}</label>
                <input
                  id="bd-practice" type="text" required value={practice}
                  onChange={(e) => setPractice(e.target.value)}
                  placeholder={copy.practicePlaceholder} className={field}
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="bd-email" className={label}>{copy.emailLabel}</label>
              <input
                id="bd-email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={copy.emailPlaceholder} className={field}
              />
            </div>

            <div className="mt-6">
              <label htmlFor="bd-message" className={label}>{copy.messageLabel}</label>
              <textarea
                id="bd-message" rows={5} value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={copy.messagePlaceholder} className={field}
              />
            </div>

            <button
              type="submit"
              className="group mt-8 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto"
            >
              <Mail aria-hidden className="size-4" />
              {copy.submitLabel}
              <Send aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </button>

            <p aria-live="polite" className="mt-4 text-xs leading-relaxed text-muted-foreground">
              {opened
                ? `Your email app should be opening now, addressed to ${brand.contact.email}. If nothing happened, write to us there directly.`
                : copy.disclaimer}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
