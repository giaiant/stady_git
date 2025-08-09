const { getRepo } = require('./git');
const chalk = require('chalk').default;

async function showDiagram() {
  const git = getRepo();
  const graph = await git.raw(['log', '--oneline', '--decorate', '--graph', '--all', '--date-order']);
  console.log(chalk.gray(graph));
}

module.exports = { showDiagram };
