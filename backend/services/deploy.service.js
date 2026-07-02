import logger from './logger.service.js';
import dotenv from 'dotenv';

dotenv.config();

const netlifyToken = process.env.NETLIFY_AUTH_TOKEN;
const siteId = process.env.NETLIFY_SITE_ID;

/**
 * Monitors and tracks the Netlify deploy status for the specified commit.
 * @param {string} commitSha - The commit SHA that triggered the build.
 * @returns {Promise<boolean>} True if deployment succeeded, false otherwise.
 */
export async function trackDeploy(commitSha) {
  if (!netlifyToken || !siteId || netlifyToken === 'YOUR_NETLIFY_AUTH_TOKEN' || siteId === 'YOUR_NETLIFY_SITE_ID') {
    logger.info('Netlify deploy monitoring skipped (NETLIFY_AUTH_TOKEN or NETLIFY_SITE_ID not configured). Netlify will deploy automatically from Git push.');
    return true;
  }

  logger.info(`Checking Netlify deploy status for commit: ${commitSha}`);
  
  const url = `https://api.netlify.com/api/v1/sites/${siteId}/deploys`;
  const headers = {
    'Authorization': `Bearer ${netlifyToken}`,
    'Content-Type': 'application/json'
  };

  let deployId = null;
  let deployStartedLogged = false;
  const pollInterval = 10000; // 10 seconds
  const maxAttempts = 30; // 5 minutes max

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) {
        if ([401, 403, 404].includes(res.status)) {
          logger.warn(`Netlify API returned ${res.status}. Parando o monitoramento de deploy. Verifique seu NETLIFY_AUTH_TOKEN e NETLIFY_SITE_ID em backend/.env.`);
          return false;
        }
        throw new Error(`Netlify API responded with status ${res.status}`);
      }

      const deploys = await res.json();
      // Find the deploy entry corresponding to our commit SHA
      const targetDeploy = deploys.find(d => d.commit_ref === commitSha);

      if (targetDeploy) {
        deployId = targetDeploy.id;
        const state = targetDeploy.state; // 'enqueued', 'building', 'ready', 'error'

        if (state === 'enqueued' || state === 'building') {
          if (!deployStartedLogged) {
            logger.info(`Deploy iniciado no Netlify (ID: ${deployId}). Status: ${state}`);
            deployStartedLogged = true;
          }
        } else if (state === 'ready') {
          logger.info(`Deploy concluído com sucesso no Netlify! (ID: ${deployId})`);
          return true;
        } else if (state === 'error' || state === 'failed') {
          logger.error(`Deploy falhou ou encerrou com erro no Netlify (ID: ${deployId}). Estado: ${state}`);
          return false;
        }
      }
    } catch (err) {
      logger.warn(`Error polling Netlify deploy: ${err.message}`);
    }

    // Wait 10s before polling again
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  logger.warn(`Netlify deploy monitoring timed out after 5 minutes.`);
  return false;
}

export default {
  trackDeploy
};
