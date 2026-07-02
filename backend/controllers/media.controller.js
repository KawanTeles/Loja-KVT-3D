import { supabase } from '../services/supabase.service.js';
import logger from '../services/logger.service.js';

/**
 * Lists all media files in the Supabase Storage 'media' bucket.
 */
export async function getMedia(req, res) {
  try {
    const { data: files, error } = await supabase.storage.from('media').list('', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' }
    });

    if (error) {
      logger.warn(`Failed to list storage media from Supabase: ${error.message}`);
      return res.json([]); // Return empty list gracefully if bucket issue
    }

    const mapped = (files || [])
      .filter(f => f.name !== '.emptyFolderPlaceholder')
      .map(f => {
        const { data } = supabase.storage.from('media').getPublicUrl(f.name);
        return {
          name: f.name,
          path: data.publicUrl,
          size: f.metadata ? f.metadata.size : 0
        };
      });

    res.json(mapped);
  } catch (err) {
    logger.error('Failed to retrieve media library', err);
    res.status(500).json({ error: 'Erro ao listar mídias.' });
  }
}

/**
 * Deletes a media file from the Supabase Storage 'media' bucket.
 */
export async function deleteMedia(req, res) {
  try {
    const { filePath } = req.query;
    if (!filePath) {
      return res.status(400).json({ error: 'Caminho do arquivo é obrigatório.' });
    }

    const filename = filePath.split('/').pop();
    const { error } = await supabase.storage.from('media').remove([filename]);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    logger.error('Failed to delete media file', err);
    res.status(500).json({ error: 'Erro ao excluir mídia.' });
  }
}

/**
 * Uploads media files to the Supabase Storage 'media' bucket.
 */
export async function uploadMedia(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const uploadedFiles = [];
    for (const file of req.files) {
      const ext = file.originalname.split('.').pop();
      const nameOnly = file.originalname.substring(0, file.originalname.lastIndexOf('.'))
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '_');
      const fileName = `${Date.now()}_${nameOnly}.${ext}`;

      const { data, error } = await supabase.storage
        .from('media')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          duplex: 'half'
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
      uploadedFiles.push({
        name: fileName,
        path: urlData.publicUrl
      });
    }

    res.json(uploadedFiles);
  } catch (err) {
    logger.error('Failed to upload media files', err);
    res.status(500).json({ error: 'Erro ao enviar mídias.' });
  }
}

export default {
  getMedia,
  deleteMedia,
  uploadMedia
};
