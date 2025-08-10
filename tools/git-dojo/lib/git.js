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

async function getAllBranches() {
  const git = getRepo();
  const branches = await git.branch();
  return {
    current: branches.current,
    all: branches.all.map(branch => branch.replace(/^\*\s*/, '').trim())
  };
}

async function getCommitsForBranch(branchName, limit = 10) {
  const git = getRepo();
  try {
    const logs = await git.log({ n: limit, from: branchName });
    return logs.all.map(commit => ({
      hash: commit.hash.substring(0, 7),
      message: commit.message,
      author: commit.author_name,
      date: commit.date
    }));
  } catch (e) {
    return [];
  }
}

async function getFilesInBranch(branchName) {
  const git = getRepo();
  try {
    // 一時的にブランチを切り替えずに、そのブランチのファイル一覧を取得
    const result = await git.raw(['ls-tree', '-r', '--name-only', branchName]);
    return result.split('\n').filter(file => file.trim() !== '');
  } catch (e) {
    return [];
  }
}

async function compareBranches(baseBranch, targetBranch) {
  const git = getRepo();
  try {
    // ブランチ間の差分を取得
    const diff = await git.diff([baseBranch, targetBranch, '--name-status']);
    const changes = [];
    
    if (diff) {
      const lines = diff.split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {
        const [status, file] = line.split('\t');
        changes.push({
          status: status,
          file: file,
          description: getChangeDescription(status)
        });
      }
    }
    
    return changes;
  } catch (e) {
    return [];
  }
}

function getChangeDescription(status) {
  switch (status) {
    case 'A': return '新規追加';
    case 'M': return '変更';
    case 'D': return '削除';
    case 'R': return '名前変更';
    case 'C': return 'コピー';
    default: return status;
  }
}

async function getMergePreview(baseBranch, targetBranch) {
  const git = getRepo();
  try {
    // マージベースを取得
    const mergeBase = await git.raw(['merge-base', baseBranch, targetBranch]);
    const baseCommit = mergeBase.trim();
    
    // 各ブランチの独自コミットを取得
    const baseCommits = await git.raw(['log', '--oneline', `${baseCommit}..${baseBranch}`]);
    const targetCommits = await git.raw(['log', '--oneline', `${baseCommit}..${targetBranch}`]);
    
    // 変更されるファイルを取得
    const changes = await compareBranches(baseBranch, targetBranch);
    
    return {
      baseCommit: baseCommit.substring(0, 7),
      baseCommits: baseCommits ? baseCommits.split('\n').filter(c => c.trim()) : [],
      targetCommits: targetCommits ? targetCommits.split('\n').filter(c => c.trim()) : [],
      changes: changes
    };
  } catch (e) {
    return null;
  }
}

module.exports = { 
  getRepo, 
  currentBranch, 
  hasUncommittedChanges, 
  logOneline, 
  isMerged, 
  getWorkingTreeStatus, 
  listAllFiles,
  getAllBranches,
  getCommitsForBranch,
  getFilesInBranch,
  compareBranches,
  getMergePreview
};
