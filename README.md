# DISC OR DIE

物理メディアの購入判断ツール。Next.js App Router / TypeScript / Tailwind CSS。TMDBによる映画検索・日本の配信情報に対応。DB・ログイン・AI API・Amazon APIは使用しません。回答はReactのクライアント状態のみで管理し、リロード時に消えます。TMDB未設定でも手入力で診断できます。

## ローカル起動

Node.js 22.6以上（推奨24）とpnpmを使用します。

```sh
pnpm install
pnpm dev
```

http://localhost:3000/disc-or-die を開いてください。

```sh
pnpm lint
pnpm test
pnpm build
pnpm start
```

## 公開先のパス

公開URLは `https://swaptv.tokyo/disc-or-die` を想定しています。`src/lib/base-path.ts` の `/disc-or-die` をNext.jsの `basePath` と画像・APIのURLに使用しています。変更した場合は再ビルドが必要です。

既存サイトと別にこのアプリを動かす場合、ドメインを管理しているホスティング側で `/disc-or-die` と `/disc-or-die/*` をこのNext.jsサーバーへ転送してください。転送時には `/disc-or-die` を削除せず、API・画像・`_next` 配下も含めます。DNSだけではパス単位の振り分けはできません。

映画検索・配信情報のAPIにはサーバー実行環境が必要です。HTMLファイルのアップロードだけでは動作しません。

## Vercel

`swaptv.tokyo` が別のVercelプロジェクトに紐付いている場合、このアプリを別プロジェクトとしてデプロイし、**swaptv.tokyo本体側**の `vercel.json` の `rewrites` に次の設定を追加します。`YOUR-DISC-OR-DIE-PROJECT.vercel.app` は、このアプリの実際の本番ドメインに置き換えてください。既存の設定は保持し、全パスを対象にするルールより前に追加します。このアプリ側に転送ルールを置く必要はありません。

```json
{
  "rewrites": [
    {
      "source": "/disc-or-die",
      "destination": "https://YOUR-DISC-OR-DIE-PROJECT.vercel.app/disc-or-die"
    },
    {
      "source": "/disc-or-die/:path*",
      "destination": "https://YOUR-DISC-OR-DIE-PROJECT.vercel.app/disc-or-die/:path*"
    }
  ]
}
```

まずアプリの本番ドメインの `/disc-or-die` で動作を確認し、次に本体側を再デプロイして公開URLで確認します。[Vercel公式の外部Rewrite説明](https://vercel.com/docs/routing/rewrites)も参照してください。

このリポジトリをGitHubへpushし、Vercelの「Add New → Project」でimportします。Framework PresetはNext.js、Root Directoryはリポジトリ直下。TMDBを有効にする場合はSettings → Environment Variablesに`TMDB_READ_ACCESS_TOKEN`を登録し、対象環境を選択して再デプロイしてください。DBの設定は不要です。公開費用はVercelプランの利用条件・上限に依存します。

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

## TMDBの設定

1. [TMDBのAPI設定](https://www.themoviedb.org/settings/api)でAPI利用を申請し、**API Read Access Token**を取得します（v3のAPI Keyではありません）。
2. `.env.example`をリポジトリ直下の`.env.local`へコピーし、`TMDB_READ_ACCESS_TOKEN`に値を設定します。
3. 開発サーバーを再起動します。トークンはチャットやGitへ貼り付けず、`NEXT_PUBLIC_`も付けないでください。

```dotenv
TMDB_READ_ACCESS_TOKEN=your_read_access_token
```

作品入力の「作品を検索」で日本語タイトル・原題・公開年の候補を最大20件表示します。選択するとTMDB IDを保持し、Q3で日本（JP）の見放題・無料・広告付き・レンタル・デジタル購入先を表示します。「視聴できることを確認した：Aで回答」で診断に反映できます。候補なし・未設定・通信失敗の場合も手入力とA/B回答で続けられます。

配信先の掲載は、利用者の契約・字幕・吹替などの条件を保証しません。日本の情報がない場合は「配信なし」と自動判定しません。最終的なQ3の回答は利用者が確認して選びます。タイトルの編集・選択解除時はTMDB IDを消去し、別作品に変更した場合は回答もリセットします。

### 追加・変更箇所

- `src/components/movie-search.tsx`：検索・候補選択・通信中断と古い結果の破棄
- `src/components/movie-form.tsx`：選択作品の保持、手入力への切り替え
- `src/components/watch-providers.tsx`：地域JPの配信情報、再試行、確認後のA回答
- `src/components/question-card.tsx`：Q3への配信情報の組み込み
- `src/components/disc-app.tsx`：作品変更時の回答リセット、クレジット表示
- `src/components/credits.tsx`：TMDB公式ロゴ・指定文言・JustWatchへのリンク
- `public/tmdb-logo.svg` / `public/tmdb-logo-license.txt`：公式ロゴのWikimedia掲載版（改変なし）と出典・ライセンス
- `src/app/api/tmdb/search/route.ts`：映画検索のGETエンドポイント
- `src/app/api/tmdb/providers/route.ts`：配信情報のGETエンドポイント
- `src/lib/tmdb-server.ts`：`server-only`境界・環境変数の読み取り
- `src/lib/tmdb-api.ts`：入力検証、Bearer認証、8秒タイムアウト、エラー処理
- `src/lib/tmdb.ts`：外部JSONの検証・整形。地域や分類の変更はここ
- `src/lib/types.ts`：作品候補・配信情報・API応答の型
- `src/app/globals.css`：検索候補・配信情報・クレジットのレスポンシブ表示
- `.env.example`：必要な環境変数の例
- `tests/tmdb.test.ts`：モックしたTMDB応答によるAPI・異常系テスト
- `package.json`：全テストファイルを実行するtestスクリプト

検索語は検索操作時にサーバー経由でTMDBへ、作品IDはQ3の表示時にTMDBへ送信します。価格・診断回答は送信しません。トークンと上流のエラー本文はブラウザへ返しません。成功応答のみ共有CDNキャッシュを検索5分・配信情報1時間に設定し、エラーはキャッシュしません。画面の取得時刻は上流から取得した時点（JST表示）です。ローカル環境ではCDNキャッシュは動作しません。追加ライブラリはありません。

### 公式資料・出典

- [映画検索](https://developer.themoviedb.org/reference/search-movie)
- [Watch Providers・JustWatch出典要件](https://developer.themoviedb.org/reference/movie-watch-providers)
- [Bearer認証](https://developer.themoviedb.org/docs/authentication-application)
- [TMDB FAQ・利用条件](https://developer.themoviedb.org/docs/faq)
- [公式ロゴ](https://www.themoviedb.org/about/logos-attribution)

TMDBは出典表記を行う非商用利用向けに無料APIを提供しています。収益化する場合はTMDBの商用利用条件を確認してください。クレジットには公式ロゴと指定文言、配信情報にはJustWatchの出典を表示しています。
