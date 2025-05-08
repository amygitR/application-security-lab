const bcrypt = require('bcrypt')

var isInit = false;

const saltRounds = 10;  // Fix # 1  website would not work because of the bcrypt hashing added.  It would not allow the password
                        //'Poptart' to match due to encryption.
var salt = null;
const users = [];

async function init() {
    isInit = true;
    salt = await bcrypt.genSalt(saltRounds);
    users.push({username:"Student", password: await bcrypt.hash("Poptart", salt)}); //part of fix #1
}

// helper function that creates a new user
async function createUser(username, password){
    if(!isInit) { await init(); }

    // check to see if the user already exists in the array of users
    const index = users.findIndex((user) => user.username === username)
    
    // if the user exists index will be a valid index >= 0
    if (index >= 0)
        
        // return false and an error message if the user already exists 
        return {status: false, message: "User Exists!"}
    
    else // the user doesn't exist so we need to create a user
        {
            // else push the new user and password onto the users array
            users.push({username:username, password: await bcrypt.hash(password, salt)})

            // return true and a success message
            return {status: true, message: "Created User: " + username}
        }
}

// helper function that logs a user in
async function login(username, password) {
    if(!isInit) { await init(); }

    try {
        // check to see if the user exists in the array of users
        const index = users.findIndex((user) => {

            // this is an obviously derived scenario but the lesson it illustrates is to
            // never run a function with unvalidated user input, do not delete this line yet
            const insecure_compare = eval('("'+ username +'" === "' + user.username + '")')
            return insecure_compare    
        });

        // if the user exists index will be a valid index >= 0
        if (index >= 0){
        
            // compare that users saved password with the one they entered in the login form
            if(await bcrypt.compare(password, users[index].password))
        
                // if it matches return true and a success message
                return {status: true, message: "User logged in: " + username}

            else // the user's saved password doesn't match the one they entered in the login form    

                // return false and an error message
                return {status: false, message: "Incorrect password!"}
        }
        else 
        {
            // return false and an error message
            return {status: false, message: "User does not exist."}
        }
    } catch (err) {
        // a hacker can control the contents of err.message by injecting code into the
        // 'insecure_compare' function including a list of all the users
        return {status: false, message: err.message}
    }
}

module.exports = {
    createUser,
    login
}
