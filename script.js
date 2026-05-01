// Endereço da API que você criou no Flask
const URL_API = "http://127.0.0";

// 1. Função para BUSCAR dados do Python (Rota GET)
async function carregarDados() {
    const resposta = await fetch(URL_API);
    const dados = await resposta.json();
    
    document.getElementById('txt-renda').innerText = `R$ ${dados.renda.toFixed(2)}`;
    exibirDadosNaTela(dados);
}

// 2. Função para ENVIAR dados para o Python (Rota POST)
async function adicionarGasto() {
    const nome = document.getElementById('nome').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const categoria = document.getElementById('categoria').value;

    // Primeiro, pegamos os dados atuais para não sobrescrever o que já existe
    const res = await fetch(URL_API);
    const dadosAtuais = await res.json();

    // Adicionamos o novo gasto na lista
    dadosAtuais.historico.push({ nome: nome, preco: valor, categoria: categoria });

    // Enviamos para o Python salvar no JSON
    await fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAtuais)
    });

    carregarDados(); // Atualiza a tela com o novo gasto
}

function exibirDadosNaTela(dados) {
    const lista = document.getElementById('lista-gastos');
    lista.innerHTML = ""; // Limpa a lista antes de desenhar
    let totalGasto = 0;

    dados.historico.forEach(item => {
        totalGasto += item.preco;
        lista.innerHTML += `<p>📌 ${item.categoria} | ${item.nome}: R$ ${item.preco.toFixed(2)}</p>`;
    });

    const saldo = dados.renda - totalGasto;
    const saldoTxt = document.getElementById('txt-saldo');
    saldoTxt.innerText = `R$ ${saldo.toFixed(2)}`;
    saldoTxt.className = saldo < 0 ? "vermelho" : "verde";
}

// Inicia o app buscando os dados já salvos
carregarDados();
