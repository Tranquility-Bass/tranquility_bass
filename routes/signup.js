const express = require('express');
const { ObjectId } = require("mongodb");
const data = require('../data');
const users = data.users;

const router = express.Router();

router.get('/', async (req, res) =>{

    if(req.session.user){
        res.redirect('/private');
    }else{
        res.render('pages/signup', {title: "Create An Account"});
    }

});

router.post('/', async (req, res) => {

    const { username, password, email } = req.body;

    if(!username || !password || !email){
        res.status(400).render('pages/signup', {title: "Login", error: "'username', 'password', and 'email' must be provided"});
    }

    try{

        let user = await users.createUser(username, password, email);
        if(user === undefined){
            res.status(400).render('pages/signup', {title: "Create an Account", error: "Could not create account"});
        }else{
            res.render('pages/login', {title: "Login", error: "Account Created! Proceed to Login"});
        }
    }catch(e){
        res.status(400).render('pages/signup', {title: "Create An Account", error: e});
    }
});

module.exports = router;