import { cardapio } from './cardapio.js';

const tamanhoButtons = document.querySelectorAll('.pizza-btn');
const categoryButtons = document.querySelectorAll('.category-btn')
const voltarBtn = document.querySelector('.voltar-btn');
const voltarBugado = document.getElementById('voltar-bugado');
const selectSizeModal = document.getElementById('select-size');
const popout = document.getElementById('popout');
const popoutGeraComanda = document.querySelector('#popout-gerar-comanda');
const popoutCategory = document.querySelector('#popout-category');


let popoutAtual = null; // Rastrear o popout atual
let popoutAnterior = null; // Rastrear o popout anterior
let popoutDefault = selectSizeModal; // Rastrear o popout anterior


function exibirListaDePizzas(pizzas, categoria) {
    const pizzaListElement = document.getElementById('categoria');
    // Limpar conteúdo anterior
    pizzaListElement.innerHTML = '';

    // Criação do cabeçalho da categoria
    const categoryHeader = document.createElement('h3');
    categoryHeader.classList.add('pizza-category-header');
    categoryHeader.textContent = categoria;
    pizzaListElement.appendChild(categoryHeader);

    // Criação e inserção de elementos de lista para cada pizza
    pizzas.forEach(pizza => {
        const listItem = document.createElement('div');
        listItem.classList.add('pizza-list-item');

        const numElement = document.createElement('span');
        numElement.classList.add('pizza-list-item-num');
        numElement.textContent = `${pizza.id}`;
        listItem.appendChild(numElement);

        const saborElement = document.createElement('span');
        saborElement.classList.add('pizza-list-item-sabor');
        saborElement.textContent = ` ${pizza.sabor}`;
        listItem.appendChild(saborElement);

        listItem.addEventListener('click', function() {
            // Remover a classe 'selected' de todos os itens
            const allItems = document.querySelectorAll('.pizza-list-item');
            allItems.forEach(item => {
                item.classList.remove('selected');
            });

            // Adicionar a classe 'selected' ao item clicado
            listItem.classList.add('selected');
        });

        pizzaListElement.appendChild(listItem);
    });
}






// Manipuladores de evento para os botões de tamanho
function escolherTamanhoDaPizza() {
    let tamanhoSelecionado = '';
    tamanhoButtons.forEach(button => {
        button.addEventListener('click', function() {
            //abrir popout referente ao tamanho da pizza selecionado
            const tamanho = button.id;
            tamanhoSelecionado = tamanho;
            popout.style.display = 'block';
            selectSizeModal.style.display = 'none';
            
            // Atualizar o texto do tamanho selecionado no popout
            const selectedSizeElement = document.getElementById('selected-size');
            selectedSizeElement.textContent = tamanho;

            popoutAtual = popout;
        });
    });
    const confirmarBtn = document.querySelector('.confirmar-btn');
    confirmarBtn.addEventListener('click', function() {
        // Chama a função para gerar o arquivo de impressão
        const selectedCategory = document.querySelector('.pizza-category-header').textContent;
        const selectedSabor = document.querySelector('.pizza-list-item.selected .pizza-list-item-sabor').textContent;
        gerarPedidoParaImpressao(tamanhoSelecionado, selectedCategory, selectedSabor);
    });
}

//Manipuladore de evento pra os botoes de categorias de pizza
categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
        popoutCategory.style.display = 'none';
        popoutGeraComanda.style.display = 'block';
        if (button.id === 'tradicional') {
            exibirListaDePizzas(cardapio.categorias.tradicional, 'Tradicional');
        } else if (button.id === 'especial') {
            exibirListaDePizzas(cardapio.categorias.especial, 'Especial');
        } else if (button.id === 'premium') {
            exibirListaDePizzas(cardapio.categorias.premium, 'Premium');
        } else {
            exibirListaDePizzas(cardapio.categorias.doces, 'Doces');
        }
    });
});

//comportamento do voltar btn
voltarBtn.addEventListener('click', function() {
    if (popoutAtual) {
        popoutAtual.style.display = 'none';
        popoutDefault.style.display = 'block';
    }
});

voltarBugado.addEventListener('click', function() {
    popoutGeraComanda.style.display = 'none';
    popoutCategory.style.display = 'block';
});

// Função para gerar o arquivo de impressão do pedido
function gerarPedidoParaImpressao(tamanho, categoria, sabor) {
    const conteudo = `La Pizza comanda da cozinha:

            Tamanho: ${tamanho}
            Categoria: ${categoria}
            borda:
            Sabor: ${sabor}

Obrigado por escolher a nossa pizzaria!`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([conteudo], { type: 'text/plain' }));
    link.download = 'pedido.txt';
    link.textContent = 'Clique aqui para baixar o arquivo de pedido';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

escolherTamanhoDaPizza();
