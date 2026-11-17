"use client";
import { useLanguage } from "./language-provider";
import { useEffect, useState } from "react";
import { BASE_PATH } from "@/lib/base-path";
import type { ApiResponse, ProviderKind, WatchAvailability, WatchProvider } from "@/lib/types";

// A provider's logo from TMDB (name as alt text and tooltip); the name in a chip when there is no logo or it fails.
function ProviderIcon({ provider }: { provider: WatchProvider }) {
  const [failed, setFailed] = useState(false);
  if (!provider.logoPath || failed) return <span className="provider-chip">{provider.name}</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="provider-logo" src={`https://image.tmdb.org/t/p/w92${provider.logoPath}`} alt={provider.name} title={provider.name} width={46} height={46} loading="lazy" onError={() => setFailed(true)} />;
}

const labels: Record<ProviderKind, string> = { flatrate: "見放題", free: "無料", ads: "広告付き", rent: "レンタル", buy: "デジタル購入" };
type State = { status: "loading" } | { status: "ready"; data: WatchAvailability } | { status: "error"; message: string };
export function WatchProviders({ movieId, onConfirm }: { movieId: number; onConfirm: () => void }) {
  const { t } = useLanguage();
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(`${BASE_PATH}/api/tmdb/providers?${new URLSearchParams({ movieId: String(movieId) })}`, { signal: controller.signal });
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
  return <aside className="provider-panel" aria-label={t("日本の配信情報")}>
    <h2>{t("日本の配信サービス")}</h2>
    <div role="status" aria-live="polite">
      {state.status === "loading" && <p className="fine-print">{t("配信情報を確認しています。分かっている場合は、そのまま下のA/Bで回答できます。")}</p>}
      {state.status === "error" && <p className="fine-print">{t(state.message)}</p>}
    </div>
    {state.status === "error" && <button type="button" className="provider-retry" onClick={() => { setState({ status: "loading" }); setAttempt(n => n + 1); }}>{t("配信情報を再取得 ↻")}</button>}
    {state.status === "ready" && <>
      {state.data.groups.length > 0 ? <>
        <dl className="provider-groups">{state.data.groups.map(group => <div key={group.kind}><dt>{t(labels[group.kind])}</dt><dd>{group.providers.map(provider => <ProviderIcon key={provider.id} provider={provider} />)}</dd></div>)}</dl>
      </> : <p className="fine-print">{t("日本の配信情報が登録されていません。配信がないとは限らないため、自分で確認してから下のA/Bで回答してください。")}</p>}
      <p className="provider-source">{t("配信データ：")}<a href="https://www.justwatch.com/jp" target="_blank" rel="noopener noreferrer">JustWatch</a> / <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">TMDB</a></p>
      {state.data.groups.length > 0 && <button type="button" className="secondary provider-confirm" onClick={onConfirm}>{t("視聴できることを確認した：Aで回答 ")}<span>↗</span></button>}
    </>}
  </aside>;
}
