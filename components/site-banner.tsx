import { Mail } from "lucide-react";
import { brand } from "@/brand.config";

/** Thin brand-blue strip above the navbar, on every page. */
export function SiteBanner() {
  return (
    <div
      className="relative h-7 w-full bg-cover bg-center"
      style={{ backgroundImage: "url(/brand/blue-blur.jpg)" }}
    >
      <div aria-hidden className="absolute inset-0 bg-[#0636A6]/30 backdrop-blur-sm" />
      <p className="relative z-10 flex h-full items-center justify-center gap-1.5 text-[11px] font-medium text-white">
        <Mail aria-hidden className="size-3" />
        <a href={`mailto:${brand.contact.email}`} className="cursor-pointer hover:underline">{brand.contact.email}</a>
      </p>
    </div>
  );
}
