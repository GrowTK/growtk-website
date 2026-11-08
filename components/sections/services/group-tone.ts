import { INDUSTRY_THEME } from "@/components/sections/industries/industry-tones";
import type { ServiceGroup } from "@/content/service-pages";

/** One pastel per service group, borrowed from the trade palette so the hub and every service page share colours. */
const GROUP_THEME: Record<ServiceGroup, keyof typeof INDUSTRY_THEME> = {
  "contact-center": "hvac",
  "customer-support": "plumbing",
  growth: "electrical",
  operations: "landscaping",
};

export const groupTone = (group: ServiceGroup) => INDUSTRY_THEME[GROUP_THEME[group]].tone;
