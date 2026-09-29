import type { Choice, MovieInfo, Question } from "@/lib/types";
import { amazonSearchUrl, formatPrice } from "@/lib/links";
import { Progress } from "./progress";
export function QuestionCard({ question, movie, index, total, selected, onAnswer, onBack }: { question: Question; movie: MovieInfo; index: number; total: number; selected?: Choice; onAnswer: (choice: Choice) => void; onBack: () => void }) {
  return <section className="flow-panel question-panel"><Progress current={index + 1} total={total} /><p className="eyebrow">{question.label}</p><p className="movie-caption">NOW CONSIDERING <span>{movie.title}</span></p><h1 className="question-title" tabIndex={-1} autoFocus>{question.title}</h1>
    {question.showPrice && movie.price !== null && <p className="price-callout">購入予定価格：{formatPrice(movie.price)}</p>}
    {question.note && <p className="question-note">{question.note}</p>}
    {question.action === "amazon" && <a className="amazon-link" href={amazonSearchUrl(movie.title)} target="_blank" rel="noopener noreferrer">Amazon.co.jpで検索 <span>↗</span><small>別タブで開きます</small></a>}
    <div className="answers">{question.choices.map((text, i) => { const choice: Choice = i === 0 ? "A" : "B"; return <button key={choice} className="answer" aria-pressed={selected === choice} onClick={() => onAnswer(choice)}><span className="answer-letter">{choice}</span><span>{text}</span><span className="answer-arrow">↗</span></button>; })}</div>
    <button className="back" onClick={onBack}>← {index === 0 ? "作品情報に戻る" : "前の質問に戻る"}</button><p className="fine-print">正解はありません。棚に正直に。</p></section>;
}
