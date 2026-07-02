import { octokit } from './githubClient.js';
import { getFile } from './getFile.js';
import dotenv from 'dotenv';

dotenv.config();

const owner = process.env.GITHUB_REPO_OWNER;
const repo = process.env.GITHUB_REPO_NAME;
const branch = process.env.GITHUB_BRANCH || 'main';

/**
 * Creates or updates a file in the GitHub repository.
 * @param {string} path - Path to the file in the repository.
 * @param {string} content - Raw text content of the file.
 * @param {string} message - Commit message.
 * @returns {Promise<object>} The API response data.
 */
export async function updateFile(path, content, message) {
  if (!owner || !repo) {
    throw new Error('GITHUB_REPO_OWNER or GITHUB_REPO_NAME is missing in env configurations.');
  }

  // Get current SHA if file exists to update it, otherwise undefined (creates new file)
  const existingFile = await getFile(path, branch);
  const sha = existingFile ? existingFile.sha : undefined;

  // GitHub API expects content to be base64-encoded
  const contentBase64 = Buffer.from(content, 'utf8').toString('base64');

  const { data } = await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: contentBase64,
    sha,
    branch
  });

  return data;
}
