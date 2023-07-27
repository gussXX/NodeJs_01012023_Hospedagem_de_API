const express = require('express')
const router = express.Router();

const {first} = require('./routes/first.js');
const {two} = require('./routes/two.js');

var cors = require('cors');

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

router.get('/first', first)
router.get('/two', cors(corsOptions), two)

module.exports = router;