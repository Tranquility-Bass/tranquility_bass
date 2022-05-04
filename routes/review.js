const express = require('express');
const { ObjectId } = require("mongodb");
const router = express.Router();
const data = require('../data');
const searchData = data.search;
const userData = data.user;

router
  .route('/:reviewId')
  .post(async (req, res) => {
	try {
		if (typeof req.params.reviewId != 'string') throw 'Review ID must be a string';
		req.params.reviewId = req.params.reviewId.trim();
		if (req.params.reviewId === "")throw 'Review ID must be a non empty string';
		if (!ObjectId.isValid(req.params.reviewId)) throw 'invalid review ID';
	} catch (e) {
		res.render('pages/error', {error: e, title: "Like Review", link: "/", link_text: "Back To Homepage"});
	}
    try {
	  let user = userData.userInfo(req.session.user);
      let updatedReview = searchData.likeReview(req.params.reviewId, user._id.toString());
      res.redirect("/review/:" + reviewId);
    } catch (e) {
      res.render('pages/error', {error: e, title: "Search Results"});
    }
  })

router
  .route('/')
  .get(async (req, res) => {
    res.render('pages/error', {error: "Search Field Cannot Be Empty", title: "Search Results", link: "/", link_text: "Back To Homepage"});
  })

module.exports = router;