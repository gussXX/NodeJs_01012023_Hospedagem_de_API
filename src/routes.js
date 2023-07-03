const express = require('express')
const router = express.Router();

const {first} = require('./routes/first.js');
const {two} = require('./routes/two.js');
const { image } = require('./routes/image.js');

var cors = require('cors');

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

// const cors = require('amp-toolbox-cors/lib/cors.js');
// const {cors} = require ('./routes/cors.js')

router.post('/first', first)
router.get('/two', cors(corsOptions), two)

router.get('/image', image)

// router.get('/cors',)

module.exports = router;