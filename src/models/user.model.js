require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
   name: {
       type: String,
       required: [true, 'Name is required.']
   },
   email: {
       type: String,
       unique: [true, 'This email is already in use.'],
       required: [true, 'Email is required.']
   },
   isVerified: { 
       type: Boolean, 
       default: false 
    },
   username: {
       type: String,
       required: [true, 'Username is required.'],
       unique: [true, 'Username is already taken.']
   },
   tempString: {
       type: String
   },
   password: {
       type: String,
       required: [true, 'Password is required.'],
       minlength: [8, 'Password must be of 8 characters.']
   },
   bookmarks: [{
       name: {
           type: String,
           trim: true
       },
       address: {
           type: String,
           trim: true
       }
   }],
   tokens:[{
       token: {
           type: String
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
    }
}

// Genrate new folder

// Hiding private data
userSchema.methods.hideData = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject._id;

    return userObject;
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