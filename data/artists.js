const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections")
const artists = mongoCollections.artists;

async function getTopArtists(){
    if (arguments.length > 0) throw `Too many arguments passed.`
    const artistCollection = await artists();
    const artistList = await artistCollection.find({}, {projection: {_id:1, name: 1, likes: 1}}).toArray();
    //sort artistList based on likes
    let top3 = [];
    let highest = [0,0,0];
    //return top 3
    artistList.forEach(element => {
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

module.exports = {getTopArtists};