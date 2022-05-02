const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections")
const artists = mongoCollections.artists;
const validate = require("./validation");
const searchFunctions = require("./search");

async function updateArtistRating(id){
    id = checkInput(id, "id", "string");
    if (!ObjectId.isValid(id)) throw `id is not a valid ObjectId`;

    const reviews = await searchFunctions.getReviews(id);
    let likes = 0;
    let dislikes = 0;
    reviews.forEach(element => {
        likes += element["likes"].length();
        dislikes += element["dislikes"].length();
    })
    let avgRating = Math.round(likes / dislikes);

    const artistCollection = await artists();
    const updatedRating = await artistCollection.updateOne(
        {_id: ObjectId(id)},
        {$set : {avgRating : avgRating}}
    )
    if (!updatedRating) throw `Error updating rating`;
    return {ratingUpdated : true};
    
}

async function getTopArtists(){
    if (arguments.length > 0) throw `Too many arguments passed.`
    const artistCollection = await artists();
    const artistList = await artistCollection.find({}, {projection: {_id:1, name: 1, avgRating: 1}}).toArray();
    //sort artistList based on likes
    let top3 = [];
    let highest = [0,0,0];
    //return top 3
    artistList.forEach(element => {
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

async function createArtist(name){
    if (arguments.length > 1) throw `Too many arguments passed.`
    name = validate.checkInput(name, "name", "string");

    const artistCollection = await artists();

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

module.exports = {getTopArtists, createArtist, getAllArtists, updateArtistRating};