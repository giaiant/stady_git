const fs = require('fs');
const path = require('path');
const chalk = require('chalk').default;
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

async function showHint() {
  const { meta, scenario } = loadScenario();
  const step = scenario.steps[meta.stepIndex];
  console.log(chalk.yellow('ヒント:'));
  for (const h of (step.hints || [])) {
    console.log('- ' + h);
  }
  if (step.explain) {
    console.log(chalk.cyan('解説: ' + step.explain));
  }
}

module.exports = { showHint };
