const { user, transactions, products_order } = require('../../models')

exports.getTransactions = async (req,res) => {
    try {
        const data = await transactions.findAll({
            include : [
                {
                    model : user,
                    as : 'customer'
                },
                {
                    model : products_order,
                    as : 'products_order'
                }
            ]
        })

        res.status(200).send({
            status : 'Success',
            data
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

        await transactions.create(data)

        res.status(200).send({
            status : 'Success',
            data : {
                order : {
                    data
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