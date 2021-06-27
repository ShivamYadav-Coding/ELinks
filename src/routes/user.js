const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const User = require('../models/user.model');
const mail = require('../services/mail');
const jwt = require('jsonwebtoken');

router.get('/home', auth, (req, res) => {
    const user = req.user;
    console.log(user);
    res.render('home', {
        name: user.email
    })
})

router.get('/forgotPassword', (req, res) => {
    res.render('forgotPassword', {
        formData: false,
        errors: false
    });
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
            res.render('message', {
                message: {
                    heading: 'We have sent the reset link.',
                    paragraph: 'A reset link has been sent to your specified email Id. Please click on it to reser your password.'
                }
            });
        }
        else {
            res.render('forgotPassword', {



                formData:req.body,
                errors:{
                type: 'Invalid Credentials',
                message: "We don't have any user with this email Id."
            }
        });
        }
    }

    catch(err) {
        res.render('SomethingWentWrong');
    }
})

router.get('/resetPassword/:token', (req, res) => {
    console.log('\n---------------------------------------------------------------------\n');
    const token = req.params.token;

    jwt.verify(token, process.env.SECRET_KEY, async function(err, decoded) {
        if (err) 
        {
            return res.render('somethingWentWrong');
        }
        
        console.log(decoded);
        const userId = decoded._id;
        const user = await User.findOne({_id:userId});
        console.log(user);
        if(user) {
            res.render('resetPassword', {
                email: user.email,
                formData: false,
                errors: false
            });
        }
        else {
            res.render('404');
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
            res.render('message', {
                message: {
                    heading: 'Password changed',
                    paragraph: 'Your password has been successfully changed.',
                    link: '/',
                    linkText: 'Got to login page.'
                }
            });
        }
        else {
            res.render('resetPassword', {
                email: email,
                formData: req.body, 
                errors:{
                    type: 'Password mismatch',
                    message: "Password and confirm password didn't match."
                }
            });
        }
    }
    else {
        res.render('somethingWentWrong');
    }
})

module.exports = router;