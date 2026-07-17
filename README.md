# 🏛️ Plutus - Inteligência Financeira

O **Plutus** é um controlador financeiro pessoal web moderno, minimalista e de alta performance, desenvolvido com foco em usabilidade e clareza visual. O projeto adota uma estética *Premium Light* inspirada nas principais FinTechs do mercado, integrado a um ecossistema completo de backend e banco de dados.

## ⚡ Visão Geral do Sistema

- **Design Premium**: Interface limpa baseada em tons de azul ardósia, branco puro e destaques em degradê dourado metálico para renda/saldo, além de alertas em vermelho para despesas.
- **Backend**: `controlador_financas.py` — API REST robusta desenvolvida em Flask, responsável por processar os dados e servir o frontend.
- **Banco de Dados**: `financas.db` — Persistência de dados em SQLite estruturada de forma automática na primeira execução do sistema.
- **Frontend Modular**: `index.html` + módulos nativos em JavaScript ES6 (`api.js`, `ui.js`) que gerenciam o estado da aplicação e consomem a API via `fetch`.

> O Flask serve tanto a API quanto os arquivos estáticos na porta **5000**. Não é necessário nenhum servidor estático adicional.

## 🚀 Como Executar

### 1. Instalar as dependências
```bash
pip install flask flask-cors
```

### 2. Iniciar o servidor de aplicação
```bash
python controlador_financas.py
```

### 3. Acessar no seu navegador de preferência
http://127.0.0.1:5000/
## 📂 Estrutura de Arquivos

```text
controlador_financas/
├─ controlador_financas.py # Flask app — API REST + servidor estático
├─ financas.db             # SQLite DB (gerado automaticamente)
├─ index.html              # Interface de usuário customizada (Plutus UI)
├─ api.js                  # Módulo ES6 — encapsulamento das chamadas fetch
├─ ui.js                   # Módulo ES6 — lógica de renderização e estado
└─ README.md               # Documentação técnica do projeto
```

## 🏗️ Arquitetura JavaScript (Módulos ES6)

| Arquivo | Responsabilidade |
|:---|:---|
| `api.js` | Centraliza todas as requisições assíncronas `fetch` direcionadas ao backend (GET, POST, PUT, DELETE) utilizando URLs relativas para evitar portas estáticas no código. |
| `ui.js` | Gerencia o ciclo de vida da interface: escuta seletores de período (Mês/Ano), manipula formulários de registro, renderiza o histórico e atualiza dinamicamente os valores de saldo e despesas. |

## 🔌 Endpoints da API REST

| Método | Rota | Corpo (JSON) | Descrição |
|:---|:---|:---|:---|
| `GET` | `/dados` | — | Retorna o estado financeiro atual `{ renda, historico }` |
| `POST` | `/dados/renda` | `{ renda: número }` | Atualiza o montante da renda mensal |
| `POST` | `/dados/gasto` | `{ nome, preco, categoria }` | Registra um novo lançamento (gasto) baseado em sua descrição |
| `PUT` | `/dados/gasto/<id>` | `{ nome, preco, categoria }` | Atualiza os metadados de um lançamento existente |
| `DELETE` | `/dados/gasto/<id>` | — | Remove definitivamente um registro do histórico |

---
*Desenvolvido e refinado para aplicar conceitos avançados de UI Design corporativo e arquitetura limpa.*