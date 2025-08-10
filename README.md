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

- **前提**: Node.js 18+ と Git がインストール済み
- **初期セットアップ**:
  ```powershell
  cd tools/git-dojo
  npm install
  ```
- **シナリオ開始**:
  ```powershell
  node bin/git-dojo.js start
  ```
- **サンドボックスで実操作**（別ターミナル可）:
  ```powershell
  cd tools/git-dojo/.sandbox/repo
  git branch feature/todo
  git checkout feature/todo
  Add-Content README.md "ロールプレイ: 1行追記"
  git add README.md
  git commit -m "docs: update README"
  git checkout main
  git merge feature/todo
  ```
- **進捗確認/ヒント/履歴図**:
  ```powershell
  cd tools/git-dojo
  node bin/git-dojo.js status
  node bin/git-dojo.js hint
  node bin/git-dojo.js diagram
  ```
- **リセット（やり直し）**:
  ```powershell
  Remove-Item -Recurse -Force tools/git-dojo/.sandbox
  ```
- 注意: サンドボックスは `tools/git-dojo/.sandbox/repo` に作成され、既存プロジェクトは変更しません。

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