# ワークツリーとブランチの違い体験シナリオ

## 🎯 概要

**ワークツリーとブランチの違いを実体験で学びたい方に最適！**

このシナリオでは、Gitの最も重要な概念である「ワークツリー」と「ブランチ」の違いを、実際のファイル操作を通して理解できます。

## 🎓 学習目標

- ワークツリー（実際のファイル）とブランチ（履歴の流れ）の違いを実感
- ブランチ切り替え時のワークツリー変化を劇的に体験
- 同じファイル名でもブランチによって内容が違うことを確認
- 7つのステップで段階的に理解を深化

## 🚀 開始方法

### 前提条件
- Node.js 18+ と Git がインストール済み
- Git Dojo のセットアップが完了済み

### 実行手順

```powershell
# 1. Git Dojo ディレクトリに移動
cd C:\dev\stady_git\tools\git-dojo

# 2. 古いサンドボックスをクリア（もしあれば）
Remove-Item -Recurse -Force .sandbox -ErrorAction SilentlyContinue

# 3. シナリオを開始（サンドボックス初期化と自動セットアップが実行される）
node bin/git-dojo.js start -s worktree-vs-branch

# 4. 別ターミナルで自動作成されたサンドボックスに移動
cd C:\dev\stady_git\tools\git-dojo\.sandbox\repo

# 5. 初期ファイルが作成されていることを確認
Get-ChildItem
# → main-file.txt と shared-file.txt が表示されるはず
```

## 📋 シナリオの流れ（7ステップ）

### 🎬 **自動セットアップ**（シナリオ開始時）

システムが以下を自動実行します：
```powershell
echo "メインブランチの内容です" > main-file.txt
git add main-file.txt
git commit -m "main: 初期ファイル作成"
echo "共通ファイルの初期内容" > shared-file.txt
git add shared-file.txt
git commit -m "main: 共通ファイル作成"
```

### **ステップ1: 🔍 現在のワークツリーを観察**
```powershell
# ファイル一覧を確認
Get-ChildItem
# → main-file.txt と shared-file.txt が見える

# ファイル内容を確認
Get-Content main-file.txt
# → "メインブランチの内容です"

Get-Content shared-file.txt
# → "共通ファイルの初期内容"

# 現在のブランチを確認
git branch
# → * main（*マークが現在のブランチ）
```
**学習ポイント**: これらのファイルが「ワークツリー」で実際に見えるファイルです

### **ステップ2: 🌿 新しいブランチを作成（まだ切り替えない）**
```powershell
# 新しいブランチを作成
git branch feature/new-content

# ブランチ一覧を確認
git branch
# → * main
#    feature/new-content

# ファイル一覧を再確認
Get-ChildItem
# → まだ同じファイルが見える（重要！）
```
**学習ポイント**: ブランチを作っただけではワークツリーは変化しない

### **ステップ3: 🔄 ブランチを切り替えてワークツリーの変化を観察**
```powershell
# ブランチを切り替え
git checkout feature/new-content

# 現在のブランチを確認
git branch
# → main
#    * feature/new-content

# ファイル一覧と内容を確認
Get-ChildItem
Get-Content shared-file.txt
# → まだ同じ内容（同じコミット履歴のため）
```
**学習ポイント**: 切り替え直後はまだ同じコミット履歴を共有している

### **ステップ4: 📝 新ブランチでファイルを編集**
```powershell
# 既存ファイルを編集
Add-Content shared-file.txt "新ブランチで追加した行"

# 新ファイルを作成
echo "新機能ブランチ専用のファイルです" > feature-file.txt

# 変更を確認
Get-ChildItem
# → main-file.txt, shared-file.txt, feature-file.txt

Get-Content shared-file.txt
# → 共通ファイルの初期内容
#   新ブランチで追加した行

Get-Content feature-file.txt
# → 新機能ブランチ専用のファイルです
```
**学習ポイント**: ワークツリーでの編集はまだ「どのブランチにも属さない」

### **ステップ5: 💾 変更をコミットしてブランチに記録**
```powershell
# 変更状況を確認
git status
# → 変更されたファイルと新しいファイルが表示される

# すべての変更をステージング
git add .

# コミット
git commit -m "feature: 共通ファイル更新と新ファイル追加"

# コミット履歴を確認
git log --oneline
```
**学習ポイント**: これで変更が「feature/new-contentブランチの履歴」になった

### **ステップ6: 🔙 mainブランチに戻ってワークツリーの劇的変化を体験**
```powershell
# 切り替え前の状態を確認
Get-ChildItem
# → main-file.txt, shared-file.txt, feature-file.txt

Get-Content shared-file.txt
# → 共通ファイルの初期内容
#   新ブランチで追加した行

# mainブランチに切り替え
git checkout main

# 🎉 劇的変化を確認！
Get-ChildItem
# → main-file.txt, shared-file.txt（feature-file.txtが消えた！）

Get-Content shared-file.txt
# → 共通ファイルの初期内容（追加した行が消えた！）
```
**🌟 最重要学習ポイント**: ワークツリーが「現在のブランチの窓」であることを実感！

### **ステップ7: 🔄 ブランチ間を行き来してワークツリーの変化を確認**
```powershell
# feature ブランチに戻る
git checkout feature/new-content
Get-ChildItem  # → feature-file.txt が復活！
Get-Content shared-file.txt  # → 追加した行も復活！

# main ブランチに戻る
git checkout main
Get-ChildItem  # → feature-file.txt が消える
Get-Content shared-file.txt  # → 元の内容に戻る

# この切り替えを何度か繰り返してみてください
```
**学習ポイント**: ワークツリーは「現在のブランチの最新コミット」を常に反映

## 💡 学習のコツ

### 【必須】各ステップで以下を実行
```powershell
Get-ChildItem                    # ファイル一覧確認
git branch                       # 現在のブランチ確認
Get-Content shared-file.txt      # ファイル内容確認
git status                       # Git状態確認
```

### 【理解促進】変化の前後比較
```powershell
# ブランチ切り替え前
Get-ChildItem > before.txt
# 切り替え後
Get-ChildItem > after.txt
# 違いを確認
Compare-Object (Get-Content before.txt) (Get-Content after.txt)
```

### 【詳細確認】Git Dojo コマンド（別ターミナルで）
```powershell
cd C:\dev\stady_git\tools\git-dojo
node bin/git-dojo.js worktree    # 全体状況把握
node bin/git-dojo.js status      # 進捗確認
```

## 🎯 体験で理解する重要概念

| 概念 | 体験する瞬間 | 確認コマンド |
|------|-------------|-------------|
| **ワークツリー** | ステップ1で実際のファイルを見る | `Get-ChildItem` |
| **ブランチは履歴** | ステップ2でブランチ作成してもファイル不変 | `git branch` → `Get-ChildItem` |
| **ブランチ切り替え** | ステップ6でファイルが劇的に変化 | `git checkout` → `Get-ChildItem` |
| **窓の概念** | ステップ7でブランチ間を行き来 | 繰り返し切り替えて確認 |

## 🎓 学習完了時の理解度

このシナリオを完了すると、以下が理解できるようになります：

- **ワークツリー** = 実際のファイルがある「作業場所」（1つだけ）
- **ブランチ** = コミット履歴の「流れ」（複数並行可能）
- **関係性**: ブランチ切り替え = ワークツリーの内容が変わる
- **重要概念**: ワークツリーは「現在のブランチの窓」として機能

## 🔗 次のステップ

このシナリオを完了したら、以下に進むことをお勧めします：

1. **[remote-workflow](./remote-workflow.md)** - チーム開発の基本フロー
2. **[conflict-resolution](./conflict-resolution.md)** - 実践的なトラブル解決

## ❓ トラブルシューティング

### よくあるエラー
```
エラー: パス 'C:\dev\stady_git\tools\git-dojo\.sandbox\repo' が存在しない
```
**原因**: シナリオ開始前に `.sandbox\repo` に移動しようとした  
**解決**: 必ずシナリオ開始後にサンドボックスに移動してください

### サポートコマンド
```powershell
# 詳細状態確認
node bin/git-dojo.js worktree

# ヒント表示
node bin/git-dojo.js hint

# 進捗確認
node bin/git-dojo.js status
```
