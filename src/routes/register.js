const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser');

router.get('/register', (req, res) => {

    res.render('register');
})

// Create a new user in our database
router.post("/register", async (req, res) => {
    try {
        
       const password = req.body.password;
       const confirmPassword = req.body.confirmPassword;

       if(password === confirmPassword) {
           
           const newUser = new User({
            email: req.body.email,
            name: req.body.name,
            username: req.body.username,
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
           res.status(201).redirect("/home");
       }
       else {
           res.send("Passwords are not matching");
       }

    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router;