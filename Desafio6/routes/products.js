
const { Router, response } = require('express')
const router = Router()

//product class
const Products = require('../bin/products.js')
const products = new Products(process.env.productFilePath, process.env.productFileFormat)


//routes
router.get('/', (req, res) => {
    products.getAll()
        .then(response => {
            res.render('./pages/index.ejs', { title: 'SimCompras', alertIcon: "", alertMessage: "", productsCount: response.length })
        })
        .catch(error => {
            res.status(500).json(error.message)
        })
})

router.get('/agregar', (req, res) => {
    res.render('./pages/add.ejs', { title: 'SimCompras - Add', alertIcon: "", alertMessage: "" })
})

router.get('/productos', (req, res) => {
    products.getAll()
        .then(response => {
            res.render('./pages/view.ejs', { title: 'SimCompras - View', alertIcon: "", alertMessage: "", products: response })
        })
        .catch(error => {
            res.status(500).json(error.message)
        })
})

module.exports = router