const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

let incidentsCollection;
let usersCollection;

(async () => {
    try {
        await client.connect();
        const db = client.db('my_project');
        incidentsCollection = db.collection('incidents');
        usersCollection = db.collection('users');
        console.log("Connecté à MongoDB");
    } catch (error) {
        console.error("Erreur de connexion à MongoDB:", error);
    }
})();

module.exports = { incidentsCollection, usersCollection };