const { products } = require('../../models')

exports.getProducts = async (req,res) => {
    try {
        const search = await products.findAll({
            attributes : {
                exclude : ['createdAt', 'updatedAt']
            }
        })

        res.send({
            status : 'Success',
            data : {
                products : search
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

exports.productDetail = async (req,res) => {
    try {
        const { id } = req.params
        const result = await products.findOne({
            where : {
                id
            },
            attributes : {
                exclude : ['createdAt', 'updatedAt']
            }
        })

        res.status(200).send({
            status : 'Success',
            data : {
                product : result
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

exports.addProduct = async (req,res) => {
    try {
        const findDuplicates = await products.findOne({
            where : {
                productName : req.body.productName
            }
        })
        if(findDuplicates !== null){
            return res.status(400).send({
                status : 'Failed',
                message : 'Nama produk tidak boleh sama!'
            })
        }

        const product = await products.create({
            productName : req.body.productName,
            productPrice : req.body.productPrice,
            productImage : req.body.productImage
        })
        res.status(200).send({
            status : 'Success',
            data : {
                product : {
                    id : product.id,
                    productName : product.productName,
                    productPrice : product.productPrice,
                    productImage : product.productImage
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

exports.editProduct = async (req,res) => {
    try {
        const { id } = req.params
        await products.update(req.body, {
            where : {
                id
            },
        })

        const result = await products.findOne({
            where : {
                id
            }
        })

        res.status(200).send({
            status : 'Success',
            data : {
                product : {
                    id,
                    productName : result.productName,
                    productPrice : result.productPrice,
                    productImage : result.productImage
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

exports.deleteProduct = async (req,res) => {
    try {
        const {id} = req.params

        const findIndex = await toppings.findOne({
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

        await products.destroy({
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
