const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');
const db = require('./db');

const backupsDir = path.join(__dirname, '..', 'backups');
const dbPath = path.join(__dirname, '..', 'data', 'db.json');
const uploadsDir = path.join(__dirname, '..', 'img', 'uploads');

fs.ensureDirSync(backupsDir);

// GET: Listar todos os backups disponíveis
router.get('/list', async (req, res) => {
    try {
        if (!await fs.pathExists(backupsDir)) {
            return res.json([]);
        }
        
        const files = await fs.readdir(backupsDir);
        const backups = [];
        
        for (const file of files) {
            const filePath = path.join(backupsDir, file);
            const stat = await fs.stat(filePath);
            
            // Só listar pastas ou arquivos de backup
            if (stat.isDirectory() && file.startsWith('backup_')) {
                backups.push({
                    name: file,
                    date: stat.mtime,
                    size: 'N/A' // Como é diretório, tamanho é calculado se necessário
                });
            } else if (file.endsWith('.json') && file.startsWith('backup_')) {
                backups.push({
                    name: file,
                    date: stat.mtime,
                    size: stat.size
                });
            }
        }
        
        // Mais recentes primeiro
        backups.sort((a, b) => b.date - a.date);
        res.json(backups);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar backups.' });
    }
});

// POST: Criar backup manual
router.post('/create', async (req, res) => {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupName = `backup_${timestamp}`;
        const targetBackupDir = path.join(backupsDir, backupName);
        
        await fs.ensureDir(targetBackupDir);
        
        // 1. Copiar db.json
        if (await fs.pathExists(dbPath)) {
            await fs.copy(dbPath, path.join(targetBackupDir, 'db.json'));
        }
        
        // 2. Copiar pasta img/uploads se existir
        if (await fs.pathExists(uploadsDir)) {
            await fs.copy(uploadsDir, path.join(targetBackupDir, 'uploads'));
        }
        
        res.json({ success: true, message: `Backup '${backupName}' criado com sucesso.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar backup.' });
    }
});

// POST: Restaurar backup
router.post('/restore', async (req, res) => {
    try {
        const { backupName } = req.body;
        if (!backupName) {
            return res.status(400).json({ error: 'Nome do backup é obrigatório.' });
        }
        
        const targetBackupDir = path.join(backupsDir, backupName);
        if (!await fs.pathExists(targetBackupDir)) {
            return res.status(404).json({ error: 'Backup não encontrado.' });
        }
        
        const backupDbPath = path.join(targetBackupDir, 'db.json');
        const backupUploadsDir = path.join(targetBackupDir, 'uploads');
        
        // 1. Restaurar db.json
        if (await fs.pathExists(backupDbPath)) {
            // Ler dados do backup
            const backupData = await fs.readJson(backupDbPath);
            // Salvar no db ativo (que também atualiza dados_loja.js)
            await db.writeDb(backupData);
        }
        
        // 2. Restaurar uploads de imagem
        if (await fs.pathExists(backupUploadsDir)) {
            await fs.ensureDir(uploadsDir);
            await fs.copy(backupUploadsDir, uploadsDir);
        }
        
        res.json({ success: true, message: `Backup '${backupName}' restaurado com sucesso.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao restaurar backup.' });
    }
});

// GET: Exportar produtos (CSV)
router.get('/export-products', async (req, res) => {
    try {
        const data = await db.readDb();
        const produtos = data.produtos || [];
        
        // Cabeçalhos CSV
        const headers = [
            'id', 'nome', 'precoUnidade', 'precoUnidade5', 'precoUnidade50',
            'categoria', 'descricao', 'imagem', 'data', 'ativo',
            'destaque', 'promocao', 'novo', 'maisVendido', 'mensagemCustomizada'
        ];
        
        let csvContent = headers.join(',') + '\n';
        
        produtos.forEach(p => {
            const row = headers.map(header => {
                let val = p[header];
                if (val === undefined || val === null) return '';
                if (typeof val === 'boolean') return val ? 'true' : 'false';
                if (typeof val === 'object') return JSON.stringify(val).replace(/"/g, '""');
                
                // Escapar string contendo vírgulas, aspas ou novas linhas
                let strVal = String(val);
                if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n') || strVal.includes('\r')) {
                    strVal = `"${strVal.replace(/"/g, '""')}"`;
                }
                return strVal;
            });
            csvContent += row.join(',') + '\n';
        });
        
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=produtos_kvt3d.csv');
        res.status(200).send(csvContent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao exportar produtos em CSV.' });
    }
});

// POST: Importar produtos (CSV)
// Custom CSV Parser para evitar dependências adicionais
router.post('/import-products', express.text({ limit: '10mb' }), async (req, res) => {
    try {
        const csvText = req.body;
        if (!csvText) {
            return res.status(400).json({ error: 'Conteúdo CSV vazio ou inválido.' });
        }
        
        const lines = csvText.split(/\r?\n/);
        if (lines.length < 2) {
            return res.status(400).json({ error: 'CSV deve conter cabeçalho e pelo menos um produto.' });
        }
        
        // Parsear cabeçalhos
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        
        const parsedProducts = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Regex simples para split de CSV respeitando aspas
            const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
            const rowVals = matches.map(v => v.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
            
            const prod = {};
            headers.forEach((header, index) => {
                let val = rowVals[index] || '';
                
                // Converter tipos
                if (header === 'precoUnidade') {
                    prod[header] = val === 'Promoção surpresa' ? 'Promoção surpresa' : parseFloat(val || 0);
                } else if (header === 'precoUnidade5' || header === 'precoUnidade50') {
                    prod[header] = val ? parseFloat(val) : undefined;
                } else if (['ativo', 'destaque', 'promocao', 'novo', 'maisVendido'].includes(header)) {
                    prod[header] = val === 'true';
                } else {
                    prod[header] = val;
                }
            });
            
            if (prod.id && prod.nome) {
                parsedProducts.push(prod);
            }
        }
        
        if (parsedProducts.length === 0) {
            return res.status(400).json({ error: 'Nenhum produto válido encontrado no CSV.' });
        }
        
        const data = await db.readDb();
        
        // Mesclar produtos: se o ID já existe, atualiza; senão, adiciona.
        parsedProducts.forEach(newProd => {
            const idx = data.produtos.findIndex(p => p.id === newProd.id);
            if (idx !== -1) {
                data.produtos[idx] = { ...data.produtos[idx], ...newProd };
            } else {
                data.produtos.push(newProd);
            }
        });
        
        await db.writeDb(data);
        res.json({ success: true, count: parsedProducts.length, message: `${parsedProducts.length} produtos importados/atualizados com sucesso.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao importar produtos.' });
    }
});

module.exports = router;
