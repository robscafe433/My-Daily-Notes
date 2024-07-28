const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const api = require('./api');

const PORT = process.env.port || 3004;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(api);

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//ReadMe -> THEN I am presented with a landing page with a link to a notes page
app.get('/notes', (req, res) => {
    console.log('Route to serve the notes.html page');
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});
