const express = require('express');
const { ObjectId } = require("mongodb");

const router = express.Router();
const data = require('../data');
const artistsData = data.artists;
const albumData = data.albums;

router
  .route('/')
  .get(async (req, res) => {
    let topArtists = await artistsData.getTopArtists();
    let topAlbums = await albumData.getTopAlbums();
    let topSongs = await albumData.getTopSongs();

    let val = {
        title: "Top Reviews",
        topArtists: topArtists,
        topAlbums: topAlbums,
        topSongs: topSongs
    }

    res.render('pages/topReviewed', val);
  })

module.exports = router;