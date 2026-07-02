import { supabase } from '../services/supabase.service.js';
import { triggerSync } from '../services/sync.service.js';
import logger from '../services/logger.service.js';

/**
 * Gets the entire configuration data from Supabase configuracoes table.
 */
export async function getConfig(req, res) {
  try {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('*');

    if (error) throw error;

    const config = {};
    (data || []).forEach(c => {
      config[c.key] = c.value;
    });

    res.json({
      configuracoes: config.configuracoes || {},
      hero: config.hero || {},
      seo: config.seo || {},
      tema: config.tema || {}
    });
  } catch (err) {
    logger.error('Failed to retrieve configuration settings', err);
    res.status(500).json({ error: 'Erro ao obter configurações.' });
  }
}

/**
 * Updates configurations/banners in Supabase and triggers GitHub sync.
 */
export async function updateConfig(req, res) {
  try {
    const body = req.body;
    const admin = req.headers['x-admin-name'] || 'Admin';

    for (const key of ['hero', 'configuracoes', 'tema', 'seo']) {
      if (body[key] !== undefined) {
        const { error } = await supabase
          .from('configuracoes')
          .upsert({ key, value: body[key] });
        
        if (error) throw error;
      }
    }

    // Trigger sync to GitHub
    triggerSync(
      'Configurações/Banners atualizados automaticamente pelo painel administrativo',
      admin,
      'Atualizar Configurações/Banners'
    ).catch(e => logger.error('Sync failed after config/banner update', e));

    res.json({ success: true, message: 'Configurações atualizadas com sucesso.' });
  } catch (err) {
    logger.error('Failed to update configuration settings', err);
    res.status(500).json({ error: 'Erro ao salvar configurações.' });
  }
}

export default {
  getConfig,
  updateConfig
};
