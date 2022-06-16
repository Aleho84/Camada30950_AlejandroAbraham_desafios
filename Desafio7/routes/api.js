const { Router, response } = require('express')
const router = Router()


//product class
const Products = require('../bin/products.js')
const products = new Products()

//message class
const Messages = require('../bin/messages.js')
const messages = new Messages(process.env.messageFilePath, process.env.messageFileFormat)


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

router.get('/mensajes', (req, res) => {
    messages.getAll()
        .then(response => {
            res.status(200).json(response)
        })
        .catch(error => {
            res.status(500).json(error.message)
        })
})

module.exports = router