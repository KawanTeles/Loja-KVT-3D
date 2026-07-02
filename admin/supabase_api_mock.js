// =========================================================================
// MOCK API INTERCEPTOR FOR SUPABASE INTEGRATION
// Intercepta todas as requisições para /api/ e redireciona para o Supabase
// =========================================================================
(function() {
    const nativeFetch = window.fetch;
    window.fetch = async function(url, options) {
        const urlStr = String(url);
        if (!urlStr.includes('/api/')) {
            return nativeFetch(url, options);
        }

        const method = (options && options.method || 'GET').toUpperCase();
        const headers = options && options.headers || {};
        
        let parsedUrl;
        try {
            parsedUrl = new URL(urlStr, window.location.origin);
        } catch(e) {
            parsedUrl = { pathname: urlStr, searchParams: new URLSearchParams() };
        }
        const pathname = parsedUrl.pathname;

        const makeResponse = (data, status = 200) => {
            return {
                ok: status >= 200 && status < 300,
                status: status,
                json: async () => data,
                text: async () => (typeof data === 'string' ? data : JSON.stringify(data)),
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                })
            };
        };

        const getAuthCode = () => {
            const authHeader = headers['Authorization'] || headers['authorization'] || '';
            if (authHeader.startsWith('Bearer ')) {
                return authHeader.split(' ')[1];
            }
            return '';
        };

        const triggerBackendSync = (message) => {
            const backendUrl = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.syncBackendUrl) || 'http://localhost:3001';
            const code = getAuthCode();
            nativeFetch(backendUrl + '/api/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${code}`,
                    'X-Admin-Name': 'Administrador KVT-3D'
                },
                body: JSON.stringify({
                    commitMessage: message || 'Atualização automática pelo painel administrativo',
                    adminName: 'Administrador KVT-3D'
                })
            }).catch(err => console.warn('Falha ao acionar sincronização no backend:', err));
        };

        try {
            if (!window.supabaseClient) {
                console.error('Supabase client não carregado!');
                return makeResponse({ error: 'Erro de conexão com o banco de dados Supabase.' }, 500);
            }

            // 1. AUTH CHECK
            if (pathname.endsWith('/api/auth/check')) {
                const code = getAuthCode();
                const { data, error } = await window.supabaseClient
                    .from('configuracoes')
                    .select('value')
                    .eq('key', 'auth')
                    .single();
                if (error || !data || data.value.access_code !== code) {
                    return makeResponse({ error: 'Sessão inválida ou expirada.' }, 401);
                }
                return makeResponse({ valid: true });
            }

            // 2. AUTH LOGIN
            if (pathname.endsWith('/api/auth/login')) {
                const body = JSON.parse(options.body);
                const code = body.code;
                const { data, error } = await window.supabaseClient
                    .from('configuracoes')
                    .select('value')
                    .eq('key', 'auth')
                    .single();
                if (error || !data) {
                    return makeResponse({ error: 'Erro ao conectar ao banco de dados.' }, 500);
                }
                if (data.value.access_code === code) {
                    return makeResponse({
                        token: code,
                        user: { username: 'admin', role: 'superadmin', name: 'Administrador KVT-3D' }
                    });
                } else {
                    return makeResponse({ error: 'Código de acesso incorreto.' }, 401);
                }
            }

            // 3. DASHBOARD STATS
            if (pathname.endsWith('/api/dashboard')) {
                const { data: produtos } = await window.supabaseClient.from('produtos').select('*');
                const { data: categorias } = await window.supabaseClient.from('categorias').select('*');
                
                let totalImagens = 0;
                try {
                    const { data: files } = await window.supabaseClient.storage.from('media').list();
                    totalImagens = files ? files.filter(f => f.name !== '.emptyFolderPlaceholder').length : 0;
                } catch (e) {
                    console.warn('Erro ao obter total de imagens:', e);
                }

                const totalProdutos = produtos ? produtos.length : 0;
                const ativos = produtos ? produtos.filter(p => p.ativo !== false).length : 0;
                const inativos = totalProdutos - ativos;
                const destaque = produtos ? produtos.filter(p => p.destaque).length : 0;
                const promocao = produtos ? produtos.filter(p => p.promocao).length : 0;
                const novos = produtos ? produtos.filter(p => p.novo).length : 0;
                const maisVendidos = produtos ? produtos.filter(p => p.mais_vendido).length : 0;
                const totalCategorias = categorias ? categorias.length : 0;

                const ultimosAdicionados = [...(produtos || [])]
                    .sort((a, b) => new Date(b.data) - new Date(a.data))
                    .slice(0, 5)
                    .map(p => ({ id: p.id, nome: p.nome, data: p.data, ativo: p.ativo !== false }));

                return makeResponse({
                    stats: {
                        totalProdutos, ativos, inativos, destaque, promocao, novos, maisVendidos, totalCategorias, totalImagens
                    },
                    ultimosAdicionados
                });
            }

            // 4. LIST & CREATE PRODUCTS
            if (pathname.endsWith('/api/produtos')) {
                if (method === 'GET') {
                    const { data } = await window.supabaseClient.from('produtos').select('*').order('data', { ascending: false });
                    const products = (data || []).map(p => ({
                        id: p.id,
                        nome: p.nome,
                        precoUnidade: p.preco_unidade === null ? undefined : (isNaN(Number(p.preco_unidade)) ? p.preco_unidade : Number(p.preco_unidade)),
                        precoUnidade5: p.preco_unidade_5 ? Number(p.preco_unidade_5) : undefined,
                        precoUnidade50: p.preco_unidade_50 ? Number(p.preco_unidade_50) : undefined,
                        categoria: p.categoria,
                        descricao: p.descricao,
                        imagem: p.imagem,
                        imagensExtras: p.imagens_extras || [],
                        data: p.data,
                        ativo: p.ativo !== false,
                        destaque: !!p.destaque,
                        promocao: !!p.promocao,
                        novo: !!p.novo,
                        maisVendido: !!p.mais_vendido,
                        mensagemCustomizada: p.mensagem_customizada
                    }));
                    return makeResponse(products);
                }
                if (method === 'POST') {
                    const body = JSON.parse(options.body);
                    const payload = {
                        id: body.id,
                        nome: body.nome,
                        preco_unidade: body.precoUnidade === undefined ? null : String(body.precoUnidade),
                        preco_unidade_5: body.precoUnidade5 ? Number(body.precoUnidade5) : null,
                        preco_unidade_50: body.precoUnidade50 ? Number(body.precoUnidade50) : null,
                        categoria: body.categoria,
                        descricao: body.descricao,
                        imagem: body.imagem,
                        imagens_extras: body.imagensExtras || [],
                        data: body.data || new Date().toISOString().split('T')[0],
                        ativo: body.ativo !== false,
                        destaque: !!body.destaque,
                        promocao: !!body.promocao,
                        novo: !!body.novo,
                        mais_vendido: !!body.maisVendido,
                        mensagem_customizada: body.mensagemCustomizada || null
                    };
                    const { data, error } = await window.supabaseClient.from('produtos').insert([payload]).select().single();
                    if (error) return makeResponse({ error: error.message }, 400);
                    triggerBackendSync(`Produto KF${data.id} adicionado automaticamente: ${body.nome}`);
                    return makeResponse({
                        ...body,
                        id: data.id,
                        data: data.data
                    }, 201);
                }
            }

            // 5. DUPLICATE PRODUCT
            if (pathname.includes('/api/produtos/duplicate/')) {
                const id = pathname.split('/').pop();
                const { data: original, error: getErr } = await window.supabaseClient.from('produtos').select('*').eq('id', id).single();
                if (getErr || !original) return makeResponse({ error: 'Produto original não encontrado.' }, 404);
                
                const { data: allProds } = await window.supabaseClient.from('produtos').select('id');
                let maxNum = 0;
                (allProds || []).forEach(p => {
                    if (p.id && p.id.startsWith('KF')) {
                        const num = parseInt(p.id.substring(2));
                        if (!isNaN(num) && num > maxNum) maxNum = num;
                    }
                });
                const nextId = 'KF' + String(maxNum + 1).padStart(3, '0');
                
                const duplicated = {
                    ...original,
                    id: nextId,
                    nome: `${original.nome} - Cópia`,
                    data: new Date().toISOString().split('T')[0]
                };
                
                const { data, error } = await window.supabaseClient.from('produtos').insert([duplicated]).select().single();
                if (error) return makeResponse({ error: error.message }, 400);
                triggerBackendSync(`Produto duplicado automaticamente: de ${id} para ${nextId}`);
                return makeResponse({
                    id: data.id,
                    nome: data.nome,
                    precoUnidade: data.preco_unidade === null ? undefined : (isNaN(Number(data.preco_unidade)) ? data.preco_unidade : Number(data.preco_unidade)),
                    precoUnidade5: data.preco_unidade_5 ? Number(data.preco_unidade_5) : undefined,
                    precoUnidade50: data.preco_unidade_50 ? Number(data.preco_unidade_50) : undefined,
                    categoria: data.categoria,
                    descricao: data.descricao,
                    imagem: data.imagem,
                    imagensExtras: data.imagens_extras || [],
                    data: data.data,
                    ativo: data.ativo !== false,
                    destaque: !!data.destaque,
                    promocao: !!data.promocao,
                    novo: !!data.novo,
                    maisVendido: !!data.mais_vendido,
                    mensagemCustomizada: data.mensagem_customizada
                }, 201);
            }

            // 6. UPDATE & DELETE PRODUCT
            if (pathname.includes('/api/produtos/') && !pathname.includes('/duplicate/')) {
                const id = pathname.split('/').pop();
                if (method === 'PUT') {
                    const body = JSON.parse(options.body);
                    const payload = {};
                    if (body.nome !== undefined) payload.nome = body.nome;
                    if (body.categoria !== undefined) payload.categoria = body.categoria;
                    if (body.descricao !== undefined) payload.descricao = body.descricao;
                    if (body.precoUnidade !== undefined) payload.preco_unidade = body.precoUnidade === null ? null : String(body.precoUnidade);
                    if (body.precoUnidade5 !== undefined) payload.preco_unidade_5 = body.precoUnidade5 === "" ? null : Number(body.precoUnidade5);
                    if (body.precoUnidade50 !== undefined) payload.preco_unidade_50 = body.precoUnidade50 === "" ? null : Number(body.precoUnidade50);
                    if (body.imagem !== undefined) payload.imagem = body.imagem;
                    if (body.imagensExtras !== undefined) payload.imagens_extras = body.imagensExtras;
                    if (body.ativo !== undefined) payload.ativo = body.ativo;
                    if (body.destaque !== undefined) payload.destaque = body.destaque;
                    if (body.promocao !== undefined) payload.promocao = body.promocao;
                    if (body.novo !== undefined) payload.novo = body.novo;
                    if (body.maisVendido !== undefined) payload.mais_vendido = body.maisVendido;
                    if (body.mensagemCustomizada !== undefined) payload.mensagem_customizada = body.mensagemCustomizada;

                    const { data, error } = await window.supabaseClient.from('produtos').update(payload).eq('id', id).select().single();
                    if (error) return makeResponse({ error: error.message }, 400);
                    triggerBackendSync(`Produto ${id} atualizado: ${body.nome || data.nome}`);
                    return makeResponse({
                        ...body,
                        id: data.id,
                        data: data.data,
                        ativo: data.ativo !== false,
                        destaque: !!data.destaque,
                        promocao: !!data.promocao,
                        novo: !!data.novo,
                        maisVendido: !!data.mais_vendido
                    });
                }
                if (method === 'DELETE') {
                    const { error } = await window.supabaseClient.from('produtos').delete().eq('id', id);
                    if (error) return makeResponse({ error: error.message }, 400);
                    triggerBackendSync(`Produto ${id} excluído automaticamente`);
                    return makeResponse({ success: true });
                }
            }

            // 7. LIST & CREATE CATEGORIES
            if (pathname.endsWith('/api/categorias')) {
                if (method === 'GET') {
                    const { data } = await window.supabaseClient.from('categorias').select('*').order('ordem', { ascending: true });
                    return makeResponse(data || []);
                }
                if (method === 'POST') {
                    const body = JSON.parse(options.body);
                    const payload = {
                        slug: body.slug,
                        nome: body.nome,
                        ordem: Number(body.ordem) || 0,
                        ativa: body.ativa !== false
                    };
                    const { data, error } = await window.supabaseClient.from('categorias').insert([payload]).select().single();
                    if (error) return makeResponse({ error: error.message }, 400);
                    triggerBackendSync(`Categoria '${payload.slug}' criada automaticamente: ${body.nome}`);
                    return makeResponse(data, 201);
                }
            }

            // 8. UPDATE & DELETE CATEGORIES
            if (pathname.includes('/api/categorias/')) {
                const slug = pathname.split('/').pop();
                if (method === 'PUT') {
                    const body = JSON.parse(options.body);
                    const payload = {
                        nome: body.nome,
                        slug: body.slug,
                        ordem: Number(body.ordem) || 0,
                        ativa: body.ativa !== false
                    };
                    const { data, error } = await window.supabaseClient.from('categorias').update(payload).eq('slug', slug).select().single();
                    if (error) return makeResponse({ error: error.message }, 400);
                    triggerBackendSync(`Categoria '${slug}' atualizada automaticamente: ${body.nome || data.nome}`);
                    return makeResponse(data);
                }
                if (method === 'DELETE') {
                    const { error } = await window.supabaseClient.from('categorias').delete().eq('slug', slug);
                    if (error) return makeResponse({ error: error.message }, 400);
                    triggerBackendSync(`Categoria '${slug}' excluída automaticamente`);
                    return makeResponse({ success: true });
                }
            }

            // 9. CONFIGS
            if (pathname.endsWith('/api/config')) {
                if (method === 'GET') {
                    const { data } = await window.supabaseClient.from('configuracoes').select('*');
                    const config = {};
                    (data || []).forEach(c => {
                        config[c.key] = c.value;
                    });
                    return makeResponse(config);
                }
                if (method === 'PUT') {
                    const body = JSON.parse(options.body);
                    let keysChanged = [];
                    for (const key of ['hero', 'configuracoes', 'tema', 'seo']) {
                        if (body[key] !== undefined) {
                            await window.supabaseClient.from('configuracoes').upsert({ key: key, value: body[key] });
                            keysChanged.push(key);
                        }
                    }
                    triggerBackendSync(`Configurações/Banners (${keysChanged.join(', ')}) atualizadas`);
                    return makeResponse({ success: true });
                }
            }

            // 10. MEDIA GET, DELETE & UPLOAD (FORWARD TO BACKEND TO BYPASS RLS)
            if (pathname.includes('/api/media')) {
                const backendUrl = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.syncBackendUrl) || 'http://localhost:3001';
                const code = getAuthCode();
                
                const fetchOptions = {
                    method: method,
                    headers: {
                        'Authorization': `Bearer ${code}`
                    }
                };
                
                if (method === 'POST') {
                    fetchOptions.body = options.body; // Forward FormData
                }
                
                try {
                    const response = await nativeFetch(backendUrl + pathname + (parsedUrl.search || ''), fetchOptions);
                    const resData = await response.json();
                    return makeResponse(resData, response.status);
                } catch (e) {
                    console.error('Failed to forward media request to backend:', e);
                    return makeResponse({ error: 'Erro ao conectar ao servidor de mídias.' }, 500);
                }
            }

            // 12. BACKUPS
            if (pathname.endsWith('/api/backup/list')) {
                const { data, error } = await window.supabaseClient
                    .from('backups')
                    .select('name, date')
                    .order('date', { ascending: false });
                if (error) return makeResponse([]);
                const mapped = (data || []).map(b => ({
                    name: b.name,
                    date: b.date,
                    size: 'N/A'
                }));
                return makeResponse(mapped);
            }

            if (pathname.endsWith('/api/backup/create')) {
                const { data: prods } = await window.supabaseClient.from('produtos').select('*');
                const { data: cats } = await window.supabaseClient.from('categorias').select('*');
                const { data: configs } = await window.supabaseClient.from('configuracoes').select('*');
                
                const snapshot = {
                    produtos: prods || [],
                    categorias: cats || [],
                    configuracoes: configs || []
                };
                
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const backupName = `backup_${timestamp}`;
                
                const { error } = await window.supabaseClient
                    .from('backups')
                    .insert([{ name: backupName, data: snapshot }]);
                    
                if (error) return makeResponse({ error: error.message }, 400);
                return makeResponse({ success: true, message: `Backup '${backupName}' criado com sucesso.` });
            }

            if (pathname.endsWith('/api/backup/restore')) {
                const { backupName } = JSON.parse(options.body);
                const { data: backup, error: getErr } = await window.supabaseClient
                    .from('backups')
                    .select('data')
                    .eq('name', backupName)
                    .single();
                if (getErr || !backup) return makeResponse({ error: 'Backup não encontrado.' }, 404);
                
                const snapshot = backup.data;
                
                if (snapshot.categorias) {
                    await window.supabaseClient.from('categorias').delete().neq('slug', '');
                    if (snapshot.categorias.length > 0) {
                        await window.supabaseClient.from('categorias').insert(snapshot.categorias);
                    }
                }
                
                if (snapshot.produtos) {
                    await window.supabaseClient.from('produtos').delete().neq('id', '');
                    if (snapshot.produtos.length > 0) {
                        await window.supabaseClient.from('produtos').insert(snapshot.produtos);
                    }
                }
                
                if (snapshot.configuracoes) {
                    await window.supabaseClient.from('configuracoes').delete().neq('key', '');
                    if (snapshot.configuracoes.length > 0) {
                        await window.supabaseClient.from('configuracoes').insert(snapshot.configuracoes);
                    }
                }
                
                return makeResponse({ success: true, message: `Backup '${backupName}' restaurado com sucesso.` });
            }

            // 13. CSV IMPORT
            if (pathname.endsWith('/api/backup/import-products')) {
                const csvText = options.body;
                const lines = csvText.split(/\r?\n/);
                if (lines.length < 2) return makeResponse({ error: 'CSV inválido.' }, 400);
                const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
                const parsedProducts = [];
                
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
                    const rowVals = matches.map(v => v.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
                    const prod = {};
                    headers.forEach((h, idx) => { prod[h] = rowVals[idx] || ''; });
                    
                    if (prod.id && prod.nome) {
                        parsedProducts.push({
                            id: prod.id,
                            nome: prod.nome,
                            preco_unidade: prod.precoUnidade === 'Promoção surpresa' ? 'Promoção surpresa' : (prod.precoUnidade ? String(prod.precoUnidade) : null),
                            preco_unidade_5: prod.precoUnidade5 ? Number(prod.precoUnidade5) : null,
                            preco_unidade_50: prod.precoUnidade50 ? Number(prod.precoUnidade50) : null,
                            categoria: prod.categoria,
                            descricao: prod.descricao,
                            imagem: prod.imagem || 'img/placeholder.jpg',
                            imagens_extras: prod.imagensExtras ? (typeof prod.imagensExtras === 'string' && prod.imagensExtras.startsWith('[') ? JSON.parse(prod.imagensExtras) : prod.imagensExtras.split(';')) : [],
                            data: prod.data || new Date().toISOString().split('T')[0],
                            ativo: prod.ativo === 'true' || prod.ativo === true,
                            destaque: prod.destaque === 'true' || prod.destaque === true,
                            promocao: prod.promocao === 'true' || prod.promocao === true,
                            novo: prod.novo === 'true' || prod.novo === true,
                            mais_vendido: prod.maisVendido === 'true' || prod.maisVendido === true,
                            mensagem_customizada: prod.mensagemCustomizada || null
                        });
                    }
                }
                
                if (parsedProducts.length > 0) {
                    const { error } = await window.supabaseClient.from('produtos').upsert(parsedProducts);
                    if (error) return makeResponse({ error: error.message }, 400);
                }
                return makeResponse({ success: true, count: parsedProducts.length, message: `${parsedProducts.length} produtos importados/atualizados com sucesso.` });
            }

            return makeResponse({ error: 'Rota não encontrada' }, 404);

        } catch (err) {
            console.error('Erro no mock API Supabase:', err);
            return makeResponse({ error: err.message || 'Erro interno' }, 500);
        }
    };
})();
