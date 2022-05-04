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
          emptyReviews : emptyReviews
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
		res.render('pages/error', {error: e, title: "Discussions and Reviews"});
	}
	try {
      let discussions = await searchData.getDiscussion(req.params.discussionId);
	  let artist = await artistData.get(req.params.discussions.artist_id);
	  let album = null;
	  if (req.params.discussions.album_id) {
		  album = await albumData.get(req.params.discussions.album_id);
		  album = album.title;
	  }
	  let song = null;
	  if (req.params.discussions.song_id) {
		  song = await albumData.getSong(req.params.discussions.song_id);
		  song = song.title;
	  }
	  let emptyComments = discussions.comments.length == 0;

      let val = {
          title: discussions.title,
		  artist: artist.name,
		  album: album,
		  song: song,
          discussion: discussions.body,
          emptyComments: emptyComments,
		  comments: discussion.comments
      }

      res.render('pages/search/discussions', val);
    } catch (e) {
      res.render('pages/error', {error: e, title: "Discussion"});
    }
});

module.exports = router;