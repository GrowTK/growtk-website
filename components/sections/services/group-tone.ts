import { INDUSTRY_THEME } from "@/components/sections/industries/industry-tones";
import type { ServiceGroup } from "@/content/service-pages";

/** One pastel per service group, borrowed from the trade palette so the hub and every service page share colours. */
const GROUP_THEME: Record<ServiceGroup, keyof typeof INDUSTRY_THEME> = {
  "customer-support": "hvac",
  operations: "plumbing",
  growth: "electrical",
};

export const groupTone = (group: ServiceGroup) => INDUSTRY_THEME[GROUP_THEME[group]].tone;
