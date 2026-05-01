import json
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
def carregar_dados():
    try:
        with open("dados.json", "r") as arquivo:
            dados_salvos = json.load(arquivo)
            return dados_salvos["lista_de_gastos"], dados_salvos["valor_da_renda"]
        dados_salvos.get("lista_de_gastos", []), dados_salvos.get("valor_da_renda", 0.0)   
    except (FileNotFoundError, json.JSONDecodeError, KeyError):
        return [], 0.0
    def salvar_dados(renda, historico):
        dados_salvos = {"valor_da_renda": renda, "lista_de_gastos": historico}
    with open("dados.json", "w") as arquivo:
        json.dump(dados_salvos, arquivo, indent=4)
    @app.route("/dados", methods=["GET"])
    def obter_dados():
        historico, renda = carregar_dados()
        return jsonify({"historico": historico, "renda": renda})    
    @app.route("/dados", methods=["POST"])
    def atualizar_dados():
        dados = request.get_json()
        renda = dados.get("renda", 0.0)
        historico = dados.get("historico", [])
    salvar_dados(renda, historico)
    return jsonify({"message": "Dados atualizados com sucesso!"})
    if __name__ == "__main__":
        app.run(debug=True)
        

