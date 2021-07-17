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
    res.redirect('/notes');
})

router.post('/bookmarksDel', auth, async (req, res) => {

    var user = await User.findOne({email:req.user.email});
    for(var i=0; i<user.bookmarks.length; i++) {
    
        if(user.bookmarks[i]._id == req.body.Id) {
             user.bookmarks.splice(i, 1);
        }
    }
    await user.save();
    res.redirect('/notes');
})

module.exports = router;