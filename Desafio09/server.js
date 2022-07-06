// *********************************************************
// *   Clase 22   : Trabajando con Datos - Normalización   *
// *   Desafio 09 : "Mocks y normalización "               *
// *   Alumno     : Alejandro Abraham                      *
// *********************************************************

// NOTAS:
// los datos de conexion se encuentran en el archivo .env

const express = require('express')
const Mongoose = require ('mongoose')
const morgan = require('morgan')
const dotenv = require('dotenv').config()
const { Server: HTTPServer } = require('http')
const { Server: IOServer } = require('socket.io')

// classes
const Products = require('./bin/products.js')
const Messages = require('./bin/messages.js')

// initializers
const app = express()
const httpServer = new HTTPServer(app)
const ioServer = new IOServer(httpServer)
const serverPort = process.env.serverPort || 3000
const dbURI = process.env.dbURI || 'mongodb+srv://dev:dMNMOqQoCQpZthbh@alehomongodb-kgzcr.gcp.mongodb.net/development'
const messages = new Messages()
const products = new Products()

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(morgan('dev'))

// view
app.set('views', './views')
app.set('view engine', 'ejs')

// error handler
app.use(function (err, req, res, next) {
    res.status(500).json({
        code: err.code,
        message: err.message,
        stack: err.stack
    })
})

// rutas
const rProducts = require('./routes/products.js')
app.use('/', rProducts)
const rApi = require('./routes/api.js')
app.use('/api', rApi)

// server
httpServer.listen(serverPort, () => {
    console.log(`HTTP Server en puerto:${serverPort}`)
})

// mongoose
Mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (error) => {
    if (error) {
        console.log(`MONGODB: Error al conectar [${error}]`)
        process.exit()
    } else {
        console.log(`MONGODB: Conectado`)
    }
})

// socket.io
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
