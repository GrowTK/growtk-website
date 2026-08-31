import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { BookDemoForm } from "@/components/sections/contact/book-demo-form";
import { bookDemo } from "@/content/book-demo";

export const metadata: Metadata = { title: bookDemo.meta.title, description: bookDemo.meta.description };

export default function BookDemoPage() {
  return (
    <>
      <PageHero
        heading={bookDemo.header}
        image={{ src: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1600&q=80", alt: "Clinician holding a dental scan up to a lightbox" }}
      />
      <BookDemoForm copy={bookDemo.form} />
    </>
  );
}
