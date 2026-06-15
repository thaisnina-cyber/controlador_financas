
const URL_API = "/dados";


async function handleResponse(response) {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
 
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response; 
}

export async function buscarDadosApi() {
  const response = await fetch(URL_API);
  return await handleResponse(response);
}

export async function salvarRendaApi(novaRenda) {
  const response = await fetch(`${URL_API}/renda`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ renda: novaRenda })
  });
  return response;
}

export async function adicionarGastoApi(nome, preco, categoria) {
  const response = await fetch(`${URL_API}/gasto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, preco, categoria })
  });
  return response;
}

export async function deletarGastoApi(id) {
  const response = await fetch(`${URL_API}/gasto/${id}`, {
    method: "DELETE"
  });
  return response;
}

export async function editarGastoApi(id, nome, preco, categoria) {
  const response = await fetch(`${URL_API}/gasto/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, preco, categoria })
  });
  return response;
}
