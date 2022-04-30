const { Sequelize } = require('sequelize')
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')

module.exports={

    async index(req,res) {
        const users = await User.findAll()
        if(users.length <= 0)
            res.status(StatusCodes.OK).json({
                success: true,
                msg: 'users empty'
            })
        else
            res.status(StatusCodes.OK).json(users)
    },

    async store(req,res) {
        const { name,email,password } = req.body
        if( name && 
            email && 
            password)
        {
            const user = await User.findOne({where:{email}})
            if(user)
                return res.status(StatusCodes.OK).json({
                    success: false,
                    msg: 'email in database',
                    user
                })
            else{
                const newUser = await User.create({
                    name,
                    email,
                    password
                })
                return res.status(StatusCodes.OK).json({
                    success: true,
                    msg: 'success in store account',
                    newUser
                })
            }
        }
        return res.status(StatusCodes.BAD_REQUEST).json({
            success:false,
            msg: 'no body? please send name email password'
        })
    },

    async fromIndex(req,res){
        const { uid } = req.params
        if(!isNaN(uid)){
            const user = await User.findByPk(uid)
            if(user)
                return res.status(200).json({
                    success:true,
                    user
                })
            return res.status(403).json({
                success: false,
                msg: 'user not found'
            })
        }
        return res.status(400).json({
            success: false,
            msg: 'please send only numbers in uid'
        })
    },

    async auth(req,res){
        const { email , password } = req.body
        
        if(email && password){
            const user = await User.findOne({where:Sequelize.where(
                Sequelize.fn('lower',Sequelize.col('email')),
                Sequelize.fn('lower',email)
            )})
            if(user)
                if(user.password == password)
                    return res.status(200).json({
                        success : true,
                        auth : true,
                        user 
                    })
                else
                    return res.status(401).json({
                        success : false,
                        msg: 'incorrect password'
                    })
            return res.status(403).json({
                success : false,
                msg: 'not found user',
                params : {
                    email,
                    password
                }
            })
        }
        return res.status(400).json({
            success : false,
            msg: 'body not found, please send email and password',
        })
    }


}