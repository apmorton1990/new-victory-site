import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageBlocks from "@/components/PageBlocks";
import { getPage, HOME_SLUG } from "@/lib/statamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage(HOME_SLUG);
  if (!page) return {};
  return {
    title: page.seo_title ?? page.title,
    description: page.seo_description ?? undefined,
  };
}

export default async function HomePage() {
  const page = await getPage(HOME_SLUG);
  if (!page) notFound();
  return <PageBlocks blocks={page.page_builder ?? []} />;
}
