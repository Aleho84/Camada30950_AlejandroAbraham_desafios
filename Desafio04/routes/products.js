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

router.get('/productos/:id', (req, res) => {
    products.getById(req.params.id)
        .then(response => {
            if (typeof response.status === 'undefined') {
                res.status(200).json(response)
            } else {
                res.status(response.status).json(response.message)
            }
        })
        .catch(error => {
            res.status(500).json(error.message)
        })
})

router.post('/productos', upload.single('imageFile'), (req, res) => {
    let { title, price } = req.body
    let newProduct = { title: title, price: price, thumbnail: req.file.filename }

    products.add(newProduct)
        .then(response => {
            if (typeof response.status === 'undefined') {
                res.status(200).json(response)
            } else {
                res.status(response.status).json(response.message)
            }
        })
        .catch(error => {
            res.status(500).json(error.message)
        })
})

router.put('/productos/:id', (req, res) => {
    let { title, price, thumbnail } = req.body
    let id = req.params.id
    let updateProduct = { title, price, thumbnail, id }

    products.update(updateProduct)
        .then(response => {
            if (typeof response.status === 'undefined') {
                res.status(200).json(response)
            } else {
                res.status(response.status).json(response.message)
            }
        })
        .catch(error => {
            res.status(500).json(error.message)
        })
})

// router.get('/reset', (req, res) => {
//     res.json({ message: 'falta implementar' })
// })

// router.delete('/productos/:id', (req, res) => {
//     res.json({ message: 'falta implementar' })
// })


module.exports = router