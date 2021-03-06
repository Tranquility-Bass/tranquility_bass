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

    const songsList = await getSongsFromAlbum(albumId);
    const songCollection = await songs();

    let res;
    for (let i = 0; i<songsList.length; i++){
        const getSong = await songCollection.findOne({_id: ObjectId(songsList[i])});
        if (getSong.title == title) res = getSong;
    }
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

    let songCollection = await songs();
    let songList = await songCollection.find({}).toArray();
    
    let top3 = [];
    let highest = [0,0,0];

    songList.forEach(element => {
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

async function deleteSongs(songList){
    if (arguments.length > 1) throw `Too many arguments passed.`
    songList = validate.checkInput(songList, "delete songs", "array");

    const songCollection = await songs();

    for (let i = 0; i<songList.length; i++){
        const delSong = await songCollection.deleteOne({"_id": ObjectId(songList[i])});
        if (!delSong) throw `Error deleting song`;
    }
    return;
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

    for (let i=0; i<getArtist.albums.length; i++){
        let temp_title = getArtist.albums[i].title;
        if (temp_title.toLowerCase() == title.toLowerCase()) throw `Album already exists.`;
    }

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

async function get(id) {
    if (arguments.length > 1) throw `Too many arguments passed.`
    id = validate.checkInput(id, "id",'string');
    if (!ObjectId.isValid(id)) throw `Albumid is not a valid ObjectId`;
    
    const artistCollection = await artists();
    const artist = await artistCollection.findOne({ "albums._id": ObjectId(id) });
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

async function getArtistFromAlbum(albumId){
	if (arguments.length > 1) throw `Too many arguments passed.`
    albumId = validate.checkInput(albumId, "id",'string');
    if (!ObjectId.isValid(albumId)) throw `Albumid is not a valid ObjectId`;
	const artistsCollection = await artists();
	let artist = await artistsCollection.findOne({ "albums._id": ObjectId(albumId) });
	if (!artist) throw 'No album found with that ID';
	artist["_id"] = artist["_id"].toString();
	return artist;
}

async function getAlbumFromSong(songId){
	if (arguments.length > 1) throw `Too many arguments passed.`
    songId = validate.checkInput(songId, "id",'string');
    if (!ObjectId.isValid(songId)) throw `Songid is not a valid ObjectId`;
	const artistsCollection = await artists();
	let album = await artistsCollection.findOne({ "albums.songs": songId });
	if (!album) throw 'No song found with that ID';
	for (let x of album["albums"]){
		if (x["songs"].includes(songId)){
			album = x;
			album["_id"] = album["_id"].toString();
			return album;
		}
	}
	throw 'No album found';
}

module.exports = {
    getTopAlbums,
    getTopSongs,
    createAlbum,
    getAllAlbums,
    getSongsFromAlbum,
    getSongId,
    deleteSongs,
    createSongs,
    get,
    getSong,
	getArtistFromAlbum,
	getAlbumFromSong};

