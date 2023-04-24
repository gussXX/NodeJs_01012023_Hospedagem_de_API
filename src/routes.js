const express = require('express')
const router = express.Router();

const {first} = require('./routes/first.js');
const {two} = require('./routes/two.js');
// const {cors} = require ('./routes/cors.js')

router.post('/first', first)
router.get('/two', two)
// router.get('/cors',)

module.exports = router;