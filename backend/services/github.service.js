import { createCommit } from '../github/createCommit.js';
import { formatDadosLoja, formatDbJson, updateScriptJsProducts } from '../utils/formatter.js';
import logger from './logger.service.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Syncs the entire store data snapshot to GitHub by committing dados_loja.js, db.json and script.js.
 * @param {object} snapshot - The updated database snapshot.
 * @param {string} commitMessage - The commit message.
 * @returns {Promise<object>} Object containing Git response and updated script content.
 */
export async function syncSnapshotToGithub(snapshot, commitMessage) {
  logger.info(`Starting Git commit for files: [js/dados_loja.js, data/db.json, js/script.js]`);
  
  let updatedScriptContent = '';
  try {
    const localScriptPath = path.join(__dirname, '..', '..', 'js', 'script.js');
    if (!fs.existsSync(localScriptPath)) {
      throw new Error(`File not found: ${localScriptPath}`);
    }
    const currentScriptContent = fs.readFileSync(localScriptPath, 'utf8');
    updatedScriptContent = updateScriptJsProducts(currentScriptContent, snapshot.produtos);
  } catch (err) {
    logger.error('Failed to read or update js/script.js locally', err);
    throw err;
  }

  const files = [
    {
      path: 'js/dados_loja.js',
      content: formatDadosLoja(snapshot)
    },
    {
      path: 'data/db.json',
      content: formatDbJson(snapshot)
    },
    {
      path: 'js/script.js',
      content: updatedScriptContent
    }
  ];
  
  try {
    const startTime = Date.now();
    const result = await createCommit(files, commitMessage);
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    logger.info(`GitHub sync completed successfully in ${duration}s. Ref: ${result.ref}, Commit SHA: ${result.object.sha}`);
    return {
      result,
      updatedScriptContent
    };
  } catch (err) {
    logger.error(`Error syncing snapshot to GitHub`, err);
    throw err;
  }
}
