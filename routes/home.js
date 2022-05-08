const express = require('express');

const router = express.Router();
const data = require('../data');
const searchData = data.search;
const artistData = data.artists;
const albumData = data.albums;
const userData = data.users;
const { ObjectId } = require('mongodb');
const xss = require('xss');
const { reviews } = require('../config/mongoCollections');


router.get('/', async (req, res) => {
    
    if(req.session.user){
        const { username , password } = req.session.user;
        res.render('pages/homepage', {username: username});
    }else{
        res.render('pages/homepage');
    }

});

router.post('/', async (req, res) =>{
    
    let {searchTerm} = (req.body);

	searchTerm = xss(searchTerm);

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
		req.params.searchId = (req.params.searchId.trim());
		if (req.params.searchId === "")throw 'Search ID must be a non empty string';
		if (!ObjectId.isValid(req.params.searchId)) throw 'invalid search ID';
	} catch (e) {
		res.render('pages/error', {error: e, title: "Discussions and Reviews"});
	}
	try {
      let discussions = await searchData.getDiscussions(req.params.searchId);
	  let allreviews = await searchData.getReviews(req.params.searchId);
	  let reviews = [];
	  for (let i=0; i<allreviews.length; i++){
		if (allreviews[i].hidden == false) reviews.push(allreviews[i]);
	  }
	  let emptyDiscussions = discussions.length == 0;
      let emptyReviews = reviews.length == 0;
	  let isReviewed = false;
	  if (req.session.user){
		let user = await userData.userInfo(req.session.user.username);
		isReviewed = await searchData.isReviewed(req.params.searchId, user._id.toString());
	  }
	  let topic = await searchData.getById(req.params.searchId);
	  let artist;
	  let artistId;
	  let album;
	  let albumId;
	  let song;
	  let albums;
	  let songs;
	  let name;
	  if (topic["albums"]){
		artist = topic["name"];
		albums = [];
		for (let x of topic["albums"]){
			x["_id"] = x["_id"].toString();
			albums.push(x);
		}
		name = topic["name"];
	  } else if (topic["songs"]){
		album = topic["title"];
		artist = await albumData.getArtistFromAlbum(req.params.searchId);
		artistId = artist["_id"];
		artist = artist["name"];
		songs = [];
		for (let x of topic["songs"]){
			let s = await albumData.getSong(x);
			s["_id"] = s["_id"].toString();
			songs.push(s);
		}
		name = topic["title"];
	  } else {
		album = await albumData.getAlbumFromSong(req.params.searchId);
		artist = await albumData.getArtistFromAlbum(album["_id"]);
		albumId = album["_id"];
		album = album["title"];
		artistId = artist["_id"];
		artist = artist["name"];
		song = true;
		name = topic["title"];
	  }

      let val = {
          title: name + " Discussions and Reviews",
          discussions: discussions,
          reviews: reviews,
          emptyDiscussions : emptyDiscussions,
          emptyReviews : emptyReviews,
		  isReviewed: isReviewed,
          searchTerm: req.params.searchId,
		  artist: artist,
		  artistId: artistId,
		  album: album,
		  albumId: albumId,
		  albums: albums,
		  song: song,
		  songs: songs
      }

      res.render('pages/search/all', val);
    } catch (e) {
      res.render('pages/error', {error: e, title: "Search Results"});
    }
});

router.get('/discuss/:discussionId', async (req, res) => {
	try {
		if (typeof req.params.discussionId != 'string') throw 'Discussion ID must be a string';
		req.params.discussionId = (req.params.discussionId.trim());
		if (req.params.discussionId === "")throw 'Discussion ID must be a non empty string';
		if (!ObjectId.isValid(req.params.discussionId)) throw 'invalid discussion ID';
	} catch (e) {
		res.render('pages/error', {error: e, title: "Discussion"});
	}
	try {
      let discussion = await searchData.getDiscussion(req.params.discussionId);
	  let artist = await artistData.get(discussion.artist_id.toString());
	  let returnLink = discussion.artist_id.toString();
	  let album = null;
	  if (discussion.album_id) {
		  album = await albumData.get(discussion.album_id.toString());
		  album = album.title;
		  returnLink = discussion.album_id.toString();
	  }
	  let song = null;
	  if (discussion.song_id) {
		  song = await albumData.getSong(discussion.song_id.toString());
		  song = song.title;
		  returnLink = discussion.song_id.toString();
	  }
	  let emptyComments = discussion.comments.length == 0;

	  let arr = [];
	  for (let i=0; i<discussion.comments.length; i++){
		let username = await userData.usernameFromID(discussion.comments[i].user_id.toString());
		arr.push({username: username, comment: discussion.comments[i].comment});
	  }

      let val = {
          title: discussion.title,
		  artist: artist.name,
		  album: album,
		  song: song,
          discussion: discussion.body,
		  date_posted: discussion.date_posted,
          emptyComments: emptyComments,
		  comments: arr,
		  discussionId: req.params.discussionId,
		  link: returnLink
      }

      res.render('pages/search/discussions', val);
    } catch (e) {
      res.render('pages/error', {error: e, title: "Discussion"});
    }
});

router.get('/review/:reviewId', async (req, res) => {
	try {
		if (typeof req.params.reviewId != 'string') throw 'Review ID must be a string';
		req.params.reviewId = (req.params.reviewId.trim());
		if (req.params.reviewId === "")throw 'Review ID must be a non empty string';
		if (!ObjectId.isValid(req.params.reviewId)) throw 'invalid review ID';
	} catch (e) {
		res.render('pages/error', {error: e, title: "Review"});
	}
	try {
      let review = await searchData.getReview(req.params.reviewId);
	  let returnLink = review.artist_id.toString();
	  let artist = await artistData.get(review.artist_id.toString());
	  let album = null;
	  if (review.album_id) {
		  album = await albumData.get(review.album_id.toString());
		  album = album.title;
		  returnLink = review.album_id.toString();
	  }
	  let song = null;
	  if (review.song) {
		  song = await albumData.getSong(review.song.toString());
		  song = song.title;
		  returnLink = review.song.toString();
	  }
	  let liked = false;
	  let disliked = false;
	  if (req.session.user){
		let user = await userData.userInfo(req.session.user.username);
		liked = await searchData.isReviewLiked(req.params.reviewId, user._id.toString());
		disliked = await searchData.isReviewDisliked(req.params.reviewId, user._id.toString());
	  }

      let val = {
          title: review.title,
		  artist: artist.name,
		  album: album,
		  song: song,
          review: review.body,
		  date_posted: review.date_posted,
		  id: review._id.toString(),
          likes: review.likes.length,
		  dislikes: review.dislikes.length,
		  link: returnLink,
		  alreadyLiked: liked,
		  alreadyDisliked: disliked
      }

      res.render('pages/search/reviews', val);
    } catch (e) {
      res.render('pages/error', {error: e, title: "Review"});
    }
});

module.exports = router;