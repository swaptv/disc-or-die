import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "DISC OR DIE — Should you buy that disc?",
  description: "Blu-ray、4K UHD、DVD。買うか、待つか、まず観るか、見送るか。7つの質問で、あなたの物理メディア欲に最終判定。",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
