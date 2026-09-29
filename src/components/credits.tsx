import Image from "next/image";

export function Credits() {
  return <section className="credits" aria-label="データ提供・クレジット">
    <p className="creator-credit">制作者：<a href="https://x.com/swaptv" target="_blank" rel="noopener noreferrer" aria-label="制作者 @swaptv のXプロフィール（別タブで開きます）">@swaptv <span aria-hidden="true">↗</span></a><span>on X</span></p>
    <p className="eyebrow muted">DATA & CREDITS</p>
    <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" aria-label="The Movie Database (TMDB)">
      <Image src="/tmdb-logo.svg" alt="TMDB" width={74} height={53} unoptimized className="tmdb-logo" />
    </a>
    <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
    <p>配信情報提供：<a href="https://www.justwatch.com/jp" target="_blank" rel="noopener noreferrer">JustWatch</a>（via TMDB） · <a href="/tmdb-logo-license.txt" target="_blank" rel="noopener noreferrer">Logo credits</a></p>
  </section>;
}
