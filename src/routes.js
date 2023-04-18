const express = require('express')
const router = express.Router();

const {first} = require('./routes/first.js')

router.post('/first', first)

module.exports = router;