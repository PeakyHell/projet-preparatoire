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
        content: 'index',
        username: req.session.username || null
    })
})

app.get('/auth', (req, res) => {
    if (req.session.username) {
        res.redirect('/')
    }
    else {
        res.render('base', {
            title: 'Auth',
            content: 'auth',
            username: req.session.username || null
        })
    }
})

app.post('/login', (req, res) => {
    const { username, password } = req.body
    if (username == 'admin' && password == 'password') {
        req.session.username = username
        res.redirect('/')
    }
    else {
        res.redirect('/auth')
    }
})

app.post('/register', (req, res) => {
    const { username, password, fullname, email } = req.body
    if (username && password && fullname && email) {
        req.session.username = username
        res.redirect('/')
    }
    else {
        res.redirect('auth')
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

app.get('/report', (req, res) => {
    if (req.session.username) {
        res.render('base', {
            title: 'Report',
            content: 'report',
            username: req.session.username || null
        })
    }
    else {
        res.redirect('/auth')
    }    
})

app.listen(3000)