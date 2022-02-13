const { user } = require('../../models')

const Joi = require('joi')
const jwt = require('jsonwebtoken')

exports.register = async (req,res) => {

    const schema = Joi.object({
        fullName : Joi.string().min(3).required(),
        email : Joi.string().min(3).email().required(),
        password : Joi.string().min(6).required()
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

        const addUser = await user.create({
            fullName : req.body.fullName,
            email : req.body.email,
            password : req.body.password,
            role : 'Customer',
        })

        const token = jwt.sign({id : addUser.id}, process.env.TOKEN_KEY)

        res.status(200).send({
            status : 'Success',
            data : {
                user : {
                    fullName : addUser.fullName,
                    token
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

    const schema = Joi.object({
        email : Joi.string().min(3).email().required(),
        password : Joi.string().min(6).required()
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
        if(checkUser === null){
            return res.status(400).send({
                status : 'Failed',
                message : 'Login failed email is not registered'
            })
        }
        if(checkUser.password !== req.body.password){
            return res.status(400).send({
                status : 'Failed',
                message : 'Login failed wrong user credentials'
            })
        }

        const token = jwt.sign({id : checkUser.id}, process.env.TOKEN_KEY)

        res.status(201).send({
            status : 'Success',
            data : {
                user : {
                    fullName : checkUser.fullName,
                    email : checkUser.email,
                    token
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