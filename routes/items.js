const express = require('express')

const router = new express.Router();

const ExpressError = require('../expressError')

const itemsArr = require('../fakeDb')


router.get('/', function (req, resp) {
    resp.json(itemsArr)
})

router.post('/', function (req, resp, next) {
    try {
        if (!req.body.name || !req.body.price) throw new ExpressError('Name and price is required', 400)
        const newItem = { name: req.body.name, price: req.body.price }
        itemsArr.push(newItem)
        return resp.json({ added: newItem })
    } catch (e) {
        return next(e)
    }
})

router.get('/:name', function (req, resp) {
    const itemsObj = itemsArr.find((obj) => obj.name === req.params.name)
    if (itemsObj === undefined) {
        throw new ExpressError('Invalid item name', 404)
    }
    resp.json(itemsObj)
})

router.patch('/:name', function (req, resp) {
    const itemsObj = itemsArr.find((obj) => obj.name === req.params.name)
    if (itemsObj === undefined) {
        throw new ExpressError('Invalid item name', 404)
    }
    itemsObj.name = req.body.name
    itemsObj.price = req.body.price
    resp.json({ updated: itemsObj })
})


router.delete('/:name', function (req, resp) {
    const itemIndexNumber = itemsArr.findIndex((obj) => obj.name === req.params.name)
    if (itemIndexNumber === -1) {
        throw new ExpressError('Invalid item name', 404)
    }
    itemsArr.splice(itemIndexNumber, 1)
    resp.json({ message: 'Deleted' })
})

module.exports = router

