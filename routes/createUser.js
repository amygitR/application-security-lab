// 3rd party library express that implements our http server
const express = require('express')
const server = express.Router();

// Define route handler for the POST '/createUser' path
server.post('/createUser', async (req, res) => {
    
    // get helper function for authentication
    const {createUser} = require('../helpers/auth')

    // helper function returns {status: boolean, message: string}
    const loggedIn = await createUser(req.body.username, req.body.password)
    
    // if user was created successfully they are logged in by default
    if(loggedIn.status){

        // give them a cookie
        res.cookie('webAppCookie', `${req.body.username}`);
        
        // redirect to dashboard
        res.redirect('/dashboard.html');

    } else { // user was not created
        res.redirect('/createUser.html?error=userExists'); // redirect to creatUser page
    }
})


module.exports = server
