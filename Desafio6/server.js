// *****************************************************
// *   Clase 12  : Aplicación chat con Websocket       *
// *   Desafio 6 : "Websockets"                        *
// *   Alumno    : Alejandro Abraham                   *
// *****************************************************

const express = require('express')
const morgan = require('morgan')
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

//socket.io
ioServer.on('connection', (socket) => {
    socket.emit(`server_handshake`)
    
    socket.on('client_handshake', () => {        
        socket.emit('message', 'Conectado')
        console.log(`cliente [${socket.id}] conectado`)
    })

    socket.on('disconnect', () => {        
        socket.emit('message', 'Desconectado')
        console.log(`cliente [${socket.id}] desconectado`)
    })

    socket.on('product_change', () => {        
        ioServer.sockets.emit('product_change', 'los productos cambiaron')
        console.log(`cliente [${socket.id}] cambio los productos`)
    })
})

//server
const _port = 3000
httpServer.listen(_port, () => {
    console.log(`HTTP Server en puerto:${_port}`)
})
