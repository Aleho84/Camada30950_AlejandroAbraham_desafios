// ***********************************************
// *   Clase 10   : Pug & Ejs                    *
// *   Desafio 05 : "Motores de plantillas"      *
// *   Alumno     : Alejandro Abraham            *
// ***********************************************

const express = require('express')
const morgan = require('morgan')

const app = express()

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(morgan('dev'))

//view
app.set('views', './views')
app.set('view engine', 'ejs')

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
app.use('/', rProducts)

//server
const _port = 3000
app.listen(_port)
