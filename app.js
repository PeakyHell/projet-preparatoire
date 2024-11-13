const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const https = require('https')
const fs = require('fs')
const sha256 = require('js-sha256')
const MongoClient = require('mongodb').MongoClient
const app = express()


app.set('view engine', 'ejs')
app.set('views', 'public/templates')
app.use(express.static('public/static'))


app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: 'propre123'
}));


// Connexion à la base de données
// TODO Modifier l'adresse de la base de données
const uri = ''
const client = new MongoClient(uri)
const incidentsCollection = client.db('Projet').collection('Incidents')
const usersCollection = client.db('Projet').collection('Users')


// Page d'accueil
app.get('/', async (req, res) => {
    let incidentsList = await incidentsCollection.find().toArray()
    res.render('base', {
        title: 'Home',
        content: 'index',
        username: req.session.username || null,
        incidents: incidentsList
    })
})


app.post('/search', async (req, res) => {

    let documents = await incidentsCollection.find().toArray()

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
app.post('/login', async (req, res) => {
    const { username, password } = req.body
    if (username && password) {
        let user = await usersCollection.findOne({ username: username, password: sha256(password)}) || null
        if (user) {
            req.session.username = username
            res.redirect('/')
        }
        else {
            res.redirect('/auth')
        }
    }
})

// Formulaire d'inscritpion
app.post('/register', async (req, res) => {
    const { username, password, fullname, email } = req.body
    if (username && password && fullname && email) {
        let user = {
            username: username,
            // TODO Hasher le mot de passe
            password: sha256(password),
            fullname: fullname,
            email: email
        }
        await usersCollection.insertOne(user)
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

app.post('/report', async (req, res) => {
    const { description, address } = req.body
    if (description && address) {
        let date = new Date()
        let incident = {
            description: description,
            address: address,
            user: req.session.username,
            date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
        }
        await incidentsCollection.insertOne(incident)
        res.redirect('/')
    }
    else {
        res.redirect('/report')
    }
})


app.listen(3000)