/**
 * Ultra Modern Rails case-study deck. Unlike the product decks, the middle of
 * this one is the client presentation we built for UMR (plain HTML, CSS and
 * JS, copied from umr-platform/umr-presentation/site into
 * public/ingested/umr/deck). The site's deck shell hosts it in one iframe
 * (`?embed`) and owns the chrome, progress bar and navigation, so the slide
 * ids below must match the `data-id` of each `<section>` in that page.
 *
 * `duration` is the autoplay time per slide in ms, taken from the
 * presentation's own `data-dur` values. Customers and reps in the demos carry
 * fictional names (initials kept so the avatars match); contacts are example.com and 555 numbers.
 */
import type { SlideCopy } from "./corvinn";

export type UmrSlideCopy = SlideCopy & { duration: number };

export const umrDeck = {
  /** The hosted presentation. Its relative asset paths resolve from this folder. */
  embedSrc: "/ingested/umr/deck/index.html",
  embedTitle: "Ultra Modern Rails system presentation",
  deskSrc: "/ingested/umr/deck/widget/index.html",
  deskTitle: "UMR Quote Desk, the chat widget's product page",

  slides: {
    cover: { id: "cover", thumb: "/ingested/umr/slides/cover.jpg", title: "Ultra Modern Rails", summary: "The project at a glance" },
    embedded: [
      { id: "ov", thumb: "/ingested/umr/slides/ov.jpg", title: "Overview", hint: "A quote tool wired straight into the CRM", summary: "The client, the live site and the four tools we connected", duration: 11000 },
      { id: "form", thumb: "/ingested/umr/slides/form.jpg", title: "The Quote Form", hint: "Fill a sample quote and submit it", summary: "The Shopify quote form, and everything one submission sets off", duration: 14000 },
      { id: "resp", thumb: "/ingested/umr/slides/resp.jpg", title: "Instant Lead Response", hint: "Tap a channel or replay the sequence", summary: "Email and SMS to the customer in seconds, then the rep follows up", duration: 11000 },
      { id: "mail", thumb: "/ingested/umr/slides/mail.jpg", title: "Confirmation Email", hint: "The email scrolls to show what the customer submitted", summary: "The confirmation that lands in the customer's inbox", duration: 10000 },
      { id: "rr", thumb: "/ingested/umr/slides/rr.jpg", title: "Round Robin", hint: "Send leads and watch them rotate", summary: "Each new lead goes to the next rep in turn", duration: 9000 },
      { id: "pl", thumb: "/ingested/umr/slides/pl.jpg", title: "Opportunities", hint: "Drag any card to another stage to start its workflow", summary: "The GoHighLevel pipeline, where each stage runs its own workflow", duration: 17000 },
      { id: "slack", thumb: "/ingested/umr/slides/slack.jpg", title: "Slack Integration", hint: "Pick a channel to see what lands there", summary: "Quotes, support cases and wins, each in its own channel", duration: 12000 },
      { id: "conv", thumb: "/ingested/umr/slides/conv.jpg", title: "Representative Conversations", hint: "Pick a callout, or open another conversation", summary: "Every email, text and call in one thread per customer", duration: 12000 },
      { id: "routes", thumb: "/ingested/umr/slides/routes.jpg", title: "How the Chat Works", hint: "Pick a route to follow it", summary: "The website chat and where each kind of request goes", duration: 12000 },
      { id: "widget", thumb: "/ingested/umr/slides/widget.jpg", title: "The Chat Experience", hint: "Use the chat: pick an option and finish the flow", summary: "A guided run through the chat, then your turn", duration: 50000 },
    ] satisfies UmrSlideCopy[],
    /** The product page we built to sell the chat widget on its own, hosted in its own iframe. */
    desk: { id: "desk", thumb: "/ingested/umr/slides/desk.jpg", title: "The Quote Desk", hint: "The widget's own product page. Scroll it and send a case down the line.", summary: "The page we built to sell the chat widget to other Shopify stores", duration: 20000 },
    closing: { id: "closing", thumb: "/ingested/umr/slides/closing.jpg", title: "Start a project", summary: "Want your leads handled like this" },
  },

  closing: {
    eyebrow: "Your turn",
    title: "Want every quote request answered in seconds",
    body: "We connect your website forms, CRM, team chat and inboxes so each lead gets an instant reply, a named rep and a place in your pipeline.",
    primary: { label: "Start a project", href: "/contact" },
    secondary: { label: "Back to all work", href: "/#work" },
  },
};
