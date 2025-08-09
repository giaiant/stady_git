# 汎用ロールプレイ学習コンテンツ設計ガイド

## 目的
- Git以外（Docker/Linux/SQL/クラウドなど）でも再利用できる、シナリオ駆動の学習フレームを定義。

## コアコンセプト
- ドメインに依存しない「シナリオ/ステップ/判定/ヒント/解説」の共通モデル
- ドメインごとの操作・評価はプラグイン化（Adapter Pattern）

## 用語
- **シナリオ**: 学習単元全体（例: ブランチ基礎）
- **ステップ**: 具体的な達成目標（例: ブランチ作成）
- **判定**: 達成条件の評価ロジック
- **ヒント/解説**: 達成支援と学術的背景

## シナリオモデル（抽象）
- メタ: `id`, `title`, `difficulty`, `tags`, `estimatedMinutes`
- 前提: 初期状態/セットアップ関数
- ステップ[]: `goal`, `checks[]`, `hints[]`, `explain`, `successMessage`
- 評価: stepスコア/所要時間/再挑戦回数
- 終了: `wrapUp`/参考資料

## チェック（評価）仕様
- 述語関数の組み合わせ（AND/OR/NOT）
- 例: `currentBranchIs(name)`, `fileContains(path, pattern)`, `isMerged(base, topic)`
- ドメインごとの述語をプラグイン提供（例: GitPlugin, DockerPlugin）

## プラグイン設計
- IF: `inspect(state)`, `check(predicateDescriptor)`, `hint(state)`, `setup(sandbox)`
- 各プラグインは「状態取得」「述語定義」「典型ミスのヒント」を持つ
- 依存注入でホットスワップ可能

## UX/対話
- トレーナー台本フィールド（`roleplayScript`）
- 状態に応じた分岐（誤操作/部分達成に応じたヒント差し替え）
- アクセシビリティ（色弱配慮/非カラーでも読める）

## コンテンツ制作ガイドライン
- ひとステップ=ひと学習目標（単一責任）
- 「操作→観測→説明→再演習」の流れを守る
- 3分/10分/20分のモジュール単位を用意
- 例/アンチパターン/参考リンクの併記
- 評価述語は可観測（観測不能な内面目標はNG）

## メタデータ仕様（例）
```json
{
  "id": "branch-basics",
  "title": "ブランチ基礎",
  "difficulty": "beginner",
  "estimatedMinutes": 15,
  "tags": ["git", "branch"]
}
```

## ステップ定義（例）
```json
{
  "goal": "feature/todo ブランチを作成して切り替える",
  "checks": [
    { "predicate": "currentBranchIs", "args": ["feature/todo"] }
  ],
  "hints": [
    "git branch で作成、git checkout で切替",
    "エラー時は未コミット変更を確認（git status）"
  ],
  "explain": "ワークツリーは現在のブランチのスナップショットを反映します。"
}
```

## ドメイン拡張例
- Docker: イメージ/コンテナ状態、`docker ps`等の結果で判定
- Linux: ファイル/権限/プロセスの検査
- SQL: スキーマ/行数/クエリ結果の検査（組み込みDBで安全に）

## 品質チェック（ルーブリック）
- 学習目標の明確さ、可観測性、段階性、誤りへの回復導線、一貫した語彙

## ランタイム要件
- ローカル完結、サンドボックス化、プラグインごとの依存を分離

## ライセンス/配布（案）
- CC BY 4.0（コンテンツ） + MIT（ツール本体）を想定
