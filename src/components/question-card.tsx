"use client";
import { useLanguage } from "./language-provider";
import type { Choice, MovieInfo, Question } from "@/lib/types";
import { amazonSearchUrl, formatPrice } from "@/lib/links";
import { Progress } from "./progress";
import { WatchProviders } from "./watch-providers";
import { MoviePoster } from "./movie-poster";
export function QuestionCard({ question, movie, index, total, selected, onAnswer, onBack }: { question: Question; movie: MovieInfo; index: number; total: number; selected?: Choice; onAnswer: (choice: Choice) => void; onBack: () => void }) {
  const { t, locale } = useLanguage();
  return <section className="flow-panel question-panel"><Progress current={index + 1} total={total} /><div className="question-movie">{movie.tmdb?.posterPath && <MoviePoster key={movie.tmdb.posterPath} path={movie.tmdb.posterPath} title={movie.title} className="question-poster" />}<p className="question-movie-title">{movie.title}</p></div><h1 className="question-title" tabIndex={-1} autoFocus>{t(question.title)}</h1>
    {question.showPrice && movie.price !== null && <p className="price-callout">{t("購入予定価格：")}{formatPrice(movie.price, locale)}</p>}
    {question.note && <p className="question-note">{t(question.note)}</p>}
    {question.id === "availability" && movie.tmdb && <WatchProviders key={movie.tmdb.id} movieId={movie.tmdb.id} onConfirm={() => onAnswer("A")} />}
    {question.action === "amazon" && <a className="amazon-link" href={amazonSearchUrl(movie.title)} target="_blank" rel="noopener noreferrer">{t("Amazon.co.jpで検索 ")}<span>↗</span><small>{t("別タブで開きます")}</small></a>}
    <div className="answers">{question.choices.map((text, i) => { const choice: Choice = i === 0 ? "A" : "B"; return <button key={choice} className="answer" aria-pressed={selected === choice} onClick={() => onAnswer(choice)}><span className="answer-letter">{choice}</span><span>{t(text)}</span><span className="answer-arrow">↗</span></button>; })}</div>
    <button className="back" onClick={onBack}>← {index === 0 ? t("作品情報に戻る") : t("前の質問に戻る")}</button><p className="fine-print">{t("正解はありません。棚に正直に。")}</p></section>;
}
