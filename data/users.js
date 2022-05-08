const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections")
const users = mongoCollections.users;
const bcrypt = require('bcrypt');
const saltRounds = 16;
const validator = require("email-validator");
const validate = require("./validation");


function checkInput(val, type) {
    if (!val) throw `${type} was not supplied.`;
    if (val.length == 0) throw `${type} is too short.`;
  
    if (type == 'username') {
        if (val.length < 4) throw `Username is too short`;
        let validchars = "qwertyuiopasdfghjklzxcvbnm1234567890";
        for (let i=0; i<val.length; i++){
            if (!validchars.includes(val[i].toLowerCase())) throw `Invalid character ${val[i]} supplied in username.`;
        }
        //val = val.toLowerCase();
    }
    if (type == 'password') {
        if (val.length < 6) throw `Password is too short`;
        if (val.includes(' ')) throw `No spaces allowed in password.`;
    }
    if (type == "email") {
        if (!validator.validate(val)) throw `Email is not a valid email address.`;
    }
    return val;
  }

async function createUser(username, password, email) {
    if (arguments.length > 3) throw `Too many arguments passed.`
    username = checkInput(username,'username');
    password = checkInput(password,'password');
    email = checkInput(email, "email");

    const userCollection = await users();

    const user = await userCollection.findOne({ username: username });
    if (user) throw `Username already taken.`;

    const hash = await bcrypt.hash(password, saltRounds);

    let newUser = {
        username: username,
        password: hash,
        email: email,
        discForumPosts: [],
        reviewPosts: []
    };

    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw 'Could not add user';
    
	const addedUser = await userCollection.findOne({ username: username });
    addedUser["_id"] = addedUser["_id"].toString();
	return addedUser;
	//return {userInserted: true};
}

async function userInfo(username){
    if (arguments.length > 1) throw `Too many arguments passed.`
    username = checkInput(username,'username');

    const userCollection = await users();

    const user = await userCollection.findOne({ username: username });
    if (!user) throw `Either the username or password is invalid`;

    return user;
}

async function editUser(username, newUsername, newPassword, newEmail){
    if (arguments.length > 4) throw `Too many arguments passed.`
    username = checkInput(username,'username');
    newUsername = checkInput(newUsername, 'username');
    newPassword = checkInput(newPassword, 'password');
    newEmail = checkInput(newEmail, 'email');
    
    const userCollection = await users();

    let user = await userCollection.findOne({ username: username });
    if (!user) throw `Either the username or password is invalid`;

    let id = user["_id"];
    const hash = await bcrypt.hash(newPassword, saltRounds);

    const updatedAccount = {
        username: newUsername,
        password: hash,
        email: newEmail,
        discForumPosts: user["discForumPosts"],
        reviewPosts: user["reviewPosts"]
    };

    const updatedInfo = await userCollection.updateOne({_id: ObjectId(id)}, {$set: updatedAccount});
    if(updatedInfo.modifiedCount === 0) throw 'Could not update account successfully';

    user = await userCollection.findOne({_id: ObjectId(id)});
    return user;
}

async function deleteUser(username){
    if (arguments.length > 1) throw `Too many arguments passed.`
    username = checkInput(username,'username');

    const userCollection = await users();

    let user = await userCollection.findOne({ username: username });
    if (!user) throw `Either the username or password is invalid`;

    let id = user["_id"];

    const deletionInfo = await userCollection.deleteOne({_id: ObjectId(id)});
    if(deletionInfo.deletedCount === 0) throw 'Could not delete account with id of ' + id;
    
    return "So Long " + username + "! Account Deleted";
}

async function checkUser(username, password) {
    if (arguments.length > 2) throw `Too many arguments passed.`
    username = checkInput(username,'username');
    password = checkInput(password,'password');

    const userCollection = await users();

    const user = await userCollection.findOne({ username: username });
    if (!user) throw `Either the username or password is invalid`;

    let compareMatch = false; 
    try {
        compareMatch = await bcrypt.compare(password, user.password);
    } catch (e) {
        //no op
    }

    if (compareMatch) {
        return {authenticated: true}
    }
    else {
        throw `Either the username or password is invalid`;
    }
}

async function usernameFromID(userID) {
    userID = validate.checkInput(userID, "user id", "string");
    if (!ObjectId.isValid(userID)) throw `User ID is not valid Object ID`;

    const userCollection = await users();
    const user = await userCollection.findOne({"_id" : ObjectId(userID)});

    if (!user) throw `No user with that ID exists`;
    return user.username;
}

module.exports = {createUser,checkUser, userInfo, editUser, deleteUser, usernameFromID};