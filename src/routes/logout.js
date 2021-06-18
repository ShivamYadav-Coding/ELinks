const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');


router.get("/logout", auth, async(req, res) => {
    try {

        req.user.tokens = req.user.tokens.filter((curElement) => {
            return curElement.token != req.token;
        })

        res.clearCookie("jwt");

        await req.user.save();
        res.redirect("/");
    } catch (error) { 
        res.status(500).send(error);
    }
})

router.get('/logoutAll', auth, async (req, res) => {
    try {
        
        req.user.tokens = [];
        res.clearCookie("jwt");

        await req.user.save();
        res.redirect("/");
    } catch (error) { 
        res.status(500).send(error);
    }    
})

module.exports = router;