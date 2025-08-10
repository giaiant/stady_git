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

async function getWorkingTreeStatus() {
  const git = getRepo();
  const status = await git.status();
  const branch = await currentBranch();
  
  return {
    currentBranch: branch,
    files: status.files,
    staged: status.staged,
    modified: status.modified,
    created: status.created,
    deleted: status.deleted,
    not_added: status.not_added,
    conflicted: status.conflicted
  };
}

async function listAllFiles() {
  const fs = require('fs');
  const path = require('path');
  const repoPath = path.join(require('./sandbox').getSandboxPath(), 'repo');
  
  function readDirRecursive(dir, basePath = '') {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      if (item === '.git') continue;
      const fullPath = path.join(dir, item);
      const relativePath = basePath ? path.join(basePath, item) : item;
      
      if (fs.statSync(fullPath).isDirectory()) {
        files.push(...readDirRecursive(fullPath, relativePath));
      } else {
        files.push(relativePath);
      }
    }
    return files;
  }
  
  try {
    return readDirRecursive(repoPath);
  } catch (e) {
    return [];
  }
}

module.exports = { getRepo, currentBranch, hasUncommittedChanges, logOneline, isMerged, getWorkingTreeStatus, listAllFiles };
