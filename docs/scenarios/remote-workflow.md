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
```

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

# リモートリポジトリの設定
git remote add origin https://github.com/dummy/team-project.git
```

### **ステップ1: 🌐 リモートリポジトリの状態確認**

チーム開発の出発点を理解します：
```powershell
# ローカルの状態確認
git status

# リモートリポジトリ確認
git remote -v
# → origin https://github.com/dummy/team-project.git (fetch)
#   origin https://github.com/dummy/team-project.git (push)

# コミット履歴確認
git log --oneline

# プロジェクトファイル確認
Get-ChildItem
```
**学習ポイント**: ローカルにコミットがあるが、まだリモートにプッシュされていない状態

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
git push origin feature/user-authentication

# プッシュ後の状態確認
git status
```
**学習ポイント**: フィーチャーブランチをプッシュすることで、コードレビューやPRの準備が完了

### **ステップ7: 🔄 mainブランチに戻って他の変更を取得**

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

### **ステップ8: 🔄 他のメンバーの変更をシミュレート**

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
"@
$readmeContent | Out-File -FilePath README.md -Encoding UTF8

# 変更内容確認
Get-Content README.md
```
**学習ポイント**: 他のメンバーがプロジェクトドキュメントを更新した状況をシミュレート

### **ステップ9: 📝 他のメンバーの変更をコミット（シミュレート）**

競合状況の準備：
```powershell
# 変更をステージング
git add README.md

# 他のメンバーの変更としてコミット
git commit -m "docs: update README with setup instructions"

# コミット履歴確認
git log --oneline
```
**学習ポイント**: フィーチャーブランチが分岐した後にmainブランチが更新された状況

### **ステップ10: 🔀 フィーチャーブランチをmainブランチにマージ**

開発した機能を統合：
```powershell
# 現在mainブランチにいることを確認
git branch

# フィーチャーブランチをマージ
git merge feature/user-authentication

# マージ後のファイル確認
Get-ChildItem
# → auth.js と auth.test.js が追加されている

# マージ履歴確認
git log --oneline --graph
```
**学習ポイント**: マージにより、フィーチャーブランチで開発した機能がmainブランチに統合

### **ステップ11: 🧹 使用済みブランチのクリーンアップ**

リポジトリの整理：
```powershell
# マージ済みフィーチャーブランチを削除
git branch -d feature/user-authentication

# 残っているブランチ確認
git branch
# → * main のみ

# プロジェクトの最終状態確認
Get-ChildItem
git status
```
**学習ポイント**: 不要なブランチを削除してリポジトリを整理

### **ステップ12: 📤 統合された変更をリモートにプッシュ**

チーム全体で最新状態を共有：
```powershell
# 統合結果をリモートにプッシュ
git push origin main

# 最終状態確認
git status
# → "Your branch is up to date with 'origin/main'."

# 完了した機能の確認
Get-Content README.md
Get-Content auth.js
```
**学習ポイント**: 完全なフィーチャー開発サイクルが完了し、新機能が本番環境にデプロイ可能

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
| **リモートリポジトリ** | ステップ2の初回プッシュ | `git remote -v` |
| **アップストリーム** | ステップ2の `-u` オプション | `git status` |
| **フィーチャーブランチ** | ステップ3-6の開発フロー | `git branch` |
| **プッシュ/プル** | ステップ2,6,12 | `git push/pull` |
| **マージ** | ステップ10の統合 | `git log --graph` |

## 🎓 学習完了時の理解度

このシナリオを完了すると、以下のスキルが身につきます：

### **基本概念**
- **リモートリポジトリ** = チームで共有するコードの保管場所
- **プッシュ** = ローカルの変更をリモートに送信
- **プル** = リモートの変更をローカルに取得
- **フィーチャーブランチ** = 機能開発用の作業ブランチ

### **チーム開発フロー**
1. フィーチャーブランチで開発
2. ローカルでテスト・コミット
3. リモートにプッシュ
4. コードレビュー（PRプロセス）
5. mainブランチにマージ
6. 不要ブランチを削除

### **ベストプラクティス**
- 小さな変更を頻繁にコミット
- わかりやすいコミットメッセージ
- ブランチの適切な命名（feature/, fix/, docs/）
- マージ後のブランチクリーンアップ

## 🔗 次のステップ

このシナリオを完了したら、以下に進むことをお勧めします：

1. **[conflict-resolution](./conflict-resolution.md)** - マージコンフリクトの解決スキル
2. より高度なGitワークフロー（リベース、チェリーピックなど）

## ❓ トラブルシューティング

### よくあるケース

**プッシュ時のエラー**
```
error: failed to push some refs to 'origin'
```
**原因**: リモートに新しい変更がある場合  
**解決**: `git pull` で最新状態を取得してからプッシュ

**ブランチの切り替えができない**
```
error: Your local changes would be overwritten
```
**原因**: 未コミットの変更がある場合  
**解決**: 変更をコミットまたはスタッシュしてから切り替え

### デバッグコマンド
```powershell
# 現在の状況を詳しく確認
git status -v
git log --oneline --graph --all
git remote show origin
```
