const express = require('express');
const cookieParser = require('cookie-parser');
const server = express.Router();
const fs = require('fs').promises;

// Middleware for parsing cookies
server.use(cookieParser());

// List of publicly accessible pages
const publicPages = [undefined, 'homepage.html', 'createUser.html'];

// Route handler for all *.html page requests
server.get('/:filename?', async (req, res) => {
    const filename = req.params.filename;

    // Only serve requests for .html files or the root path
    if (filename && filename.endsWith('.html') || !filename) {

        // Check if the page is public or if the user has a valid cookie
        const publicPages = [undefined, 'homepage.html', 'createUser.html']; // Add any pages you want to be public
        if (!publicPages.includes(filename) && !req.cookies.webAppCookie) {
            return res.redirect('/');
        }

        // Prevent caching of protected pages
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        // Serve the HTML file
        const filepath = `./pages/${filename || 'homepage.html'}`;

        try {
            const data = await fs.readFile(filepath);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        } catch (error) {
            console.log("File not found. Redirecting to homepage.");
            res.redirect('/');
        }
    } else {
        res.status(404).send("Not Found");
    }
});

module.exports = server;