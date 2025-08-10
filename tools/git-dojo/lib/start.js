const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const chalk = require('chalk').default;
const { getSandboxPath, ensureSandbox } = require('./sandbox');

async function startScenario(scenarioId) {
  const scenarioPath = path.join(__dirname, '..', 'scenarios', `${scenarioId}.json`);
  if (!fs.existsSync(scenarioPath)) {
    throw new Error(`Scenario not found: ${scenarioId}`);
  }
  
  // サンドボックスの初期化
  console.log(chalk.blue('🔧 サンドボックスを初期化中...'));
  const sandboxRepo = await ensureSandbox();
  console.log(chalk.green('✅ サンドボックス初期化完了'));
  
  const scenario = JSON.parse(fs.readFileSync(scenarioPath, 'utf-8'));
  
  // 初期セットアップの実行
  if (scenario.initial_setup && scenario.initial_setup.commands) {
    console.log(chalk.blue('🔧 初期セットアップを実行中...'));
    
    for (const command of scenario.initial_setup.commands) {
      try {
        execSync(command, { 
          cwd: sandboxRepo, 
          stdio: 'pipe',
          shell: 'powershell.exe',
          encoding: 'utf8'
        });
        console.log(chalk.gray(`   ✓ ${command}`));
      } catch (error) {
        console.log(chalk.red(`   ❌ エラー: ${command}`));
        console.log(chalk.red(`      ${error.message}`));
        throw new Error(`初期セットアップが失敗しました: ${command}`);
      }
    }
    console.log(chalk.green('✅ 初期セットアップ完了'));
    console.log('');
  }
  
  const metaPath = path.join(getSandboxPath(), 'meta.json');
  fs.writeFileSync(metaPath, JSON.stringify({ scenarioId, startedAt: new Date().toISOString(), stepIndex: 0 }, null, 2));
  console.log(chalk.cyan(`✅ シナリオ '${scenarioId}' をロードしました`));
  
  // 最初の目標表示
  const goalText = typeof scenario.steps[0].goal === 'object' ? scenario.steps[0].goal.description : scenario.steps[0].goal;
  console.log('');
  console.log(chalk.yellow(`🎯 最初の目標: ${goalText}`));
  
  // 作成されたファイルの確認
  console.log('');
  console.log(chalk.blue('📁 作成されたファイル:'));
  try {
    const files = fs.readdirSync(sandboxRepo);
    files.forEach(file => {
      if (file !== '.git') {
        console.log(chalk.gray(`   • ${file}`));
      }
    });
  } catch (e) {
    console.log(chalk.gray('   ファイル一覧の取得に失敗しました'));
  }
  
  console.log('');
  console.log(chalk.blue('📍 実行パスの案内:'));
  console.log(chalk.gray(`   現在のパス: ${process.cwd()}`));
  console.log(chalk.gray(`   サンドボックス: ${sandboxRepo}`));
  console.log('');
  console.log(chalk.cyan('📋 次にやること:'));
  console.log(chalk.white('   1. 新しいターミナルを開く、または以下でサンドボックスに移動:'));
  console.log(chalk.yellow(`      cd "${sandboxRepo}"`));
  console.log(chalk.white('   2. そこでGitコマンドを実行'));
  console.log(chalk.white('   3. このターミナルに戻って進捗確認:'));
  console.log(chalk.yellow(`      node bin/git-dojo.js status`));
  console.log('');
}

module.exports = { startScenario };
