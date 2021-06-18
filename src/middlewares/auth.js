const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const auth = async (req, res, next) => {
    
    try {
        
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);

        const user = await User.findOne({_id:verifyUser._id});
        console.log(user.Full_name);

        req.token = token;
        req.user = user;

        next();
    } catch (error) {
        // res.status(401).send(error);
        res.redirect('/');
    }
}

module.exports = auth;