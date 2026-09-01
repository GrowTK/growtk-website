import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { BookDemoForm } from "@/components/sections/contact/book-demo-form";
import { contact } from "@/content/contact";

export const metadata: Metadata = { title: contact.meta.title, description: contact.meta.description };

export default function ContactPage() {
  return (
    <>
      <PageHero
        heading={contact.header}
        image={{ src: "https://images.unsplash.com/photo-1553775282-20af80779df7?auto=format&fit=crop&w=1600&q=80", alt: "A team member wearing a headset, smiling while on a call" }}
      />
      <BookDemoForm copy={contact.form} />
    </>
  );
}
