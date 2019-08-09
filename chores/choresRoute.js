// import express
// import 'router' method from express
const express = require('express');
const router = express.Router();

// import database
const choresDb = require('./choresDb');

// ** CRUD **
// GET
// get chores
router.get('/', (req, res) => {
	res.status(200).json(choresDb.chores);
});

// POST


// DELETE


// PUT

module.exports = router;