const express = require('express');

const router = express.Router();
const data = require('../data');
const artistsData = data.artists;
const albumData = data.albums;

router
  .route('/review/:id')
  .get(async (req, res) => {
    try {
		if (typeof req.params.id != 'string') throw 'Id must be a string';
		req.params.id = req.params.id.trim();
		if (req.params.id === "")throw 'Id must be a non empty string';
	} catch (e) {
		res.render('pages/error', {error: e, title: "Create Review", link: "/", link_text: "Back To Homepage"});
	}

    if (!req.session.user) {
        return res.status(403).render('pages/account/login', {
            title: "Login",
            name: "Login",
            error: "You must be logged in to view this page.",
            route: "/private/create/review"
        });
    }
    let val = {
        title: "Create Review",
        hasError: false,
        type : "review",
        id : req.params.id
    }
    res.render('pages/create', val);
    return;
  })
  .post(async (req, res) => {
    let formData = req.body;
    if (!formData.reviewName) {
        let val = {
            title: "Create Review",
            hasError: true,
            error: "No title specified.",
            type : "review",
            id : req.params.id
        }
        res.status(400).render('pages/create', val);
        return;
    }
    if (!formData.reviewBody) {
        let val = {
            title: "Create Review",
            hasError: true,
            error: "No text given.",
            type : "review",
            id : req.params.id
        }
        res.status(400).render('pages/create', val);
        return;
    }

    try {
        let temp = 0;
    }
    catch (e) {
        res.render('pages/error', {error: e, title: "Create Review Failed", link: "/", link_text: "Back To Homepage"});
    }

  })

  router
  .route('/discussion/:id')
  .get(async (req, res) => {
    try {
		if (typeof req.params.id != 'string') throw 'Id must be a string';
		req.params.id = req.params.id.trim();
		if (req.params.id === "")throw 'Id must be a non empty string';
	} catch (e) {
		res.render('pages/error', {error: e, title: "Create Discussion", link: "/", link_text: "Back To Homepage"});
	}

    if (!req.session.user) {
        return res.status(403).render('pages/account/login', {
            title: "Login",
            name: "Login",
            error: "You must be logged in to view this page.",
            route: "/private/create/review"
        });
    }
    let val = {
        title: "Create Discussion Post",
        hasError: false,
        type : "discussion",
        id : req.params.id
    }
    res.render('pages/create', val);
    return;
  })

module.exports = router;