import type { CatalogEntry } from "@/components/sections/catalog-types";
import { Quote01 } from "@/components/sections/quote/quote-01";
import { Quote02 } from "@/components/sections/quote/quote-02";
import { Quote03 } from "@/components/sections/quote/quote-03";
import { Quote04 } from "@/components/sections/quote/quote-04";
import { demoQuotes } from "@/content/demo";

export const QUOTE_ENTRIES: CatalogEntry[] = [
  { code: "QUOTE-01", category: "Quote", label: "Full bleed brand color band holding a single oversized line, a quote mark and a mono attribution, nothing else on the page. Best for a bold standalone breather between two dense sections, a mission line or a headline testimonial that should carry the whole viewport on its own.",
    file: "components/sections/quote/quote-01.tsx", component: "Quote01", props: "quote: Quote",
    node: <Quote01 quote={demoQuotes[0]} /> },
  { code: "QUOTE-02", category: "Quote", label: "Two panel rounded card, a full height portrait photo on one side and the quote on a solid surface beside it, the author's name set large like a signature. Best for a named founder, owner or captain speaking in their own voice, where a face builds more trust than an anonymous line.",
    file: "components/sections/quote/quote-02.tsx", component: "Quote02", props: "quote: Quote, since?: string",
    node: <Quote02 quote={demoQuotes[1]} since="Sailing out of Slip 14 since 2013" /> },
  { code: "QUOTE-03", category: "Quote", label: "A narrow reading column of body paragraphs with one hairline framed quote breaking wider than the column in the middle, no card, no fill, just a change of voice. Best for a longer story page (about, our history, a founder letter) where the quote punctuates surrounding prose rather than standing alone.",
    file: "components/sections/quote/quote-03.tsx", component: "Quote03", props: "quote: Quote, before?: string[], after?: string[]",
    node: <Quote03 quote={demoQuotes[2]}
      before={["We bought the second boat in 2016 because the first one kept selling out by March, not because we wanted a fleet.", "The rule has not changed since: twelve guests, two crew, and nobody waiting for the ladder."]}
      after={["That is also why we still cook lunch aboard instead of handing out a packed box at the dock."]} /> },
  { code: "QUOTE-04", category: "Quote", label: "Three short quotes in one row on a muted band, separated by vertical rules and numbered instead of boxed in cards, with an optional eyebrow above. Best for a quick chorus of guest or customer voices side by side, when you want more than one testimonial visible at once without it reading as a review grid.",
    file: "components/sections/quote/quote-04.tsx", component: "Quote04", props: "eyebrow?: string, quotes: Quote[]",
    node: <Quote04 eyebrow="From the logbook" quotes={demoQuotes} /> },
];
