const { Router, response } = require('express')
const router = Router()

//api controller
const apiController = require('../controllers/api.js')

//routes
router.get('/productos', apiController.productsGet)
router.get('/mensajes', apiController.messagesGet)
router.get('/productos-test', apiController.testProductsGet)

module.exports = router
