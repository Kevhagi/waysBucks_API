const express = require('express')

const router = express.Router()

//import controller
const { getUsers, getUser } = require('../controllers/users')

//create router
router.get('/users', getUsers);
router.get('/getuser', getUser)

//export module
module.exports = router