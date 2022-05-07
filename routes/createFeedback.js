const express = require('express');

const router = express.Router();
const data = require('../data');
const moment = require('moment');
const userData = data.users;
const { userInfo } = require('../data/users');
const searchData = data.search;
const artistData = data.artists;
const albumData = data.albums;
const xss = require('xss');

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
    } else {
		try {
			let user = await userData.userInfo(req.session.user.username);
			let isReviewed = await searchData.isReviewed(req.params.id, user._id.toString());
			if (isReviewed) {
				return res.status(403).redirect('/all/' + req.params.id);
			}
		} catch (e) {
			res.render('pages/error', {error: e, title: "Create Review", link: "/", link_text: "Back To Homepage"});
		}
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

    formData.reviewName = xss(formData.reviewName);
    formData.reviewBody = xss(formData.reviewBody);

    try {
        const ids = await searchData.getUpperInformation(req.params.id);
        let date = moment().format('L');

        let userID = await userData.userInfo(req.session.user.username);

        const review = await searchData.createReview(ids.artistId.toString(), ids.albumId, ids.songId, formData.reviewName, formData.reviewBody, date, userID._id.toString());
        res.redirect(`/all/${req.params.id}`);
    }
    catch (e) {
        let val = {
            title: "Create Review",
            hasError: true,
            error: e,
            type : "review",
            id : req.params.id
        }
        res.status(400).render('pages/create', val);
        return;
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

    formData.discussionName = xss(formData.discussionName);
    formData.discussionBody = xss(formData.discussionBody);

    try {
        const ids = await searchData.getUpperInformation(req.params.id);
        let date = moment().format('L');

        let userID = await userData.userInfo(req.session.user.username);

        const review = await searchData.createDiscussion(ids.artistId.toString(), ids.albumId, ids.songId, formData.discussionName, formData.discussionBody, date, userID._id.toString());
        res.redirect(`/all/${req.params.id}`);
    }
    catch (e) {
        let val = {
            title: "Create Discussion",
            hasError: true,
            error: e,
            type : "discussion",
            id : req.params.id
        }
        res.status(400).render('pages/create', val);
        return;
    }

  })

  router
  .route('/comment/:discussionId')
  .get(async (req, res) => {
    try {
		if (typeof req.params.discussionId != 'string') throw 'Id must be a string';
		req.params.discussionId = req.params.discussionId.trim();
		if (req.params.discussionId === "")throw 'Id must be a non empty string';
	} catch (e) {
		res.render('pages/error', {error: e, title: "Comment on Discussion", link: "/", link_text: "Back To Homepage"});
	}

    if (!req.session.user) {
        return res.status(403).render('pages/account/login', {
            title: "Login",
            name: "Login",
            error: "You must be logged in to view this page.",
            route: "/private/create/review"
        });
    }

    try {
        let discussion = await searchData.getDiscussion(req.params.discussionId);
        let artist = await artistData.get(discussion.artist_id.toString());
        let album = null;
        if (discussion.album_id) {
            album = await albumData.get(discussion.album_id.toString());
            album = album.title;
        }
        let song = null;
        if (discussion.song_id) {
            song = await albumData.getSong(discussion.song_id.toString());
            song = song.title;
        }
  
        let val = {
            title: "Leave a Comment",
            discussionTitle: discussion.title,
            discussionBody: discussion.body,
            discussionId: req.params.discussionId
        }
  
        res.render('pages/comment', val);
      } catch (e) {
        res.render('pages/error', {error: e, title: "Leave a Comment"});
      }
  })
  .post(async (req, res) => {
    let formData = req.body;
    if (!formData.commentResponse) {
        let val = {
            title: "Post Comment",
            hasError: true,
            error: "No comment given.",
            discussionId: req.params.discussionId
        }
        res.status(400).render('pages/comment', val);
        return;
    }

    formData.commentResponse = xss(formData.commentResponse);

    try {
        let userID = await userData.userInfo(req.session.user.username);
        const comment = await searchData.createComment(req.params.discussionId, userID._id.toString(), formData.commentResponse);
        res.redirect(`/discuss/${req.params.discussionId}`);
    }
    catch (e) {
        let val = {
            title: "Post Comment",
            hasError: true,
            error: e,
            discussionId: req.params.discussionId
        }
        res.status(400).render('pages/comment', val);
        return;
    }

  })

module.exports = router;