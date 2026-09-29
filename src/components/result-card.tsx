"use client";
import type { Decision, Metrics, MovieInfo } from "@/lib/types";
import { resultCopy } from "@/data/results";
import { formatPrice, shareUrl } from "@/lib/links";
export function MetricBars({ metrics }: { metrics: Metrics }) {
  const labels = { LOVE: "作品への愛", FOMO: "買い逃す不安", RARITY: "入手の難しさ", VALUE: "価格への納得" };
  return <div className="metrics">{(Object.keys(metrics) as (keyof Metrics)[]).map(name => <div className="metric" key={name}><div className="metric-label"><span>{name}<small>{labels[name]}</small></span><span>{metrics[name]}<small>/ 100</small></span></div><div className="metric-track" role="meter" aria-label={labels[name]} aria-valuemin={0} aria-valuemax={100} aria-valuenow={metrics[name]}><div style={{ width: `${metrics[name]}%` }} /></div></div>)}</div>;
}
export function ResultCard({ decision, movie, onRestart, onBack }: { decision: Decision; movie: MovieInfo; onRestart: () => void; onBack: () => void }) {
  const copy = resultCopy[decision.result];
  return <section className="result-panel"><div className="result-heading"><p className="eyebrow">THE VERDICT IS IN</p><span className="edition-tag">CASE CLOSED / 006</span></div><h1 className={`verdict ${decision.result === "BUY IT" ? "red" : ""}`}>{decision.result}<span className="red">.</span></h1><p className="verdict-label">{copy.label}</p><div className="result-grid"><div><p className="eyebrow muted">YOUR DISC</p><h2 className="result-movie">{movie.title}</h2><p className="result-price">{movie.price === null ? "価格未入力" : formatPrice(movie.price)}</p><div className="result-quote">{copy.lines.map(line => <p key={line}>{line}</p>)}</div><p className="result-japanese">{copy.japanese}</p></div><div><MetricBars metrics={decision.metrics} /><p className="fine-print">回答から算出した目安です。FOMO・RARITYは高いほど、不安・入手難を表します。</p></div></div><div className="result-actions"><button className="primary" onClick={onRestart}>もう一度診断する <span>↗</span></button><button className="secondary" onClick={() => { const url = new URL(window.location.href); url.search = ""; url.hash = ""; window.open(shareUrl(movie, decision.result, copy.lines, url.href), "_blank", "noopener,noreferrer"); }}>Xで共有 <span>↗</span></button></div><button className="back" onClick={onBack}>← 回答を見直す</button></section>;
}
