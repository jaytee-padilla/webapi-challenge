// import express
// import 'router' method from express
const express = require('express');
const router = express.Router();

// import database
const choresDb = require('./choresDb');
const peopleDb = require('../people/peopleDb');

// ** CRUD **
// GET
// get chores
router.get('/', (req, res) => {
	res.status(200).json(choresDb.chores);
});

// get specific chore by id
router.get('/:id', (req, res) => {
	const choreId = req.params.id;
	let results = choresDb.chores.filter(chore => chore.id === Number(choreId));

	if(results.length === 0) {
		res.status(404).json({message: "Chore ID does not exist"});
	} else {
		res.status(200).json(results);
	}
})


// POST
router.post('/', (req, res) => {
	// increments the new chores id before adding to database
	// prepend new id to req.body
	let lastChore = choresDb.chores.length - 1;
	// let lastChoreId = choresDb.chores[lastChore].id;
	let newChoreId = choresDb.chores[lastChore].id + 1
	req.body = Object.assign({id: newChoreId}, req.body);
	// defaults `completed` property to false
	if(!req.body.completed) {
		req.body.completed = false;
	}

	// if the user didn't include a description, return error
	// if the user didn't include ID for person the chore is being assigned to or if the ID is a string, return error
	if(!req.body.description) {
		return res.status(400).json({message: "Must include chore description"});
	} else if(!req.body.assignedTo) {
		return res.status(400).json({message: "Must include assigned person's ID"});
	} else if(!peopleDb.people.find(person => person.id === req.body.assignedTo)) {
		return res.status(400).json({message: "The person you assigned the chore to doesn't exist"});
	} else {
		choresDb.chores.push(req.body);
		res.status(201).json({message: "Chore created successfully"});
	}
});


// DELETE
router.delete('/:id', (req, res) => {
	// let results = choresDb.chores
});


// PUT

module.exports = router;