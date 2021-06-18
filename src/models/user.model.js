require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
   name: {
       type: String,
       required: true
   },
   email: {
       type: String,
       unique: true,
       required: true
   },
   isVerified: { 
       type: Boolean, 
       default: false 
    },
   username: {
       type: String,
       unique: true,
       required: true
   },
   password: {
       type: String,
       required: true
   },
   tokens:[{
       token: {
           type: String,
           required: true
       }
   }]
});

// generating tokens
userSchema.methods.generateAuthToken = async function(req, res) {
    try {
      const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
      this.tokens = this.tokens.concat({token: token})
      await this.save();
      return token;
    }
    catch (error) {
        res.send("the error part " + error);
        console.log("the error part " + error);
    }
}

userSchema.pre('save', async function save(next) {

    try{
        if(!this.isModified('password')) return next();

        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;

        return next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model('User', userSchema);