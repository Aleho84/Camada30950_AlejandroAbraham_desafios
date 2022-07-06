// *********************************************************
// *   Clase 24   : Cookies, Sesiones, Storages - Parte 2  *
// *   Desafio 10 : "Login por formulario"                 *
// *   Alumno     : Alejandro Abraham                      *
// *********************************************************

// Module dependencies.
require('dotenv').config()
const indexRouter = require('./routes/index.js')
const usersRouter = require('./routes/users.js')

const path = require('path')
const createError = require('http-errors')

const express = require('express')
const sessions = require('express-session')
const sessionFileStore = require('session-file-store')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

// Initializers
const app = express()
const FileStore = sessionFileStore(sessions)

app.set('views', path.join(__dirname, 'views/pages'))
app.set('view engine', 'ejs')
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(sessions({
  saveUninitialized: false,
  resave: false,
  secret: process.env.sessionsSecret,
  store: new FileStore({ path: './sessions', retries: 0 })
}))

// Routers
app.use('/users', usersRouter)
app.use('/', indexRouter)

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// Error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app 
