const express = require('express');

const router = express.Router();
const data = require('../data');
const searchData = data.search;
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
          emptyReviews : emptyReviews
      }

      res.render('pages/search/all', val);
    } catch (e) {
      res.render('pages/error', {error: e, title: "Search Results"});
    }
});

module.exports = router;