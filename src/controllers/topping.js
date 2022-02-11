const { toppings } = require('../../models')

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
        const findDuplicates = await toppings.findOne({
            where : {
                toppingName : req.body.toppingName
            }
        })
        if(findDuplicates !== null){
            return res.status(400).send({
                status : 'Failed',
                message : 'Nama produk tidak boleh sama!'
            })
        }

        const topping = await toppings.create({
            toppingName : req.body.toppingName,
            toppingPrice : req.body.toppingPrice,
            toppingImage : req.body.toppingImage
        })
        res.status(200).send({
            status : 'Success',
            data : {
                topping : {
                    id : topping.id,
                    toppingName : topping.toppingName,
                    toppingPrice : topping.toppingPrice,
                    toppingImage : topping.toppingImage
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
