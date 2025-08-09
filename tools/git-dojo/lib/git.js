const path = require('path');
const simpleGit = require('simple-git');
const { getSandboxPath } = require('./sandbox');

function getRepo() {
  const repoPath = path.join(getSandboxPath(), 'repo');
  return simpleGit(repoPath);
}

async function currentBranch() {
  const git = getRepo();
  const b = await git.branch();
  return b.current;
}

async function hasUncommittedChanges() {
  const git = getRepo();
  const status = await git.status();
  return status.files.length > 0;
}

async function logOneline(limit = 20) {
  const git = getRepo();
  const logs = await git.log({ n: limit });
  return logs.all.map(l => `${l.hash.substring(0,7)} ${l.message}`);
}

async function isMerged(base, topic) {
  const git = getRepo();
  const res = await git.raw(['branch', '--merged', base]);
  return res.split(/\r?\n/).map(s => s.trim().replace(/^\*\s*/, '')).includes(topic);
}

module.exports = { getRepo, currentBranch, hasUncommittedChanges, logOneline, isMerged };
