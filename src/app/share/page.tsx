import type { Metadata } from "next";
import type { ResultId } from "@/lib/types";
import { LanguageProvider } from "@/components/language-provider";
import { ShareView } from "@/components/share-view";
import { requestLocale } from "@/lib/locale-server";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type ShareProps = { searchParams: SearchParams };
const results: ResultId[] = ["BUY IT", "WAIT", "WATCH FIRST", "PASS"];

function readShare(params: Record<string, string | string[] | undefined>) {
  const title = typeof params.title === "string" ? params.title.trim().slice(0, 200) : "";
  const result = typeof params.result === "string" && results.includes(params.result as ResultId) ? params.result as ResultId : null;
  const poster = typeof params.poster === "string" && /^\/[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|webp)$/.test(params.poster) ? params.poster : null;
  return { title, result, poster };
}

export async function generateMetadata({ searchParams }: ShareProps): Promise<Metadata> {
  const params = await searchParams;
  const locale = await requestLocale(params.lang);
  const { title, result, poster } = readShare(params);
  if (!title || !result) return { title: "DISC OR DIE" };
  const heading = `${title} — ${result} | DISC OR DIE`;
  const description = locale === "en" ? `Disc purchase verdict for ${title}: ${result}` : `${title}のディスク購入診断結果：${result}`;
  const alt = locale === "en" ? `${title} poster` : `${title}のポスター`;
  const image = poster ? `https://image.tmdb.org/t/p/w500${poster}` : undefined;
  return {
    title: heading,
    description,
    openGraph: { title: heading, description, ...(image ? { images: [{ url: image, alt }] } : {}) },
    twitter: { card: "summary", title: heading, description, ...(image ? { images: [{ url: image, alt }] } : {}) },
  };
}

export default async function SharePage({ searchParams }: ShareProps) {
  const params = await searchParams;
  return <LanguageProvider initialLocale={await requestLocale(params.lang)}><ShareView {...readShare(params)} /></LanguageProvider>;
}
