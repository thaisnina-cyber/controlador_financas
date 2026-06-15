// UI module for Finanças app
import { buscarDadosApi, salvarRendaApi, adicionarGastoApi, deletarGastoApi, editarGastoApi } from './api.js';

// 1. Carregar dados do Backend e atualizar UI
export async function carregarDados() {
  try {
    const dados = await buscarDadosApi();
    const renda = dados.renda || 0;
    const historico = dados.historico || [];
    document.getElementById('txt-renda').innerText = `R$ ${renda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    exibirDadosNaTela(renda, historico);
  } catch (erro) {
    console.error('Erro ao carregar dados:', erro);
  }
}

// 2. Abre/Fecha formulário inline de Renda
export function toggleRendaForm() {
  const form = document.getElementById('renda-form-container');
  form.style.display = form.style.display === 'block' ? 'none' : 'block';
}

// 3. Atualizar Renda Mensal
export async function atualizarRenda() {
  const input = document.getElementById('renda-input');
  const novaRenda = parseFloat(input.value);
  if (isNaN(novaRenda) || novaRenda < 0) {
    alert('Por favor, digite um valor de renda válido (igual ou maior que zero).');
    return;
  }
  try {
    const response = await salvarRendaApi(novaRenda);
    if (!response.ok) {
      const errText = await response.text();
      console.error('Erro ao atualizar renda (HTTP):', response.status, errText);
      return;
    }
    console.log('Renda salva com sucesso, status', response.status);
    input.value = '';
    toggleRendaForm();
    carregarDados();
  } catch (erro) {
    console.error('Erro ao atualizar renda:', erro);
  }
}

// 4. Adicionar um Novo Gasto
export async function adicionarGasto() {
  const inputNome = document.getElementById('nome');
  const inputValor = document.getElementById('valor');
  const inputCategoria = document.getElementById('categoria');
  const nome = inputNome.value.trim();
  const valor = parseFloat(inputValor.value);
  const categoria = inputCategoria.value;
  if (!nome) {
    alert('Por favor, preencha a descrição do gasto.');
    return;
  }
  if (isNaN(valor) || valor <= 0) {
    alert('Por favor, insira um valor válido e maior que zero.');
    return;
  }
  try {
    const response = await adicionarGastoApi(nome, valor, categoria);
    if (!response.ok) {
      const errText = await response.text();
      console.error('Erro ao adicionar gasto (HTTP):', response.status, errText);
      return;
    }
    console.log('Gasto adicionado, status', response.status);
    inputNome.value = '';
    inputValor.value = '';
    carregarDados();
  } catch (erro) {
    console.error('Erro ao adicionar gasto:', erro);
  }
}

// 5. Deletar Gasto
export async function deletarGasto(id) {
  if (!confirm('Deseja realmente excluir este gasto?')) return;
  try {
    const response = await deletarGastoApi(id);
    if (!response.ok) {
      const errText = await response.text();
      console.error('Erro ao deletar gasto (HTTP):', response.status, errText);
      return;
    }
    console.log('Gasto deletado, status', response.status);
    carregarDados();
  } catch (erro) {
    console.error('Erro ao deletar gasto:', erro);
  }
}

// 6. Funções do Modal de Edição
export function abrirModalEditar(id, nome, preco, categoria) {
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-nome').value = nome;
  document.getElementById('edit-valor').value = preco;
  document.getElementById('edit-categoria').value = categoria;
  document.getElementById('modal-editar').style.display = 'flex';
}

export function fecharModalEditar() {
  document.getElementById('modal-editar').style.display = 'none';
}

export async function salvarEdicaoGasto() {
  const id = document.getElementById('edit-id').value;
  const nome = document.getElementById('edit-nome').value.trim();
  const valor = parseFloat(document.getElementById('edit-valor').value);
  const categoria = document.getElementById('edit-categoria').value;
  if (!nome) {
    alert('A descrição não pode ser vazia.');
    return;
  }
  if (isNaN(valor) || valor <= 0) {
    alert('Insira um valor válido maior que zero.');
    return;
  }
  try {
    const response = await editarGastoApi(id, nome, valor, categoria);
    if (!response.ok) {
      const errText = await response.text();
      console.error('Erro ao atualizar gasto (HTTP):', response.status, errText);
      return;
    }
    console.log('Gasto editado, status', response.status);
    fecharModalEditar();
    carregarDados();
  } catch (erro) {
    console.error('Erro ao atualizar gasto:', erro);
  }
}

// 7. Atualizar a Tela e Dashboard
function exibirDadosNaTela(renda, historico) {
  const lista = document.getElementById('lista-gastos');
  lista.innerHTML = '';
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
  // Atualiza cards
  document.getElementById('txt-despesas').innerText = `R$ ${totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const saldo = renda - totalGasto;
  const txtSaldo = document.getElementById('txt-saldo');
  const cardSaldo = document.getElementById('card-saldo');
  txtSaldo.innerText = `R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (saldo < 0) {
    txtSaldo.style.color = 'var(--color-danger)';
    cardSaldo.style.setProperty('--badge-color', 'var(--color-danger)');
  } else {
    txtSaldo.style.color = 'var(--color-success)';
    cardSaldo.style.setProperty('--badge-color', 'var(--color-success)');
  }
}

// Inicializa a aplicação ao carregar o módulo

// Expor funções ao escopo global para uso nos atributos onclick do HTML
window.toggleRendaForm = toggleRendaForm;
window.atualizarRenda = atualizarRenda;
window.adicionarGasto = adicionarGasto;
window.deletarGasto = deletarGasto;
window.abrirModalEditar = abrirModalEditar;
window.fecharModalEditar = fecharModalEditar;
window.salvarEdicaoGasto = salvarEdicaoGasto;
carregarDados();
