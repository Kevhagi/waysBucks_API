const express = require('express')


const router = express.Router()

//import controller
const { register, getUsers, login, deleteUser } = require('../controllers/user')
const { getProducts, productDetail, addProduct, editProduct, deleteProduct } = require('../controllers/product')
const { getToppings, toppingDetail, addTopping, editTopping, deleteTopping } = require('../controllers/topping')
const { getTransactions, addTransactions } = require('../controllers/transaction')

//middlewares
const { auth } = require('../middlewares/auth')

//user
router.post('/register', register)
router.post('/login', login)
router.get('/users', getUsers)
router.delete('/user/:id', deleteUser)

//product
router.get('/products', getProducts)
router.get('/product/:id', productDetail)
router.post('/product', auth, addProduct)
router.patch('/product/:id', auth, editProduct)
router.delete('/product/:id', auth, deleteProduct)

//topping
router.get('/toppings', getToppings)
router.get('/topping/:id', toppingDetail)
router.post('/topping', auth, addTopping)
router.patch('/topping/:id', auth, editTopping)
router.delete('/topping/:id', auth, deleteTopping)

//transaction
router.get('/transactions', getTransactions)
router.post('/transaction', auth, addTransactions)

//export module
module.exports = router