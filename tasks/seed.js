const { ObjectId } = require("mongodb");
const data = require("../data");
const artistsData = data.artists;
const albumsData = data.albums;
const connection = require("../config/mongoConnection");

async function main () {
    const db = await connection.connectToDb();
    await db.dropDatabase();

    const btr = await artistsData.create('Big Time Rush');
    const jbros = await artistsData.create('Jonas Brothers');
    const olivia = await artistsData.create('Olivia Rodrigo');
    const boyswhocry = await artistsData.create('Boys Who Cry');
    const pitbull = await artistsData.create('Pitbull');

    const btr_a1 = await albumsData.createAlbum(btr._id, "Elevate", ["Elevate", "Love Me Love Me", "Cover Girl", "Music Sounds Better"]);
    const btr_a2 = await albumsData.createAlbum(btr._id, "24/7", ['Run Wild', "Get Up", "Picture This", "Amazing"]);

    const olivia_a1 = await albumsData.createAlbum(olivia._id, "Sour", ["Driver's License", "Good 4 U", "Traitor", "Deja Vu"]);

    

    await connection.closeConnection();
}

main();