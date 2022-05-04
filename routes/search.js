const express = require('express');
const { ObjectId } = require("mongodb");
const router = express.Router();
const data = require('../data');
const searchData = data.search;
const xss = require('xss');

router
  .route('/:searchTerm')
  .get(async (req, res) => {
    try {
      if (typeof req.params.searchTerm != 'string') throw 'Search term must be a string';
      req.params.searchTerm = req.params.searchTerm.trim();
      if (req.params.searchTerm === "")throw 'Search term must be a non empty string';
    } catch (e) {
      res.render('pages/error', {error: e, title: "Search Results", link: "/", link_text: "Back To Homepage"});
    }

    req.params.searchTerm = xss(req.params.searchTerm);

    try {
      let searchResults = await searchData.getSearchResult(req.params.searchTerm);
	  let emptyArtist = searchResults[0].length == 0;
      let emptyAlbum = searchResults[1].length == 0;
      let emptySong = searchResults[2].length == 0;

      let val = {
          title: "Search Results",
          resultArtists: searchResults[0],
          resultAlbums: searchResults[1],
          resultSongs: searchResults[2],
          emptyArtist : emptyArtist,
          emptyAlbum : emptyAlbum,
          emptySong : emptySong
      }

      res.render('pages/search/searchResults', val);
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