import { Nav09 } from "@/components/sections/nav/nav-09";
import { brand } from "@/brand.config";
import { site } from "@/content/site";

/**
 * The one navbar every page shares: hides on scroll down, reappears on
 * scroll up, with a reading-progress hairline. Carries the real logo (which
 * already includes the wordmark), so brandName is left blank to avoid
 * showing "Dentavanta" twice next to its own name.
 */
export function SiteNav() {
  return (
    <Nav09
      items={site.nav}
      cta={site.navCta ?? undefined}
      logo={{ src: "/brand/logo-black.png", alt: brand.name }}
      brandName=""
    />
  );
}
