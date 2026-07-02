/* 
   SCRIPT JS - E-commerce Premium
   Foco: Banco de Dados de Produtos, Filtros, Dinamismo e Integração WhatsApp.
*/

// 0. INICIALIZAÇÃO GOOGLE ANALYTICS
(function() {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-BC1K1WMMCG';
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-BC1K1WMMCG');
})();

// 1. BANCO DE DADOS DE PRODUTOS COMPLETO
const PRODUTOS = [
    {
        "id": "KF001",
        "nome": "Chaveiro Largato articulado Multicolor",
        "precoUnidade": 13,
        "precoUnidade5": 10,
        "categoria": "chaveiros",
        "descricao": "Adicione um toque de personalidade ao seu dia a dia com o Chaveiro Lagarto Articulado Multicolor. Produzido com alta qualidade, possui corpo totalmente articulado que proporciona movimentos suaves e um visual diferenciado. Suas cores vibrantes e acabamento detalhado fazem dele um acessório perfeito para chaves, mochilas ou estojos, além de ser uma excelente opção de presente para quem gosta de peças criativas e exclusivas.",
        "imagem": "img/chaveiros/chaveirolargato.jpg",
        "imagensExtras": [],
        "data": "2026-05-01",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF002",
        "nome": "Chaveiro Marcha de Câmbio",
        "precoUnidade": 12,
        "precoUnidade5": 9.5,
        "categoria": "chaveiros",
        "descricao": "Perfeito para apaixonados pelo universo automotivo, este Chaveiro Marcha de Câmbio reproduz o visual de uma alavanca de câmbio em miniatura. Produzido em material de alta qualidade com excelente acabamento, é um acessório resistente, criativo e ideal para personalizar suas chaves, mochila ou presentear quem é fã de carros.",
        "imagem": "img/chaveiros/chaveiromarcha.jpg",
        "imagensExtras": [],
        "data": "2026-05-19",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF003",
        "nome": "Chaveiro Pokebola",
        "precoUnidade": 13,
        "precoUnidade5": 10,
        "categoria": "chaveiros",
        "descricao": "Leve a nostalgia dos grandes treinadores para qualquer lugar com este chaveiro inspirado no clássico design da Pokébola. Produzido com ótimo acabamento, é leve, resistente e perfeito para mochilas, chaves ou coleções. Um presente ideal para fãs do universo Pokémon.",
        "imagem": "img/chaveiros/chaveiropokebola.jpg",
        "imagensExtras": [],
        "data": "2026-05-10",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF004",
        "nome": "Chaveiro Suporte para Celular",
        "precoUnidade": 13,
        "precoUnidade5": 10,
        "categoria": "chaveiros",
        "descricao": "Muito mais do que um chaveiro, este acessório também funciona como um prático suporte para celular. Compacto e fácil de transportar, permite apoiar o smartphone em superfícies planas para assistir vídeos, fazer videochamadas ou acompanhar receitas com mais conforto.",
        "imagem": "img/chaveiros/chaveirocelular.jpg",
        "imagensExtras": [],
        "data": "2026-04-20",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF006",
        "nome": "Chaveiro do Flamengo CRF",
        "precoUnidade": 13.5,
        "precoUnidade5": 10.5,
        "categoria": "chaveiros",
        "descricao": "Demonstre sua paixão pelo Flamengo em qualquer lugar com este chaveiro personalizado. Com acabamento de qualidade e design inspirado no tradicional símbolo CRF, é um acessório resistente, leve e perfeito para acompanhar suas chaves, mochila ou servir como presente para outros torcedores.",
        "imagem": "img/chaveiros/chaveiro-flamengo.jpg",
        "imagensExtras": [],
        "data": "2026-06-01",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF007",
        "nome": "Chaveiro NT",
        "precoUnidade": 13,
        "precoUnidade5": 10,
        "precoUnidade50": 8,
        "categoria": "chaveiros",
        "descricao": "Um chaveiro moderno e discreto para quem valoriza acessórios exclusivos. Oferece resistência para o uso diário e um design diferenciado que combina com qualquer estilo.",
        "imagem": "img/chaveiros/chaveiro-nt.jpg",
        "imagensExtras": [],
        "data": "2026-04-20",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF008",
        "nome": "Chaveiro Potinho Porta Comprimidos",
        "precoUnidade": 13,
        "precoUnidade5": 10,
        "categoria": "chaveiros",
        "descricao": "Tenha praticidade sempre à mão com este chaveiro porta comprimidos. Seu compartimento interno permite transportar pequenas doses de medicamentos ou outros itens de pequeno porte com segurança e discrição. Compacto, resistente e produzido em de alta qualidade, é ideal para o dia a dia.",
        "imagem": "img/chaveiros/chaveiro-potinho.jpg",
        "imagensExtras": [],
        "data": "2026-04-20",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF009",
        "nome": "Chaveiro Polvo Articulado",
        "precoUnidade": 13.5,
        "precoUnidade5": 10,
        "categoria": "chaveiros",
        "descricao": "Dê mais personalidade às suas chaves com este Polvo Articulado em miniatura. Seus tentáculos flexíveis proporcionam uma experiência tátil divertida, tornando o chaveiro não apenas um acessório, mas também um pequeno brinquedo sensorial. Produzido com ótimo acabamento e disponível em diversas cores.",
        "imagem": "img/chaveiros/chaveiro-polvo.jpg",
        "imagensExtras": [],
        "data": "2026-04-20",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF010",
        "nome": "Chaveiro Meu Lugar no Mundo",
        "precoUnidade": 13.5,
        "precoUnidade5": 10,
        "categoria": "chaveiros",
        "descricao": "Um acessório cheio de significado para quem gosta de carregar boas lembranças e representar lugares especiais. Produzido com acabamento de qualidade, é perfeito para uso diário ou para presentear alguém importante.",
        "imagem": "img/chaveiros/chaveiromlm.jpg",
        "imagensExtras": [],
        "data": "2026-04-20",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF011",
        "nome": "Chaveiro Fúria da Luz",
        "precoUnidade": 13.5,
        "precoUnidade5": 10,
        "categoria": "chaveiros",
        "descricao": "Inspirado em uma das criaturas mais queridas do universo da animação, este chaveiro apresenta detalhes cuidadosamente produzidos em alta qualidade. Leve, resistente e cheio de personalidade, é ideal para colecionadores e fãs que desejam levar seu personagem favorito para qualquer lugar.",
        "imagem": "img/chaveiros/chaveiro-furialuz.jpg",
        "imagensExtras": [],
        "data": "2026-04-20",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF012",
        "nome": "Chaveiro Garrafinha",
        "precoUnidade": 13,
        "precoUnidade5": 10,
        "categoria": "chaveiros",
        "descricao": "Um chaveiro criativo e divertido em formato de garrafinha. Compacto, resistente e leve, é perfeito para personalizar suas chaves, mochila ou presentear alguém com um acessório diferente.",
        "imagem": "img/chaveiros/chaveiro-garrafinha.jpg",
        "imagensExtras": [],
        "data": "2026-04-20",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF013",
        "nome": "Chocalho Sensorial",
        "precoUnidade": 50,
        "categoria": "brinquedos-sensoriais",
        "descricao": "Desenvolvido para estimular a coordenação motora, a percepção sensorial e a curiosidade das crianças, o Chocalho Sensorial combina movimento, textura e som em um único brinquedo. Produzido com acabamento seguro e confortável, proporciona momentos de aprendizado e diversão através da exploração tátil e auditiva.",
        "imagem": "img/brinquedos-sensoriais/chocalho.jpg",
        "imagensExtras": [],
        "data": "2026-04-20",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF014",
        "nome": "Tabuada de Vezes",
        "precoUnidade": 65,
        "precoUnidade5": 55,
        "categoria": "brinquedos-sensoriais",
        "descricao": "Aprender matemática pode ser muito mais divertido! A Tabuada de Vezes foi desenvolvida para auxiliar crianças no aprendizado das operações de multiplicação por meio da interação prática. Seu formato facilita a memorização, estimula o raciocínio lógico e transforma o estudo em uma atividade mais envolvente.",
        "imagem": "img/brinquedos-sensoriais/tabuada.jpg",
        "imagensExtras": [],
        "data": "2026-04-20",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF015",
        "nome": "Ovo Sensorial",
        "precoUnidade": 31,
        "precoUnidade5": 27,
        "precoUnidade50": 24,
        "categoria": "brinquedos-sensoriais",
        "descricao": "O Ovo Sensorial oferece uma experiência tátil agradável através de seu formato ergonômico e textura diferenciada. Ideal para manter as mãos ocupadas durante momentos de estudo, trabalho ou lazer, também é uma excelente opção para quem aprecia brinquedos sensoriais e objetos interativos. Produzido com materiais de alta qualidade, é resistente e perfeito para uso diário, proporcionando relaxamento e estímulo sensorial a qualquer hora do dia.",
        "imagem": "img/brinquedos-sensoriais/brinquedosesorial.png",
        "imagensExtras": [],
        "data": "2026-04-20",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF016",
        "nome": "Vareta Sensorial",
        "precoUnidade": 31,
        "precoUnidade5": 26,
        "precoUnidade50": 24,
        "categoria": "brinquedos-sensoriais",
        "descricao": "Compacta, leve e confortável de utilizar, a Vareta Sensorial proporciona uma experiência tátil agradável que estimula o movimento das mãos e a exploração sensorial. Ideal para crianças e adultos que gostam de brinquedos interativos ou procuram um acessório criativo para o dia a dia.",
        "imagem": "img/brinquedos-sensoriais/brinquedo-sensorial.jpg",
        "imagensExtras": [],
        "data": "2026-04-20",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF017",
        "nome": "Cubo Infinito Sensorial",
        "precoUnidade": 19,
        "precoUnidade5": 16,
        "precoUnidade50": 14,
        "categoria": "brinquedos-sensoriais",
        "descricao": "Descubra uma maneira divertida de manter as mãos em movimento com o Cubo Infinito Sensorial. Seu mecanismo permite movimentos contínuos e suaves, tornando-o perfeito para momentos de lazer, estudo ou trabalho. Compacto, resistente e fácil de transportar, é um dos brinquedos sensoriais mais procurados por quem gosta de experiências táteis.",
        "imagem": "img/brinquedos-sensoriais/cubo.jpg",
        "imagensExtras": [
            "img/brinquedos-sensoriais/cubo1.jpg",
            "img/brinquedos-sensoriais/cubo2.jpg",
            "img/brinquedos-sensoriais/cubo3.jpg",
            "img/brinquedos-sensoriais/cubo4.jpg"
        ],
        "data": "2026-04-20",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF018",
        "nome": "Giroscópios",
        "precoUnidade": 20,
        "precoUnidade5": 18,
        "categoria": "brinquedos",
        "descricao": "Descubra a diversão da física em movimento com os Giroscópios. Além de proporcionar momentos de entretenimento, eles demonstram de forma prática princípios de equilíbrio, rotação e estabilidade. Um brinquedo criativo para crianças, jovens e adultos que gostam de desafios, ciência e objetos interativos. Produzido com excelente acabamento e alta durabilidade.",
        "imagem": "img/brinquedos/giroscopios.jpg",
        "imagensExtras": [],
        "data": "2026-05-23",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF019",
        "nome": "Arganel de Gato",
        "precoUnidade": 31,
        "precoUnidade5": 27,
        "categoria": "personalizados",
        "descricao": "Organize suas chaves com muito estilo utilizando o Arganel de Gato. Produzido com acabamento detalhado, combina praticidade e decoração em uma única peça. Seu design delicado é perfeito para amantes de gatos e para quem deseja dar um toque especial à entrada da casa, escritório ou quarto.",
        "imagem": "img/personalizados/arganel-gato.jpg",
        "imagensExtras": [
            "img/personalizados/gato1.jpg",
            "img/personalizados/gato2.jpg",
            "img/personalizados/gato3.jpg"
        ],
        "data": "2026-05-29",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF020",
        "nome": "Arganel de Lontra",
        "precoUnidade": 28,
        "precoUnidade5": 25,
        "categoria": "personalizados",
        "descricao": "O Arganel de Lontra une funcionalidade e criatividade em uma peça exclusiva. Ideal para organizar chaves e pequenos acessórios, seu design inspirado em uma simpática lontra traz charme e personalidade para qualquer ambiente. Uma ótima opção para presentear quem gosta de decoração criativa.",
        "imagem": "img/personalizados/arganel-lontra.jpg",
        "imagensExtras": [],
        "data": "2026-05-20",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF021",
        "nome": "Articulado do Flamengo CRF",
        "precoUnidade": 28,
        "precoUnidade5": 25,
        "categoria": "personalizados",
        "descricao": "Demonstre sua paixão pelo Flamengo com esta figura articulada. Seu corpo flexível proporciona movimentos suaves, tornando a peça perfeita tanto para colecionar quanto para decorar mesas, estantes ou ambientes de trabalho. Um presente ideal para qualquer torcedor rubro-negro.",
        "imagem": "img/personalizados/articulado-flamengo.jpg",
        "imagensExtras": [],
        "data": "2026-06-01",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF022",
        "nome": "Suporte para Celular",
        "precoUnidade": 25,
        "precoUnidade5": 23,
        "categoria": "personalizados",
        "descricao": "Deixe seu celular sempre na posição ideal com este suporte. Seu design foi desenvolvido para oferecer estabilidade durante chamadas de vídeo, estudos, trabalho ou entretenimento, além de possuir espaço para passagem do cabo de carregamento. Prático, resistente e perfeito para organizar sua mesa.",
        "imagem": "img/personalizados/suporte-celular-carregador.jpg",
        "imagensExtras": [],
        "data": "2026-05-20",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF023",
        "nome": "Caneca para Latão personalizado",
        "precoUnidade": 50,
        "precoUnidade5": 45,
        "precoUnidade50": 42,
        "categoria": "personalizados",
        "descricao": "Aproveite suas bebidas com mais conforto utilizando esta caneca personalizada para latão. Produzida em de alta qualidade, oferece excelente pegada, maior conforto durante o uso e um visual exclusivo. Ideal para personalizações, presentes e eventos especiais.",
        "imagem": "img/personalizados/caneca-latao.jpg",
        "imagensExtras": [
            "img/personalizados/caneca2.jpg"
        ],
        "data": "2026-06-05",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF024",
        "nome": "Arganel de Clube Personalizado",
        "precoUnidade": "Promoção surpresa",
        "categoria": "personalizados",
        "descricao": "Personalize sua decoração com um arganel exclusivo desenvolvido especialmente para representar seu clube ou unidade. Pode ser confeccionado em diferentes cores e estilos mediante consulta. Uma peça perfeita para demonstrar sua paixão pelo clube ou sua unidade.",
        "imagem": "img/personalizados/arganel-clube.jpg",
        "imagensExtras": [],
        "data": "2026-06-05",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF025",
        "nome": "Expositor de Cartas Pókemon",
        "precoUnidade": 29,
        "precoUnidade5": 25,
        "categoria": "personalizados",
        "descricao": "Valorize sua coleção com este expositor desenvolvido para destacar cartas colecionáveis de forma elegante e segura. Produzido com excelente acabamento, proporciona ótima estabilidade e visualização da carta, sendo ideal para colecionadores que desejam exibir suas peças favoritas em mesas, estantes ou vitrines.",
        "imagem": "img/personalizados/expositor-carta.jpg",
        "imagensExtras": [],
        "data": "2026-06-05",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF026",
        "nome": "Chaveiro do Flamengo Escudo",
        "precoUnidade": 13.5,
        "precoUnidade5": 10.5,
        "categoria": "chaveiros",
        "descricao": "Leve o escudo do Flamengo sempre com você através deste chaveiro exclusivo. Compacto, resistente e com excelente acabamento, é perfeito para personalizar suas chaves, mochila ou estojo, além de ser uma ótima opção de presente para qualquer torcedor apaixonado.",
        "imagem": "img/chaveiros/flamengo-escudo.jpg",
        "imagensExtras": [
            "img/chaveiros/flamengo1.jpg",
            "img/chaveiros/flamengo2.jpg"
        ],
        "data": "2026-06-07",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF027",
        "nome": "Suporte de Papel Higiênico",
        "precoUnidade": 39,
        "precoUnidade5": 35,
        "categoria": "personalizados",
        "descricao": "Transforme seu banheiro com um suporte para papel higiênico que une praticidade e criatividade. Produzido em alta qualidade, oferece excelente resistência e um design moderno que deixa o ambiente muito mais organizado e personalizado.",
        "imagem": "img/personalizados/suporte-ph.jpg",
        "imagensExtras": [],
        "data": "2026-06-07",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF028",
        "nome": "Arma Glock chaveiro",
        "precoUnidade": 12.5,
        "precoUnidade5": 9,
        "precoUnidade50": 7,
        "categoria": "chaveiros",
        "descricao": "Inspirado no design de uma pistola Glock, este chaveiro decorativo em miniatura é produzido com riqueza de detalhes e excelente acabamento. Compacto e resistente, é ideal para colecionadores e entusiastas de miniaturas, sendo um acessório diferenciado para chaves, mochilas ou coleções.",
        "imagem": "img/chaveiros/arma-glock.jpg",
        "imagensExtras": [],
        "data": "2026-06-08",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF029",
        "nome": "Arma M4A1 chaveiro",
        "precoUnidade": 12.5,
        "precoUnidade5": 9,
        "precoUnidade50": 7,
        "categoria": "chaveiros",
        "descricao": "Este chaveiro apresenta uma miniatura inspirada no design de um rifle M4A1, produzida com ótimo nível de detalhes. Leve, resistente e criativo, é perfeito para colecionadores e apreciadores de miniaturas que procuram um acessório exclusivo para o dia a dia.",
        "imagem": "img/chaveiros/arma-m4a1.jpg",
        "imagensExtras": [
            "img/chaveiros/arma1-m4a1.jpg"
        ],
        "data": "2026-06-08",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF030",
        "nome": "Alfabeto & Números Sensorial",
        "precoUnidade": 70,
        "precoUnidade5": 60,
        "precoUnidade50": 50,
        "categoria": "brinquedos-sensoriais",
        "descricao": "Aprender brincando faz toda a diferença. O Alfabeto & Números Sensorial foi desenvolvido para estimular o reconhecimento de letras, números, cores e formas por meio da manipulação das peças. Ideal para atividades educativas em casa ou na escola, incentiva o desenvolvimento da coordenação motora, do raciocínio lógico e da criatividade de maneira divertida e interativa. Produzido com excelente acabamento e pensado para proporcionar uma experiência de aprendizado envolvente.",
        "imagem": "img/brinquedos-sensoriais/alfabeto-number.jpg",
        "imagensExtras": [
            "img/brinquedos-sensoriais/alfabeto2.jpg",
            "img/brinquedos-sensoriais/alfabeto3.jpg",
            "img/brinquedos-sensoriais/alfabeto4.jpg"
        ],
        "data": "2026-06-15",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF031",
        "nome": "Polvo articulado",
        "precoUnidade": 14,
        "precoUnidade5": 12,
        "precoUnidade50": 10,
        "categoria": "brinquedos-sensoriais",
        "descricao": "O Polvo Articulado combina um visual encantador com uma experiência sensorial agradável. Seus tentáculos totalmente articulados proporcionam movimentos suaves e divertidos. Produzido em alta qualidade, é perfeito para decoração, coleção, presentes ou para quem aprecia brinquedos sensoriais criativos e exclusivos.",
        "imagem": "img/brinquedos-sensoriais/polvo1.jpg",
        "imagensExtras": [],
        "data": "2026-06-17",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF032",
        "nome": "Betoneira | Versão personalizado com o nome ou contato 3 reais a mais",
        "precoUnidade": 14,
        "precoUnidade5": 12,
        "categoria": "personalizados",
        "descricao": "Esta mini betoneira personalizada é perfeita para quem procura um presente criativo para profissionais da construção civil, engenheiros, arquitetos, pedreiros e estudantes. Com a opção de personalizar com nome, empresa ou contato, torna-se um brinde exclusivo, uma lembrança diferenciada ou um item decorativo cheio de personalidade.",
        "imagem": "img/personalizados/betoneira.jpg",
        "imagensExtras": [
            "img/personalizados/betoneira1.jpg"
        ],
        "data": "2026-06-19",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF033",
        "nome": "Totem de Pix",
        "precoUnidade": 23,
        "precoUnidade5": 19.5,
        "categoria": "personalizados",
        "descricao": "O Totem de Pix é o acessório que faltava no seu balcão para tornar o momento do pagamento muito mais rápido e prático. Produzido com alta qualidade, ele conta com um espaço perfeito para você aplicar o seu QR Code. Chega de ficar soletrando a chave Pix para o cliente!",
        "imagem": "img/personalizados/totem.jpg",
        "imagensExtras": [],
        "data": "2026-06-23",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF034",
        "nome": "Tiara Brasil",
        "precoUnidade": 19,
        "precoUnidade5": 16,
        "categoria": "personalizados",
        "descricao": "Perfeita para vibrar pelo Brasil em jogos, festas temáticas e grandes eventos. Essa tiara traz as cores vibrantes da nossa bandeira em um design exclusivo feito em alta qualidade. Leve e super confortável para você usar o dia inteiro sem incômodo.",
        "imagem": "img/personalizados/tiara-brasil.jpg",
        "imagensExtras": [],
        "data": "2026-06-23",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF035",
        "nome": "Tiara Brasil (Cor única)",
        "precoUnidade": 17.5,
        "precoUnidade5": 15.5,
        "categoria": "personalizados",
        "descricao": "Se você quer demonstrar seu amor pelo Brasil de forma estilosa, mas prefere uma composição mais clean, a Tiara Brasil Monocromática é a escolha ideal. Com a palavra Brasil em destaque na cor amarela, ela combina perfeitamente com qualquer look de torcedor.",
        "imagem": "img/personalizados/tiara-cor-unica.jpg",
        "imagensExtras": [],
        "data": "2026-06-23",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF036",
        "nome": "Totem dia dos Pais",
        "precoUnidade": 28,
        "precoUnidade5": 22,
        "categoria": "personalizados",
        "descricao": "Um presente especial que simboliza o amor e a conexão entre pai e filho. Com dessign moderno e elegante, é  perfeito para decorar qualquer ambiente e homenagear quem sempre esteve ao seu lado. Disponível nas cores preta e branca",
        "imagem": "img/personalizados/totem1.jpg",
        "imagensExtras": [
            "img/personalizados/totem2.jpg",
            "img/personalizados/totem3.jpg"
        ],
        "data": "2026-06-29",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF037",
        "nome": "Totem de Pix Personalizado com QR Code e Nome",
        "precoUnidade": 45,
        "categoria": "personalizados",
        "descricao": "Facilite os pagamentos com uma placa Pix moderna e personalizada! Produzida em alta qualidade, acompanha base de apoio e pode ser personalizada com seu QR Code e nome. Ideal para lojas, comércios, salões, restaurantes, igrejas e profissionais autônomos. Resistente, elegante e pronta para deixar seu atendimento mais profissional.",
        "imagem": "img/personalizados/totem-gigante.jpg",
        "imagensExtras": [
            "img/personalizados/totem-gigante1.jpg"
        ],
        "data": "2026-06-30",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF038",
        "nome": "Polvo Articulado Tricô",
        "precoUnidade": 16,
        "precoUnidade5": 12,
        "precoUnidade50": 10,
        "categoria": "brinquedos-sensoriais",
        "descricao": "O Polvo Articulado Tricô combina um visual encantador com uma experiência sensorial agradável. Seus tentáculos totalmente articulados proporcionam movimentos suaves e divertidos, enquanto a textura inspirada em tricô torna a peça ainda mais diferenciada. Produzido em alta qualidade, é perfeito para decoração, coleção, presentes ou para quem aprecia brinquedos sensoriais criativos e exclusivos.",
        "imagem": "img/brinquedos-sensoriais/polvo-trico.jpg",
        "imagensExtras": [
            "img/brinquedos-sensoriais/polvo-trico1.jpg"
        ],
        "data": "2026-06-30",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF039",
        "nome": "Arma MiiniGun chaveiro",
        "precoUnidade": 18.5,
        "precoUnidade5": 15.5,
        "precoUnidade50": 13.5,
        "categoria": "chaveiros",
        "descricao": "Chaveiro com design inspirado em uma MiniGun, rico em detalhes e acabamento de qualidade. Compacto, resistente e perfeito para decorar chaves, mochilas ou completar sua coleção. Um acessório criativo e ideal para presentear.",
        "imagem": "img/chaveiros/chaveiro-minigun1.jpg",
        "imagensExtras": [
            "img/chaveiros/chaveiro-minigun2.jpg",
            "img/chaveiros/chaveiro-minigun3.jpg"
        ],
        "data": "2026-06-30",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF040",
        "nome": "Chaveiro Anilha",
        "precoUnidade": 9.5,
        "precoUnidade5": 6.5,
        "precoUnidade50": 5,
        "categoria": "chaveiros",
        "descricao": "Chaveiro em formato de anilha, ideal para quem ama musculação e academia. Compacto, resistente e com acabamento de qualidade, é perfeito para decorar chaves, mochilas ou presentear amantes do mundo fitness.",
        "imagem": "img/chaveiros/anilha.jpg",
        "imagensExtras": [],
        "data": "2026-06-30",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF041",
        "nome": "Suporte do Banguela",
        "precoUnidade": 27.5,
        "precoUnidade5": 22.5,
        "precoUnidade50": 20,
        "categoria": "personalizados",
        "descricao": "Suporte para celular inspirado no famoso dragão Banguela, com design detalhado e acabamento de qualidade. Ideal para apoiar seu smartphone na mesa, perfeito para assistir vídeos, fazer chamadas ou decorar seu espaço com muito estilo. Um presente incrível para fãs de dragões e animações.",
        "imagem": "img/personalizados/suporte-banguela.jpg",
        "imagensExtras": [
            "img/personalizados/suporte-banguela1.jpg"
        ],
        "data": "2026-06-30",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF042",
        "nome": "Jogo de Equilíibrio Pokémon / Sem a caixa o Preço baixa muuito",
        "precoUnidade": 122,
        "precoUnidade5": 105.5,
        "categoria": "brinquedos",
        "descricao": "Divirta-se com este incrível jogo de equilíbrio inspirado no universo Pokémon! O desafio é posicionar as peças sem deixar a base tombar. Perfeito para crianças e adultos, estimula a coordenação, concentração e o raciocínio de forma divertida. Ideal para brincar em família ou com amigos.",
        "imagem": "img/brinquedos/jogo-equilibrio3.jpg",
        "imagensExtras": [
            "img/brinquedos/jogo-equilibrio1.jpg",
            "img/brinquedos/jogo-equilibrio2.jpg"
        ],
        "data": "2026-06-30",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF043",
        "nome": "Urso rosa",
        "precoUnidade": 45,
        "precoUnidade5": 39,
        "precoUnidade50": 35,
        "categoria": "personalizados",
        "descricao": "Urso decorativo com design moderno e textura em formato de rosas, perfeito para decorar ambientes ou presentear em ocasiões especiais. Produzido com ótimo acabamento, é uma peça charmosa que combina delicadeza e elegância.",
        "imagem": "img/personalizados/urso.jpg",
        "imagensExtras": [],
        "data": "2026-06-30",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF044",
        "nome": "Spiner pequeno",
        "precoUnidade": 16,
        "precoUnidade5": 14,
        "precoUnidade50": 12,
        "categoria": "brinquedos",
        "descricao": "Spinner compacto com design moderno e acabamento de qualidade, ideal para aliviar o estresse, melhorar a concentração ou simplesmente se divertir. Leve, resistente e fácil de transportar, é perfeito para o dia a dia e também para presentear.",
        "imagem": "img/brinquedos/spiner.jpg",
        "imagensExtras": [],
        "data": "2026-06-30",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    },
    {
        "id": "KF045",
        "nome": "Totem de Pix Personalizado com QR Code e Nome - Cópia",
        "precoUnidade": 45,
        "categoria": "personalizados",
        "descricao": "Facilite os pagamentos com uma placa Pix moderna e personalizada! Produzida em alta qualidade, acompanha base de apoio e pode ser personalizada com seu QR Code e nome. Ideal para lojas, comércios, salões, restaurantes, igrejas e profissionais autônomos. Resistente, elegante e pronta para deixar seu atendimento mais profissional.",
        "imagem": "img/personalizados/totem-gigante.jpg",
        "imagensExtras": [
            "img/personalizados/totem-gigante1.jpg"
        ],
        "data": "2026-07-02",
        "ativo": true,
        "destaque": false,
        "promocao": false,
        "novo": false,
        "maisVendido": false,
        "mensagemCustomizada": null
    }
];



// 2. INICIALIZAÇÃO E INTEGRAÇÃO DO PAINEL
function getWhatsAppNumber() {
    return (window.DADOS_LOJA && window.DADOS_LOJA.configuracoes && window.DADOS_LOJA.configuracoes.whatsapp) 
        ? window.DADOS_LOJA.configuracoes.whatsapp 
        : "5582998343617";
}

function renderCategoriasDinamicas() {
    const filterList = document.querySelector('.category-filter-list');
    if (!filterList || !window.DADOS_LOJA || !window.DADOS_LOJA.categorias) return;
    
    const categoriasAtivas = window.DADOS_LOJA.categorias
        .filter(c => c.ativa !== false)
        .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
        
    filterList.innerHTML = `<li><button class="filter-btn active" data-category="todos">Todos</button></li>` +
        categoriasAtivas.map(cat => `<li><button class="filter-btn" data-category="${cat.slug}">${cat.nome}</button></li>`).join('');
}

function aplicarConfiguracoesDinamicas() {
    if (!window.DADOS_LOJA) return;
    const config = window.DADOS_LOJA;

    // 1. Aplicar Banners/Hero
    if (config.hero) {
        const heroTitle = document.querySelector('.hero-title');
        const heroDesc = document.querySelector('.hero p');
        const heroBtns = document.querySelectorAll('.hero-btns a');

        if (heroTitle && config.hero.titulo) heroTitle.textContent = config.hero.titulo;
        if (heroDesc && config.hero.subtitulo) heroDesc.textContent = config.hero.subtitulo;
        if (heroBtns.length >= 1 && config.hero.botaoPrincipal) {
            heroBtns[0].textContent = config.hero.botaoPrincipal.texto;
            heroBtns[0].href = config.hero.botaoPrincipal.link;
        }
        if (heroBtns.length >= 2 && config.hero.botaoSecundario) {
            heroBtns[1].textContent = config.hero.botaoSecundario.texto;
            heroBtns[1].href = config.hero.botaoSecundario.link;
        }
        
        const heroSection = document.querySelector('.hero');
        if (heroSection && config.hero.imagemDesktop) {
            const isMobile = window.innerWidth <= 768;
            const bgImage = (isMobile && config.hero.imagemCelular) ? config.hero.imagemCelular : config.hero.imagemDesktop;
            heroSection.style.backgroundImage = `url('${bgImage}')`;
        }
    }

    // 2. Aplicar Configurações Gerais
    if (config.configuracoes) {
        const fone = config.configuracoes.whatsapp || "5582998343617";
        document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes('wa.me/')) {
                const regex = /wa\.me\/([0-9]+)/;
                link.setAttribute('href', href.replace(regex, `wa.me/${fone}`));
            }
        });
        
        const footerText = document.querySelector('footer p, .footer-copyright');
        if (footerText && config.configuracoes.textoRodape) {
            footerText.innerHTML = config.configuracoes.textoRodape;
        }
    }

    // 3. Aplicar Cores do Tema
    if (config.tema) {
        let styleEl = document.getElementById('dynamic-theme-colors');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'dynamic-theme-colors';
            document.head.appendChild(styleEl);
        }
        const darkTheme = config.tema.dark || {};
        const lightTheme = config.tema.light || {};
        
        styleEl.innerHTML = `
            :root {
                ${darkTheme.primary ? `--primary: ${darkTheme.primary};` : ''}
                ${darkTheme.secondary ? `--secondary: ${darkTheme.secondary};` : ''}
                ${darkTheme.accent ? `--accent: ${darkTheme.accent};` : ''}
                ${darkTheme.bgDark ? `--bg-dark: ${darkTheme.bgDark};` : ''}
                ${darkTheme.bgCard ? `--bg-card: ${darkTheme.bgCard};` : ''}
                ${darkTheme.textWhite ? `--text-white: ${darkTheme.textWhite};` : ''}
                ${darkTheme.textGray ? `--text-gray: ${darkTheme.textGray};` : ''}
            }
            [data-theme="light"] {
                ${lightTheme.primary ? `--primary: ${lightTheme.primary};` : ''}
                ${lightTheme.secondary ? `--secondary: ${lightTheme.secondary};` : ''}
                ${lightTheme.accent ? `--accent: ${lightTheme.accent};` : ''}
                ${lightTheme.bgDark ? `--bg-dark: ${lightTheme.bgDark};` : ''}
                ${lightTheme.bgCard ? `--bg-card: ${lightTheme.bgCard};` : ''}
                ${lightTheme.textWhite ? `--text-white: ${lightTheme.textWhite};` : ''}
                ${lightTheme.textGray ? `--text-gray: ${lightTheme.textGray};` : ''}
            }
        `;
    }

    // 4. Aplicar SEO
    if (config.seo) {
        if (config.seo.siteTitle && (!window.location.pathname.includes('/pages/'))) {
            document.title = config.seo.siteTitle;
        }
        if (config.seo.metaDescription) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', config.seo.metaDescription);
        }
        if (config.seo.keywords) {
            let metaKeys = document.querySelector('meta[name="keywords"]');
            if (metaKeys) metaKeys.setAttribute('content', config.seo.keywords);
        }
    }
}

function initializeStore() {
    // Carregar dados dinâmicos se existirem
    if (window.DADOS_LOJA && window.DADOS_LOJA.produtos) {
        PRODUTOS.length = 0;
        PRODUTOS.push(...window.DADOS_LOJA.produtos);
    }
    
    // Ordenar produtos
    PRODUTOS.sort((a, b) => new Date(b.data) - new Date(a.data));
    
    // Aplicar configurações e renderizar categorias
    renderCategoriasDinamicas();
    aplicarConfiguracoesDinamicas();

    // Inicializar site original
    initTheme(); 
    initMenuMobile();
    initScrollSuave();
    initHeaderScroll();
    initModal();
    initCart();
    
    if (window.location.pathname.includes('categoria.html') || document.getElementById('products-grid-dynamic')) {
        renderPaginaCategoria();
    }
    if (document.getElementById('featured-products-grid')) {
        initCategoryFilter();
    }
    initFormularioContato();
    initMulticolorAnimation();
}

async function carregarDadosSupabase() {
    try {
        if (!window.supabaseClient) {
            throw new Error('Supabase client não inicializado.');
        }

        window.DADOS_LOJA = {
            produtos: [],
            categorias: [],
            configuracoes: null,
            hero: null,
            seo: null,
            tema: null
        };

        // 1. Buscar Produtos
        const { data: produtos, error: prodErr } = await window.supabaseClient
            .from('produtos')
            .select('*');
        if (prodErr) throw prodErr;
        
        window.DADOS_LOJA.produtos = (produtos || []).map(p => ({
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

        // 2. Buscar Categorias
        const { data: categorias, error: catErr } = await window.supabaseClient
            .from('categorias')
            .select('*');
        if (catErr) throw catErr;
        window.DADOS_LOJA.categorias = categorias || [];

        // 3. Buscar Configurações
        const { data: configs, error: confErr } = await window.supabaseClient
            .from('configuracoes')
            .select('*');
        if (confErr) throw confErr;
        
        (configs || []).forEach(c => {
            window.DADOS_LOJA[c.key] = c.value;
        });

        console.log('Dados carregados com sucesso do Supabase!');
    } catch (err) {
        console.error('Erro ao carregar dados do Supabase, tentando carregar dados_loja.js local:', err);
        await new Promise((resolve) => {
            const isSubpage = /[\/\\]pages[\/\\]/.test(window.location.pathname) || window.location.pathname.includes("pages/");
            const pathPrefix = isSubpage ? '../' : '';
            const script = document.createElement('script');
            script.src = `${pathPrefix}js/dados_loja.js?t=${Date.now()}`;
            script.onload = () => resolve(true);
            script.onerror = () => {
                console.warn('Falha no fallback local.');
                resolve(false);
            };
            document.head.appendChild(script);
        });
    } finally {
        initializeStore();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarDadosSupabase();
});

// 2.1 SISTEMA DE TEMAS (DARK/LIGHT)
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
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
                <div id="modal-thumbnails" class="modal-thumbnails"></div>
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
    const modal = document.getElementById('product-modal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeProductModal();
    });
}

function setModalImage(src, thumbElement) {
    const mainImg = document.getElementById('modal-img');
    mainImg.src = src;
    document.querySelectorAll('.modal-thumbnail').forEach(t => t.classList.remove('active'));
    if (thumbElement) thumbElement.classList.add('active');
}

function openProductModal(id) {
    const p = PRODUTOS.find(prod => prod.id === id);
    if (!p) return;
    const modal = document.getElementById('product-modal');
    const isSubpage = /[\/\\]pages[\/\\]/.test(window.location.pathname) || window.location.pathname.includes("pages/");
    const pathPrefix = isSubpage ? '../' : '';
    
    // Imagem Principal
    const mainImg = document.getElementById('modal-img');
    mainImg.src = window.obterImagemUrl(p.imagem, pathPrefix);
    mainImg.alt = p.nome;

    // Galeria de Miniaturas
    const thumbContainer = document.getElementById('modal-thumbnails');
    thumbContainer.innerHTML = '';
    if (p.imagensExtras && p.imagensExtras.length > 0) {
        const allImages = [p.imagem, ...p.imagensExtras];
        allImages.forEach((img, index) => {
            const thumb = document.createElement('img');
            thumb.src = window.obterImagemUrl(img, pathPrefix);
            thumb.className = `modal-thumbnail ${index === 0 ? 'active' : ''}`;
            thumb.onclick = () => setModalImage(window.obterImagemUrl(img, pathPrefix), thumb);
            thumbContainer.appendChild(thumb);
        });
        thumbContainer.style.display = 'flex';
    } else {
        thumbContainer.style.display = 'none';
    }

    document.getElementById('modal-cat').textContent = p.categoria;
    document.getElementById('modal-title').textContent = p.nome;
    document.getElementById('modal-description').textContent = p.descricao;
    let pricingHTML = "";
    if (p.precoUnidade === "Promoção surpresa") {
        pricingHTML = `<div class="price-item"><span class="price-value">${p.precoUnidade}</span></div>`;
    } else {
        pricingHTML = `<div class="price-item"><span class="price-label">Unidade</span><span class="price-value">R$ ${formatPrice(p.precoUnidade)}</span></div>`;
        if (p.precoUnidade5) pricingHTML += `<div class="price-item wholesale"><span class="price-label">Atacado (5+)</span><span class="price-value">R$ ${formatPrice(p.precoUnidade5)}</span></div>`;
        if (p.precoUnidade50) pricingHTML += `<div class="price-item wholesale"><span class="price-label">Atacado (50+)</span><span class="price-value">R$ ${formatPrice(p.precoUnidade50)}</span></div>`;
    }
    document.getElementById('modal-pricing').innerHTML = pricingHTML;
    const buyBtn = document.getElementById('modal-buy-btn');
    buyBtn.textContent = p.precoUnidade === "Promoção surpresa" ? "Clique Aqui" : "Comprar";
    buyBtn.onclick = () => buyOnWhatsApp(p.id);
    const actionsDiv = modal.querySelector('.product-actions');
    let cartBtn = document.getElementById('modal-cart-btn');
    if (!cartBtn) {
        cartBtn = document.createElement('button');
        cartBtn.id = 'modal-cart-btn';
        cartBtn.className = 'btn btn-outline cart-btn';
        cartBtn.textContent = 'Adicionar ao Carrinho';
        actionsDiv.appendChild(cartBtn);
    }
    cartBtn.onclick = () => {
        handleAddToCartClick(p.id);
        closeProductModal();
    };
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function initCategoryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productsGrid = document.getElementById('featured-products-grid');
    if (!filterButtons.length || !productsGrid) return;
    displayProducts(PRODUTOS, productsGrid);
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) return;
            
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            const filtered = (category === 'todos' || !category) ? PRODUTOS : PRODUTOS.filter(p => p.categoria === category);
            
            // Etapa 1: Fade-out
            productsGrid.classList.add('grid-fade-out');
            
            setTimeout(() => {
                // Atualização dos produtos
                displayProducts(filtered, productsGrid);
                if (filtered.length === 0) {
                    productsGrid.innerHTML = '<p class="no-products">Nenhum produto encontrado nesta categoria no momento.</p>';
                }
                
                // Etapa 2: Fade-in (removendo a classe de fade-out)
                productsGrid.classList.remove('grid-fade-out');
            }, 300); // Tempo compatível com a transição CSS (300ms)
        });
    });
}

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
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('open');
        });
    });
}

function initHeaderScroll() {
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        });
    }
}

function renderPaginaCategoria() {
    const params = new URLSearchParams(window.location.search);
    const catSlug = params.get("categoria");
    const container = document.getElementById('products-grid-dynamic');
    if (!container) return;
    let produtosFiltrados = (catSlug && catSlug !== 'todos') ? PRODUTOS.filter(p => p.categoria === catSlug) : PRODUTOS;
    const ordemOriginal = [...produtosFiltrados];
    displayProducts(produtosFiltrados, container);
    initSorting(produtosFiltrados, ordemOriginal, container);
}

function initSorting(produtos, ordemOriginal, container) {
    const sortSelect = document.getElementById('sort-products');
    if (!sortSelect) return;
    sortSelect.replaceWith(sortSelect.cloneNode(true));
    const newSortSelect = document.getElementById('sort-products');
    newSortSelect.addEventListener('change', (e) => {
        const criterio = e.target.value;
        let produtosOrdenados = [...produtos];
        switch (criterio) {
            case 'recent': produtosOrdenados.sort((a, b) => new Date(b.data) - new Date(a.data)); break;
            case 'price-low': 
                produtosOrdenados.sort((a, b) => {
                    const priceA = typeof a.precoUnidade === 'number' ? a.precoUnidade : Infinity;
                    const priceB = typeof b.precoUnidade === 'number' ? b.precoUnidade : Infinity;
                    return priceA - priceB;
                }); 
                break;
            case 'price-high': 
                produtosOrdenados.sort((a, b) => {
                    const priceA = typeof a.precoUnidade === 'number' ? a.precoUnidade : -Infinity;
                    const priceB = typeof b.precoUnidade === 'number' ? b.precoUnidade : -Infinity;
                    return priceB - priceA;
                }); 
                break;
            default: produtosOrdenados = [...ordemOriginal]; break;
        }
        displayProducts(produtosOrdenados, container);
    });
}

function formatPrice(value) { return value.toFixed(2).replace('.', ','); }

function changeCardImage(event, id, direction) {
    event.stopPropagation();
    const p = PRODUTOS.find(prod => prod.id === id);
    if (!p || !p.imagensExtras) return;
    
    const allImages = [p.imagem, ...p.imagensExtras];
    const card = event.target.closest('.product-card');
    const img = card.querySelector('.product-img-wrapper img');
    
    // Encontrar o índice atual baseado no src (considerando o pathPrefix)
    const currentSrc = img.getAttribute('src');
    const isSubpage = /[\/\\]pages[\/\\]/.test(window.location.pathname) || window.location.pathname.includes("pages/");
    const pathPrefix = isSubpage ? '../' : '';
    
    let currentIndex = allImages.findIndex(src => window.obterImagemUrl(src, pathPrefix) === currentSrc);
    if (currentIndex === -1) currentIndex = 0;

    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = allImages.length - 1;
    if (nextIndex >= allImages.length) nextIndex = 0;

    img.src = window.obterImagemUrl(allImages[nextIndex], pathPrefix);
}

function displayProducts(products, container) {
    if (!container) return;
    const isSubpage = /[\/\\]pages[\/\\]/.test(window.location.pathname) || window.location.pathname.includes("pages/");
    const pathPrefix = isSubpage ? '../' : '';
    container.innerHTML = products.map(p => {
        let pricingHTML = "";
        if (p.precoUnidade === "Promoção surpresa") {
            pricingHTML = `<div class="price-item"><span class="price-value">${p.precoUnidade}</span></div>`;
        } else {
            pricingHTML = `<div class="price-item"><span class="price-label">Unidade</span><span class="price-value">R$ ${formatPrice(p.precoUnidade)}</span></div>`;
            if (p.precoUnidade5) pricingHTML += `<div class="price-item wholesale"><span class="price-label">Atacado (5+)</span><span class="price-value">R$ ${formatPrice(p.precoUnidade5)}</span></div>`;
            if (p.precoUnidade50) pricingHTML += `<div class="price-item wholesale"><span class="price-label">Atacado (50+)</span><span class="price-value">R$ ${formatPrice(p.precoUnidade50)}</span></div>`;
        }
        const displayTitle = p.nome.includes("Multicolor") ? p.nome.replace("Multicolor", '<span class="rgb-effect">Multicolor</span>') : p.nome;
        const imgClass = (p.nome === "Ovo Sensorial" || p.nome === "Arganel de Gato") ? "product-img-wrapper img-small" : "product-img-wrapper";
        
        let galleryBtns = '';
        if (p.imagensExtras && p.imagensExtras.length > 0) {
            galleryBtns = `
                <button class="card-gallery-btn prev" onclick="changeCardImage(event, '${p.id}', -1)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <button class="card-gallery-btn next" onclick="changeCardImage(event, '${p.id}', 1)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            `;
        }

        const buyBtnText = p.precoUnidade === "Promoção surpresa" ? "Clique Aqui" : "Comprar";

        return `
            <article class="product-card fade-in" onclick="openProductModal('${p.id}')">
                <div class="${imgClass}">
                    <img src="${window.obterImagemUrl(p.imagem, pathPrefix)}" alt="${p.nome}" loading="lazy">
                    ${galleryBtns}
                </div>
                <div class="product-info">
                    <span class="product-cat">${p.categoria}</span>
                    <h3 class="product-title">${displayTitle}</h3>
                    <div class="product-pricing">${pricingHTML}</div>
                    <div class="product-actions">
                        <div style="width: 100%; display: flex; flex-direction: column; gap: 1rem;">
                            <button onclick="event.stopPropagation(); buyOnWhatsApp('${p.id}')" class="btn btn-primary" style="width: 100%;">${buyBtnText}</button>
                            <button onclick="event.stopPropagation(); handleAddToCartClick('${p.id}')" class="btn btn-outline cart-btn" style="width: 100%; margin-top: 0;">Adicionar ao Carrinho</button>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }).join('');
    initMulticolorAnimation();
}

// 7. SISTEMA DE CARRINHO (HÍBRIDO: ESCOLHA + RECALCULO AUTOMÁTICO)
let cart = JSON.parse(localStorage.getItem('kvt_cart')) || [];

function initCart() {
    if (!document.querySelector('.cart-drawer')) {
        const headerContent = document.querySelector('.header-content');
        if (headerContent) {
            const cartToggleHTML = `
                <button class="cart-toggle" aria-label="Abrir carrinho" onclick="toggleCart(true)">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span class="cart-badge">0</span>
                </button>
            `;
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) themeToggle.insertAdjacentHTML('beforebegin', cartToggleHTML);
            else headerContent.insertAdjacentHTML('beforeend', cartToggleHTML);
        }
        const cartDrawerHTML = `
            <div class="cart-overlay" onclick="toggleCart(false)"></div>
            <div class="cart-drawer">
                <div class="cart-header">
                    <h2>Meu Carrinho</h2>
                    <button class="cart-close" onclick="toggleCart(false)">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div id="cart-items" class="cart-items"></div>
                <div class="cart-footer">
                    <div class="cart-total-row">
                        <span class="cart-total-label">Total do Pedido:</span>
                        <span id="cart-total-value" class="cart-total-value">R$ 0,00</span>
                    </div>
                    <button class="btn btn-finalize" onclick="finalizeOrder()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style="margin-right: 10px;">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                        Finalizar Pedido
                    </button>
                </div>
            </div>
            <div class="price-selector-overlay" onclick="closePriceSelector()">
                <div class="price-selector-container" onclick="event.stopPropagation()">
                    <h3 class="price-selector-title">Escolha uma opção:</h3>
                    <div id="price-options-list" class="price-options-list"></div>
                    
                    <div class="manual-quantity-area" style="margin-bottom: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
                        <label style="display: block; font-size: 1.4rem; color: var(--text-white); margin-bottom: 1rem; font-weight: 600;">Escolha sua quantidade:</label>
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                            <button class="qty-btn" onclick="adjustManualQuantity(-1)" style="width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: var(--glass-bg); color: var(--text-white); border: 1px solid var(--border-color); cursor: pointer;">-</button>
                            <input type="number" id="manual-quantity-input" value="1" min="1" oninput="handleManualQuantityChange(this.value)" style="width: 80px; height: 40px; text-align: center; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-white); font-size: 1.6rem; font-weight: 700;">
                            <button class="qty-btn" onclick="adjustManualQuantity(1)" style="width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: var(--glass-bg); color: var(--text-white); border: 1px solid var(--border-color); cursor: pointer;">+</button>
                        </div>
                        <div id="selector-subtotal" style="font-size: 1.5rem; color: var(--text-white); font-weight: 600;">
                            Subtotal: <span style="color: var(--primary); font-weight: 800; font-size: 1.8rem;">R$ 0,00</span>
                        </div>
                    </div>

                    <button class="btn btn-primary btn-confirm-price" onclick="confirmPriceSelection()">Confirmar</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', cartDrawerHTML);
    }
    updateCartUI();
}

function getUnitPriceByQuantity(productId, quantity) {
    const p = PRODUTOS.find(item => item.id === productId);
    if (!p) return 0;
    if (p.precoUnidade === "Promoção surpresa") return "Promoção surpresa";
    if (p.precoUnidade50 && quantity >= 50) return p.precoUnidade50;
    if (p.precoUnidade5 && quantity >= 5) return p.precoUnidade5;
    return p.precoUnidade;
}

let selectedProductId = null;
let selectedOption = null;

function handleAddToCartClick(id) {
    const p = PRODUTOS.find(prod => prod.id === id);
    if (!p) return;
    
    // Configura as faixas dinamicamente baseadas nos preços disponíveis
    const options = [];
    
    if (p.precoUnidade50) {
        options.push({ label: '1 a 4 unidades', price: p.precoUnidade, qty: 1 });
        options.push({ label: '5 a 49 unidades', price: p.precoUnidade5, qty: 5 });
        options.push({ label: '50+ unidades', price: p.precoUnidade50, qty: 50 });
    } else if (p.precoUnidade5) {
        options.push({ label: '1 a 4 unidades', price: p.precoUnidade, qty: 1 });
        options.push({ label: '5+ unidades', price: p.precoUnidade5, qty: 5 });
    } else {
        options.push({ label: 'Unidade', price: p.precoUnidade, qty: 1 });
    }

    if (options.length === 1) addToCart(id, 1);
    else { selectedProductId = id; openPriceSelector(options); }
}

function openPriceSelector(options) {
    const list = document.getElementById('price-options-list');
    list.innerHTML = options.map((opt, index) => `
        <div class="price-option-item ${index === 0 ? 'selected' : ''}" data-qty="${opt.qty}" onclick="selectPriceOption(this, ${opt.qty})">
            <div class="price-option-radio"></div>
            <div class="price-option-info">
                <span class="price-option-label">${opt.label}</span>
                <span class="price-option-value">R$ ${formatPrice(opt.price)} cada</span>
            </div>
        </div>
    `).join('');
    
    selectedOption = { qty: options[0].qty };
    
    // Inicializa o input manual e o subtotal
    const inputManual = document.getElementById('manual-quantity-input');
    if (inputManual) inputManual.value = options[0].qty;
    updateSelectorSubtotal();

    document.querySelector('.price-selector-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function selectPriceOption(element, qty) {
    document.querySelectorAll('.price-option-item').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    selectedOption = { qty };
    
    // Atualiza o input manual ao clicar em uma opção
    const inputManual = document.getElementById('manual-quantity-input');
    if (inputManual) inputManual.value = qty;
    updateSelectorSubtotal();
}

// NOVAS FUNÇÕES PARA QUANTIDADE MANUAL
function handleManualQuantityChange(value) {
    let qty = parseInt(value) || 1;
    if (qty < 1) qty = 1;
    
    selectedOption = { qty };
    
    // Destaca a faixa correspondente
    const p = PRODUTOS.find(prod => prod.id === selectedProductId);
    if (p) {
        let activeQty = 1;
        if (p.precoUnidade50 && qty >= 50) activeQty = 50;
        else if (p.precoUnidade5 && qty >= 5) activeQty = 5;
        
        document.querySelectorAll('.price-option-item').forEach(el => {
            el.classList.toggle('selected', parseInt(el.dataset.qty) === activeQty);
        });
    }
    
    updateSelectorSubtotal();
}

function adjustManualQuantity(change) {
    const input = document.getElementById('manual-quantity-input');
    if (!input) return;
    let newValue = (parseInt(input.value) || 1) + change;
    if (newValue < 1) newValue = 1;
    input.value = newValue;
    handleManualQuantityChange(newValue);
}

function updateSelectorSubtotal() {
    if (!selectedProductId || !selectedOption) return;
    const unitPrice = getUnitPriceByQuantity(selectedProductId, selectedOption.qty);
    const subtotal = unitPrice * selectedOption.qty;
    const subtotalEl = document.querySelector('#selector-subtotal span');
    if (subtotalEl) {
        subtotalEl.textContent = `R$ ${formatPrice(subtotal)}`;
    }
}

function confirmPriceSelection() {
    if (selectedProductId && selectedOption) {
        const inputManual = document.getElementById('manual-quantity-input');
        const finalQty = inputManual ? (parseInt(inputManual.value) || selectedOption.qty) : selectedOption.qty;
        addToCart(selectedProductId, finalQty);
        closePriceSelector();
    }
}

function closePriceSelector() {
    document.querySelector('.price-selector-overlay').classList.remove('active');
    document.body.style.overflow = '';
    selectedProductId = null;
    selectedOption = null;
}

function addToCart(id, initialQty) {
    const p = PRODUTOS.find(prod => prod.id === id);
    if (!p) return;
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += initialQty;
        existingItem.preco = getUnitPriceByQuantity(id, existingItem.quantity);
    } else {
        const initialPrice = getUnitPriceByQuantity(id, initialQty);
        cart.push({ id: p.id, nome: p.nome, preco: initialPrice, imagem: p.imagem, quantity: initialQty });
    }
    saveCart();
    updateCartUI();
    toggleCart(true);
}

function toggleCart(show) {
    const drawer = document.querySelector('.cart-drawer');
    const overlay = document.querySelector('.cart-overlay');
    if (!drawer || !overlay) return;
    if (show) { drawer.classList.add('active'); overlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
    else { drawer.classList.remove('active'); overlay.classList.remove('active'); document.body.style.overflow = ''; }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) removeFromCart(id);
        else {
            item.preco = getUnitPriceByQuantity(id, item.quantity);
            saveCart();
            updateCartUI();
        }
    }
}

function saveCart() { localStorage.setItem('kvt_cart', JSON.stringify(cart)); }

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const badge = document.querySelector('.cart-badge');
    const totalEl = document.getElementById('cart-total-value');
    if (!container || !badge || !totalEl) return;
    const isSubpage = /[\/\\]pages[\/\\]/.test(window.location.pathname) || window.location.pathname.includes("pages/");
    const pathPrefix = isSubpage ? '../' : '';
    if (cart.length === 0) {
        container.innerHTML = '<p class="cart-empty-msg">Seu carrinho está vazio.</p>';
        badge.textContent = '0'; badge.style.display = 'none'; totalEl.textContent = 'R$ 0,00';
    } else {
        let total = 0, count = 0;
        let hasPromoSurpresa = false;
        container.innerHTML = cart.map(item => {
            const isPromo = item.preco === "Promoção surpresa";
            let priceText = "";
            if (isPromo) {
                hasPromoSurpresa = true;
                priceText = item.preco;
            } else {
                const subtotal = item.preco * item.quantity;
                total += subtotal;
                priceText = `R$ ${formatPrice(item.preco)}`;
            }
            count += item.quantity;
            return `
                <div class="cart-item">
                    <img src="${window.obterImagemUrl(item.imagem, pathPrefix)}" alt="${item.nome}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h3 class="cart-item-title">${item.nome}</h3>
                        <p class="cart-item-price">Preço unitário aplicado: ${priceText}</p>
                        <div class="cart-item-actions">
                            <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                            <span class="qty-val">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">Remover</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        badge.textContent = count; 
        badge.style.display = 'flex'; 
        if (hasPromoSurpresa) {
            totalEl.textContent = total > 0 ? `R$ ${formatPrice(total)} + Promoção surpresa` : "Promoção surpresa";
        } else {
            totalEl.textContent = `R$ ${formatPrice(total)}`;
        }
    }
}

function finalizeOrder() {
    if (cart.length === 0) return;
    let total = 0, msgItens = "";
    let hasPromoSurpresa = false;
    cart.forEach(item => {
        const isPromo = item.preco === "Promoção surpresa";
        if (isPromo) {
            hasPromoSurpresa = true;
            msgItens += `\n*Produto:* ${item.nome}\n*Quantidade:* ${item.quantity}\n*Preço unitário aplicado:* Promoção surpresa\n*Subtotal:* Promoção surpresa\n`;
        } else {
            const subtotal = item.preco * item.quantity;
            total += subtotal;
            msgItens += `\n*Produto:* ${item.nome}\n*Quantidade:* ${item.quantity}\n*Preço unitário aplicado:* R$ ${formatPrice(item.preco)}\n*Subtotal:* R$ ${formatPrice(subtotal)}\n`;
        }
    });
    const fone = getWhatsAppNumber();
    const totalMsg = hasPromoSurpresa 
        ? (total > 0 ? `R$ ${formatPrice(total)} + Promoção surpresa` : "Promoção surpresa") 
        : `R$ ${formatPrice(total)}`;
    const msg = encodeURIComponent(`Olá, gostaria de fazer este pedido:\n${msgItens}\n*TOTAL DO PEDIDO: ${totalMsg}*\n\nObrigado.`);
    window.open(`https://wa.me/${fone}?text=${msg}`, '_blank');
}

window.openProductModal = openProductModal; window.closeProductModal = closeProductModal; window.handleAddToCartClick = handleAddToCartClick; window.addToCart = addToCart; window.toggleCart = toggleCart; window.updateQuantity = updateQuantity; window.removeFromCart = removeFromCart; window.finalizeOrder = finalizeOrder; window.initCart = initCart; window.selectPriceOption = selectPriceOption; window.confirmPriceSelection = confirmPriceSelection; window.closePriceSelector = closePriceSelector;
window.handleManualQuantityChange = handleManualQuantityChange; window.adjustManualQuantity = adjustManualQuantity;

function buyOnWhatsApp(id) {
    const p = PRODUTOS.find(prod => prod.id === id);
    if (!p) return;
    let precoMsg = "";
    if (p.precoUnidade === "Promoção surpresa") {
        precoMsg = `• Preço: Promoção surpresa`;
    } else {
        precoMsg = `• Unidade: R$ ${formatPrice(p.precoUnidade)}`;
        if (p.precoUnidade5) precoMsg += `\n• Atacado (5+): R$ ${formatPrice(p.precoUnidade5)}`;
        if (p.precoUnidade50) precoMsg += `\n• Atacado (50+): R$ ${formatPrice(p.precoUnidade50)}`;
    }
    const fone = getWhatsAppNumber();
    
    let msgTemplate = "";
    if (p.mensagemCustomizada) {
        msgTemplate = p.mensagemCustomizada;
    } else if (window.DADOS_LOJA && window.DADOS_LOJA.configuracoes && window.DADOS_LOJA.configuracoes.mensagemWhatsAppPadrao) {
        msgTemplate = window.DADOS_LOJA.configuracoes.mensagemWhatsAppPadrao;
    } else {
        msgTemplate = "Olá! Tenho interesse no produto:\n*[NOME_PRODUTO]* (Cód: #[ID_PRODUTO])\n\n*Preços disponíveis:*\n[PRECOS_PRODUTO]\n\nPoderia me informar a disponibilidade de cores e o prazo de entrega?";
    }
    
    let msgText = msgTemplate
        .replace(/\[NOME_PRODUTO\]/g, p.nome)
        .replace(/\[NOME DO PRODUTO\]/g, p.nome)
        .replace(/\[ID_PRODUTO\]/g, p.id)
        .replace(/\[PRECOS_PRODUTO\]/g, precoMsg);
        
    const msg = encodeURIComponent(msgText);
    window.open(`https://wa.me/${fone}?text=${msg}`, '_blank');
}

function initScrollSuave() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function initFormularioContato() {
    const form = document.getElementById('orcamento-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('contato-nome').value, email = document.getElementById('contato-email').value, projeto = document.getElementById('contato-projeto').value;
        const fone = getWhatsAppNumber();
        const msg = encodeURIComponent(`*Novo Orçamento de Projeto * 🚀\n\n*Nome:* ${nome}\n*E-mail:* ${email}\n\n*Descrição do Projeto:*\n${projeto}`);
        window.open(`https://wa.me/${fone}?text=${msg}`, '_blank');
    });
}

function initMulticolorAnimation() {
    const targets = document.querySelectorAll('#rgb, .rgb-effect');
    targets.forEach(target => {
        if (target.dataset.animated === "true") return;
        const text = target.textContent;
        if (!text) return;
        target.textContent = "";
        text.split("").forEach((letra, i) => {
            const span = document.createElement("span");
            span.textContent = letra;
            setInterval(() => { span.style.color = `hsl(${Date.now()/10 + i*40}, 100%, 50%)`; }, 30);
            target.appendChild(span);
        });
        target.dataset.animated = "true";
    });
}
