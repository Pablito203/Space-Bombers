const EntidadeGenerica = require('./entidade-generica');

class Explosao extends EntidadeGenerica{
    static explosoesAdicionadas = 0;

    constructor(posicaoX, posicaoY, linha, coluna) {
        super(posicaoX, 
            posicaoY, 
            192, 
            192, 
            0, 
            0, 
            [0, 192, 384, 576, 768], 
            [0])

        Explosao.explosoesAdicionadas++;
        this.id = Explosao.explosoesAdicionadas;

        this.inicioTempo = Date.now();
        this.linha = linha;
        this.coluna = coluna;
        this._spriteX = 0;
    }

    setSpriteX(valor) {
        const now = Date.now();
        if (now - this.ultimaTrocaDeFrame > 100) {
            this.ultimaTrocaDeFrame = now;
            if (this.spriteX < 4) {
                this.spriteX = valor;
            } else {
                this.spriteX = 0;
                this.spriteY = 1;
            }
        };
    }

    trocaAnimacao() {
        if (this.spriteX < 4) {
            this.setSpriteX(this.spriteX + 1);
        } else {
            this.setSpriteX(0);
        }
    }
    
}

module.exports = Explosao;