const path = require('path');
const fs = require('fs');
const chalk = require('chalk').default;
const { getSandboxPath } = require('./sandbox');

async function startScenario(scenarioId) {
  const scenarioPath = path.join(__dirname, '..', 'scenarios', `${scenarioId}.json`);
  if (!fs.existsSync(scenarioPath)) {
    throw new Error(`Scenario not found: ${scenarioId}`);
  }
  const metaPath = path.join(getSandboxPath(), 'meta.json');
  fs.writeFileSync(metaPath, JSON.stringify({ scenarioId, startedAt: new Date().toISOString(), stepIndex: 0 }, null, 2));
  console.log(chalk.cyan(`✅ シナリオ '${scenarioId}' をロードしました`));
  const scenario = JSON.parse(fs.readFileSync(scenarioPath, 'utf-8'));
  console.log('');
  console.log(chalk.yellow(`🎯 最初の目標: ${scenario.steps[0].goal}`));
  console.log('');
  console.log(chalk.blue('📍 実行パスの案内:'));
  console.log(chalk.gray(`   現在のパス: ${process.cwd()}`));
  console.log(chalk.gray(`   サンドボックス: ${path.join(getSandboxPath(), 'repo')}`));
  console.log('');
  console.log(chalk.cyan('📋 次にやること:'));
  console.log(chalk.white('   1. 新しいターミナルを開く、または以下でサンドボックスに移動:'));
  console.log(chalk.yellow(`      cd "${path.join(getSandboxPath(), 'repo')}"`));
  console.log(chalk.white('   2. そこでGitコマンドを実行'));
  console.log(chalk.white('   3. このターミナルに戻って進捗確認:'));
  console.log(chalk.yellow(`      node bin/git-dojo.js status`));
  console.log('');
}

module.exports = { startScenario };
