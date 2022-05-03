const { ObjectId } = require("mongodb");
const data = require("../data");
const artistsData = data.artists;
const albumsData = data.albums;
const searchData = data.search;
const userData = data.users;
const connection = require("../config/mongoConnection");

async function main () {
    const db = await connection.connectToDb();
    await db.dropDatabase();

    const btr = await artistsData.create('Big Time Rush');
    const jbros = await artistsData.create('Jonas Brothers');
    const olivia = await artistsData.create('Olivia Rodrigo');
    const boyswhocry = await artistsData.create('Boys Who Cry');
    const pitbull = await artistsData.create('Pitbull');
	
	const user1 = await userData.createUser("user1", "user1pass", "user1email@gmail.com");
	
	const btrDiscussion = await searchData.createDiscussion(btr._id.toString(), null, null, "Discussion One", "This is a discussion", "05/02/2022", user1._id.toString());
	
	const btrReview = await searchData.createReview(btr._id.toString(), null, null, "Review One", "This is a review please like it", "05/02/2022", user1._id.toString());
	
	const btr_a1 = await albumsData.createAlbum(btr._id, "Elevate", ["Elevate", "Love Me Love Me", "Cover Girl", "Music Sounds Better"]);
    const btr_a2 = await albumsData.createAlbum(btr._id, "24/7", ['Run Wild', "Get Up", "Picture This", "Amazing"]);

	const elevateDiscussion = await searchData.createDiscussion(btr._id.toString(), btr_a1._id.toString(), null, "Elevated Discussion", "This is a discussion about elevate", "05/01/2022", user1._id.toString());

	const elevateComment = await searchData.createComment(elevateDiscussion._id.toString(), user1._id.toString(), "This is a comment");

	const elevateReview = await searchData.createReview(btr._id.toString(), btr_a1._id.toString(), null, "Elevated Review", "This is a review about elevate", "05/01/2022", user1._id.toString());
	
	let updatedElevateReview = await searchData.likeReview(elevateReview._id.toString(), user1._id.toString());
	
	updatedElevateReview = await searchData.dislikeReview(elevateReview._id.toString(), user1._id.toString());
	
	updatedElevateReview = await searchData.likeReview(elevateReview._id.toString(), user1._id.toString());

	//const loveMeDiscussion = await searchData.createDiscussion(btr._id.toString(), btr_a1._id.toString(), "Love Me Love Me", "Love Me Love Me Discussion", "This is a discussion about elevate's song Love Me Love Me", "05/02/2022", user1._id.toString());

    const olivia_a1 = await albumsData.createAlbum(olivia._id, "Sour", ["Driver's License", "Good 4 U", "Traitor", "Deja Vu"]);


    await connection.closeConnection();
}

main();