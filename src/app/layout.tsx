import type { Metadata } from "next";
import "./globals.css";
import { requestLocale } from "@/lib/locale-server";
export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  return {
    title: "DISC OR DIE — Should you buy that disc?",
    description: locale === "en" ? "Blu-ray, 4K UHD, DVD. Buy, wait, watch first, or pass? Eight questions to settle your next disc purchase." : "Blu-ray、4K UHD、DVD。買うか、待つか、まず観るか、見送るか。8つの質問で、あなたの物理メディア欲に最終判定。",
  };
}
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang={await requestLocale()}><body>{children}</body></html>;
}
