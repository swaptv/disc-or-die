import type { ResultId } from "../lib/types";

export const resultJapanese: Record<ResultId, string> = {
  "BUY IT": "棚に迎えろ。",
  WAIT: "その時を待て。",
  "WATCH FIRST": "まずは観ろ。",
  PASS: "見送る勇気を。",
};

export const resultCopy: Record<ResultId, { label: string; labelJapanese: string; japanese: string }> = {
  "BUY IT": { label: "MAKE ROOM ON THE SHELF.", labelJapanese: "棚に、この一本の居場所を。", japanese: "作品への気持ちも、価格も。今買う理由は揃っています。" },
  WAIT: { label: "LET IT LIVE IN YOUR WISHLIST.", labelJapanese: "今は、ほしいものリストに。", japanese: "欲しい気持ちはそのままに。納得できるタイミングを待とう。" },
  "WATCH FIRST": { label: "FALL IN LOVE BEFORE YOU BUY.", labelJapanese: "買う前に、まず好きになろう。", japanese: "まずは作品と出会おう。棚に迎えるかは、そのあとで。" },
  PASS: { label: "YOUR SHELF CAN BREATHE.", labelJapanese: "棚にも、ひと息つく余裕を。", japanese: "見逃す怖さだけで買わなくていい。今回は見送ろう。" },
};
