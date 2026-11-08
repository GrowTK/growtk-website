"use client";

import type { ComponentType } from "react";
import { ContactCenterHub, InboundConsole, OutboundDialer } from "./contact-center";
import { EcommerceChat, JourneyMap, UnifiedInbox } from "./support";
import { CoverageHeatmap, DocumentPipeline, ProcessRedesign, TicketTriage } from "./operations";
import { LeadFunnel, SalesKanban, TelemarketingCall } from "./growth";

/**
 * One coded, live looking visual per service page, keyed by the slugs in
 * content/service-pages.ts. Sample data lives in content/service-visuals.ts.
 */
const VISUALS: Record<string, ComponentType<{ className?: string }>> = {
  "contact-center-services": ContactCenterHub,
  "inbound-contact-center": InboundConsole,
  "outbound-contact-center": OutboundDialer,
  "ecommerce-customer-support": EcommerceChat,
  "customer-support": UnifiedInbox,
  "customer-experience-management": JourneyMap,
  "workforce-management": CoverageHeatmap,
  "technical-support": TicketTriage,
  "business-process-reengineering": ProcessRedesign,
  "back-office-support": DocumentPipeline,
  telemarketing: TelemarketingCall,
  "sales-support": SalesKanban,
  "lead-generation": LeadFunnel,
};

export function ServiceVisual({ slug, className }: { slug: string; className?: string }) {
  const V = VISUALS[slug];
  return V ? <V className={className} /> : null;
}
