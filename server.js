const express = require('express');
const session = require('express-session');
const http = require('http');
const ControladorJogo = require('./classes/controlador-jogo');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);

const salas = {}

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

app.get('/jogoState', (req, res) => {
    if (!req.session.sala) {
        res.redirect('/');
    }

    const salaID = req.session.sala;
    const controladorJogo = salas[salaID];

    res.json(controladorJogo.state);
});

app.post('/jogador', (req, res) => {
    if (!req.session.sala) {
        res.redirect('/');
    }
    const salaID = req.session.sala;
    const controladorJogo = salas[salaID];

    const jogadorID = req.session.jogadorID ? req.session.jogadorID : controladorJogo.addJogador(req.session.nome);

    req.session.jogadorID = jogadorID;
    res.json(jogadorID);
});

app.post('/comandoJogador', (req, res) => {
    if (!req.session.sala) {
        res.redirect('/');
    }
    if (!req.body) {
        res.status(400).end();
        return;
    }

    const salaID = req.session.sala;
    const controladorJogo = salas[salaID];

    const comando = {
        ...req.body,
        jogadorID: req.session.jogadorID
    };

    controladorJogo.realizarAcoesJogador(comando);
    controladorJogo.setDirecaoAnimacaoJogador(comando)
    
    res.json(200).end();
});

app.post('/trocaAnimacaoBomba', (req, res) => {
    if (!req.session.sala) {
        res.redirect('/');
    }
    if (!req.body) {
        res.status(400).end();
        return;
    }

    const salaID = req.session.sala;
    const controladorJogo = salas[salaID];

    const bombasID = req.body;
    controladorJogo.trocaAnimacaoBombas(bombasID);
    res.status(200).end();
});

app.post('/trocaAnimacaoExplosao', (req, res) => {
    if (!req.session.sala) {
        res.redirect('/');
    }
    if (!req.body) {
        res.status(400).end();
        return;
    }

    const salaID = req.session.sala;
    const controladorJogo = salas[salaID];

    const explosoesID = req.body;
    controladorJogo.trocaAnimacaoExplosoes(explosoesID);

    res.status(200).end();
});

app.delete('/bomba', (req, res) => {
    if (!req.session.sala) {
        res.redirect('/');
    }
    if (!req.body) {
        res.status(400).end();
        return;
    }

    const salaID = req.session.sala;
    const controladorJogo = salas[salaID];

    const bombasID = req.body;
    controladorJogo.removeBombas(bombasID);
    res.status(200).end();
})

app.delete('/explosao', (req, res) => {
    if (!req.session.sala) {
        res.redirect('/');
    }
    if (!req.body) {
        res.status(400).end();
        return;
    }

    const salaID = req.session.sala;
    const controladorJogo = salas[salaID];

    const explosoesID = req.body;
    controladorJogo.removeExplosoes(explosoesID);
    res.status(200).end();
})

app.delete('/jogador', (req, res) => {
    if (!req.session.sala) {
        res.redirect('/');
    }
    if (!req.body) {
        res.status(400).end();
        return;
    }

    const salaID = req.session.sala;
    const controladorJogo = salas[salaID];

    const jogadoresID = req.body;
    controladorJogo.removeJogadores(jogadoresID);
    res.status(200).end();
})

app.post('/entrar', (req, res) => {
    if (!req.body || !req.body.nomeJogador || !req.body.codigoSala) {
         res.status(400).end();
         return;
    }

    const codigoSala = req.body.codigoSala;

    if (!salas[codigoSala]) {
        res.json('Esta sala não existe, crie uma sala ou insira uma válida');
        return;
    }

    const nomeJogador = req.body.nomeJogador;

    req.session.nome = nomeJogador;
    req.session.sala = codigoSala;

    res.redirect('/jogo');
})

app.post('/criarSala', (req, res) => {
    if (!req.body || !req.body.nomeJogador || !req.body.codigoSala) {
        res.status(400).end();
        return;
    }
    
    const codigoSala = req.body.codigoSala;

    if (salas[codigoSala]) {
        res.json('Esta sala já existe, use outro código para a sala');
        return;
    }

    const nomeJogador = req.body.nomeJogador;

    req.session.nome = nomeJogador;
    req.session.sala = codigoSala;

    const controladorJogo = new ControladorJogo();

    salas[codigoSala] = controladorJogo;

    res.redirect('/jogo');
})

app.get('/jogo', (req, res) => {
    if (!req.session.sala) {
        res.redirect('/');
    }
    res.sendFile(__dirname+"/public/jogo.html");
})

app.get('/', (req, res) => {
    res.sendFile(__dirname+"/public/index.html");
})

server.listen(3000, () => {
    console.log('servidor rodando na porta 3000')
});