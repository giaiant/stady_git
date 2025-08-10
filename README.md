# Git 学習リポジトリ - ワークツリーとブランチの理解

このリポジトリはGitの基本概念、特に**ワークツリー**と**ブランチ**の違いと関係性を理解するための練習用リポジトリです。

## 学習の重点項目

### 🎯 主要学習目標
- **ワークツリー（Working Tree）**の概念と役割
- **ブランチ（Branch）**の概念と仕組み
- ワークツリーとブランチの関係性
- 実際の操作を通じた理解

## 📚 基本概念の理解

### 1. ワークツリー（Working Tree）とは

**ワークツリー**は、あなたが実際にファイルを編集・作業する場所です。

#### 特徴
- ディスク上の実際のファイルとディレクトリ
- あなたが直接見て、触れることができる場所
- エディタで編集するファイルがここにある
- 作業中の変更が一時的に保存される場所

#### 例
```
stady_git/          ← これがワークツリーのルート
├── README.md       ← 実際のファイル
├── src/            ← 実際のディレクトリ
│   └── main.js     ← 実際のファイル
└── .git/           ← Gitの管理情報（ワークツリーには含まれない）
```

### 2. ブランチ（Branch）とは

**ブランチ**は、コミットの履歴を分岐させる仕組みです。

#### 特徴
- コミットの連続した履歴を表す
- 複数の開発ラインを並行して進められる
- 各ブランチは独立した履歴を持つ
- 軽量で、単なるコミットへのポインタ

#### 例
```
main (ブランチ)
├── コミットA ← 最初のコミット
├── コミットB ← README追加
└── コミットC ← 機能追加

feature (ブランチ)
├── コミットA ← mainから分岐
├── コミットB ← README追加
├── コミットD ← 新機能開発
└── コミットE ← バグ修正
```

## 🔄 ワークツリーとブランチの関係

### 重要なポイント

1. **ワークツリーは常に1つのブランチを指している**
   - 一度に1つのブランチの内容しか作業できない
   - `git checkout`でブランチを切り替えると、ワークツリーの内容が変わる

2. **ブランチの切り替え = ワークツリーの内容変更**
   - ブランチを切り替えると、そのブランチの最新コミットの内容がワークツリーに反映される

3. **作業の流れ**
   ```
   ワークツリーで編集 → ステージングエリアに追加 → コミット → ブランチに保存
   ```

## 🛠️ 実践学習項目

### 学習1: ワークツリーの理解
- [ ] 現在のワークツリーの状態確認
- [ ] ファイルの作成と編集
- [ ] ワークツリーの変更を確認

### 学習2: ブランチの理解
- [ ] ブランチの一覧表示
- [ ] 新しいブランチの作成
- [ ] ブランチの切り替え

### 学習3: ワークツリーとブランチの関係
- [ ] ブランチ切り替え時のワークツリーの変化
- [ ] 異なるブランチでの作業
- [ ] ブランチ間の違いの確認

## 📝 実践演習

### 演習1: 基本的なワークツリー操作
```bash
# 現在のワークツリーの状態を確認
git status

# 新しいファイルを作成
echo "Hello, Git!" > hello.txt

# ワークツリーの変更を確認
git status
```

### 演習2: ブランチ操作
```bash
# 現在のブランチを確認
git branch

# 新しいブランチを作成
git branch feature-branch

# ブランチを切り替え
git checkout feature-branch
```

### 演習3: 関係性の理解
```bash
# mainブランチでファイルを作成
git checkout main
echo "Main branch content" > main-file.txt

# featureブランチで別のファイルを作成
git checkout feature-branch
echo "Feature branch content" > feature-file.txt

# 各ブランチでのファイルの違いを確認
git checkout main
ls -la
git checkout feature-branch
ls -la
```

## 🎯 理解度チェック

### チェック項目
- [ ] ワークツリーが何か説明できる
- [ ] ブランチが何か説明できる
- [ ] 両者の関係性を説明できる
- [ ] ブランチ切り替え時の動作を理解している
- [ ] 実際の操作で違いを確認できる

## Git Dojo の使い方（ロールプレイ学習CLI）

### 前提条件
- Node.js 18+ と Git がインストール済み

### 基本的な使い方

1. **初期セットアップ**:
   ```powershell
   cd tools/git-dojo
   npm install
   ```

2. **シナリオ開始**:
   ```powershell
   # 基本シナリオ
   node bin/git-dojo.js start
   
   # ワークツリーとブランチの違いを体験する特別シナリオ 🌟
   node bin/git-dojo.js start -s worktree-vs-branch
   
   # 詳細解説付きシナリオ
   node bin/git-dojo.js start -s branch-basics-enhanced
   ```

3. **サンドボックスで実操作**:
   ```powershell
   # 【重要】別ターミナルでサンドボックスに移動（絶対パス推奨）
   cd C:\dev\stady_git\tools\git-dojo\.sandbox\repo
   
   # または相対パス（tools/git-dojoから）
   cd .sandbox\repo
   
   # Gitコマンドを実行
   git branch feature/todo
   git checkout feature/todo
   Add-Content README.md "ロールプレイ: 1行追記"
   git add README.md
   git commit -m "docs: update README"
   git checkout main
   git merge feature/todo
   ```

4. **学習支援コマンド**（必ず `tools/git-dojo` から実行）:
   ```powershell
   # 【重要】Git Dojoコマンドは tools/git-dojo から実行
   cd C:\dev\stady_git\tools\git-dojo
   
   # 基本コマンド
   node bin/git-dojo.js status     # 進捗確認（詳細なワークツリー状態付き）
   node bin/git-dojo.js hint       # ヒント表示
   node bin/git-dojo.js diagram    # ブランチ履歴図
   
   # 詳細可視化コマンド
   node bin/git-dojo.js worktree   # 全ブランチ概要＋ワークツリー詳細可視化
   
   # マージ関連コマンド
   node bin/git-dojo.js merge-preview -t feature/todo        # マージプレビュー
   node bin/git-dojo.js merge-preview -b main -t feature/todo # ベースブランチ指定
   
   # 操作解説コマンド
   node bin/git-dojo.js explain -o branch_create    # ブランチ作成の解説
   node bin/git-dojo.js explain -o branch_switch    # ブランチ切り替えの解説
   node bin/git-dojo.js explain -o git_commit       # コミットの解説
   node bin/git-dojo.js explain -o git_add          # ステージングの解説
   node bin/git-dojo.js explain -o git_merge        # マージの解説
   ```

5. **リセット（やり直し）**:
   ```powershell
   # どこからでも実行可能（絶対パス）
   Remove-Item -Recurse -Force C:\dev\stady_git\tools\git-dojo\.sandbox
   
   # または tools/git-dojo から実行
   cd C:\dev\stady_git\tools\git-dojo
   Remove-Item -Recurse -Force .sandbox
   ```

### 📍 パス管理のまとめ
- **Git Dojoコマンド**: `C:\dev\stady_git\tools\git-dojo` から実行
- **Gitコマンド**: `C:\dev\stady_git\tools\git-dojo\.sandbox\repo` から実行
- **リセット**: どこからでも絶対パスで実行可能

### 🎯 推奨学習シナリオ

#### 🌟 `worktree-vs-branch` - ワークツリーとブランチの違い体験
**ワークツリーとブランチの違いを実体験で学びたい方に最適！**

この特別シナリオでは：
- ワークツリー（実際のファイル）とブランチ（履歴の流れ）の違いを実感
- ブランチ切り替え時のワークツリー変化を劇的に体験
- 同じファイル名でもブランチによって内容が違うことを確認
- 7つのステップで段階的に理解を深化

##### 📋 シナリオの流れ（7ステップ）

# 実行場所
C:\dev\stady_git\tools\git-dojo\.sandbox\repo

##### 🎬 **自動セットアップ**（シナリオ開始時）
- `main-file.txt` と `shared-file.txt` が自動作成される
- 初期コミットも自動実行される

**ステップ1: 🔍 現在のワークツリーを観察**
- mainブランチの状態でファイル一覧と内容を確認
- 既に `main-file.txt` と `shared-file.txt` が存在している
- 「ワークツリー = 実際に見えるファイル」を理解

**ステップ2: 🌿 新しいブランチを作成（まだ切り替えない）**
- `git branch feature/new-content` でブランチ作成
- ワークツリーは変化しないことを確認（重要！）

**ステップ3: 🔄 ブランチを切り替えてワークツリーの変化を観察**
- `git checkout feature/new-content` で切り替え
- まだ同じコミット履歴なのでファイルは同じ

**ステップ4: 📝 新ブランチでファイルを編集**
- 既存ファイル `shared-file.txt` の内容を変更（自動セットアップで作成済み）
- 新ファイル `feature-file.txt` を**新規作成**
- ワークツリーでの変更を確認

**ステップ5: 💾 変更をコミットしてブランチに記録**
- `git add .` と `git commit` で変更を保存
- 変更が特定のブランチに属することを理解

**ステップ6: 🔙 mainブランチに戻ってワークツリーの劇的変化を体験**
- `git checkout main` でmainに戻る
- **🎉 劇的変化！** `feature-file.txt` が消える、`shared-file.txt` の内容が元に戻る
- これが最も重要な学習ポイント！

**ステップ7: 🔄 ブランチ間を行き来してワークツリーの変化を確認**
- 何度もブランチを切り替えて変化を実感
- ワークツリーとブランチの関係性を完全理解

##### 🚀 開始方法
```powershell
node bin/git-dojo.js start -s worktree-vs-branch
```

##### 💡 学習のコツ
1. 各ステップで必ず `Get-ChildItem` (ファイル一覧) を確認
2. `Get-Content ファイル名` でファイル内容を確認
3. ブランチ切り替え前後での変化に注目
4. 理解が曖昧な場合は `worktree` コマンドで詳細確認

### 新機能
- 🌳 **全ブランチ概要**: 各ブランチのファイル状況とコミット履歴を一覧表示
- 📁 **ワークツリー可視化**: ファイル状態とブランチとの関係を詳細表示
- 🔀 **マージプレビュー**: マージ前に何が統合されるかを事前確認
- 🔍 **詳細ステータス**: 未達成理由と次のステップを具体的に表示
- 💡 **操作解説**: 各Git操作の意味と影響を段階的に説明
- 📚 **学習まとめ**: シナリオ完了時に重要概念を整理
- 🎭 **観察タスク**: 体験型学習での理解促進

### 📝 コマンドリファレンス

| コマンド | 機能 | 使用例 |
|---------|------|--------|
| `start` | シナリオ開始 | `node bin/git-dojo.js start -s branch-basics-enhanced` |
| `status` | 進捗確認 | `node bin/git-dojo.js status` |
| `hint` | ヒント表示 | `node bin/git-dojo.js hint` |
| `worktree` | 全ブランチ＋ワークツリー詳細 | `node bin/git-dojo.js worktree` |
| `diagram` | ブランチ履歴図 | `node bin/git-dojo.js diagram` |
| `merge-preview` | マージプレビュー | `node bin/git-dojo.js merge-preview -t feature/todo` |
| `explain` | 操作解説 | `node bin/git-dojo.js explain -o git_commit` |

#### explain オプション一覧
- `branch_create` - ブランチ作成の解説
- `branch_switch` - ブランチ切り替えの解説  
- `git_add` - ステージングの解説
- `git_commit` - コミットの解説
- `git_merge` - マージの解説
- `file_edit` - ファイル編集の解説

### 注意事項
- サンドボックスは `tools/git-dojo/.sandbox/repo` に作成され、既存プロジェクトは変更しません
- 理解が困難な場合は `worktree` コマンドで状態を詳しく確認してください
- 操作に迷った場合は `status` → `hint` → `worktree` の順で確認することをお勧めします

## 📖 参考資料

- [Git公式ドキュメント - ブランチ](https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E3%83%96%E3%83%A9%E3%83%B3%E3%83%81%E6%A9%9F%E8%83%BD)
- [Git公式ドキュメント - 基本的なGit概念](https://git-scm.com/book/ja/v2/%E4%BB%AE%E8%A8%AD%E3%81%AE%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E3%81%A7%E3%81%AE-Git-%E3%81%AE%E5%88%9D%E6%9C%9F%E8%A8%AD%E5%AE%9A)

## 🚀 次のステップ

ワークツリーとブランチの概念を理解したら、以下の項目に進みましょう：
- マージとコンフリクト解決
- リモートリポジトリとの連携
- 高度なブランチ戦略

---

**重要**: このリポジトリで自由に実験して、概念を深く理解してください！ 