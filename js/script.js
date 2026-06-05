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
        descricao: "Chaveiro articulado impresso em with alta precisão.",
        imagem: "img/chaveiros/chaveirolargato.jpeg",
        data: "2026-05-01"
    },
    {
        id: "KF002",
        nome: "Chaveiro Marcha de Câmbio",
        precoUnidade: 12.00,
        precoUnidade5: 9.50,
        categoria: "chaveiros",
        descricao: "Miniatura funcional de marcha de câmbio.",
        imagem: "img/chaveiros/chaveiromarcha.jpeg",
        data: "2026-05-19"
    },
    {
        id: "KF003",
        nome: "Chaveiro Pokebola",
        precoUnidade: 13.00,
        precoUnidade5: 10.00,
        categoria: "chaveiros",
        descricao: "Chaveiro Pokebola clássico em cores vibrantes.",
        imagem: "img/chaveiros/chaveiropokebola.jpeg",
        data: "2026-05-10"
    },
    {
        id: "KF004",
        nome: "Chaveiro Suporte para Celular",
        precoUnidade: 13.00,
        precoUnidade5: 10.00,
        categoria: "chaveiros",
        descricao: "Suporte prático e resistente para seu smartphone.",
        imagem: "img/chaveiros/chaveirocelular.jpeg",
        data: "2026-04-20"
    },
    {
        id: "KF006",
        nome: "Chaveiro do Flamengo CRF",
        precoUnidade: 13.00,
        precoUnidade5: 10.00,
        categoria: "chaveiros",
        descricao: "Chaveiro do Flamengo CRF em cores vibrantes.",
        imagem: "img/chaveiros/chaveiro-flamengo.jpg",
        data: "2026-04-20"
    },

    {
        id: "KF007",
        nome: "Chaveiro NT",
        precoUnidade: 13.00,
        precoUnidade5: 10.00,
        precoUnidade50: 8.00,
        categoria: "chaveiros",
        descricao: "Chaveiro NT.",
        imagem: "img/chaveiros/chaveiro-nt.jpg",
        data: "2026-04-20"
    },

    {
        id: "KF008",
        nome: "Chaveiro Potinho Porta Comprimidos",
        precoUnidade: 13.00,
        precoUnidade5: 10.00,
        categoria: "chaveiros",
        descricao: "Chaveiro potinho porta comprimidos.",
        imagem: "img/chaveiros/chaveiro-potinho.jpg",
        data: "2026-04-20"
    },
    {
        id: "KF009",
        nome: "Chaveiro Povo Articulado",
        precoUnidade: 13.00,
        precoUnidade5: 10.00,
        categoria: "chaveiros",
        descricao: "Chaveiro povo articulado em cores vibrantes.",
        imagem: "img/chaveiros/chaveiro-povo.jpg",
        data: "2026-04-20"
    },

    {
        id: "KF010",
        nome: "Chaveiro Meu Lugar no Mundo",
        precoUnidade: 13.00,
        precoUnidade5: 10.00,
        categoria: "chaveiros",
        descricao: "Chaveiro exclusivo 'Meu Lugar no Mundo'.",
        imagem: "img/chaveiros/chaveiromlm.jpeg",
        data: "2026-04-20"
    },
    {
        id: "KF011",
        nome: "Chaveiro Fúria da Luz",
        precoUnidade: 13.00,
        precoUnidade5: 10.00,
        categoria: "chaveiros",
        descricao: "Chaveiro furia da luz",
        imagem: "img/chaveiros/chaveiro-furialuz.jpg",
        data: "2026-04-20"
    },
    {
        id: "KF012",
        nome: "Chaveiro Garrafinha",
        precoUnidade: 13.00,
        precoUnidade5: 10.00,
        categoria: "chaveiros",
        descricao: "Chaveiro garrafinha",
        imagem: "img/chaveiros/chaveiro-garrafinha.jpg",
        data: "2026-04-20"
    },
    {
        id: "KF013",
        nome: "Chocalho Sensorial",
        precoUnidade: 35.00,
        categoria: "brinquedos-sensoriais",
        descricao: "Chocalho sensorial para estimulação tátil e visual.",
        imagem: "img/brinquedos-sensoriais/chocalho.jpeg",
        data: "2026-04-20"
    },
    {
        id: "KF014",
        nome: "Tabuada de Vezes",
        precoUnidade: 65.00,
        precoUnidade5: 55.00,
        categoria: "brinquedos-sensoriais",
        descricao: "Brinquedo sensorial em formato de tabuada.",
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
        descricao: "Brinquedo sensorial em formato de ovo.",
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
        descricao: "Brinquedo sensorial em formato de vareta.",
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
        descricao: "Cubo infinito with texturas vibrantes.",
        imagem: "img/brinquedos-sensoriais/cubo.jpeg",
        data: "2026-04-20"
    },
    {
        id: "KF018",
        nome: "Giroscópios",
        precoUnidade: 20.00,
        precoUnidade5: 18.00,
        categoria: "brinquedos",
        descricao: "Brinquedo with movimento giroscópico.",
        imagem: "img/brinquedos/giroscopios.jpeg",
        data: "2026-04-20"
    },
    {
        id: "KF019",
        nome: "Arganel de Gato",
        precoUnidade: 31.00,
        precoUnidade5: 27.00,
        categoria: "personalizados",
        descricao: "Argnel de gato impresso em.",
        imagem: "img/personalizados/arganel-gato.jpeg",
        data: "2026-04-20"
    },
    {
        id: "KF020",
        nome: "Arganel de Lontra",
        precoUnidade: 28.00,
        precoUnidade5: 25.00,
        categoria: "personalizados",
        descricao: "Argnel de lontra impresso em.",
        imagem: "img/personalizados/arganel-lontra.jpg",
        data: "2026-04-20"
    },
    {
        id: "KF021",
        nome: "Articulado do Flamengo CRF",
        precoUnidade: 28.00,
        precoUnidade5: 25.00,
        categoria: "personalizados",
        descricao: "Articulado do Flamengo CRF impresso em.",
        imagem: "img/personalizados/articulado-flamengo.jpg",
        data: "2026-04-20"
    },
    {
        id: "KF022",
        nome: "Suporte para Celular",
        precoUnidade: 25.00,
        precoUnidade5: 23.00,
        categoria: "personalizados",
        descricao: "Suporte para celular com carregador.",
        imagem: "img/personalizados/suporte-celular-carregador.jpg",
        data: "2026-04-20"
    },
    {
        id: "KF023",
        nome: "Caneca para Latão personalizado",
        precoUnidade: 50.00,
        precoUnidade5: 45.00,
        precoUnidade50: 42.00,
        categoria: "personalizados",
        descricao: "Caneca para Latão",
        imagem: "img/personalizados/caneca-latao.jpg",
        data: "2026-04-20"
    },
    {
        id: "KF024",
        nome: "Arganel de Clube Personalizado",
        precoUnidade: 24.00,
        precoUnidade5: 21.00,
        categoria: "personalizados",
        descricao: "Argnel de clube personalizado.",
        imagem: "img/personalizados/arganel-clube.jpg",
        data: "2026-04-20"
    },
];

// 2. INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    initMenuMobile();
    initScrollSuave();
    initHeaderScroll();
    
    if (window.location.pathname.includes('categoria.html') || document.getElementById('products-grid-dynamic')) {
        renderPaginaCategoria();
    }

    if (document.getElementById('featured-products-grid')) {
        initCategoryFilter();
    }

    initFormularioContato();
    initMulticolorAnimation();
});

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

    displayProducts(produtosFiltrados, container);
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
            <article class="product-card fade-in">
                <div class="product-img-wrapper">
                    <img src="${pathPrefix}${p.imagem}" alt="${p.nome}" loading="lazy">
                </div>
                <div class="product-info">
                    <span class="product-cat">${p.categoria}</span>
                    <h3 class="product-title">${displayTitle}</h3>
                    <div class="product-pricing">${pricingHTML}</div>
                    <div class="product-actions">
                        <button onclick="buyOnWhatsApp('${p.id}')" class="btn btn-primary">Comprar</button>
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
