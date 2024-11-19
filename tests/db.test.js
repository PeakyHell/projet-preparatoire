const db_uri = require('../config').db_uri
const incidentsCollection = require('../modules/db').incidentsCollection
const usersCollection = require('../modules/db').usersCollection

describe('Database Connection', () => {
    test('Valid Database URI', async () => {
        expect(
            db_uri.startsWith('mongodb://') || db_uri.startsWith('mongodb+srv://')
        ).toBe(true)
    })

    test('Database contains Users and Incidents collections', async () => {
        
    })
})