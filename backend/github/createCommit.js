import { octokit } from './githubClient.js';
import dotenv from 'dotenv';

dotenv.config();

const owner = process.env.GITHUB_REPO_OWNER;
const repo = process.env.GITHUB_REPO_NAME;
const branch = process.env.GITHUB_BRANCH || 'main';

/**
 * Creates a single commit containing multiple files.
 * @param {Array<{path: string, content: string}>} files - Array of files with their path and raw string content.
 * @param {string} message - Commit message.
 * @returns {Promise<object>} The updated reference data.
 */
export async function createCommit(files, message) {
  if (!owner || !repo) {
    throw new Error('GITHUB_REPO_OWNER or GITHUB_REPO_NAME is missing in env configurations.');
  }

  if (!files || files.length === 0) {
    throw new Error('No files provided for commit.');
  }

  const refPath = `heads/${branch}`;

  // 1. Get the latest commit SHA of the branch
  const { data: refData } = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: refPath
  });
  const latestCommitSha = refData.object.sha;

  // 2. Get the tree SHA of the latest commit
  const { data: commitData } = await octokit.rest.git.getCommit({
    owner,
    repo,
    commit_sha: latestCommitSha
  });
  const baseTreeSha = commitData.tree.sha;

  // 3. Create blobs and format tree items
  const treeItems = [];
  for (const file of files) {
    const { data: blobData } = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: Buffer.from(file.content, 'utf8').toString('base64'),
      encoding: 'base64'
    });
    
    treeItems.push({
      path: file.path,
      mode: '100644', // 100644 is normal file, 100755 is executable, 040000 is subdirectory
      type: 'blob',
      sha: blobData.sha
    });
  }

  // 4. Create the new tree referencing the blobs, using baseTreeSha to keep existing files
  const { data: newTreeData } = await octokit.rest.git.createTree({
    owner,
    repo,
    tree: treeItems,
    base_tree: baseTreeSha
  });

  // 5. Create the new commit pointing to the new tree and referencing the parent commit
  const { data: newCommitData } = await octokit.rest.git.createCommit({
    owner,
    repo,
    message,
    tree: newTreeData.sha,
    parents: [latestCommitSha]
  });

  // 6. Update the reference branch head pointer to the new commit SHA
  const { data: updatedRefData } = await octokit.rest.git.updateRef({
    owner,
    repo,
    ref: refPath,
    sha: newCommitData.sha,
    force: false // Set to false to avoid overwriting newer commits in race conditions
  });

  return updatedRefData;
}
