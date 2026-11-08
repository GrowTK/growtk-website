"use client";

import { BankingVisual } from "./banking-visual";
import { EcommerceVisual } from "./ecommerce-visual";
import { HealthcareVisual } from "./healthcare-visual";
import { LogisticsVisual } from "./logistics-visual";
import { RideVisual } from "./ride-visual";
import { SaasVisual } from "./saas-visual";
import { TelecomVisual } from "./telecom-visual";

const VISUALS: Record<string, (p: { className?: string }) => React.ReactNode> = {
  "banking-fintech": BankingVisual,
  "ride-hailing": RideVisual,
  ecommerce: EcommerceVisual,
  logistics: LogisticsVisual,
  telecom: TelecomVisual,
  healthcare: HealthcareVisual,
  saas: SaasVisual,
};

/**
 * One coded, live looking scene per industry: an AI agent handling a typical
 * moment for that business. Decorative; each carries its own sr-only label.
 * Returns null for an unknown slug.
 */
export function IndustryVisual({ slug, className }: { slug: string; className?: string }) {
  const V = VISUALS[slug];
  return V ? <V className={className} /> : null;
}
