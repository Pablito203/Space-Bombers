class EntidadeGenerica {

    constructor(posicaoX, posicaoY, spriteWidth, spriteHeight, spriteX, spriteY, sequenciaFramesX, sequenciaFramesY) {
        this.posicaoX = posicaoX;
        this.posicaoY = posicaoY;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.spriteX = spriteX;
        this.spriteY = spriteY;
        this.sequenciaFramesX = sequenciaFramesX;
        this.sequenciaFramesY = sequenciaFramesY;
        this.ultimaTrocaDeFrame = Date.now() / 2;
    }
}

module.exports = EntidadeGenerica;