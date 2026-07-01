// APP JS - Frontend do Painel Administrativo KVT-3D
const API_URL = window.location.port !== '3000' ? 'http://localhost:3000' : ''; // Suporta execução local via file://, Live Server (5500) ou outras portas

// Estado global do admin
const state = {
    token: localStorage.getItem('admin_token') || '',
    activeView: 'dashboard',
    products: [],
    categories: [],
    media: [],
    backups: [],
    config: {},
    mediaSelectorTarget: null // Armazena qual campo receberá a imagem selecionada
};

// Headers de API com token
function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
    };
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initTheme();
    setupNavigation();
    setupForms();
});

// ==========================================
// 1. SISTEMA DE AUTENTICAÇÃO
// ==========================================
function initAuth() {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    
    if (state.token) {
        // Verificar se token ainda é válido no servidor
        fetch(API_URL + '/api/auth/check', {
            headers: getHeaders()
        })
        .then(res => {
            if (res.ok) {
                showAdminPanel();
            } else {
                logout();
            }
        })
        .catch(() => {
            // Em caso de falha de conexão, confia no token local
            showAdminPanel();
        });
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const codeInput = document.getElementById('access-code');
        const code = codeInput.value.trim();
        
        try {
            const res = await fetch(API_URL + '/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });
            
            const data = await res.json();
            
            if (res.ok) {
                state.token = data.token;
                localStorage.setItem('admin_token', data.token);
                loginError.style.display = 'none';
                codeInput.value = '';
                showAdminPanel();
            } else {
                loginError.textContent = data.error || 'Código incorreto.';
                loginError.style.display = 'block';
            }
        } catch (err) {
            loginError.textContent = 'Erro ao se conectar ao servidor.';
            loginError.style.display = 'block';
        }
    });

    document.getElementById('logout-btn').addEventListener('click', logout);
}

function showAdminPanel() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-app').style.display = 'flex';
    
    // Carregar dados iniciais
    switchView(state.activeView);
}

function logout() {
    state.token = '';
    localStorage.removeItem('admin_token');
    document.getElementById('admin-app').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
}

// ==========================================
// 2. CONTROLE DE TEMA (CLARO/ESCURO NO ADMIN)
// ==========================================
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('admin_theme') || 'dark';
    
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    themeBtn.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.replace('dark-theme', 'light-theme');
            themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem('admin_theme', 'light');
        } else {
            document.body.classList.replace('light-theme', 'dark-theme');
            themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            localStorage.setItem('admin_theme', 'dark');
        }
    });
}

// ==========================================
// 3. NAVEGAÇÃO E TABS
// ==========================================
function setupNavigation() {
    const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            switchView(view);
        });
    });

    // Abas internas de Configurações
    const settingsTabBtns = document.querySelectorAll('.settings-tab-btn');
    settingsTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            settingsTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const tabName = btn.dataset.settingsTab;
            document.querySelectorAll('.settings-tab-content').forEach(content => {
                content.style.display = 'none';
            });
            document.getElementById(`settings-tab-${tabName}`).style.display = 'block';
            
            if (tabName === 'media') {
                loadMediaLibrary();
            }
        });
    });
}

function switchView(viewName) {
    state.activeView = viewName;
    
    // Atualizar menu ativo
    document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
        if (item.dataset.view === viewName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Atualizar título do Header
    const titles = {
        dashboard: 'Dashboard',
        products: 'Gerenciamento de Produtos',
        categories: 'Categorias de Produtos',
        banners: 'Configuração de Banners',
        settings: 'Configurações da Loja',
        seo: 'SEO & Rastreamento',
        backup: 'Backups & Importação'
    };
    document.getElementById('view-title').textContent = titles[viewName] || 'Painel';
    
    // Ocultar todas as seções e mostrar a correta
    document.querySelectorAll('.view-section').forEach(sec => {
        sec.style.display = 'none';
    });
    const targetSection = document.getElementById(`${viewName}-view`);
    if (targetSection) targetSection.style.display = 'block';
    
    // Carregar dados específicos da view
    if (viewName === 'dashboard') loadDashboard();
    else if (viewName === 'products') loadProducts();
    else if (viewName === 'categories') loadCategories();
    else if (viewName === 'banners' || viewName === 'settings' || viewName === 'seo') loadSettingsData();
    else if (viewName === 'backup') loadBackups();
}

// ==========================================
// 4. VIEW: DASHBOARD
// ==========================================
async function loadDashboard() {
    try {
        const res = await fetch(API_URL + '/api/dashboard', { headers: getHeaders() });
        if (!res.ok) throw new Error('Não autorizado');
        const data = await res.json();
        
        // Alimentar os cards
        document.getElementById('stat-total-products').textContent = data.stats.totalProdutos;
        document.getElementById('stat-active-products').textContent = data.stats.ativos;
        document.getElementById('stat-inactive-products').textContent = data.stats.inativos;
        document.getElementById('stat-featured-products').textContent = data.stats.destaque;
        document.getElementById('stat-promo-products').textContent = data.stats.promocao;
        document.getElementById('stat-total-categories').textContent = data.stats.totalCategorias;
        document.getElementById('stat-total-images').textContent = data.stats.totalImagens;
        
        // Últimos adicionados
        const tbody = document.getElementById('recent-products-table');
        tbody.innerHTML = data.ultimosAdicionados.map(p => `
            <tr>
                <td><strong>#${p.id}</strong></td>
                <td>${p.nome}</td>
                <td>${formatDate(p.data)}</td>
                <td>
                    <span class="badge ${p.ativo ? 'badge-success' : 'badge-danger'}">
                        ${p.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="4" class="text-center">Nenhum produto cadastrado.</td></tr>';
        
    } catch (err) {
        logout();
    }
}

// ==========================================
// 5. VIEW: PRODUTOS (CRUD)
// ==========================================
async function loadProducts() {
    try {
        // Carregar categorias primeiro para o filtro e modal
        await loadCategoriesDataOnly();
        
        const res = await fetch(API_URL + '/api/produtos', { headers: getHeaders() });
        state.products = await res.json();
        
        renderProductsTable();
    } catch (err) {
        alert('Erro ao carregar produtos.');
    }
}

function renderProductsTable() {
    const tbody = document.getElementById('products-table-body');
    const searchVal = document.getElementById('product-search-input').value.toLowerCase();
    const filterCat = document.getElementById('product-filter-category').value;
    const filterStatus = document.getElementById('product-filter-status').value;
    
    let filtered = state.products;
    
    // Aplicar filtros
    if (searchVal) {
        filtered = filtered.filter(p => p.nome.toLowerCase().includes(searchVal) || p.id.toLowerCase().includes(searchVal));
    }
    if (filterCat) {
        filtered = filtered.filter(p => p.categoria === filterCat);
    }
    if (filterStatus) {
        const activeFlag = filterStatus === 'ativo';
        filtered = filtered.filter(p => (p.ativo !== false) === activeFlag);
    }
    
    tbody.innerHTML = filtered.map(p => {
        const precoFmt = typeof p.precoUnidade === 'number' ? `R$ ${p.precoUnidade.toFixed(2)}` : p.precoUnidade;
        const atacado5 = p.precoUnidade5 ? `5+: R$ ${p.precoUnidade5.toFixed(2)}` : '';
        const atacado50 = p.precoUnidade50 ? `50+: R$ ${p.precoUnidade50.toFixed(2)}` : '';
        const atacadoText = [atacado5, atacado50].filter(Boolean).join('<br>') || 'Nenhum';
        
        const isProductActive = p.ativo !== false;
        
        return `
            <tr>
                <td><img src="../${p.imagem}" class="table-img" onerror="this.src='../img/placeholder.jpg'"></td>
                <td><strong>#${p.id}</strong></td>
                <td>
                    <div style="font-weight: 500;">${p.nome}</div>
                    <div style="display:flex; gap: 4px; margin-top: 4px;">
                        ${p.novo ? '<span class="badge badge-success" style="font-size:0.65rem; padding: 2px 6px;">Novo</span>' : ''}
                        ${p.promocao ? '<span class="badge badge-warning" style="font-size:0.65rem; padding: 2px 6px;">Promo</span>' : ''}
                        ${p.destaque ? '<span class="badge badge-info" style="font-size:0.65rem; padding: 2px 6px;">Destaque</span>' : ''}
                        ${p.maisVendido ? '<span class="badge badge-success" style="font-size:0.65rem; padding: 2px 6px; background-color: var(--purple-soft); color: var(--purple);">Top</span>' : ''}
                    </div>
                </td>
                <td><span class="badge badge-info">${p.categoria}</span></td>
                <td><strong>${precoFmt}</strong></td>
                <td style="font-size:0.75rem;">${atacadoText}</td>
                <td>
                    <button class="action-btn" onclick="toggleProductStatus('${p.id}', ${isProductActive})" title="${isProductActive ? 'Desativar' : 'Ativar'}">
                        <i class="fa-solid ${isProductActive ? 'fa-toggle-on text-success' : 'fa-toggle-off text-muted'}"></i>
                    </button>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn" onclick="openProductModal('${p.id}')" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="action-btn" onclick="duplicateProduct('${p.id}')" title="Duplicar"><i class="fa-solid fa-copy"></i></button>
                        <button class="action-btn action-btn-danger" onclick="deleteProduct('${p.id}')" title="Excluir"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('') || '<tr><td colspan="8" class="text-center">Nenhum produto correspondente.</td></tr>';
}

// Ouvintes de evento para os filtros de produto
document.getElementById('product-search-input').addEventListener('input', renderProductsTable);
document.getElementById('product-filter-category').addEventListener('change', renderProductsTable);
document.getElementById('product-filter-status').addEventListener('change', renderProductsTable);

// Toggle rápido Ativo/Inativo do produto
async function toggleProductStatus(id, currentStatus) {
    try {
        const res = await fetch(`${API_URL}/api/produtos/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ ativo: !currentStatus })
        });
        if (res.ok) {
            const updated = await res.json();
            // Atualizar no estado local
            const idx = state.products.findIndex(p => p.id === id);
            if (idx !== -1) state.products[idx] = updated;
            renderProductsTable();
        }
    } catch (err) {
        alert('Erro ao alterar status do produto.');
    }
}

// Duplicar produto
async function duplicateProduct(id) {
    try {
        const res = await fetch(`${API_URL}/api/produtos/duplicate/${id}`, {
            method: 'POST',
            headers: getHeaders()
        });
        if (res.ok) {
            const duplicated = await res.json();
            state.products.push(duplicated);
            renderProductsTable();
            alert('Produto duplicado com sucesso!');
        }
    } catch (err) {
        alert('Erro ao duplicar produto.');
    }
}

// Excluir produto
async function deleteProduct(id) {
    if (!confirm(`Deseja realmente excluir o produto #${id}? Esta ação não pode ser desfeita.`)) return;
    
    try {
        const res = await fetch(`${API_URL}/api/produtos/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (res.ok) {
            state.products = state.products.filter(p => p.id !== id);
            renderProductsTable();
        }
    } catch (err) {
        alert('Erro ao excluir produto.');
    }
}

// Abrir Modal de Produto (Add/Edit)
function openProductModal(id = null) {
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    const title = document.getElementById('product-modal-title');
    const customIdInput = document.getElementById('product-id-custom');
    
    // Preencher select de categorias no formulário
    const selectCat = document.getElementById('product-category');
    selectCat.innerHTML = state.categories.map(c => `<option value="${c.slug}">${c.nome}</option>`).join('');
    
    form.reset();
    document.getElementById('product-gallery-list').innerHTML = '';
    
    if (id) {
        // EDITAR
        const p = state.products.find(prod => prod.id === id);
        if (!p) return;
        
        title.textContent = `Editar Produto #${id}`;
        document.getElementById('product-action-hidden').value = 'edit';
        document.getElementById('product-id-hidden').value = id;
        customIdInput.value = p.id;
        customIdInput.disabled = true; // Não permite mudar ID de produto existente
        
        document.getElementById('product-name').value = p.nome;
        document.getElementById('product-category').value = p.categoria;
        document.getElementById('product-desc').value = p.descricao;
        document.getElementById('product-price').value = p.precoUnidade;
        document.getElementById('product-price5').value = p.precoUnidade5 || '';
        document.getElementById('product-price50').value = p.precoUnidade50 || '';
        document.getElementById('product-main-image').value = p.imagem;
        
        document.getElementById('product-mark-new').checked = !!p.novo;
        document.getElementById('product-mark-promo').checked = !!p.promocao;
        document.getElementById('product-mark-featured').checked = !!p.destaque;
        document.getElementById('product-mark-bestseller').checked = !!p.maisVendido;
        document.getElementById('product-status-active').checked = p.ativo !== false;
        document.getElementById('product-whatsapp-message').value = p.mensagemCustomizada || '';
        
        // Carregar imagens extras da galeria
        if (p.imagensExtras && p.imagensExtras.length > 0) {
            p.imagensExtras.forEach(img => addImageToGalleryList(img));
        }
    } else {
        // ADICIONAR
        title.textContent = 'Novo Produto';
        document.getElementById('product-action-hidden').value = 'add';
        document.getElementById('product-id-hidden').value = '';
        customIdInput.value = '';
        customIdInput.disabled = false;
        
        document.getElementById('product-status-active').checked = true;
    }
    
    modal.classList.add('active');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('active');
}

function addImageToGalleryList(imgSrc) {
    const list = document.getElementById('product-gallery-list');
    const div = document.createElement('div');
    div.className = 'gallery-item-thumb';
    div.innerHTML = `
        <img src="../${imgSrc}" onerror="this.src='../img/placeholder.jpg'">
        <input type="hidden" name="gallery-images[]" value="${imgSrc}">
        <button type="button" class="gallery-item-remove-btn" onclick="this.parentElement.remove();">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;
    list.appendChild(div);
}

// Salvar Produto (Submit Form)
document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const action = document.getElementById('product-action-hidden').value;
    const id = document.getElementById('product-id-hidden').value;
    
    // Obter imagens da galeria
    const galleryInputs = document.querySelectorAll('input[name="gallery-images[]"]');
    const imagensExtras = Array.from(galleryInputs).map(inp => inp.value);
    
    const payload = {
        nome: document.getElementById('product-name').value,
        categoria: document.getElementById('product-category').value,
        descricao: document.getElementById('product-desc').value,
        precoUnidade: document.getElementById('product-price').value,
        precoUnidade5: document.getElementById('product-price5').value || "",
        precoUnidade50: document.getElementById('product-price50').value || "",
        imagem: document.getElementById('product-main-image').value,
        imagensExtras: imagensExtras,
        novo: document.getElementById('product-mark-new').checked,
        promocao: document.getElementById('product-mark-promo').checked,
        destaque: document.getElementById('product-mark-featured').checked,
        maisVendido: document.getElementById('product-mark-bestseller').checked,
        ativo: document.getElementById('product-status-active').checked,
        mensagemCustomizada: document.getElementById('product-whatsapp-message').value
    };
    
    if (action === 'add') {
        const customId = document.getElementById('product-id-custom').value.trim();
        if (customId) payload.id = customId;
    }
    
    try {
        let res;
        if (action === 'edit') {
            res = await fetch(`${API_URL}/api/produtos/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });
        } else {
            res = await fetch(API_URL + '/api/produtos', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });
        }
        
        if (res.ok) {
            alert('Produto salvo com sucesso!');
            closeProductModal();
            loadProducts();
        } else {
            const data = await res.json();
            alert(`Erro ao salvar: ${data.error}`);
        }
    } catch (err) {
        alert('Erro ao salvar produto no servidor.');
    }
});

// ==========================================
// 6. VIEW: CATEGORIAS
// ==========================================
async function loadCategories() {
    try {
        const res = await fetch(API_URL + '/api/categorias', { headers: getHeaders() });
        state.categories = await res.json();
        
        const tbody = document.getElementById('categories-table-body');
        
        tbody.innerHTML = state.categories.map(c => `
            <tr>
                <td><strong>#${c.ordem || 0}</strong></td>
                <td><code>${c.slug}</code></td>
                <td>${c.nome}</td>
                <td>
                    <span class="badge ${c.ativa !== false ? 'badge-success' : 'badge-danger'}">
                        ${c.ativa !== false ? 'Ativa' : 'Inativa'}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn" onclick="openCategoryModal('${c.slug}')" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="action-btn action-btn-danger" onclick="deleteCategory('${c.slug}')" title="Excluir"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="5" class="text-center">Nenhuma categoria cadastrada.</td></tr>';
        
    } catch (err) {
        alert('Erro ao carregar categorias.');
    }
}

// Carrega categorias apenas em variáveis auxiliares (ex: para dropdowns)
async function loadCategoriesDataOnly() {
    const res = await fetch(API_URL + '/api/categorias', { headers: getHeaders() });
    state.categories = await res.json();
    
    // Preencher select de filtros
    const filterCat = document.getElementById('product-filter-category');
    filterCat.innerHTML = '<option value="">Todas as Categorias</option>' + 
        state.categories.map(c => `<option value="${c.slug}">${c.nome}</option>`).join('');
}

function openCategoryModal(slug = null) {
    const modal = document.getElementById('category-modal');
    const form = document.getElementById('category-form');
    const title = document.getElementById('category-modal-title');
    const slugInput = document.getElementById('category-slug');
    
    form.reset();
    
    if (slug) {
        // EDITAR
        const c = state.categories.find(cat => cat.slug === slug);
        if (!c) return;
        
        title.textContent = `Editar Categoria: ${c.nome}`;
        document.getElementById('category-action-hidden').value = 'edit';
        document.getElementById('category-slug-hidden').value = slug;
        
        document.getElementById('category-name').value = c.nome;
        slugInput.value = c.slug;
        document.getElementById('category-order').value = c.ordem || 1;
        document.getElementById('category-active').checked = c.ativa !== false;
    } else {
        // ADICIONAR
        title.textContent = 'Nova Categoria';
        document.getElementById('category-action-hidden').value = 'add';
        document.getElementById('category-slug-hidden').value = '';
        
        document.getElementById('category-order').value = state.categories.length + 1;
        document.getElementById('category-active').checked = true;
    }
    
    modal.classList.add('active');
}

function closeCategoryModal() {
    document.getElementById('category-modal').classList.remove('active');
}

// Salvar categoria
document.getElementById('category-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const action = document.getElementById('category-action-hidden').value;
    const oldSlug = document.getElementById('category-slug-hidden').value;
    
    const payload = {
        nome: document.getElementById('category-name').value,
        slug: document.getElementById('category-slug').value,
        ordem: document.getElementById('category-order').value,
        ativa: document.getElementById('category-active').checked
    };
    
    try {
        let res;
        if (action === 'edit') {
            res = await fetch(`${API_URL}/api/categorias/${oldSlug}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });
        } else {
            res = await fetch(API_URL + '/api/categorias', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });
        }
        
        if (res.ok) {
            alert('Categoria salva com sucesso!');
            closeCategoryModal();
            loadCategories();
        } else {
            const data = await res.json();
            alert(`Erro ao salvar: ${data.error}`);
        }
    } catch (err) {
        alert('Erro ao salvar categoria no servidor.');
    }
});

// Excluir categoria
async function deleteCategory(slug) {
    if (!confirm(`Deseja realmente excluir a categoria '${slug}'? Os produtos existentes associados a ela permanecerão catalogados.`)) return;
    
    try {
        const res = await fetch(`${API_URL}/api/categorias/${slug}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (res.ok) {
            loadCategories();
        }
    } catch (err) {
        alert('Erro ao excluir categoria.');
    }
}

// ==========================================
// 7. CONFIGURAÇÕES, BANNERS, CORES, SEO
// ==========================================
async function loadSettingsData() {
    try {
        const res = await fetch(API_URL + '/api/config', { headers: getHeaders() });
        state.config = await res.json();
        
        // 1. Preencher Banners/Hero
        const hero = state.config.hero || {};
        document.getElementById('hero-title-input').value = hero.titulo || '';
        document.getElementById('hero-subtitle-input').value = hero.subtitulo || '';
        document.getElementById('hero-btn-primary-text').value = hero.botaoPrincipal?.texto || '';
        document.getElementById('hero-btn-primary-link').value = hero.botaoPrincipal?.link || '';
        document.getElementById('hero-btn-secondary-text').value = hero.botaoSecundario?.texto || '';
        document.getElementById('hero-btn-secondary-link').value = hero.botaoSecundario?.link || '';
        document.getElementById('hero-img-desktop').value = hero.imagemDesktop || '';
        document.getElementById('hero-img-mobile').value = hero.imagemCelular || '';
        
        // 2. Preencher Geral/Loja
        const conf = state.config.configuracoes || {};
        document.getElementById('store-name').value = conf.nomeLoja || '';
        document.getElementById('store-whatsapp').value = conf.whatsapp || '';
        document.getElementById('store-email').value = conf.email || '';
        document.getElementById('store-instagram').value = conf.socialLinks?.instagram || '';
        document.getElementById('store-address').value = conf.endereco || '';
        document.getElementById('store-hours').value = conf.horarioAtendimento || '';
        document.getElementById('store-footer').value = conf.textoRodape || '';
        document.getElementById('store-whatsapp-template').value = conf.mensagemWhatsAppPadrao || '';
        
        // 3. Preencher Cores
        const tema = state.config.tema || {};
        const dark = tema.dark || {};
        const light = tema.light || {};
        
        document.getElementById('color-dark-primary').value = dark.primary || '#8333e3';
        document.getElementById('color-dark-secondary').value = dark.secondary || '#6f42c1';
        document.getElementById('color-dark-accent').value = dark.accent || '#25d366';
        document.getElementById('color-dark-bg').value = dark.bgDark || '#0f0f0f';
        document.getElementById('color-dark-card').value = dark.bgCard || '#1a1a1a';
        document.getElementById('color-dark-text-white').value = dark.textWhite || '#ffffff';
        document.getElementById('color-dark-text-gray').value = dark.textGray || '#b0b0b0';

        document.getElementById('color-light-primary').value = light.primary || '#8333e3';
        document.getElementById('color-light-secondary').value = light.secondary || '#6f42c1';
        document.getElementById('color-light-accent').value = light.accent || '#25d366';
        document.getElementById('color-light-bg').value = light.bgDark || '#f8f9fa';
        document.getElementById('color-light-card').value = light.bgCard || '#ffffff';
        document.getElementById('color-light-text-white').value = light.textWhite || '#1a1a1a';
        document.getElementById('color-light-text-gray').value = light.textGray || '#555555';
        
        // 4. Preencher SEO
        const seo = state.config.seo || {};
        document.getElementById('seo-title').value = seo.siteTitle || '';
        document.getElementById('seo-description').value = seo.metaDescription || '';
        document.getElementById('seo-keywords').value = seo.keywords || '';
        document.getElementById('seo-ga').value = seo.googleAnalytics || '';
        document.getElementById('seo-gsc').value = seo.googleSearchConsole || '';
        document.getElementById('seo-pixel').value = seo.metaPixel || '';
        document.getElementById('seo-scripts').value = seo.customScripts || '';

    } catch (err) {
        alert('Erro ao carregar configurações.');
    }
}

// Configurar Submits
function setupForms() {
    // Banner Hero Submit
    document.getElementById('hero-settings-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const payload = {
            ...state.config,
            hero: {
                titulo: document.getElementById('hero-title-input').value,
                subtitulo: document.getElementById('hero-subtitle-input').value,
                imagemDesktop: document.getElementById('hero-img-desktop').value,
                imagemCelular: document.getElementById('hero-img-mobile').value,
                botaoPrincipal: {
                    texto: document.getElementById('hero-btn-primary-text').value,
                    link: document.getElementById('hero-btn-primary-link').value
                },
                botaoSecundario: {
                    texto: document.getElementById('hero-btn-secondary-text').value,
                    link: document.getElementById('hero-btn-secondary-link').value
                }
            }
        };
        saveConfigPayload(payload);
    });

    // Geral/Loja Submit
    document.getElementById('general-settings-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const payload = {
            ...state.config,
            configuracoes: {
                nomeLoja: document.getElementById('store-name').value,
                whatsapp: document.getElementById('store-whatsapp').value.replace(/\D/g, ''),
                email: document.getElementById('store-email').value,
                socialLinks: {
                    instagram: document.getElementById('store-instagram').value,
                    facebook: '',
                    tiktok: ''
                },
                endereco: document.getElementById('store-address').value,
                horarioAtendimento: document.getElementById('store-hours').value,
                textoRodape: document.getElementById('store-footer').value,
                mensagemWhatsAppPadrao: document.getElementById('store-whatsapp-template').value
            }
        };
        saveConfigPayload(payload);
    });

    // Cores Submit
    document.getElementById('theme-settings-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const payload = {
            ...state.config,
            tema: {
                dark: {
                    primary: document.getElementById('color-dark-primary').value,
                    secondary: document.getElementById('color-dark-secondary').value,
                    accent: document.getElementById('color-dark-accent').value,
                    bgDark: document.getElementById('color-dark-bg').value,
                    bgCard: document.getElementById('color-dark-card').value,
                    textWhite: document.getElementById('color-dark-text-white').value,
                    textGray: document.getElementById('color-dark-text-gray').value
                },
                light: {
                    primary: document.getElementById('color-light-primary').value,
                    secondary: document.getElementById('color-light-secondary').value,
                    accent: document.getElementById('color-light-accent').value,
                    bgDark: document.getElementById('color-light-bg').value,
                    bgCard: document.getElementById('color-light-card').value,
                    textWhite: document.getElementById('color-light-text-white').value,
                    textGray: document.getElementById('color-light-text-gray').value
                }
            }
        };
        saveConfigPayload(payload);
    });

    // SEO Submit
    document.getElementById('seo-settings-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const payload = {
            ...state.config,
            seo: {
                siteTitle: document.getElementById('seo-title').value,
                metaDescription: document.getElementById('seo-description').value,
                keywords: document.getElementById('seo-keywords').value,
                googleAnalytics: document.getElementById('seo-ga').value,
                googleSearchConsole: document.getElementById('seo-gsc').value,
                metaPixel: document.getElementById('seo-pixel').value,
                customScripts: document.getElementById('seo-scripts').value
            }
        };
        saveConfigPayload(payload);
    });

    // Input de arquivo de mídias (Upload Geral)
    const mediaInput = document.getElementById('media-file-input');
    mediaInput.addEventListener('change', () => {
        if (mediaInput.files.length > 0) {
            uploadMediaFiles(mediaInput.files, () => {
                loadMediaLibrary();
                mediaInput.value = '';
            });
        }
    });

    // Importar CSV
    const csvInput = document.getElementById('csv-file-input');
    const csvStatus = document.getElementById('csv-import-status');
    csvInput.addEventListener('change', () => {
        if (csvInput.files.length > 0) {
            const file = csvInput.files[0];
            const reader = new FileReader();
            reader.onload = async (e) => {
                const text = e.target.result;
                csvStatus.innerHTML = '<span class="text-muted"><i class="fa-solid fa-spinner fa-spin"></i> Importando...</span>';
                
                try {
                    const res = await fetch(API_URL + '/api/backup/import-products', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/plain; charset=utf-8',
                            'Authorization': `Bearer ${state.token}`
                        },
                        body: text
                    });
                    
                    const data = await res.json();
                    if (res.ok) {
                        csvStatus.innerHTML = `<span class="badge badge-success">${data.message}</span>`;
                        csvInput.value = '';
                    } else {
                        csvStatus.innerHTML = `<span class="badge badge-danger">Erro: ${data.error}</span>`;
                    }
                } catch (err) {
                    csvStatus.innerHTML = '<span class="badge badge-danger">Erro de rede ao importar.</span>';
                }
            };
            reader.readAsText(file, 'UTF-8');
        }
    });
}

async function saveConfigPayload(payload) {
    try {
        const res = await fetch(API_URL + '/api/config', {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            state.config = payload;
            alert('Configurações salvas e aplicadas na loja com sucesso!');
        } else {
            alert('Erro ao salvar configurações.');
        }
    } catch (err) {
        alert('Erro ao se conectar ao servidor.');
    }
}

// ==========================================
// 8. GERENCIAMENTO DE MÍDIA (BIBLIOTECA)
// ==========================================
async function loadMediaLibrary() {
    try {
        const res = await fetch(API_URL + '/api/media', { headers: getHeaders() });
        state.media = await res.json();
        
        renderMediaLibrary();
    } catch (err) {
        console.error(err);
    }
}

function renderMediaLibrary() {
    const grid = document.getElementById('media-library-grid');
    const searchVal = document.getElementById('media-search').value.toLowerCase();
    
    let filtered = state.media;
    if (searchVal) {
        filtered = filtered.filter(m => m.name.toLowerCase().includes(searchVal));
    }
    
    grid.innerHTML = filtered.map(m => `
        <div class="media-item">
            <div class="media-img-wrapper" title="${m.name}">
                <img src="../${m.path}" loading="lazy">
            </div>
            <div class="media-meta">${m.name}</div>
            <button class="media-item-delete" onclick="deleteMediaFile('${m.path}')" title="Excluir imagem">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    `).join('') || '<div class="col-12 text-center text-muted">Nenhuma imagem na biblioteca.</div>';
}

// Pesquisa de mídia
document.getElementById('media-search').addEventListener('input', renderMediaLibrary);

// Excluir arquivo de mídia
async function deleteMediaFile(path) {
    if (!confirm('Tem certeza de que deseja excluir permanentemente esta imagem? Certifique-se de que nenhum produto a esteja utilizando.')) return;
    
    try {
        const res = await fetch(`${API_URL}/api/media?filePath=${encodeURIComponent(path)}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (res.ok) {
            state.media = state.media.filter(m => m.path !== path);
            renderMediaLibrary();
        } else {
            const data = await res.json();
            alert(`Erro ao excluir: ${data.error}`);
        }
    } catch (err) {
        alert('Erro ao se conectar com o servidor.');
    }
}

// Upload de imagens genérico
async function uploadMediaFiles(files, callback) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }
    
    try {
        const res = await fetch(API_URL + '/api/media/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${state.token}`
            },
            body: formData
        });
        
        if (res.ok) {
            callback();
        } else {
            const data = await res.json();
            alert(`Erro no upload: ${data.error}`);
        }
    } catch (err) {
        alert('Erro ao enviar imagens.');
    }
}

// ==========================================
// 9. MODAL POPUP SELETOR DE IMAGENS (USO EM CAMPOS)
// ==========================================
async function openMediaSelector(targetFieldName) {
    state.mediaSelectorTarget = targetFieldName;
    
    try {
        const res = await fetch(API_URL + '/api/media', { headers: getHeaders() });
        state.media = await res.json();
        
        renderMediaSelector();
        
        // Ouvintes de upload no seletor
        const fileInput = document.getElementById('media-selector-file');
        fileInput.replaceWith(fileInput.cloneNode(true)); // limpa eventos anteriores
        
        document.getElementById('media-selector-file').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                uploadMediaFiles(e.target.files, () => {
                    openMediaSelector(targetFieldName); // Recarrega
                });
            }
        });
        
        document.getElementById('media-selector-modal').classList.add('active');
    } catch (err) {
        alert('Erro ao abrir seletor.');
    }
}

function closeMediaSelector() {
    document.getElementById('media-selector-modal').classList.remove('active');
}

function renderMediaSelector() {
    const grid = document.getElementById('media-selector-grid');
    const searchVal = document.getElementById('media-selector-search').value.toLowerCase();
    
    let filtered = state.media;
    if (searchVal) {
        filtered = filtered.filter(m => m.name.toLowerCase().includes(searchVal));
    }
    
    grid.innerHTML = filtered.map(m => `
        <div class="selector-media-item" onclick="selectImageForTarget('${m.path}')" title="${m.name}">
            <img src="../${m.path}">
        </div>
    `).join('') || '<div style="grid-column: span 6; text-align:center;" class="text-muted">Nenhuma imagem na biblioteca.</div>';
}

document.getElementById('media-selector-search').addEventListener('input', renderMediaSelector);

function selectImageForTarget(path) {
    const target = state.mediaSelectorTarget;
    if (target === 'product-main-image' || target === 'hero-img-desktop' || target === 'hero-img-mobile') {
        document.getElementById(target).value = path;
    } else if (target === 'product-gallery') {
        addImageToGalleryList(path);
    }
    closeMediaSelector();
}

// ==========================================
// 10. BACKUP E RESTAURAÇÃO
// ==========================================
async function loadBackups() {
    try {
        const res = await fetch(API_URL + '/api/backup/list', { headers: getHeaders() });
        state.backups = await res.json();
        
        const tbody = document.getElementById('backups-table-body');
        
        tbody.innerHTML = state.backups.map(b => `
            <tr>
                <td><code>${b.name}</code></td>
                <td>${formatDate(b.date)}</td>
                <td>${b.size}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-outline btn-sm" onclick="restoreBackup('${b.name}')">
                            <i class="fa-solid fa-clock-rotate-left"></i> Restaurar
                        </button>
                    </div>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="4" class="text-center text-muted">Nenhum ponto de backup cadastrado.</td></tr>';
        
    } catch (err) {
        alert('Erro ao carregar lista de backups.');
    }
}

async function createBackup() {
    try {
        const res = await fetch(API_URL + '/api/backup/create', {
            method: 'POST',
            headers: getHeaders()
        });
        if (res.ok) {
            alert('Backup criado com sucesso!');
            loadBackups();
        } else {
            alert('Erro ao criar backup.');
        }
    } catch (err) {
        alert('Erro ao criar backup no servidor.');
    }
}

async function restoreBackup(backupName) {
    if (!confirm(`ATENÇÃO! Você tem certeza de que deseja restaurar o backup '${backupName}'?\nIsso substituirá todos os produtos, categorias e configurações atuais pela versão desse backup.`)) return;
    
    try {
        const res = await fetch(API_URL + '/api/backup/restore', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ backupName })
        });
        if (res.ok) {
            alert('Backup restaurado com sucesso! A loja foi atualizada.');
            loadBackups();
        } else {
            alert('Erro ao restaurar backup.');
        }
    } catch (err) {
        alert('Erro de conexão ao restaurar backup.');
    }
}

// ==========================================
// UTILS
// ==========================================
function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('pt-BR');
}
