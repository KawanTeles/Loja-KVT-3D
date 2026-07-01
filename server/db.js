const fs = require('fs-extra');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'db.json');
const dadosLojaPath = path.join(__dirname, '..', 'js', 'dados_loja.js');

// Mutex simples para evitar concorrência na escrita de arquivos
let isWriting = false;
const queue = [];

const processQueue = async () => {
    if (isWriting || queue.length === 0) return;
    isWriting = true;
    const { resolve, reject, data } = queue.shift();
    try {
        await fs.writeJson(dbPath, data, { spaces: 2 });
        
        // Sincronizar com o arquivo público js/dados_loja.js
        const dadosLojaContent = `// DADOS DINÂMICOS DA LOJA - GERADO PELO PAINEL ADMINISTRATIVO\nwindow.DADOS_LOJA = ${JSON.stringify(data, null, 2)};\n`;
        await fs.writeFile(dadosLojaPath, dadosLojaContent, 'utf8');
        
        resolve(true);
    } catch (err) {
        reject(err);
    } finally {
        isWriting = false;
        processQueue();
    }
};

const writeDb = (data) => {
    return new Promise((resolve, reject) => {
        queue.push({ resolve, reject, data });
        processQueue();
    });
};

const readDb = async () => {
    try {
        if (!await fs.pathExists(dbPath)) {
            throw new Error('Banco de dados db.json não encontrado. Execute npm run seed primeiro.');
        }
        return await fs.readJson(dbPath);
    } catch (err) {
        console.error('Erro ao ler banco de dados:', err);
        throw err;
    }
};

module.exports = {
    readDb,
    writeDb
};
