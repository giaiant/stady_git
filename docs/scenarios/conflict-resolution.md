# マージコンフリクトの解決とチーム協調シナリオ

## 🎯 概要

**複数人での開発で避けて通れないコンフリクト解決を学びたい方必見！**

このシナリオでは、チーム開発で避けられないマージコンフリクトの発生から解決まで、実際の状況を想定した実践的な体験ができます。

## 🎓 学習目標

- マージコンフリクトが発生する原因と状況を理解
- コンフリクトマーカーの読み方と意味を学習
- 手動でのコンフリクト解決方法を実践
- 解決後の適切な処理手順を習得
- コンフリクトを予防するベストプラクティスを学習

## 🚀 開始方法

### 前提条件
- Node.js 18+ と Git がインストール済み
- Git Dojo のセットアップが完了済み
- [worktree-vs-branch](./worktree-vs-branch.md) と [remote-workflow](./remote-workflow.md) の完了を推奨

### 実行手順

```powershell
# 1. Git Dojo ディレクトリに移動
cd C:\dev\stady_git\tools\git-dojo

# 2. 古いサンドボックスをクリア
Remove-Item -Recurse -Force .sandbox -ErrorAction SilentlyContinue

# 3. シナリオを開始
node bin/git-dojo.js start -s conflict-resolution

# 4. 別ターミナルでサンドボックスに移動
cd C:\dev\stady_git\tools\git-dojo\.sandbox\repo
```

## 📋 シナリオの流れ（12ステップ）

### 🎬 **自動セットアップ**（シナリオ開始時）

ショッピングアプリプロジェクトを準備：
```powershell
# プロジェクトドキュメント作成
echo "# Shopping App" > README.md
echo "" >> README.md
echo "## Features" >> README.md
echo "- Product listing" >> README.md
echo "- Shopping cart" >> README.md
git add README.md
git commit -m "docs: initial project documentation"

# 基本機能実装
echo "const products = [];" > products.js
echo "" >> products.js
echo "function addProduct(product) {" >> products.js
echo "  products.push(product);" >> products.js
echo "}" >> products.js
git add products.js
git commit -m "feat: add basic product management"
```

### **ステップ1: 🚀 プロジェクトの初期状態確認**

チーム開発プロジェクトの状況把握：
```powershell
# プロジェクトファイル確認
Get-ChildItem
# → README.md, products.js

# ドキュメント内容確認
Get-Content README.md

# コード内容確認
Get-Content products.js

# Git履歴確認
git log --oneline
```
**学習ポイント**: ショッピングアプリの基本構造が準備されています

### **ステップ2: 🌿 あなたの担当機能ブランチを作成**

ショッピングカート機能を担当：
```powershell
# ショッピングカート機能用ブランチ作成
git checkout -b feature/shopping-cart

# 現在のブランチ確認
git branch
# → main
#   * feature/shopping-cart
```
**学習ポイント**: 他のメンバーと作業が重ならないよう専用ブランチで開発

### **ステップ3: 🛒 ショッピングカート機能を実装**

機能実装とドキュメント更新：
```powershell
# cart.js ファイル作成
$cartContent = @"
const cart = [];

function addToCart(productId, quantity = 1) {
  const existingItem = cart.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
}

function removeFromCart(productId) {
  const index = cart.findIndex(item => item.productId === productId);
  if (index > -1) {
    cart.splice(index, 1);
  }
}

function getCartTotal() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

module.exports = { addToCart, removeFromCart, getCartTotal };
"@
$cartContent | Out-File -FilePath cart.js -Encoding UTF8

# README.md にショッピングカート機能を追記
$readmeContent = @"
# Shopping App

## Features
- Product listing
- Shopping cart (with add/remove functionality)
- Cart total calculation

## Shopping Cart API
- `addToCart(productId, quantity)` - Add item to cart
- `removeFromCart(productId)` - Remove item from cart
- `getCartTotal()` - Get total items in cart
"@
$readmeContent | Out-File -FilePath README.md -Encoding UTF8

# 実装確認
Get-ChildItem
Get-Content README.md
Get-Content cart.js
```
**学習ポイント**: 機能実装と同時にドキュメントも更新（重要！）

### **ステップ4: 📝 ショッピングカート機能をコミット**

実装をコミット：
```powershell
# 変更状況確認
git status

# すべての変更をステージング
git add .

# コミット
git commit -m "feat: implement shopping cart functionality"

# コミット履歴確認
git log --oneline
```
**学習ポイント**: 機能実装が完了し、ブランチに記録されました

### **ステップ5: 🔄 mainブランチで他のメンバーの作業をシミュレート**

並行開発状況の準備：
```powershell
# mainブランチに切り替え
git checkout main

# ワークツリーの変化確認
Get-ChildItem
# → cart.js が見えなくなる（正常）

Get-Content README.md
# → あなたの変更も見えない（正常）
```
**学習ポイント**: あなたの変更は feature ブランチにのみ存在

### **ステップ6: 👥 他のメンバーがREADMEを編集（シミュレート）**

コンフリクト発生条件を作成：
```powershell
# payment.js ファイル作成（他のメンバーの作業）
$paymentContent = @"
function processPayment(amount, cardInfo) {
  // Simple payment processing simulation
  if (amount > 0 && cardInfo.number && cardInfo.cvv) {
    return {
      success: true,
      transactionId: 'TXN' + Date.now(),
      amount: amount
    };
  }
  return { success: false, error: 'Invalid payment information' };
}

module.exports = { processPayment };
"@
$paymentContent | Out-File -FilePath payment.js -Encoding UTF8

# README.md を独自に更新（あなたの変更と競合する内容）
$readmeContent = @"
# Shopping App

## Features
- Product listing
- Shopping cart
- Secure payment processing
- Order management

## Payment API
- `processPayment(amount, cardInfo)` - Process customer payment

## Security
All payment information is handled securely with industry standards.
"@
$readmeContent | Out-File -FilePath README.md -Encoding UTF8

# 他のメンバーの変更確認
Get-ChildItem
Get-Content README.md
Get-Content payment.js
```
**学習ポイント**: 同じREADME.mdファイルを異なる内容で編集（コンフリクトの原因）

### **ステップ7: 📝 他のメンバーの変更をコミット（シミュレート）**

競合状況の完成：
```powershell
# 変更をステージング
git add .

# 他のメンバーの変更としてコミット
git commit -m "feat: add payment processing functionality"

# コミット履歴確認
git log --oneline
```
**学習ポイント**: 同じファイルに対する競合する変更が別々のブランチに存在

### **ステップ8: 🔀 マージを試行してコンフリクトを発生させる**

コンフリクトの発生体験：
```powershell
# フィーチャーブランチをマージしようとする
git merge feature/shopping-cart

# ⚠️ コンフリクト発生！
# Auto-merging README.md
# CONFLICT (content): Merge conflict in README.md
# Automatic merge failed; fix conflicts and then commit the result.

# コンフリクト状況確認
git status
# → "You have unmerged paths"
# → "README.md: both modified"
```
**学習ポイント**: コンフリクトは正常な現象です - パニックしないでください！

### **ステップ9: 🔍 コンフリクトファイルの内容を確認**

コンフリクトマーカーの理解：
```powershell
# コンフリクトファイルの内容確認
Get-Content README.md

# コンフリクトマーカーの構造：
# <<<<<<< HEAD
# （現在のブランチ = main の内容）
# =======
# （マージしようとしているブランチ = feature/shopping-cart の内容）
# >>>>>>> feature/shopping-cart
```
**学習ポイント**: コンフリクトマーカー（<<<<<<<, =======, >>>>>>>）がGitによって自動挿入

### **ステップ10: ✏️ コンフリクトを手動で解決**

両方の変更を統合：
```powershell
# 両方の機能を含むように手動編集
$resolvedContent = @"
# Shopping App

## Features
- Product listing
- Shopping cart (with add/remove functionality)
- Secure payment processing
- Cart total calculation
- Order management

## Shopping Cart API
- `addToCart(productId, quantity)` - Add item to cart
- `removeFromCart(productId)` - Remove item from cart
- `getCartTotal()` - Get total items in cart

## Payment API
- `processPayment(amount, cardInfo)` - Process customer payment

## Security
All payment information is handled securely with industry standards.
"@
$resolvedContent | Out-File -FilePath README.md -Encoding UTF8

# 解決後の内容確認
Get-Content README.md

# ⚠️ 重要: コンフリクトマーカー（<<<<<<<, =======, >>>>>>>）がすべて削除されていることを確認
```
**学習ポイント**: 両方のチームの変更を論理的に統合し、コンフリクトマーカーを完全に削除

### **ステップ11: ✅ 解決したコンフリクトをマークしてコミット**

マージコミットの作成：
```powershell
# 解決済みファイルをステージング
git add README.md

# 他のファイルも自動でステージング（コンフリクトのないファイル）
git add cart.js

# マージコミットを作成
git commit -m "merge: resolve README conflict between cart and payment features"

# 最終状態確認
git status
# → "nothing to commit, working tree clean"

# マージ履歴確認
git log --oneline --graph
```
**学習ポイント**: コンフリクト解決後のマージコミットでマージが正式に完了

### **ステップ12: 🎯 マージ結果の確認と整理**

完了状態の確認とクリーンアップ：
```powershell
# 全ファイルの最終確認
Get-ChildItem
# → README.md, products.js, cart.js, payment.js

# 統合されたREADMEの内容確認
Get-Content README.md
# → ショッピングカートと支払い機能の両方が記載されている

# マージ履歴の確認
git log --oneline --graph --all

# 使用済みブランチの削除
git branch -d feature/shopping-cart

# 最終状態確認
git branch
# → * main のみ

git status
# → clean working tree
```
**学習ポイント**: 両方の機能が正常に統合され、プロジェクトが完全な状態になりました

## 💡 コンフリクト解決のベストプラクティス

### 【コンフリクト発生時の対応手順】
1. **冷静になる** - コンフリクトは正常な現象
2. **状況確認** - `git status` で影響範囲を把握
3. **ファイル確認** - コンフリクトマーカーを理解
4. **論理的統合** - 両方の変更を適切に組み合わせ
5. **マーカー削除** - `<<<<<<<`, `=======`, `>>>>>>>` を完全に削除
6. **テスト実行** - 統合後の動作確認
7. **コミット** - 解決結果をマージコミットとして記録

### 【コンフリクトマーカーの読み方】
```
<<<<<<< HEAD
現在のブランチ（今いるブランチ）の内容
=======  
マージしようとしているブランチの内容
>>>>>>> feature/branch-name
```

### 【解決の選択肢】
- **一方を選択**: どちらか一方の変更のみを採用
- **両方を統合**: 両方の変更を論理的に組み合わせ（推奨）
- **新しい解決**: 両方を参考に全く新しい内容を作成

## 🛡️ コンフリクト予防策

### **開発フロー改善**
- 小さな変更を頻繁にコミット
- 定期的に main ブランチから最新変更を取得（`git pull`）
- フィーチャーブランチの寿命を短くする
- 同一ファイルの編集をチーム内で調整

### **コミュニケーション**
- 大きな変更の前にチーム内で相談
- ファイルの大幅な変更は事前に共有
- コードレビューで早期に問題を発見

### **技術的対策**
- `.gitattributes` でマージ戦略を設定
- 自動フォーマッタの統一使用
- ファイル構造の明確な分離

## 🎯 学習支援コマンド

### 【コンフリクト発生時の確認】
```powershell
# 状況確認
git status
git diff

# コンフリクトファイルの確認
Get-Content README.md

# 解決後の確認
git diff --cached
```

### 【Git Dojo サポート】（tools/git-dojo から）
```powershell
cd C:\dev\stady_git\tools\git-dojo

# 現在の状況確認
node bin/git-dojo.js status

# 詳細可視化
node bin/git-dojo.js worktree

# ヒント表示
node bin/git-dojo.js hint
```

## 🎓 学習完了時の理解度

このシナリオを完了すると、以下のスキルが身につきます：

### **コンフリクトへの理解**
- **マージコンフリクト** = 同じファイルの同じ箇所を複数人が編集した結果
- **コンフリクトマーカー** = Git が自動挿入する競合箇所の印
- **解決方法** = 適切な内容に手動編集 → ステージング → コミット

### **実践的スキル**
- コンフリクトファイルの読み方
- 論理的な統合方法
- 解決後の適切な処理手順
- チームメンバーとの協調作業

### **予防と対応**
- コンフリクトを避ける開発フロー
- 発生時の冷静な対応方法
- チーム内での効果的なコミュニケーション

## 🔗 次のステップ

このシナリオを完了したら、以下の高度なトピックに挑戦：

1. **リベース** - コミット履歴の整理
2. **チェリーピック** - 特定のコミットの選択的適用
3. **スタッシュ** - 一時的な変更の保存
4. **フック** - 自動化による品質管理

## ❓ トラブルシューティング

### よくあるエラー

**解決途中でのコミット失敗**
```
error: Committing is not possible because you have unmerged files.
```
**原因**: まだ解決されていないコンフリクトがある  
**解決**: すべてのコンフリクトファイルを解決してから `git add` → `git commit`

**コンフリクトマーカーが残っている**
```
<<<<<<< HEAD が検出されました
```
**原因**: コンフリクトマーカーの削除忘れ  
**解決**: ファイルからすべてのマーカー（`<<<<<<<`, `=======`, `>>>>>>>`）を削除

### 緊急時の対応
```powershell
# マージを中止して元の状態に戻る
git merge --abort

# 現在の状況を詳しく確認
git status -v
git log --oneline --graph --all
```
