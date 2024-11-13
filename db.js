const MongoClient = require('mongodb').MongoClient

// TODO Modifier l'adresse de la base de données
const uri = ''

const client = new MongoClient(uri)
const db = client.db('Projet')

module.exports = db