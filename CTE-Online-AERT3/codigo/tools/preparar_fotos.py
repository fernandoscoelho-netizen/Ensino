"""Prepara as fotografias da decoração para o jogo.

Endireita a perspetiva do painel central (fotografia do átrio), compensa a luz
desigual e grava uma versão mais leve para a textura do jogo.

Uso: python3 tools/preparar_fotos.py
Requer: pip install pillow numpy
"""
import os
import numpy as np
from PIL import Image

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FOTOS = os.path.join(BASE, 'dados', 'fotos')

# cantos do painel na fotografia original (2576 × 1449 px): sup. esq., sup. dir., inf. dir., inf. esq.
CANTOS = [(490, 200), (1958, 200), (1970, 1335), (465, 1320)]
LARG, ALT = 1584, 1200          # proporção 1,32 medida na fotografia
BRILHO = 1.18                    # o cinzento do painel fica perto de #d2cfc4 sob a luz do jogo


def retificar(src, dst):
    im = Image.open(src).convert('RGB')
    alvo = [(0, 0), (LARG, 0), (LARG, ALT), (0, ALT)]
    A, B = [], []
    for (x, y), (u, v) in zip(alvo, CANTOS):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); B.append(v)
    coef = np.linalg.solve(np.array(A, float), np.array(B, float))
    out = im.transform((LARG, ALT), Image.PERSPECTIVE, tuple(coef), Image.BICUBIC)
    # luz desigual: campo suave a partir do fundo cinzento claro do painel
    a = np.asarray(out).astype(float)
    lum = a.mean(axis=2)
    claro = lum > 150
    n = 8
    ys, xs = np.array_split(np.arange(ALT), n), np.array_split(np.arange(LARG), n)
    g = np.full((n, n), np.nan)
    for i, yy in enumerate(ys):
        for j, xx in enumerate(xs):
            b = lum[np.ix_(yy, xx)][claro[np.ix_(yy, xx)]]
            if b.size > 500:
                g[i, j] = np.median(b)
    med = np.nanmedian(g)
    g = np.where(np.isnan(g), med, g)
    campo = np.array(Image.fromarray(g.astype(np.float32), mode='F').resize((LARG, ALT), Image.BICUBIC))
    corr = np.clip(a * (med / np.maximum(campo, 60))[..., None], 0, 255).astype(np.uint8)
    Image.fromarray(corr).save(dst, quality=88)
    return dst


if __name__ == '__main__':
    ret = retificar(os.path.join(FOTOS, 'foto-painel-central.jpg'), os.path.join(FOTOS, 'painel-central-retificado.jpg'))
    im = Image.open(ret).resize((1024, round(1024 * ALT / LARG)), Image.LANCZOS)
    a = np.clip(np.asarray(im).astype(float) * BRILHO, 0, 255).astype(np.uint8)
    jogo = os.path.join(FOTOS, 'painel-central-jogo.jpg')
    Image.fromarray(a).save(jogo, quality=84)
    print('ok', ret, jogo, os.path.getsize(jogo) // 1024, 'KB')
