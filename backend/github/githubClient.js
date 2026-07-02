import { Octokit } from 'octokit';
import dotenv from 'dotenv';

dotenv.config();

const githubToken = process.env.GITHUB_TOKEN;

if (!githubToken || githubToken === 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN') {
  console.warn('WARNING: GITHUB_TOKEN is not configured in backend/.env');
}

export const octokit = new Octokit({
  auth: githubToken
});
