"use client";
import { useLanguage } from "./language-provider";
export function Progress({ current, total }: { current: number; total: number }) {
  const { t } = useLanguage();
  return <div className="progress-block"><div className="flex justify-between"><span>THE DISC INTERROGATION</span><span>{String(current).padStart(2, "0")} <span className="muted">/ {String(total).padStart(2, "0")}</span></span></div><div className="progress-track" role="progressbar" aria-label={t("診断の進捗")} aria-valuemin={0} aria-valuemax={total} aria-valuenow={current}><div style={{ width: `${current / total * 100}%` }} /></div></div>;
}
