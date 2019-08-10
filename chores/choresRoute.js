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
	// response will hold result of choresDb filtering
	let response = [];
	const reqQuery = req.query.completed;

	// if reqQuery value equals true or false, then add any chores object whose 'completed' value matches the reqQuery to 'response' variable
	if(reqQuery === "true" || reqQuery === "false") {
		response = choresDb.chores.filter(chore => chore.completed.toString() === req.query.completed);
	}

	if(response.length > 0) {
		return res.status(200).json(response);
	} else {
		return res.status(200).json(choresDb.chores);
	}
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
});

// get specific person's list of chores
router.get('/people/:id', (req, res) => {
	const person = peopleDb.find(chore => chore.id === Number(req.params.id));
	
	// if person doesn't exist, return error
	if(!person) {
		return res.status(404).json({message: "That person's ID does not exist"});
	}

	// filter out all chores whose 'assignedTo' value doesn't match up with req.params.id
	const chores = choresDb.chores.filter(chore => Number(chore.assignedTo) === Number(req.params.id));

	res.status(200).json(chores)
});


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
	else if(!peopleDb.find(person => person.id === Number(req.body.assignedTo))) {
		return res.status(400).json({message: "The person you assigned the chore to doesn't exist"});
	}
	else {
		choresDb.chores.push(req.body);
		res.status(201).json({message: "Chore created successfully"});
	}
});


// DELETE
router.delete('/:id', (req, res) => {
	const chore = validateChoreId(choresDb.chores, req.params.id);

	// if falsey value (e.g. `undefined`) is stored in chore, return error
	if(!chore) {
		return res.status(404).json({message: "The provided chore ID does not exist"});
	}
	else {
		const choresIndex = getChoresIndex(choresDb.chores, req.params.id);

		// remove chore object from choresDb.chores array
		choresDb.chores.splice(choresIndex, 1);

		res.status(200).json({message: "Chore deleted successfully"});
	}
});


// PUT
router.put('/:id', (req, res) => {
	const chore = validateChoreId(choresDb.chores, req.params.id);

	// if falsey value (e.g. `undefined`) is stored in chore, return error
	if(!chore) {
		return res.status(404).json({message: "The provided chore ID does not exist"});
	}
	else {
		const choresIndex = getChoresIndex(choresDb.chores, req.params.id);

		// if 'completed' property is provided, it must be a boolean, if not, return error
		if(req.body.completed) {
			if(typeof req.body.completed !== "boolean") {
				return res.status(400).json({message: "Completed property must be boolean"});
			}
		}

		// if the assignedTo ID doesn't exist, return error
		if(!peopleDb.find(person => person.id === Number(req.body.assignedTo))) {
			return res.status(400).json({message: "The person you assigned the chore to doesn't exist"});
		}

		// update chore object within choresDb.chores array
		choresDb.chores[choresIndex] = {
			...choresDb.chores[choresIndex],
			...req.body
		};

		res.status(200).json({message: "Chore updated successfully"});
	}
});


// ** MIDDLEWARE (not really) **
function validateChoreId(choresDb, requestId) {
	// checks to see if the chore exists based on the /:id provided in the URL
	// if a chore is found, return that chore object, if not found, then return `undefined`
	return choresDb.find(chore => chore.id === Number(requestId));
};

function getChoresIndex(choresDb, requestId) {
	// get index of associated chore object from choresDb.chores array
	return choresDb.findIndex(chore => chore.id === Number(requestId));
};

module.exports = router;