// ******************************************************
// *   Clase 06   : Servidor Web                        *
// *   Desafio 03 : "Servidor con Express"              *
// *   Alumno     : Alejandro Abraham                   *
// ******************************************************

console.clear()

const ProductsClass = require('./ProductsClass.js')
const express = require('express')

const _portEXPRESS = 4000
const appEXPRESS = express()
appEXPRESS.listen(_portEXPRESS, () => {
    console.log(`Server EXPRESS escuchando en el puerto: ${_portEXPRESS}`)
})


const _filePath = './products.txt'
const _fileFormat = 'utf-8'
const productos = new ProductsClass.Products(_filePath, _fileFormat)

appEXPRESS.get('/', (req, res) => {
    console.log(`HTTP Request ==> metodo: ${req.method} ruta: ${req.url}`)
    let homePage = '<div><a href="/productos">Productos</a></div>'
    homePage += '\n <div><a href="/productosRandom">Producto Random</a></div>'
    res.send(homePage)
})

appEXPRESS.get('/productos', (req, res) => {
    console.log(`HTTP Request ==> metodo: ${req.method} ruta: ${req.url}`)
    const lectura = new Promise(function (resolve, reject) {
        resolve(productos.getAll());
    })
    lectura.then(function (value) {
        res.send(value)
    }, function (err) {
        console.log(err) // Error!
        res.send(err)
    })
})

appEXPRESS.get('/productosRandom', (req, res) => {
    console.log(`HTTP Request ==> metodo: ${req.method} ruta: ${req.url}`)

    const lectura = new Promise(function (resolve, reject) {
        resolve(productos.getAll())
    })
    lectura.then(function (value) {
        const productRnd = new Promise(function (resolve, reject) {
            resolve(productos.getById(Math.floor(Math.random() * value.length + 1)))
        })
        productRnd.then(function (value) {
            res.send(value)
        }, function (err) {
            console.log(err) // Error!    
            res.send(err)
        })
    }, function (err) {
        console.log(err) // Error!
        res.send(err)
    })
})