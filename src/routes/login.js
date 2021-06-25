const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {

    res.render('login');
})

router.post('/', async (req, res) => {
  try {
      const email = req.body.email;
      const password = req.body.password;

      const user = await User.findOne({email: email});

      if(!user) {
          return res.send("Invalid login details");
      }

      if(user.isVerified == false) {
          return res.send("Your email has not been verified yet, so please verify your email by clicking on verification link i.e., sent to your emial.")
      }

      const isMatch = await bcrypt.compare(password, user.password);
    
      if(isMatch) {

        const token = await user.generateAuthToken();

        // res.cookie(name, value, [options]);
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 300000), // expires in 1800000 second i.e., 30 minutes
            httpOnly:true // For only server side change in cookies data
            // secure: true // for having cookies only on https
        });
        
        res.status(201).redirect("/home");
      }
      else {
          res.send("Invalid login details");
      }

  } catch (error) {
      res.status(400).send(error);
  }
})

module.exports = router;