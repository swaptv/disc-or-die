"use client";
import { useLanguage, LanguageSwitch } from "./language-provider";
import { useLayoutEffect, useState } from "react";
import Link from "next/link";
import type { Answers, Choice, MovieInfo, MovieMatch } from "@/lib/types";
import type { ShopConfig } from "@/lib/affiliate";
import { questions, getQuestionPath } from "@/data/questions";
import { evaluate } from "@/lib/decision";
import { MovieForm } from "./movie-form";
import { QuestionCard } from "./question-card";
import { ResultCard } from "./result-card";
import { Credits } from "./credits";
// A movie handed over by link (?tmdb=): the quiz starts at Q1 with it filled in. "failed": the
// link's movie could not be loaded, so the movie form opens instead of the top page.
export type Handoff = { movie: MovieMatch; from30film: boolean } | "failed" | null;
const FILM30_MOVIE = (id: number) => `https://30film.swaptv.tokyo/movies/${id}`;
export default function DiscApp({ shops, handoff }: { shops: ShopConfig; handoff: Handoff }) {
  const { t } = useLanguage();
  const handed = handoff && handoff !== "failed" ? handoff : null;
  const [screen, setScreen] = useState<"home" | "movie" | "quiz" | "result">(handed ? "quiz" : handoff === "failed" ? "movie" : "home");
  const [movie, setMovie] = useState<MovieInfo>(handed ? { title: handed.movie.title, price: null, tmdb: handed.movie } : { title: "", price: null });
  // The handed-over movie is still the one being judged (not changed on the form, not restarted).
  const isHanded = !!handed && movie.tmdb?.id === handed.movie.id;
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [screen, index]);
  const path = getQuestionPath(answers);
  function answer(choice: Choice) {
    const id = path[index];
    const next = { ...answers, [id]: choice };
    if (id === "seen" && answers.seen !== choice) { delete next.rewatch; delete next.interest; }
    setAnswers(next);
    if (index === path.length - 1) {
      setScreen("result");
    } else setIndex(index + 1);
  }
  function restart() { setAnswers({}); setIndex(0); setMovie({ title: "", price: null }); setScreen("movie"); }
  function submitMovie(value: MovieInfo) {
    // Answers about a different movie must not carry over after going back.
    if (value.title !== movie.title || value.tmdb?.id !== movie.tmdb?.id) setAnswers({});
    else if (value.price !== movie.price) setAnswers(previous => { const next = { ...previous }; delete next.price; return next; });
    setMovie(value); setIndex(0); setScreen("quiz");
  }
  return <div className="app-shell"><header className="site-header"><Link href="/" onClick={() => setScreen("home")} className="wordmark" aria-label={t("DISC OR DIE トップ")}>DISC<span className="red"> / </span>OR DIE<span className="brand-dot">®</span></Link><LanguageSwitch /></header>
    <main>{screen === "home" ? <section className="hero"><div className="hero-kicker"><span className="eyebrow">PHYSICAL MEDIA FOREVER</span></div><div className="hero-layout"><div className="hero-copy"><h1 className="hero-title">DISC<br /><span className="outline-type">OR</span> DIE<span className="red">.</span></h1><p className="hero-description">{t("欲しいのは、映画か。")}<br />{t("それとも、買い逃す恐怖か。")}</p><p className="hero-explanation">{t("Blu-ray、4K UHD、DVD。買うか迷ったら、8つの質問で決着を。あなたの物理メディア欲に、最終判定を下します。")}</p><button className="primary start-button" onClick={() => setScreen("movie")}>START <span>↗</span></button><p className="start-note">8 QUESTIONS <span>/</span> ABOUT 1 MINUTE <span>/</span> NO SIGN-UP</p></div><div className="disc-art" aria-hidden="true"><div className="sleeve-top"><span>DOD—001</span><span>THE COLLECTOR’S DILEMMA</span></div><div className="disc"><div className="disc-ring" /><div className="disc-center" /></div><div className="art-sticker">SPECIAL<br />INDECISION<br />EDITION <span>↗</span></div><div className="sleeve-bottom"><span>YOU CAN’T TAKE<br />YOUR COLLECTION WITH YOU.</span><div className="barcode" /></div></div></div><div className="outcome-strip">{[ ["01", "BUY IT", t("棚に迎えろ。")], ["02", "WAIT", t("その時を待て。")], ["03", "WATCH FIRST", t("まずは観ろ。")], ["04", "PASS", t("見送る勇気を。")] ].map(([n, title, caption]) => <div key={n}><span className="outcome-number">{n}</span><div><strong>{title}</strong><p>{caption}</p></div><span className="outcome-cross">+</span></div>)}</div></section> : screen === "movie" ? <MovieForm initial={movie} shops={shops} onSubmit={submitMovie} onBack={() => setScreen("home")} /> : screen === "quiz" ? <>{handed && isHanded && handed.from30film && <div className="handoff-strip"><span>{t("30 FILM CHALLENGE の作品ページから")}</span><a href={FILM30_MOVIE(handed.movie.id)}>{t("← 作品ページへ")}</a></div>}<QuestionCard key={path[index]} question={questions[path[index]]} movie={movie} shops={shops} index={index} total={path.length} selected={answers[path[index]]} onEditMovie={isHanded && index === 0 ? () => setScreen("movie") : undefined} onAnswer={answer} onBack={() => index === 0 ? setScreen("movie") : setIndex(index - 1)} /></> : <ResultCard decision={evaluate(answers)} movie={movie} backTo={handed && isHanded && handed.from30film ? FILM30_MOVIE(handed.movie.id) : undefined} onRestart={restart} onBack={() => { setIndex(path.length - 1); setScreen("quiz"); }} />}</main>
    <Credits shops={shops} /><footer className="site-footer"><span>© 2026 DISC OR DIE</span></footer></div>;
}
