const express = require('express')
const router = express.Router();

const {first} = require('./routes/first.js');
const {two} = require('./routes/two.js');
var cors = require('cors')
// const cors = require('amp-toolbox-cors/lib/cors.js');
// const {cors} = require ('./routes/cors.js')

router.post('/first', first)
router.get('/two', cors(), two)
// router.get('/cors',)

module.exports = router;