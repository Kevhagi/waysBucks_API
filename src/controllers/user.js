const { user } = require('../../models')

exports.register = async (req,res) => {
    try {
        const addUser = await user.create(req.body)

        res.send({
            status : 'Success',
            data : {
                user : {
                    fullName : addUser.fullName,
                    token : addUser.token
                }
            }
        })
        
    } catch (error) {
        console.log(error);
        res.send({
            status : 'Failed',
            message : 'Server error'
        })
    }
}

exports.login = async (req,res) => {
    try {
        const { email, password } = req.body

        const getUser = await user.findAll({
            where : {
                email,
                password
            },
            attributes : {
                exclude : ['id', 'password', 'image',
                            'createdAt', 'updatedAt']
            }
        })

        res.send({
            status : 'Success',
            data : {
                user : getUser,
            }
        })
        
    } catch (error) {
        console.log(error);
        res.send({
            status : 'Failed',
            message : 'Server error'
        })
    }
}

exports.getUsers = async (req,res) => {
    try {
        const getUsers = await user.findAll({
            attributes : {
                exclude : [ 'password', 'token',
                            'updatedAt', 'createdAt']
            }
        })

        res.send({
            status : 'Success',
            data : {
                users : getUsers
            }
        })
        
    } catch (error) {
        console.log(error);
        res.send({
            status : 'Failed',
            message : 'Server error'
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const {id} = req.params

        await user.destroy({
            where : {
                id
            }
        })

        res.send({
            status : 'Success',
            data : {
                id
            }
        })

    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}