import Link from "next/link";
import { getNavigation, getGlobal, type Globals } from "@/lib/statamic";

export default async function SiteFooter() {
  const [nav, globals] = await Promise.all([
    getNavigation("main"),
    getGlobal<Globals>("site"),
  ]);

  return (
    <footer className="mt-auto bg-brand text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <p className="text-lg font-extrabold uppercase tracking-wide text-white">
            {globals?.site_title ?? "Victory Church"}
          </p>
          {globals?.tagline && <p className="text-sm leading-relaxed">{globals.tagline}</p>}
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-semibold uppercase tracking-wide text-white">Visit</p>
          {globals?.address && <p>{globals.address}</p>}
          {globals?.contact_phone && (
            <p>
              <a href={`tel:${globals.contact_phone.replace(/[^+\d]/g, "")}`} className="hover:text-white">
                {globals.contact_phone}
              </a>
            </p>
          )}
          {globals?.contact_email && (
            <p>
              <a href={`mailto:${globals.contact_email}`} className="hover:text-white">
                {globals.contact_email}
              </a>
            </p>
          )}
        </div>

        {nav.length > 0 && (
          <nav className="flex flex-col gap-2 text-sm">
            <p className="font-semibold uppercase tracking-wide text-white">Explore</p>
            {nav.map((item) => (
              <Link key={item.url} href={item.url} className="hover:text-white">
                {item.title}
              </Link>
            ))}
          </nav>
        )}

        {globals?.social_links && globals.social_links.length > 0 && (
          <nav className="flex flex-col gap-2 text-sm">
            <p className="font-semibold uppercase tracking-wide text-white">Connect</p>
            {globals.social_links.map((s) => (
              <a key={s.service} href={s.url} className="hover:text-white" target="_blank" rel="noreferrer">
                {s.service}
              </a>
            ))}
          </nav>
        )}
      </div>
      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-slate-400">
        {globals?.footer_text ?? "© Victory Church."}
      </div>
    </footer>
  );
}
