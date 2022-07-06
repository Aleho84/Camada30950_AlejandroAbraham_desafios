const express = require('express')
const router = express.Router()

const indexController = require('../controllers/index.js')

router.get('/', indexController.indexGet)

module.exports = router
