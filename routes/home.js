const express = require('express');

const router = express.Router();
const data = require('../data');
const searchData = data.search;
const artistData = data.artists;
const albumData = data.albums;
const { ObjectId } = require('mongodb');


router.get('/', async (req, res) => {
    
    if(req.session.user){
        const { username , password } = req.session.user;
        res.render('pages/homepage', {username: username});
    }else{
        res.render('pages/homepage');
    }

});

router.post('/', async (req, res) =>{
    
    const {searchTerm} = req.body;

    if(req.session.user){
        res.redirect('search/'+ searchTerm);
    }else{
        res.redirect('search/'+ searchTerm);
    }

});

router.get('/about', async (req, res) => {
    if(req.session.user){
        res.render('pages/about');
    }else{
        res.render('pages/about');
    }
});

router.get('/all/:searchId', async (req, res) => {
	try {
		if (typeof req.params.searchId != 'string') throw 'Search ID must be a string';
		req.params.searchId = req.params.searchId.trim();
		if (req.params.searchId === "")throw 'Search ID must be a non empty string';
		if (!ObjectId.isValid(req.params.searchId)) throw 'invalid search ID';
	} catch (e) {
		res.render('pages/error', {error: e, title: "Discussions and Reviews"});
	}
	try {
      let discussions = await searchData.getDiscussions(req.params.searchId);
	  let reviews = await searchData.getReviews(req.params.searchId);
	  let emptyDiscussions = discussions.length == 0;
      let emptyReviews = reviews.length == 0;

      let val = {
          title: "Discussions and Reviews",
          discussions: discussions,
          reviews: reviews,
          emptyDiscussions : emptyDiscussions,
          emptyReviews : emptyReviews,
          searchTerm: req.params.searchId
      }

      res.render('pages/search/all', val);
    } catch (e) {
      res.render('pages/error', {error: e, title: "Search Results"});
    }
});

router.get('/discuss/:discussionId', async (req, res) => {
	try {
		if (typeof req.params.discussionId != 'string') throw 'Discussion ID must be a string';
		req.params.discussionId = req.params.discussionId.trim();
		if (req.params.discussionId === "")throw 'Discussion ID must be a non empty string';
		if (!ObjectId.isValid(req.params.discussionId)) throw 'invalid discussion ID';
	} catch (e) {
		res.render('pages/error', {error: e, title: "Discussion"});
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
	  let emptyComments = discussion.comments.length == 0;

      let val = {
          title: discussion.title,
		  artist: artist.name,
		  album: album,
		  song: song,
          discussion: discussion.body,
		  date_posted: discussion.date_posted,
          emptyComments: emptyComments,
		  comments: discussion.comments
      }

      res.render('pages/search/discussions', val);
    } catch (e) {
      res.render('pages/error', {error: e, title: "Discussion"});
    }
});

router.get('/review/:reviewId', async (req, res) => {
	try {
		if (typeof req.params.reviewId != 'string') throw 'Review ID must be a string';
		req.params.reviewId = req.params.reviewId.trim();
		if (req.params.reviewId === "")throw 'Review ID must be a non empty string';
		if (!ObjectId.isValid(req.params.reviewId)) throw 'invalid review ID';
	} catch (e) {
		res.render('pages/error', {error: e, title: "Review"});
	}
	try {
      let review = await searchData.getReview(req.params.reviewId);
	  let artist = await artistData.get(review.artist_id.toString());
	  let album = null;
	  if (review.album_id) {
		  album = await albumData.get(review.album_id.toString());
		  album = album.title;
	  }
	  let song = null;
	  if (review.song_id) {
		  song = await albumData.getSong(review.song_id.toString());
		  song = song.title;
	  }

      let val = {
          title: review.title,
		  artist: artist.name,
		  album: album,
		  song: song,
          review: review.body,
		  date_posted: review.date_posted,
          likes: review.likes.length,
		  dislikes: review.dislikes.length
      }

      res.render('pages/search/reviews', val);
    } catch (e) {
      res.render('pages/error', {error: e, title: "Review"});
    }
});

module.exports = router;