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


function exibirListaDePizzas(pizzas) {
    const pizzaListElement = document.getElementById('categoria');
    // Limpar conteúdo anterior
    pizzaListElement.innerHTML = '';
    // Criar e inserir elementos de lista para cada pizza
    pizzas.forEach(pizza => {
        const listItem = document.createElement('li');
        listItem.textContent = pizza.sabor;
        pizzaListElement.appendChild(listItem);
    });
}






// Manipuladores de evento para os botões de tamanho
function escolherTamanhoDaPizza(){
    let tamanhoSelecionado ='';
    tamanhoButtons.forEach(button => {
    button.addEventListener('click', function() {
       //abrir popout referente ao tamanho da pizza selecionado
       const tamanho = button.id;
       tamanhoSelecionado = tamanho;
       popout.style.display = 'block';
       selectSizeModal.style.display = 'none';
       console.log(tamanhoSelecionado)
       popoutAtual = popout
    })
})

}



//Manipuladore de evento pra os botoes de categorias de pizza
categoryButtons.forEach(button =>{
    button.addEventListener('click',function(){
        popoutCategory.style.display = 'none'
        popoutGeraComanda.style.display =' block'
        if(button.id === 'tradicional'){
            console.log(cardapio.categorias.tradicional)
            exibirListaDePizzas(cardapio.categorias.tradicional)
           
        } else if(button.id === 'especial'){
            exibirListaDePizzas(cardapio.categorias.especial)
            console.log(cardapio.categorias.especial)
        } else if(button.id === 'premium'){
            exibirListaDePizzas(cardapio.categorias.premium)
            console.log(cardapio.categorias.premium)
        }else{
            exibirListaDePizzas(cardapio.categorias.doces)
            console.log(cardapio.categorias.doces)
        }
    })
})

//comportamento do voltar btn
voltarBtn.addEventListener('click', function() {
    if (popoutAtual) {
        // popoutAtual = popoutAnterior;
        popoutAtual.style.display = 'none';
        // Trocar as referências de popout atual e anterior
        popoutDefault.style.display = 'block';
    }
});

voltarBugado.addEventListener('click',function(){
    popoutGeraComanda.style.display = 'none';
    popoutCategory.style.display = 'block';
})

escolherTamanhoDaPizza();


