const express = require('express')

const app = express()

const ExpressError = require('./expressError')

const itemsRoutes = require('./routes/items')

app.use(express.json())

app.use('/items', itemsRoutes)



app.use(function (req, res, next) {
    return next(new ExpressError('Not Found', 404))
})

//error handler
app.use((err, req, res, next) => {
    let status = res.status(err.status || 500)

    return res.json({
        error: err.message,
        status: status.statusCode
    })
})

module.exports = app