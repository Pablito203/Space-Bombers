const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const imgJogadorCinza = new Image();
imgJogadorCinza.src = './sprites/jogador/jogador-cinza.png'

const imgJogadorVerde = new Image();
imgJogadorVerde.src = './sprites/jogador/jogador-verde.png'

const imgBomba = new Image();
imgBomba.src = './sprites/bomba/bomba.png'

const imgExplosao = new Image();
imgExplosao.src = './sprites/bomba/explosao.png'

const imgFundo = new Image();
imgFundo.src = './sprites/fundo.jpg'
const imgBloco= new Image();
imgBloco.src = './sprites/bloco.jpg'

let sessaoJogadorID = 0;

async function getStateJogo() {
    const response = await fetch('/jogoState');
    var state = await response.json();
    return state;
}

async function postAtualizaAnimacaoBomba(bombasID) {
    await fetch('/trocaAnimacaoBomba', {method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bombasID)});
}

async function postAtualizaAnimacaoExplosao(explosoesID) {
    await fetch('/trocaAnimacaoExplosao', {method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(explosoesID)});
}

async function deleteBomba(bombasID) {
    await fetch('/bomba', {method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bombasID)});
}

async function deleteExplosao(explosoesID) {
    await fetch('/explosao', {method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(explosoesID)});
}

async function deleteJogador(jogadoresID) {
    await fetch('/jogador', {method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jogadoresID)});
}

function iniciaJogo(jogadorID) {
    if (jogadorID) {
        sessaoJogadorID = jogadorID;
    }
    getStateJogo().then((state) => {
        renderizarTela(state)
        requestAnimationFrame(() => {
            iniciaJogo(sessaoJogadorID);
        });
    })
}


function renderizarTela(state) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "red";

    const bombaIdsTrocaAnimacao = [];
    const bombaIdsRemover = [];
    const explosaoIdsTrocaAnimacao = [];
    const explosaoIdsRemover = [];
    const jogadorIdsRemover = [];

    for (let linha = 0; linha <= 12; linha++) {
        for (let coluna = 0; coluna <= 14; coluna++) {
            if (coluna == 0 || coluna == 14 || linha == 0 || linha == 12) {
                context.drawImage(imgBloco, coluna*40, linha*40, 40, 40);
                continue
            }
            if (coluna == 16) {continue;}
            if ((linha % 2 == 0 && coluna % 2 == 0)) {
                context.drawImage(imgBloco, coluna*40, linha*40, 40, 40);
            } else {
                context.drawImage(imgFundo, coluna*40, linha*40, 40, 40);
            }
        }
    }
    for (const bombaID in state.bombas) {
        const bomba = state.bombas[bombaID];
        const now = Date.now();
        const tempoVidaBomba = now - bomba.inicioTempo;
        if (tempoVidaBomba > 4500) {
            bombaIdsRemover.push(bomba.id);
            continue
        }
        bombaIdsTrocaAnimacao.push(bomba.id);
        desenhaSprite(imgBomba, bomba.sequenciaFramesX[bomba.spriteX], bomba.sequenciaFramesY[bomba.spriteY], bomba.spriteWidth, bomba.spriteHeight, bomba.posicaoX, bomba.posicaoY, 70, 70);
    }
    for (const explosaoID in state.explosoes) {
        const explosao = state.explosoes[explosaoID];
        const now = Date.now();
        const tempoVidaExplosao = now - explosao.inicioTempo;
        if (tempoVidaExplosao > 700) {
            explosaoIdsRemover.push(explosao.id);
            continue
        }
        
        Object.keys(state.bombas).forEach(bombaID => {
            const bomba = state.bombas[bombaID]
            if (bomba.linha == explosao.linha && bomba.coluna == explosao.coluna) {
                bombaIdsRemover.push(bomba.id);
            }
        });
        
        Object.keys(state.jogadores).forEach(jogadorID => {
            const jogador = state.jogadores[jogadorID]
            if (jogador.linha == explosao.linha && jogador.coluna == explosao.coluna) {
                jogadorIdsRemover.push(jogador.id);
            }
        });
        
        explosaoIdsTrocaAnimacao.push(explosao.id);
        desenhaSprite(imgExplosao, explosao.sequenciaFramesX[explosao.spriteX], explosao.sequenciaFramesY[explosao.spriteY], explosao.spriteWidth, explosao.spriteHeight, explosao.posicaoX, explosao.posicaoY, 50, 50);
    }
    for (const jogadorID in state.jogadores) {
        const jogador = state.jogadores[jogadorID];
        const img = imgJogadorCinza;
        desenhaSprite(img, jogador.sequenciaFramesX[jogador.spriteX], jogador.sequenciaFramesY[jogador.spriteY], jogador.spriteWidth, jogador.spriteHeight, jogador.posicaoX, jogador.posicaoY, 70, 70);
        context.font = "13px Arial";
        context.strokeStyle = 'black';
        context.fillStyle = jogadorID == sessaoJogadorID ? 'lightgreen' : 'tomato';
        context.textAlign = 'center';
        context.strokeText(jogador.nome, jogador.posicaoX + 32, jogador.posicaoY);
        context.fillText(jogador.nome, jogador.posicaoX + 32, jogador.posicaoY);
        console.log('x', jogador.posicaoX);
        console.log('y', jogador.posicaoY);
    }

    if (bombaIdsTrocaAnimacao.length > 0) {
        postAtualizaAnimacaoBomba(bombaIdsTrocaAnimacao);
    }
    if (bombaIdsRemover.length > 0) {
        deleteBomba(bombaIdsRemover);
    }
    if (explosaoIdsTrocaAnimacao.length > 0) {
        postAtualizaAnimacaoExplosao(explosaoIdsTrocaAnimacao);
    }
    if (explosaoIdsRemover.length > 0) {
        deleteExplosao(explosaoIdsRemover);
    }
    if (jogadorIdsRemover.length > 0) {
        deleteJogador(jogadorIdsRemover);
    }
}

function desenhaSprite(sprite, spriteX, spriteY, spriteWidth, spriteHeight, canvasX, canvasY, desenhoWidth, desenhoHeight) {
    context.drawImage(sprite, spriteX, spriteY, spriteWidth, spriteHeight, canvasX, canvasY, desenhoWidth, desenhoHeight);
}