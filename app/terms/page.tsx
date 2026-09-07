import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { terms } from "@/content/terms";

export const metadata: Metadata = { title: terms.meta.title, description: terms.meta.description };

export default function TermsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Terms of service", path: "/terms" }]} />
      <LegalDocument
        eyebrow="Legal"
        title="Terms of service"
        effectiveDate={terms.effectiveDate}
        intro={terms.intro}
        sections={terms.sections}
      />
      <Cta12
        heading={terms.cta.heading}
        primary={terms.cta.primary}
        image={{ src: "/brand/blue-blur.jpg", alt: "" }}
      />
    </>
  );
}
