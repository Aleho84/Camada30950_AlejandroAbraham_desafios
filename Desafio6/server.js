// *****************************************************
// *   Clase 12  : Aplicación chat con Websocket       *
// *   Desafio 6 : "Websockets"                        *
// *   Alumno    : Alejandro Abraham                   *
// *****************************************************

const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv').config()
const { Server: HTTPServer } = require('http')
const { Server: IOServer } = require('socket.io')

const app = express()
const httpServer = new HTTPServer(app)
const ioServer = new IOServer(httpServer)

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
const rApi = require('./routes/api.js')
app.use('/api', rApi)

//server
const _port = process.env.port || 3000
httpServer.listen(_port, () => {
    console.log(`HTTP Server en puerto:${_port}`)
})

//product class
const Products = require('./bin/products.js')
const products = new Products(process.env.productFilePath, process.env.productFileFormat)

//message class
const Messages = require('./bin/messages.js')
const messages = new Messages(process.env.messageFilePath, process.env.messageFileFormat)

//socket.io
ioServer.on('connection', (socket) => {
    socket.emit(`server_handshake`)

    socket.on('client_handshake', () => {
        console.log(`cliente [${socket.id}] conectado`)
    })

    socket.on('disconnect', () => {
        console.log(`cliente [${socket.id}] desconectado`)
    })

    socket.on('product_add', data => {
        console.log(`cliente [${socket.id}] agrego un producto`, data)
        products.add(data)
            .then(response => {
                if (typeof response.status === 'undefined') {
                    ioServer.sockets.emit('product_change', data)
                    socket.emit('message', { alertIcon: "success", alertMessage: "Producto Agregado" })

                } else {
                    socket.emit('message', { alertIcon: "error", alertMessage: response.message })
                }
            })
            .catch(error => {
                socket.emit('message', { alertIcon: "error", alertMessage: error.message })
            })
    })

    socket.on('message_add', data => {
        console.log(`cliente [${socket.id}] dejo un mensaje nuevo`, data)
        messages.add(data)
        .then(response => {
            if (typeof response.status === 'undefined') {
                ioServer.sockets.emit('message_change', data)
            } else {
                socket.emit('message', { alertIcon: "error", alertMessage: response.message })
            }
        })
        .catch(error => {
            socket.emit('message', { alertIcon: "error", alertMessage: error.message })
        })  
    })
})