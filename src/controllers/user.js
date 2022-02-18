const { user } = require('../../models')

const Joi = require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const addUser = await user.create({
            fullName : req.body.fullName,
            email : req.body.email,
            password : hashedPassword,
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
        res.status(400).send({
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

        const isValid = await bcrypt.compare(req.body.password, checkUser.password)
        if(!isValid) {
            return res.status(400).send({
                status : 'Failed',
                message : 'Credentials Error'
            })
        }

        const token = jwt.sign(
            {
                id : checkUser.id,
                email : checkUser.email,
                fullName : checkUser.fullName,
                image : checkUser.image,
                role : checkUser.role
            }, process.env.TOKEN_KEY)

        res.status(200).send({
            status : 'Success',
            data : {
                user : {
                    fullName : checkUser.fullName,
                    email : checkUser.email,
                    role : checkUser.role,
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

exports.checkAuth = async (req, res) => {
    try {
      const id = req.user.id;
  
      const dataUser = await user.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      });
  
      if (!dataUser) {
        return res.status(404).send({
          status: "Auth not found",
        });
      }
  
      res.status(200).send({
        status: "Success",
        data: {
          user: {
            id: dataUser.id,
            name: dataUser.name,
            email: dataUser.email,
            role: dataUser.role
          },
        },
      });
    } catch (error) {
      console.log(error);
      res.status({
        status: "failed",
        message: "Server Error",
      });
    }
  };