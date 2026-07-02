import { getFullDbSnapshot } from './supabase.service.js';
import { syncSnapshotToGithub } from './github.service.js';
import { trackDeploy } from './deploy.service.js';
import queue from '../utils/queue.js';
import logger from './logger.service.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { formatDadosLoja, formatDbJson } from '../utils/formatter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Main service to orchestrate the database and GitHub sync.
 * Queues the task to ensure single-threaded execution of commits.
 * @param {string} commitMessage - The Git commit message.
 * @param {string} administrator - Name of the admin performing the change.
 * @param {string} entityDetails - Description of what was changed (for logging).
 * @returns {Promise<object>} Sync execution results.
 */
export async function triggerSync(commitMessage, administrator = 'Admin', entityDetails = 'Data change') {
  return queue.enqueue(async () => {
    const startTime = Date.now();
    logger.info(`Sync task triggered by ${administrator}: ${entityDetails}`);
    
    try {
      // 1. Fetch updated data from Supabase
      logger.info('Fetching latest store data from Supabase...');
      const snapshot = await getFullDbSnapshot();
      
      // 2. Commit and push to Git repository
      const gitResult = await syncSnapshotToGithub(snapshot, commitMessage);
      const commitSha = gitResult.result.object.sha;
      
      // 2.1 Update local filesystem files (js/dados_loja.js, data/db.json and js/script.js)
      try {
        const localDadosLojaPath = path.join(__dirname, '..', '..', 'js', 'dados_loja.js');
        const localDbPath = path.join(__dirname, '..', '..', 'data', 'db.json');
        const localScriptPath = path.join(__dirname, '..', '..', 'js', 'script.js');
        
        fs.writeFileSync(localDadosLojaPath, formatDadosLoja(snapshot), 'utf8');
        fs.writeFileSync(localDbPath, formatDbJson(snapshot), 'utf8');
        fs.writeFileSync(localScriptPath, gitResult.updatedScriptContent, 'utf8');
        logger.info('Arquivos locais atualizados com sucesso (js/dados_loja.js, data/db.json e js/script.js).');
      } catch (localWriteErr) {
        logger.warn(`Não foi possível escrever os arquivos localmente: ${localWriteErr.message}`);
      }
      
      // 3. Track Netlify deploy in the background (non-blocking for HTTP response)
      trackDeploy(commitSha).catch(err => {
        logger.error(`Netlify deployment tracking crashed for commit ${commitSha}`, err);
      });
      
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      logger.info(`Sync task finalized successfully in ${duration}s. Commit SHA: ${commitSha}`);
      
      return {
        success: true,
        commitSha,
        duration,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      logger.error(`Sync task aborted due to error. Changes preserved.`, err);
      throw err;
    }
  });
}

export default {
  triggerSync
};
