// import express
// import 'router' method from express
const express = require('express');
const router = express.Router();

// import database
const choresDb = require('../chores/choresDb');
const peopleDb = require('./peopleDb');



// ** CRUD **
// GET
// get people
router.get('/', (req, res) => {
	res.status(200).json(peopleDb)
});

module.exports = router;