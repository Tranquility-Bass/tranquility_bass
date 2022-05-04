const mongoCollections = require('../config/mongoCollections');
const artists = mongoCollections.artists;
const reviews = mongoCollections.reviews;
const forums = mongoCollections.forums;
const users = mongoCollections.users;
const albums = require("./albums");
const { ObjectId } = require('mongodb');
const validate = require('./validation');
const { songs } = require('../config/mongoCollections');

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
			if (!ObjectId.isValid(songId)) throw 'invalid album ID';
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
		song: songId,
		title: title,
		body: body,
		date_posted: datePosted,
		user_id: ObjectId(userId),
		comments: []
	};
	const insertInfo = await forumsCollection.insertOne(newDiscussion);
	if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add discussion';
	const artistsCollection = await artists();
	const songCollection = await songs();
	if (albumId != null){
		if (songId != null){
			await songCollection.updateOne({ "_id": songId }, { $push: {"discussions": newDiscussion["_id"]} });
		} else {
			await artistsCollection.updateOne({ "albums._id": albumId }, { $push: {"albums.$.discussions": newDiscussion["_id"]} });
		}
	} else {
		await artistsCollection.updateOne({ "_id": ObjectId(artistId) }, { $push: {"discussions": newDiscussion["_id"]} });
	}
	const usersCollection = await users();
	await usersCollection.updateOne({ "_id" : ObjectId(userId)}, {$push: { "discForumPosts": newDiscussion["_id"] }});
	newDiscussion["_id"] = newDiscussion["_id"].toString();
	return newDiscussion;
}

const createComment = async function createComment(discussionId, userId, body){
	if (arguments.length != 3) throw 'Must input three values';
	if (typeof discussionId != 'string' || typeof userId != 'string' || typeof body != 'string') throw 'Discussion ID, user ID, and body must be strings';
	discussionId = discussionId.trim();
	userId = userId.trim();
	body = body.trim();
	if (discussionId === "" || userId === "" || body === "") throw 'Discussion ID, user ID, and body must be non empty strings';
	if (!ObjectId.isValid(discussionId)) throw 'invalid discussion ID';
	if (!ObjectId.isValid(userId)) throw 'invalid user ID';
	const forumsCollection = await forums();
	let newDiscussion = {
		_id: ObjectId(),
		user_id: ObjectId(userId),
		comment: body
	};
	let updateInformation = await forumsCollection.updateOne({ "_id": ObjectId(discussionId) }, { $push: {"comments": newDiscussion} });
	if (updateInformation["modifiedCount"] != 1) throw 'Update failed';
	// Returning the updated discussion
	/*let updatedDiscussion = await forumsCollection.findOne({ "_id": ObjectId(discussionId) });
	updatedDiscussion["_id"] = updatedDiscussion["_id"].toString();
	return updatedDiscussion;*/
	// Returning new comment
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
			if (!ObjectId.isValid(songId)) throw 'invalid album ID';
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
		song: songId,
		title: title,
		body: body,
		date_posted: datePosted,
		user_id: ObjectId(userId),
		likes: [],
		dislikes: [],
		hidden: false
	};
	const insertInfo = await reviewsCollection.insertOne(newReview);
	if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add review';
	const artistsCollection = await artists();
	const songCollection = await songs();
	if (albumId != null){
		if (songId != null){
			await songCollection.updateOne({ "_id": songId }, { "$push": {"reviews": newReview["_id"]} });
		} else {
			await artistsCollection.updateOne({ "albums._id": albumId }, { "$push": {"albums.$.reviews": newReview["_id"]} });
		}
	} else {
		await artistsCollection.updateOne({ "_id": ObjectId(artistId) }, { "$push": {"reviews": newReview["_id"]} });
	}
	const usersCollection = await users();
	await usersCollection.updateOne({ "_id" : ObjectId(userId)}, {$push: { "reviewPosts": newReview["_id"] }});
	newReview["_id"] = newReview["_id"].toString();
	return newReview;
}

const isReviewLiked = async function isReviewLiked(reviewId, userId){
	if (arguments.length != 2) throw 'Must input two values';
	if (typeof reviewId != 'string' || typeof userId != 'string') throw 'Review ID and user ID must be strings';
	reviewId = reviewId.trim();
	userId = userId.trim();
	if (reviewId === "" || userId === "") throw 'Review ID and user ID must be non empty strings';
	if (!ObjectId.isValid(reviewId)) throw 'invalid review ID';
	if (!ObjectId.isValid(userId)) throw 'invalid user ID';
	const reviewsCollection = await reviews();
	let review = await reviewsCollection.findOne({ "_id": ObjectId(reviewId) });
	if (review == null) throw 'No review found with that ID';
	for (x of review["likes"]){
		if (x.equals(ObjectId(userId))) return true;
	}
	return false;
}

const isReviewDisliked = async function isReviewiked(reviewId, userId){
	if (arguments.length != 2) throw 'Must input two values';
	if (typeof reviewId != 'string' || typeof userId != 'string') throw 'Review ID and user ID must be strings';
	reviewId = reviewId.trim();
	userId = userId.trim();
	if (reviewId === "" || userId === "") throw 'Review ID and user ID must be non empty strings';
	if (!ObjectId.isValid(reviewId)) throw 'invalid review ID';
	if (!ObjectId.isValid(userId)) throw 'invalid user ID';
	const reviewsCollection = await reviews();
	let review = await reviewsCollection.findOne({ "_id": ObjectId(reviewId) });
	if (review == null) throw 'No review found with that ID';
	for (x of review["dislikes"]){
		if (x.equals(ObjectId(userId))) return true;
	}
	return false;
}

const likeReview = async function likeReview(reviewId, userId){
	if (arguments.length != 2) throw 'Must input two values';
	if (typeof reviewId != 'string' || typeof userId != 'string') throw 'Review ID and user ID must be strings';
	reviewId = reviewId.trim();
	userId = userId.trim();
	if (reviewId === "" || userId === "") throw 'Review ID and user ID must be non empty strings';
	if (!ObjectId.isValid(reviewId)) throw 'invalid review ID';
	if (!ObjectId.isValid(userId)) throw 'invalid user ID';
	if (await isReviewLiked(reviewId, userId)) throw 'Review is already liked by this user';
	const reviewsCollection = await reviews();
	let updateInformation;
	if (await isReviewDisliked(reviewId, userId)){
		updateInformation = await reviewsCollection.updateOne({ "_id": ObjectId(reviewId) }, { $pull: {"dislikes": ObjectId(userId)} });
		if (updateInformation["modifiedCount"] != 1) throw 'Update failed';
	}
	updateInformation = await reviewsCollection.updateOne({ "_id": ObjectId(reviewId) }, { $push: {"likes": ObjectId(userId)} });
	if (updateInformation["modifiedCount"] != 1) throw 'Update failed';
	let updatedReview = await reviewsCollection.findOne({ "_id": ObjectId(reviewId) });
	if (updatedReview == null) throw 'No review found with that ID';
	updatedReview["_id"] = updatedReview["_id"].toString();

	let artI, alI, songI;
	(updatedReview.artist_id) ? artI = updatedReview.artist_id.toString() : artI = null;
	(updatedReview.album_id) ? alI = updatedReview.album_id.toString() : alI = null;
	(updatedReview.song_id) ? songI = updatedReview.song_id.toString() : songI = null;
	await updateRating(artI, alI, songI);

	return updatedReview;
}

const dislikeReview = async function dislikeReview(reviewId, userId){
	if (arguments.length != 2) throw 'Must input two values';
	if (typeof reviewId != 'string' || typeof userId != 'string') throw 'Review ID and user ID must be strings';
	reviewId = reviewId.trim();
	userId = userId.trim();
	if (reviewId === "" || userId === "") throw 'Review ID and user ID must be non empty strings';
	if (!ObjectId.isValid(reviewId)) throw 'invalid review ID';
	if (!ObjectId.isValid(userId)) throw 'invalid user ID';
	if (await isReviewDisliked(reviewId, userId)) throw 'Review is already disliked by this user';
	const reviewsCollection = await reviews();
	let updateInformation;
	if (await isReviewLiked(reviewId, userId)){
		updateInformation = await reviewsCollection.updateOne({ "_id": ObjectId(reviewId) }, { $pull: {"likes": ObjectId(userId)} });
		if (updateInformation["modifiedCount"] != 1) throw 'Update failed';
	}
	updateInformation = await reviewsCollection.updateOne({ "_id": ObjectId(reviewId) }, { $push: {"dislikes": ObjectId(userId)} });
	if (updateInformation["modifiedCount"] != 1) throw 'Update failed';
	let updatedReview = await reviewsCollection.findOne({ "_id": ObjectId(reviewId) });
	if (updatedReview == null) throw 'No review found with that ID';
	updatedReview["_id"] = updatedReview["_id"].toString();
	
	let artI, alI, songI;
	(updatedReview.artist_id) ? artI = updatedReview.artist_id.toString() : artI = null;
	(updatedReview.album_id) ? alI = updatedReview.album_id.toString() : alI = null;
	(updatedReview.song_id) ? songI = updatedReview.song_id.toString() : songI = null;
	await updateRating(artI, alI, songI);

	return updatedReview;
}

const getSearchResult = async function getSearchResult(searchTerm){
	if (arguments.length != 1) throw 'Must input one value';
	if (typeof searchTerm != 'string') throw 'Search term must be a string';
	searchTerm = searchTerm.trim();
	if (searchTerm === "")throw 'Search term must be a non empty string';
	const artistsCollection = await artists();
	let results = [[],[],[]];
	let artistResults = await artistsCollection.find({ name: {$regex: searchTerm, $options: "i"} }).toArray();
	const allAlbums = await albums.getAllAlbums();
	let albumsResults = [];
	for (let x of allAlbums){
		if (x.title.toLowerCase().includes(searchTerm.toLowerCase())){
			albumsResults.push(x);
		}
	}
	const songsCollection = await songs();
	let songsResults = await songsCollection.find({ title: {$regex: searchTerm, $options: "i"} }).toArray();
	if (artistResults == null) results[0] = [];
	else results[0] = artistResults;
	//console.log(albumsResults);
	results[1] = albumsResults;
	results[2] = songsResults;
	/*let result = [];
	for (let x of albumsResults){
		for (let y of x["albums"]){
			if (y["title"].toLowerCase().includes(searchTerm.toLowerCase())){
				result.push(y);
			}
		}
	}
	results[1] = result.slice(0);
	result = [];
	for (let x of songsResults){
		for (let y of x["albums"]){
			for (let z of y["songs"]){
				if (z["title"].toLowerCase().includes(searchTerm.toLowerCase())){
					result.push(z);
				}
			}
		}
	}
	results[2] = result.slice(0);*/
	console.log(results);
	return results;
}

const getById = async function getById(searchId){
	if (arguments.length != 1) throw 'Must input one value';
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
						if (y["_id"].equals(ObjectId(searchId))) return y;
					}
				}
			}
		} else {
			for (let x of result["albums"]) {
				if (x["_id"].equals(ObjectId(searchId))) return x;
			}
		}
	}
	return result;

}

const getDiscussions = async function getDiscussions(searchId){
	if (arguments.length != 1) throw 'Must input one value';
	if (typeof searchId != 'string') throw 'Search ID must be a string';
	searchId = searchId.trim();
	if (searchId === "")throw 'Search ID must be a non empty string';
	if (!ObjectId.isValid(searchId)) throw 'Search ID must be a valid object ID';
	let result = await getById(searchId);
	let forumsCollection = await forums();
	let discussions = [];
	let temp;
	for (let x of result["discussions"]){
		temp = await forumsCollection.findOne({ "_id": ObjectId(x) });
		if (temp == null) throw "No discussions found with that ID";
		discussions.push(temp);
	}
	return discussions;
}

const getDiscussion = async function getDiscussion(discussionId){
	if (arguments.length != 1) throw 'Must input one value';
	if (typeof discussionId != 'string') throw 'Discussion ID must be a string';
	discussionId = discussionId.trim();
	if (discussionId === "")throw 'Discussion ID must be a non empty string';
	if (!ObjectId.isValid(discussionId)) throw 'Discussion ID must be a valid object ID';
	let forumsCollection = await forums();
	let discussion = await forumsCollection.findOne({ "_id": ObjectId(discussionId) });
	if (!discussion) throw 'No discussion found with that ID';
	return discussion;
}

const getReviews = async function getReviews(searchId){
	if (arguments.length != 1) throw 'Must input one value';
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

const getReview = async function getReview(reviewId){
	if (arguments.length != 1) throw 'Must input one value';
	if (typeof reviewId != 'string') throw 'Review ID must be a string';
	reviewId = reviewId.trim();
	if (reviewId === "")throw 'Review ID must be a non empty string';
	if (!ObjectId.isValid(reviewId)) throw 'review ID must be a valid object ID';
	let reviewsCollection = await reviews();
	let review = await reviewsCollection.findOne({ "_id": ObjectId(reviewId) });
	if (!review) throw 'No review found with that ID';
	return review;
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

async function updateRating(artistId, albumId, songId){
	let mode = "artist";
    artistId = validate.checkInput(artistId, "artistId", "string");
    if (!ObjectId.isValid(artistId)) throw `artistId is not a valid ObjectId`;
	if (albumId) {
		mode = "album";
		albumId = validate.checkInput(albumId, "albumId", "string");
    	if (!ObjectId.isValid(albumId)) throw `albumId is not a valid ObjectId`; 
		if (songId) {
			mode = "song"
			songId = validate.checkInput(songId, "songId", "string");
    		if (!ObjectId.isValid(songId)) throw `songId is not a valid ObjectId`;
		}
	}

    let reviews;

	if (mode == "artist"){
		reviews = await getReviews(artistId);
	}
	if (mode == "album"){
		reviews = await getReviews(albumId);
	}
	if (mode == "song"){
		reviews = await getReviews(songId);
	}

    let likes = 0;
    let dislikes = 0;
    reviews.forEach(element => {
        likes += element["likes"].length;
        dislikes += element["dislikes"].length;
    })
    let avgRating;
	(dislikes == 0) ? avgRating = likes : avgRating = Math.round(likes / dislikes);
	const artistCollection = await artists();
	const songCollection = await songs();
	if (mode == "artist") {
		const updatedRating = await artistCollection.updateOne(
			{_id: ObjectId(artistId)},
			{$set : {avgRating : avgRating}}
		)
		if (!updatedRating) throw `Error updating rating`;
		return {ratingUpdated : true};
	}
	else if (mode == "album") {
		const updatedRating = await artistCollection.updateOne(
			{ "albums._id": albumId },
			{'$set' : {"albums.$.avgRating" : avgRating}}
		)
		if (!updatedRating) throw `Error updating rating`;
		return {ratingUpdated : true};
	}
	else if (mode == "song") {
		const updatedRating = await songCollection.updateOne(
			{ "_id": songId },
			{$set : {"avgRating" : avgRating}}
		)
		if (!updatedRating) throw `Error updating rating`;
		return {ratingUpdated : true};
	}
    else {
		throw `Invalid updateRating mode entered.`;
	}
}

module.exports = {
	createDiscussion,
	createComment,
	createReview,
	isReviewLiked,
	isReviewDisliked,
	likeReview,
	dislikeReview,
	getSearchResult,
	getById,
	getDiscussions,
	getDiscussion,
	getReviews,
	getReview
}