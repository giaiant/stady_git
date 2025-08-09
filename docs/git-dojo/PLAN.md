# Git Dojo 実装計画（MVP）

## 目的
- ロールプレイと実操作でGitの理解を深める対話型CLIアプリ（Windows/PowerShell対応）。
- 学習者が実際に`git`コマンドを打ち、達成状況を自動判定・フィードバック。

## スコープ（MVP）
- シナリオ「ブランチ基礎」を1本収録（作成/切替/変更/コミット/マージ）。
- コマンド: `start`, `status`, `hint`, `diagram`。
- サンドボックス環境に限定（既存プロジェクトは変更しない）。

## システム構成（概要）
- CLI入口（Commander）
- SandboxManager: 学習用作業ディレクトリ生成/初期化
- ScenarioEngine: シナリオ読み込み・ステップ管理
- GitInspector: 現在状態の収集（ブランチ/差分/履歴）
- StepRunner: 達成判定・ヒント・解説
- Presenter: 対話/配色/表示（Inquirer/Chalk）
- DiagramService: `git log --graph`の整形表示

## データフロー
1) `start`でサンドボックス生成 → 初期コミット/ブランチ用意  
2) トレーナーが目標提示 → 学習者が実操作  
3) `status`が状態を検査 → 合否・ヒント表示  
4) 完了で次ステップへ → 最後に総括

## シナリオ定義（MVP像）
- 形式: JSON/YAML（後述の汎用フレームワーク仕様に準拠）
- 例:  
  - step1: `feature/todo`ブランチ作成・切替（currentBranch==feature/todo）  
  - step2: `README.md`編集→コミット（hasCommitTouching==README.md）  
  - step3: `main`へマージ（isMerged(main, feature/todo)）

## 非機能要件
- Windows/PowerShellで安定動作
- 既存リポジトリ非破壊（サンドボックスのみ）
- ローカル完結（外部API不要）

## 技術的課題と対策
- Windows差異: Node.js標準APIで吸収、パス操作は`path`厳守
- 破壊防止: サンドボックス直下でのみ`git`を実行、ガード実装
- 状態判定の網羅性: `simple-git`で安全に取得、ユニットテスト整備

## タスク分割と実装順序
1. CLI骨格（Commander/Inquirer/Chalk）  
2. SandboxManager（init/cleanup）  
3. GitInspector（branch/status/diff/log）  
4. ScenarioEngine + StepRunner（MVPシナリオ）  
5. DiagramService（簡易ブランチ図）  
6. UX仕上げ・ヘルプ/エラーメッセージ  
7. ドキュメント整備

## 各段階の動作確認ポイント
- 1: `git-dojo --help`表示  
- 2: `start`でサンドボックス生成と初期コミット確認  
- 3: `status`でブランチ/差分が取得できる  
- 4: ステップ達成時に合格/不合格が切り替わる  
- 5: `diagram`で履歴が表示される

## 完了定義（MVP）
- 「ブランチ基礎」シナリオがstart→完走可能
- 誤操作にもガードが効く（外部リポジトリ非破壊）
- README/使い方記載・最低限のテスト通過

## 将来拡張
- 追加シナリオ（コンフリクト/リベース/スタッシュ/バイセクト）
- UI強化（TUI）、記録/復習レポート、AI支援（任意設定でAPI連携）
