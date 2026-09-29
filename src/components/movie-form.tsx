"use client";
import { useState } from "react";
import type { MovieInfo } from "@/lib/types";
export function MovieForm({ initial, onSubmit, onBack }: { initial: MovieInfo; onSubmit: (movie: MovieInfo) => void; onBack: () => void }) {
  const [title, setTitle] = useState(initial.title);
  const [price, setPrice] = useState(initial.price?.toString() ?? "");
  const [error, setError] = useState("");
  return <section className="flow-panel"><p className="eyebrow">BEFORE THE INTERROGATION</p><h1 className="section-title">WHAT’S ON<br />YOUR MIND<span className="red">?</span></h1><p className="intro">その一本、まずは名前を聞かせてください。</p>
    <form onSubmit={e => { e.preventDefault(); const amount = price === "" ? null : Number(price); if (!title.trim()) { setError("作品タイトルを入力してください。"); return; } if (amount !== null && (!Number.isSafeInteger(amount) || amount < 0)) { setError("価格は0以上の整数で入力してください。"); return; } setError(""); onSubmit({ title: title.trim(), price: amount }); }}>
      <label htmlFor="movie-title">作品タイトル <span className="field-tag">REQUIRED</span></label><input id="movie-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="例：Litan" required maxLength={200} autoFocus />
      <label htmlFor="movie-price">購入予定価格 <span className="field-tag">OPTIONAL / JPY</span></label><div className="price-input"><span>¥</span><input id="movie-price" type="number" min="0" step="1" max="999999999" inputMode="numeric" value={price} onChange={e => setPrice(e.target.value)} placeholder="3,800" /></div>
      <p className="fine-print">タイトルと価格は、この画面の中だけで扱います。</p>{error && <p role="alert" className="red">{error}</p>}
      <button className="primary w-full" type="submit">診断をはじめる <span>↗</span></button><button type="button" className="back" onClick={onBack}>← トップに戻る</button>
    </form></section>;
}
