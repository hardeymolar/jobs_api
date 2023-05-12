const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { UnauthenticatedError } = require('../errors')


const auth = async (req,res,next)=>{
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith('Bearer')){
            throw new UnauthenticatedError('authentication invalid')
        }
        const token = authHeader.split(' ')[1]
        try {
            const payload = jwt.verify(token,process.env.JWTSECRET)
            req.user = {userId:payload.userId,name:payload.username}
            next()
        } catch (error) {
            throw new UnauthenticatedError('authentication invalid')
        }

}

module.exports = auth