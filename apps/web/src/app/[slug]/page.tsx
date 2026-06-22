import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageBlocks from "@/components/PageBlocks";
import { getPage, getAllPageSlugs, HOME_SLUG } from "@/lib/statamic";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllPageSlugs();
  return slugs.filter((slug) => slug !== HOME_SLUG).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};
  return {
    title: page.seo_title ?? page.title,
    description: page.seo_description ?? undefined,
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  if (slug === HOME_SLUG) notFound();
  const page = await getPage(slug);
  if (!page) notFound();
  return <PageBlocks blocks={page.page_builder ?? []} />;
}
