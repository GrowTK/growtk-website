import { ArrowRight, ShieldCheck } from "lucide-react";
import { brand } from "@/brand.config";
import { ParallaxPhoto } from "@/components/sections/about/parallax-photo";
import { Feature06 } from "@/components/sections/features/feature-06";
import { FeatureVoiceBlob } from "@/components/sections/features/voice-blob";
import { Quote01 } from "@/components/sections/quote/quote-01";
import { Testimonial09 } from "@/components/sections/testimonials/testimonial-09";
import { Cta12 } from "@/components/sections/cta/cta-12";

const MISSION_QUOTE = {
  text: "Every claim on this page is something we can actually show you, not just tell you.",
  author: "Dentavanta",
};

// Placeholder until real practices sign on. Swap for actual quotes before this ships.
const PLACEHOLDER_TESTIMONIALS = [
  { quote: "We switched mid-quarter and the migration was done in an afternoon, not a project.", name: "Dr. Lena Osei", role: "Practice owner (placeholder)" },
  { quote: "The first question every vendor gets from us now is whether they'll sign a real BAA. Dentavanta actually will.", name: "Marcus Webb", role: "Practice manager (placeholder)" },
  { quote: "I asked their engineer the hard security questions myself. I got real answers, not a sales deck.", name: "Dr. Priya Anand", role: "Practice owner (placeholder)" },
  { quote: "Support that actually knows the product, because the person who built it is the person who answers.", name: "Talia Ruiz", role: "Front desk lead (placeholder)" },
];

const CAPABILITIES = [
  { icon: "Fingerprint", title: "Cognito authentication", body: "Every sign-in runs through a tenant-scoped AWS Cognito pool. Passwords never touch our own servers." },
  { icon: "Database", title: "Row-level tenant isolation", body: "Enforced by the database itself: a query scoped to one practice cannot return another practice's rows." },
  { icon: "ClipboardList", title: "Full audit logging", body: "Every access to patient data is written to a log a practice can review." },
  { icon: "KeyRound", title: "Encryption everywhere", body: "Patient data is encrypted at rest and in transit with AWS Key Management Service." },
  { icon: "FileCheck", title: "A real, signed BAA", body: "Not boilerplate on a page. A counsel-reviewed Business Associate Agreement with every practice." },
  { icon: "ShieldCheck", title: "Live today, not a roadmap", body: "The full sign-in to audit-log chain already runs end to end on one production endpoint." },
];

type CornerPhoto = { src: string; alt: string; position: string; rotate: string; speed: number };

const ABOUT_PHOTOS: CornerPhoto[] = [
  {
    src: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=500&q=70",
    alt: "Dentist and patient reviewing a scan together",
    position: "left-[8%] top-[12%] w-44 lg:w-56",
    rotate: "-rotate-6",
    speed: 0.7,
  },
  {
    src: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=500&q=70",
    alt: "Clinician holding a dental scan up to a lightbox",
    position: "right-[7%] top-[12%] w-44 lg:w-60",
    rotate: "rotate-6",
    speed: 1.2,
  },
  {
    src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=500&q=70",
    alt: "Clean, modern dental treatment room",
    position: "left-[12%] bottom-[13%] w-40 lg:w-52",
    rotate: "rotate-3",
    speed: 1,
  },
  {
    src: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=500&q=70",
    alt: "Patient fitting a clear dental aligner",
    position: "right-[9%] bottom-[9%] w-40 lg:w-52",
    rotate: "-rotate-4",
    speed: 0.85,
  },
];

export default function Home() {
  return (
    <>
    <main data-nav-theme="dark" className="relative isolate flex min-h-[calc(100vh-92px)] flex-col overflow-hidden">
      {/* Full bleed looping hero video, compressed from the source gif (166MB -> 4.4MB). */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/brand/hero-poster.jpg"
        className="absolute inset-0 -z-20 size-full object-cover"
      >
        <source src="/brand/hero.mp4" type="video/mp4" />
      </video>
      {/* Full blur across the whole hero, plus a light gradient so the bottom text still has extra contrast. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-black/35 to-black/20 backdrop-blur-md"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-6 pt-20 pb-20 sm:px-10 lg:pb-20">
        <div className="max-w-2xl">
          <img src="/brand/hipaa.png" alt="HIPAA" className="h-14 w-auto sm:h-16" />
          <h1 className="mt-4 font-display text-4xl font-bold leading-[0.95] tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
            Practice software
            <br />
            built like it actually
            <br />
            handles patient data
          </h1>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <a
              href={`mailto:${brand.contact.email}`}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none"
            >
              Book a demo
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </a>
            <span className="text-sm text-white/70">Or email {brand.contact.email}</span>
          </div>
        </div>

        {/* Floating glass badge, bottom right, matching the reference's stat-plus-caption pattern with an honest number. */}
        <div className="mt-14 flex flex-col items-start gap-4 sm:absolute sm:right-10 sm:bottom-16 sm:max-w-xs sm:items-end sm:text-right lg:right-16">
          <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-md">
            <ShieldCheck aria-hidden className="size-5 text-white" />
            <p className="font-display text-2xl font-bold tracking-tight text-white">100%</p>
          </div>
          <p className="text-sm leading-relaxed text-white/80">
            Every practice&apos;s data is isolated at the database itself, covered by a signed Business Associate Agreement.
          </p>
        </div>
      </div>
    </main>

    <section className="relative overflow-hidden bg-background px-6 py-36 sm:py-44 lg:py-52 my-12">
      {/* Corner photos: decorative, so hidden below the point they'd collide with the centered copy. */}
      {ABOUT_PHOTOS.map((photo) => (
        <ParallaxPhoto
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          speed={photo.speed}
          className={`pointer-events-none absolute hidden aspect-square overflow-hidden rounded-md lg:block ${photo.position} ${photo.rotate}`}
        />
      ))}

      <div className="relative mx-auto max-w-xl text-center">
        <p className="eyebrow text-primary">About us</p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
          Compassionate care,
          <br />
          trusted expertise.
        </h2>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          At {brand.name}, we build software the way we would want our own family&apos;s dental office
          run: with real security, real accountability to the people whose data it is, and no
          shortcuts on either.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`mailto:${brand.contact.email}`}
            className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#0636A6] px-7 py-3.5 text-sm font-semibold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#0636A6] focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Book a demo
            <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
          </a>
          <a
            href="#"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            About us
          </a>
        </div>
      </div>
    </section>

    <FeatureVoiceBlob
      heading={{
        eyebrow: "Day to day",
        title: "Hear how it sounds",
      }}
      videoSrc="/brand/voice.mp4"
      poster="/brand/voice-poster.jpg"
      title={brand.name}
      subtitle="Voice note coming soon"
    />

    <Feature06
      heading={{
        eyebrow: "Built for HIPAA-covered practices",
        title: "Everything a practice needs to sign off on",
        body: "The questions a practice manager asks before trusting us with patient data, answered in plain terms.",
      }}
      features={CAPABILITIES}
    />

    <Quote01 quote={MISSION_QUOTE} />

    <Testimonial09
      heading={{ eyebrow: "What practices say", title: "Early feedback, before the ink is even dry" }}
      testimonials={PLACEHOLDER_TESTIMONIALS}
    />

    {/* Faq07 temporarily hidden, per request. Content is still wired up in security.ts. */}

    <Cta12
      heading={{
        eyebrow: "Ready when you are",
        title: "See it running before you commit to anything",
        body: "Book a call and we'll walk through the real infrastructure behind it, not a slide deck.",
      }}
      primary={{ label: "Book a demo", href: `mailto:${brand.contact.email}` }}
      image={{ src: "/brand/blue-blur.jpg", alt: "" }}
      footnote={`Or email ${brand.contact.email}`}
    />
    </>
  );
}
