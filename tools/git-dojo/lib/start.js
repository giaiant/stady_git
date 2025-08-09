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
  console.log(chalk.cyan(`Scenario '${scenarioId}' loaded.`));
  const scenario = JSON.parse(fs.readFileSync(scenarioPath, 'utf-8'));
  console.log(chalk.yellow(`目標: ${scenario.steps[0].goal}`));
  console.log(chalk.gray(`サンドボックス: ${path.join(getSandboxPath(), 'repo')}`));
}

module.exports = { startScenario };
