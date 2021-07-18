const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const User = require('../models/user.model');
const mail = require('../services/mail');
const jwt = require('jsonwebtoken');

const errorFormatter = e => {
    const errors = {}
    // "User validation failed: email: Email is required., name: Name is required., username: Path `username` is required., password: Password is required"
    const allErrors = e.substring(e.indexOf(':') + 1).trim();
    
    const allErrorsInArrayFormat = allErrors.split(',').map(ele => ele.trim());
    
    allErrorsInArrayFormat.forEach(err => {
        const [key, value] = err.split(':').map(ele => ele.trim());
        errors[key] = value;
    });

    return errors;
}

router.get('/', auth, (req, res) => {
    const arr = req.user.bookmarks.slice();
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
            mail.sendEmail(user.email, 'Reset password', 'A request has been made to reset password of your ELinks account. So, you can click on below link to reset your password, please note that this link is validated for only 15 minutes.', link, 'Reset Password');
            res.render('message', {
                message: {
                    heading: 'We have sent the reset link.',
                    paragraph: 'A reset link has been sent to your specified email Id. Please click on it to reset your password.  Also look for email in your spam folder.'
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
    try{
    const email = req.body.email;
    const password = req.body.password;
    const cpassword = req.body.confirmPassword;

    const user = await User.findOne({email});
    
    if(user) {
        if(password == cpassword) {
            user.password = password;
            await user.save();
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
} catch(err) {
    const errors = errorFormatter(err.message);
    res.render('resetPassword', {
        email: req.body.email,
        formData: req.body, 
        errors:{
            type: 'Password mismatch',
            message: errors.password
        }
    });
}
})

module.exports = router;