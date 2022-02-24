const { user, transactions, products_order, toppings_order, products, toppings } = require('../../models')
const jwt_decode = require('jwt-decode')

exports.getTransactions = async (req,res) => {
    try {
        
        var allTransactions = await transactions.findAll({
            include : [
                {
                    model : user,
                    required : true,
                    as : 'customer'
                },
                {
                    model : products_order,
                    as : 'products_order',
                    include : [
                        {
                            model : products,
                            as : 'products'
                        },
                        {
                            model : toppings_order,
                            as : 'toppings_order',
                            include : [
                                {
                                   model : toppings,
                                   as : 'toppings'
                                }
                            ]
                        }
                    ]
                }
            ]
        })

        res.status(200).send({
            status : 'Success',
            data : {
                transactions : allTransactions.map((scarlet, index) => {
                    return {
                        id : scarlet.id,
                        userOrder : {
                            id : scarlet.customer.id,
                            fullName : scarlet.customer.fullName,
                            email : scarlet.customer.email
                        },
                        status : scarlet.statusTransaction,
                        order : scarlet.products_order.map((teio, index) => {
                            return {
                                id : teio.id,
                                title : teio.products.productName,
                                price : teio.products.productPrice,
                                image : teio.products.productImage,
                                qty : teio.qty,
                                toppings : teio.toppings_order.map((karin, index) => {
                                    return {
                                        id : karin.toppingID,
                                        name : karin.toppings.toppingName
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status : 'Failed',
            message : 'Server Error'
        })
    }
}

exports.getTransaction = async (req,res) => {
    try {
        const { id } = req.params

        const oneTransaction = await transactions.findOne({
            where : {
                id
            },
            include : [
                {
                    model : user,
                    required : true,
                    as : 'customer'
                },
                {
                    model : products_order,
                    as : 'products_order',
                    include : [
                        {
                            model : products,
                            as : 'products'
                        },
                        {
                            model : toppings_order,
                            as : 'toppings_order',
                            include : [
                                {
                                   model : toppings,
                                   as : 'toppings'
                                }
                            ]
                        }
                    ]
                }
            ]
        })

        res.status(200).send({
            status : 'Success',
            data : {
                transaction : {
                    id,
                    userOrder : {
                        id : oneTransaction.customer.id,
                        fullName : oneTransaction.customer.fullName,
                        email : oneTransaction.customer.email
                    },
                    status : oneTransaction.statusTransaction,
                    order : oneTransaction.products_order.map((gura, index) => {
                        return {
                            id : gura.id,
                            title : gura.products.productName,
                            price : gura.products.productPrice,
                            image : gura.products.productImage,
                            qty : gura.qty,
                            toppings : gura.toppings_order.map((rushia, index) => {
                                return {
                                    id : rushia.toppingID,
                                    name : rushia.toppings.toppingName
                                }
                            })
                        }
                    })
                }
            }
        })
            
        
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status : 'Failed',
            message : 'Server Error'
        })
    }
}

exports.addTransactions = async (req,res) => {
    try {
        const data = req.body

        //user stuffs
        const authHeader = req.header("Authorization")
        const token = authHeader && authHeader.split(' ')[1]
        var decoded = jwt_decode(token)
        const decodedID = decoded.id
        const getUserDetails = await user.findOne({
            where : {
                id : decodedID
            }
        })

        var addTransaction = await transactions.create({
            customerID : decodedID
        })

        for (let i = 0; i < data.products_order.length; i++) {
            var addProductOrder = await products_order.create({
                transactionID : addTransaction.id,
                productID : data.products_order[i].productID,
                qty : data.products_order[i].qty
            })
            for (let j = 0; j < data.products_order[i].toppings_order.length; j++) {
                var addToppingOrder = await toppings_order.create({
                    productOrderID : addProductOrder.id,
                    toppingID : data.products_order[i].toppings_order[j]
                })
            }
        }

        var getProductOrder = await products_order.findAll({
            where : {
                transactionID : addTransaction.id
            },
            include : [
                {
                    model : products,
                    as : 'products'
                },
                {
                    model : toppings_order,
                    as : 'toppings_order',
                    include : [
                        {
                           model : toppings,
                           as : 'toppings'
                        }
                    ]
                }
            ]
        })
        var order = getProductOrder.map((gura, index) => {
            
            return {
                id : gura.id,
                title : gura.products.productName,
                price : gura.products.productPrice,
                image : gura.products.productImage,
                qty : gura.qty,
                toppings : gura.toppings_order.map((rushia, index) => {
                    return {
                        id : rushia.toppingID,
                        name : rushia.toppings.toppingName
                    }
                })
            }
        })

        var inputTransaction = await transactions.update(
            { statusTransaction : 'Waiting Approve' },
            { where : { id : addTransaction.id }}
        )

        res.status(200).send({
            status : 'Waiting Approve',
            data : {
                transaction : {
                    id : addTransaction.id,
                    userOrder : {
                        id : getUserDetails.id,
                        fullName : getUserDetails.fullName,
                        email : getUserDetails.email
                    },
                    status : 'Success',
                    order
                }
            }
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            status : 'Failed',
            message : 'Server Error'
        })
    }
}

exports.addCart = async (req,res) => {
    try {
        const data = req.body

        var addToCart = await transactions.create({
            customerID : data.userID,
            statusTransaction : 'On Cart'
        })

        var addProductToCart = await products_order.create({
            transactionID : addToCart.id,
            productID : data.id,
            qty : 1
        })

        for (let i = 0; i < data.toppings.length; i++) {
            await toppings_order.create({
                productOrderID : addProductToCart.id,
                toppingID : data.toppings[i].id
            })
        }

        res.status(200).send({
            status : 'Success',
            message : 'Order added to cart!'
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status : 'Failed',
            message : 'Server Error'
        })
    }
}

exports.getCart = async (req,res) => {
    try {

        //user stuffs
        const authHeader = req.header("Authorization")
        const token = authHeader && authHeader.split(' ')[1]
        var decoded = jwt_decode(token)
        const decodedID = decoded.id
        const getUserDetails = await user.findOne({
            where : {
                id : decodedID
            }
        })

        var allCart = await transactions.findAll({
            where : {
                customerID : getUserDetails.id,
                statusTransaction : 'On Cart'
            },
            include : [
                {
                    model : products_order,
                    as : 'products_order',
                    include : [
                        {
                            model : products,
                            as : 'products'
                        },
                        {
                            model : toppings_order,
                            as : 'toppings_order',
                            include : [
                                {
                                   model : toppings,
                                   as : 'toppings'
                                }
                            ]
                        }
                    ]
                }
            ]
        })

        res.status(200).send({
            status : 'Success',
            data : {
                onCart : allCart.map((scarlet, index) => {
                    return {
                        transactionID : scarlet.id,
                        customerID : getUserDetails.id,
                        order : scarlet.products_order.map((vodka) => {
                            return {
                                productName : vodka.products.productName,
                                productPrice : vodka.products.productPrice,
                                productImage : vodka.products.productImage,
                                topping : vodka.toppings_order.map((teio, index) => {
                                    return {
                                        toppingName : teio.toppings.toppingName,
                                        toppingPrice : teio.toppings.toppingPrice
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })

        
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status : 'Failed',
            message : 'Server Error'
        })
    }
}

exports.editTransaction = async (req,res) => {
    try {
        const { id } = req.params
        await transactions.update(
            { statusTransaction : req.body.status }, {
            where : {
                id
            }
        })

        const oneTransaction = await transactions.findOne({
            where : {
                id
            },
            include : [
                {
                    model : user,
                    required : true,
                    as : 'customer'
                },
                {
                    model : products_order,
                    as : 'products_order',
                    include : [
                        {
                            model : products,
                            as : 'products'
                        },
                        {
                            model : toppings_order,
                            as : 'toppings_order',
                            include : [
                                {
                                   model : toppings,
                                   as : 'toppings'
                                }
                            ]
                        }
                    ]
                }
            ]
        })

        res.status(200).send({
            status : 'Success',
            data : {
                transaction : {
                    id,
                    userOrder : {
                        id : oneTransaction.customer.id,
                        fullName : oneTransaction.customer.fullName,
                        email : oneTransaction.customer.email
                    },
                    status : oneTransaction.statusTransaction,
                    order : oneTransaction.products_order.map((gura, index) => {
                        return {
                            id : gura.id,
                            title : gura.products.productName,
                            price : gura.products.productPrice,
                            image : gura.products.productImage,
                            qty : gura.qty,
                            toppings : gura.toppings_order.map((rushia, index) => {
                                return {
                                    id : rushia.toppingID,
                                    name : rushia.toppings.toppingName
                                }
                            })
                        }
                    })
                }
            }
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status : 'Failed',
            message : 'Server Error'
        })
    }
}

exports.deleteTransaction = async (req,res) => {
    try {
        const {id} = req.params

        const findIndex = await transactions.findOne({
            where : {
                id
            }
        })
        if(findIndex === null){
            return res.status(400).send({
                status : 'Failed',
                message : 'ID not found'
            })
        }

        await transactions.destroy({
            where : {
                id
            }
        })

        res.status(200).send({
            status : 'Success',
            data : {
                id
            }
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status : 'Failed',
            message : 'Server Error'
        })
    }
}

exports.myTransactions = async (req,res) => {
    try {
        //user stuffs
        const authHeader = req.header("Authorization")
        const token = authHeader && authHeader.split(' ')[1]
        var decoded = jwt_decode(token)
        const decodedID = decoded.id

        var allTransactions = await transactions.findAll({
            where : {
                customerID : decodedID
            },
            include : [
                {
                    model : user,
                    required : true,
                    as : 'customer'
                },
                {
                    model : products_order,
                    as : 'products_order',
                    include : [
                        {
                            model : products,
                            as : 'products'
                        },
                        {
                            model : toppings_order,
                            as : 'toppings_order',
                            include : [
                                {
                                   model : toppings,
                                   as : 'toppings'
                                }
                            ]
                        }
                    ]
                }
            ]
        })

        res.status(200).send({
            status : "Success",
            data : {
                transactions : allTransactions.map((scarlet, index) => {
                    return {
                        id : scarlet.id,
                        status : scarlet.statusTransaction,
                        order : scarlet.products_order.map((teio, index) => {
                            return {
                                id : teio.id,
                                title : teio.products.productName,
                                price : teio.products.productPrice,
                                image : teio.products.productImage,
                                qty : teio.qty,
                                toppings : teio.toppings_order.map((karin, index) => {
                                    return {
                                        id : karin.toppingID,
                                        name : karin.toppings.toppingName
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    } catch (error) {
        console.log(error);

    }
}