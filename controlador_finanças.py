import json
import subprocess
from datetime import datetime

try:
    with open("dados.json", "r") as arquivo:
        dados_salvos = json.load(arquivo)
        historico = dados_salvos["lista_de_gastos"]
        renda = dados_salvos["valor_da_renda"]
        print(f"Bem-vindo de volta! Sua renda salva é R$ {renda:.2f}")
except:
    historico = []
    renda = float(input("💵 Qual a sua renda esse mes? ").replace(",", "."))
    dados_salvos = {"valor_da_renda": renda, "lista_de_gastos": historico}

while True: 
    subprocess.run("cls", shell=True)
    print(datetime.now().strftime("%m/%Y"))
    print(f"Sua renda atual é: R$ {renda:.2f}")
    print("-" * 30) 
    categoria = input("fixo ou variavel? ").lower()
    if categoria.lower() == "sair": break
    nome = input("informe o nome (ou '.' para recomeçar): ")
    if nome == ".": continue
    valor_str = input("digite o valor (ou '.' para recomeçar): ")
    if valor_str == ".": continue
    valor = float(valor_str.replace(",", ".")) 
    
    ficha = {"categoria": categoria, "nome": nome, "preco": valor}
    
    historico.append(ficha)
    dados_salvos["valor_da_renda"] = renda
    dados_salvos["lista_de_gastos"] = historico
       
    with open("dados.json", "w") as arquivo:
        json.dump(dados_salvos, arquivo, indent=4) 
    print("\n--- SEU HISTÓRICO ATUALIZADO ---")
    for indice, item in enumerate(historico, 1):
        print(f"{indice} - 📌 {item['categoria'].capitalize()} | 📝 {item['nome']} | 💰 R$ {item['preco']:.2f}")
    input("Aperte ENTER para continuar...")
    print("💾 Informação salva com sucesso!") 
    
total_fixo = 0
total_variavel = 0
for ficha in historico:
    if ficha["categoria"] == "fixo" :
        total_fixo += ficha["preco"]
    else:
        total_variavel += ficha["preco"]
print(f"Total fixo: R$ {total_fixo:.2f}")
print(f"Total variavel: R$ {total_variavel:.2f}")
saldo = renda - (total_fixo + total_variavel)
if saldo >= 0:
    print(f"Você ainda pode gastar R$ {saldo:.2f} sem ficar no vermelho 🤑")
else:
    print(f"Atenção:🚨 você está no vermelho em R$ {abs(saldo):.2f} por favor, pare de gastar!")