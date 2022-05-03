const express = require('express');
const { ObjectId } = require("mongodb");

const router = express.Router();
const data = require('../data');
const artistsData = data.artists;
const albumData = data.albums;

router
  .route('/')
  .get(async (req, res) => {
    try {
      let topArtists = await artistsData.getTopArtists();
      let topAlbums = await albumData.getTopAlbums();
      let topSongs = await albumData.getTopSongs();

      let emptyArtist = (topArtists.length == 0);
      let emptyAlbum = (topAlbums.length == 0);
      let emptySong = (topSongs.length == 0);

      let val = {
          title: "Top Reviews",
          topArtists: topArtists,
          topAlbums: topAlbums,
          topSongs: topSongs,
          emptyArtist : emptyArtist,
          emptyAlbum : emptyAlbum,
          emptySong : emptySong
      }

      res.render('pages/topReviewed', val);
    } catch (e) {
      res.render('pages/error', {error: e, title: "Top Reviews"});
    }
  })

module.exports = router;