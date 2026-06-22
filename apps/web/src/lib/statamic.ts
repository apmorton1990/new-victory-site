/**
 * Thin client for Statamic's REST Content API.
 *
 * Statamic is run headless (flat-file content) and exposes read-only JSON under
 * `{NEXT_PUBLIC_STATAMIC_URL}/api`. Typical endpoints:
 *   GET /api/collections/pages/entries
 *   GET /api/collections/pages/entries?filter[slug:is]=home
 *   GET /api/globals/{handle}
 *   GET /api/assets/{container}/{path}
 *
 * The page-builder field (a Bard/Replicator field) comes back as an array of
 * "sets", each with a `type` plus its own fields — rendered by PageBlocks.
 */

export const STATAMIC_URL = (
  process.env.NEXT_PUBLIC_STATAMIC_URL ?? 'http://localhost:8000'
).replace(/\/$/, '');

const API_BASE = `${STATAMIC_URL}/api`;

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (process.env.STATAMIC_API_TOKEN) {
    headers.Authorization = `Bearer ${process.env.STATAMIC_API_TOKEN}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...headers, ...(init?.headers as Record<string, string>) },
  });
  if (!res.ok) {
    throw new Error(`Statamic API ${path} -> ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/** Statamic wraps single resources in `{ data }` and lists in `{ data: [] }`. */
interface ApiResponse<T> {
  data: T;
}

/** Build an absolute URL for a Statamic asset reference. */
export function assetUrl(asset: StatamicAsset | string | null | undefined): string | null {
  if (!asset) return null;
  if (typeof asset === 'string') {
    return asset.startsWith('http') ? asset : `${STATAMIC_URL}${asset.startsWith('/') ? '' : '/'}${asset}`;
  }
  if (asset.url) return asset.url.startsWith('http') ? asset.url : `${STATAMIC_URL}${asset.url}`;
  if (asset.permalink) return asset.permalink;
  return null;
}

// --- Content types (refined once the live API shape is confirmed) ----------

export interface StatamicAsset {
  id?: string;
  url?: string;
  permalink?: string;
  alt?: string;
  [key: string]: unknown;
}

/** A single page-builder block ("set"). `type` identifies which set it is. */
export interface Block {
  type: string;
  id?: string;
  [field: string]: unknown;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  url?: string;
  seo_title?: string | null;
  seo_description?: string | null;
  page_builder?: Block[] | null;
  [field: string]: unknown;
}

export interface NavItem {
  title: string;
  url: string;
  children: NavItem[];
}

/** Raw shape of a node in Statamic's nav tree API response. */
interface NavTreeNode {
  page?: {
    title?: string;
    url?: string;
    permalink?: string;
  } | null;
  title?: string;
  url?: string;
  children?: NavTreeNode[];
}

export interface Globals {
  site_title?: string | null;
  tagline?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: string | null;
  footer_text?: string | null;
  social_links?: { service: string; url: string }[] | null;
  [field: string]: unknown;
}

// --- Data access -----------------------------------------------------------

/** We treat the entry with slug "home" as the landing page (served at "/"). */
export const HOME_SLUG = 'home';

export async function getEntries(collection: string, query = ''): Promise<Page[]> {
  const res = await api<ApiResponse<Page[]>>(`/collections/${collection}/entries${query}`);
  return res.data ?? [];
}

export async function getPage(slug: string): Promise<Page | null> {
  // Entries are addressable by id, and our content uses id == slug. (Statamic's
  // API filtering is whitelist-gated, so we avoid filter queries.)
  try {
    const res = await api<ApiResponse<Page>>(
      `/collections/pages/entries/${encodeURIComponent(slug)}`,
    );
    if (res.data) return res.data;
  } catch {
    // fall through to a slug scan (handles entries whose id != slug)
  }
  const all = await getEntries("pages");
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getAllPageSlugs(): Promise<string[]> {
  const res = await api<ApiResponse<Page[]>>(`/collections/pages/entries?fields=slug`);
  return (res.data ?? []).map((p) => p.slug).filter(Boolean);
}

export async function getGlobal<T = Globals>(handle: string): Promise<T | null> {
  try {
    const res = await api<ApiResponse<T>>(`/globals/${handle}`);
    return res.data ?? null;
  } catch {
    return null;
  }
}

function mapNavNode(node: NavTreeNode): NavItem {
  return {
    title: node.page?.title ?? node.title ?? '',
    url: node.page?.url ?? node.url ?? '#',
    children: (node.children ?? []).map(mapNavNode),
  };
}

export async function getNavigation(handle: string): Promise<NavItem[]> {
  try {
    const res = await api<ApiResponse<NavTreeNode[]>>(`/navs/${handle}/tree`);
    return (res.data ?? []).map(mapNavNode);
  } catch {
    return [];
  }
}
