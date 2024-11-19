const sha256 = require('js-sha256')

const express = require('express')
const router = express.Router()

const incidentsCollection = require('./db').incidentsCollection
const usersCollection = require('./db').usersCollection


// Page d'accueil
router.get('/', async (req, res) => {
    let incidentsList = await incidentsCollection.find().sort({date: -1}).toArray()
    res.render('base', {
        title: 'Home',
        content: 'index',
        username: req.session.username || null,
        incidents: incidentsList
    })
})


// Fonction de recherche
router.post('/', async (req, res) => {

    let documents = await incidentsCollection.find().toArray()

})


// Page de connexion / inscription
router.get('/auth', (req, res) => {
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
router.post('/login', async (req, res) => {
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
router.post('/register', async (req, res) => {
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
router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})


// Page de création d'incidents
router.get('/report', (req, res) => {
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
router.post('/report', async (req, res) => {
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

module.exports = router