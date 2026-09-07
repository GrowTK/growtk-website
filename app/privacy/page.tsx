import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { privacy } from "@/content/privacy";

export const metadata: Metadata = { title: privacy.meta.title, description: privacy.meta.description };

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Privacy policy", path: "/privacy" }]} />
      <LegalDocument
        eyebrow="Legal"
        title="Privacy policy"
        effectiveDate={privacy.effectiveDate}
        intro={privacy.intro}
        sections={privacy.sections}
      />
      <Cta12
        heading={privacy.cta.heading}
        primary={privacy.cta.primary}
        image={{ src: "/brand/blue-blur.jpg", alt: "" }}
      />
    </>
  );
}
