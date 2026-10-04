import type { Metadata } from "next";
import { ContactStudio } from "@/components/sections/contact/contact-studio";
import { ContactSteps } from "@/components/sections/contact/contact-steps";
import { IndustryFaq } from "@/components/sections/industries/industry-faq";
import { washTone } from "@/components/sections/company/wash";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { contact } from "@/content/contact";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import type { FaqItem } from "@/content/types";

export const metadata: Metadata = { title: contact.meta.title, description: contact.meta.description };

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: contact.faq.items.map((item: FaqItem) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <BreadcrumbJsonLd items={[{ name: "Contact", path: "/contact" }]} />
      <ContactStudio
        heading={contact.header}
        copy={{ direct: contact.direct, form: contact.form }}
        services={services.services.map((s) => ({ id: s.id, title: s.title.split(",")[0]! }))}
        trades={industries.map((i) => i.name)}
      />
      <ContactSteps heading={contact.expect.heading} items={contact.expect.items} />
      <IndustryFaq heading={contact.faq.heading} items={contact.faq.items} tone={washTone("peach")} />
    </>
  );
}
