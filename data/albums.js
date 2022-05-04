const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections")
const artists = mongoCollections.artists;
const songs = mongoCollections.songs;
const validate = require("./validation");

async function getSongsFromAlbum(albumId){
    if (arguments.length > 1) throw `Too many arguments passed.`;
    albumId = validate.checkInput(albumId, "album id", "string");
    if (!ObjectId.isValid(albumId)) throw `album id is not a valid ObjectId`;

    const artistCollection = await artists();
    const getAlbum = await artistCollection.findOne(
        {"albums._id": ObjectId(albumId)}
    );

    if (!getAlbum) throw `Album does not exist.`;

    let result;
    getAlbum.albums.forEach(element => {
        if (element._id.equals(ObjectId(albumId))) {
            result = element.songs;
        }
    })
    return result;
}

async function getSongId(albumId, title) {
    if (arguments.length > 2) throw `Too many arguments passed.`;
    albumId = validate.checkInput(albumId, "album id", "string");
    if (!ObjectId.isValid(albumId)) throw `album id is not a valid ObjectId`;
    title = validate.checkInput(title, "title", "string");

    const songs = await getSongsFromAlbum(albumId);

    let res;
    songs.forEach(element => {
        if (element.title == (title)) res = element._id;
    })
    return res;
}

async function getAllAlbumsFromArtist(artistId) {
    if (arguments.length > 1) throw `Too many arguments passed.`;
    artistId = validate.checkInput(artistId, "artist id", "string");
    if (!ObjectId.isValid(artistId)) throw `artist id is not a valid ObjectId`;
    
    const artistCollection = await artists();
    const getBand = await artistCollection.findOne(
        {_id: ObjectId(artistId)}
    );

    if (!getBand) throw `Artist does not exist.`;

    return getBand.albums;
}

async function getAllAlbums() {
    if (arguments.length > 0) throw `Too many arguments passed.`
    const artistCollection = await artists();
    const artistList = await artistCollection.find({}).toArray();

    let allAlbums = [];
	let temp;
    for (let x of artistList) {
        temp = await getAllAlbumsFromArtist(x._id.toString());
        allAlbums = allAlbums.concat(temp);
    }
    return allAlbums;
}

async function getAllSongs() {
    if (arguments.length > 0) throw `Too many arguments passed.`;

    let albums = await getAllAlbums();
    let allSongs = [];
    for (let x of albums){
        allSongs = allSongs.concat(x.songs);
    }

    return allSongs;
}

async function getTopAlbums(){ 
    if (arguments.length > 0) throw `Too many arguments passed.`;

    let albums = await getAllAlbums();
    let top3 = [];
    let highest = [0,0,0];
    albums.forEach(element => {
        if (element.avgRating > highest[0]){
            highest[0] = element.avgRating;
            top3[0] = element;
        }
        else if (element.avgRating > highest[1]) {
            highest[1] = element.avgRating;
            top3[1] = element;
        }
        else if (element.avgRating > highest[2]) {
            highest[2] = element.avgRating;
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
        if (element.avgRating > highest[0]){
            highest[0] = element.avgRating;
            top3[0] = element;
        }
        else if (element.avgRating > highest[1]) {
            highest[1] = element.avgRating;
            top3[1] = element;
        }
        else if (element.avgRating > highest[2]) {
            highest[2] = element.avgRating;
            top3[2] = element;
        }
    })
    return top3;
}

async function createSongs(songList) {
    if (arguments.length > 1) throw `Too many arguments passed.`
    songList = validate.checkInput(songList, "song list", "array");

    const songCollection = await songs();

    let temp = [];
    for (let i = 0; i<songList.length; i++){
        let val = {
            _id: ObjectId(),
            title : songList[i],
            reviews : [],
            discussions : [],
            avgRating : 0
        }

        const newSong = await songCollection.insertOne(val);
        if (!newSong) throw `Error inserting song`;
        temp.push(newSong.insertedId);
    }
   
    return temp;
}

async function createAlbum(artistId, title, songs) {
    if (arguments.length > 3) throw `Too many arguments passed.`
    artistId = validate.checkInput(artistId, "artist id", "string");
    if (!ObjectId.isValid(artistId)) throw `artist id is not a valid ObjectId`;
    title = validate.checkInput(title, 'title', 'string');
    songs = validate.checkInput(songs, 'songs','array');

    const artistCollection = await artists();
    const getArtist = await artistCollection.findOne({_id: ObjectId(artistId)});

    if (!getArtist) throw `artist does not exist.`;

    let newAlbum = {
      _id: ObjectId(),
      title: title,
      songs: songs,
      reviews : [],
      discussions : [],
      avgRating : 0
    };

    const insertInfo = await artistCollection.updateOne(
        {_id: ObjectId(artistId)},
        {$addToSet: {albums: newAlbum}}
    );
    if (insertInfo.modifiedCount === 0) throw 'Could not add album';

    newAlbum._id = newAlbum._id.toString();
    return newAlbum;
}

<<<<<<< HEAD
async function get(id) {
    if (arguments.length > 1) throw `Too many arguments passed.`
    id = validate.checkInput(id, "id",'string');
    if (!ObjectId.isValid(id)) throw `Albumid is not a valid ObjectId`;
    
    const artistCollection = await artists();
    const artist = await artistCollection.findOne({ albums._id: ObjectId(id) });
    if (!artist) throw 'No album with that id';
	for (let x of artist["albums"]){
		if(x["_id"].equals(ObjectId(id))) return x;
	}
	throw 'Find failed';
}

async function getSong(id) {
    if (arguments.length > 1) throw `Too many arguments passed.`
    id = validate.checkInput(id, "id",'string');
    if (!ObjectId.isValid(id)) throw `Songid is not a valid ObjectId`;
    
    const songsCollection = await songs();
    const song = await songsCollection.findOne({ _id: ObjectId(id) });
    if (!song) throw 'No song with that id';

    song._id = song._id.toString();
    return song;
}

module.exports = {getTopAlbums, getTopSongs, createAlbum, getAllAlbums, getAllSongs, getSongsFromAlbum, getSongId, get, getSong};

