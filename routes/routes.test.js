process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
let items = require('../fakeDb');

let bacon = { name: 'bacon', price: 1.99 };

beforeEach(function() {
	// have to define it here too, or else the patch function will alter the global 'bacon' object ruining final tests
	let bacon = { name: 'bacon', price: 1.99 };
	items.push(bacon);
});

afterEach(function() {
	items.length = 0;
});

describe('GET /items', () => {
	test('get all items', async () => {
		const res = await request(app).get('/items');
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual([ [ bacon ] ]);
	});
});

describe('GET /items/:name', () => {
	test('get item by name', async () => {
		const res = await request(app).get(`/items/${bacon.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(bacon);
	});
	test('Respond with 404 if item not found', async () => {
		const res = await request(app).get(`/items/tuna`);
		expect(res.statusCode).toBe(404);
	});
});

describe('POST /items', () => {
	test('add new item', async () => {
		const res = await request(app).post(`/items`).send({ name: 'tuna', price: 0.99 });
		expect(res.statusCode).toBe(201);
		expect(res.body).toEqual({ added: { name: 'tuna', price: 0.99 } });
	});
	test('Respond with 400 if missing only name', async () => {
		const res = await request(app).post(`/items`).send({ price: 0.5 });
		expect(res.statusCode).toBe(400);
	});
	test('Respond with 400 if missing only price', async () => {
		const res = await request(app).post(`/items`).send({ name: 'tuna' });
		expect(res.statusCode).toBe(400);
	});
	test('Respond with 400 if missing all info', async () => {
		const res = await request(app).post(`/items`).send({});
		expect(res.statusCode).toBe(400);
	});
});
describe('PATCH /items/:name', () => {
	test('Updating an item', async () => {
		const res = await request(app)
			.patch(`/items/${bacon.name}`)
			.send({ name: 'tuna', price: 0.99 });
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ updated: { name: 'tuna', price: 0.99 } });
	});
	test('Respond with 404 if item not found', async () => {
		const res = await request(app).patch(`/items/balooga`).send({ name: 'coke', price: 0.5 });
		expect(res.statusCode).toBe(404);
	});
	test('Dont update item if no info is given', async () => {
		const res = await request(app).patch(`/items/${bacon.name}`).send({});
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ 'not updated': bacon });
	});
});

describe('DELETE /items/:name', () => {
	test('Delete an item', async () => {
		const res = await request(app).delete(`/items/${bacon.name}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ message: 'Deleted' });
	});

	test('Respond with 404 if item not found', async () => {
		const res = await request(app).delete(`/items/tuna`);
		expect(res.statusCode).toBe(404);
	});
});
