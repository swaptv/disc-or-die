"use client";
import { useEffect, useRef, useState } from "react";
import type { ApiResponse, MovieMatch } from "@/lib/types";

type SearchState = { status: "idle" | "loading" } | { status: "ready"; movies: MovieMatch[] } | { status: "error"; message: string };
export function MovieSearch({ title, selected, onChange, onSelect }: {
  title: string;
  selected?: MovieMatch;
  onChange: (title: string) => void;
  onSelect: (movie: MovieMatch) => void;
}) {
  const [state, setState] = useState<SearchState>({ status: "idle" });
  const pending = useRef<AbortController | null>(null);
  const resultsRef = useRef<HTMLUListElement | null>(null);
  useEffect(() => () => pending.current?.abort(), []);
  useEffect(() => {
    if (state.status !== "ready") return;
    const frame = window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [state]);

  function cancel() { pending.current?.abort(); pending.current = null; }
  async function search() {
    cancel();
    if (!title.trim()) { setState({ status: "error", message: "検索する作品タイトルを入力してください。" }); return; }
    const controller = new AbortController();
    pending.current = controller;
    setState({ status: "loading" });
    try {
      const response = await fetch(`/api/tmdb/search?${new URLSearchParams({ q: title.trim() })}`, { signal: controller.signal });
      const body: ApiResponse<MovieMatch[]> = await response.json();
      if (controller.signal.aborted || pending.current !== controller) return;
      if (!body.ok) setState({ status: "error", message: body.error.message });
      else if (!response.ok) throw new Error("Search failed");
      else setState({ status: "ready", movies: body.data });
    } catch {
      if (!controller.signal.aborted && pending.current === controller) setState({ status: "error", message: "検索に接続できませんでした。再試行するか、入力したタイトルで診断を続けてください。" });
    }
  }

  return <div className="movie-search">
    <label htmlFor="movie-title">作品タイトル <span className="field-tag">REQUIRED</span></label>
    <div className="search-input-row">
      <input id="movie-title" value={title} onChange={e => { cancel(); setState({ status: "idle" }); onChange(e.target.value); }} onKeyDown={e => {
        if (e.key === "Enter" && !e.nativeEvent.isComposing) { e.preventDefault(); void search(); }
      }} placeholder="例：ヴィデオドローム" required maxLength={200} autoFocus aria-describedby="movie-search-help" />
      <button className="secondary search-button" type="button" disabled={state.status === "loading"} onClick={() => void search()}>{state.status === "loading" ? "検索中…" : "作品を検索"}<span aria-hidden="true">↗</span></button>
    </div>
    <p className="fine-print" id="movie-search-help">日本語・原題で映画を検索できます。見つからない作品は、手入力のまま進められます。</p>
    <div role="status" aria-live="polite">
      {state.status === "loading" && <p className="search-message">TMDBから作品を探しています…</p>}
      {state.status === "error" && <p className="search-message">{state.message}</p>}
      {state.status === "ready" && <p className="search-message">{state.movies.length ? `${state.movies.length}件の候補から作品を選んでください。` : "作品が見つかりませんでした。原題で検索するか、手入力で続けてください。"}</p>}
    </div>
    {state.status === "ready" && state.movies.length > 0 && <ul ref={resultsRef} className="movie-matches" aria-label="作品の検索候補">{state.movies.map(movie => <li key={movie.id}>
      <button type="button" className="movie-match" onClick={() => { cancel(); onSelect(movie); setState({ status: "idle" }); }}>
        <span><strong>{movie.title}</strong><small>{movie.originalTitle}</small></span><span className="match-year">{movie.releaseYear ?? "公開年不明"}<span aria-hidden="true"> +</span></span>
      </button>
    </li>)}</ul>}
    {selected && <div className="selected-movie"><p className="eyebrow">SELECTED / TMDB</p><p><strong>{selected.title}</strong> <span>({selected.releaseYear ?? "公開年不明"})</span></p><p className="fine-print">{selected.originalTitle} · 日本の配信情報をQ3で確認できます。</p><div className="selected-actions"><a href={`https://www.themoviedb.org/movie/${selected.id}`} target="_blank" rel="noopener noreferrer">作品詳細 ↗</a><button type="button" onClick={() => { cancel(); setState({ status: "idle" }); onChange(title); }}>選択を解除して手入力にする</button></div></div>}
  </div>;
}
