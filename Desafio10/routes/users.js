const express = require('express')
const router = express.Router()

const usersController = require('../controllers/users.js')

router.get('/countSession', usersController.countSession)
router.get('/login', usersController.logIn)
router.post('/login', usersController.logInPost)
router.get('/logout', usersController.logout)

module.exports = router
