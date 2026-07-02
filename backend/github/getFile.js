import { octokit } from './githubClient.js';
import dotenv from 'dotenv';

dotenv.config();

const owner = process.env.GITHUB_REPO_OWNER;
const repo = process.env.GITHUB_REPO_NAME;

/**
 * Gets a file from the GitHub repository.
 * @param {string} path - The path to the file in the repository.
 * @param {string} ref - The branch or commit ref (defaults to GITHUB_BRANCH or 'main').
 * @returns {Promise<object|null>} The file data or null if not found.
 */
export async function getFile(path, ref = process.env.GITHUB_BRANCH || 'main') {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref
    });
    return data;
  } catch (error) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
}
