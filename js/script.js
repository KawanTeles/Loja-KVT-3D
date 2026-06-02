/* 
   SCRIPT JS - E-commerce Premium 3D
   Foco: Banco de Dados de Produtos, Filtros, Dinamismo e Integração WhatsApp.
*/

// 1. BANCO DE DADOS DE PRODUTOS COMPLETO
const PRODUTOS = [
    {
        id: "KF001",
        nome: "Chaveiro Largato articulado Multicolor",
        precoUnidade: 13.00,
        precoAtacado: 10.00,
        categoria: "chaveiros",
        descricao: "Chaveiro articulado impresso em 3D with alta precisão.",
        imagem: "img/produtos-chaveiro/chaveirolargato.jpeg",
        data: "2026-05-01"
    },
    {
        id: "KF002",
        nome: "Chaveiro Marcha de Câmbio",
        precoUnidade: 12.00,
        precoAtacado: 9.50,
        categoria: "chaveiros",
        descricao: "Miniatura funcional de marcha de câmbio.",
        imagem: "img/produtos-chaveiro/chaveiromarcha.jpeg",
        data: "2026-05-19"
    },
    {
        id: "KF003",
        nome: "Chaveiro Pokebola",
        precoUnidade: 13.00,
        precoAtacado: 10.00,
        categoria: "chaveiros",
        descricao: "Chaveiro Pokebola clássico em cores vibrantes.",
        imagem: "img/produtos-chaveiro/chaveiropokebola.jpeg",
        data: "2026-05-10"
    },
    {
        id: "KF004",
        nome: "Chaveiro Suporte para Celular",
        precoUnidade: 13.00,
        precoAtacado: 10.00,
        categoria: "chaveiros",
        descricao: "Suporte prático e resistente para seu smartphone.",
        imagem: "img/produtos-chaveiro/chaveirocelular.jpeg",
        data: "2026-04-20"
    },
    {
        id: "KF005",
        nome: "Chaveiro Meu Lugar no Mundo",
        precoUnidade: 13.00,
        precoAtacado: 10.00,
        categoria: "chaveiros",
        descricao: "Chaveiro exclusivo 'Meu Lugar no Mundo'.",
        imagem: "img/produtos-chaveiro/chaveiromlm.jpeg",
        data: "2026-04-20"
    },
    {
        id: "KF006",
        nome: "Chocalho Sensorial",
        precoUnidade: 35.00,
        categoria: "brinquedos-sensoriais",
        descricao: "Chocalho sensorial para estimulação tátil e visual.",
        imagem: "img/brinquedos-sensoriais/chocalho.jpeg",
        data: "2026-04-20"
    },
    {
        id: "KF007",
        nome: "Tabuada de Vezes",
        precoUnidade: 65.00,
        precoAtacado: 55.00,
        categoria: "brinquedos-sensoriais",
        descricao: "Brinquedo sensorial em formato de tabuada.",
        imagem: "img/brinquedos-sensoriais/tabuada.jpeg",
        data: "2026-04-20"
    },
    {
        id: "KF008",
        nome: "Ovo Sensorial",
        precoUnidade: 31.00,
        categoria: "brinquedos-sensoriais",
        descricao: "Brinquedo sensorial em formato de ovo.",
        imagem: "img/brinquedos-sensoriais/brinquedosesorial.png",
        data: "2026-04-20"
    },
    {
        id: "KF009",
        nome: "Vareta Sensorial",
        precoUnidade: 31.00,
        categoria: "brinquedos-sensoriais",
        descricao: "Brinquedo sensorial em formato de vareta.",
        imagem: "img/brinquedos-sensoriais/brinquedo-sensorial.jpeg",
        data: "2026-04-20"
    },
    {
        id: "KF010",
        nome: "Cubo Sensorial",
        precoUnidade: 19.00,
        categoria: "brinquedos-sensoriais",
        descricao: "Cubo with texturas vibrantes.",
        imagem: "img/brinquedos-sensoriais/cubo.jpeg",
        data: "2026-04-20"
    },
    {
        id: "KF011",
        nome: "Giroscópios",
        precoUnidade: 20.00,
        precoAtacado: 18.00,
        categoria: "brinquedos",
        descricao: "Brinquedo with movimento giroscópico.",
        imagem: "img/brinquedos/giroscopios.jpeg",
        data: "2026-04-20"
    },
    {
        id: "KF012",
        nome: "Arganel de Gato",
        precoUnidade: 31.00,
        precoAtacado: 27.00,
        categoria: "arganeis",
        descricao: "Argnel de gato impresso em 3D.",
        imagem: "img/arganel/arganel-gato.jpeg",
        data: "2026-04-20"
    }
];

// 2. INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    initMenuMobile();
    initScrollSuave();
    initHeaderScroll();
    
    if (window.location.pathname.includes('categoria.html') || document.getElementById('products-grid-dynamic')) {
        renderPaginaCategoria();
    }

    initFormularioContato();
    initMulticolorAnimation();
});

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

    let produtosFiltrados = catSlug ? PRODUTOS.filter(p => p.categoria === catSlug) : PRODUTOS;

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
        if (p.precoAtacado) {
            pricingHTML += `<div class="price-item wholesale"><span class="price-label">Atacado (5+)</span><span class="price-value">R$ ${formatPrice(p.precoAtacado)}</span></div>`;
        }

        const displayTitle = p.nome.includes("Multicolor") 
            ? p.nome.replace("Multicolor", '<span class="rgb-effect">Multicolor</span>')
            : p.nome;

        return `
            <article class="product-card fade-in">
                <div class="product-img-wrapper"><img src="${pathPrefix}${p.imagem}" alt="${p.nome}" loading="lazy"></div>
                <div class="product-info">
                    <span class="product-cat">${p.categoria}</span>
                    <h3 class="product-title">${displayTitle}</h3>
                    <div class="product-pricing">${pricingHTML}</div>
                    <div class="product-actions"><button onclick="buyOnWhatsApp('${p.id}')" class="btn btn-primary">Comprar</button></div>
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

    const fone = "55829983439617";
    const msg = encodeURIComponent(`Olá! Tenho interesse no produto:
*${p.nome}* (Cód: #${p.id})

Valor: R$ ${formatPrice(p.precoUnidade)}

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

        const fone = "55829983439617";
        const msg = encodeURIComponent(`*Novo Orçamento de Projeto 3D* 🚀

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
