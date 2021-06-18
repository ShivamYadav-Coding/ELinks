const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Str = require('@supercharge/strings');
const mail = require('../services/mail');

router.get('/register', (req, res) => {

    res.render('register');
})

// Create a new user in our database
router.post("/register", async (req, res) => {
    try {
        
       const password = req.body.password;
       const confirmPassword = req.body.confirmPassword;
       var randomStr;

       if(password === confirmPassword) {
           randomStr = Str.random(150);
           const newUser = new User({
            email: req.body.email,
            name: req.body.name,
            username: req.body.username,
            tempString: randomStr,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
           })

           const token = await newUser.generateAuthToken()
           
        // The res.cookie() function is used to set the cookie name to value.
        // The value parameter may be a string or object converted to JSON

        // res.cookie(name, value, [options]);
           res.cookie("jwt", token, {
               expires: new Date(Date.now() + 5000), // expires in 1800000 second i.e., 30 minutes
               httpOnly:true // For only server side change in cookies data
           });

           const registered = await newUser.save()
           const link = `http://localhost:3000/verifyEmail/${randomStr}`;
           mail.verifyEmail(newUser.email, link);
           res.status(201).redirect("/home");
       }
       else {
           res.send("Passwords are not matching");
       }

    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/verifyEmail/:str', async (req, res) => {
    const tempString = req.params.str;
    const user = await User.findOne({tempString});
    console.log('-----------------------------------------------------------------------');
    console.log(user);
    
    if(user) {
        user.isVerified = true;
        user.tempString = undefined;
        user.save().then(()=>{console.log('User Saved')}).catch(err => {console.log(err)});
        console.log(user.isVerified)
        res.send('You have been verified');
    }
    else {
        res.send('Invalid user');
    }
})

module.exports = router;