const express = require('express');
const { ObjectId } = require("mongodb");
const data = require('../data');
const users = data.users;

const router = express.Router();

router.get('/', async (req, res) => {

        if(req.session.user){
            res.redirect('/private');
        }else{
            res.render('pages/login', {title: "Login"});
        }

    });

router.post('/', async (req, res) => {
    
        const { username, password } = req.body;
    
        if(!username || !password){  
            res.status(400).render('pages/login', {title: "Login", error: "'username' and 'password' must be supplied"});
        }
    
        try{

            let user = await users.checkUser(username, password);
            if(user === undefined){
                res.status(400).render('pages/login', {title: "Login", error: "'username' and/or 'password' provided not valid"});
                return;
            }else{
                req.session.user = {username: username, password: password};
                // Will redirect to home page when created
                res.redirect('/private');
            }
            
        }catch(e){
            res.status(400).render('pages/login', {title: "Login", error: e});
            return;
        }
    
    });

module.exports = router;