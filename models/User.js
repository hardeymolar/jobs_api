require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,'please provide name']
    },
    email:{
        type: String,
        required:[true,'please provide email'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'please provide valid email'],
        unique:true
    },
    password:{
        type: String,
        required:[true,'please provide password'],
    },
})

UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

UserSchema.methods.createJwt = function() {
    const token = jwt.sign(
      { userId: this._id,username:this.name },
      process.env.JWTSECRET,
      {expiresIn:process.env.JWTLIFETIME}
    );
    return token;
  };

UserSchema.methods.comparePassword = async function(providedPassword){
    const verifyPassword = bcrypt.compare(providedPassword,this.password)
    return verifyPassword
}

module.exports = mongoose.model('user',UserSchema)