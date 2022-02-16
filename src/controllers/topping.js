const { toppings } = require('../../models')
const path = require('path')
const fs = require('fs')

exports.getToppings = async (req,res) => {
    try {
        const search = await toppings.findAll({
            attributes : {
                exclude : ['createdAt', 'updatedAt']
            }
        })

        res.send({
            status : 'Success',
            data : {
                toppings : search
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

exports.toppingDetail = async (req,res) => {
    try {
        const { id } = req.params
        const result = await toppings.findOne({
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
                topping : result
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

exports.addTopping = async (req,res) => {
    try {
        const data = req.body

        const findDuplicates = await toppings.findOne({
            where : {
                toppingName : data.toppingName
            }
        })

        if(findDuplicates !== null){
            return res.status(400).send({
                status : 'Failed',
                message : 'Nama topping tidak boleh sama!'
            })
        }

        let newTopping = await toppings.create({
            ...data,
            toppingImage : req.file.filename
        })

        newTopping = JSON.parse(JSON.stringify(newTopping))

        newTopping = {
            ...newTopping,
            toppingImage : process.env.FILE_PATH + newTopping.toppingImage
        }

        res.status(200).send({
            status : 'Success',
            data : {
                topping : {
                    id : newTopping.id,
                    title : newTopping.toppingName,
                    price : newTopping.toppingPrice,
                    image : newTopping.toppingImage
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

exports.editTopping = async (req,res) => {
    try {
        const { id } = req.params
        await toppings.update(req.body, {
            where : {
                id
            },
        })

        const result = await toppings.findOne({
            where : {
                id
            }
        })

        res.status(200).send({
            status : 'Success',
            data : {
                product : {
                    id,
                    toppingName : result.toppingName,
                    toppingPrice : result.toppingPrice,
                    toppingImage : result.toppingImage
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

exports.deleteTopping = async (req,res) => {
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

        const removeImage = (filePath) => {
            filePath = path.join(__dirname, '../../uploads/', filePath)
            fs.unlink(filePath, err => console.log(err))
        }
        removeImage(findIndex.productImage)

        await toppings.destroy({
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
