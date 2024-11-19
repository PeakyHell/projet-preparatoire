const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const app = express()


app.set('view engine', 'ejs')
app.set('views', 'public/templates')
app.use(express.static('public/static'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: require('../config').session_secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: true,
    }
}));


module.exports = app