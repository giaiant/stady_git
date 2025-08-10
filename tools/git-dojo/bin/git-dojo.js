#!/usr/bin/env node

const { Command } = require('commander');
const path = require('path');
const chalk = require('chalk').default;
const { ensureSandbox, getSandboxPath } = require('../lib/sandbox');
const { showStatus } = require('../lib/status');
const { showHint } = require('../lib/hint');
const { showDiagram } = require('../lib/diagram');
const { startScenario } = require('../lib/start');
const { showWorkingTreeVisualization, showMergePreview, explainCurrentOperation } = require('../lib/visualize');

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

program
  .command('worktree')
  .description('Show detailed working tree visualization and explanation')
  .action(async () => {
    try {
      await ensureSandbox();
      await showWorkingTreeVisualization();
    } catch (e) {
      console.error(chalk.red('Failed to show working tree:'), e.message);
      process.exit(1);
    }
  });

program
  .command('explain')
  .description('Explain the current operation with context')
  .option('-o, --operation <type>', 'Operation type to explain')
  .action(async (opts) => {
    try {
      await ensureSandbox();
      explainCurrentOperation(opts.operation || 'general');
    } catch (e) {
      console.error(chalk.red('Failed to explain:'), e.message);
      process.exit(1);
    }
  });

program
  .command('merge-preview')
  .description('Show what will happen when merging branches')
  .option('-b, --base <branch>', 'Base branch (default: main)')
  .option('-t, --target <branch>', 'Target branch to merge')
  .action(async (opts) => {
    try {
      await ensureSandbox();
      const baseBranch = opts.base || 'main';
      const targetBranch = opts.target;
      
      if (!targetBranch) {
        console.error(chalk.red('Error: Target branch is required. Use -t <branch>'));
        process.exit(1);
      }
      
      await showMergePreview(baseBranch, targetBranch);
    } catch (e) {
      console.error(chalk.red('Failed to show merge preview:'), e.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
