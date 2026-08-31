import { Footer05 } from "@/components/sections/footer/footer-05";
import { brand } from "@/brand.config";
import { site } from "@/content/site";

/** The dense sitemap footer used on every inner page. Home gets its own reveal footer. */
export function SiteFooter() {
  return (
    <Footer05
      brandName={brand.name}
      tagline={site.footer.blurb}
      columns={site.footer.groups}
      legal={site.footer.legalLinks}
      copyright={site.footer.legal}
    />
  );
}
