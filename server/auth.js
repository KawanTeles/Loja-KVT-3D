const express = require('express');
const router = express.Router();

const ACCESS_CODE = "21062407";
const SESSION_TOKEN = "kvt3d_admin_token_21062407"; // Simulação de token de sessão/JWT

// Middleware de autenticação
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso não autorizado. Token ausente.' });
    }
    
    const token = authHeader.split(' ')[1];
    if (token !== SESSION_TOKEN) {
        return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
    }
    
    next();
};

// Endpoint de login
router.post('/login', (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ error: 'Código de acesso obrigatório.' });
    }
    
    if (code === ACCESS_CODE) {
        // Login bem sucedido, retorna o token de autenticação e dados do usuário simulado
        return res.json({
            token: SESSION_TOKEN,
            user: {
                username: 'admin',
                role: 'superadmin',
                name: 'Administrador KVT-3D'
            }
        });
    } else {
        return res.status(401).json({ error: 'Código de acesso incorreto.' });
    }
});

// Endpoint para verificar estado do token
router.get('/check', requireAuth, (req, res) => {
    res.json({
        valid: true,
        user: {
            username: 'admin',
            role: 'superadmin',
            name: 'Administrador KVT-3D'
        }
    });
});

module.exports = {
    router,
    requireAuth
};
