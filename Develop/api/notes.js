const express = require('express');
const router = require('express').Router();
const path = require('path');
const fs = require('fs');

const notesData = require('../db/db.json');

//endpoint for /api/notes

router.get('/', (req, res) => {
    res.json(notesData), console.log('//////////here is db.json data', notesData);
});

module.exports = router;
