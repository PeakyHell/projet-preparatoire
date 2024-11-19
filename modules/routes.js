if (!incidentsCollection || !usersCollection) {
    console.error("Collections MongoDB non initialisées. Vérifie la connexion.");
    process.exit(1);
}

console.log
// routes.js
const express = require('express');
const sha256 = require('js-sha256');
const { incidentsCollection, usersCollection } = require('./db');
const { tf_idf } = require('./search');

const router = express.Router();
console.log
// Page d'accueil
router.get('/', async (req, res) => {
  let incidentsList = await incidentsCollection.find().sort({ date: -1 }).toArray();
  res.render('index', {
    title: 'Home',
    username: req.session.username || null,
    incidents: incidentsList
  });
});

// Fonction de recherche
router.post('/', async (req, res) => {
  const searchQuery = req.body.searchQuery.toLowerCase();  // Requête de recherche
  const documents = await incidentsCollection.find().toArray();  // Récupérer tous les incidents
  console.log
  try {
    // Filtrer les documents avec un score TF-IDF non nul
    const results = documents.filter(doc => {
      const description = doc.description.toLowerCase();
      const score = tf_idf(searchQuery, description, documents);  // Calculer le score
      return score > 0;  // Conserver les documents pertinents
    });
    console.log
    // Si aucun résultat n'est trouvé
    if (results.length === 0) {
      return res.render('index', {
        title: 'Recherche',
        username: req.session.username || null,
        incidents: [],
        message: 'Aucun incident trouvé pour votre recherche.'
      });
    }console.log
    console.log
    // Trier les résultats par score décroissant
    const sortedResults = results.sort((a, b) => {
      const scoreA = tf_idf(searchQuery, a.description.toLowerCase(), documents);
      const scoreB = tf_idf(searchQuery, b.description.toLowerCase(), documents);
      return scoreB - scoreA;  // Trier par score décroissant
    });
    console.log
    // Afficher les résultats
    res.render('index', {
      title: 'Recherche',
      username: req.session.username || null,
      incidents: sortedResults,
      message: ''
    });

  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.render('index', {
      title: 'Recherche',
      username: req.session.username || null,
      incidents: [],
      message: 'Une erreur est survenue lors de la recherche.'
    });
  }
});

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
            date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
        }
        await incidentsCollection.insertOne(incident)
        res.redirect('/')
    }
    else {
        res.redirect('/report')
    }
})

module.exports = router;