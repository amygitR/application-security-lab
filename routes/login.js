// 3rd party library express that implements our http server
const express = require('express');
const server = express.Router();

// Define route handler for the GET '/login' path (if you are serving it this way)
server.get('/login', (req, res) => {
    if (req.cookies.webAppCookie) {
        // User is already logged in, redirect them to the dashboard or another page
        return res.redirect('/dashboard.html'); // or any page you want to send them to
    }
    // Proceed to serve the login page if not logged in
    res.sendFile(path.join(__dirname, 'pages', 'login.html')); // Adjust path as needed
});

// Define route handler for the POST '/login' path
server.post('/login', async (req, res) => {
    const { login } = require('../helpers/auth');

    const loggedIn = await login(req.body.username, req.body.password);

    if (loggedIn.status) {
        // Give them a cookie
        res.cookie('webAppCookie', `${req.body.username}`);

        // Redirect to dashboard
        return res.redirect('/dashboard.html');
    } else {
        // User did not log in successfully
        res.redirect(`/?error=${loggedIn.message}`);
    }
});

module.exports = server;
