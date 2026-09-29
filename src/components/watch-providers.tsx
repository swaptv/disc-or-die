"use client";
import { useEffect, useState } from "react";
import type { ApiResponse, ProviderKind, WatchAvailability } from "@/lib/types";

const labels: Record<ProviderKind, string> = { flatrate: "見放題", free: "無料", ads: "広告付き", rent: "レンタル", buy: "デジタル購入" };
type State = { status: "loading" } | { status: "ready"; data: WatchAvailability } | { status: "error"; message: string };
export function WatchProviders({ movieId, onConfirm }: { movieId: number; onConfirm: () => void }) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(`/api/tmdb/providers?${new URLSearchParams({ movieId: String(movieId) })}`, { signal: controller.signal });
        const body: ApiResponse<WatchAvailability> = await response.json();
        if (controller.signal.aborted) return;
        if (!body.ok) setState({ status: "error", message: body.error.message });
        else if (!response.ok) throw new Error("Provider lookup failed");
        else setState({ status: "ready", data: body.data });
      } catch {
        if (!controller.signal.aborted) setState({ status: "error", message: "配信情報に接続できませんでした。再試行するか、自分で確認して回答してください。" });
      }
    }
    void load();
    return () => controller.abort();
  }, [movieId, attempt]);
  return <aside className="provider-panel" aria-label="日本の配信情報">
    <p className="eyebrow">WHERE TO WATCH / JP</p><h2>日本の配信サービス</h2>
    <div role="status" aria-live="polite">
      {state.status === "loading" && <p className="fine-print">配信情報を確認しています。分かっている場合は、そのまま下のA/Bで回答できます。</p>}
      {state.status === "error" && <p className="fine-print">{state.message}</p>}
    </div>
    {state.status === "error" && <button type="button" className="provider-retry" onClick={() => { setState({ status: "loading" }); setAttempt(n => n + 1); }}>配信情報を再取得 ↻</button>}
    {state.status === "ready" && <>
      {state.data.groups.length > 0 ? <>
        <dl className="provider-groups">{state.data.groups.map(group => <div key={group.kind}><dt>{labels[group.kind]}</dt><dd>{group.providers.map(provider => <span className="provider-chip" key={provider.id}>{provider.name}</span>)}</dd></div>)}</dl>
        <p className="fine-print">配信先が見つかりました。契約・追加料金・字幕や吹替などの条件を確認してください。</p>
      </> : <p className="fine-print">日本の配信情報が登録されていません。配信がないとは限らないため、自分で確認してから下のA/Bで回答してください。</p>}
      <a className="provider-detail" href={state.data.link} target="_blank" rel="noopener noreferrer">TMDBで視聴先・条件を確認 ↗</a>
      <p className="provider-source">配信データ：<a href="https://www.justwatch.com/jp" target="_blank" rel="noopener noreferrer">JustWatch</a> / <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">TMDB</a><br />情報取得：{new Date(state.data.checkedAt).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", hour12: false })} JST<br />最大1時間のキャッシュを使用しています。配信状況は変わる場合があります。</p>
      {state.data.groups.length > 0 && <button type="button" className="secondary provider-confirm" onClick={onConfirm}>視聴できることを確認した：Aで回答 <span>↗</span></button>}
    </>}
  </aside>;
}
