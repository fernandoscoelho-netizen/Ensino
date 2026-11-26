#!/usr/bin/env python3
"""Gera projetos.json com as pastas do repositório e os ficheiros de cada uma.

Usado pela GitHub Action «Atualizar índice de projetos», mas também pode ser
corrido à mão na raiz do repositório:  python .github/gerar_projetos.py

A página inicial (e o índice do repositório Ensino) lê este ficheiro do próprio
site, sem gastar consultas à API do GitHub (limite de 60 por hora em cada rede).
"""
import json, os, re
from datetime import datetime, timezone

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IGNORAR = {"info.txt", "readme.md", "license", ".gitkeep", "desktop.ini", "thumbs.db"}
PASTAS_IGNORADAS = {".github", ".git", "assets", "node_modules"}
# páginas que não são o projeto principal de uma pasta
SECUNDARIAS = re.compile(r"^(le-?me|leia-?me|readme|notas|base-de|guia|creditos|runner)", re.I)

def ler_info(caminho):
    try:
        with open(caminho, encoding="utf-8-sig") as f:
            linhas = [l.strip() for l in f.read().splitlines()]
    except (OSError, UnicodeDecodeError):
        return {}
    while linhas and not linhas[0]:
        linhas.pop(0)
    # linha opcional «Abrir: caminho/da/pagina.html» escolhe a página que o cartão abre
    abrir = None
    for l in list(linhas):
        m = re.match(r"^(abrir|abre|principal)\s*:\s*(.+)$", l, re.I)
        if m:
            abrir = m.group(2).strip().strip("/")
            linhas.remove(l)
    if not linhas:
        return {"abrir": abrir} if abrir else {}
    info = {"titulo": linhas[0]}
    if abrir:
        info["abrir"] = abrir
    resto = " ".join(l for l in linhas[1:] if l).strip()
    if resto:
        info["descricao"] = resto
    return info

def principal(pasta, paginas):
    """Página que abre o projeto: index.html da pasta, senão a 1.ª página da pasta,
    senão a 1.ª página das subpastas."""
    diretas = [p for p in paginas if "/" not in p[len(pasta) + 1:]]
    for grupo in (diretas, paginas):
        for p in grupo:
            if p.lower().endswith(("/index.html", "/index.htm")):
                return p
        boas = [p for p in grupo if not SECUNDARIAS.match(p.rsplit("/", 1)[-1])]
        if boas:
            return boas[0]
    return paginas[0] if paginas else None

pastas = []
for pasta in sorted(os.listdir(RAIZ)):
    caminho = os.path.join(RAIZ, pasta)
    if not os.path.isdir(caminho) or pasta.startswith(".") or pasta in PASTAS_IGNORADAS:
        continue
    ficheiros, paginas = [], []
    for atual, subpastas, nomes in os.walk(caminho):
        subpastas[:] = sorted(d for d in subpastas if not d.startswith(".") and d not in PASTAS_IGNORADAS)
        rel = os.path.relpath(atual, caminho)
        for nome in sorted(nomes):
            if nome.startswith(".") or nome.lower() in IGNORAR:
                continue
            nome_rel = nome if rel == "." else f"{rel}/{nome}".replace(os.sep, "/")
            if nome.lower().endswith((".html", ".htm")):
                paginas.append(f"{pasta}/{nome_rel}")
            # ficheiros da própria pasta; nas subpastas só os index.html
            if rel != "." and nome.lower() != "index.html":
                continue
            ficheiros.append({
                "nome": nome_rel,
                "caminho": f"{pasta}/{nome_rel}",
                "tamanho": os.path.getsize(os.path.join(atual, nome)),
            })
    info = ler_info(os.path.join(caminho, "info.txt"))
    abrir = info.pop("abrir", None)
    escolhida = f"{pasta}/{abrir}" if abrir and os.path.isfile(os.path.join(RAIZ, pasta, abrir)) else None
    if escolhida:
        ficheiros = [f for f in ficheiros if f["caminho"] != escolhida]
        ficheiros.insert(0, {"nome": abrir, "caminho": escolhida,
                             "tamanho": os.path.getsize(os.path.join(RAIZ, escolhida)), "principal": True})
    entrada = {"pasta": pasta, **info, "ficheiros": ficheiros}
    if paginas:
        entrada["principal"] = escolhida or principal(pasta, paginas)
        entrada["paginas"] = paginas
    pastas.append(entrada)

dados = {"gerado": datetime.now(timezone.utc).isoformat(timespec="seconds"), "pastas": pastas}
destino = os.path.join(RAIZ, "projetos.json")
# só reescreve se a lista mudou (evita commits vazios)
try:
    with open(destino, encoding="utf-8") as f:
        antigo = json.load(f)
    if antigo.get("pastas") == pastas:
        print("projetos.json já está atualizado.")
        raise SystemExit(0)
except (OSError, ValueError):
    pass
with open(destino, "w", encoding="utf-8") as f:
    json.dump(dados, f, ensure_ascii=False, indent=2)
    f.write("\n")
print(f"projetos.json: {len(pastas)} pastas, {sum(len(p['ficheiros']) for p in pastas)} ficheiros.")
