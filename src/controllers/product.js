const { products } = require('../../models')
const path = require('path')
const fs = require('fs')
const Joi = require('joi')

exports.getProducts = async (req,res) => {
    try {
        let search = await products.findAll({
            attributes : {
                exclude : ['createdAt', 'updatedAt']
            }
        })

        search = JSON.parse(JSON.stringify(search));

        search = search.map((item) => {
            return { 
                ...item,
                productImage: process.env.FILE_PATH + item.productImage
            };
        });

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
        const schema = Joi.object({
            productName : Joi.string().min(3).required(),
            productPrice : Joi.number().integer().min(500).required()
        })

        const { error } = schema.validate(req.body)
        if(error){
            return res.status(400).send({
                error : {
                    message : error.details[0].message
                }
            })
        }

        const data = req.body

        const findDuplicates = await products.findOne({
            where : {
                productName : data.productName
            }
        })

        if(findDuplicates !== null){
            return res.status(400).send({
                status : 'Failed',
                message : 'Product name is already exist!'
            })
        }

        let newProduct = await products.create({
            ...data,
            productImage : req.file.filename
        })

        newProduct = JSON.parse(JSON.stringify(newProduct))

        newProduct = {
            ...newProduct,
            productImage : process.env.FILE_PATH + newProduct.productImage
        }

        res.status(200).send({
            status : 'Success',
            data : {
                product : {
                    id : newProduct.id,
                    title : newProduct.productName,
                    price : newProduct.productPrice,
                    image : newProduct.productImage
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

        const findIndex = await products.findOne({
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

        const removeImage = (filePath) => {
            filePath = path.join(__dirname, '../../uploads/', filePath)
            fs.unlink(filePath, err => console.log(err))
        }
        removeImage(findIndex.productImage)

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
