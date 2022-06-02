const EntidadeGenerica = require('./entidade-generica');

class Bomba extends EntidadeGenerica{
    static bombasAdicionadas = 0;

    constructor(posicaoX, posicaoY, jogadorID, linha, coluna) {
        super(posicaoX, 
            posicaoY, 
            128, 
            128, 
            0, 
            0, 
            [0, 128], 
            [0])

        Bomba.bombasAdicionadas++;

        this.id = Bomba.bombasAdicionadas;
        this.jogadorID = jogadorID;
        this.inicioTempo = Date.now();
        this.linha = linha;
        this.coluna = coluna;
    }

    setSpriteX(valor) {
        const now = Date.now();
        if (now - this.ultimaTrocaDeFrame > 400) {
            this.ultimaTrocaDeFrame = now;
            this.spriteX = valor;
        };
    } 

    trocaAnimacao() {
        if (this.spriteX == 0) {
            this.setSpriteX(1);
        } else {
            this.setSpriteX(0);
        }
    }
    
}

module.exports = Bomba;