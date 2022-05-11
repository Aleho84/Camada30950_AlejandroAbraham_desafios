const { Router } = require('express')
const router = Router()

//multer
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/')
    }
})
const upload = multer({ storage: storage })

//product class
const pClass = require('../bin/products.js')
const _filePath = './data/products.json'
const _fileFormat = 'utf-8'
const products = new pClass(_filePath, _fileFormat)


//routes
router.get('/productos', (req, res) => {
    // si no tiene query params, trae todos
    if (typeof req.query.id === 'undefined') {
        const getAllProducts = new Promise(function (resolve, reject) {
            resolve(products.getAll())
        })
        getAllProducts.then(function (value) {
            res.json(value)
        }, function (err) {
            res.json(err)
        })
        // si tiene el ID como query params trae por id
    } else {
        const getProductsById = new Promise(function (resolve, reject) {
            const searchID = parseInt(req.query.id)
            resolve(products.getById(searchID))
        })
        getProductsById.then(function (value) {
            if (value === null) {
                res.json({ error: 'producto no encontrado' })
            } else {
                res.json(value)
            }
        }, function (err) {
            res.json(err)
        })
    }
})

router.post('/productos', upload.single('imageFile'), (req, res) => {
    const newProduct = {
        title: req.body.title,
        price: parseInt(req.body.price).toFixed(2),
        thumbnail: (req.file) ? req.file.filename : ''
    }
    const saveNewProduct = new Promise(function (resolve, reject) {
        resolve(products.save(newProduct))
    })
    saveNewProduct.then(function (value) {
        res.json({ message: `producto agregado correctamente. ID=${value}` })
    }, function (err) {
        res.json(err)
    })
})

router.get('/productos/:id', (req, res) => {
    const getProductsById = new Promise(function (resolve, reject) {
        const searchID = parseInt(req.params.id)
        resolve(products.getById(searchID))
    })
    getProductsById.then(function (value) {
        if (value === null) {
            res.json({ error: 'producto no encontrado' })
        } else {
            res.json(value)
        }
    }, function (err) {
        res.json(err)
    })
})

router.put('/productos/:id', upload.single('imageFile'), (req, res) => {
    const getProductsById = new Promise(function (resolve, reject) {
        const searchID = parseInt(req.params.id)
        resolve(products.getById(searchID))
    })
    getProductsById.then(function (getProduct) {
        if (getProduct === null) {
            res.json({ error: 'producto no encontrado' })
        } else {
            const newProduct = {
                title: req.body.title,
                price: parseInt(req.body.price).toFixed(2),
                thumbnail: req.body.thumbnail,
                id: parseInt(req.params.id)
            }

            const deleteProductsById = new Promise(function (resolve, reject) {
                const deleteID = parseInt(getProduct.id)
                resolve(products.deleteById(deleteID))
            })
            deleteProductsById.then(function (value) {
                if (value) {

                    const saveNewProduct = new Promise(function (resolve, reject) {
                        resolve(products.save(newProduct))
                    })
                    saveNewProduct.then(function (value) {
                        if (value === null) {
                            res.json({ message: `producto invalido` })
                        } else {
                            res.json({ message: `producto modificado correctamente` })
                        }
                    }, function (err) {
                        res.json(err)
                    })
                } else {
                    res.json({ error: 'producto no encontrado' })
                }
            }, function (err) {
                res.json(err)
            })
        }
    }, function (err) {
        res.json(err)
    })
})

router.get('/reset', (req, res) => {
    const deleteAllProducts = new Promise(function (resolve, reject) {
        resolve(products.deleteAll())
    })
    deleteAllProducts.then(function (value) {
        res.json({ message: 'todos los productos fueron eliminados' })
    }, function (err) {
        res.json(err)
    })
})

router.delete('/productos/:id', (req, res) => {
    const deleteProductsById = new Promise(function (resolve, reject) {
        const deleteID = parseInt(req.params.id)
        resolve(products.deleteById(deleteID))
    })
    deleteProductsById.then(function (value) {
        if (value) {
            res.json({ message: `producto eliminado correctamente. ID=${req.params.id}` })
        } else {
            res.json({ error: 'producto no encontrado' })
        }
    }, function (err) {
        res.json(err)
    })
})


module.exports = router