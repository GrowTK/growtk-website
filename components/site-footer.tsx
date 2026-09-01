import { brand } from "@/brand.config";
import { site } from "@/content/site";
import { Footer02 } from "@/components/sections/footer/footer-02";

/** Standard footer, identical on every page. */
export function SiteFooter() {
  return (
    <Footer02
      brandName={brand.name}
      tagline={brand.tagline}
      logoSrc="/brand/logo-white.png"
      columns={site.footer.groups}
      legal={site.footer.legalLinks}
      copyright={site.footer.legal}
    />
  );
}
