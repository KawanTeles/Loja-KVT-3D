const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');

const auth = require('./server/auth');
const productsRouter = require('./server/products');
const categoriesRouter = require('./server/categories');
const configRouter = require('./server/config');
const mediaRouter = require('./server/media');
const backupRouter = require('./server/backup');
const db = require('./server/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 1. Rotas de API públicas
app.use('/api/auth', auth.router);

// 2. Rotas de API protegidas (exigem Token de Acesso)
app.use('/api/produtos', auth.requireAuth, productsRouter);
app.use('/api/categorias', auth.requireAuth, categoriesRouter);
app.use('/api/config', auth.requireAuth, configRouter);
app.use('/api/media', auth.requireAuth, mediaRouter);
app.use('/api/backup', auth.requireAuth, backupRouter);

// Endpoint de Dashboard (Estatísticas do Painel)
app.get('/api/dashboard', auth.requireAuth, async (req, res) => {
    try {
        const data = await db.readDb();
        const produtos = data.produtos || [];
        const categorias = data.categorias || [];
        
        // Contagens para os cards
        const totalProdutos = produtos.length;
        const ativos = produtos.filter(p => p.ativo !== false).length;
        const inativos = totalProdutos - ativos;
        const destaque = produtos.filter(p => p.destaque).length;
        const promocao = produtos.filter(p => p.promocao).length;
        const novos = produtos.filter(p => p.novo).length;
        const maisVendidos = produtos.filter(p => p.maisVendido).length;
        const totalCategorias = categorias.length;
        
        // Scan recursivo da pasta img para contar imagens cadastradas
        const imgDir = path.join(__dirname, 'img');
        let totalImagens = 0;
        
        const countImages = async (dir) => {
            if (!await fs.pathExists(dir)) return;
            const files = await fs.readdir(dir);
            for (const file of files) {
                const filePath = path.join(dir, file);
                const stat = await fs.stat(filePath);
                if (stat.isDirectory()) {
                    await countImages(filePath);
                } else {
                    const ext = path.extname(file).toLowerCase();
                    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'].includes(ext)) {
                        totalImagens++;
                    }
                }
            }
        };
        
        await countImages(imgDir);
        
        // 5 últimos produtos adicionados
        const ultimosAdicionados = [...produtos]
            .sort((a, b) => new Date(b.data) - new Date(a.data))
            .slice(0, 5)
            .map(p => ({ id: p.id, nome: p.nome, data: p.data, ativo: p.ativo !== false }));
            
        res.json({
            stats: {
                totalProdutos,
                ativos,
                inativos,
                destaque,
                promocao,
                novos,
                maisVendidos,
                totalCategorias,
                totalImagens
            },
            ultimosAdicionados
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao gerar estatísticas do dashboard.' });
    }
});

// 3. Servir arquivos estáticos do cliente da Loja
app.use(express.static(path.join(__dirname)));

// Servir a interface do painel de administração em /admin
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Rota coringa para direcionar a subpáginas do Admin ou da Loja
app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Servidor escutando
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`  SERVIDOR LOJA KVT-3D COM PAINEL ADMINISTRATIVO  `);
    console.log(`  Rodando em: http://localhost:${PORT}             `);
    console.log(`  Painel em:  http://localhost:${PORT}/admin       `);
    console.log(`==================================================`);
});
