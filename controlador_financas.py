
import sqlite3
import uuid
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Pasta raiz onde estão index.HTML, ui.js, api.js, script.js
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.HTML')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory(BASE_DIR, filename)
def inicializar_banco():
    conn = sqlite3.connect("financas.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS gastos (
            id TEXT PRIMARY KEY,
            nome TEXT NOT NULL,
            preco REAL NOT NULL,
            categoria TEXT NOT NULL,
            data_hora TEXT NOT NULL,
            mesAno TEXT DEFAULT '2026-06'
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS renda_mensal (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            valor REAL NOT NULL
        )
    """)
    conn.commit()
    conn.close()
def carregar_dados():
    try:
        conn = sqlite3.connect("financas.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM gastos")
        historico = [dict(row) for row in cursor.fetchall()]

        cursor.execute("SELECT valor FROM renda_mensal ORDER BY id DESC LIMIT 1")
        renda_row = cursor.fetchone()
        renda = renda_row["valor"] if renda_row else 0.0

        conn.close()
        return historico, renda
    except sqlite3.Error as e:
        print(f"Erro no banco: {e}")
        return [], 0.0

@app.route("/dados", methods=["GET"])
def obter_dados():
    historico, renda = carregar_dados()
    return jsonify({"historico": historico, "renda": renda})

@app.route("/dados/renda", methods=["POST"])
def atualizar_renda():
    dados = request.get_json()
    renda = dados.get("renda", 0.0)
    try:
        conn = sqlite3.connect("financas.db")
        cursor = conn.cursor()
        cursor.execute("DELETE FROM renda_mensal")
        cursor.execute("INSERT INTO renda_mensal (valor) VALUES (?)", (renda,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Renda atualizada com sucesso!"})
    except sqlite3.Error as e:
        return jsonify({"error": f"Erro no banco: {e}"}), 500


@app.route("/dados/gasto", methods=["POST"])
def adicionar_gasto():
    dados = request.get_json()
    nome = dados.get("nome", "").strip()
    preco = dados.get("preco", 0.0)
    categoria = dados.get("categoria", "variavel")
    
    data_hora = datetime.now().strftime("%d/%m/%Y %H:%M")
    novo_id = str(uuid.uuid4())[:8]
    try:
        conn = sqlite3.connect("financas.db")
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO gastos (id, nome, preco, categoria, data_hora) 
            VALUES (?, ?, ?, ?, ?)
        """, (novo_id, nome, preco, categoria, data_hora))
        conn.commit()
        conn.close()
        
        return jsonify({
            "message": "Gasto adicionado com sucesso!", 
                    "gasto": {
                "id": novo_id, "nome": nome, "preco": preco, "categoria": categoria, "data_hora": data_hora
            }
        })
    except sqlite3.Error as e:
        return jsonify({"error": f"Erro no banco: {e}"}), 500

@app.route("/dados/gasto/<string:gasto_id>", methods=["DELETE"])
def deletar_gasto(gasto_id):
    try:
        conn = sqlite3.connect("financas.db")
        cursor = conn.cursor()
        cursor.execute("DELETE FROM gastos WHERE id = ?", (gasto_id,))
       
        linhas_afetadas = cursor.rowcount
        
        conn.commit()
        conn.close()
        
        if linhas_afetadas == 0:
            return jsonify({"error": "Gasto não encontrado!"}), 404
            
        return jsonify({"message": "Gasto removido com sucesso!"})
    except sqlite3.Error as e:
        return jsonify({"error": f"Erro no banco: {e}"}), 500    


@app.route("/dados/gasto/<string:gasto_id>", methods=["PUT"])
def editar_gasto(gasto_id):
    dados = request.get_json()
    nome = dados.get("nome", "").strip()
    preco = dados.get("preco", 0.0)
    categoria = dados.get("categoria", "variavel")
    
    try:
        conn = sqlite3.connect("financas.db")
        cursor = conn.cursor()
        
        # Atualizamos o registro no banco
        cursor.execute("""
            UPDATE gastos 
            SET nome = ?, preco = ?, categoria = ? 
            WHERE id = ?
        """, (nome, preco, categoria, gasto_id))
        
        linhas_afetadas = cursor.rowcount
        
        conn.commit()
        conn.close()
        
        if linhas_afetadas == 0:
            return jsonify({"error": "Gasto não encontrado!"}), 404
            
        return jsonify({"message": "Gasto atualizado com sucesso!"})
    except sqlite3.Error as e:
        return jsonify({"error": f"Erro no banco: {e}"}), 500
if __name__ == "__main__":
    inicializar_banco()
    app.run(debug=False, host="127.0.0.1", port=5000)
