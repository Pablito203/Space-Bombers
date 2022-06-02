const EntidadeGenerica = require('./entidade-generica');
const Configs = require('./configs');

class Jogador extends EntidadeGenerica{
    static jogadoresAdicionados = 0;

    static pixelsYLinha = {
        1: [0, 5, 10, 15, 20, 25],
        2: [30, 35, 40, 45, 50, 55, 60, 65],
        3: [70, 75, 80, 85, 90, 95, 100, 105],
        4: [110, 115, 120, 125, 130, 135, 140, 145],
        5: [150, 155, 160, 165, 170, 175, 180, 185],
        6: [190, 195, 200, 205, 210, 215, 220, 225],
        7: [230, 235, 240, 245, 250, 255, 260, 265],
        8: [270, 275, 280, 285, 290, 295, 300, 305],
        9: [310, 315, 320, 325, 330, 335, 340, 345],
        10: [350, 355, 360, 365, 370, 375, 380, 385],
        11: [390, 395, 400, 405, 410, 415, 420],
    }

    static pixelsXColunas = {
        1: [20, 25, 30, 35, 40, 45],
        2: [50, 55, 60, 65, 70, 80, 85],
        3: [90, 95, 100, 105, 110, 115, 120, 125],
        4: [130, 135, 140, 145, 150, 155, 160, 165],
        5: [170, 175, 180, 185, 190, 195, 200, 205],
        6: [210, 215, 220, 225, 230, 235, 240, 245],
        7: [250, 255, 260, 265, 270, 275, 280, 285],
        8: [290, 295, 300, 305, 310, 315, 320, 325],
        9: [330, 335, 340, 345, 350, 355, 360, 365],
        10: [370, 375, 380, 385, 390, 395, 400, 405],
        11: [410, 415, 420, 425, 430, 435, 440, 445],
        12: [450, 455, 460, 465, 470, 475, 480, 485],
        13: [490, 495, 500, 505, 510],
    }
    
    constructor(posicaoX, posicaoY, nome) {
        super(posicaoX,
            posicaoY,
            128,
            128,
            0,
            2,
            [0, 128, 256, 128, 0, 384, 512, 384],
            [0, 128, 256, 384])
        
        Jogador.jogadoresAdicionados++;
        this.id = Jogador.jogadoresAdicionados;
        this.nome = nome;
        
        this.velocidade = 5;
        this.bombasColocadas = 0;
        this.linha = this.getLinha();
        this.coluna = this.getColuna();
    }

    setSpriteX(valor) {
        const now = Date.now();
        if (valor === 0 || now - this.ultimaTrocaDeFrame > 40) {
            this.ultimaTrocaDeFrame = now;
            this.spriteX = valor;
        };
    } 

    getLinha() {
        for (const linhaID in Jogador.pixelsYLinha) {
            const linha = Jogador.pixelsYLinha[linhaID];
            if (linha.includes(this.posicaoY)) {
                return parseInt(linhaID);
            }
        }
    }

    getColuna() {
        for (const colunaID in Jogador.pixelsXColunas) {
            const coluna = Jogador.pixelsXColunas[colunaID];
            if (coluna.includes(this.posicaoX)) {
                return parseInt(colunaID);
            }
        }
    }

    moveJogador(teclaPressionada) {
        switch (teclaPressionada) {
            case 'ArrowRight':
                if (this.getColisaoParedeDireita()) { return; }
                
                this.posicaoX += this.velocidade;
                if (this.spriteX < 7) {
                    this.setSpriteX(this.spriteX + 1);
                } else {
                    this.setSpriteX(0);
                }
                break;
            case 'ArrowLeft':
                if (this.getColisaoParedeEsquerda()) { return; }

                this.posicaoX -= this.velocidade;
                if (this.spriteX < 7) {
                    this.setSpriteX(this.spriteX + 1);
                } else {
                    this.setSpriteX(0);
                }
                break;
            case 'ArrowDown':
                if (this.getColisaoParedeBaixo()) { return; }

                this.posicaoY += this.velocidade;
                if (this.spriteX < 7) {
                    this.setSpriteX(this.spriteX + 1);
                } else {
                    this.setSpriteX(0);
                }
                break;
            case 'ArrowUp':
                if (this.getColisaoParedeCima()) { return; }

                this.posicaoY -= this.velocidade;
                if (this.spriteX < 7) {
                    this.setSpriteX(this.spriteX + 1);
                } else {
                    this.setSpriteX(0);
                }
            break;
        }
        this.linha = this.getLinha();
        this.coluna = this.getColuna();
    }

    setDirecaoAnimacao(teclaPressionada) {
        switch (teclaPressionada) {
            case 'ArrowRight':
                this.spriteY = 0;
                break;
            case 'ArrowLeft':
                this.spriteY = 1;
                break;
            case 'ArrowDown':
                this.spriteY = 2;
                break;
            case 'ArrowUp':
                this.spriteY = 3;
                break;
        }
    }

    getColisaoParedeDireita() {
        const posicaoXLimite = [30, 110, 190, 270, 350, 430];

        if ((this.posicaoX + this.velocidade) >= (Configs.tela.width - 85)) {    
            this.setSpriteX(0);
            return true;
        }  else if (this.posicaoY >= 25 && this.posicaoY <= 75) {
            if (posicaoXLimite.includes(this.posicaoX)) {
                if (this.posicaoY == 25) {
                    this.posicaoY -= this.velocidade;
                } else if (this.posicaoY == 75 ) {
                    this.posicaoY += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        } else if (this.posicaoY >= 105 && this.posicaoY <= 155) {
            if (posicaoXLimite.includes(this.posicaoX)) {
                if (this.posicaoY == 105) {
                    this.posicaoY -= this.velocidade;
                } else if (this.posicaoY == 155) {
                    this.posicaoY += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        } else if (this.posicaoY >= 185 && this.posicaoY <= 235) {
            if (posicaoXLimite.includes(this.posicaoX)) {
                if (this.posicaoY == 185) {
                    this.posicaoY -= this.velocidade;
                } else if (this.posicaoY == 235) {
                    this.posicaoY += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        } else if (this.posicaoY >= 265 && this.posicaoY <= 315) {
            if (posicaoXLimite.includes(this.posicaoX)) {
                if (this.posicaoY == 265) {
                    this.posicaoY -= this.velocidade;
                } else if (this.posicaoY == 315) {
                    this.posicaoY += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        } else if (this.posicaoY >= 345 && this.posicaoY <= 395) {
            if (posicaoXLimite.includes(this.posicaoX)) {
                if (this.posicaoY == 345) {
                    this.posicaoY -= this.velocidade;
                } else if (this.posicaoY == 395) {
                    this.posicaoY += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        } else if (this.posicaoY >= 425 && this.posicaoY <= 475) {
            if (posicaoXLimite.includes(this.posicaoX)) {
                if (this.posicaoY == 425) {
                    this.posicaoY -= this.velocidade;
                } else if (this.posicaoY == 475) {
                    this.posicaoY += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        }

        return false;
    }

    getColisaoParedeEsquerda() {
        const posicaoXLimite = [100, 180, 260, 340, 420, 500];

        if ((this.posicaoX - this.velocidade) <= 15) {    
            this.setSpriteX(0);
            return true;
        } else if (this.posicaoY >= 25 && this.posicaoY <= 75) {
            if (posicaoXLimite.includes(this.posicaoX)) {
                if (this.posicaoY == 25) {
                    this.posicaoY -= this.velocidade;
                } else if (this.posicaoY == 75 ) {
                    this.posicaoY += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        } else if (this.posicaoY >= 105 && this.posicaoY <= 155) {
            if (posicaoXLimite.includes(this.posicaoX)) {
                if (this.posicaoY == 105) {
                    this.posicaoY -= this.velocidade;
                } else if (this.posicaoY == 155) {
                    this.posicaoY += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        } else if (this.posicaoY >= 185 && this.posicaoY <= 235) {
            if (posicaoXLimite.includes(this.posicaoX)) {
                if (this.posicaoY == 185) {
                    this.posicaoY -= this.velocidade;
                } else if (this.posicaoY == 235) {
                    this.posicaoY += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        } else if (this.posicaoY >= 265 && this.posicaoY <= 315) {
            if (posicaoXLimite.includes(this.posicaoX)) {
                if (this.posicaoY == 265) {
                    this.posicaoY -= this.velocidade;
                } else if (this.posicaoY == 315) {
                    this.posicaoY += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        } else if (this.posicaoY >= 345 && this.posicaoY <= 395) {
            if (posicaoXLimite.includes(this.posicaoX)) {
                if (this.posicaoY == 345) {
                    this.posicaoY -= this.velocidade;
                } else if (this.posicaoY == 395) {
                    this.posicaoY += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        } else if (this.posicaoY >= 425 && this.posicaoY <= 475) {
            if (posicaoXLimite.includes(this.posicaoX)) {
                if (this.posicaoY == 425) {
                    this.posicaoY -= this.velocidade;
                } else if (this.posicaoY == 475) {
                    this.posicaoY += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        }

        return false;
    }

    getColisaoParedeCima() {
        const posicaoYLimite = [80, 160, 240, 320, 400];

        if ((this.posicaoY - this.velocidade) <= -5) {    
            this.setSpriteX(0);
            return true;
        } else if (this.posicaoX >= 35 && this.posicaoX <= 95) {
            if (posicaoYLimite.includes(this.posicaoY)) {
                if (this.posicaoX == 35) {
                    this.posicaoX -= this.velocidade;
                } else if (this.posicaoX == 95) {
                    this.posicaoX += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        } else if (this.posicaoX >= 115 && this.posicaoX <= 175) {
            if (posicaoYLimite.includes(this.posicaoY)) {
                if (this.posicaoX == 115) {
                    this.posicaoX -= this.velocidade;
                } else if (this.posicaoX == 175) {
                    this.posicaoX += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        } else if (this.posicaoX >= 195 && this.posicaoX <= 255) {
            if (posicaoYLimite.includes(this.posicaoY)) {
                if (this.posicaoX == 195) {
                    this.posicaoX -= this.velocidade;
                } else if (this.posicaoX == 255) {
                    this.posicaoX += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        } else if (this.posicaoX >= 275 && this.posicaoX <= 335) {
            if (posicaoYLimite.includes(this.posicaoY)) {
                if (this.posicaoX == 275) {
                    this.posicaoX -= this.velocidade;
                } else if (this.posicaoX == 335) {
                    this.posicaoX += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        } else if (this.posicaoX >= 355 && this.posicaoX <= 415) {
            if (posicaoYLimite.includes(this.posicaoY)) {
                if (this.posicaoX == 355) {
                    this.posicaoX -= this.velocidade;
                } else if (this.posicaoX == 415) {
                    this.posicaoX += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        } else if (this.posicaoX >= 435 && this.posicaoX <= 495) {
            if (posicaoYLimite.includes(this.posicaoY)) {
                if (this.posicaoX == 435) {
                    this.posicaoX -= this.velocidade;
                } else if (this.posicaoX == 495) {
                    this.posicaoX += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        }

        return false;
    }

    getColisaoParedeBaixo() {
        const posicaoYLimite = [20, 100, 180, 260, 340];

        if ((this.posicaoY + this.velocidade) >= (Configs.tela.height - 95)) {    
            this.setSpriteX(0);
            return true;
        } else if (this.posicaoX >= 35 && this.posicaoX <= 95) {
            if (posicaoYLimite.includes(this.posicaoY)) {
                if (this.posicaoX == 35) {
                    this.posicaoX -= this.velocidade;
                } else if (this.posicaoX == 95) {
                    this.posicaoX += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        } else if (this.posicaoX >= 115 && this.posicaoX <= 175) {
            if (posicaoYLimite.includes(this.posicaoY)) {
                if (this.posicaoX == 115) {
                    this.posicaoX -= this.velocidade;
                } else if (this.posicaoX == 175) {
                    this.posicaoX += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        } else if (this.posicaoX >= 195 && this.posicaoX <= 255) {
            if (posicaoYLimite.includes(this.posicaoY)) {
                if (this.posicaoX == 195) {
                    this.posicaoX -= this.velocidade;
                } else if (this.posicaoX == 255) {
                    this.posicaoX += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        } else if (this.posicaoX >= 275 && this.posicaoX <= 335) {
            if (posicaoYLimite.includes(this.posicaoY)) {
                if (this.posicaoX == 275) {
                    this.posicaoX -= this.velocidade;
                } else if (this.posicaoX == 335) {
                    this.posicaoX += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        } else if (this.posicaoX >= 355 && this.posicaoX <= 415) {
            if (posicaoYLimite.includes(this.posicaoY)) {
                if (this.posicaoX == 355) {
                    this.posicaoX -= this.velocidade;
                } else if (this.posicaoX == 415) {
                    this.posicaoX += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        } else if (this.posicaoX >= 435 && this.posicaoX <= 495) {
            if (posicaoYLimite.includes(this.posicaoY)) {
                if (this.posicaoX == 435) {
                    this.posicaoX -= this.velocidade;
                } else if (this.posicaoX == 495) {
                    this.posicaoX += this.velocidade;
                }
                this.setSpriteX(0);
                return true;
            }
        }

        return false;
    }
    
}

module.exports = Jogador;