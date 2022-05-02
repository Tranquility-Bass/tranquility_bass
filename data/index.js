const usersData = require('./users');
const artistsData = require('./artists');
const albumsData = require('./albums');
const validation = require('./validation');
const search = require('./search');

module.exports = {
  users: usersData,
  artists: artistsData,
  albums: albumsData,
  validation: validation,
  search: search
};