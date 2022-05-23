
const { Router, response } = require('express')
const router = Router()

//product class
const Products = require('../bin/products.js')
const _filePath = './data/products.json'
const _fileFormat = 'utf-8'
const products = new Products(_filePath, _fileFormat)


//routes
router.get('/', (req, res) => {
    res.render('./pages/index.ejs', { title: 'SimCompras', alertIcon: "", alertMessage: "" })
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

router.post('/productos', (req, res) => {
    let { title, price, thumbnail } = req.body
    let newProduct = { title, price, thumbnail }

    products.add(newProduct)
        .then(response => {
            if (typeof response.status === 'undefined') {
                res.render('./pages/view.ejs', { title: 'SimCompras - View', alertIcon: "success", alertMessage: "Producto Agregado", products: response })
            } else {
                res.status(response.status).render('./pages/index.ejs', { title: 'SimCompras', alertIcon: "error", alertMessage: response.message })
            }
        })
        .catch(error => {
            res.status(500).json(error.message)
        })
})

// router.put('/productos/:id', (req, res) => {
//     let { title, price, thumbnail } = req.body
//     let id = req.params.id
//     let updateProduct = { title, price, thumbnail, id }

//     products.update(updateProduct)
//         .then(response => {
//             if (typeof response.status === 'undefined') {
//                 res.status(200).json(response)
//             } else {
//                 res.status(response.status).json(response.message)
//             }
//         })
//         .catch(error => {
//             res.status(500).json(error.message)
//         })
// })

// router.get('/productos/:id', (req, res) => {
//     products.getById(req.params.id)
//         .then(response => {
//             if (typeof response.status === 'undefined') {
//                 res.status(200).json(response)
//             } else {
//                 res.status(response.status).json(response.message)
//             }
//         })
//         .catch(error => {
//             res.status(500).json(error.message)
//         })
// })

module.exports = router