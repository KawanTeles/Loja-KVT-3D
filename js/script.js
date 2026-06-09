/* 
   SCRIPT JS - E-commerce Premium
   Foco: Banco de Dados de Produtos, Filtros, Dinamismo e Integração WhatsApp.
*/

// 1. BANCO DE DADOS DE PRODUTOS COMPLETO
const PRODUTOS = [
    {
        id: "KF001",
        nome: "Chaveiro Largato articulado Multicolor",
        precoUnidade: 13.00,
        precoUnidade5: 10.00,
        categoria: "chaveiros",
        descricao: "Chaveiro articulado com design exótico, produzido em impressão 3D com cores vibrantes e movimento fluido, perfeito para quem busca um acessório único e divertido.",
        imagem: "img/chaveiros/chaveirolargato.jpeg",
        data: "2026-05-01"
    },
    {
        id: "KF002",
        nome: "Chaveiro Marcha de Câmbio",
        precoUnidade: 12.00,
        precoUnidade5: 9.50,
        categoria: "chaveiros",
        descricao: "Miniatura funcional e interativa de uma marcha de câmbio, ideal para entusiastas automotivos que desejam um acessório detalhado e resistente.",
        imagem: "img/chaveiros/chaveiromarcha.jpeg",
        data: "2026-05-19"
    },
    {
        id: "KF003",
        nome: "Chaveiro Pokebola",
        precoUnidade: 13.00,
        precoUnidade5: 10.00,
        categoria: "chaveiros",
        descricao: "Chaveiro temático inspirado na clássica Pokébola, produzido com impressão 3D de alta precisão e acabamento pensado para colecionadores e fãs da franquia.",
        imagem: "img/chaveiros/chaveiropokebola.jpeg",
        data: "2026-05-10"
    },
    {
        id: "KF004",
        nome: "Chaveiro Suporte para Celular",
        precoUnidade: 13.00,
        precoUnidade5: 10.00,
        categoria: "chaveiros",
        descricao: "Acessório 2 em 1: um chaveiro estiloso que se transforma em um suporte estável para seu smartphone, ideal para assistir vídeos em qualquer lugar.",
        imagem: "img/chaveiros/chaveirocelular.jpeg",
        data: "2026-04-20"
    },
    {
        id: "KF006",
        nome: "Chaveiro do Flamengo CRF",
        precoUnidade: 13.00,
        precoUnidade5: 10.00,
        categoria: "chaveiros",
        descricao: "Chaveiro personalizado com o icônico escudo CRF, produzido com acabamento premium para que o torcedor rubro-negro carregue seu orgulho com estilo.",
        imagem: "img/chaveiros/chaveiro-flamengo.jpg",
        data: "2026-06-01"
    },

    {
        id: "KF007",
        nome: "Chaveiro NT",
        precoUnidade: 13.00,
        precoUnidade5: 10.00,
        precoUnidade50: 8.00,
        categoria: "chaveiros",
        descricao: "Chaveiro exclusivo com design moderno e minimalista, fabricado com materiais de alta durabilidade para o uso cotidiano.",
        imagem: "img/chaveiros/chaveiro-nt.jpg",
        data: "2026-04-20"
    },

    {
        id: "KF008",
        nome: "Chaveiro Potinho Porta Comprimidos",
        precoUnidade: 13.00,
        precoUnidade5: 10.00,
        categoria: "chaveiros",
        descricao: "Prático e funcional, este chaveiro possui um compartimento discreto para armazenar comprimidos, unindo utilidade e design compacto.",
        imagem: "img/chaveiros/chaveiro-potinho.jpg",
        data: "2026-04-20"
    },
    {
        id: "KF009",
        nome: "Chaveiro Povo Articulado",
        precoUnidade: 13.00,
        precoUnidade5: 10.00,
        categoria: "chaveiros",
        descricao: "Chaveiro de polvo com tentáculos totalmente articulados, proporcionando uma experiência sensorial tátil e visual única.",
        imagem: "img/chaveiros/chaveiro-povo.jpg",
        data: "2026-04-20"
    },

    {
        id: "KF010",
        nome: "Chaveiro Meu Lugar no Mundo",
        precoUnidade: 13.00,
        precoUnidade5: 10.00,
        categoria: "chaveiros",
        descricao: "Chaveiro com design inspirador e acabamento refinado, ideal para presentear alguém especial ou para uso pessoal cheio de significado.",
        imagem: "img/chaveiros/chaveiromlm.jpeg",
        data: "2026-04-20"
    },
    {
        id: "KF011",
        nome: "Chaveiro Fúria da Luz",
        precoUnidade: 13.00,
        precoUnidade5: 10.00,
        categoria: "chaveiros",
        descricao: "Inspirado no universo fantástico, este chaveiro apresenta detalhes impressionantes da Fúria da Luz com alta fidelidade de design.",
        imagem: "img/chaveiros/chaveiro-furialuz.jpg",
        data: "2026-04-20"
    },
    {
        id: "KF012",
        nome: "Chaveiro Garrafinha",
        precoUnidade: 13.00,
        precoUnidade5: 10.00,
        categoria: "chaveiros",
        descricao: "Miniatura charmosa em formato de garrafa, produzida com precisão para ser um acessório leve, resistente e estiloso.",
        imagem: "img/chaveiros/chaveiro-garrafinha.jpg",
        data: "2026-04-20"
    },
    {
        id: "KF013",
        nome: "Chocalho Sensorial",
        precoUnidade: 35.00,
        categoria: "brinquedos-sensoriais",
        descricao: "Desenvolvido para estimular o desenvolvimento infantil, este chocalho combina texturas e sons suaves em um design seguro e ergonômico.",
        imagem: "img/brinquedos-sensoriais/chocalho.jpeg",
        data: "2026-04-20"
    },
    {
        id: "KF014",
        nome: "Tabuada de Vezes",
        precoUnidade: 65.00,
        precoUnidade5: 55.00,
        categoria: "brinquedos-sensoriais",
        descricao: "Ferramenta educativa e divertida que auxilia no aprendizado da matemática através da interação física e visual.",
        imagem: "img/brinquedos-sensoriais/tabuada.jpeg",
        data: "2026-04-20"
    },
    {
        id: "KF015",
        nome: "Ovo Sensorial",
        precoUnidade: 31.00,
        precoUnidade5: 27.00,
        precoUnidade50: 24.00,
        categoria: "brinquedos-sensoriais",
        descricao: "Brinquedo tátil com design orgânico que proporciona relaxamento e foco através de sua superfície texturizada.",
        imagem: "img/brinquedos-sensoriais/brinquedosesorial.png",
        data: "2026-04-20"
    },
    {
        id: "KF016",
        nome: "Vareta Sensorial",
        precoUnidade: 31.00,
        precoUnidade5: 26.00,
        precoUnidade50: 24.00,
        categoria: "brinquedos-sensoriais",
        descricao: "Ideal para exercícios de foco e estimulação motora fina, com acabamento suave e cores relaxantes.",
        imagem: "img/brinquedos-sensoriais/brinquedo-sensorial.jpeg",
        data: "2026-04-20"
    },
    {
        id: "KF017",
        nome: "Cubo Infinito Sensorial",
        precoUnidade: 19.00,
        precoUnidade5: 16.00,
        precoUnidade50: 14.00,
        categoria: "brinquedos-sensoriais",
        descricao: "O clássico 'fidget toy' em uma versão de alta qualidade, perfeito para reduzir o estresse e manter as mãos ocupadas com movimentos infinitos.",
        imagem: "img/brinquedos-sensoriais/cubo.jpeg",
        data: "2026-04-20"
    },
    {
        id: "KF018",
        nome: "Giroscópios",
        precoUnidade: 20.00,
        precoUnidade5: 18.00,
        categoria: "brinquedos",
        descricao: "Brinquedo mecânico fascinante que demonstra princípios da física através de movimentos giroscópicos complexos e hipnotizantes.",
        imagem: "img/brinquedos/giroscopios.jpeg",
        data: "2026-05-23"
    },
    {
        id: "KF019",
        nome: "Arganel de Gato",
        precoUnidade: 31.00,
        precoUnidade5: 27.00,
        categoria: "personalizados",
        descricao: "Arganel decorativo com silhueta de gato, ideal para organizar acessórios com um toque de elegância e fofura.",
        imagem: "img/personalizados/arganel-gato.jpeg",
        data: "2026-05-29"
    },
    {
        id: "KF020",
        nome: "Arganel de Lontra",
        precoUnidade: 28.00,
        precoUnidade5: 25.00,
        categoria: "personalizados",
        descricao: "Peça personalizada de alta fidelidade representando uma lontra, perfeita para decoração ou como suporte de itens leves.",
        imagem: "img/personalizados/arganel-lontra.jpg",
        data: "2026-05-20"
    },
    {
        id: "KF021",
        nome: "Articulado do Flamengo CRF",
        precoUnidade: 28.00,
        precoUnidade5: 25.00,
        categoria: "personalizados",
        descricao: "Figura articulada colecionável com as cores e o escudo do Flamengo, unindo tecnologia de impressão 3D e paixão futebolística.",
        imagem: "img/personalizados/articulado-flamengo.jpg",
        data: "2026-06-01"
    },
    {
        id: "KF022",
        nome: "Suporte para Celular",
        precoUnidade: 25.00,
        precoUnidade5: 23.00,
        categoria: "personalizados",
        descricao: "Suporte ergonômico projetado para acomodar seu celular com segurança, incluindo abertura para cabo de carregador, ideal para mesas de trabalho.",
        imagem: "img/personalizados/suporte-celular-carregador.jpg",
        data: "2026-05-20"
    },
    {
        id: "KF023",
        nome: "Caneca para Latão personalizado",
        precoUnidade: 50.00,
        precoUnidade5: 45.00,
        precoUnidade50: 42.00,
        categoria: "personalizados",
        descricao: "Caneca robusta e personalizada feita sob medida para latões, garantindo uma pegada firme e isolamento térmico aprimorado.",
        imagem: "img/personalizados/caneca-latao.jpg",
        data: "2026-06-05"
    },
    {
        id: "KF024",
        nome: "Arganel de Clube Personalizado",
        precoUnidade: 0.00,
        precoUnidade5: 0.00,
        categoria: "personalizados",
        descricao: "Arganel exclusivo que pode ser personalizado com o escudo do seu clube do coração, sob consulta de design e cores.",
        imagem: "img/personalizados/arganel-clube.jpg",
        data: "2026-06-05"
    },
      {
        id: "KF025",
        nome: "Expositor de Cartas Pókemon",
        precoUnidade: 29.00,
        precoUnidade5: 25.00,
        categoria: "personalizados",
        descricao: "Expositor elegante para proteger e exibir suas cartas Pokémon mais raras, com design transparente e base estável.",
        imagem: "img/personalizados/expositor-carta.jpg",
        data: "2026-06-05"
    },
     {
        id: "KF026",
        nome: "Chaveiro do Flamengo Escudo",
        precoUnidade: 13.00,
        precoUnidade5: 10.00,
        categoria: "chaveiros",
        descricao: "Chaveiro personalizado inspirado no escudo do Flamengo, produzido em impressão 3D com acabamento premium e ideal para torcedores que querem carregar sua paixão no dia a dia.",
        imagem: "img/chaveiros/flamengo-escudo.jpg",
        data: "2026-06-07"
    },
     {
        id: "KF027",
        nome: "Suporte de Papel Higiênico ",
        precoUnidade: 39.00,
        precoUnidade5: 35.00,
        categoria: "personalizados",
        descricao: "Suporte funcional com design criativo, perfeito para adicionar um toque de personalidade e modernidade ao seu banheiro.",
        imagem: "img/personalizados/suporte-ph.jpg",
        data: "2026-06-07"
    },
    {
        id: "KF028",
        nome: "ARMA Glock chaveiro ",
        precoUnidade: 12.00,
        precoUnidade5: 9.00,
        precoUnidade50: 7.00,
        categoria: "chaveiros",
        descricao: "Suporte funcional com design criativo, perfeito para adicionar um toque de personalidade e modernidade ao seu banheiro.",
        imagem: "img/chaveiros/arma-glock.jpg",
        data: "2026-06-08"
    },

     {
        id: "KF029",
        nome: "ARMA chaveiro ",
        precoUnidade: 12.00,
        precoUnidade5: 9.00,
        precoUnidade50: 7.00,
        categoria: "chaveiros",
        descricao: "Suporte funcional com design criativo, perfeito para adicionar um toque de personalidade e modernidade ao seu banheiro.",
        imagem: "img/chaveiros/arma-m4a1.jpg",
        data: "2026-06-08"
    },
];

// 2. INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    initTheme(); // Inicializa o tema antes de tudo
    initMenuMobile();
    initScrollSuave();
    initHeaderScroll();
    initModal();
    
    if (window.location.pathname.includes('categoria.html') || document.getElementById('products-grid-dynamic')) {
        renderPaginaCategoria();
    }

    if (document.getElementById('featured-products-grid')) {
        initCategoryFilter();
    }

    initFormularioContato();
    initMulticolorAnimation();
});

// 2.1 SISTEMA DE TEMAS (DARK/LIGHT)
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    
    // Aplica o tema inicial
    document.documentElement.setAttribute('data-theme', storedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// 2.2 MODAL DE DETALHES
function initModal() {
    const modalHTML = `
        <div id="product-modal" class="modal-overlay">
            <div class="modal-container">
                <button class="modal-close" onclick="closeProductModal()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div class="modal-img-wrapper">
                    <img id="modal-img" src="" alt="">
                </div>
                <div class="modal-content">
                    <span id="modal-cat" class="modal-cat"></span>
                    <h2 id="modal-title" class="modal-title"></h2>
                    <p id="modal-description" class="modal-description"></p>
                    <div id="modal-pricing" class="product-pricing"></div>
                    <div class="product-actions">
                        <button id="modal-buy-btn" class="btn btn-primary">Comprar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Fechar ao clicar fora
    const modal = document.getElementById('product-modal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeProductModal();
    });
}

function openProductModal(id) {
    const p = PRODUTOS.find(prod => prod.id === id);
    if (!p) return;

    const modal = document.getElementById('product-modal');
    const isSubpage = /[\/\\]pages[\/\\]/.test(window.location.pathname) || window.location.pathname.includes("pages/");
    const pathPrefix = isSubpage ? '../' : '';

    document.getElementById('modal-img').src = `${pathPrefix}${p.imagem}`;
    document.getElementById('modal-img').alt = p.nome;
    document.getElementById('modal-cat').textContent = p.categoria;
    document.getElementById('modal-title').textContent = p.nome;
    document.getElementById('modal-description').textContent = p.descricao;

    let pricingHTML = `<div class="price-item"><span class="price-label">Unidade</span><span class="price-value">R$ ${formatPrice(p.precoUnidade)}</span></div>`;
    if (p.precoUnidade5) {
        pricingHTML += `<div class="price-item wholesale"><span class="price-label">Atacado (5+)</span><span class="price-value">R$ ${formatPrice(p.precoUnidade5)}</span></div>`;
    }
    if (p.precoUnidade50) {
        pricingHTML += `<div class="price-item wholesale"><span class="price-label">Atacado (50+)</span><span class="price-value">R$ ${formatPrice(p.precoUnidade50)}</span></div>`;
    }
    document.getElementById('modal-pricing').innerHTML = pricingHTML;

    const buyBtn = document.getElementById('modal-buy-btn');
    buyBtn.onclick = () => buyOnWhatsApp(p.id);

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Trava o scroll do fundo
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Libera o scroll
}

// Globalizar funções
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;

// 2.5 FILTRO DE CATEGORIAS (HOME)
function initCategoryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productsGrid = document.getElementById('featured-products-grid');

    if (!filterButtons.length || !productsGrid) return;

    // Renderização inicial - Mostra todos os produtos por padrão
    displayProducts(PRODUTOS, productsGrid);

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;
            const filtered = (category === 'todos' || !category)
                ? PRODUTOS 
                : PRODUTOS.filter(p => p.categoria === category);

            displayProducts(filtered, productsGrid);

            if (filtered.length === 0) {
                productsGrid.innerHTML = '<p class="no-products">Nenhum produto encontrado nesta categoria no momento.</p>';
            }
        });
    });
}

// 3. MENU MOBILE
function initMenuMobile() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => { 
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('open');
        });
    }

    // Fecha o menu ao clicar em qualquer link (importante para navegação na mesma página)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('open');
        });
    });
}

// 4. HEADER SCROLL EFFECT
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        });
    }
}

// 5. RENDERIZAÇÃO DA PÁGINA DE CATEGORIA
function renderPaginaCategoria() {
    const params = new URLSearchParams(window.location.search);
    const catSlug = params.get("categoria");
    const container = document.getElementById('products-grid-dynamic');
    if (!container) return;

    // Se catSlug for 'todos' ou null, mostra tudo. Caso contrário, filtra pela categoria.
    let produtosFiltrados = (catSlug && catSlug !== 'todos') 
        ? PRODUTOS.filter(p => p.categoria === catSlug) 
        : PRODUTOS;

    // Mantemos uma referência da ordem original para a opção "Relevância"
    const ordemOriginal = [...produtosFiltrados];

    displayProducts(produtosFiltrados, container);
    initSorting(produtosFiltrados, ordemOriginal, container);
}

// 5.5 FUNCIONALIDADE DE ORDENAÇÃO
function initSorting(produtos, ordemOriginal, container) {
    const sortSelect = document.getElementById('sort-products');
    if (!sortSelect) return;

    // Remove event listener anterior se houver (para evitar duplicatas)
    sortSelect.replaceWith(sortSelect.cloneNode(true));
    const newSortSelect = document.getElementById('sort-products');

    newSortSelect.addEventListener('change', (e) => {
        const criterio = e.target.value;
        let produtosOrdenados = [...produtos];

        switch (criterio) {
            case 'recent':
                // Ordena por data (mais recente primeiro)
                produtosOrdenados.sort((a, b) => new Date(b.data) - new Date(a.data));
                break;
            case 'price-low':
                // Ordena por Menor Preço (baseado no precoUnidade)
                produtosOrdenados.sort((a, b) => a.precoUnidade - b.precoUnidade);
                break;
            case 'price-high':
                // Ordena por Maior Preço (baseado no precoUnidade)
                produtosOrdenados.sort((a, b) => b.precoUnidade - a.precoUnidade);
                break;
            case 'default':
            default:
                // Retorna à ordem original (Relevância)
                produtosOrdenados = [...ordemOriginal];
                break;
        }

        displayProducts(produtosOrdenados, container);
    });
}

// 6. EXIBIÇÃO DE PRODUTOS
function formatPrice(value) { return value.toFixed(2).replace('.', ','); }

function displayProducts(products, container) {
    if (!container) return;
    const isSubpage = /[\/\\]pages[\/\\]/.test(window.location.pathname) || window.location.pathname.includes("pages/");
    const pathPrefix = isSubpage ? '../' : '';

    container.innerHTML = products.map(p => {
        let pricingHTML = `<div class="price-item"><span class="price-label">Unidade</span><span class="price-value">R$ ${formatPrice(p.precoUnidade)}</span></div>`;
        if (p.precoUnidade5) {
            pricingHTML += `<div class="price-item wholesale"><span class="price-label">Atacado (5+)</span><span class="price-value">R$ ${formatPrice(p.precoUnidade5)}</span></div>`;
        }
        if (p.precoUnidade50) {
            pricingHTML += `<div class="price-item wholesale"><span class="price-label">Atacado (50+)</span><span class="price-value">R$ ${formatPrice(p.precoUnidade50)}</span></div>`;
        }

        const displayTitle = p.nome.includes("Multicolor") 
            ? p.nome.replace("Multicolor", '<span class="rgb-effect">Multicolor</span>')
            : p.nome;

        const imgClass = (p.nome === "Ovo Sensorial" || p.nome === "Arganel de Gato") ? "product-img-wrapper img-small" : "product-img-wrapper";

        return `
            <article class="product-card fade-in" onclick="openProductModal('${p.id}')">
                <div class="product-img-wrapper">
                    <img src="${pathPrefix}${p.imagem}" alt="${p.nome}" loading="lazy">
                </div>
                <div class="product-info">
                    <span class="product-cat">${p.categoria}</span>
                    <h3 class="product-title">${displayTitle}</h3>
                    <div class="product-pricing">${pricingHTML}</div>
                    <div class="product-actions">
                        <button onclick="event.stopPropagation(); buyOnWhatsApp('${p.id}')" class="btn btn-primary">Comprar</button>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    initMulticolorAnimation();
}
// 8. WHATSAPP INTEGRATION
function buyOnWhatsApp(id) {
    const p = PRODUTOS.find(prod => prod.id === id);
    if (!p) return;

    let precoMsg = `• Unidade: R$ ${formatPrice(p.precoUnidade)}`;

    if (p.precoUnidade5) {
        precoMsg += `\n• Atacado (5+): R$ ${formatPrice(p.precoUnidade5)}`;
    }

    if (p.precoUnidade50) {
        precoMsg += `\n• Atacado (50+): R$ ${formatPrice(p.precoUnidade50)}`;
    }

    const fone = "5582998343617";
    const msg = encodeURIComponent(`Olá! Tenho interesse no produto:
*${p.nome}* (Cód: #${p.id})

*Preços disponíveis:*
${precoMsg}

Poderia me informar a disponibilidade de cores e o prazo de entrega?`);

    window.open(`https://wa.me/${fone}?text=${msg}`, '_blank');
}

// 9. SCROLL SUAVE
function initScrollSuave() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// 10. FORMULÁRIO DE CONTATO (ORÇAMENTO)
function initFormularioContato() {
    const form = document.getElementById('orcamento-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('contato-nome').value;
        const email = document.getElementById('contato-email').value;
        const projeto = document.getElementById('contato-projeto').value;

        const fone = "5582998343617";
        const msg = encodeURIComponent(`*Novo Orçamento de Projeto * 🚀

*Nome:* ${nome}
*E-mail:* ${email}

*Descrição do Projeto:*
${projeto}`);

        window.open(`https://wa.me/${fone}?text=${msg}`, '_blank');
    });
}
// 11. ANIMAÇÃO MULTICOLOR
function initMulticolorAnimation() {
    const targets = document.querySelectorAll('#rgb, .rgb-effect');
    targets.forEach(target => {
        if (target.dataset.animated === "true") return;
        const text = target.textContent;
        target.textContent = "";
        text.split("").forEach((letra, i) => {
            const span = document.createElement("span");
            span.textContent = letra;
            setInterval(() => {
                span.style.color = `hsl(${Date.now()/10 + i*40}, 100%, 50%)`;
            }, 30);
            target.appendChild(span);
        });
        target.dataset.animated = "true";
    });
}
