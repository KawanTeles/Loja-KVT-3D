import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCommit } from '../github/createCommit.js';
import logger from '../services/logger.service.js';
import { supabase } from '../services/supabase.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imgDir = path.resolve(__dirname, '..', '..', 'img');
const uploadsDir = path.join(imgDir, 'uploads');

// Ensure local uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Helper to recursively list images under the project img/ folder.
 */
async function getImagesRecursively(dir, rootDir = imgDir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.')) {
        const subResults = await getImagesRecursively(filePath, rootDir);
        results = results.concat(subResults);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'].includes(ext)) {
        const relativePath = path.relative(path.join(rootDir, '..'), filePath).replace(/\\/g, '/');
        results.push({
          name: file,
          path: relativePath,
          size: stat.size,
          mtime: stat.mtime
        });
      }
    }
  }
  return results;
}

/**
 * Lists all image files in the local img/ directory.
 */
export async function getMedia(req, res) {
  try {
    if (!fs.existsSync(imgDir)) {
      logger.warn(`Images directory not found at: ${imgDir}`);
      return res.json([]);
    }

    const images = await getImagesRecursively(imgDir);
    // Sort by modification time descending (newest first)
    images.sort((a, b) => b.mtime - a.mtime);

    res.json(images);
  } catch (err) {
    logger.error('Failed to scan local media directory', err);
    res.status(500).json({ error: 'Erro ao listar imagens.' });
  }
}

/**
 * Deletes an image file from the local img/ directory.
 */
export async function deleteMedia(req, res) {
  try {
    const { filePath } = req.query; // relative path e.g. img/uploads/123.jpg
    if (!filePath) {
      return res.status(400).json({ error: 'Caminho do arquivo é obrigatório.' });
    }

    const absolutePath = path.resolve(path.join(__dirname, '..', '..', filePath));
    const relativeToImg = path.relative(imgDir, absolutePath);

    // Path traversal protection
    if (relativeToImg.startsWith('..') || path.isAbsolute(relativeToImg)) {
      return res.status(403).json({ error: 'Acesso negado. Fora do diretório de imagens.' });
    }

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: 'Arquivo não encontrado.' });
    }

    fs.unlinkSync(absolutePath);
    logger.info(`Deleted media file locally: ${filePath}`);

    // Delete from Supabase Storage
    const fileName = path.basename(filePath);
    const { error: deleteErr } = await supabase.storage
      .from('media')
      .remove([fileName]);
    if (deleteErr) {
      logger.error(`Failed to delete file ${fileName} from Supabase Storage:`, deleteErr);
    } else {
      logger.info(`Deleted media file from Supabase Storage: ${fileName}`);
    }

    // Optional: We could commit the file deletion to GitHub as well, but typical local workflows only need it deleted locally.
    res.json({ success: true, message: 'Imagem excluída com sucesso.' });
  } catch (err) {
    logger.error('Failed to delete local media file', err);
    res.status(500).json({ error: 'Erro ao excluir imagem.' });
  }
}

/**
 * Uploads media files, writes them to local project folders, and commits them directly to GitHub.
 */
export async function uploadMedia(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const uploadedFiles = [];
    const gitFilesToCommit = [];

    for (const file of req.files) {
      const ext = path.extname(file.originalname).toLowerCase();
      const nameOnly = path.basename(file.originalname, ext)
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '_');
      const fileName = `${Date.now()}_${nameOnly}${ext}`;
      
      const localFilePath = path.join(uploadsDir, fileName);
      const relativePath = `img/uploads/${fileName}`;

      // 1. Save file locally on developer machine disk
      fs.writeFileSync(localFilePath, file.buffer);
      logger.info(`Saved media file locally to: ${localFilePath}`);

      // 1.1 Upload to Supabase Storage "media" bucket
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('media')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (uploadErr) {
        logger.error(`Failed to upload file ${fileName} to Supabase Storage:`, uploadErr);
        return res.status(500).json({ error: `Erro ao fazer upload para o Supabase Storage: ${uploadErr.message}` });
      }
      logger.info(`Uploaded file ${fileName} successfully to Supabase Storage.`);

      // 2. Prepare file to commit to GitHub
      gitFilesToCommit.push({
        path: relativePath,
        content: file.buffer.toString('base64'),
        encoding: 'base64'
      });

      uploadedFiles.push({
        name: fileName,
        path: relativePath
      });
    }

    // 3. Commit files directly to GitHub repository (using octokit Git database API)
    if (gitFilesToCommit.length > 0) {
      logger.info(`Committing uploaded media files to GitHub...`);
      await createCommit(gitFilesToCommit, `Upload imagens: ${uploadedFiles.map(f => f.name).join(', ')}`);
      logger.info(`Uploaded media files successfully committed to GitHub.`);
    }

    res.json(uploadedFiles);
  } catch (err) {
    logger.error('Failed to upload media files', err);
    res.status(500).json({ error: 'Erro ao fazer upload das imagens.' });
  }
}

export default {
  getMedia,
  deleteMedia,
  uploadMedia
};
