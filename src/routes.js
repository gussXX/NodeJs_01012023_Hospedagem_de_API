const express = require('express')
const router = express.Router();

const {first} = require('./backup/first.js');
const {ler_todos_valores} = require('./routes/ler_todos_valores.js');
const {adicionar_valor_ao_mes} = require('./routes/adicionar_valor_ao_mes.js');
const {ler_valores_especificos} = require('./routes/ler_valores_especificos.js');

var cors = require('cors');

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

router.get('/first', first)
router.get('/ler_todos_valores', cors(corsOptions), ler_todos_valores)
router.get('/adicionar_valor_ao_mes', cors(corsOptions), adicionar_valor_ao_mes)
router.get('/ler_valores_especificos', cors(corsOptions), ler_valores_especificos)

module.exports = router;