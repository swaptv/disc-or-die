import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "./lib/i18n";

// Layouts do not receive searchParams. Forward an explicit share/link language
// so the initial HTML language and metadata agree with the page before hydration.
export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const locale = request.nextUrl.searchParams.get("lang");
  requestHeaders.delete("x-disc-language");
  if (isLocale(locale)) requestHeaders.set("x-disc-language", locale);
  return NextResponse.next({ request: { headers: requestHeaders } });
}
export const config = { matcher: ["/", "/share"] };
