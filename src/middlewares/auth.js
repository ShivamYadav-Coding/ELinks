const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const auth = async (req, res, next) => {
    
    try {
        
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findOne({_id:verifyUser._id});

        req.token = token;
        user.hideData();
        req.user = user.hideData();       

        next();
    } catch (error) {
        // res.status(401).send(error);
        res.redirect('/login');
    }
}

module.exports = auth;