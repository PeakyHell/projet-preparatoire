const MongoClient = require('mongodb').MongoClient

const uri = require('../config').db_uri
const db_name = require('../config').db_name

const client = new MongoClient(uri)
const db = client.db(db_name)


const incidentsCollection = db.collection('Incidents')
const usersCollection = db.collection('Users')

module.exports = {
    incidentsCollection,
    usersCollection
}