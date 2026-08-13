import json
import uuid
from datetime import datetime
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def carregar_dados():
    try:
        with open("dados.json", "r", encoding="utf-8") as arquivo:
            dados_salvos = json.load(arquivo)
            return dados_salvos.get("lista_de_gastos", []), dados_salvos.get("valor_da_renda", 0.0)
    except (FileNotFoundError, json.JSONDecodeError, KeyError):
        return [], 0.0

def salvar_dados(renda, historico):
    dados_salvos = {"valor_da_renda": renda, "lista_de_gastos": historico}
    with open("dados.json", "w", encoding="utf-8") as arquivo:
        json.dump(dados_salvos, arquivo, indent=4, ensure_ascii=False)
@app.route("/") 
def home(): 
    return render_template("index.html")
@app.route("/historico")
def historico():
    return render_template("historico.html")

@app.route("/dados", methods=["GET"])
def obter_dados():
    historico, renda = carregar_dados()
    return jsonify({"historico": historico, "renda": renda})

@app.route("/dados/renda", methods=["POST"])
def atualizar_renda():
    dados = request.get_json()
    renda = dados.get("renda", 0.0)
    historico, _ = carregar_dados()
    salvar_dados(renda, historico)
    return jsonify({"message": "Renda atualizada com sucesso!"})

@app.route("/dados/gasto", methods=["POST"])
def adicionar_gasto():
    dados = request.get_json(force=True) or {}
    nome = dados.get("nome", "").strip()
    valor = dados.get("valor", 0.0)
    categoria = dados.get("categoria", "variavel")
    if not nome:
        return jsonify({"error": "O nome do gasto não pode estar vazio!"}), 400
        
    # Data formatadas
    data_hora = datetime.now().strftime("%d/%m/%Y")
    
    # Criação do novo gasto com ID único
    novo_gasto = {
        "id": str(uuid.uuid4())[:8],
        "nome": nome,
        "valor": valor,
        "categoria": categoria,
        "data_hora": data_hora
    }
    
    historico, renda = carregar_dados()
    historico.append(novo_gasto)
    salvar_dados(renda, historico)
    
    return jsonify({"message": "Gasto adicionado com sucesso!", "gasto": novo_gasto})

@app.route("/dados/gasto/<string:gasto_id>", methods=["DELETE"])
def deletar_gasto(gasto_id):
    historico, renda = carregar_dados()
    novo_historico = [gasto for gasto in historico if gasto.get("id") != gasto_id]
    
    if len(novo_historico) == len(historico):
        return jsonify({"error": "Gasto não encontrado!"}), 404
        
    salvar_dados(renda, novo_historico)
    return jsonify({"message": "Gasto removido com sucesso!"})

@app.route("/dados/gasto/<string:gasto_id>", methods=["PUT"])
def editar_gasto(gasto_id):
    dados = request.get_json()
    nome = dados.get("nome", "").strip()
    valor = dados.get("valor", 0.0)
    categoria = dados.get("categoria", "variavel")
    
    historico, renda = carregar_dados()
    salvar_dados(renda, historico)
    editado = False
    
    for gasto in historico:
        if gasto.get("id") == gasto_id:
            gasto["nome"] = nome
            gasto["valor"] = gasto.get("valor", valor)  # Mantém o valor original se não for fornecido
            gasto["categoria"] = categoria
            editado = True
            break
            
    if not editado:
        return jsonify({"error": "Gasto não encontrado!"}), 404
        
    salvar_dados(renda, historico)
    return jsonify({"message": "Gasto atualizado com sucesso!"})

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=8080)

