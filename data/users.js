const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections")
const users = mongoCollections.users;
const bcrypt = require('bcrypt');
const saltRounds = 16;
const validator = require("email-validator");


function checkInput(val, type) {
    if (!val) throw `${type} was not supplied.`;
    if (val.length == 0) throw `${type} is too short.`;
  
    if (type == 'username') {
        if (val.length < 4) throw `Username is too short`;
        let validchars = "qwertyuiopasdfghjklzxcvbnm1234567890";
        for (let i=0; i<val.length; i++){
            if (!validchars.includes(val[i].toLowerCase())) throw `Invalid character ${val[i]} supplied in username.`;
        }
        val = val.toLowerCase();
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

module.exports = {createUser,checkUser};