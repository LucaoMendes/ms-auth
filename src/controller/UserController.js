const { Sequelize } = require('sequelize')
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')

module.exports={

    async index(req,res) {
        const users = await User.findAll()
        if(users.length <= 0)
            res.status(StatusCodes.NOT_FOUND).json({
                success: true,
                msg: 'No users to get'
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
            const emailRequire = Sequelize.where(
                Sequelize.fn('lower',Sequelize.col('email')),
                Sequelize.fn('lower',email)
            )
            const user = await User.findOrCreate({
                where : {
                    emailRequire,
                    name,
                    
                },
                
            })
            console.log(user[1])
        }
        res.status(StatusCodes.OK).json({})
    },

    async fromIndex(req,res){
        const { uid } = req.params
        if(!isNaN(uid)){
            const user = await User.findByPk(uid)
            if(user)
                return res.status(200).json({user})
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
                        success : true
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