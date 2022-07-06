
const package = require('../package.json')
const debug = require('debug')(package.name + ':usersController')

exports.countSession = function (req, res, next) {
    if (req.session.countSession) {
        req.session.countSession++
        res.send(`Visitaste la pagina ${req.session.countSession} veces`)
    } else {
        req.session.countSession = 1
        res.send('Bienvenido!')
    }
}

exports.logIn = function (req, res, next) {
    res.status(200).render('login', { title: package.name ,  user: req.session.email })
}

exports.logInPost = function (req, res, next) {
    const { email, password } = req.body
    if (email !== 'alejandro.r.abraham@gmail.com' || password !== 'tuviejaentanga') {
        debug('login fallido')
        res.send('login fallido!')
    } else {
        req.session.email = email
        req.session.admin = true
        debug('login exito')
        res.status(200).render('index', { title: package.name, user: req.session.email })
    }
}

exports.logout = function (req, res, next) {
    req.session.destroy(err => {
        if (!err) {
            res.status(200).render('index', { title: package.name, user: 'invitado' })
        } else {
            res.send({ status: 'LOGOUT ERROR', body: err })
        }
    })
}