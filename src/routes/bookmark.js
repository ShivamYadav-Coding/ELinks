const router = require('express').Router();
const User = require("../models/user.model");

const auth = require('../middlewares/auth');

router.post('/bookmarks', auth, async (req, res) => {
    var bookmark = {
        name: req.body.bookmarkName,
        address: req.body.bookmarkUrl
    }
    const user = await User.findOne({email:req.user.email});
    user.bookmarks.push(bookmark);
    
    await user.save();
    console.log(user);
    res.send('adding')
})

module.exports = router;