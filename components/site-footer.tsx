import { brand } from "@/brand.config";
import { Footer02 } from "@/components/sections/footer/footer-02";

/** Standard footer, identical on every page. */
export function SiteFooter() {
  return (
    <Footer02
      brandName={brand.name}
      tagline={brand.tagline}
      logoSrc="/brand/logo-black.png"
      columns={[
        { title: "Product", links: [{ label: "Platform", href: "/" }, { label: "Security", href: "/security" }, { label: "Pricing", href: "/pricing" }] },
        { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Book a demo", href: "/book-demo" }] },
        { title: "Get in touch", links: [{ label: brand.contact.email, href: `mailto:${brand.contact.email}` }] },
      ]}
      legal={[{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }]}
    />
  );
}
