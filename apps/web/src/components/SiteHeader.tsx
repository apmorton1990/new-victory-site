import Link from "next/link";
import { getNavigation, getGlobal, type Globals } from "@/lib/statamic";

export default async function SiteHeader() {
  const [nav, globals] = await Promise.all([
    getNavigation("main"),
    getGlobal<Globals>("site"),
  ]);

  return (
    <header className="sticky top-0 z-50 bg-brand text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-xl font-extrabold uppercase tracking-wide">
          {globals?.site_title ?? "Victory Church"}
        </Link>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium">
          {nav.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className="text-slate-200 transition hover:text-white"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
