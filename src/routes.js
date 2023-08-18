const express = require('express')
const router = express.Router();

const {first} = require('./backup/first.js');

const {ler_todos_valores} = require('./routes/ler_todos_valores.js');
const {cadastrar_usuarios} = require('./routes/cadastrar_usuarios.js');

const {ler_valores_especificos} = require('./routes/ler_valores_especificos.js');
const {inserir_valores_ao_array} = require('./routes/inserir_valores_ao_array.js');
const {inserir_valores_parcelados_ao_array} = require('./routes/inserir_valores_parcelados_ao_array.js');
const {filtrar_valores_por_tipo} = require('./routes/filtrar_valores_por_tipo.js');

const {inserir_valores_parcelados_ao_array_anual} = require('./routes/inserir_valores_parcelados_ao_array_anual.js');
const {ler_valores_especificos_anual} = require('./routes/ler_valores_especificos_anual.js');
const {somar_todos_as_saidas_de_um_mes} = require('./routes/somar_todos_as_saidas_de_um_mes.js');
const {somar_todos_as_entradas_de_um_mes} = require('./routes/somar_todos_as_entradas_de_um_mes.js');
const {somar_todos_as_parcelas_de_um_mes} = require('./routes/somar_todos_as_parcelas_de_um_mes.js');
const {mostrar_valores_de_um_mes} = require('./routes/mostrar_valores_de_um_mes.js');

const {trabalhando_com_datas} = require('./routes/trabalhando_com_datas.js');

// ROTAS FINAIS

const {inserir} = require('./routes/release/inserir.js');
const {somar_entradas} = require('./routes/release/somar_entradas.js');
const {somar_saidas} = require('./routes/release/somar_saidas.js');
const {somar_parcelas} = require('./routes/release/somar_parcelas.js');
const {relatorio_mensal} = require('./routes/release/relatorio_mensal.js');

var cors = require('cors');

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

router.get('/first', first)

router.get('/ler_todos_valores', cors(corsOptions), ler_todos_valores)
router.get('/cadastrar_usuarios', cors(corsOptions), cadastrar_usuarios)

router.post('/ler_valores_especificos', cors(corsOptions), ler_valores_especificos)
router.post('/inserir_valores_ao_array', cors(corsOptions), inserir_valores_ao_array)
router.post('/inserir_valores_parcelados_ao_array', cors(corsOptions), inserir_valores_parcelados_ao_array)
router.post('/filtrar_valores_por_tipo', cors(corsOptions), filtrar_valores_por_tipo)

router.post('/inserir_valores_parcelados_ao_array_anual', cors(corsOptions), inserir_valores_parcelados_ao_array_anual)
router.post('/ler_valores_especificos_anual', cors(corsOptions), ler_valores_especificos_anual)
router.post('/somar_todos_as_saidas_de_um_mes', cors(corsOptions), somar_todos_as_saidas_de_um_mes)
router.post('/somar_todos_as_entradas_de_um_mes', cors(corsOptions), somar_todos_as_entradas_de_um_mes)
router.post('/somar_todos_as_parcelas_de_um_mes', cors(corsOptions), somar_todos_as_parcelas_de_um_mes)
router.post('/mostrar_valores_de_um_mes', cors(corsOptions), mostrar_valores_de_um_mes)

router.post('/trabalhando_com_datas', cors(corsOptions), trabalhando_com_datas)

// ROTAS FINAIS

router.post('/inserir', cors(corsOptions), inserir)
router.post('/somar_entradas', cors(corsOptions), somar_entradas)
router.post('/somar_saidas', cors(corsOptions), somar_saidas)
router.post('/somar_parcelas', cors(corsOptions), somar_parcelas)
router.post('/relatorio_mensal', cors(corsOptions), relatorio_mensal)

module.exports = router;

