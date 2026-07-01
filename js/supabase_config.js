// CONFIGURAÇÃO DO SUPABASE PARA A LOJA KVT-3D
window.SUPABASE_CONFIG = {
    url: 'https://qusbhrvyergymhgoqsng.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1c2JocnZ5ZXJneW1oZ29xc25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MjYyNzIsImV4cCI6MjA5ODUwMjI3Mn0.pCi1_QjOusAUSkQBkeonodGzTdWewY8YsFQmlB84n10'
};

// Inicialização do cliente Supabase globalmente
if (window.supabase) {
    window.supabaseClient = window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.key);
} else {
    console.error('Biblioteca do Supabase não foi carregada. Verifique se o script CDN está incluído.');
}

// Auxiliar para obter a URL correta de imagens (seja local ou do Supabase Storage)
window.obterImagemUrl = function(caminho, pathPrefix = '') {
    if (!caminho) return pathPrefix + 'img/placeholder.jpg';
    if (caminho.startsWith('http://') || caminho.startsWith('https://')) {
        return caminho;
    }
    return pathPrefix + caminho;
};

