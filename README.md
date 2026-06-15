# Finanças Premium

Gestor financeiro web usando **Flask** + **SQLite**, com frontend modularizado em JavaScript ES6.

## Visão geral

- **Backend**: `controlador_financas.py` — API REST em Flask + serve os arquivos do frontend.
- **Banco de dados**: `financas.db` (SQLite, gerado automaticamente na primeira execução).
- **Frontend**: `index.HTML` + módulos JavaScript (`api.js`, `ui.js`) consumindo a API via `fetch`.

> O Flask serve tanto a API quanto os arquivos estáticos (HTML/JS), tudo na porta **5000**.  
> Não é necessário nenhum servidor estático adicional.

## Como executar

### 1. Instalar dependências

```bash
pip install flask flask-cors
```

### 2. Iniciar o servidor

```bash
python controlador_financas.py
```

### 3. Acessar no navegador

```
http://127.0.0.1:5000/
```

Pronto! Só um comando, só uma porta.

## Estrutura de arquivos

```
controlador_financas/
├─ controlador_financas.py   # Flask app — API REST + serve os arquivos estáticos
├─ financas.db               # SQLite DB (gerado na primeira execução)
├─ index.HTML                # Interface principal
├─ api.js                    # Módulo ES6 — encapsula todas as chamadas fetch
├─ ui.js                     # Módulo ES6 — lógica da interface e renderização
└─ README.md                 # Este documento
```

## Arquitetura JavaScript (ES6 Modules)

| Arquivo | Responsabilidade |
|---------|-----------------|
| `api.js` | Todas as chamadas `fetch` ao backend (GET, POST, PUT, DELETE). URLs relativas (`/dados/...`) — sem hardcode de porta. |
| `ui.js` | Carregar dados, manipular formulários, renderizar lista de gastos, calcular saldo. Expõe funções globais via `window.*` para os handlers `onclick` do HTML. |

O `index.HTML` carrega `ui.js` como módulo ES6:
```html
<script type="module" src="ui.js"></script>
```

## Endpoints da API

| Método | Rota | Corpo | Descrição |
|--------|------|-------|-----------|
| `GET` | `/dados` | — | Retorna `{ renda, historico }` |
| `POST` | `/dados/renda` | `{ renda: número }` | Atualiza a renda mensal |
| `POST` | `/dados/gasto` | `{ nome, preco, categoria }` | Adiciona um gasto |
| `PUT` | `/dados/gasto/<id>` | `{ nome, preco, categoria }` | Edita um gasto |
| `DELETE` | `/dados/gasto/<id>` | — | Remove um gasto |

## Contribuindo

1. Fork o repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nome`).
3. Faça commit das suas mudanças e abra um Pull Request.
4. Mantenha a separação entre `api.js` (acesso a dados) e `ui.js` (interface).

---
*Desenvolvido como parte do projeto DIO Agent para ensinar boas práticas de arquitetura web.*
