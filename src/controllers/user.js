const { user } = require('../../models')

const { joi } = require('joi')

exports.register = async (req,res) => {

    const schema = joi.object({
        name : joi.string().min(3).required(),
        email : joi.string().min(3).email().required(),
        password : joi.string().min(6).required()
    })

    const { error } = schema.validate(req.body)
    if(error){
        return res.status(400).send({
            error : {
                message : error.details[0].message
            }
        })
    }

    try {
        const checkUser = await user.findOne({
            where : {
                email : req.body.email
            }
        })
        if(checkUser !== null){
            return res.status(400).send({
                status : 'Failed',
                message : 'Email is already registered'
            })
        }

        const addUser = await user.create(req.body)
        res.status(201).send({
            status : 'Success',
            data : {
                user : {
                    fullName : addUser.fullName,
                    token : 'kosong mint'
                }
            }
        })
    } catch (error) {
        console.log(error);
        res.send({
            status : 'Failed',
            message : 'Server Error'
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