"use client";
import { useLanguage } from "./language-provider";
import Image from "next/image";
import { useState } from "react";

export function MoviePoster({ path, title, className }: { path: string; title: string; className: string }) {
  const { locale } = useLanguage();
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return <Image className={className} src={`https://image.tmdb.org/t/p/w500${path}`} alt={locale === "en" ? `${title} poster` : `${title}のポスター`} width={200} height={300} unoptimized onError={() => setFailed(true)} />;
}
