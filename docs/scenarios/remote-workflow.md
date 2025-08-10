# リモートリポジトリとチーム開発ワークフローシナリオ

## 🎯 概要

**実際のチーム開発で使うGitワークフローを体験したい方におすすめ！**

このシナリオでは、GitHub等のリモートリポジトリとの連携、プッシュ・プル操作、フィーチャーブランチでの開発フローなど、実際のチーム開発で必要なGitスキルを体験できます。

## 🎓 学習目標

- リモートリポジトリ（GitHub等）との連携方法を学習
- プッシュ（push）とプル（pull）の実践
- フィーチャーブランチでの開発フローを体験
- プルリクエスト（PR）の概念理解
- 12ステップでチーム開発の一連の流れを習得

## 🚀 開始方法

### 前提条件
- Node.js 18+ と Git がインストール済み
- Git Dojo のセットアップが完了済み
- **GitHubアカウント** と **Git認証設定** が完了済み
- **GitHub CLI (gh)** がインストール済み（推奨）
- [worktree-vs-branch](./worktree-vs-branch.md) シナリオの完了を推奨

### 実行手順

```powershell
# 1. Git Dojo ディレクトリに移動
cd C:\dev\stady_git\tools\git-dojo

# 2. 古いサンドボックスをクリア
Remove-Item -Recurse -Force .sandbox -ErrorAction SilentlyContinue

# 3. シナリオを開始
node bin/git-dojo.js start -s remote-workflow

# 4. 別ターミナルでサンドボックスに移動
cd C:\dev\stady_git\tools\git-dojo\.sandbox\repo

# 5. 実際のGitHubリポジトリを作成（初回のみ）
gh repo create git-dojo-team-project --public --description "Git Dojo team development workflow practice"

# 6. リモートURLを実際のリポジトリに設定
git remote set-url origin https://github.com/[あなたのGitHubユーザー名]/git-dojo-team-project.git
```

**⚠️ 重要**: `[あなたのGitHubユーザー名]` は実際のGitHubユーザー名に置き換えてください。

## 📋 シナリオの流れ（12ステップ）

### 🎬 **自動セットアップ**（シナリオ開始時）

システムが以下を自動実行してチームプロジェクトを準備します：
```powershell
# プロジェクトドキュメントの作成
echo "# Team Project Repository" > README.md
echo "" >> README.md
echo "## Features" >> README.md
echo "- [ ] User Authentication" >> README.md
echo "- [ ] Data Management" >> README.md
echo "- [ ] API Integration" >> README.md
git add README.md
git commit -m "docs: initial project setup"

# 基本機能の骨組み作成
echo "function login() {" > auth.js
echo "  // TODO: implement login" >> auth.js
echo "}" >> auth.js
git add auth.js
git commit -m "feat: add auth skeleton"

# リモートリポジトリの設定（一時的なダミーURL - 後で実際のURLに変更）
git remote add origin https://github.com/dummy/team-project.git
```

### **ステップ1: 🌐 実際のGitHubリポジトリ作成と設定**

本格的なチーム開発環境を準備します：
```powershell
# GitHubリポジトリを作成（GitHub CLIを使用）
gh repo create git-dojo-team-project --public --description "Git Dojo team development workflow practice"

# または手動でリポジトリURLを設定する場合
# 1. GitHubでリポジトリを手動作成
# 2. 以下のコマンドで実際のURLに変更
git remote set-url origin https://github.com/[あなたのGitHubユーザー名]/git-dojo-team-project.git

# リモートリポジトリ確認
git remote -v
# → origin https://github.com/[ユーザー名]/git-dojo-team-project.git (fetch)
#   origin https://github.com/[ユーザー名]/git-dojo-team-project.git (push)

# ローカルの状態確認
git status
git log --oneline

# プロジェクトファイル確認
Get-ChildItem
```
**学習ポイント**: 実際のGitHubリポジトリが作成され、ローカルと連携準備完了

### **ステップ2: 📤 初回プッシュでリモートとの連携開始**

ローカルの変更をリモートに送信します：
```powershell
# 初回プッシュ（アップストリーム設定込み）
git push -u origin main

# プッシュ後の状態確認
git status
# → "Your branch is up to date with 'origin/main'."
```
**学習ポイント**: `-u` オプションでアップストリームブランチを設定し、今後の push/pull が簡単に

### **ステップ3: 🌿 フィーチャーブランチで新機能開発開始**

チーム開発のベストプラクティスを実践：
```powershell
# フィーチャーブランチ作成と切り替え
git checkout -b feature/user-authentication

# 現在のブランチ確認
git branch
# → main
#   * feature/user-authentication
```
**学習ポイント**: mainブランチで直接作業せず、機能ごとにブランチを作成

### **ステップ4: ⚡ 新機能の実装とコミット**

実際の機能実装を行います：
```powershell
# auth.js を実際の機能に更新
$authContent = @"
function login(username, password) {
  if (username && password) {
    return { success: true, user: username };
  }
  return { success: false, error: 'Invalid credentials' };
}

function logout() {
  return { success: true };
}

module.exports = { login, logout };
"@
$authContent | Out-File -FilePath auth.js -Encoding UTF8

# テストファイルを作成
$testContent = @"
const { login, logout } = require('./auth');

test('login with valid credentials', () => {
  const result = login('user', 'pass');
  expect(result.success).toBe(true);
});

test('logout', () => {
  const result = logout();
  expect(result.success).toBe(true);
});
"@
$testContent | Out-File -FilePath auth.test.js -Encoding UTF8

# 実装確認
Get-Content auth.js
Get-ChildItem
```
**学習ポイント**: 実装とテストを同時に作成して品質を確保

### **ステップ5: 📝 変更をコミットして履歴に記録**

実装をGit履歴として記録：
```powershell
# 変更状況確認
git status

# すべての変更をステージング
git add .

# わかりやすいコミットメッセージでコミット
git commit -m "feat: implement user authentication with tests"

# コミット履歴確認
git log --oneline
```
**学習ポイント**: 「type: description」形式のコミットメッセージで変更内容を明確化

### **ステップ6: 📤 フィーチャーブランチをリモートにプッシュ**

開発した機能をチームと共有：
```powershell
# フィーチャーブランチをリモートにプッシュ
git push -u origin feature/user-authentication

# プッシュ後の状態確認
git status

# GitHubでブランチが作成されたことを確認
gh repo view --web
# または
# ブラウザで https://github.com/[ユーザー名]/git-dojo-team-project を開く
```
**学習ポイント**: フィーチャーブランチをプッシュすることで、実際のGitHub上でコードレビューやPRの準備が完了

### **ステップ7: 🔀 プルリクエスト（PR）の作成**

実際のチーム開発フローを体験：
```powershell
# GitHub CLIでプルリクエストを作成
gh pr create --title "feat: implement user authentication with tests" --body "新しいユーザー認証機能を実装しました。

## 変更内容
- login/logout 機能の実装
- 単体テストの追加
- エラーハンドリングの改善

## テスト
- ローカルでテスト済み
- 認証フローの動作確認済み"

# 作成されたPRをブラウザで確認
gh pr view --web

# または手動でPRを作成する場合
# 1. GitHubのWebUIでPRを作成
# 2. base: main ← compare: feature/user-authentication
```
**学習ポイント**: 実際のコードレビュープロセスとプルリクエストの概念を体験

### **ステップ8: 🔄 mainブランチに戻って他の変更を取得**

他のメンバーの作業を想定：
```powershell
# mainブランチに切り替え
git checkout main

# ワークツリーの変化を確認
Get-ChildItem
# → フィーチャーブランチでの変更は見えない（正常）

# 現在のブランチ確認
git branch
# → * main
#   feature/user-authentication
```
**学習ポイント**: ブランチ切り替えでワークツリーが変化することを再確認

### **ステップ9: 📝 プルリクエストのマージ**

実際のPRマージプロセスを体験：
```powershell
# GitHub CLIでプルリクエストをマージ
gh pr merge --merge --delete-branch

# または GitHub Web UIでマージする場合:
# 1. PRページで "Merge pull request" をクリック
# 2. "Confirm merge" で確定
# 3. "Delete branch" でブランチ削除

# マージ後、ローカルを最新状態に同期
git pull origin main

# マージ後のファイル確認
Get-ChildItem
# → auth.js と auth.test.js が追加されている

# マージ履歴確認
git log --oneline --graph
```
**学習ポイント**: 実際のPRマージプロセスとリモート→ローカル同期を体験

### **ステップ10: 🔄 他のメンバーの変更をシミュレート**

並行開発の状況を作成：
```powershell
# 他のメンバーがREADMEを更新（シミュレート）
$readmeContent = @"
# Team Project Repository

## Features
- [x] User Authentication
- [ ] Data Management  
- [ ] API Integration

## Setup
npm install
npm test

## Contributors
- あなたのGitHubユーザー名
"@
$readmeContent | Out-File -FilePath README.md -Encoding UTF8

# 変更内容確認
Get-Content README.md
```
**学習ポイント**: 他のメンバーがプロジェクトドキュメントを更新した状況をシミュレート

### **ステップ11: 📝 追加の変更をコミットしてプッシュ**

実際のリモート連携を体験：
```powershell
# 変更をステージング
git add README.md

# 他のメンバーの変更としてコミット
git commit -m "docs: update README with setup instructions and contributors"

# 変更をリモートにプッシュ
git push origin main

# GitHub上で変更を確認
gh repo view --web

# コミット履歴確認
git log --oneline
```
**学習ポイント**: 継続的なリモート連携とプロジェクトの成長を体験

### **ステップ12: 🧹 プロジェクトの最終確認とクリーンアップ**

完了した成果物を確認：
```powershell
# ローカルブランチの確認
git branch
# → * main

# リモートの状況確認
git remote show origin

# プロジェクトの最終状態確認
Get-ChildItem
git status

# 完了した機能の確認
Get-Content README.md
Get-Content auth.js

# GitHubリポジトリを確認
gh repo view --web
```
**学習ポイント**: 完全なフィーチャー開発サイクルが完了し、実際のGitHub上で成果物を確認

## 💡 学習支援コマンド

### 【進捗確認】（tools/git-dojo ディレクトリから）
```powershell
cd C:\dev\stady_git\tools\git-dojo

# 現在の状況確認
node bin/git-dojo.js status

# ヒント表示
node bin/git-dojo.js hint

# 詳細な状態可視化
node bin/git-dojo.js worktree

# ブランチ履歴図
node bin/git-dojo.js diagram
```

### 【各ステップでの確認】（サンドボックスで）
```powershell
# 基本状態確認
git status
git branch
git remote -v

# リモートとの同期状況確認
git log --oneline --graph
git log --oneline origin/main

# ファイル状況確認
Get-ChildItem
Get-Content README.md
```

## 🎯 重要概念の理解

| 概念 | 実体験する場面 | 確認方法 |
|------|---------------|----------|
| **実際のGitHubリポジトリ** | ステップ1のリポジトリ作成 | `gh repo view --web` |
| **リモートリポジトリ** | ステップ2の初回プッシュ | `git remote -v` |
| **アップストリーム** | ステップ2の `-u` オプション | `git status` |
| **フィーチャーブランチ** | ステップ3-6の開発フロー | `git branch` |
| **プルリクエスト** | ステップ7のPR作成 | `gh pr view --web` |
| **プッシュ/プル** | ステップ2,6,9,11 | `git push/pull` |
| **マージ** | ステップ9のPRマージ | `git log --graph` |

## 🎓 学習完了時の理解度

このシナリオを完了すると、以下のスキルが身につきます：

### **基本概念**
- **リモートリポジトリ** = チームで共有するコードの保管場所
- **プッシュ** = ローカルの変更をリモートに送信
- **プル** = リモートの変更をローカルに取得
- **フィーチャーブランチ** = 機能開発用の作業ブランチ

### **実際のチーム開発フロー**
1. GitHubリポジトリの作成・設定
2. フィーチャーブランチで開発
3. ローカルでテスト・コミット
4. リモートにプッシュ
5. **プルリクエスト（PR）の作成**
6. **コードレビュー**
7. **PRマージ**
8. ローカルの同期
9. 継続的な開発とリモート連携

### **ベストプラクティス**
- 小さな変更を頻繁にコミット
- わかりやすいコミットメッセージ
- ブランチの適切な命名（feature/, fix/, docs/）
- マージ後のブランチクリーンアップ

## 🔗 次のステップ

このシナリオを完了したら、以下に進むことをお勧めします：

1. **[conflict-resolution](./conflict-resolution.md)** - マージコンフリクトの解決スキル
2. より高度なGitワークフロー（リベース、チェリーピックなど）

## ⚙️ GitHub認証設定

### 初回セットアップ（必須）
```powershell
# GitHub CLIの認証
gh auth login
# 1. GitHub.com を選択
# 2. HTTPS を選択
# 3. Y（Git認証も設定）
# 4. ブラウザまたはトークンで認証

# Git設定確認
git config --global user.name
git config --global user.email

# 未設定の場合は設定
git config --global user.name "あなたの名前"
git config --global user.email "youremail@example.com"
```

### GitHub CLIが利用できない場合
```powershell
# 手動でリポジトリを作成
# 1. GitHub.com でリポジトリ作成
# 2. URLを手動設定
git remote set-url origin https://github.com/[ユーザー名]/git-dojo-team-project.git

# PersonalAccess Token を使用した認証設定
git config --global credential.helper manager-core
```

## ❓ トラブルシューティング

### よくあるケース

**GitHub認証エラー**
```
remote: Support for password authentication was removed
```
**原因**: パスワード認証は廃止されています  
**解決**: Personal Access Token または GitHub CLI を使用

**プッシュ時のエラー**
```
error: failed to push some refs to 'origin'
```
**原因**: リモートに新しい変更がある場合  
**解決**: `git pull` で最新状態を取得してからプッシュ

**リポジトリが見つからない**
```
remote: Repository not found
```
**原因**: リポジトリURL の間違いまたはアクセス権限なし  
**解決**: URL確認 `git remote -v` および権限確認

**ブランチの切り替えができない**
```
error: Your local changes would be overwritten
```
**原因**: 未コミットの変更がある場合  
**解決**: 変更をコミットまたはスタッシュしてから切り替え

### デバッグコマンド
```powershell
# 認証状況確認
gh auth status

# 現在の状況を詳しく確認
git status -v
git log --oneline --graph --all
git remote show origin

# GitHub上のリポジトリ確認
gh repo view --web
```
