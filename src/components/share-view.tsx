"use client";
import Image from "next/image";
import Link from "next/link";
import type { Metrics, ResultId } from "@/lib/types";
import { resultCopy } from "@/data/results";
import { Credits } from "./credits";
import { LanguageSwitch, useLanguage } from "./language-provider";
import { MetricBars } from "./result-card";

export function ShareView({ title, result, poster, metrics }: { title: string; result: ResultId | null; poster: string | null; metrics: Metrics | null }) {
  const { locale, t } = useLanguage();
  const home = `/?lang=${locale}`;
  const copy = result ? resultCopy[result] : null;
  return <main className="share-page" lang={locale}>
    <header className="share-header"><Link href={home} className="wordmark">DISC<span className="red"> / </span>OR DIE<span className="brand-dot">®</span></Link><LanguageSwitch /></header>
    <div className="share-content">{title && result && copy ? <>
      <div className="result-heading"><p className="eyebrow">THE VERDICT IS IN</p><span className="edition-tag">SHARED RESULT</span></div>
      <h1 className={`share-verdict ${result === "BUY IT" ? "red" : ""}`}>{result}<span className="red">.</span></h1>
      <p className="verdict-label"><span lang="en">{copy.label}</span><span className="verdict-label-japanese" lang="ja">{copy.labelJapanese}</span></p>
      <div className={`share-result-grid ${metrics ? "" : "share-result-grid-single"}`}>
        <div><div className="share-movie">{poster && <Image src={`https://image.tmdb.org/t/p/w500${poster}`} alt={locale === "en" ? `${title} poster` : `${title}のポスター`} width={200} height={300} unoptimized />}<div><p className="eyebrow muted">THE DISC</p><h2>{title}</h2></div></div><div className="result-quote">{copy.lines.map(line => <p key={line}>{line}</p>)}</div><p className="result-japanese">{t(copy.japanese)}</p></div>
        {metrics && <div><MetricBars metrics={metrics} /><p className="fine-print">{t("回答から算出した目安です。FOMO・RARITYは高いほど、不安・入手難を表します。")}</p></div>}
      </div>
    </> : <h1 className="share-verdict">DISC OR DIE.</h1>}
      <Link href={home} className="primary">{t("自分も診断する")} <span>↗</span></Link>
    </div><Credits />
  </main>;
}
