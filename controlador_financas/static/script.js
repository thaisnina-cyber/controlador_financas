const URL_API = "http://127.0.0.1:8080/dados";


function toggleRendaForm() {
    const form = document.getElementById('renda-form-container');
    form.style.display = form.style.display === 'block' ? 'none' : 'block';
}


async function carregarDados() {
    try {
        const resposta = await fetch(URL_API);
        const dados = await resposta.json();
        
        const renda = dados.renda || 0;
        const historico = dados.historico || [];
        
        
        document.getElementById('txt-renda').innerText = `R$ ${renda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        exibirDadosNaTela(renda, historico);
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
    }
}


async function atualizarRenda() {
    const input = document.getElementById('renda-input');
    const novaRenda = parseFloat(input.value);
    
    if (isNaN(novaRenda) || novaRenda < 0) {
        alert("Por favor, digite um valor de renda válido (igual ou maior que zero).");
        return;
    }
    
    try {
        await fetch(`${URL_API}/renda`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ renda: novaRenda })
        });
        
        input.value = "";
        toggleRendaForm();
        carregarDados();
    } catch (erro) {
        console.error("Erro ao atualizar renda:", erro);
    }
}


async function adicionarGasto() {
    const inputNome = document.getElementById('nome');
    const inputValor = document.getElementById('valor');
    const inputCategoria = document.getElementById('categoria');
    const inputMesAno = document.getElementById('mesAno');

    
    const nome = inputNome.value.trim();
    const valor = parseFloat(inputValor.value);
    const categoria = inputCategoria.value;
    const mesAno = inputMesAno.value;
    
    if (!nome) {
        alert("Por favor, preencha a descrição do gasto.");
        return;
    }
    
    if (isNaN(valor) || valor <= 0) {
        alert("Por favor, insira um valor válido e maior que zero.");
        return;
    }
    
    try {
        await fetch(`${URL_API}/gasto`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome: nome, preco: valor, categoria: categoria, mesAno: mesAno })
        });
        
        inputNome.value = "";
        inputValor.value = "";
        inputMesAno.value = "";
        
        carregarDados();
    } catch (erro) {
        console.error("Erro ao adicionar gasto:", erro);
    }
}

async function deletarGasto(id) {
    if (!confirm("Deseja realmente excluir este gasto?")) return;
    
    try {
        await fetch(`${URL_API}/gasto/${id}`, {
            method: "DELETE"
        });
        carregarDados();
    } catch (erro) {
        console.error("Erro ao deletar gasto:", erro);
    }
}

function abrirModalEditar(id, nome, preco, categoria) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-nome').value = nome;
    document.getElementById('edit-valor').value = preco;
    document.getElementById('edit-categoria').value = categoria;
    
    document.getElementById('modal-editar').style.display = 'flex';
}

function fecharModalEditar() {
    document.getElementById('modal-editar').style.display = 'none';
}

async function salvarEdicaoGasto() {
    const id = document.getElementById('edit-id').value;
    const nome = document.getElementById('edit-nome').value.trim();
    const valor = parseFloat(document.getElementById('edit-valor').value);
    const categoria = document.getElementById('edit-categoria').value;
    
    if (!nome) {
        alert("A descrição não pode ser vazia.");
        return;
    }
    
    if (isNaN(valor) || valor <= 0) {
        alert("Insira um valor válido maior que zero.");
        return;
    }
    
    try {
        await fetch(`${URL_API}/gasto/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome: nome, preco: valor, categoria: categoria })
        });
        
        fecharModalEditar();
        carregarDados();
    } catch (erro) {
        console.error("Erro ao atualizar gasto:", erro);
    }
}


function exibirDadosNaTela(renda, historico) {
    const lista = document.getElementById('lista-gastos');
    lista.innerHTML = "";
    
    let totalGasto = 0;
    
    if (historico.length === 0) {
        lista.innerHTML = '<p class="vazio-msg">Nenhum gasto cadastrado ainda. Comece adicionando um gasto acima!</p>';
    } else {
        historico.forEach(item => {
            totalGasto += item.preco;
            
                       const icon = item.categoria === 'fixo' ? '📌' : '⚡';
            const badgeClass = item.categoria === 'fixo' ? 'badge-fixo' : 'badge-variavel';
            const catName = item.categoria === 'fixo' ? 'Fixo' : 'Variável';
            
            
            const nomeEscapado = item.nome.replace(/'/g, "\\'").replace(/"/g, '&quot;');
            
            lista.innerHTML += `
                <div class="gasto-item">
                    <div class="gasto-info">
                        <div class="gasto-categoria-icon">${icon}</div>
                        <div class="gasto-detalhes">
                            <span class="gasto-nome">${item.nome}</span>
                            <div class="gasto-meta">
                                <span class="badge-categoria ${badgeClass}">${catName}</span>
                                <span>📅 ${item.data_hora || 'Recém-adicionado'}</span>
                            </div>
                        </div>
                    </div>
                    <div class="gasto-valores">
                        <span class="gasto-preco">R$ ${item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <div class="gasto-acoes">
                            <button class="btn-acao btn-editar" title="Editar gasto" onclick="abrirModalEditar('${item.id}', '${nomeEscapado}', ${item.preco}, '${item.categoria}')">
                                ✏️
                            </button>
                            <button class="btn-acao btn-excluir" title="Excluir gasto" onclick="deletarGasto('${item.id}')">
                                🗑️
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
   
    document.getElementById('txt-despesas').innerText = `R$ ${totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    const saldo = renda - totalGasto;
    const txtSaldo = document.getElementById('txt-saldo');
    const cardSaldo = document.getElementById('card-saldo');
    
    txtSaldo.innerText = `R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    
    if (saldo < 0) {
        txtSaldo.style.color = "var(--color-danger)";
        cardSaldo.style.setProperty('--badge-color', 'var(--color-danger)');
    } else {
        txtSaldo.style.color = "var(--color-success)";
        cardSaldo.style.setProperty('--badge-color', 'var(--color-success)');
    }
}


carregarDados();
