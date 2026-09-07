import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { compliance } from "@/content/compliance";

export const metadata: Metadata = { title: compliance.meta.title, description: compliance.meta.description };

export default function CompliancePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Compliance", path: "/compliance" }]} />
      <LegalDocument
        eyebrow="Legal"
        title="Compliance"
        effectiveDate={compliance.effectiveDate}
        intro={compliance.intro}
        sections={compliance.sections}
      />
      <Cta12
        heading={compliance.cta.heading}
        primary={compliance.cta.primary}
        image={{ src: "/brand/blue-blur.jpg", alt: "" }}
      />
    </>
  );
}
