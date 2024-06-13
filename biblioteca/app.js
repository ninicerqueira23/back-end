const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'ni',
    password: 'SENAI123',
    database: 'biblioteca'
});

db.connect((error) => {
    if (error) {
        console.log('Erro ao conectar com o banco de dados', error);
    } else {
        console.log('Conectado ao MYSQL');
    }
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
});

app.post("/login", (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;

    db.query('SELECT senha FROM usuario WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.log('Erro na consulta ao banco de dados', error);
            res.status(500).send('Erro no servidor');
            return;
        }

        if (results.length > 0) {
            const passwordBD = results[0].senha;
            if (passwordBD === senha) {
                console.log('Seja bem-vindo(a)!');
                res.send('Login realizado com sucesso');
            } else {
                console.log('Senha incorreta!');
                res.send('Senha incorreta');
            }
        } else {
            console.log('Usuário não cadastrado');
            res.send('Usuário não cadastrado');
        }
    });
});

app.post("/cadastro", (req, res) => {
    const nome = req.body.nome;
    const email = req.body.email;
    const emailConfirm = req.body.emailConfirm;
    const senha = req.body.senha;
    const confirm = req.body.senhaConfirm;

    if (email !== emailConfirm) {
        console.log("Emails não coincidem");
        res.send("Emails não coincidem");
        return;
    }

    if (senha !== confirm) {
        console.log("Senhas não coincidem");
        res.send("Senhas não coincidem");
        return;
    }

    db.query('SELECT email FROM usuario WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.log('Erro na consulta ao banco de dados', error);
            res.status(500).send('Erro no servidor');
            return;
        }

        if (results.length > 0) {
            console.log("Email já está em uso");
            res.send("Email já está em uso");
        } else {
            db.query('INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha], (error) => {
                if (error) {
                    console.log("Erro ao realizar o cadastro", error);
                    res.status(500).send('Erro no servidor');
                } else {
                    console.log("Cadastro realizado com sucesso!");
                    res.send("Cadastro realizado com sucesso!");
                }
            });
        }
    });
});

app.get("/cadastro", (req, res) => {
    res.sendFile(__dirname + '/views/cadastro.html');
});

app.listen(port, () => {
    console.log(`Servidor rodando no endereço: http://localhost:${port}`);
});
