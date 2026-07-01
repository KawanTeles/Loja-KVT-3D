const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'db.json');
const SUPABASE_URL = 'https://qusbhrvyergymhgoqsng.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1c2JocnZ5ZXJneW1oZ29xc25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MjYyNzIsImV4cCI6MjA5ODUwMjI3Mn0.pCi1_QjOusAUSkQBkeonodGzTdWewY8YsFQmlB84n10';

async function seed() {
    console.log('Iniciando semeador de dados do Supabase...');
    
    if (!fs.existsSync(dbPath)) {
        console.error('Erro: Arquivo data/db.json não encontrado. Execute npm run seed primeiro.');
        process.exit(1);
    }
    
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Headers para autenticação do Supabase REST API
    const headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
    };

    // 1. Semear Categorias
    if (dbData.categorias && dbData.categorias.length > 0) {
        console.log(`Enviando ${dbData.categorias.length} categorias para o Supabase...`);
        const payload = dbData.categorias.map(c => ({
            slug: c.slug,
            nome: c.nome,
            ativa: c.ativa !== false,
            ordem: Number(c.ordem) || 0
        }));
        
        const res = await fetch(`${SUPABASE_URL}/rest/v1/categorias`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });
        
        if (res.ok) {
            console.log('✅ Categorias semeadas com sucesso!');
        } else {
            console.error('❌ Erro ao semear categorias:', await res.text());
        }
    }

    // 2. Semear Produtos
    if (dbData.produtos && dbData.produtos.length > 0) {
        console.log(`Enviando ${dbData.produtos.length} produtos para o Supabase...`);
        const payload = dbData.produtos.map(p => ({
            id: p.id,
            nome: p.nome,
            preco_unidade: p.precoUnidade === undefined ? null : String(p.precoUnidade),
            preco_unidade_5: p.precoUnidade5 ? Number(p.precoUnidade5) : null,
            preco_unidade_50: p.precoUnidade50 ? Number(p.precoUnidade50) : null,
            categoria: p.categoria,
            descricao: p.descricao,
            imagem: p.imagem,
            imagens_extras: p.imagensExtras || [],
            data: p.data || new Date().toISOString().split('T')[0],
            ativo: p.ativo !== false,
            destaque: !!p.destaque,
            promocao: !!p.promocao,
            novo: !!p.novo,
            mais_vendido: !!p.maisVendido,
            mensagem_customizada: p.mensagemCustomizada || null
        }));
        
        const res = await fetch(`${SUPABASE_URL}/rest/v1/produtos`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });
        
        if (res.ok) {
            console.log('✅ Produtos semeados com sucesso!');
        } else {
            console.error('❌ Erro ao semear produtos:', await res.text());
        }
    }

    // 3. Semear Configurações
    console.log('Enviando configurações gerais, hero, seo e tema para o Supabase...');
    const configKeys = ['hero', 'configuracoes', 'tema', 'seo'];
    const configPayloads = [];
    
    configKeys.forEach(key => {
        if (dbData[key]) {
            configPayloads.push({
                key: key,
                value: dbData[key]
            });
        }
    });
    
    // Garantir que a chave auth existe com a senha padrão
    configPayloads.push({
        key: 'auth',
        value: { access_code: '21062407' }
    });

    const res = await fetch(`${SUPABASE_URL}/rest/v1/configuracoes`, {
        method: 'POST',
        headers,
        body: JSON.stringify(configPayloads)
    });
    
    if (res.ok) {
        console.log('✅ Configurações semeadas com sucesso!');
    } else {
        console.error('❌ Erro ao semear configurações:', await res.text());
    }

    console.log('\nSemeador de dados concluído!');
}

seed().catch(err => {
    console.error('Erro durante o semeador:', err);
});
