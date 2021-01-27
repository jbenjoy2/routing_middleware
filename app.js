const express = require('express');
const app = express();
const itemsRoutes = require('./routes/items');
const ExpressError = require('./expressError');

app.use(express.json());
app.use('/items', itemsRoutes);
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

app.use((req, res, next) => {
	return next(new ExpressError('Not Found', 404));
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);

	return res.json({ error: err.message });
});

module.exports = app;
