const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.get('/home', auth, (req, res) => {
    const user = req.user;
    console.log(user);
    res.render('home', {
        name: user.email
    })
})

module.exports = router;