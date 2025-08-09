const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const simpleGit = require('simple-git');

const sandboxRoot = path.join(__dirname, '..', '.sandbox');

function getSandboxPath() {
  return sandboxRoot;
}

async function ensureSandbox() {
  if (!fs.existsSync(sandboxRoot)) {
    fs.mkdirSync(sandboxRoot, { recursive: true });
  }
  const repoPath = path.join(sandboxRoot, 'repo');
  if (!fs.existsSync(repoPath)) {
    fs.mkdirSync(repoPath, { recursive: true });
    const git = simpleGit(repoPath);
    await git.init();
    fs.writeFileSync(path.join(repoPath, 'README.md'), '# Git Dojo Sandbox\n');
    await git.add('.');
    await git.commit('chore: initial commit');
    // default branch name handling
    try {
      await git.checkoutLocalBranch('main');
    } catch (_) {
      // ignore
    }
  }
  return repoPath;
}

module.exports = { ensureSandbox, getSandboxPath };
