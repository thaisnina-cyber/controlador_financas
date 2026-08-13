const URL_API = "http://127.0.0.1:8080/";

export async function buscarDadosApi() {
    const resposta = await fetch(URL_API);
    return await resposta.json();
}

export async function salvarRendaApi(novaRenda) {
    return await fetch(`${URL_API}/renda`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ renda: novaRenda })
    });
}

export async function adicionarGastoApi(nome, preco, categoria) {
    return await fetch(`${URL_API}/gasto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, preco, categoria })
    });
}

export async function deletarGastoApi(id) {
    return await fetch(`${URL_API}/gasto/${id}`, {
        method: "DELETE"
    });
}

export async function editarGastoApi(id, nome, preco, categoria) {
    return await fetch(`${URL_API}/gasto/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, preco, categoria })
    });
}