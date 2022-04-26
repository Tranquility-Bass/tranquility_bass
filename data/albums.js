const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections")
const artists = mongoCollections.artists;
const validate = require("./validation");

async function getAllAlbumsFromArtist(bandId) {
    if (arguments.length > 1) throw `Too many arguments passed.`;
    bandId = validate.checkInput(bandId, "band id", "string");
    if (!ObjectId.isValid(bandId)) throw `band id is not a valid ObjectId`;
    
    const bandCollection = await bands();
    const getBand = await bandCollection.findOne(
        {_id: ObjectId(bandId)}
    );

    if (!getBand) throw `Band does not exist.`;

    return getBand.albums;
}

async function getAllAlbums() {
    if (arguments.length > 0) throw `Too many arguments passed.`
    const artistCollection = await artists();
    const artistList = await artistCollection.find({}, {projection: {_id:1}}).toArray();

    let allAlbums = [];
    artistList.forEach(element => {
        allAlbums +=  await getAllAlbumsFromArtist(element._id);
    })

    return allAlbums;
}

async function getAllSongs() {
    if (arguments.length > 0) throw `Too many arguments passed.`;

    let albums = await getAllAlbums();
    let allSongs = [];
    albums.forEach(element => {
        allSongs += element.songs;
    })

    return allSongs;
}

async function getTopAlbums(){ 
    if (arguments.length > 0) throw `Too many arguments passed.`;

    let albums = await getAllAlbums();
    let top3 = [];
    let highest = [0,0,0];
    albums.forEach(element => {
        if (element.likes > highest[0]){
            highest[0] = element.likes;
            top3[0] = element;
        }
        else if (element.likes > highest[1]) {
            highest[1] = element.likes;
            top3[1] = element;
        }
        else if (element.likes > highest[2]) {
            highest[2] = element.likes;
            top3[2] = element;
        }
    })

    return top3;
}

async function getTopSongs(){ 
    if (arguments.length > 0) throw `Too many arguments passed.`;

    let songs = await getAllSongs();
    
    let top3 = [];
    let highest = [0,0,0];

    songs.forEach(element => {
        if (element.likes > highest[0]){
            highest[0] = element.likes;
            top3[0] = element;
        }
        else if (element.likes > highest[1]) {
            highest[1] = element.likes;
            top3[1] = element;
        }
        else if (element.likes > highest[2]) {
            highest[2] = element.likes;
            top3[2] = element;
        }
    })
    return top3;
}

async function createAlbum(artistId, title, songs) {
    if (arguments.length > 3) throw `Too many arguments passed.`
    artistId = checkInput(artistId, "artist id", "string");
    if (!ObjectId.isValid(artistId)) throw `artist id is not a valid ObjectId`;
    title = checkInput(title, 'title', 'string');
    songs = checkInput(songs, 'songs','array');

    let songList;
    songs.forEach(element => {
        let val = {
            _id: ObjectId(),
            title : element,
            reviews : [],
            discussions : [],
            avgRating : 0
        }
        songList += val;
    })

    const artistCollection = await artists();
    const getArtist = await artistCollection.findOne({_id: artistId});

    if (!getArtist) throw `Band does not exist.`;

    let newAlbum = {
      _id: ObjectId(),
      title: title,
      songs: songList,
      reviews : [],
      discussions : [],
      avgRating : 0
    };

    const insertInfo = await artistCollection.updateOne(
        {_id: artistId},
        {$addToSet: {albums: newAlbum}}
    );
    if (insertInfo.modifiedCount === 0) throw 'Could not add album';

    newAlbum._id = newAlbum._id.toString();
    return newAlbum;
}

module.exports = {getTopAlbums, getTopSongs, createAlbum};