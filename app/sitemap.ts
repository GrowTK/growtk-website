import type { MetadataRoute } from "next";
import { brand } from "@/brand.config";

const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/industries", priority: 0.9, changeFrequency: "monthly" },
  { path: "/industries/hvac", priority: 0.8, changeFrequency: "monthly" },
  { path: "/industries/plumbing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/industries/electrical", priority: 0.8, changeFrequency: "monthly" },
  { path: "/industries/roofing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/industries/railing-fencing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/industries/landscaping", priority: 0.8, changeFrequency: "monthly" },
  { path: "/industries/pest-control", priority: 0.8, changeFrequency: "monthly" },
  { path: "/industries/cleaning", priority: 0.8, changeFrequency: "monthly" },
  { path: "/industries/healthcare", priority: 0.8, changeFrequency: "monthly" },
  { path: "/code-cleanup", priority: 0.7, changeFrequency: "monthly" },
  { path: "/process", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/team", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/compliance", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${brand.domain}`;
  const now = new Date();
  return routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
