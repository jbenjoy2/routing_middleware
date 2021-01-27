const express = require('express');
const router = new express.Router();
const ExpressError = require('../expressError');
const items = require('../fakeDb');

// routes

router.get('/', (req, res) => {
	res.json([ items ]);
});

router.post('/', (req, res, next) => {
	try {
		if (!req.body.name || !req.body.price) {
			throw new ExpressError('Name and price are required!', 400);
		}
		const newItem = { name: req.body.name, price: req.body.price };
		items.push(newItem);
		return res.status(201).json({ added: newItem });
	} catch (e) {
		return next(e);
	}
});

router.get('/:name', (req, res, next) => {
	const foundItem = items.find((item) => item.name === req.params.name);
	if (foundItem === undefined) {
		throw new ExpressError('Item not found', 404);
	}
	res.json({ name: foundItem.name, price: foundItem.price });
});

router.patch('/:name', (req, res, next) => {
	const foundItem = items.find((item) => item.name === req.params.name);
	if (foundItem === undefined) {
		throw new ExpressError('Item not found', 404);
	}
	if (!req.body.name && !req.body.price) {
		res.json({ 'not updated': foundItem });
	}

	if (req.body.name) {
		foundItem.name = req.body.name;
	}
	if (req.body.price) {
		foundItem.price = req.body.price;
	}

	res.json({ updated: foundItem });
});

router.delete('/:name', (req, res, next) => {
	const foundItem = items.findIndex((item) => item.name === req.params.name);
	if (foundItem === -1) {
		throw new ExpressError('Item not found', 404);
	}
	items.splice(foundItem, 1);
	res.json({ message: 'Deleted' });
});

module.exports = router;
