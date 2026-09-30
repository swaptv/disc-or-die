"use client";
import Image from "next/image";
import Link from "next/link";
import type { ResultId } from "@/lib/types";
import { Credits } from "./credits";
import { LanguageSwitch, useLanguage } from "./language-provider";

export function ShareView({ title, result, poster }: { title: string; result: ResultId | null; poster: string | null }) {
  const { locale, t } = useLanguage();
  const home = `/?lang=${locale}`;
  return <main className="share-page" lang={locale}>
    <header className="share-header"><Link href={home} className="wordmark">DISC<span className="red"> / </span>OR DIE<span className="brand-dot">®</span></Link><LanguageSwitch /></header>
    <div className="share-content">{title && result ? <>
      <p className="eyebrow">THE VERDICT IS IN</p>
      <h1 className={`share-verdict ${result === "BUY IT" ? "red" : ""}`}>{result}<span className="red">.</span></h1>
      <div className="share-movie">{poster && <Image src={`https://image.tmdb.org/t/p/w500${poster}`} alt={locale === "en" ? `${title} poster` : `${title}のポスター`} width={200} height={300} unoptimized />}<h2>{title}</h2></div>
    </> : <h1 className="share-verdict">DISC OR DIE.</h1>}
      <Link href={home} className="primary">{t("自分も診断する")} <span>↗</span></Link>
    </div><Credits />
  </main>;
}
