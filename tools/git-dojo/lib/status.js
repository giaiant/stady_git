const fs = require('fs');
const path = require('path');
const chalk = require('chalk').default;
const { currentBranch, hasUncommittedChanges, isMerged } = require('./git');
const { getSandboxPath } = require('./sandbox');
const { showWorkingTreeVisualization, showMergePreview } = require('./visualize');

function loadScenario() {
  const metaPath = path.join(getSandboxPath(), 'meta.json');
  if (!fs.existsSync(metaPath)) {
    throw new Error('Sandbox not initialized. Run: git-dojo start');
  }
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  const scenarioPath = path.join(__dirname, '..', 'scenarios', `${meta.scenarioId}.json`);
  const scenario = JSON.parse(fs.readFileSync(scenarioPath, 'utf-8'));
  return { meta, scenario };
}

async function checkStep(step) {
  const goal = step.goal;
  
  // 新しいゴール形式での確認
  if (goal && typeof goal === 'object') {
    return await checkGoal(goal);
  }
  
  // 従来の checks 形式での確認
  for (const chk of (step.checks || [])) {
    const pred = chk.predicate;
    if (pred === 'currentBranchIs') {
      const br = await currentBranch();
      if (br !== chk.args[0]) return false;
    } else if (pred === 'noUncommittedChanges') {
      const dirty = await hasUncommittedChanges();
      if (dirty) return false;
    } else if (pred === 'isMerged') {
      const [base, topic] = chk.args;
      const merged = await isMerged(base, topic);
      if (!merged) return false;
    } else {
      return false;
    }
  }
  return true;
}

async function checkGoal(goal) {
  const sandboxRepo = path.join(getSandboxPath(), 'repo');
  
  // 観察タスクは常に成功（学習促進のため）
  if (goal.type === 'observation') {
    return true;
  }
  
  // Gitコマンドの確認
  if (goal.type === 'git_command') {
    if (!goal.commands) return false;
    
    for (const cmd of goal.commands) {
      if (cmd.startsWith('git branch ')) {
        const branchName = cmd.split(' ')[2];
        try {
          const { execSync } = require('child_process');
          const result = execSync('git branch', { cwd: sandboxRepo, encoding: 'utf-8' });
          if (!result.includes(branchName)) return false;
        } catch (e) {
          return false;
        }
      } else if (cmd.startsWith('git checkout ')) {
        const branchName = cmd.split(' ')[2];
        const currentBr = await currentBranch();
        if (currentBr !== branchName) return false;
      } else if (cmd.startsWith('git add') || cmd.startsWith('git commit')) {
        // コミット系コマンドは、uncommitted changesがないことで確認
        const dirty = await hasUncommittedChanges();
        if (cmd.includes('commit') && dirty) return false;
      }
    }
    return true;
  }
  
  // ファイル操作の確認
  if (goal.type === 'file_operations') {
    if (!goal.files) return false;
    
    for (const fileOp of goal.files) {
      const filePath = path.join(sandboxRepo, fileOp.name);
      
      if (fileOp.action === 'create' || fileOp.action === 'modify') {
        if (!fs.existsSync(filePath)) return false;
        
        if (fileOp.content) {
          const content = fs.readFileSync(filePath, 'utf-8');
          if (!content.includes(fileOp.content.trim())) return false;
        }
      }
    }
    return true;
  }
  
  return false;
}

async function showStatus() {
  const { meta, scenario } = loadScenario();
  const step = scenario.steps[meta.stepIndex];
  
  // 現在のパス情報を表示
  console.log(chalk.blue('📍 実行パス確認:'));
  console.log(chalk.gray(`   現在のパス: ${process.cwd()}`));
  console.log(chalk.gray(`   このコマンドは tools/git-dojo から実行してください`));
  console.log('');
  
  // ワークツリーの可視化を先に表示
  await showWorkingTreeVisualization();
  
  // 目標表示
  const goalText = typeof step.goal === 'object' ? step.goal.description : step.goal;
  console.log(chalk.cyan(`📋 現在の目標: ${goalText}`));
  console.log('');
  
  // 目標達成のための具体的なステップを表示
  if (step.hints && step.hints.length > 0) {
    console.log(chalk.yellow('🎯 目標達成のためのステップ:'));
    step.hints.forEach((hint, index) => {
      console.log(chalk.white(`   ${index + 1}. ${hint}`));
    });
    console.log('');
  }
  
  // マージステップの場合、マージプレビューを表示
  const isMargeStep = step.checks && step.checks.some(check => check.predicate === 'isMerged');
  if (isMargeStep && !await checkStep(step)) {
    const mergeCheck = step.checks.find(check => check.predicate === 'isMerged');
    if (mergeCheck && mergeCheck.args.length >= 2) {
      const [baseBranch, targetBranch] = mergeCheck.args;
      console.log(chalk.cyan('🔀 マージ前の状態確認:'));
      await showMergePreview(baseBranch, targetBranch);
    }
  }
  
  const ok = await checkStep(step);
  
  // 観察タスクの特別処理
  if (step.goal && step.goal.type === 'observation') {
    console.log(chalk.blue('🔍 観察タスク:'));
    console.log(chalk.yellow(`   ${step.goal.description}`));
    console.log('');
    console.log(chalk.green('✔ 観察を完了したら、次のステップに進みます'));
    if (step.explanation) {
      console.log(chalk.cyan(`💡 ${step.explanation}`));
    }
    
    // 観察タスクは自動的に次に進む
    if (meta.stepIndex < scenario.steps.length - 1) {
      meta.stepIndex += 1;
      fs.writeFileSync(path.join(getSandboxPath(), 'meta.json'), JSON.stringify(meta, null, 2));
      console.log('');
      console.log(chalk.yellow('📝 次のステップに進みました！'));
      console.log(chalk.gray('   もう一度 node bin/git-dojo.js status を実行してください'));
    }
    console.log('');
    return;
  }
  
  if (ok) {
    console.log(chalk.green('✔ 達成しました！'));
    if (step.explanation) {
      console.log(chalk.cyan(`💡 ${step.explanation}`));
    }
    console.log('');
    
    if (meta.stepIndex < scenario.steps.length - 1) {
      meta.stepIndex += 1;
      fs.writeFileSync(path.join(getSandboxPath(), 'meta.json'), JSON.stringify(meta, null, 2));
      console.log(chalk.yellow(`📝 次の目標: ${scenario.steps[meta.stepIndex].goal}`));
      
      // 次のステップのヒントも表示
      const nextStep = scenario.steps[meta.stepIndex];
      if (nextStep.hints && nextStep.hints.length > 0) {
        console.log(chalk.gray('💡 次のヒント:'));
        nextStep.hints.forEach(hint => {
          console.log(chalk.gray(`  • ${hint}`));
        });
      }
    } else {
      console.log(chalk.green('🎉 シナリオ完了です。お疲れさまでした！'));
      console.log(chalk.cyan('📚 学習のまとめ:'));
      console.log('  • ワークツリーは実際のファイルが存在する作業領域です');
      console.log('  • ブランチはコミット履歴の分岐ポイントです');
      console.log('  • ブランチを切り替えると、ワークツリーの内容が変わります');
      console.log('  • 変更 → ステージング → コミット の流れでブランチに保存されます');
    }
  } else {
    console.log(chalk.red('❌ まだ未達成です。以下を確認してください：'));
    console.log('');
    
    // 具体的な未達成理由を表示
    for (const chk of (step.checks || [])) {
      const result = await checkSingleCondition(chk);
      const icon = result ? '✅' : '❌';
      const message = getCheckMessage(chk, result);
      console.log(`  ${icon} ${message}`);
    }
    
    console.log('');
    console.log(chalk.cyan('🚀 今すぐやること:'));
    console.log(chalk.blue('   1. 新しいターミナルを開くか、以下のパスに移動:'));
    console.log(chalk.yellow(`      cd "${require('./sandbox').getSandboxPath()}/repo"`));
    console.log(chalk.blue('   2. 以下のコマンドを順番に実行:'));
    if (step.hints && step.hints.length > 0) {
      step.hints.forEach((hint, index) => {
        console.log(chalk.yellow(`      ${index + 1}. ${hint}`));
      });
    }
    console.log(chalk.blue('   3. このターミナルに戻って進捗確認:'));
    console.log(chalk.yellow('      node bin/git-dojo.js status'));
    console.log('');
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.yellow('💡 追加ヘルプ:'));
    console.log(chalk.gray('   詳しいヒント → node bin/git-dojo.js hint'));
    console.log(chalk.gray('   詳細状態確認 → node bin/git-dojo.js worktree'));
  }
  console.log('');
}

async function checkSingleCondition(check) {
  const pred = check.predicate;
  if (pred === 'currentBranchIs') {
    const br = await currentBranch();
    return br === check.args[0];
  } else if (pred === 'noUncommittedChanges') {
    const dirty = await hasUncommittedChanges();
    return !dirty;
  } else if (pred === 'isMerged') {
    const [base, topic] = check.args;
    return await isMerged(base, topic);
  }
  return false;
}

function getCheckMessage(check, result) {
  const pred = check.predicate;
  if (pred === 'currentBranchIs') {
    return result 
      ? `ブランチ "${check.args[0]}" に切り替え済み`
      : `ブランチ "${check.args[0]}" に切り替えが必要です`;
  } else if (pred === 'noUncommittedChanges') {
    return result 
      ? '全ての変更がコミット済みです'
      : '未コミットの変更があります（git add と git commit が必要）';
  } else if (pred === 'isMerged') {
    const [base, topic] = check.args;
    return result 
      ? `"${topic}" が "${base}" にマージ済みです`
      : `"${topic}" を "${base}" にマージが必要です`;
  }
  return '条件チェック';
}

module.exports = { showStatus };
