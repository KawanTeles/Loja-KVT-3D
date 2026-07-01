const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

const imgDir = path.join(__dirname, '..', 'img');
const uploadsDir = path.join(imgDir, 'uploads');

// Garantir que a pasta img/uploads existe
fs.ensureDirSync(uploadsDir);

// Configuração do Multer para Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Limpar o nome do arquivo para evitar caracteres especiais
        const ext = path.extname(file.originalname).toLowerCase();
        const name = path.basename(file.originalname, ext)
            .toLowerCase()
            .replace(/[^a-z0-9_-]/g, '_');
        cb(null, `${Date.now()}_${name}${ext}`);
    }
});

// Filtro de upload de imagem
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif|svg|ico/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;
    
    if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
        cb(null, true);
    } else {
        cb(new Error('Formato de arquivo inválido. Apenas imagens são permitidas.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // Limite de 10MB
});

// Função recursiva para listar imagens
const getImagesRecursively = async (dir, rootDir = imgDir) => {
    let results = [];
    const list = await fs.readdir(dir);
    
    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);
        
        if (stat && stat.isDirectory()) {
            // Ignorar pastas ocultas como .git, etc.
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
};

// GET: Listar todas as imagens da biblioteca
router.get('/', async (req, res) => {
    try {
        const images = await getImagesRecursively(imgDir);
        // Ordenar por data de modificação decrescente (mais recentes primeiro)
        images.sort((a, b) => b.mtime - a.mtime);
        res.json(images);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar imagens.' });
    }
});

// POST: Fazer upload de uma ou mais imagens
router.post('/upload', upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
        }
        
        const uploadedFiles = req.files.map(f => {
            const relativePath = path.relative(path.join(imgDir, '..'), f.path).replace(/\\/g, '/');
            return {
                name: f.filename,
                path: relativePath,
                size: f.size
            };
        });
        
        res.json({ success: true, files: uploadedFiles });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao fazer upload das imagens.' });
    }
});

// DELETE: Excluir imagem
router.delete('/', async (req, res) => {
    try {
        const { filePath } = req.query; // caminho relativo ex: img/uploads/123_foto.png
        
        if (!filePath) {
            return res.status(400).json({ error: 'Caminho do arquivo é obrigatório.' });
        }
        
        // Resolver caminho absoluto e garantir que está dentro de img/
        const absolutePath = path.resolve(path.join(__dirname, '..', filePath));
        const relativeToImg = path.relative(imgDir, absolutePath);
        
        // Segurança contra Path Traversal
        if (relativeToImg.startsWith('..') || path.isAbsolute(relativeToImg)) {
            return res.status(403).json({ error: 'Acesso negado. Fora do diretório de imagens.' });
        }
        
        if (!await fs.pathExists(absolutePath)) {
            return res.status(404).json({ error: 'Arquivo não encontrado.' });
        }
        
        await fs.remove(absolutePath);
        res.json({ success: true, message: 'Imagem excluída com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao excluir imagem.' });
    }
});

module.exports = router;
