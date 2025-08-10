const chalk = require('chalk').default;
const { 
  getWorkingTreeStatus, 
  listAllFiles, 
  getAllBranches, 
  getCommitsForBranch, 
  getFilesInBranch, 
  compareBranches,
  getMergePreview 
} = require('./git');

async function showWorkingTreeVisualization() {
  const status = await getWorkingTreeStatus();
  const allFiles = await listAllFiles();
  const branches = await getAllBranches();
  
  console.log(chalk.cyan('📁 ワークツリーの現在状態:'));
  console.log(chalk.yellow(`🌿 現在のブランチ: ${status.currentBranch}`));
  console.log(chalk.gray(`📂 監視中のディレクトリ: ${require('./sandbox').getSandboxPath()}/repo`));
  console.log('');
  
  // 全ブランチの概要表示
  await showAllBranchesOverview();
  
  // 現在のワークツリーのファイル状態
  console.log(chalk.cyan(`📄 現在のワークツリー（${status.currentBranch}ブランチ）のファイル状態:`));
  
  if (allFiles.length === 0) {
    console.log(chalk.gray('  （ファイルがありません）'));
  } else {
    for (const file of allFiles) {
      let statusIcon = '✅';
      let statusText = 'コミット済み';
      let color = chalk.green;
      
      // 状態に応じてアイコンと色を変更
      if (status.not_added.includes(file)) {
        statusIcon = '❓';
        statusText = '未追跡';
        color = chalk.red;
      } else if (status.modified.includes(file)) {
        statusIcon = '📝';
        statusText = '変更済み';
        color = chalk.yellow;
      } else if (status.staged.includes(file)) {
        statusIcon = '📋';
        statusText = 'ステージ済み';
        color = chalk.blue;
      } else if (status.created.includes(file)) {
        statusIcon = '🆕';
        statusText = '新規作成';
        color = chalk.green;
      } else if (status.deleted.includes(file)) {
        statusIcon = '🗑️';
        statusText = '削除済み';
        color = chalk.red;
      }
      
      console.log(`  ${statusIcon} ${color(file)} (${statusText})`);
    }
  }
  
  console.log('');
  
  // ワークツリーとブランチの関係説明
  console.log(chalk.cyan('🔄 ワークツリーとブランチの関係:'));
  console.log(`  • ワークツリーは現在 "${status.currentBranch}" ブランチの内容を表示しています`);
  console.log(`  • ファイルを編集すると、ワークツリーが変更されます`);
  console.log(`  • git add でステージングエリアに追加されます`);
  console.log(`  • git commit で "${status.currentBranch}" ブランチに保存されます`);
  console.log('');
}

async function showAllBranchesOverview() {
  const branches = await getAllBranches();
  
  console.log(chalk.cyan('🌳 全ブランチの概要:'));
  
  for (const branch of branches.all) {
    const isCurrent = branch === branches.current;
    const icon = isCurrent ? '👉' : '  ';
    const color = isCurrent ? chalk.yellow : chalk.gray;
    
    // 各ブランチのファイル一覧とコミット履歴を取得
    const files = await getFilesInBranch(branch);
    const commits = await getCommitsForBranch(branch, 3);
    
    console.log(`${icon} ${color(branch)} ${isCurrent ? '(現在のブランチ)' : ''}`);
    
    // ファイル一覧
    if (files.length > 0) {
      console.log(chalk.gray(`     📄 ファイル: ${files.join(', ')}`));
    } else {
      console.log(chalk.gray('     📄 ファイル: なし'));
    }
    
    // 最新コミット
    if (commits.length > 0) {
      const latestCommit = commits[0];
      console.log(chalk.gray(`     💾 最新: ${latestCommit.hash} ${latestCommit.message}`));
    }
    
    console.log('');
  }
}

async function showMergePreview(baseBranch, targetBranch) {
  console.log(chalk.cyan(`🔀 マージプレビュー: ${targetBranch} → ${baseBranch}`));
  
  const preview = await getMergePreview(baseBranch, targetBranch);
  
  if (!preview) {
    console.log(chalk.red('マージプレビューを取得できませんでした'));
    return;
  }
  
  console.log('');
  console.log(chalk.yellow('📋 マージされる内容:'));
  
  if (preview.changes.length === 0) {
    console.log(chalk.gray('  変更はありません（既にマージ済みまたは同じ内容）'));
  } else {
    for (const change of preview.changes) {
      let icon = '📝';
      let color = chalk.yellow;
      
      switch (change.status) {
        case 'A':
          icon = '🆕';
          color = chalk.green;
          break;
        case 'D':
          icon = '🗑️';
          color = chalk.red;
          break;
        case 'M':
          icon = '📝';
          color = chalk.yellow;
          break;
      }
      
      console.log(`  ${icon} ${color(change.file)} (${change.description})`);
    }
  }
  
  console.log('');
  
  if (preview.targetCommits.length > 0) {
    console.log(chalk.cyan(`📦 ${targetBranch} の独自コミット:`));
    for (const commit of preview.targetCommits) {
      console.log(chalk.gray(`  • ${commit}`));
    }
    console.log('');
  }
  
  console.log(chalk.blue('💡 マージ後の結果:'));
  console.log(`  • ${targetBranch} の変更が ${baseBranch} に統合されます`);
  console.log(`  • ${baseBranch} ブランチが最新状態になります`);
  console.log(`  • ワークツリーが統合後の内容に更新されます`);
  console.log('');
}

async function showBranchSwitchPreview(targetBranch) {
  console.log(chalk.cyan(`🔄 "${targetBranch}" ブランチに切り替えた場合の変化:`));
  console.log('  • ワークツリーの内容が変わります');
  console.log(`  • "${targetBranch}" ブランチの最新コミットの内容がワークツリーに反映されます`);
  console.log('  • 編集中のファイルは一時的に保存される必要があります');
  console.log('');
}

function explainCurrentOperation(operation, context = {}) {
  console.log(chalk.cyan('💡 現在の操作の解説:'));
  
  switch (operation) {
    case 'branch_create':
      console.log('  🌿 ブランチ作成:');
      console.log(`    • 新しいブランチ "${context.branchName}" を作成します`);
      console.log('    • 現在のコミットから分岐する新しい開発ラインです');
      console.log('    • まだワークツリーは変わりません');
      break;
      
    case 'branch_switch':
      console.log('  🔄 ブランチ切り替え:');
      console.log(`    • ワークツリーが "${context.targetBranch}" ブランチの内容に変わります`);
      console.log('    • HEADが移動し、現在のブランチが変わります');
      console.log('    • ファイルの内容が物理的に変更されます');
      break;
      
    case 'file_edit':
      console.log('  📝 ファイル編集:');
      console.log('    • ワークツリーのファイルが変更されました');
      console.log('    • まだコミットには反映されていません');
      console.log('    • git add でステージングエリアに追加できます');
      break;
      
    case 'git_add':
      console.log('  📋 ステージング:');
      console.log('    • 変更をステージングエリアに追加しました');
      console.log('    • 次のコミットに含める準備ができました');
      console.log('    • まだブランチには反映されていません');
      break;
      
    case 'git_commit':
      console.log('  💾 コミット:');
      console.log('    • ステージングエリアの内容を現在のブランチに保存しました');
      console.log('    • 新しいコミットが作成され、ブランチが前進しました');
      console.log('    • ワークツリーとブランチが同期しました');
      break;
      
    case 'git_merge':
      console.log('  🔀 マージ:');
      console.log(`    • "${context.sourceBranch}" を "${context.targetBranch}" に統合しました`);
      console.log('    • 両方のブランチの変更が組み合わさりました');
      console.log('    • Fast-forwardまたはマージコミットが作成されました');
      break;
  }
  console.log('');
}

module.exports = { 
  showWorkingTreeVisualization, 
  showAllBranchesOverview,
  showMergePreview,
  showBranchSwitchPreview, 
  explainCurrentOperation 
};
