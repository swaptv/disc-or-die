"use client";
import { useLanguage, LanguageSwitch } from "./language-provider";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Answers, Choice, MovieInfo } from "@/lib/types";
import { questions, getQuestionPath } from "@/data/questions";
import { evaluate } from "@/lib/decision";
import { trackAnalytics } from "@/lib/analytics";
import { MovieForm } from "./movie-form";
import { QuestionCard } from "./question-card";
import { ResultCard } from "./result-card";
import { Credits } from "./credits";
export default function DiscApp() {
  const { t, locale } = useLanguage();
  const [screen, setScreen] = useState<"home" | "movie" | "quiz" | "result">("home");
  const [movie, setMovie] = useState<MovieInfo>({ title: "", price: null });
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const openedTracked = useRef(false);
  const lastQuestionView = useRef("");
  const previousScreen = useRef(screen);
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [screen, index]);
  const path = getQuestionPath(answers);
  const currentQuestionId = screen === "quiz" ? path[index] : undefined;
  useEffect(() => {
    if (openedTracked.current) return;
    openedTracked.current = true;
    trackAnalytics("app_opened", { locale });
  }, [locale]);
  useEffect(() => {
    if (previousScreen.current === "home" && screen === "movie") {
      trackAnalytics("start_clicked", { locale });
    }
    previousScreen.current = screen;
  }, [locale, screen]);
  useEffect(() => {
    if (!currentQuestionId) {
      lastQuestionView.current = "";
      return;
    }
    const viewKey = `${index}:${currentQuestionId}`;
    if (lastQuestionView.current === viewKey) return;
    lastQuestionView.current = viewKey;
    trackAnalytics("question_viewed", {
      locale,
      question_id: currentQuestionId,
      question_number: index + 1,
      question_count: path.length,
    });
  }, [currentQuestionId, index, locale, path.length]);
  function answer(choice: Choice) {
    const id = path[index];
    const next = { ...answers, [id]: choice };
    if (id === "seen" && answers.seen !== choice) { delete next.rewatch; delete next.interest; }
    setAnswers(next);
    if (index === path.length - 1) {
      trackAnalytics("diagnosis_completed", {
        locale,
        result: evaluate(next).result,
        question_count: path.length,
      });
      setScreen("result");
    } else setIndex(index + 1);
  }
  function restart() { setAnswers({}); setIndex(0); setMovie({ title: "", price: null }); setScreen("movie"); }
  function submitMovie(value: MovieInfo) {
    // Answers about a different movie must not carry over after going back.
    if (value.title !== movie.title || value.tmdb?.id !== movie.tmdb?.id) setAnswers({});
    else if (value.price !== movie.price) setAnswers(previous => { const next = { ...previous }; delete next.price; return next; });
    setMovie(value); setIndex(0); setScreen("quiz");
    trackAnalytics("quiz_started", {
      locale,
      input_method: value.tmdb ? "tmdb" : "manual",
      has_price: value.price !== null,
    });
  }
  return <div className="app-shell"><header className="site-header"><Link href="/" onClick={() => setScreen("home")} className="wordmark" aria-label={t("DISC OR DIE トップ")}>DISC<span className="red"> / </span>OR DIE<span className="brand-dot">®</span></Link><div className="header-right"><span className="status-dot" /> A PHYSICAL MEDIA EXISTENTIAL CRISIS</div><LanguageSwitch /></header>
    <main>{screen === "home" ? <section className="hero"><div className="hero-kicker"><span className="eyebrow">PHYSICAL MEDIA FOREVER</span><span className="edition-tag">EST. 2026 — VOL. 001</span></div><div className="hero-layout"><div className="hero-copy"><h1 className="hero-title">DISC<br /><span className="outline-type">OR</span> DIE<span className="red">.</span></h1><p className="hero-subtitle">Should you buy that disc?</p><p className="hero-description">{t("欲しいのは、映画か。")}<br />{t("それとも、買い逃す恐怖か。")}</p><p className="hero-explanation">{t("Blu-ray、4K UHD、DVD。買うか迷ったら、8つの質問で決着を。あなたの物理メディア欲に、最終判定を下します。")}</p><button className="primary start-button" onClick={() => setScreen("movie")}>START <span>↗</span></button><p className="start-note">8 QUESTIONS <span>/</span> ABOUT 1 MINUTE <span>/</span> NO SIGN-UP</p></div><div className="disc-art" aria-hidden="true"><div className="sleeve-top"><span>DOD—001</span><span>THE COLLECTOR’S DILEMMA</span></div><div className="disc"><div className="disc-ring" /><div className="disc-center" /></div><div className="art-sticker">SPECIAL<br />INDECISION<br />EDITION <span>↗</span></div><div className="sleeve-bottom"><span>YOU CAN’T TAKE<br />YOUR COLLECTION WITH YOU.</span><div className="barcode" /></div></div></div><div className="outcome-strip">{[ ["01", "BUY IT", t("棚に迎えろ。")], ["02", "WAIT", t("その時を待て。")], ["03", "WATCH FIRST", t("まずは観ろ。")], ["04", "PASS", t("見送る勇気を。")] ].map(([n, title, caption]) => <div key={n}><span className="outcome-number">{n}</span><div><strong>{title}</strong><p>{caption}</p></div><span className="outcome-cross">+</span></div>)}</div></section> : screen === "movie" ? <MovieForm initial={movie} onSubmit={submitMovie} onBack={() => setScreen("home")} /> : screen === "quiz" ? <QuestionCard key={path[index]} question={questions[path[index]]} movie={movie} index={index} total={path.length} selected={answers[path[index]]} onAnswer={answer} onBack={() => index === 0 ? setScreen("movie") : setIndex(index - 1)} /> : <ResultCard decision={evaluate(answers)} movie={movie} onRestart={restart} onBack={() => { setIndex(path.length - 1); setScreen("quiz"); }} />}</main>
    <Credits /><footer className="site-footer"><span>© 2026 DISC OR DIE</span><span>TRUST YOUR TASTE. QUESTION YOUR IMPULSE.</span><span>LONG LIVE PHYSICAL MEDIA<span className="red"> ✳</span></span></footer></div>;
}
