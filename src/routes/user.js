const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const User = require('../models/user.model');
const mail = require('../services/mail');
const jwt = require('jsonwebtoken');

router.get('/', auth, (req, res) => {
    const arr = req.user.bookmarks.slice();
    console.log(arr);
    res.render('home', {
        arr
    });
})

router.get('/about', (req, res) => {
    res.render('about');
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
            const link = `${process.env.baseAddress}/resetPassword/${token}`;
            mail.sendEmail(user.email, 'Reset password', 'A request has been made to reset password of your NoteYacht account. So, you can click on below link to reset your password.', link, 'Reset Password');
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
    const token = req.params.token;

    jwt.verify(token, process.env.SECRET_KEY, async function(err, decoded) {
        if (err) 
        {
            return res.render('message', {
                message: {
                    heading: 'Reset link expired',
                    paragraph: 'Looks like reset link for your password has been expired. Click on below button to generate new Link.',
                    link: '/forgotPassword',
                    linkText: 'Generate new link'
                }
            });
        }
        
        const userId = decoded._id;
        const user = await User.findOne({_id:userId});
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
    const password = req.body.password;
    const cpassword = req.body.confirmPassword;

    const user = await User.findOne({email});
    
    if(user) {
        if(password == cpassword) {
            user.password = password;
            user.save();
            res.render('message', {
                message: {
                    heading: 'Password changed',
                    paragraph: 'Your password has been successfully changed.',
                    link: '/login',
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