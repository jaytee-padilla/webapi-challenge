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
	}
	else {
		res.status(200).json(results);
	}
})


// POST
router.post('/', (req, res) => {
	// increments the new chores id before adding to database
	let lastChore = choresDb.chores.length - 1;
	let newChoreId = choresDb.chores[lastChore].id + 1

	// prepend new id to req.body
	req.body = Object.assign({id: newChoreId}, req.body);

	// defaults `completed` property value to false
	if(!req.body.completed) {
		req.body.completed = false;
	}

	// if the user didn't include a description, return error
	// if the user didn't include ID for person the chore is being assigned to, return error
	// if the user ID doesn't exist, return error
	if(!req.body.description) {
		return res.status(400).json({message: "Must include chore description"});
	}
	else if(!req.body.assignedTo) {
		return res.status(400).json({message: "Must include assigned person's ID"});
	}
	else if(!peopleDb.people.find(person => person.id === Number(req.body.assignedTo))) {
		return res.status(400).json({message: "The person you assigned the chore to doesn't exist"});
	}
	else {
		choresDb.chores.push(req.body);
		res.status(201).json({message: "Chore created successfully"});
	}
});


// DELETE
router.delete('/:id', (req, res) => {
	// checks to see if the chore exists based on the /:id provided in the URL
	// if a chore is found, store that chore object in variable, if not found, then `undefined` is stored
	const chore = choresDb.chores.find(chore => chore.id === Number(req.params.id));

	// if falsey value (e.g. `undefined`) is stored in chore, return error
	if(!chore) {
		return res.status(404).json({message: "The provided chore ID does not exist"});
	}
	else {
		// get index of associated chore object from choresDb.chores array
		// remove chore object from choresDb.chores array
		const choresIndex = choresDb.chores.findIndex(chore => chore.id === Number(req.params.id));
		choresDb.chores.splice(choresIndex, 1);

		res.status(200).json({message: "Chore deleted successfully"});
	}
});


// PUT

module.exports = router;