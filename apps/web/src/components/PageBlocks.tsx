import Link from "next/link";
import { assetUrl, type Block, type StatamicAsset } from "@/lib/statamic";

// --- field accessors (block fields come back loosely typed) ----------------
const str = (b: Block, key: string): string | null =>
  typeof b[key] === "string" ? (b[key] as string) : null;

/** A button_group/select augments to { value, label, key } or a plain string. */
const choice = (b: Block, key: string): string | null => {
  const v = b[key];
  if (typeof v === "string") return v;
  if (v && typeof v === "object" && "value" in v) return String((v as { value: unknown }).value);
  return null;
};

/** An assets field augments to an array (or single) of asset objects. */
const firstAsset = (b: Block, key: string): StatamicAsset | string | null => {
  const v = b[key];
  if (Array.isArray(v)) return (v[0] as StatamicAsset) ?? null;
  if (v && typeof v === "object") return v as StatamicAsset;
  if (typeof v === "string") return v;
  return null;
};

function Hero({ block }: { block: Block }) {
  const heading = str(block, "heading");
  const subheading = str(block, "subheading");
  const label = str(block, "button_label");
  const url = str(block, "button_url");
  return (
    <section className="bg-brand text-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-32 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">{heading}</h1>
        {subheading && <p className="max-w-2xl text-lg text-slate-200">{subheading}</p>}
        {label && url && (
          <Link
            href={url}
            className="mt-2 inline-block rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            {label}
          </Link>
        )}
      </div>
    </section>
  );
}

function Text({ block }: { block: Block }) {
  const body = str(block, "body");
  if (!body) return null;
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div
        className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-brand prose-a:text-accent"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </section>
  );
}

function ImageBlock({ block }: { block: Block }) {
  const src = assetUrl(firstAsset(block, "image"));
  if (!src) return null;
  const caption = str(block, "caption");
  return (
    <figure className="mx-auto max-w-4xl px-6 py-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={caption ?? ""} className="w-full rounded-xl" />
      {caption && <figcaption className="mt-3 text-center text-sm text-slate-500">{caption}</figcaption>}
    </figure>
  );
}

function Cta({ block }: { block: Block }) {
  const heading = str(block, "heading");
  const text = str(block, "text");
  const label = str(block, "button_label");
  const url = str(block, "button_url");
  const style = choice(block, "style") ?? "light";

  const band: Record<string, string> = {
    light: "bg-mist text-brand",
    dark: "bg-brand text-white",
    brand: "bg-accent text-white",
  };
  const button =
    style === "light"
      ? "bg-accent text-white hover:bg-accent-hover"
      : "bg-white text-brand hover:bg-slate-200";

  return (
    <section className={band[style] ?? band.light}>
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-16 text-center">
        {heading && <h2 className="text-3xl font-bold">{heading}</h2>}
        {text && <p className="max-w-xl text-lg opacity-90">{text}</p>}
        {label && url && (
          <Link
            href={url}
            className={`mt-2 inline-block rounded-full px-7 py-3 text-sm font-semibold transition ${button}`}
          >
            {label}
          </Link>
        )}
      </div>
    </section>
  );
}

export default function PageBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "hero":
            return <Hero key={block.id ?? i} block={block} />;
          case "text":
            return <Text key={block.id ?? i} block={block} />;
          case "image":
            return <ImageBlock key={block.id ?? i} block={block} />;
          case "cta":
            return <Cta key={block.id ?? i} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
