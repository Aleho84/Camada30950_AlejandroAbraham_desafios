//product class
const Products = require('../bin/products.js')
const products = new Products()


exports.indexPage = function (req, res) {
    products.getAll()
        .then(response => {
            res.render('./pages/index.ejs', { title: 'SimCompras', alertIcon: "", alertMessage: "", productsCount: response.length })
        })
        .catch(error => {
            res.status(500).json(error.message)
        })
}

exports.addProductPage = function (req, res) {
    res.render('./pages/add.ejs', { title: 'SimCompras - Add', alertIcon: "", alertMessage: "" })
}

exports.viewProductPage = function (req, res) {
    products.getAll()
        .then(response => {
            res.render('./pages/view.ejs', { title: 'SimCompras - View', alertIcon: "", alertMessage: "", products: response })
        })
        .catch(error => {
            res.status(500).json(error.message)
        })
}
