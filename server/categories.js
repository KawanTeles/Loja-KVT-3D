const express = require('express');
const router = express.Router();
const db = require('./db');

// GET: Listar todas as categorias
router.get('/', async (req, res) => {
    try {
        const data = await db.readDb();
        res.json(data.categorias || []);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao ler categorias.' });
    }
});

// POST: Criar nova categoria
router.post('/', async (req, res) => {
    try {
        const data = await db.readDb();
        const cat = req.body;

        if (!cat.nome || !cat.slug) {
            return res.status(400).json({ error: 'Nome e slug são obrigatórios.' });
        }

        // Verifica se slug já existe
        if (data.categorias.some(c => c.slug === cat.slug)) {
            return res.status(400).json({ error: `Categoria com o slug '${cat.slug}' já existe.` });
        }

        const novaCategoria = {
            slug: cat.slug.toLowerCase().trim(),
            nome: cat.nome.trim(),
            ativa: cat.ativa !== false,
            ordem: parseInt(cat.ordem) || (data.categorias.length + 1)
        };

        data.categorias.push(novaCategoria);
        await db.writeDb(data);

        res.status(201).json(novaCategoria);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar categoria.' });
    }
});

// PUT: Atualizar categoria
router.put('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const data = await db.readDb();
        const catIndex = data.categorias.findIndex(c => c.slug === slug);

        if (catIndex === -1) {
            return res.status(404).json({ error: 'Categoria não encontrada.' });
        }

        const cat = req.body;
        const originalCategory = data.categorias[catIndex];

        const categoriaAtualizada = {
            ...originalCategory,
            nome: cat.nome !== undefined ? cat.nome.trim() : originalCategory.nome,
            ativa: cat.ativa !== undefined ? !!cat.ativa : originalCategory.ativa,
            ordem: cat.ordem !== undefined ? parseInt(cat.ordem) : originalCategory.ordem
        };

        // Se o slug mudou, precisamos atualizá-lo e também atualizar todos os produtos que pertencem a essa categoria!
        if (cat.slug && cat.slug.toLowerCase().trim() !== slug) {
            const newSlug = cat.slug.toLowerCase().trim();
            // Verifica se o novo slug já existe em outra categoria
            if (data.categorias.some((c, idx) => c.slug === newSlug && idx !== catIndex)) {
                return res.status(400).json({ error: `Categoria com o slug '${newSlug}' já existe.` });
            }
            categoriaAtualizada.slug = newSlug;

            // Atualiza os produtos que usavam o slug antigo
            data.produtos = data.produtos.map(p => {
                if (p.categoria === slug) {
                    return { ...p, categoria: newSlug };
                }
                return p;
            });
        }

        data.categorias[catIndex] = categoriaAtualizada;
        await db.writeDb(data);

        res.json(categoriaAtualizada);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar categoria.' });
    }
});

// DELETE: Excluir categoria
router.delete('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const data = await db.readDb();
        const catIndex = data.categorias.findIndex(c => c.slug === slug);

        if (catIndex === -1) {
            return res.status(404).json({ error: 'Categoria não encontrada.' });
        }

        data.categorias.splice(catIndex, 1);
        
        // Opcional: o que fazer com produtos dessa categoria?
        // Vamos mantê-los, mas a categoria neles continua como slug excluído. 
        // Eles podem ser recategorizados depois pelo admin.
        
        await db.writeDb(data);

        res.json({ success: true, message: `Categoria '${slug}' excluída com sucesso.` });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao excluir categoria.' });
    }
});

module.exports = router;
