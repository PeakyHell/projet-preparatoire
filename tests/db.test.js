const db_uri = require('../config').db_uri
const incidentsCollection = require('../modules/db').incidentsCollection
const usersCollection = require('../modules/db').usersCollection

describe('Connexion à la base de données', () => {
    it('URI de la base de données valide', async () => {
        expect(
            db_uri.startsWith('mongodb://') || db_uri.startsWith('mongodb+srv://')
        ).toBe(true)
    })

    it('la base de donnée doit contenir une collection Users et une collection Incidents', async () => {
        expect(incidentsCollection).toBeDefined()
        expect(usersCollection).toBeDefined()
    })
})