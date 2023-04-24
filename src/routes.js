const express = require('express')
const router = express.Router();

const {first} = require('./routes/first.js');
const { two } = require('./routes/two.js');

router.post('/first', first)
router.get('/two', two)

module.exports = router;