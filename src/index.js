// importando os pacotes para uso no arquivo index.js
const express     = require('express');
const morgan      = require('morgan');
const cors        = require('cors');
const bodyParser  = require('body-parser');


require('dotenv').config()

// const port = process.env.STRING_MONGODB;
// console.log(`STRING DO MONGODB ${port}`);

// crio um servidor express
const app = express();
app.use(express.json());

app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// DB local (tempo de execução)
const data = {
    "user" : "guss",
    "key" : 1
};

const routes = require('./routes');

//LIMITE DAS REQUISIÇOES JSON
app.use(routes)

// criação de rota que será acessada utilizando o método HTTP GET/
// http://localhost:9000/
app.get('/', (req, res) => {return res.json();});

// criação de rota que será acessada utilizando o método HTTP POST/
// http://localhost:9000/add
app.post('/add', (req, res) => {
  const result = req.body;

  if (!result) {
    return res.status(400).end();
  }

  data.push(result);

  return res.json({ result });
});
const PORTA = 9080;
// o servidor irá rodar dentro da porta 9080
app.listen(PORTA, () => console.log(`Express Iniciado! na porta: ${PORTA}`));