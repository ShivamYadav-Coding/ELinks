const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const User = require('../models/user.model');
const mail = require('../services/mail');
const jwt = require('jsonwebtoken');
const { urlencoded } = require('express');

router.get('/home', auth, (req, res) => {
    const user = req.user;
    console.log(user);
    res.render('home', {
        name: user.email
    })
})

router.get('/forgotPassword', (req, res) => {
    res.render('forgotPassword');
})

router.post('/forgotPassword', async (req, res) => {
    const email = req.body.email;

    try {
        const user = await User.findOne({email});
        if(user) {
            const token = jwt.sign({_id:user._id.toString()}, process.env.SECRET_KEY, {
                expiresIn : 60*15 // will expires in 15 minutes
              });
            const link = `http://localhost:3000/resetPassword/${token}`;
            mail.verifyEmail(user.email, link);
            res.send('An email has been sent to your account for resetting your password.');
        }
        else {
            res.send("We don't have any user registered by this email.");
        }
    }

    catch(err) {
        res.send(err);
    }
})

router.get('/resetPassword/:token', (req, res) => {
    console.log('\n---------------------------------------------------------------------\n');
    const token = req.params.token;

    jwt.verify(token, process.env.SECRET_KEY, async function(err, decoded) {
        if (err) 
        {
            return res.send('Sorry some error occured!');
        }
        
        console.log(decoded);
        const userId = decoded._id;
        const user = await User.findOne({_id:userId});
        console.log(user);
        if(user) {
            res.render('resetPassword', {
                email: user.email
            });
        }
        else {
            res.send('Invalid request');
        }
      });
    
})

router.post('/resetPassword', async (req, res) => {
    const email = req.body.email;
    console.log(email)
    const password = req.body.password;
    console.log(password)
    const cpassword = req.body.confirmPassword;

    const user = await User.findOne({email});
    console.log(user.username)
    if(user) {
        if(password == cpassword) {
            user.password = password;
            user.save();
            console.log(`User password has been changed to ${user.password}`)
            console.log('Password has been changed');
            res.send('Your Password has been successfully changed');
        }
    }
    else {
        res.send('Sorry some error occured!');
    }
})

module.exports = router;


// const token = jwt.sign({_id:user._id.toString()}, process.env.SECRET_KEY);
//             console.log(token);
//             const userId = jwt.decode(token, process.env.SECRET_KEY);
//             console.log(`User ID is : ${userId._id} `);
//             const user2 = await User.findOne({_id:userId._id});
//             if(user2) {
//                 console.log(`User2 name is ${user.username}`);
//             }