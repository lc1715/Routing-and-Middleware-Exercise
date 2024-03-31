process.env.NODE_ENV = "test";

const request = require('supertest')

const app = require('../app')

const itemsArr = require('../fakeDb')



let item = { name: 'Cheerios', price: 3.40 }

beforeEach(function () {
    itemsArr.push(item)
})

afterEach(function () {
    itemsArr.length = 0
})


describe('GET /items', () => {
    test('Get all items', async () => {
        const resp = await request(app).get('/items')
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual(itemsArr)
    })
})

describe('GET /items/:name', () => {
    test('Get one item by name', async () => {
        const resp = await request(app).get(`/items/${item.name}`)
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({ name: 'Cheerios', price: 3.40 })
    })
    test('Respond with 404 status code if invalid name is received', async () => {
        const resp = await request(app).get(`/items/tangerine`)
        expect(resp.statusCode).toBe(404)
    })
})

describe('POST /items', () => {
    test('Add a new item to the array', async () => {
        const resp = await request(app).post('/items').send({ name: 'oranges', price: 3.50 })
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({ added: { name: 'oranges', price: 3.50 } })
    })
    test('Missing item name or price', async () => {
        const resp = await request(app).post('/items').send({ price: 1.50 })
        expect(resp.statusCode).toBe(400)
        debugger
    })
})


describe('PATCH /items/:name', () => {
    test('Update an item with a different name or price', async () => {
        const resp = await request(app).patch(`/items/${item.name}`).send({ name: 'HoneyCherrios', price: 3.40 })
        // console.log('resp&&&&&&&&&&&=', resp)
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({ updated: { name: 'HoneyCherrios', price: 3.40 } })
    })
    test('Responds with 404 if invalid name is received', async () => {
        const resp = await request(app).patch(`/items/fruit`)
        console.log('resp.body', resp.body)
        expect(resp.statusCode).toBe(404)
    })
})

describe('DELETE /items/:name', () => {
    test('Delete an item', async () => {
        const resp = await request(app).delete(`/items/${item.name}`)
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({ message: 'Deleted' })
    })
    test('Respond with 404 if invalid item name received', async () => {
        const resp = await request(app).delete(`/items/tangerine`)
        expect(resp.statusCode).toBe(404)
    })
})