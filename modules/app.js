const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo');
const router = require('./routes'); // Routes principales

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // Dossier pour les fichiers statiques
app.set('view engine', 'ejs'); // Template Engine

// Session
app.use(
    session({
        secret: 'votreSecretIci',
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: 'mongodb://localhost:27017/votreBase',
        }),
    })
);

// Routes
app.use('/', router);

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
