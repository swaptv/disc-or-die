import type { Answers, Question, QuestionId } from "../lib/types.ts";

export const questions: Record<QuestionId, Question> = {
  seen: { id: "seen", label: "THE FIRST ENCOUNTER", title: "この作品を観たことがある？", choices: ["観た", "まだ観ていない"] },
  rewatch: { id: "rewatch", label: "THE REWATCH TEST", title: "また観たい？", choices: ["また観たい", "たぶんもう観ない"] },
  interest: { id: "interest", label: "THE CURIOSITY TEST", title: "今かなり観たい？", choices: ["かなり観たい", "いつか観たい程度"] },
  availability: { id: "availability", label: "ANOTHER WAY IN", title: "Blu-ray以外で今観られる？", choices: ["配信・レンタルなどで観られる", "ディスク以外ではほぼ観られない"], note: "配信状況が分からない場合は、自分で確認してから答えてください。" },
  stock: { id: "stock", label: "THE SCARCITY CHECK", title: "Amazonで現在の入手状況を確認してください。", choices: ["新品で普通に買える", "新品がない / 高騰している / 入手しづらい"], action: "amazon", note: "検索結果を確認して、あなたの目で判断してください。価格・在庫の自動取得は行いません。" },
  desire: { id: "desire", label: "DESIRE OR FEAR?", title: "もし、いつでも同じように買えると分かっていても欲しい？", choices: ["それでも欲しい", "それなら急いで買わない"] },
  price: { id: "price", label: "THE FINAL CUT", title: "今の価格に納得している？", choices: ["納得している", "高いと感じる"], showPrice: true },
};
export function getQuestionPath(answers: Answers): QuestionId[] {
  return ["seen", answers.seen === "A" ? "rewatch" : "interest", "availability", "stock", "desire", "price"];
}
