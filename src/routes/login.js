const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

router.get('/login', (req, res) => {

    res.render('login', {formData:false, errors: false});
})

router.post('/login', async (req, res) => {
  try {
      const email = req.body.email;
      const password = req.body.password;

      const user = await User.findOne({email: email});

      if(!user) {
          return res.render('login', {
            formData: req.body,
            errors:{
            type: 'Invalid Credentials',
            message: 'Invalid Credentials.'
        }});
      }

      if(user.isVerified == false) {
          return res.render('login',{
            formData: req.body,
            errors:{
            type: 'Account Unverified',
            message: 'Your email has not been verified yet. Please Check your Email for verification link!'
        }});
    }

      const isMatch = await bcrypt.compare(password, user.password);
    
      if(isMatch) {

        const token = await user.generateAuthToken();

        // res.cookie(name, value, [options]);
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 7*24*60*60000), // 1 second = 1000 mili second. therefore 1 minute = 60 seconds = 60000 milli seconds.
            // This will login user for 7 days
            httpOnly:true // For only server side change in cookies data
            // secure: true // for having cookies only on https
        });
        
        res.status(201).redirect("/");
      }
      else {
          res.render('login', {
            formData: req.body,
            errors:{
            type: 'Invalid Credentials',
            message: 'Invalid Credentials.'
        }})
      }

  } catch (error) {
      res.render('somethingWentWrong');
  }
})

module.exports = router;