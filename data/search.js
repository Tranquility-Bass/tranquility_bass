const mongoCollections = require('../config/mongoCollections');
const artists = mongoCollections.artists;
const reviews = mongoCollections.reviews;
const forums = mongoCollections.forums;
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');

const createDiscussion = async function createDiscussion(artistId, albumId, songId, title, body, datePosted, userId){
	if (arguments.length != 7) throw 'Must input seven values';
	if (typeof artistId != 'string' || typeof title != 'string' || typeof body != 'string' || typeof userId != 'string' || typeof datePosted != 'string') throw 'Artist ID, title, body, user ID, and date posted must be strings';
	artistId = artistId.trim();
	title = title.trim();
	body = body.trim();
	datePosted = datePosted.trim();
	userId = userId.trim();
	if (artistId === "" || title === "" || body === "" || userId === "" || datePosted === "") throw 'Artist ID, title, body, user ID, and date posted must be non empty strings';
	if (!ObjectId.isValid(artistId)) throw 'invalid artist ID';
	if (!ObjectId.isValid(userId)) throw 'invalid user ID';
	if (albumId != null){
		if (typeof albumId != 'string') throw 'Album ID must be null or a string';
		albumId = albumId.trim();
		if (albumId === "") throw 'Album ID must be a non empty string';
		if (!ObjectId.isValid(albumId)) throw 'invalid album ID';
		albumId = ObjectId(albumId);
		if (songId != null){
			if (typeof songId != 'string') throw 'Song ID must be null or a string';
			songId = songId.trim();
			if (songId === "") throw 'Song ID must be a non empty string';
			if (!ObjectId.isValid(songId)) throw 'invalid song ID';
			songId = ObjectId(songId);
		}
	}
	for (let i = 0; i < datePosted.length; i++) {
		if (i == 2 || i == 5) {
			if (datePosted.charAt(i) != '/') throw 'Date posted must be a valid date string';
		}
		else if (parseInt(datePosted.charAt(i)) === NaN) throw 'Date posted must be a valid date string';
	}
	let month = parseInt(datePosted.substring(0, 2));
	let day = parseInt(datePosted.substring(3, 5));
	let year = parseInt(datePosted.substring(6));
	if (year < 1900 || year > 2023) throw 'Date posted must be a valid date';
	if (month < 1 || month > 12) throw 'Date posted must be a valid date';
	if (day < 1 || day > 31) throw 'Date posted must be a valid date';
	if (day == 31 && (month == 4 || month == 6 || month == 9 || month == 11)) throw 'Date posted must be a valid date';
	if (day > 29 && month == 2) throw 'Date posted must be a valid date';
	if (day == 29 && (year%4 != 0 || year%100 == 0)) throw 'Date posted must be a valid date';
	const forumsCollection = await forums();
	let newDiscussion = {
		_id: ObjectId(),
		artist_id: ObjectId(artistId),
		album_id: albumId,
		song_id: songId,
		title: title,
		body: body,
		date_posted: datePosted,
		user_id: ObjectId(userId),
		comments: []
	};
	const insertInfo = await forumsCollection.insert(newDiscussion);
	if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add discussion';
	const artistsCollection = await artists();
	if (album_id != null){
		if (song_id != null){
			await artistsCollection.updateOne({ "albums.songs._id": songId }, { "$push": {"albums.songs.discussions": newDiscussion["_id"]} });
		} else {
			await artistsCollection.updateOne({ "albums._id": albumId }, { "$push": {"albums.discussions": newDiscussion["_id"]} });
		}
	} else {
		await artistsCollection.updateOne({ "_id": artistId }, { "$push": {"discussions": newDiscussion["_id"]} });
	}
	const usersCollection = await users();
	await usersCollection.updateOne({ "_id" : ObjectId(userId)}, {$push: { "discForumPosts": newDiscussion["_id"] }});
	newDiscussion["_id"] = newDiscussion["_id"].toString();
	return newDiscussion;
}

const createReview = async function createReview(artistId, albumId, songId, title, body, datePosted, userId){
	if (arguments.length != 7) throw 'Must input seven values';
	if (typeof artistId != 'string' || typeof title != 'string' || typeof body != 'string' || typeof userId != 'string' || typeof datePosted != 'string') throw 'Artist ID, title, body, user ID, and date posted must be strings';
	artistId = artistId.trim();
	title = title.trim();
	body = body.trim();
	datePosted = datePosted.trim();
	userId = userId.trim();
	if (artistId === "" || title === "" || body === "" || userId === "" || datePosted === "") throw 'Artist ID, title, body, user ID, and date posted must be non empty strings';
	if (!ObjectId.isValid(artistId)) throw 'invalid artist ID';
	if (!ObjectId.isValid(userId)) throw 'invalid user ID';
	if (albumId != null){
		if (typeof albumId != 'string') throw 'Album ID must be null or a string';
		albumId = albumId.trim();
		if (albumId === "") throw 'Album ID must be a non empty string';
		if (!ObjectId.isValid(albumId)) throw 'invalid album ID';
		albumId = ObjectId(albumId);
		if (songId != null){
			if (typeof songId != 'string') throw 'Song ID must be null or a string';
			songId = songId.trim();
			if (songId === "") throw 'Song ID must be a non empty string';
			if (!ObjectId.isValid(songId)) throw 'invalid song ID';
			songId = ObjectId(songId);
		}
	}
	for (let i = 0; i < datePosted.length; i++) {
		if (i == 2 || i == 5) {
			if (datePosted.charAt(i) != '/') throw 'Date posted must be a valid date string';
		}
		else if (parseInt(datePosted.charAt(i)) === NaN) throw 'Date posted must be a valid date string';
	}
	let month = parseInt(datePosted.substring(0, 2));
	let day = parseInt(datePosted.substring(3, 5));
	let year = parseInt(datePosted.substring(6));
	if (year < 1900 || year > 2023) throw 'Date posted must be a valid date';
	if (month < 1 || month > 12) throw 'Date posted must be a valid date';
	if (day < 1 || day > 31) throw 'Date posted must be a valid date';
	if (day == 31 && (month == 4 || month == 6 || month == 9 || month == 11)) throw 'Date posted must be a valid date';
	if (day > 29 && month == 2) throw 'Date posted must be a valid date';
	if (day == 29 && (year%4 != 0 || year%100 == 0)) throw 'Date posted must be a valid date';
	const reviewsCollection = await reviews();
	let newReview = {
		_id: ObjectId(),
		artist_id: ObjectId(artistId),
		album_id: albumId,
		song_id: songId,
		title: title,
		body: body,
		date_posted: datePosted,
		user_id: ObjectId(userId),
		likes: [],
		dislikes: [],
		hidden: false
	};
	const insertInfo = await reviewsCollection.insert(newReview);
	if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add review';
	const artistsCollection = await artists();
	if (album_id != null){
		if (song_id != null){
			await artistsCollection.updateOne({ "albums.songs._id": songId }, { "$push": {"albums.songs.reviews": newReview["_id"]} });
		} else {
			await artistsCollection.updateOne({ "albums._id": albumId }, { "$push": {"albums.reviews": newReview["_id"]} });
		}
	} else {
		await artistsCollection.updateOne({ "_id": artistId }, { "$push": {"reviews": newReview["_id"]} });
	}
	const usersCollection = await users();
	await usersCollection.updateOne({ "_id" : ObjectId(userId)}, {$push: { "reviewPosts": newReview["_id"] }});
	newReview["_id"] = newReview["_id"].toString();
	return newReview;
}

const getSearchResult = async function getSearchResult(searchTerm){
	if (typeof searchTerm != 'string') throw 'Search term must be a string';
	searchTerm = searchTerm.trim();
	if (searchTerm === "")throw 'Search term must be a non empty string';
	const artistsCollection = await artists();
	let results = [null, null, null];
	results[0] = await artistsCollection.find({ "name": {$regex: searchTerm, $options: "i"} });
	results[1] = await artistsCollection.find({ "albums": {"albumTitle": {$regex: searchTerm, $options: "i"}} });
	results[2] = await artistsCollection.find({ "albums": {"songs": {$regex: searchTerm, $options: "i"}} });
	let result = [];
	for (let x of results[1]){
		for (let y of x["albums"]){
			if (y["albumTitle"].toLowerCase().includes(searchTerm.toLowerCase())){
				result.push(y);
			}
		}
	}
	results[1] = result.slice(0);
	result = [];
	for (let x of results[2]){
		for (let y of x["albums"]){
			for (let z of y["songs"]){
				if (z["songTitle"].toLowerCase().includes(searchTerm.toLowerCase())){
					result.push(z);
				}
			}
		}
	}
	results[2] = result.slice(0);
	return results;
}

const getById = async function getById(searchId){
	if (typeof searchId != 'string') throw 'Search ID must be a string';
	searchId = searchId.trim();
	if (searchId === "")throw 'Search ID must be a non empty string';
	if (!ObjectId.isValid(searchId)) throw 'Search ID must be a valid object ID';
	let artistsCollection = await artists();
	let result = await artistsCollection.findOne({ "_id": ObjectId(searchId) });
	if (result == null){
		result = await artistsCollection.findOne({ "albums._id": ObjectId(searchId) });
		if (result == null){
			result = await artistsCollection.findOne({ "albums.songs._id": ObjectId(searchId) });
			if (result == null) throw 'No discussions found with that ID';
			else {
				for (let x of result["albums"]) {
					for (let y of x["songs"]) {
						if (y["_id"] === ObjectId(searchId)) return y;
					}
				}
			}
		} else {
			for (let x of result["albums"]) {
				if (x["_id"] === ObjectId(searchId)) return x;
			}
		}
	}
	return result;

}

const getDiscussions = async function getDiscussions(searchId){
	if (typeof searchId != 'string') throw 'Search ID must be a string';
	searchId = searchId.trim();
	if (searchId === "")throw 'Search ID must be a non empty string';
	if (!ObjectId.isValid(searchId)) throw 'Search ID must be a valid object ID';
	let result = await getById(searchId);
	let forumsCollection = await forums();
	let discussions = [];
	let temp;
	for (let x of result["discussions"]){
		temp = await reviewsCollection.findOne({ "_id": ObjectId(x) });
		if (temp == null) throw "No discussions found with that ID";
		discussions.push(temp);
	}
	return discussions;
}

const getReviews = async function getReviews(searchId){
	if (typeof searchId != 'string') throw 'Search ID must be a string';
	searchId = searchId.trim();
	if (searchId === "")throw 'Search ID must be a non empty string';
	if (!ObjectId.isValid(searchId)) throw 'Search ID must be a valid object ID';
	let result = await getById(searchId);
	let reviewsCollection = await reviews();
	let allReviews = [];
	let temp;
	for (let x of result["reviews"]){
		temp = await reviewsCollection.findOne({ "_id": ObjectId(x) });
		if (temp == null) throw "No reviews found with that ID";
		allReviews.push(temp);
	}
	return allReviews;
}

/*const remove = async function remove(albumId){
	if (typeof albumId != 'string') throw 'Album ID must be a string';
	albumId = albumId.trim();
	if (albumId === "")throw 'Album ID must be a non empty string';
	if (!ObjectId.isValid(albumId)) throw 'Album ID must be a valid object ID';
	const bandCollection = await bands();
	let band = await bandCollection.findOne({ "albums._id": ObjectId(albumId) });
	const updateInfo = await bandCollection.updateOne({ _id: band["_id"]}, {$pull: {albums: {_id: ObjectId(albumId)}}});
	if (updateInfo.modifiedCount === 0) throw `Could not delete album with id of ${albumId}`;
	band = await bandCollection.findOne({ _id: band["_id"] });
	let total = 0;
	for (let x of band["albums"]){
		total = total + x["rating"];
	}
	await bandCollection.updateOne({ _id : band["_id"]}, {$set: { overallRating: Math.round((total/band["albums"].length) * 10) / 10}});
	band["_id"] = band["_id"].toString();
	return band;
}*/

module.exports = {
	createDiscussion,
	createReview,
	getSearchResult,
	getById,
	getDiscussions,
	getReviews
}