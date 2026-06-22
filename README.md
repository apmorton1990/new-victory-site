# New Victory — Website

The new website for New Victory church: a **Next.js** front end powered by a
**headless Statamic** CMS with a flat-file, git-versioned page builder.

- **`apps/web`** — Next.js 16 (App Router, TypeScript, Tailwind v4). Public site.
- **`cms`** — Statamic 5 (Laravel/PHP), run **headless** with **flat-file**
  content and the **REST Content API**.

```
new-victory-site/
├── apps/
│   └── web/                         # Next.js front end (npm workspace)
│       └── src/
│           ├── lib/statamic.ts       # REST Content API client
│           └── components/PageBlocks.tsx   # maps page-builder blocks -> React
├── cms/                             # Statamic (Laravel)
│   ├── content/                      # flat-file content (committed)
│   │   ├── collections/pages/*.md     # pages + their page_builder blocks
│   │   ├── globals/default/site.yaml  # site settings values
│   │   └── navigation/ + trees/       # menus
│   └── resources/blueprints/         # field definitions (page builder, globals)
└── package.json                     # npm workspaces (apps/*)
```

## Prerequisites

- **Node.js 20+** and npm 10+
- **PHP 8.3+ and Composer** via **[Laravel Herd](https://herd.laravel.com)**.
  Open the Herd app once so it provisions PHP; its shims live in
  `~/.config/herd/bin` (added to PATH).

## Run it

Two processes — the CMS API and the front end.

```bash
# 1. CMS (Statamic) — from the cms/ folder
php artisan serve --port=8000          # control panel + REST API at :8000

# 2. Front end (Next.js) — from the repo root
npm install
npm run dev                            # http://localhost:3000
```

- **Website:** http://localhost:3000
- **Control panel:** http://localhost:8000/cp — log in to use the page builder
- **REST API:** http://localhost:8000/api

`apps/web/.env.local` points the front end at the CMS:

```
NEXT_PUBLIC_STATAMIC_URL=http://127.0.0.1:8000
```

> You can also serve the CMS via a Herd `.test` domain instead of
> `artisan serve` — `herd link` inside `cms/`, then set
> `NEXT_PUBLIC_STATAMIC_URL` to that URL.

### Control panel login (dev)

A dev super-admin was created: **admin@tnvictory.com** / **Victory!2026dev**.
Change this (or create your own) before anything goes live — `php please make:user`.

## How content works

- Content is **flat files** under `cms/content` (committed to git).
- The **`pages`** collection has a **`page_builder`** (Replicator) field with
  reusable block "sets": **Hero, Text, Image, Call to Action**. Editors add and
  reorder blocks in the control panel.
- Next.js reads published content through the **REST Content API** in Server
  Components (`apps/web/src/lib/statamic.ts`) and maps each block `type` to a
  React component in `apps/web/src/components/PageBlocks.tsx`.
- **`globals/site`** holds site title, contact info, socials, footer text; the
  **`main`** navigation drives the header/footer menus.
- The page with slug `home` renders at `/`; every other page renders at
  `/{slug}` via `apps/web/src/app/[slug]/page.tsx`.

### Adding a new block type

1. Add a set under `page_builder` in
   `cms/resources/blueprints/collections/pages/pages.yaml`.
2. Add a renderer for that `type` in `apps/web/src/components/PageBlocks.tsx`.

## Notes / conventions

- **Statamic Pro** (`STATAMIC_PRO_ENABLED=true` in `cms/.env`) is required for
  the REST API. It's **free in local development**; a paid license is only
  required for production.
- The front end looks pages up by **entry id**, and content uses **`id == slug`**
  (Statamic's API filtering is whitelist-gated, so we avoid `filter=` queries).
  There's a list-scan fallback for entries whose id differs from the slug.
- **Bundler:** `dev` uses **webpack** (`next dev --webpack`) — this repo sits on
  a drive Next.js flags as "slow," where Turbopack throws a
  *"Manifest file is empty"* error. Use `npm run dev:turbo -w apps/web` on a
  fast/local SSD. Production `npm run build` is unaffected.
- After editing content files by hand, run `php please stache:clear` in `cms/`
  so Statamic re-reads them.

## Reference

- Current site for content/branding: https://tnvictory.com
