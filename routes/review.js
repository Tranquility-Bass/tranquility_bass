const express = require('express');
const { ObjectId } = require("mongodb");
const router = express.Router();
const data = require('../data');
const searchData = data.search;
const userData = data.users;
const xss = require('xss');

router
  .route('/like/:reviewId')
  .post(async (req, res) => {
	  try {
      if (typeof req.params.reviewId != 'string') throw 'Review ID must be a string';
      req.params.reviewId = (req.params.reviewId.trim());
      if (req.params.reviewId === "")throw 'Review ID must be a non empty string';
      if (!ObjectId.isValid(req.params.reviewId)) throw 'invalid review ID';
    } catch (e) {
      res.render('pages/error', {error: e, title: "Like Review", link: "/", link_text: "Back To Homepage"});
    }

    req.params.reviewId = xss(req.params.reviewId);

    try {
	  let user = await userData.userInfo(req.session.user.username);
      let updatedReview = await searchData.likeReview(req.params.reviewId, user._id.toString());
      res.redirect("/review/" + req.params.reviewId);
    } catch (e) {
      res.render('pages/error', {error: e, title: "Search Results"});
    }
  })

router
  .route('/dislike/:reviewId')
  .post(async (req, res) => {
	try {
		if (typeof req.params.reviewId != 'string') throw 'Review ID must be a string';
		req.params.reviewId = (req.params.reviewId.trim());
		if (req.params.reviewId === "")throw 'Review ID must be a non empty string';
		if (!ObjectId.isValid(req.params.reviewId)) throw 'invalid review ID';
	} catch (e) {
		res.render('pages/error', {error: e, title: "Like Review", link: "/", link_text: "Back To Homepage"});
	}

    req.params.reviewId = xss(req.params.reviewId);

    try {
	  let user = await userData.userInfo(req.session.user.username);
      let updatedReview = await searchData.dislikeReview(req.params.reviewId, user._id.toString());
      res.redirect("/review/" + req.params.reviewId);
    } catch (e) {
      res.render('pages/error', {error: e, title: "Search Results"});
    }
  })

module.exports = router;