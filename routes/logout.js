// logout.js
const express = require('express');
const server = express.Router();

server.post('/logout', (req, res) => {
    // Clear the authentication cookie
    res.clearCookie('webAppCookie');

    // Destroy the session if using express-session
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
                return res.status(500).send('Error logging out.');
            }
        });
    }

    // Disable browser caching to prevent back-button navigation
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Redirect the user to the login page or home page
    res.redirect('/');
});
server.get('/dashboard.html', (req, res) => {
    if (!req.cookies.webAppCookie) {
        return res.redirect('/'); // Redirect to login if no cookie
    }

    // Add similar code for any other protected page
    res.sendFile(path.join(__dirname, 'pages', 'dashboard.html'));
});

module.exports = server;


