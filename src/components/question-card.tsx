"use client";
import { useLanguage } from "./language-provider";
import type { Choice, MovieInfo, Question } from "@/lib/types";
import { formatPrice } from "@/lib/links";
import { Progress } from "./progress";
import { WatchProviders } from "./watch-providers";
import { MoviePoster } from "./movie-poster";
import { ShopLinks } from "./shop-links";
import type { ShopConfig } from "@/lib/affiliate";
export function QuestionCard({ question, movie, shops, index, total, selected, onEditMovie, onAnswer, onBack }: { question: Question; movie: MovieInfo; shops: ShopConfig; index: number; total: number; selected?: Choice; onEditMovie?: () => void; onAnswer: (choice: Choice) => void; onBack: () => void }) {
  const { t, locale } = useLanguage();
  return <section className="flow-panel question-panel"><Progress current={index + 1} total={total} /><div className="question-movie">{movie.tmdb?.posterPath && <MoviePoster key={movie.tmdb.posterPath} path={movie.tmdb.posterPath} title={movie.title} className="question-poster" />}<div className="question-movie-body"><p className="question-movie-title">{movie.title}</p>{movie.tmdb?.releaseYear && onEditMovie && <p className="question-movie-year">{movie.tmdb.releaseYear}</p>}{onEditMovie && <div className="question-movie-actions">{movie.price === null && <button type="button" onClick={onEditMovie}>{t("価格を入れる")}</button>}<button type="button" onClick={onEditMovie}>{t("作品を変更")}</button></div>}</div></div><h1 className="question-title" tabIndex={-1} autoFocus>{t(question.title)}</h1>
    {question.showPrice && movie.price !== null && <p className="price-callout">{t("購入予定価格：")}{formatPrice(movie.price, locale)}</p>}
    {question.note && <p className="question-note">{t(question.note)}</p>}
    {question.showPrice && <ShopLinks title={movie.title} shops={shops} hint="「{title}」のDVD・Blu-rayを別タブで検索します。" />}
    {question.id === "availability" && movie.tmdb && <WatchProviders key={movie.tmdb.id} movieId={movie.tmdb.id} onConfirm={() => onAnswer("A")} />}
    {question.action === "shop" && <ShopLinks title={movie.title} shops={shops} heading="stock" amazonFallback hint="「{title}」のDVD・Blu-rayを別タブで検索します。" />}
    <div className="answers">{question.choices.map((text, i) => { const choice: Choice = i === 0 ? "A" : "B"; return <button key={choice} className="answer" aria-pressed={selected === choice} onClick={() => onAnswer(choice)}><span className="answer-letter">{choice}</span><span>{t(text)}</span><span className="answer-arrow">↗</span></button>; })}</div>
    <button className="back" onClick={onBack}>← {index === 0 ? t("作品情報に戻る") : t("前の質問に戻る")}</button><p className="fine-print">{t("正解はありません。棚に正直に。")}</p></section>;
}
