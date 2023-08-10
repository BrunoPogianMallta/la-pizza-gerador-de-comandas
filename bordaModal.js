const bordaRecheadaBtn = document.getElementById('borda-recheada-btn');
const modal = document.querySelector('.modal');
const modalContent = document.querySelector('.modal-content');

bordaRecheadaBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Adicione os sabores de borda recheada
const saboresBordaRecheada = ['Cheddar', 'Catupiry', 'Chocolate Branco', 'Chocolate Preto'];

saboresBordaRecheada.forEach((sabor) => {
    const saborBtn = document.createElement('button');
    saborBtn.classList.add('action-btn');
    saborBtn.innerText = sabor;

    saborBtn.addEventListener('click', () => {
        const saboresSelecionados = document.getElementById('sabores-selecionados');
        saboresSelecionados.innerHTML = `<span>Sabores de Borda Recheada: ${sabor}</span>`;
        modal.style.display = 'none';
    });

    modalContent.appendChild(saborBtn);
});