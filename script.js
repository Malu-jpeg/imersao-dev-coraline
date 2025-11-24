const cardContainer = document.querySelector(".card-container");
const campoBusca = document.querySelector("header input");
const introScreen = document.querySelector("#intro-screen");
const iniciarAppBtn = document.querySelector("#iniciar-app-btn");
const btnInicio = document.querySelector("#btn-inicio");
const btnMundoReal = document.querySelector("#btn-mundo-real");
const btnOutroMundo = document.querySelector("#btn-outro-mundo");
const header = document.querySelector("header");
let dados = []; // Array que armazenará os dados

// 1. FUNÇÃO DE INICIALIZAÇÃO DA APLICAÇÃO (Chamada no carregamento da página)
async function iniciarApp() {
    // Tenta carregar os dados APENAS UMA VEZ
    if (dados.length === 0) {
        try {
            let resposta = await fetch("data.json");
            dados = await resposta.json();
        } catch (error) {
            console.error("Falha ao carregar dados iniciais:", error);
            // Chama a mensagem, mas pode ser que não apareça se a tela intro estiver por cima
            exibirMensagem("Ops! Não foi possível carregar os personagens.");
            return;
        }
    }
    
    // Configura o listener do botão da tela inicial
    if (iniciarAppBtn) {
        iniciarAppBtn.addEventListener('click', exibirConteudoPrincipal);
    }
    
    // Configura o listener do campo de busca
    if (campoBusca) {
        campoBusca.addEventListener('keyup', iniciarBusca);
    }

    // Configura os listeners dos botões de filtro
    if (btnInicio) {
        btnInicio.addEventListener('click', mostrarTelaInicial);
    }
    if (btnMundoReal) {
        btnMundoReal.addEventListener('click', filtrarMundoReal);
    }
    if (btnOutroMundo) {
        btnOutroMundo.addEventListener('click', filtrarOutroMundo);
    }


    // Oculta o container de cards no início para mostrar apenas a tela inicial
    if (cardContainer) {
        cardContainer.classList.add("escondido"); 
    }
}

function mostrarTelaInicial() {
    // 1. Mostra a tela de introdução
    if (introScreen) {
        introScreen.classList.remove("escondido");
    }
    
    // 2. Esconde o contêiner de cards
    if (cardContainer) {
        cardContainer.classList.add("escondido");
    }
}

// 2. FUNÇÃO PARA EXIBIR O CONTEÚDO PRINCIPAL (Chamada pelo clique no botão)
function exibirConteudoPrincipal() {
    // 1. Esconde a tela de introdução
    if (introScreen) {
        introScreen.classList.add("escondido");
    }
    
    // 2. Mostra o contêiner de cards
    if (cardContainer) {
        cardContainer.classList.remove("escondido");
    }
    
    // 3. Renderiza todos os cards pela primeira vez
    renderizarCards(dados); 
}

// 3. FUNÇÃO DE BUSCA (Só faz filtro, não carrega dados)
async function iniciarBusca() {
    const termoBusca = campoBusca.value.toLowerCase().trim();

    // LÓGICA: SE O CAMPO ESTÁ VAZIO, LIMPA O CONTAINER E INTERROMPE
    if (termoBusca === "") {
        cardContainer.innerHTML = ''; // Limpa o contêiner (não mostra nada)
        return; 
    }

    // APLICAÇÃO DO FILTRO
    const dadosFiltrados = dados.filter(dado =>
        dado.nome.toLowerCase().includes(termoBusca) ||
        dado.descricao.toLowerCase().includes(termoBusca) ||
        dado.titulo.toLowerCase().includes(termoBusca)

    );

    // VERIFICAÇÃO DE RESULTADOS
    if (dadosFiltrados.length === 0) {
        exibirMensagem(`Nenhum personagem encontrado com o termo "${termoBusca}". Tente novamente!`);
        return;
    }
    
    // RENDERIZAÇÃO
    renderizarCards(dadosFiltrados);
}

// FUNÇÕES DE FILTRO PELOS BOTÕES
function filtrarMundoReal() {
    // Garante que a tela de conteúdo principal esteja visível
    if (introScreen && !introScreen.classList.contains("escondido")) {
        introScreen.classList.add("escondido");
    }
    if (cardContainer && cardContainer.classList.contains("escondido")) {
        cardContainer.classList.remove("escondido");
    }

    // Filtra e renderiza os personagens
    const palavrasChaveOutroMundo = ["outro", "outra", "fantasma", "beldam", "fantoche", "ratos saltadores", "a mão separada"];
    const personagensMundoReal = dados.filter(dado => 
        !palavrasChaveOutroMundo.some(palavra => 
            dado.nome.toLowerCase().includes(palavra) || 
            dado.titulo.toLowerCase().includes(palavra)
        )
    );
    renderizarCards(personagensMundoReal);
}

function filtrarOutroMundo() {
    // Garante que a tela de conteúdo principal esteja visível
    if (introScreen && !introScreen.classList.contains("escondido")) {
        introScreen.classList.add("escondido");
    }
    if (cardContainer && cardContainer.classList.contains("escondido")) {
        cardContainer.classList.remove("escondido");
    }

    // Filtra e renderiza os personagens
    const palavrasChaveOutroMundo = ["outro", "outra", "fantasma", "beldam", "fantoche", "ratos saltadores", "a mão separada"];
    const personagensOutroMundo = dados.filter(dado => 
        palavrasChaveOutroMundo.some(palavra => 
            dado.nome.toLowerCase().includes(palavra) || 
            dado.titulo.toLowerCase().includes(palavra)
        )
    );
    renderizarCards(personagensOutroMundo);
}

// 4. FUNÇÃO DE RENDERIZAÇÃO DE CARDS
function renderizarCards(dadosParaRenderizar) {
    cardContainer.innerHTML = "";
    
    for (let dado of dadosParaRenderizar) {
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
            ${dado.imagem ? `<img src="${dado.imagem}" alt="Imagem de ${dado.nome}" class="card-img">` : ""}
            <p class="idade">Idade aproximada: ${dado.idade_aproximada}</p>
            <h2>${dado.nome}</h2>
            <h4>${dado.titulo}</h4>
            <p>${dado.descricao}</p>
            <a href="${dado.link}" target="_blank">Saiba mais</a>
        `;
        cardContainer.appendChild(article);
    }
}

// 5. FUNÇÃO DE MENSAGEM
function exibirMensagem(texto) {
    // Certifica-se de que o container de cards está visível para mostrar a mensagem
    if (cardContainer.classList.contains("escondido")) {
        cardContainer.classList.remove("escondido");
        if (introScreen) {
            introScreen.classList.add("escondido");
        }
    }
    
    cardContainer.innerHTML = ""; 
    let mensagemDiv = document.createElement("div");
    mensagemDiv.classList.add("mensagem-feedback");
    mensagemDiv.innerHTML = `<h3>${texto}</h3>`;
    cardContainer.appendChild(mensagemDiv);
}


// INÍCIO DA EXECUÇÃO: Liga a primeira função quando a página carrega
document.addEventListener('DOMContentLoaded', iniciarApp);