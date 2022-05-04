const express = require('express');

const router = express.Router();
const data = require('../data');
const moment = require('moment');
const userData = data.users;
const { userInfo } = require('../data/users');
const searchData = data.search;

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
        const ids = await searchData.getUpperInformation(req.params.id);
        let date = moment().format('L');

        let userID = await userData.userInfo(req.session.user.username);

        const review = await searchData.createReview(ids.artistId.toString(), ids.albumId, ids.songId, formData.reviewName, formData.reviewBody, date, userID._id.toString());
        res.redirect(`/all/${req.params.id}`);
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
  .post(async (req, res) => {
    let formData = req.body;
    if (!formData.discussionName) {
        let val = {
            title: "Create Discussion Post",
            hasError: true,
            error: "No title specified.",
            type : "discussion",
            id : req.params.id
        }
        res.status(400).render('pages/create', val);
        return;
    }
    if (!formData.discussionBody) {
        let val = {
            title: "Create Discussion Post",
            hasError: true,
            error: "No text given.",
            type : "discussion",
            id : req.params.id
        }
        res.status(400).render('pages/create', val);
        return;
    }

    try {
        const ids = await searchData.getUpperInformation(req.params.id);
        let date = moment().format('L');

        let userID = await userData.userInfo(req.session.user.username);

        const review = await searchData.createDiscussion(ids.artistId.toString(), ids.albumId, ids.songId, formData.discussionName, formData.discussionBody, date, userID._id.toString());
        res.redirect(`/all/${req.params.id}`);
    }
    catch (e) {
        res.render('pages/error', {error: e, title: "Create Discussion Post Failed", link: "/", link_text: "Back To Homepage"});
    }

  })

module.exports = router;