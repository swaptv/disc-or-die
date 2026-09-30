import { cookies, headers } from "next/headers";
import { isLocale, LOCALE_COOKIE, resolveLocale } from "./i18n";

export async function requestLocale(explicit?: unknown) {
  if (isLocale(explicit)) return explicit;
  const [cookieStore, requestHeaders] = await Promise.all([cookies(), headers()]);
  const linkLocale = requestHeaders.get("x-disc-language");
  if (isLocale(linkLocale)) return linkLocale;
  return resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value, requestHeaders.get("accept-language") ?? "");
}
