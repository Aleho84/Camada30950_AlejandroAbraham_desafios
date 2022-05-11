// *****************************************************
// *   Clase 8   : Router & Multer                     *
// *   Desafio 4 : "API RESTful"                       *
// *   Alumno    : Alejandro Abraham                   *
// *****************************************************

const express = require('express')
const morgan = require('morgan')

const app = express()

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(morgan('dev'))

//error handler
app.use(function (err, req, res, next) {
    res.status(500).json({
        code: err.code,
        message: err.message,
        stack: err.stack
    })
})

//rutas
const rProducts = require('./routes/products.js')
app.use('/api', rProducts)

const _port = 3000
app.listen(_port)
