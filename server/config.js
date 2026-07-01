const express = require('express');
const router = express.Router();
const db = require('./db');

// GET: Obter todas as configurações
router.get('/', async (req, res) => {
    try {
        const data = await db.readDb();
        res.json({
            configuracoes: data.configuracoes || {},
            hero: data.hero || {},
            seo: data.seo || {},
            tema: data.tema || {}
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao obter configurações.' });
    }
});

// PUT: Salvar configurações
router.put('/', async (req, res) => {
    try {
        const data = await db.readDb();
        const payload = req.body;

        if (payload.configuracoes) data.configuracoes = payload.configuracoes;
        if (payload.hero) data.hero = payload.hero;
        if (payload.seo) data.seo = payload.seo;
        if (payload.tema) data.tema = payload.tema;

        await db.writeDb(data);
        res.json({ success: true, message: 'Configurações atualizadas com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao salvar configurações.' });
    }
});

module.exports = router;
