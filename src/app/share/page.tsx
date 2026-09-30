import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ResultId } from "@/lib/types";
import { Credits } from "@/components/credits";

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
  const { title, result, poster } = readShare(await searchParams);
  if (!title || !result) return { title: "DISC OR DIE" };
  const heading = `${title} — ${result} | DISC OR DIE`;
  const description = `${title}のディスク購入診断結果：${result}`;
  const image = poster ? `https://image.tmdb.org/t/p/w500${poster}` : undefined;
  return {
    title: heading,
    description,
    openGraph: { title: heading, description, ...(image ? { images: [{ url: image, alt: `${title}のポスター` }] } : {}) },
    twitter: { card: "summary", title: heading, description, ...(image ? { images: [{ url: image, alt: `${title}のポスター` }] } : {}) },
  };
}

export default async function SharePage({ searchParams }: ShareProps) {
  const { title, result, poster } = readShare(await searchParams);
  return <main className="share-page"><Link href="/" className="wordmark">DISC<span className="red"> / </span>OR DIE<span className="brand-dot">®</span></Link><div className="share-content">{title && result ? <><p className="eyebrow">THE VERDICT IS IN</p><h1 className={`share-verdict ${result === "BUY IT" ? "red" : ""}`}>{result}<span className="red">.</span></h1><div className="share-movie">{poster && <Image src={`https://image.tmdb.org/t/p/w500${poster}`} alt={`${title}のポスター`} width={200} height={300} unoptimized />}<h2>{title}</h2></div></> : <h1 className="share-verdict">DISC OR DIE.</h1>}<Link href="/" className="primary">自分も診断する <span>↗</span></Link></div><Credits /></main>;
}
