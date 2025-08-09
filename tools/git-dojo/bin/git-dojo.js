#!/usr/bin/env node

const { Command } = require('commander');
const path = require('path');
const chalk = require('chalk').default;
const { ensureSandbox, getSandboxPath } = require('../lib/sandbox');
const { showStatus } = require('../lib/status');
const { showHint } = require('../lib/hint');
const { showDiagram } = require('../lib/diagram');
const { startScenario } = require('../lib/start');

const program = new Command();
program
  .name('git-dojo')
  .description('Interactive Git learning CLI (role-play scenarios)')
  .version('0.1.0');

program
  .command('start')
  .description('Start the learning sandbox and scenario')
  .option('-s, --scenario <id>', 'Scenario id', 'branch-basics')
  .action(async (opts) => {
    try {
      await ensureSandbox();
      await startScenario(opts.scenario);
      console.log(chalk.green('Sandbox ready. Follow the trainer instructions.'));
    } catch (e) {
      console.error(chalk.red('Failed to start scenario:'), e.message);
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Check current progress and repository status')
  .action(async () => {
    try {
      await ensureSandbox();
      await showStatus();
    } catch (e) {
      console.error(chalk.red('Failed to check status:'), e.message);
      process.exit(1);
    }
  });

program
  .command('hint')
  .description('Show contextual hint for the current step')
  .action(async () => {
    try {
      await ensureSandbox();
      await showHint();
    } catch (e) {
      console.error(chalk.red('Failed to show hint:'), e.message);
      process.exit(1);
    }
  });

program
  .command('diagram')
  .description('Show git graph diagram of current scenario repo')
  .action(async () => {
    try {
      await ensureSandbox();
      await showDiagram();
    } catch (e) {
      console.error(chalk.red('Failed to show diagram:'), e.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
