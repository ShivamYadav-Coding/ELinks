const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Str = require('@supercharge/strings');
const mail = require('../services/mail');
const { restart } = require('nodemon');

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

router.get('/register', (req, res) => {

    res.render('register', {formData: false, errors: false});
})

// Create a new user in our database
router.post("/register", async (req, res) => {
    try {

       const password = req.body.password;
       const confirmPassword = req.body.confirmPassword;
       const randomStr = Str.random(150);

       if(password === confirmPassword) {
           const newUser = new User({
            email: req.body.email,
            name: req.body.name,
            username: req.body.username,
            tempString: randomStr,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
           })


           await newUser.save()
           const link = `http://localhost:3000/verifyEmail/${randomStr}`;
           mail.verifyEmail(newUser.email, link);
           res.send("An email has been sent to your email Id for verification. Please click on that email to verify yourself.");
           
       }
       else {
        res.render('register', {formData: req.body, errors: {
            confirmPassword: 'Does not match with password.'
        }});
       }

    } catch (err) {
        console.log('=====================================================================\n')
        const errors = errorFormatter(err.message);
        console.log(errors);
        res.render('register', {formData: req.body, errors: errors});
        
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