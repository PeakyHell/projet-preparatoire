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

// Page d'accueil
app.get('/', (req, res) => {
    res.render('base', {
        title: 'Home',
        content: 'index',
        username: req.session.username || null
    })
})

// Page de connexion / inscription
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

// Formulaire de connexion
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

// Formulaire d'inscritpion
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

// Lien de déconnexion
app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

// Page de création d'incidents
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

app.post('/report', (req, res) => {
    const { description, address } = req.body
    if (description && address) {
        let incident = {
            description: description,
            address: address,
            user: req.session.username,
            date: new Date()
        }
        
        res.redirect('/')
    }
    else {
        res.redirect('/report')
    }
})


app.listen(3000)