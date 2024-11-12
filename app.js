const express = require('express')
const session = require('express-session')
const app = express()
const bodyParser = require('body-parser')
const https = require('https')
const fs = require('fs')


app.set('view engine', 'ejs')
app.set('views', 'public/templates')
app.use(express.static('public/static'))


app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: 'propre123'
}));


app.get('/', (req, res) => {
    res.render('base', {
        title: 'Home',
        content: 'index'
    })
})

app.get('/auth', (req, res) => {
    if (req.session.username) {
        res.redirect('/')
    }
    else {
        res.render('base', {
            title: 'Auth',
            content: 'auth'
        })
    }
})

app.post('/auth', (req, res) => {
    if (req.body.username == 'admin' && req.body.password == 'password') {
        req.session.username = 'admin'
        res.redirect('/')
    }
    else {
        res.redirect('/auth')
    }
})

app.get('/report', (req, res) => {
    if (req.session.username) {
        res.render('base', {
            title: 'Report',
            content: 'report'
        })
    }
    else {
        res.redirect('/auth')
    }    
})

app.listen(3000)