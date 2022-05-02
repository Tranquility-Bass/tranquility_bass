const express = require('express');
const { ObjectId } = require("mongodb");

const router = express.Router();
const data = require('../data');
const validate = data.validation;
const artistData = data.artists;
const albumData = data.albums;

router
  .route('/')
  .get(async (req, res) => {
    if (!req.session.loggedIn) {
        return res.status(403).render('pages/login', {
            title: "Login",
            name: "Login",
            error: "You must be logged in to view this page."
        });
    }
    
    let val = {
        title: "Add a Topic",
    }
    res.render('pages/addTopic/addTopicGeneral', val);
  })
  .post(async (req, res) => {
    let formData = req.body;
    if (!formData.type) {
        let val = {
            title: "Add a Topic",
            hasError: true,
            error: "No type specified. Select the topic type you would like to add."
        }
        res.status(400).render('pages/addTopic/addTopicGeneral', val);
        return;
    }

    try {
      let type = validate.checkInput(formData.type, "type", "string");

      if (type == "artist") res.render('pages/addTopic/addArtist', {title: "Add Artist"});

      const allArtists = await artistData.getAllArtists();
      if (type == "album") res.render('pages/addTopic/addAlbum', {title: "Add Album", artists: allArtists});

    } catch (e) {
        let val = {
            title: "Add a Topic",
            hasError: true,
            error: e
        }
        res.status(400).render('pages/addTopic/addTopicGeneral', val);
        return;
    }
    })

router
  .route("/artist")
  .post(async (req, res) => {
    let formData = req.body;
    if (!formData.artistName) {
        let val = {
            title: "Add Artist",
            hasError: true,
            error: "No artist entered."
        }
        res.status(400).render('pages/addTopic/addArtist', val);
        return;
    }

    try {
        let name = validate.checkInput(formData.name, "artist name", "string");
        const artist = await artistData.createArtist(name);

        if (artist) {
            let val = {
                title: "Topic Added!",
                isArtist : true,
                isAlbum : false,
                artist : artist,
                album : undefined
            }
            res.render("pages/addTopic/success", val);
        }
  
      } catch (e) {
          let val = {
              title: "Add Artist",
              hasError: true,
              error: e
          }
          res.status(400).render('pages/addTopic/addArtist', val);
          return;
      }
  })

router
  .route("/album")
  .post(async (req, res) => {
    let formData = req.body;
    if (!formData.artist) {
        let val = {
            title: "Add Album",
            hasError: true,
            error: "No artist selected."
        }
        res.status(400).render('pages/addTopic/addAlbum', val);
        return;
    }
    if (!formData.albumName) {
        let val = {
            title: "Add Album",
            hasError: true,
            error: "No album name entered."
        }
        res.status(400).render('pages/addTopic/addAlbum', val);
        return;
    }
    if (!formData.albumSongs) {
        let val = {
            title: "Add Album",
            hasError: true,
            error: "No songs entered."
        }
        res.status(400).render('pages/addTopic/addAlbum', val);
        return;
    }

    try {
        let artist = validate.checkInput(formData.artist, "artist name", "string");
        let album = validate.checkInput(formData.albumName, "album name", "string");
        let songList = validate.checkInput(formData.songList, "albumSongs", "array");

        const createdAlbum = await albumData.createAlbum(artist, album, songList);

        if (createdAlbum) {
            let val = {
                title: "Topic Added!",
                isArtist : false,
                isAlbum : true,
                artist : undefined,
                album : createdAlbum,
            }
            res.render("pages/addTopic/success", val);
        }
  
      } catch (e) {
          let val = {
              title: "Add Artist",
              hasError: true,
              error: e
          }
          res.status(400).render('pages/addTopic/addArtist', val);
          return;
      }
  })

module.exports = router;