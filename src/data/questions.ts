import type { Answers, Question, QuestionId } from "../lib/types.ts";

export const questions: Record<QuestionId, Question> = {
  seen: { id: "seen", title: "この作品を観たことがある？", choices: ["観た", "まだ観ていない"] },
  rewatch: { id: "rewatch", title: "この先何回観たい？", choices: ["もう一度観たい", "何度も観たい"] },
  interest: { id: "interest", title: "今かなり観たい？", choices: ["かなり観たい", "いつか観たい程度"] },
  favorite: { id: "favorite", title: "好きな監督や出演者の作品？", choices: ["好きな監督・出演者の作品", "特に意識していない"] },
  timing: { id: "timing", title: "買ったらいつ観たい？", choices: ["近いうちに観たい", "今は予定がない"] },
  availability: { id: "availability", title: "Blu-ray以外で今観られる？", choices: ["配信・レンタルなどで観られる", "ディスク以外ではほぼ観られない"] },
  stock: { id: "stock", title: "現在、廃盤になっている？", choices: ["はい、廃盤・品切れ・高騰している", "いいえ、新品で普通に買える"], action: "shop" },
  desire: { id: "desire", title: "もし、いつでも同じように買えると分かっていても欲しい？", choices: ["それでも欲しい", "それなら急いで買わない"] },
  price: { id: "price", title: "今の価格に納得している？", choices: ["納得している", "高いと感じる"], showPrice: true },
};
export function getQuestionPath(answers: Answers): QuestionId[] {
  return ["seen", answers.seen === "A" ? "rewatch" : "interest", "favorite", "timing", "availability", "stock", "desire", "price"];
}
