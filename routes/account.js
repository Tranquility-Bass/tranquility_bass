const express = require('express');
const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections")
const totalUsers = mongoCollections.users;
const data = require('../data');
const users = data.users;
const xss = require('xss');

const router = express.Router();

router.get('/login', async (req, res) => {

    if(req.session.user){
        res.redirect('pages/account/error', {title: "Error", error: "You are already logged In", link: "Link to Homepage when Created", link_text: "Back to Homepage"});
    }else{
        res.render('pages/account/login', {title: "Login"});
    }

});

router.post('/login', async (req, res) => {
    
    let { username, password, routeTo } = req.body;

    username = xss(username);
    password = xss(password);
    
    if(!username || !password){  
        res.status(400).render('pages/account/login', {title: "Login", error: "'username' and 'password' must be supplied"});
    }
    
    try{

        let user = await users.checkUser(username, password);
        if(user === undefined){
            res.status(400).render('pages/account/login', {title: "Login", error: "'username' and/or 'password' provided not valid"});
            return;
        }else{
            req.session.user = {username: username, password: password};
            //redirect to home page
            res.redirect("/");
        }
            
    }catch(e){
        res.status(400).render('pages/account/login', {title: "Login", error: e});
        return;
    }
    
});

router.get('/signup', async (req, res) =>{

    if(req.session.user){
        //Link Back to Homepage
        res.redirect('pages/account/error', {title: "Error", error: "You are already signed In", link: '/', link_text: "Back to Homepage"});
    }else{
        res.render('pages/account/signup', {title: "Create An Account"});
    }
    
});
    
router.post('/signup', async (req, res) => {
    
    let { username, password, email } = req.body;
    
    username = xss(username);
    password = xss(password);
    email = xss(email);

    if(!username || !password || !email){
        res.status(400).render('pages/account/signup', {title: "Login", error: "'username', 'password', and 'email' must be provided"});
    }
    
    try{
    
        let user = await users.createUser(username, password, email);
        if(user === undefined){
            res.status(400).render('pages/account/signup', {title: "Create an Account", error: "Could not create account"});
        }else{
            res.render('pages/account/login', {title: "Login", error: "Account Created! Proceed to Login"});
        }
    }catch(e){
        res.status(400).render('pages/account/signup', {title: "Create An Account", error: e});
    }
});

router.get('/profile', async (req, res) => {

    if(req.session.user){
        const { username, password } = req.session.user;

        const user = await users.userInfo(username);

        res.render('pages/account/profile', {title: "Account Information", username: username, password: password, email: user.email});

    }else{
        res.render('pages/account/error', {title: "Error", error: "You are not logged in!", link: '/account/login', link_text: "Click Here to Login"})
    }
});

router.get('/profile/edit', async (req, res) => {
    if(req.session.user){
        res.render('pages/account/edit', {title: "Edit Account Information"});
    }else{
        res.render('pages/account/error', {title: "Error", error: "You are not logged in!", link: '/account/login', link_text: "Click Here to Login"})
    }
});

router.post('/profile/edit', async (req, res) => {

    if(req.session.user){
        let {username, password} = req.session.user;
        let user = await users.userInfo(username);
        let {newUsername, newPassword, newEmail} = req.body;

        newUsername = xss(newUsername);
        newPassword = xss(newPassword);
        newEmail = xss(newEmail);

        if(!newUsername || !newPassword || !newEmail){
            res.render('pages/account/edit', {title: "Edit Account Information", error: "Fields Cannot Be Empty"});
        }

        try{
            user = await users.editUser(username, newUsername, newPassword, newEmail);
            res.render('pages/account/profile', {title: "Account Information", username: user.username, password: newPassword, email: user.email});
        }catch(e){
            res.render('pages/account/edit', {error: e});
        }

    }else{
        res.render('pages/account/error', {title: "Error", error: "You are not logged in!", link: '/account/login', link_text: "Click Here to Login"})
    }
});

router.get('/profile/delete', async (req, res) => {
    if(req.session.user){
        res.render('pages/account/delete', {title: "Delete Account"});
    }else{
        res.render('pages/account/error', {title: "Error", error: "You are not logged in!", link: '/account/login', link_text: "Click Here to Login"})
    }
});

router.post('/profile/delete', async (req, res) => {

    if(req.session.user){
        let {username, password} = req.session.user;
        try{
            let deleteMsg = await users.deleteUser(username);
            req.session.destroy();
            res.render('pages/account/error', {title: "Account Deleted", error: deleteMsg, link: '/', link_text: "Back To Homepage"});
        }catch(e){
            res.render('pages/account/edit', {error: e});
        }

    }else{
        res.render('pages/account/error', {title: "Error", error: "You are not logged in!", link: '/account/login', link_text: "Click Here to Login"})
    }
});


module.exports = router;