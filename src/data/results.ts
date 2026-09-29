import type { ResultId } from "../lib/types";
export const resultCopy: Record<ResultId, { label: string; lines: string[]; japanese: string }> = {
  "BUY IT": { label: "MAKE ROOM ON THE SHELF.", lines: ["You want the movie. You want the disc.", "The price works. Buy it."], japanese: "作品への気持ちも、価格も。今買う理由は揃っています。" },
  WAIT: { label: "LET IT LIVE IN YOUR WISHLIST.", lines: ["You want it.", "You just don't need it today."], japanese: "欲しい気持ちはそのままに。納得できるタイミングを待とう。" },
  "WATCH FIRST": { label: "FALL IN LOVE BEFORE YOU BUY.", lines: ["Don't buy the disc yet.", "Find out if you actually love the movie first."], japanese: "まずは作品と出会おう。棚に迎えるかは、そのあとで。" },
  PASS: { label: "YOUR SHELF CAN BREATHE.", lines: ["You're not buying the movie.", "You're buying the fear of missing it."], japanese: "見逃す怖さだけで買わなくていい。今回は見送ろう。" },
};
