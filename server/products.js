const express = require('express');
const router = express.Router();
const db = require('./db');

// Auxiliar para gerar próximo ID no formato KFxxx
const getNextProductId = (products) => {
    let maxNum = 0;
    products.forEach(p => {
        if (p.id && p.id.startsWith('KF')) {
            const num = parseInt(p.id.substring(2));
            if (!isNaN(num) && num > maxNum) {
                maxNum = num;
            }
        }
    });
    const nextNum = maxNum + 1;
    // Formata com zeros à esquerda se for menor que 100, mantendo 3 dígitos
    return 'KF' + String(nextNum).padStart(3, '0');
};

// GET: Listar todos os produtos
router.get('/', async (req, res) => {
    try {
        const data = await db.readDb();
        res.json(data.produtos || []);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao ler produtos' });
    }
});

// POST: Criar novo produto
router.post('/', async (req, res) => {
    try {
        const data = await db.readDb();
        const p = req.body;

        if (!p.nome || !p.categoria) {
            return res.status(400).json({ error: 'Nome e categoria são obrigatórios.' });
        }

        // Determinar ID
        const newId = p.id || getNextProductId(data.produtos);
        
        // Verifica se ID já existe
        if (data.produtos.some(prod => prod.id === newId)) {
            return res.status(400).json({ error: `Código de produto ${newId} já existe.` });
        }

        // Criar objeto do produto
        const novoProduto = {
            id: newId,
            nome: p.nome,
            precoUnidade: p.precoUnidade === "Promoção surpresa" ? "Promoção surpresa" : parseFloat(p.precoUnidade || 0),
            precoUnidade5: p.precoUnidade5 ? parseFloat(p.precoUnidade5) : undefined,
            precoUnidade50: p.precoUnidade50 ? parseFloat(p.precoUnidade50) : undefined,
            categoria: p.categoria,
            descricao: p.descricao || "",
            imagem: p.imagem || "img/placeholder.jpg",
            imagensExtras: p.imagensExtras || [],
            data: p.data || new Date().toISOString().split('T')[0], // data de cadastro atual (YYYY-MM-DD)
            ativo: p.ativo !== false, // default true
            destaque: !!p.destaque,
            promocao: !!p.promocao,
            novo: !!p.novo,
            maisVendido: !!p.maisVendido,
            mensagemCustomizada: p.mensagemCustomizada || ""
        };

        data.produtos.push(novoProduto);
        await db.writeDb(data);

        res.status(201).json(novoProduto);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar produto.' });
    }
});

// PUT: Atualizar produto existente
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await db.readDb();
        const prodIndex = data.produtos.findIndex(p => p.id === id);

        if (prodIndex === -1) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        const p = req.body;
        const originalProduct = data.produtos[prodIndex];

        // Atualizar campos do produto
        const produtoAtualizado = {
            ...originalProduct,
            nome: p.nome !== undefined ? p.nome : originalProduct.nome,
            precoUnidade: p.precoUnidade === "Promoção surpresa" ? "Promoção surpresa" : (p.precoUnidade !== undefined ? parseFloat(p.precoUnidade || 0) : originalProduct.precoUnidade),
            precoUnidade5: p.precoUnidade5 !== undefined ? (p.precoUnidade5 ? parseFloat(p.precoUnidade5) : undefined) : originalProduct.precoUnidade5,
            precoUnidade50: p.precoUnidade50 !== undefined ? (p.precoUnidade50 ? parseFloat(p.precoUnidade50) : undefined) : originalProduct.precoUnidade50,
            categoria: p.categoria !== undefined ? p.categoria : originalProduct.categoria,
            descricao: p.descricao !== undefined ? p.descricao : originalProduct.descricao,
            imagem: p.imagem !== undefined ? p.imagem : originalProduct.imagem,
            imagensExtras: p.imagensExtras !== undefined ? p.imagensExtras : originalProduct.imagensExtras,
            data: p.data !== undefined ? p.data : originalProduct.data,
            ativo: p.ativo !== undefined ? !!p.ativo : originalProduct.ativo,
            destaque: p.destaque !== undefined ? !!p.destaque : originalProduct.destaque,
            promocao: p.promocao !== undefined ? !!p.promocao : originalProduct.promocao,
            novo: p.novo !== undefined ? !!p.novo : originalProduct.novo,
            maisVendido: p.maisVendido !== undefined ? !!p.maisVendido : originalProduct.maisVendido,
            mensagemCustomizada: p.mensagemCustomizada !== undefined ? p.mensagemCustomizada : originalProduct.mensagemCustomizada
        };

        // Tratamento para remover chaves undefined de atacado se vazias
        if (p.precoUnidade5 === "") delete produtoAtualizado.precoUnidade5;
        if (p.precoUnidade50 === "") delete produtoAtualizado.precoUnidade50;

        data.produtos[prodIndex] = produtoAtualizado;
        await db.writeDb(data);

        res.json(produtoAtualizado);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar produto.' });
    }
});

// DELETE: Remover produto
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await db.readDb();
        const prodIndex = data.produtos.findIndex(p => p.id === id);

        if (prodIndex === -1) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        data.produtos.splice(prodIndex, 1);
        await db.writeDb(data);

        res.json({ success: true, message: `Produto ${id} removido com sucesso.` });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao excluir produto.' });
    }
});

// POST: Duplicar produto
router.post('/duplicate/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await db.readDb();
        const original = data.produtos.find(p => p.id === id);

        if (!original) {
            return res.status(404).json({ error: 'Produto original não encontrado.' });
        }

        const newId = getNextProductId(data.produtos);
        const duplicado = {
            ...original,
            id: newId,
            nome: `${original.nome} - Cópia`,
            data: new Date().toISOString().split('T')[0] // Novo cadastro
        };

        data.produtos.push(duplicado);
        await db.writeDb(data);

        res.status(201).json(duplicado);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao duplicar produto.' });
    }
});

module.exports = router;
