//requires
const { faker } = require('@faker-js/faker')

//product class
const Products = require('../bin/products.js')
const products = new Products()

//message class
const Messages = require('../bin/messages.js')
const messages = new Messages(process.env.messageFilePath, process.env.messageFileFormat)


exports.productsGet = function (req, res) {
    products.getAll()
        .then(response => {
            res.status(200).json(response)
        })
        .catch(error => {
            res.status(500).json(error.message)
        })
}

exports.messagesGet = function (req, res) {
    messages.getAll()
        .then(response => {
            res.status(200).json(response)
        })
        .catch(error => {
            res.status(500).json(error.message)
        })
}

exports.testProductsGet = function (req, res) {
    res.status(200).json(rdmProducts(5))
}

function rdmProducts(quantity) {
    let fakerProductList = []
    let fakerProduct = {}

    for (let i = 1; i <= quantity; i++) {
        fakerProduct = {
            id: i,
            title: faker.commerce.productName(),
            price: faker.commerce.price(1, 1000, 2, '$'),
            thumbnail: faker.image.image(640, 480)
        }
        fakerProductList.push(fakerProduct)
    }

    return fakerProductList
}
