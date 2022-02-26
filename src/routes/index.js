const express = require('express')


const router = express.Router()

//import controller
const { register, getUsers, login, deleteUser, checkAuth } = require('../controllers/user')
const { getProducts, productDetail, addProduct, editProduct, deleteProduct } = require('../controllers/product')
const { getToppings, toppingDetail, addTopping, editTopping, deleteTopping } = require('../controllers/topping')
const { getTransactions, addTransactions, getTransaction, editTransaction, deleteTransaction, myTransactions, addCart, getCart, getCart2, getCartOther } = require('../controllers/transaction')

//middlewares
const { auth } = require('../middlewares/auth')
const { uploadFile } = require('../middlewares/uploadFile')

//user
router.post('/register', register)
router.post('/login', login)
router.get('/users', getUsers)
router.get('/check-auth', auth, checkAuth)
router.delete('/user/:id', auth, deleteUser)

//product
router.get('/products', getProducts)
router.get('/product/:id', productDetail)
router.post('/product', auth, uploadFile("productImage"), addProduct)
router.patch('/product/:id', auth, editProduct)
router.delete('/product/:id', auth, deleteProduct)

//topping
router.get('/toppings', getToppings)
router.get('/topping/:id', toppingDetail)
router.post('/topping', auth, uploadFile("toppingImage"), addTopping)
router.patch('/topping/:id', auth, editTopping)
router.delete('/topping/:id', auth, deleteTopping)

//transaction
router.get('/transactions', getTransactions)
router.get('/transaction/:id', getTransaction)
router.post('/addtocart', auth, addCart)
router.get('/getcart', auth, getCart)
router.get('/getcart2', auth, getCartOther)
router.post('/transaction', auth, uploadFile("transactionImage"), addTransactions)
router.patch('/transaction/:id', auth, editTransaction)
router.delete('/transaction/:id', auth, deleteTransaction)
router.get('/my-transactions', auth, myTransactions)

//export module
module.exports = router