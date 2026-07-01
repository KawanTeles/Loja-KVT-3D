const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, '..', 'js', 'script.js');
const dbDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dbDir, 'db.json');
const publicDadosPath = path.join(__dirname, '..', 'js', 'dados_loja.js');

console.log('Iniciando semeador de dados...');

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// 1. Ler o script.js
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// 2. Extrair o array PRODUTOS
// Procuramos a declaração const PRODUTOS = [ ... ];
// Usando regex para capturar a estrutura do array
const startTag = 'const PRODUTOS = [';
const startIndex = scriptContent.indexOf(startTag);
if (startIndex === -1) {
    console.error('Erro: Não foi possível encontrar a declaração do array PRODUTOS no script.js');
    process.exit(1);
}

// Vamos encontrar o colchete de fechamento correto do array
let bracketCount = 1;
let currentIndex = startIndex + startTag.length;
let arrayContentStr = '[';

while (bracketCount > 0 && currentIndex < scriptContent.length) {
    const char = scriptContent[currentIndex];
    arrayContentStr += char;
    if (char === '[') bracketCount++;
    if (char === ']') bracketCount--;
    currentIndex++;
}

// Avaliar o array com segurança em Node
let produtos = [];
try {
    // Definimos PRODUTOS no escopo do eval para capturar o array
    const evalCode = `var PRODUTOS = ${arrayContentStr}; PRODUTOS;`;
    produtos = eval(evalCode);
} catch (e) {
    console.error('Erro ao fazer parse dos produtos extraídos:', e.message);
    process.exit(1);
}

console.log(`Sucesso! Extraídos ${produtos.length} produtos do script.js.`);

// 3. Estruturar o banco de dados inicial
const dbInicial = {
    produtos: produtos,
    categorias: [
        { slug: "chaveiros", nome: "Chaveiros", ativa: true, ordem: 1 },
        { slug: "brinquedos", nome: "Brinquedos", ativa: true, ordem: 2 },
        { slug: "brinquedos-sensoriais", nome: "Brinquedos Sensoriais", ativa: true, ordem: 3 },
        { slug: "personalizados", nome: "Personalizados", ativa: true, ordem: 4 }
    ],
    configuracoes: {
        nomeLoja: "Loja KVT-3D",
        whatsapp: "5582998343617",
        email: "kvt3d.contato@gmail.com",
        socialLinks: {
            instagram: "https://www.instagram.com/kvt3d/",
            facebook: "",
            tiktok: ""
        },
        textoRodape: "© 2026 Loja KVT-3D. Todos os direitos reservados. Maceió - AL",
        endereco: "Maceió - AL",
        horarioAtendimento: "Segunda a Sexta - 8h às 18h",
        mensagemWhatsAppPadrao: "Olá! Tenho interesse no produto:\n*[NOME_PRODUTO]* (Cód: #[ID_PRODUTO])\n\n*Preços disponíveis:*\n[PRECOS_PRODUTO]\n\nPoderia me informar a disponibilidade de cores e o prazo de entrega?",
        linksImportantes: []
    },
    hero: {
        titulo: "Transforme Ideias em Realidade",
        subtitulo: "Produtos exclusivos, miniaturas detalhadas e presentes personalizados com a mais alta tecnologia de impressão.",
        imagemDesktop: "",
        imagemCelular: "",
        botaoPrincipal: {
            texto: "Ver Produtos",
            link: "#produtos"
        },
        botaoSecundario: {
            texto: "Encomenda Especial",
            link: "https://wa.me/5582998343617?text=Olá! Gostaria de fazer uma encomenda especial personalizada."
        }
    },
    seo: {
        siteTitle: "Loja KVT-3D - Impressão 3D e Presentes Personalizados",
        metaDescription: "Encontre produtos exclusivos, miniaturas detalhadas e presentes personalizados em Maceió - AL com a mais alta qualidade de impressão 3D.",
        keywords: "impressão 3d, miniaturas, chaveiros, brinquedos sensoriais, presentes personalizados, maceió, kvt 3d",
        googleAnalytics: "G-BC1K1WMMCG",
        googleSearchConsole: "",
        metaPixel: "",
        customScripts: ""
    },
    tema: {
        dark: {
            primary: "#8333e3",
            secondary: "#6f42c1",
            accent: "#25d366",
            bgDark: "#0f0f0f",
            bgCard: "#1a1a1a",
            textWhite: "#ffffff",
            textGray: "#b0b0b0"
        },
        light: {
            primary: "#8333e3",
            secondary: "#6f42c1",
            accent: "#25d366",
            bgDark: "#f8f9fa",
            bgCard: "#ffffff",
            textWhite: "#1a1a1a",
            textGray: "#555555"
        }
    }
};

// 4. Gravar db.json
fs.writeFileSync(dbPath, JSON.stringify(dbInicial, null, 2), 'utf8');
console.log(`Arquivo de banco de dados gravado em: ${dbPath}`);

// 5. Gravar dados_loja.js
const dadosLojaContent = `// DADOS DINÂMICOS DA LOJA - GERADO PELO PAINEL ADMINISTRATIVO
window.DADOS_LOJA = ${JSON.stringify(dbInicial, null, 2)};
`;
fs.writeFileSync(publicDadosPath, dadosLojaContent, 'utf8');
console.log(`Arquivo público de dados gravado em: ${publicDadosPath}`);

console.log('Semeador concluído com sucesso!');
