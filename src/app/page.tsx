import DiscApp from "@/components/disc-app";
import { LanguageProvider } from "@/components/language-provider";
import { requestLocale } from "@/lib/locale-server";
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const locale = await requestLocale((await searchParams).lang);
  return <LanguageProvider initialLocale={locale}><DiscApp /></LanguageProvider>;
}
