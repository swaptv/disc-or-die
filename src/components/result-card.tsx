"use client";
import { useLanguage } from "./language-provider";
import type { Decision, Metrics, MovieInfo } from "@/lib/types";
import { resultCopy } from "@/data/results";
import { formatPrice, shareUrl } from "@/lib/links";
import { MoviePoster } from "./movie-poster";
import { trackAnalytics } from "@/lib/analytics";

export function MetricBars({ metrics }: { metrics: Metrics }) {
  const { t } = useLanguage();
  const labels = { LOVE: "作品への愛", FOMO: "買い逃す不安", RARITY: "入手の難しさ", VALUE: "価格への納得" };
  return <div className="metrics">{(Object.keys(metrics) as (keyof Metrics)[]).map(name => <div className="metric" key={name} data-high={metrics[name] >= 80}><div className="metric-label"><span>{name}<small>{t(labels[name])}</small></span><span>{metrics[name]}<small>/ 100</small></span></div><div className="metric-track" role="meter" aria-label={t(labels[name])} aria-valuemin={0} aria-valuemax={100} aria-valuenow={metrics[name]}><div style={{ width: `${metrics[name]}%` }} /></div></div>)}</div>;
}
export function ResultCard({ decision, movie, onRestart, onBack }: { decision: Decision; movie: MovieInfo; onRestart: () => void; onBack: () => void }) {
  const { t, locale } = useLanguage();
  const copy = resultCopy[decision.result];
  function restart() {
    trackAnalytics("restart_clicked", { locale, result: decision.result });
    onRestart();
  }
  function share() {
    trackAnalytics("share_clicked", { locale, result: decision.result });
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    window.open(shareUrl(movie, decision.result, [copy.label, copy.labelJapanese], url.href, locale), "_blank", "noopener,noreferrer");
  }
  return <section className="result-panel"><div className="result-heading"><p className="eyebrow">THE VERDICT IS IN</p><span className="edition-tag">CASE CLOSED / 006</span></div><h1 className={`verdict ${decision.result === "BUY IT" ? "red" : ""}`}>{decision.result}<span className="red">.</span></h1><p className="verdict-label"><span lang="en">{copy.label}</span><span className="verdict-label-japanese" lang="ja">{copy.labelJapanese}</span></p><div className="result-grid"><div><div className="result-film">{movie.tmdb?.posterPath && <MoviePoster key={movie.tmdb.posterPath} path={movie.tmdb.posterPath} title={movie.title} className="result-poster" />}<div className="result-film-details"><p className="eyebrow muted">YOUR DISC</p><h2 className="result-movie">{movie.title}</h2><p className="result-price">{movie.price === null ? t("価格未入力") : formatPrice(movie.price, locale)}</p></div></div><div className="result-quote">{copy.lines.map(line => <p key={line}>{line}</p>)}</div><p className="result-japanese">{t(copy.japanese)}</p></div><div><MetricBars metrics={decision.metrics} /><p className="fine-print">{t("回答から算出した目安です。FOMO・RARITYは高いほど、不安・入手難を表します。")}</p></div></div><div className="result-actions"><button className="primary" onClick={restart}>{t("もう一度診断する ")}<span>↗</span></button><button className="secondary" onClick={share}>{t("Xで共有 ")}<span>↗</span></button></div><button className="back" onClick={onBack}>{t("← 回答を見直す")}</button></section>;
}
