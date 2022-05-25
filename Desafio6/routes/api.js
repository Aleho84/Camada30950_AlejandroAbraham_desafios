const { Router, response } = require('express')
const router = Router()

//product class
const Products = require('../bin/products.js')
const _filePath = './data/products.json'
const _fileFormat = 'utf-8'
const products = new Products(_filePath, _fileFormat)


//routes
router.get('/productos', (req, res) => {
    products.getAll()
        .then(response => {
            res.status(200).json(response)
        })
        .catch(error => {
            res.status(500).json(error.message)
        })
})

module.exports = router