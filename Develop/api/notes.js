const express = require('express');
const router = require('express').Router();
const path = require('path');
const fs = require('fs');

// Helper functions for reading and writing to the JSON file
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');

// const notesData = require('../db/db.json');

//endpoint for /api/notes

router.get('/', (req, res) => {
    console.log('First step inside /api/notes  route 111111111111111');
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

module.exports = router;
