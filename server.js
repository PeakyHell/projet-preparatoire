const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const router = require('./routes/router');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'mySecret', resave: false, saveUninitialized: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

const PORT = 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
