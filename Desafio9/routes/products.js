const { Router, response } = require('express')
const router = Router()

//product controller
const productsController = require('../controllers/products.js')

//routes
router.get('/', productsController.indexPage)
router.get('/agregar', productsController.addProductPage)
router.get('/productos', productsController.viewProductPage)

module.exports = router
