const package = require('../package.json')
const debug = require('debug')(package.name + ':indexController')

exports.indexGet = function (req, res, next) {

    if (req.session.countSession) {
        req.session.countSession++
    } else {
        req.session.countSession = 1
        req.session.email = 'invitado'        
    }

    res.status(200).render('index', { title: package.name, user: req.session.email })
}