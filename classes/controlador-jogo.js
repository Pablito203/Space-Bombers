const Bomba = require('./bomba');
const Explosao = require('./explosao');
const Jogador = require('./jogador')

class ControladorJogo {
    constructor() {
        this.state = {
            jogadores: {},
            bombas: {},
            explosoes: {}
        };
    }

    addJogador(nome) {
        let posicaoInicial = {
            posicaoX: 0,
            posicaoY: 0
        };

        switch (Jogador.jogadoresAdicionados) {
            case 0:
                posicaoInicial.posicaoX = 20;
                posicaoInicial.posicaoY = 15;
                break;
            case 1:
                posicaoInicial.posicaoX = 510;
                posicaoInicial.posicaoY = 15;
                break;
            case 2:
                posicaoInicial.posicaoX = 20;
                posicaoInicial.posicaoY = 420;
                break;
            case 3:
                posicaoInicial.posicaoX = 510;
                posicaoInicial.posicaoY = 420;
                break;
            default:
                posicaoInicial.posicaoX = 265;
                posicaoInicial.posicaoY = 210;
                break;
        }

        const jogador = new Jogador(posicaoInicial.posicaoX, posicaoInicial.posicaoY, nome);

        const jogadorID = jogador.id;
        
        this.state.jogadores[jogadorID] = jogador;

        return jogadorID;
    }

    removeJogadores(jogadoresID) {
        jogadoresID.forEach(jogadorID => {
            delete this.state.jogadores[jogadorID];
        });
    }

    realizarAcoesJogador(comando) {
        const teclaPressionada = comando.teclaPressionada;
        const jogadorID = comando.jogadorID;
        const jogador = this.state.jogadores[jogadorID];

        if (teclaPressionada == 'a') {
            this.addBomba(jogador);
        }

        if (this.getColisaoBomba(comando)) { return; } 

        if (jogador) {
            jogador.moveJogador(teclaPressionada);
        }
    }

    setDirecaoAnimacaoJogador(comando) {
        const teclaPressionada = comando.teclaPressionada;
        const jogadorID = comando.jogadorID;
        const jogador = this.state.jogadores[jogadorID];

        if (jogador) {
            jogador.setDirecaoAnimacao(teclaPressionada);
        }
    }

    addBomba(jogador) {
        if (jogador.bombasColocadas == 3) {
            return;
        }

        const linhaJogador = jogador.getLinha();
        const colunaJogador = jogador.getColuna();
        
        const bombaPosicaoX = ((colunaJogador - 1) * 40) + 25;
        const bombaPosicaoY = ((linhaJogador - 1) * 40) + 20;

        const jogadorID = jogador.id;

        const bomba = new Bomba(bombaPosicaoX, bombaPosicaoY, jogadorID, linhaJogador, colunaJogador);

        const bombaID = Bomba.bombasAdicionadas;
        
        jogador.bombasColocadas++
        this.state.bombas[bombaID] = bomba;
    }

    removeBombas(bombasID) {
        bombasID.forEach(bombaID => {
            const bomba = this.state.bombas[bombaID];
            if (!bomba) { return; }
            if (bomba == undefined) {
                var a = 34;
            }
            delete this.state.bombas[bombaID];

            const jogadorID = bomba.jogadorID;
            const jogador = this.state.jogadores[jogadorID];
            if (jogador) {
                jogador.bombasColocadas -= 1;
            }
            this.addExplosao(bomba);
        });
    }

    addExplosao(bomba) {
        const linhaBomba = bomba.linha;
        const colunaBomba = bomba.coluna;
        let linhasAddExplosao = [];
        let colunasAddExplosao = [];

        if (linhaBomba % 2 != 0) {
            colunasAddExplosao.push(colunaBomba - 2);
            colunasAddExplosao.push(colunaBomba - 1);
            colunasAddExplosao.push(colunaBomba);
            colunasAddExplosao.push(colunaBomba + 1);
            colunasAddExplosao.push(colunaBomba + 2);
        }
        if (colunaBomba % 2 != 0) {
            linhasAddExplosao.push(linhaBomba - 2);
            linhasAddExplosao.push(linhaBomba - 1);
            if (linhaBomba % 2 == 0) { 
                linhasAddExplosao.push(linhaBomba);
            }
            linhasAddExplosao.push(linhaBomba + 1);
            linhasAddExplosao.push(linhaBomba + 2);
        }

        for (let linha of linhasAddExplosao) {
            if (linha <= 0 || linha > 11) {
                continue;
            }
            const explosaoPosicaoX = ((colunaBomba - 1) * 40) + 35;
            const explosaoPosicaoY = ((linha - 1) * 40) + 35;
    
            const explosao = new Explosao(explosaoPosicaoX, explosaoPosicaoY, linha, colunaBomba);
            const explosaoID = explosao.id;
    
            this.state.explosoes[explosaoID] = explosao;
        }
        for (let coluna of colunasAddExplosao) {
            if (coluna <= 0 || coluna > 13) {
                continue;
            }
            const explosaoPosicaoX = ((coluna - 1) * 40) + 35;
            const explosaoPosicaoY = ((linhaBomba - 1) * 40) + 35;
    
            const explosao = new Explosao(explosaoPosicaoX, explosaoPosicaoY, linhaBomba, coluna);
            const explosaoID = explosao.id;
    
            this.state.explosoes[explosaoID] = explosao;
        }
    }

    removeExplosoes(explosoesID) {
        explosoesID.forEach(explosaoID => {
            delete this.state.explosoes[explosaoID];
        });
    }

    getColisaoBomba(comando) {
        const movimentosAceitos = {
            'ArrowRight': (jogador) => {
                for (const bombaID in this.state.bombas) {
                    const linhaJogador = jogador.getLinha();
                    const bomba = this.state.bombas[bombaID];
                    if (jogador.posicaoX == (bomba.posicaoX - 35) && linhaJogador == bomba.linha) {    
                        jogador.spriteX = 0;
                        return true;
                    }
                }
                return false;
            },
            'ArrowLeft': (jogador) => {
                for (const bombaID in this.state.bombas) {
                    const linhaJogador = jogador.getLinha();
                    const bomba = this.state.bombas[bombaID];
                    if (jogador.posicaoX == (bomba.posicaoX + 35) && linhaJogador == bomba.linha) {    
                        jogador.spriteX = 0;
                        return true;
                    }
                }
                return false;
            },
            'ArrowUp': (jogador) => {
                for (const bombaID in this.state.bombas) {
                    const colunaJogador = jogador.getColuna();
                    const bomba = this.state.bombas[bombaID];
                    if (jogador.posicaoY == (bomba.posicaoY + 20) && colunaJogador == bomba.coluna) {    
                        jogador.spriteX = 0;
                        return true;
                    }
                }
                return false;
            },
            'ArrowDown': (jogador) => {
                for (const bombaID in this.state.bombas) {
                    const colunaJogador = jogador.getColuna();
                    const bomba = this.state.bombas[bombaID];
                    if (jogador.posicaoY == (bomba.posicaoY - 40) && colunaJogador == bomba.coluna) {    
                        jogador.spriteX = 0;
                        return true;
                    }
                }
                return false;
            }
        };

        const teclaPressionada = comando.teclaPressionada;
        const jogadorID = comando.jogadorID;
        const jogador = this.state.jogadores[jogadorID];
        const funcaoMovimento = movimentosAceitos[teclaPressionada];

        if (jogador && funcaoMovimento) {
            return funcaoMovimento(jogador);
        }

    }

    trocaAnimacaoBombas(bombasID) {
        bombasID.forEach(bombaID => {
            const bomba = this.state.bombas[bombaID];
            if (!bomba) { return; }
            bomba.trocaAnimacao();
        });
    }

    trocaAnimacaoExplosoes(explosoesID) {
        explosoesID.forEach(explosaoID => {
            const explosao = this.state.explosoes[explosaoID];
            explosao.trocaAnimacao();
        });
    }

    setAtualizacoesPorBomba() {
        
    }

    setAtualizacoesPorExplosao() {
        let bombasRemover = [];
        let jogadoresRemover = [];
        for (const explosaoID in this.state.explosoes) {
            const explosao = state.explosoes[explosaoID];
            const now = Date.now();
            const tempoVidaExplosao = now - explosao.inicioTempo;
            if (tempoVidaExplosao > 700) {
                delete this.state.explosoes[explosaoID];
                continue;
            }

            Object.keys(this.state.bombas).forEach(bombaID => {
                const bomba = state.bombas[bombaID]
                if (bomba.linha == explosao.linha && bomba.coluna == explosao.coluna) {
                    delete this.state.bombas[bombaID];
                    bombasRemover.push[bombaID];
                }
            });
            
            Object.keys(this.state.jogadores).forEach(jogadorID => {
                const jogador = state.jogadores[jogadorID]
                if (jogador.linha == explosao.linha && jogador.coluna == explosao.coluna) {
                    jogadoresRemover.push[jogadorID];
                }
            });
        }

        if (bombasRemover.length > 0) this.removeBombas(bombasRemover);
        if (jogadoresRemover.length > 0) this.removeJogadores(jogadoresRemover);
    }

    verificaJogadorDeletar() {

    }

}

module.exports = ControladorJogo;