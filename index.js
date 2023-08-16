// Importar o objeto 'cardapio' do arquivo 'cardapio.js'
import { cardapio } from './cardapio.js';

// Selecionar os elementos relevantes do HTML
const tamanhoButtons = document.querySelectorAll('.pizza-btn');
const categoryButtons = document.querySelectorAll('.category-btn');
const voltarBtn = document.querySelector('.voltar-btn');
const voltarBugado = document.getElementById('voltar-bugado');
const selectSizeModal = document.getElementById('select-size');
const popout = document.getElementById('popout');
const popoutGeraComanda = document.querySelector('#popout-gerar-comanda');
const popoutCategory = document.querySelector('#popout-category');
const bordaRecheadaBtn = document.getElementById('borda-recheada-btn');
const bordaModal = document.getElementById('bordaModal');
const saboresBordaContainer = document.getElementById('sabores-borda');
const voltarBordaBtn = document.getElementById('voltar-borda');
const saboresSelecionadosElement = document.getElementById('sabores-selecionados'); // Elemento para exibir sabores selecionados
const observacaoInput = document.getElementById('observacao');

// Variáveis para rastrear popouts
let popoutAtual = null;
let popoutAnterior = null;
let popoutDefault = selectSizeModal;

// Número máximo de sabores por tamanho
const maxSabores = {
    broto: 1,
    media: 2,
    grande: 2,
    big: 3
};

// Variáveis para rastrear seleções do usuário
let tamanhoSelecionado = '';
let saboresSelecionados = [];
let categoriaSelecionada = '';

// Função para exibir a lista de pizzas de uma categoria
function exibirListaDePizzas(pizzas, categoria) {
    const pizzaListElement = document.getElementById('categoria');
    pizzaListElement.innerHTML = '';

    // Cabeçalho da categoria
    const categoryHeader = document.createElement('h3');
    categoryHeader.classList.add('pizza-category-header');
    categoryHeader.textContent = categoria;
    pizzaListElement.appendChild(categoryHeader);

    // Exibir cada pizza da categoria
    pizzas.forEach(pizza => {
        const listItem = document.createElement('div');
        listItem.classList.add('pizza-list-item');
        

        // Número da pizza
        const numElement = document.createElement('span');
        numElement.classList.add('pizza-list-item-num');
        numElement.textContent = `${pizza.id}`;
        listItem.appendChild(numElement);

        // Sabor da pizza
        const saborElement = document.createElement('span');
        saborElement.classList.add('pizza-list-item-sabor');
        saborElement.textContent = ` ${pizza.sabor}`;
        listItem.appendChild(saborElement);

        // Verificar se o sabor já foi selecionado
        if (saboresSelecionados.includes(pizza.sabor)) {
            listItem.classList.add('selected');
        }

        // Lidar com o clique na pizza
        listItem.addEventListener('click', function() {
            const allItems = document.querySelectorAll('.pizza-list-item');
            allItems.forEach(item => {
                item.classList.remove('selected');
            });

            listItem.classList.add('selected');
            selecionarSabor(saborElement, pizza.sabor);
            atualizarInformacoesPedido();
        });

        pizzaListElement.appendChild(listItem);
    });
}

// Função para atualizar as informações na barra lateral do pedido
function atualizarInformacoesPedido() {
    const tamanhoPedidoElement = document.getElementById('tamanho-pedido');
    const categoriaPedidoElement = document.getElementById('categoria-pedido');
    const saboresPedidoElement = document.getElementById('sabores-pedido');
    const bordaPedidoElement = document.getElementById('borda-pedido');

    // Atualizar informações sobre o tamanho da pizza
    tamanhoPedidoElement.textContent = capitalizeFirstLetter(tamanhoSelecionado);

    // Atualizar informações sobre a categoria da pizza
    categoriaPedidoElement.textContent = capitalizeFirstLetter(categoriaSelecionada);

    // Atualizar informações sobre os sabores da pizza
    if (saboresSelecionados.length > 0) {
        const proporcao = `1/${maxSabores[tamanhoSelecionado]}`;
        const saboresTexto = saboresSelecionados.map(sabor => `${proporcao} ${sabor}`).join(', ');
        saboresPedidoElement.textContent = saboresTexto;
    } else {
        saboresPedidoElement.textContent = 'Nenhum sabor selecionado.';
    }

    // Atualizar informações sobre a borda da pizza
    if (saboresBorda.length > 0) {
        const saboresBordaTexto = saboresBorda.map(sabor => capitalizeFirstLetter(sabor)).join(', ');
        bordaPedidoElement.textContent = ` ${saboresBordaTexto}`;
    } else {
        bordaPedidoElement.textContent = 'Sem borda';
    }
}



// Função para escolher o tamanho da pizza
function escolherTamanhoDaPizza() {
    atualizarInformacoesPedido();
    tamanhoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tamanho = button.id;
            tamanhoSelecionado = tamanho;
            popout.style.display = 'block';
            selectSizeModal.style.display = 'none';

            const selectedSizeElement = document.getElementById('selected-size');
            selectedSizeElement.textContent = tamanho;

            popoutAtual = popout;
            atualizarSaboresSelecionados();
            atualizarPedidoSidebar();

            document.getElementById('tamanho-pedido').textContent = capitalizeFirstLetter(tamanho);
            document.getElementById('borda-pedido').textContent = 'Sem borda';
            document.getElementById('sabores-pedido').textContent = '-';
            pedidoSidebar.style.left = '0'; // Mostrar a barra lateral do pedido
        });
    });
    
}
    


// Event listeners para os botões de categoria
categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
        popoutCategory.style.display = 'none';
        popoutGeraComanda.style.display = 'block';
        categoriaSelecionada = button.id;
        const pizzas = cardapio.categorias[categoriaSelecionada];
        exibirListaDePizzas(pizzas, capitalizeFirstLetter(categoriaSelecionada));
        resetarSelecaoSabores();

        categoriaPedidoElement.textContent = capitalizeFirstLetter(categoriaSelecionada);
        atualizarPedidoSidebar(); // Atualiza em tempo real ao selecionar uma categoria
    });
});

// Event listener para o botão de voltar
voltarBtn.addEventListener('click', function() {
    if (popoutAtual) {
        popoutAtual.style.display = 'none';
        popoutDefault.style.display = 'block';
    }
});

// Event listener para o botão de voltar (segunda tela)
voltarBugado.addEventListener('click', function() {
    popoutGeraComanda.style.display = 'none';
    popoutCategory.style.display = 'block';
    saboresSelecionados = [];
    atualizarSaboresSelecionados();
    resetarSelecaoSabores();
    categoriaSelecionada = '';
});

// Função para selecionar um sabor
function selecionarSabor(saborElement, sabor) {
    if (saboresSelecionados.includes(sabor)) {
        const index = saboresSelecionados.indexOf(sabor);
        if (index !== -1) {
            saboresSelecionados.splice(index, 1);
        }
        saborElement.classList.remove('selected');

        // Verificar se o sabor removido é da borda recheada
        if (saboresBorda.includes(sabor)) {
            saboresBorda = []; // Remover a borda recheada da lista
        }
    } else {
        if (saboresSelecionados.length < maxSabores[tamanhoSelecionado]) {
            saboresSelecionados.push(sabor);
            saborElement.classList.add('selected');
            if (saborBordaRecheada.includes(sabor)) {
                exibirSaboresBorda(); // Atualizar a lista de sabores de borda recheada
            }
        } else {
            alert(`Você só pode escolher até ${maxSabores[tamanhoSelecionado]} sabores para um tamanho ${tamanhoSelecionado}.`);
        }
    }
    atualizarPedidoSidebar();
    atualizarSaboresSelecionados();
}

// Função para resetar a seleção de sabores
function resetarSelecaoSabores() {
    const allItems = document.querySelectorAll('.pizza-list-item');
    allItems.forEach(item => {
        item.classList.remove('selected');
    });
    saboresSelecionados = [];
    atualizarSaboresSelecionados();
}

// Função para atualizar a exibição dos sabores selecionados
function atualizarSaboresSelecionados() {
    const proporcao = `1/${maxSabores[tamanhoSelecionado]}`;

    if (saboresSelecionados.length > 0) {
        const saboresTexto = saboresSelecionados.map(sabor => `<span class="sabor-selecionado">${proporcao} ${sabor}</span>`).join(', ');
        saboresSelecionadosElement.innerHTML = `Sabores Selecionados: ${saboresTexto}`;
    } else {
        saboresSelecionadosElement.innerHTML = 'Nenhum sabor selecionado.';
    }
}


// Função para gerar o pedido e disponibilizar para impressão
function gerarPedidoParaImpressao(tamanho, categoria, saboresSelecionados, numeroPedido, detalhes) {
    const proporcao = `1/${maxSabores[tamanho]}`;
    
    // Formatar sabores de borda recheada
    const saboresBorda = saboresSelecionados.filter(sabor => saborBordaRecheada.includes(sabor));
    const saboresBordaTexto = saboresBorda.length > 0 ? `Borda: ${saboresBorda.join(', ')}` : 'Borda não selecionada';
    
    const saboresPizza = saboresSelecionados.filter(sabor => !saborBordaRecheada.includes(sabor));
    let saboresPizzaTexto = '';

    if (saboresPizza.length === 1) {
        saboresPizzaTexto = `Sabor: ${saboresPizza[0]}`;
    } else if (saboresPizza.length > 1) {
        saboresPizzaTexto = `Sabores: ${saboresPizza.map(sabor => `${proporcao} ${sabor}`).join('<br>')}`;
    }

    const horarioAtual = new Date().toLocaleTimeString(); // Obter o horário atual do computador

    const conteudo = `La Pizza Comanda da Cozinha
Pedido Numero: ${numeroPedido}
Categoria: ${categoria}
${saboresBordaTexto}
${saboresPizzaTexto}

Horário do Pedido: ${horarioAtual}

Detalhes: ${detalhes}

Obrigado por escolher a nossa pizzaria!`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([conteudo], { type: 'text/plain' }));
    link.download = 'pedido.txt';
    link.textContent = 'Clique aqui para baixar o arquivo de pedido';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Função auxiliar para capitalizar a primeira letra de uma string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Array de sabores de borda recheada
const saborBordaRecheada = ['Cheddar', 'Catupiry', 'Chocolate Branco', 'Chocolate Preto'];

// Função para exibir os sabores de borda recheada
function exibirSaboresBorda() {
    saboresBordaContainer.innerHTML = ''; // Limpar os sabores anteriores

    saborBordaRecheada.forEach((sabor) => {
        const saborBtn = document.createElement('button');
        saborBtn.classList.add('action-btn', 'sabor-borda-btn');
        saborBtn.innerText = sabor;

        saborBtn.addEventListener('click', () => {
            saboresBorda = [sabor]; // Definir apenas um sabor de borda recheada
            atualizarSaboresSelecionados();
            atualizarPedidoSidebar(); // Atualizar a barra lateral do pedido

            bordaModal.style.display = 'none';
        });

        saboresBordaContainer.appendChild(saborBtn);
    });

    // Adicionar botão de remoção de borda (se existir borda recheada)
    if (saboresBorda.length > 0) {
        const removerBordaBtn = document.createElement('button');
        removerBordaBtn.classList.add('action-btn', 'remover-borda-btn');
        removerBordaBtn.innerText = 'Remover Borda';

        removerBordaBtn.addEventListener('click', () => {
            saboresBorda = []; // Remover o sabor da borda
            atualizarSaboresSelecionados();
            atualizarPedidoSidebar(); // Atualizar a barra lateral do pedido
        });

        saboresBordaContainer.appendChild(removerBordaBtn);
    }
}


let saboresBorda = [];
// Event listener para o botão de "Borda Recheada"
bordaRecheadaBtn.addEventListener('click', () => {
    bordaModal.style.display = 'flex';
    exibirSaboresBorda(); // Exibir os sabores de borda recheada
    atualizarPedidoSidebar(); // Atualiza em tempo real ao abrir a escolha de borda
});



// Event listener para o botão de "Voltar Borda"
voltarBordaBtn.addEventListener('click', () => {
    bordaModal.style.display = 'none';
});



// Estrutura de dados para armazenar as pizzas do pedido
const pedido = [];

const openPedidoSidebarBtn = document.getElementById('open-pedido-sidebar');
const closePedidoSidebarBtn = document.getElementById('close-pedido-sidebar');
const pedidoSidebar = document.getElementById('pedido-sidebar');
const finalizarPedidoBtn = document.getElementById('finalizar-pedido-btn');
const categoriaPedidoElement = document.getElementById('categoria-pedido');
const tamanhoPedidoElement = document.getElementById('tamanho-pedido');

categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
        popoutCategory.style.display = 'none';
        popoutGeraComanda.style.display = 'block';
        categoriaSelecionada = button.id;
        const pizzas = cardapio.categorias[categoriaSelecionada];
        exibirListaDePizzas(pizzas, capitalizeFirstLetter(categoriaSelecionada));
        resetarSelecaoSabores();

        // Atualizar a categoria na barra lateral
        categoriaPedidoElement.textContent = capitalizeFirstLetter(categoriaSelecionada);
    });
});

// Event listener para abrir a barra lateral do pedido
openPedidoSidebarBtn.addEventListener('click', () => {
    pedidoSidebar.style.left = '0'; // Abra a barra lateral na posição 0
    atualizarInformacoesPedido();
});

// Event listener para fechar a barra lateral do pedido
closePedidoSidebarBtn.addEventListener('click', () => {
    pedidoSidebar.style.left = '-300px'; // Feche a barra lateral
});


// Função para atualizar a janela lateral do pedido
function atualizarPedidoSidebar() {
    const itensPedidoElement = document.getElementById('itens-pedido');
    const bordaPedidoElement = document.getElementById('borda-pedido'); // Elemento da borda recheada

    itensPedidoElement.innerHTML = ''; // Limpa os itens anteriores

    if (tamanhoSelecionado && saboresSelecionados.length > 0) {
        const tamanhoPedido = capitalizeFirstLetter(tamanhoSelecionado);
        const saboresPedido = saboresSelecionados.map(sabor => capitalizeFirstLetter(sabor)).join(', ');

        const pedidoItem = document.createElement('li');
        // pedidoItem.innerHTML = `<strong>${tamanhoPedido}:</strong> ${saboresPedido}`;
        itensPedidoElement.appendChild(pedidoItem);

        // Exiba os sabores de borda recheada na barra lateral
        if (saboresBorda.length > 0) {
            const saboresBordaTexto = saboresBorda.map(sabor => capitalizeFirstLetter(sabor)).join(', ');
            bordaPedidoElement.textContent = `${saboresBordaTexto}`;
        } else {
            bordaPedidoElement.textContent = 'Sem borda';
        }

        // Adicione mais informações do pedido conforme necessário
    }
}


//evento para finalizar o pedido
finalizarPedidoBtn.addEventListener('click', () => {
    const detalhesDoPedido = observacaoInput.value || 'Sem detalhes';
    adicionarPizzaAoPedido(tamanhoSelecionado, categoriaSelecionada, saboresSelecionados, saboresBorda, detalhesDoPedido, horarioAtual);

    // Obter o pedido mais recente
    const pedidoMaisRecente = pedido[pedido.length - 1];

    // Exibir o pedido criado no console
    console.log('Pedido Criado:');
    console.log('Tamanho:', pedidoMaisRecente.tamanho);
    console.log('Categoria:', pedidoMaisRecente.categoria);
    console.log('Sabores:', pedidoMaisRecente.sabores.join(', '));
    console.log('Borda:', pedidoMaisRecente.borda.join(', '));
    console.log('Detalhes:', detalhesDoPedido);
    console.log('Horário:', pedidoMaisRecente.horario);

    // Gerar o pedido para impressão
    gerarPedidoParaImpressao(
        pedidoMaisRecente.tamanho,
        pedidoMaisRecente.categoria,
        pedidoMaisRecente.sabores,
        pedidoMaisRecente.borda,
        detalhesDoPedido,
        pedidoMaisRecente.horario
    );
});



let pizzasSalvas = [];

// Event listener para o botão "Salvar Pizza"
const salvarPizzaBtn = document.getElementById('salvar-pizza-btn');
salvarPizzaBtn.addEventListener('click', () => {
    if (tamanhoSelecionado && saboresSelecionados.length > 0) {
        const detalhesDoPedido = observacaoInput.value || 'Sem detalhes';
        const horarioAtual = new Date().toLocaleTimeString(); // Defina o horário atual aqui
        adicionarPizzaAoPedido(tamanhoSelecionado, categoriaSelecionada, saboresSelecionados, saboresBorda, detalhesDoPedido, horarioAtual);
    } else {
        alert('Por favor, selecione um tamanho e pelo menos um sabor antes de salvar.');
    }
});

function atualizarListaPizzasSalvas() {
    const pizzasSalvasList = document.getElementById('pizzas-salvas-list');
    pizzasSalvasList.innerHTML = '';

    pizzasSalvas.forEach((pizza, index) => {
        const pizzaItem = document.createElement('li');
        pizzaItem.innerHTML = `
            <strong>Pizza ${index + 1}:</strong> Tamanho: ${pizza.tamanho}, Sabores: ${pizza.sabores.join(', ')}, Borda: ${pizza.borda.join(', ')}, Detalhes: ${pizza.detalhes}
        `;
        pizzasSalvasList.appendChild(pizzaItem);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    atualizarListaPizzasSalvas();
});

finalizarPedidoBtn.addEventListener('click',()=>{
    finalizarPedido();
})

// Função para finalizar o pedido
function finalizarPedido() {
    const detalhesDoPedido = observacaoInput.value || 'Sem detalhes';

    // Obter o horário atual do computador
    const horarioAtual = new Date().toLocaleTimeString();

    // Gerar o pedido
    adicionarPizzaAoPedido(tamanhoSelecionado, categoriaSelecionada, saboresSelecionados, saboresBorda, detalhesDoPedido, horarioAtual);

    // Obter o pedido mais recente
    const pedidoMaisRecente = pedido[pedido.length - 1];

    // Exibir o pedido criado no console
    console.log('Pedido da Cozinha:');
    console.log('Tamanho:', pedidoMaisRecente.tamanho);
    console.log('Categoria:', pedidoMaisRecente.categoria);
    console.log('Sabores:', pedidoMaisRecente.sabores.join(', '));
    console.log('Borda:', pedidoMaisRecente.borda.join(', '));
    console.log('Detalhes:', detalhesDoPedido);
    console.log('Horário:', pedidoMaisRecente.horario);

    // Gerar o pedido para impressão
    imprimirPedido(
        pedidoMaisRecente.tamanho,
        pedidoMaisRecente.categoria,
        pedidoMaisRecente.sabores,
        pedidoMaisRecente.borda,
        detalhesDoPedido,
        pedidoMaisRecente.horario
    );

    // Fechar a barra lateral do pedido
    pedidoSidebar.style.left = '-300px';
}

// Função para imprimir o pedido
function imprimirPedido(tamanho, categoria, sabores, borda, detalhes, horario) {
    const bordaParaImprimir = borda.length > 0 ? borda.map(sabor => capitalizeFirstLetter(sabor)).join(', ') : 'Sem borda';

    const pedidoParaImprimir = `
        Tamanho: ${capitalizeFirstLetter(tamanho)}
        Categoria: ${capitalizeFirstLetter(categoria)}
        Sabores: ${sabores.map(sabor => capitalizeFirstLetter(sabor)).join(', ')}
        Borda: ${bordaParaImprimir}
        Observação: ${detalhes}
        Horário: ${horario}
    `;

    // Estilos CSS para o pedido impresso
    const styles = `
        <style>
            body {
                font-size: 18px; /* Tamanho da fonte */
                line-height: 1.5; /* Espaçamento entre linhas */
            }
            pre {
                font-family: monospace; /* Usar fonte monospace para manter a formatação */
            }
        </style>
    `;

    // Criar uma nova janela para impressão
    const printWindow = window.open('', '_blank');

    // Escrever os estilos e o conteúdo do pedido na janela de impressão
    printWindow.document.write(styles);
    printWindow.document.write(`<pre>${pedidoParaImprimir}</pre>`);
    printWindow.document.close();

    // Iniciar o processo de impressão
    printWindow.print();
}


function adicionarPizzaAoPedido(tamanho, categoria, sabores, borda, detalhes, horario) {
    pedido.push({
        tamanho: tamanho,
        categoria: categoria,
        sabores: sabores,
        borda: borda,
        detalhes: detalhes,
        horario: horario
    });

    // Atualizar a lista de pizzas salvas
    pizzasSalvas.push({
        tamanho: tamanho,
        sabores: sabores,
        borda: borda,
        detalhes: detalhes,
        horario: horario
    });
    atualizarListaPizzasSalvas();
}


// Iniciar a escolha do tamanho da pizza
escolherTamanhoDaPizza();
