const { ObjectId } = require("mongodb");
const data = require("../data");
const artistsData = data.artists;
const albumsData = data.albums;
const searchData = data.search;
const userData = data.users;
const connection = require("../config/mongoConnection");
const mongoCollections = require("../config/mongoCollections");
const songs = mongoCollections.songs;

async function main () {
    const db = await connection.connectToDb();
    await db.dropDatabase();

    const btr = await artistsData.create('Big Time Rush');
    const jbros = await artistsData.create('Jonas Brothers');
    const olivia = await artistsData.create('Olivia Rodrigo');
    const pitbull = await artistsData.create('Pitbull');
	
	const user1 = await userData.createUser("user1", "user1pass", "user1email@gmail.com");
	const user2 = await userData.createUser("user2", "user2pass", "user2email@gmail.com");
	const user3 = await userData.createUser("user3", "user3pass", "user3email@gmail.com");
	const user4 = await userData.createUser("user4", "user4pass", "user4email@gmail.com");
	const user5 = await userData.createUser("user5", "user5pass", "user5email@gmail.com");
	
	const btrDiscussion = await searchData.createDiscussion(btr._id.toString(), null, null, "BTR is Great!", "I think this is worth discussion", "05/02/2022", user1._id.toString());
	const btrComment = await searchData.createComment(btrDiscussion._id.toString(), user2._id.toString(), "I don't think we need to discuss this. Its true!");

	const btrReview = await searchData.createReview(btr._id.toString(), null, null, "This is my review on BTR", "I think they deserve to be the best! Like if you agree!", "05/02/2022", user1._id.toString());
	const likeBtrReview = await searchData.likeReview(btrReview._id.toString(), user2._id.toString());
	const likeBtrReview2 = await searchData.likeReview(btrReview._id.toString(), user3._id.toString());
	const dislikeBtrReview = await searchData.dislikeReview(btrReview._id.toString(), user4._id.toString());
	
	const btr_a1_songs = await albumsData.createSongs(["Elevate", "Love Me Love Me", "Cover Girl", "Music Sounds Better"]);
	const btr_a1 = await albumsData.createAlbum(btr._id, "Elevate", btr_a1_songs);
	const btr_a2_songs = await albumsData.createSongs(['Run Wild', "Get Up", "Picture This", "Amazing"]);
    const btr_a2 = await albumsData.createAlbum(btr._id, "24/7", btr_a2_songs);

	const elevateDiscussion = await searchData.createDiscussion(btr._id.toString(), btr_a1._id.toString(), null, "Elevated Album Discussion", "This is a discussion about the album elevate", "05/01/2022", user2._id.toString());
	const elevateComment = await searchData.createComment(elevateDiscussion._id.toString(), user1._id.toString(), "This is a comment to agree that this is a discussion post.");

	const elevateReview = await searchData.createReview(btr._id.toString(), btr_a1._id.toString(), null, "Elevated Review", "This is a review about elevate", "05/01/2022", user1._id.toString());
	let updatedElevateReview = await searchData.likeReview(elevateReview._id.toString(), user1._id.toString());
	updatedElevateReview = await searchData.dislikeReview(elevateReview._id.toString(), user1._id.toString());
	updatedElevateReview = await searchData.likeReview(elevateReview._id.toString(), user1._id.toString());
	
	const loveMeId = await albumsData.getSongId(btr_a1._id.toString(), "Love Me Love Me");
	const loveMeDiscussion = await searchData.createDiscussion(btr._id.toString(), btr_a1._id.toString(), loveMeId._id, "Love Me Love Me Discussion", "This is a discussion about elevate's song Love Me Love Me", "05/02/2022", user1._id.toString());
	const loveMeReview = await searchData.createReview(btr._id.toString(), btr_a1._id.toString(), loveMeId._id, "Love Me Review", "This is a review about love me love me", "05/03/2022", user2._id.toString());
	const a = await searchData.likeReview(loveMeReview._id.toString(), user2._id.toString());

	const olivia_a1_songs = await albumsData.createSongs(["Driver's License", "Good 4 U", "Traitor", "Deja Vu"]);
	const olivia_a1 = await albumsData.createAlbum(olivia._id, "Sour", olivia_a1_songs);

	const oliviaReview = await searchData.createReview(olivia._id.toString(), null, null, "I think Olivia Rodrigo is awesome!", "Shes too cute!!!", "05/02/2022", user5._id.toString());
	const likeoliviaReview = await searchData.likeReview(oliviaReview._id.toString(), user2._id.toString());
	const likeoliviaReview2 = await searchData.likeReview(oliviaReview._id.toString(), user1._id.toString());
	const likeoliviaReview3 = await searchData.likeReview(oliviaReview._id.toString(), user4._id.toString());


	const pitbullReview = await searchData.createReview(pitbull._id.toString(), null, null, "I think pitbull is so bad", "hes the worst", "05/06/2022", user5._id.toString());
	const dislikepitbullReview = await searchData.dislikeReview(pitbullReview._id.toString(), user1._id.toString());
	const dislikepitbullReview2 = await searchData.dislikeReview(pitbullReview._id.toString(), user2._id.toString());
	const dislikepitbullReview3 = await searchData.dislikeReview(pitbullReview._id.toString(), user3._id.toString());
	const dislikepitbullReview4 = await searchData.dislikeReview(pitbullReview._id.toString(), user4._id.toString());

    await connection.closeConnection();
}

main();