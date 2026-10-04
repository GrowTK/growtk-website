import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectSlides } from "@/components/sections/projects/project-slides";
import { projectsShowcase } from "@/content/projects";

export function generateStaticParams() {
  return projectsShowcase.items.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsShowcase.items.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: project.name, description: project.tagline };
}

/**
 * Full-screen case-study deck. Projects with their own deck (see DECKS in
 * project-slides.tsx) get live product slides; the rest get cover + overview.
 */
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectsShowcase.items.find((p) => p.slug === slug);
  if (!project) notFound();

  return <ProjectSlides project={project} />;
}
