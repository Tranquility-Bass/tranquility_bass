const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections")
const artists = mongoCollections.artists;
const validate = require("./validation");

async function getTopArtists(){
    if (arguments.length > 0) throw `Too many arguments passed.`
    const artistCollection = await artists();
    const artistList = await artistCollection.find({}, {projection: {_id:1, name: 1, avgRating: 1}}).toArray();
    let top3 = [];
    let highest = [0,0,0];
    artistList.forEach(element => {
        if (element.avgRating > highest[0]){
            top3.splice(0, 0, element)
            highest.splice(0, 0, element.avgRating)
        }
        else if (element.avgRating > highest[1]) {
            top3.splice(1, 0, element)
            highest.splice(1, 0, element.avgRating)
        }
        else if (element.avgRating > highest[2]) {
            top3.splice(2, 0, element)
            highest.splice(2, 0, element.avgRating)
        }
    })
    return top3.splice(0,3);
}

async function create(name){
    if (arguments.length > 1) throw `Too many arguments passed.`
    name = validate.checkInput(name, "name", "string");

    name = name.toUpperCase();
    
    const artistCollection = await artists();
    const existing = await artistCollection.findOne({"name" : name});
    if (existing) throw `Artist already exists.`;

    let newArtist = {
      name: name,
      albums: [],
      reviews: [],
      discussions: [],
      avgRating: 0
    };

    const insertInfo = await artistCollection.insertOne(newArtist);
    if (insertInfo.insertedCount === 0) throw 'Could not add artist';

    const newId = insertInfo.insertedId.toString();

    const artist = await get(newId);
    return artist;
}

async function getAllArtists() {
    if (arguments.length > 0) throw `Too many arguments passed.`
    const artistCollection = await artists();
    const artistList = await artistCollection.find({}, {projection: {_id:1, name: 1}}).toArray();
    return artistList.sort(validate.sortBy("name"));
}

async function get(id) {
    if (arguments.length > 1) throw `Too many arguments passed.`
    id = validate.checkInput(id, "id",'string');
    if (!ObjectId.isValid(id)) throw `Artistid is not a valid ObjectId`;
    
    const artistCollection = await artists();
    const artist = await artistCollection.findOne({ _id: ObjectId(id) });
    if (!artist) throw 'No band with that id';

    artist._id = artist._id.toString();
    return artist;
}

module.exports = {getTopArtists, create, getAllArtists, get};