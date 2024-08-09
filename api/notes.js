const express = require('express');
const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Helper functions for reading and writing to the JSON file
const {
    readFromFile,
    readAndAppend,
    writeToFile,
} = require('../helpers/fsUtils');

// const notesData = require('../db/db.json');

//endpoint for /api/notes

/////////////////////////////////////////////////////////////////////////////////////////

router.get('/', (req, res) => {
    console.log('First step inside /api/notes  route 111111111111111');
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

//////////////////////////////////////////////////////////////////////////////////////////

router.post('/', (req, res) => {
    console.log('inside /api/notes  route POST');
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4(), // Generate a unique ID for the new note
        };

        readAndAppend(newNote, './db/db.json');

        res.json(`Note added successfully 🚀`);
    } else {
        res.error('Error in adding note');
    }
});

////////////////////////////////////////////////////////////////////////////////////////////

router.delete('/:id', (req, res) => {
    console.log('Inside /api/notes  delete  **********');

    const noteId = req.params.id;

    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            // Make a new array of all notes except the one with the ID provided in the URL
            const result = json.filter((note) => note.id !== noteId);

            // Save that array to the filesystem
            writeToFile('./db/db.json', result);

            // Respond to the DELETE request
            res.json(`Note ${noteId} has been deleted `);
        });
});

module.exports = router;
