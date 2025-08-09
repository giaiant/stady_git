const fs = require('fs');
const path = require('path');
const chalk = require('chalk').default;
const { currentBranch, hasUncommittedChanges, isMerged } = require('./git');
const { getSandboxPath } = require('./sandbox');

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

async function showStatus() {
  const { meta, scenario } = loadScenario();
  const step = scenario.steps[meta.stepIndex];
  console.log(chalk.cyan(`現在の目標: ${step.goal}`));
  const ok = await checkStep(step);
  if (ok) {
    console.log(chalk.green('✔ 達成しました！'));
    if (meta.stepIndex < scenario.steps.length - 1) {
      meta.stepIndex += 1;
      fs.writeFileSync(path.join(getSandboxPath(), 'meta.json'), JSON.stringify(meta, null, 2));
      console.log(chalk.yellow(`次の目標: ${scenario.steps[meta.stepIndex].goal}`));
    } else {
      console.log(chalk.green('🎉 シナリオ完了です。お疲れさまでした！'));
    }
  } else {
    console.log(chalk.red('まだ未達成です。ヒントを参照してください。'));
  }
}

module.exports = { showStatus };
