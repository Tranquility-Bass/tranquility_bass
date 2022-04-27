const usersData = require('./users');
const artistsData = require('./artists');
const albumsData = require('./albums');
const validation = require('./validation');

module.exports = {
  users: usersData,
  artists: artistsData,
  albums: albumsData,
  validation: validation
};