const express = require('express')

const router = express.Router()

//import controller
const { register, getUsers, login, deleteUser } = require('../controllers/user')

//create router
router.post('/register', register)
router.get('/users', getUsers)
router.post('/login', login)
router.delete('/user/:id', deleteUser)

//export module
module.exports = router