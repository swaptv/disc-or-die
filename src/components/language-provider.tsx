"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { LOCALE_COOKIE, translate, type Locale } from "@/lib/i18n";
import { BASE_PATH } from "@/lib/base-path";

const LanguageContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void } | null>(null);
export function LanguageProvider({ initialLocale, children }: { initialLocale: Locale; children: React.ReactNode }) {
  const [locale, setLocale] = useState(initialLocale);
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  function changeLocale(next: Locale) {
    setLocale(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; Path=${BASE_PATH || "/"}; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    const url = new URL(location.href);
    url.searchParams.set("lang", next);
    window.history.replaceState(null, "", url);
  }
  return <LanguageContext.Provider value={{ locale, setLocale: changeLocale }}>{children}</LanguageContext.Provider>;
}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("LanguageProvider is required");
  return { ...context, t: (text: string) => translate(context.locale, text) };
}
export function LanguageSwitch() {
  const { locale, setLocale } = useLanguage();
  return <nav className="language-switch" aria-label="Language / 言語">
    <button type="button" lang="ja" aria-pressed={locale === "ja"} onClick={() => setLocale("ja")}>日本語</button>
    <button type="button" lang="en" aria-pressed={locale === "en"} onClick={() => setLocale("en")}>EN</button>
  </nav>;
}
