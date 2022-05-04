const express = require('express');

const router = express.Router();
const data = require('../data');


router.get('/', async (req, res) => {
    
    if(req.session.user){
        const { username , password } = req.session.user;
        res.render('pages/homepage', {username: username});
    }else{
        res.render('pages/homepage');
    }

});

router.get('/about', async (req, res) => {
    if(req.session.user){
        res.render('pages/about');
    }else{
        res.render('pages/about');
    }
});

module.exports = router;