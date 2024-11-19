const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const https = require('https')
const fs = require('fs')
const sha256 = require('js-sha256')

const db = require('./db')
const app = express()


app.set('view engine', 'ejs')
app.set('views', 'public/templates')
app.use(express.static('public/static'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: require('./config').session_secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: true,
    }
}));


// --- Connexion à la base de données ---
const incidentsCollection = db.collection('Incidents')
const usersCollection = db.collection('Users')


// --- Routes ---
// Page d'accueil
app.get('/', async (req, res) => {
    let incidentsList = await incidentsCollection.find().sort({date: 1}).toArray()
    res.render('base', {
        title: 'Home',
        content: 'index',
        username: req.session.username || null,
        incidents: incidentsList
    })
})


// Fonction de recherche
app.post('/', async (req, res) => {

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
            username: req.session.username || null,
            error: req.session.error || null
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
            req.session.error = null
            res.redirect('/')
        }
        else {
            req.session.error = 'Le pseudo et/ou le mot de passe est incorrect'
            res.redirect('/auth')
        }
    }
    else {
        req.session.error = 'Veuillez remplir tous les champs'
        res.redirect('/auth')
    }
})


// Formulaire d'inscritpion
app.post('/register', async (req, res) => {
    const { username, password, fullname, email } = req.body
    if (username && password && fullname && email) {
        let user = await usersCollection.findOne({ username: username }) || null
        if (user) {
            req.session.error = 'Ce pseudo est déjà pris'
            res.redirect('auth')
        }
        else {
        user = {
            username: username,
            // TODO Hasher le mot de passe
            password: sha256(password),
            fullname: fullname,
            email: email
        }
        await usersCollection.insertOne(user)
        req.session.error = null
        req.session.username = username
        res.redirect('/')
        }
    }
    else {
        req.session.error = 'Veuillez remplir tous les champs'
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


// Formulaire de création d'incidents
app.post('/report', async (req, res) => {
    const { description, address } = req.body
    if (description && address) {
        let date = new Date()
        let incident = {
            description: description,
            address: address,
            user: req.session.username,
            date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        }
        await incidentsCollection.insertOne(incident)
        res.redirect('/')
    }
    else {
        res.redirect('/report')
    }
})

https.createServer({
    key: fs.readFileSync('./key.pem', 'utf8'),
    cert: fs.readFileSync('./cert.pem', 'utf8'),
    passphrase: require('./config').server_passphrase
}, app).listen(3000)
