console.clear()
console.log('***TEST***')

const pClass = require('../bin/products.js')

const _filePath = './data/products.json'
const _fileFormat = 'utf-8'

const nuevoProducto = {    
    "title": "Producto de prueba",
    "price": 99.99,
    "thumbnail": "Foto de prueba"
  }

const products = new pClass(_filePath, _fileFormat)

const lectura = new Promise(function (resolve, reject) {
    resolve(products.getById(1))
    
})

lectura.then(function (value) {
    console.log(value)
}, function (err) {
    console.log(err) // Error!    
})