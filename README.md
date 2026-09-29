# DISC OR DIE

物理メディアの購入判断ツール。Next.js App Router / TypeScript / Tailwind CSS。外部API・DB・ログインなし。回答はReactのクライアント状態のみで管理し、リロード時に消えます。

## ローカル起動

Node.js 22.6以上（推奨24）とpnpmを使用します。

```sh
pnpm install
pnpm dev
```

http://localhost:3000 を開いてください。

```sh
pnpm lint
pnpm test
pnpm build
pnpm start
```

## Vercel

このリポジトリをGitHubへpushし、Vercelの「Add New → Project」でimportします。Framework PresetはNext.js、Root Directoryはリポジトリ直下。通常は自動検出された設定のままDeployできます。環境変数・DBの設定は不要です。公開費用はVercelプランの利用条件・上限に依存します。

## 構成と編集ポイント

- `src/app/`：App Router、メタデータ、レスポンシブCSS
- `src/components/disc-app.tsx`：トップとクライアント画面遷移、分岐・戻る操作
- `src/components/movie-form.tsx`：独立した作品入力
- `src/components/question-card.tsx`：1問表示、Amazon検索リンク
- `src/components/progress.tsx`：プログレス
- `src/components/result-card.tsx`：結果、指標バー、X共有
- `src/data/questions.ts`：質問文・選択肢・分岐パス
- `src/data/scoring.ts`：指標値・重み・閾値
- `src/data/results.ts`：結果コメント
- `src/lib/decision.ts`：順序付きの優先ルールとスコア判定
- `src/lib/types.ts`：共有型
- `src/lib/links.ts`：Amazon検索・共有URL・円表示
- `tests/decision.test.ts`：全64通りの回答経路と優先判定の確認

質問の追加はQuestionId型、質問データ、getQuestionPathを変更します。表示数はパスの長さから決まります。Q1を変更するとQ2の両分岐の回答を消去します。指標は回答に基づく目安で、実在庫・市場価格を示すものではありません。

優先順：WATCH FIRST → PASS → BUY IT候補 → 価格待ち／通常在庫のFOMO → 重み付き判定。希少性だけでは購入を推奨しないように重みを小さくしています。すべての優先ルールは`decision.ts`、数値は`scoring.ts`で調整できます。

Amazonリンクはタイトル + Blu-rayの検索ページを別タブで開くだけです。データの取得はしません。X共有はユーザー操作時にintentページを開き、本文と現在のページURL（クエリ・ハッシュを除去）を渡します。投稿の確定はX側で行います。

## 将来のTMDB対応

1. `movie-form.tsx`の入力を検索・候補選択UIに拡張します。
2. `MovieInfo`に`tmdbId`などの任意フィールドを追加します。
3. サーバー側のRoute Handler（例：`src/app/api/movies/route.ts`）を追加してTMDBを呼び出します。秘密キーはサーバー環境変数に置き、クライアントへ渡しません。
4. `questions.ts`の`availability`をWatch Providersの結果と接続します。地域や確認日時を表示し、情報がない場合は現在の手動回答を維持します。

現状はTMDBを含む外部API呼び出し・環境変数はありません。
