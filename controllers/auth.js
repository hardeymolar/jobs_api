const mongoose = require('mongoose')
const user = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')

const register = async (req, res) => {
      const User = await user.create({...req.body});
      const token = User.createJwt()
      res.status(StatusCodes.CREATED).json({username:User.name, token});
  };
  
const login = async (req,res)=>{
    const {email,password} = req.body

    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }
    const User = await user.findOne({email})
    if(!User){
        throw new UnauthenticatedError('invalid credentials')
    }
    const isPasswordCorrect = await User.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('invalid password')
    }
    const token = User.createJwt()
    res.status(StatusCodes.OK).json({user:{name:User.name}, token})
}


module.exports = {register,login}