const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app= express();
const port = 3000;

const db = mysql.createConnection ({
    host: 'localhost',
    user:   'ni',
    password: 'SENAI123',
    database: 'login'
});

db.connect((error)=>{
    if(error){
        console.log('Erro ao conectar com o banco de dados')
    } else {
        console.log('Conectado ao MYSQL')
    }
});


app.use(bodyParser.urlencoded({ extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/login.html')
})

app.post("/login", (req, res) =>{
    const username = req.body.usuario;
    const password = req.body.senha;
    

    db.query('SELECT password from user where username = ?', [username], (error, results) => {
        if (results.length > 0){
     const passwordBD = results[0].password;
        if(passwordBD === password){
            console.log('Seja bem-vindo(a)!')
        } else {
            console.log('Login e/ou senha incorretos!')
        }
        } else {
            console.log('Usuário não cadastrado')
        }
    })
})


app.listen(port, ()=> {
    console.log(`Servidor rodando no endereço: http://localhost:${port}`)
})

