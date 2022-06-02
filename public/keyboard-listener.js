function criarKeyboardListener(jogadorID) {

    document.addEventListener('keydown', handleKeydown);
    
    function handleKeydown(event) {
        const teclaPressionada = event.key;
        
        const comando = {
            teclaPressionada
        };

        enviaTeclaPressionada(comando);
    }

    async function enviaTeclaPressionada(comando) {
        await fetch('/comandoJogador', {method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(comando)});
    }
}