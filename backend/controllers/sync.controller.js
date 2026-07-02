import { triggerSync } from '../services/sync.service.js';
import logger from '../services/logger.service.js';

/**
 * Controller to handle manual sync requests from the client.
 */
export async function handleManualSync(req, res) {
  try {
    const { commitMessage, adminName } = req.body;
    const msg = commitMessage || 'Sincronização manual acionada pelo painel';
    const admin = adminName || req.headers['x-admin-name'] || 'Admin';

    logger.info(`Manual synchronization requested by ${admin}`);
    const result = await triggerSync(msg, admin, 'Sincronização Manual');
    
    res.json({
      success: true,
      message: 'Sincronização executada com sucesso!',
      result
    });
  } catch (err) {
    logger.error('Manual synchronization failed', err);
    res.status(500).json({
      success: false,
      error: 'Erro na sincronização',
      details: err.message
    });
  }
}

export default {
  handleManualSync
};
