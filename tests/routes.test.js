const request = require('supertest');
const app = require('../modules/app');
const incidentsCollection = require('../modules/db').incidentsCollection
const usersCollection = require('../modules/db').usersCollection


beforeAll(async () => {
    await incidentsCollection.deleteMany({})
    await usersCollection.deleteMany({})
})


// --- Page d'accueil ---
describe("GET /", () => {
    it("doit afficher la page principale", async () => {
        const response = await request(app)
            .get("/")
            .expect(200)
    })
    // it("un utilisateur fait une recherche", async() => {
    //     const response = await request(app)
    //         .post("/")
    //         .send({
    //             search: "test"
    //         })
    //         .expect(302)
    //         .expect('Location', '/')
    // })
})


// --- Page d'authentification ---
describe("GET /auth", () => {
    it("doit afficher la page d'authentification", async () => {
        const response = await request(app)
            .get("/auth")
            .expect(200)
    })

    it("doit rediriger l'utilisateur sur la page d'accueil si il est déjà connecté", async () => {
        await request(app)
            .post("/register")
            .send({
                username: "auth_test",
                password: "password",
                fullname: "Auth Test",
                email: ""
            })

        const response = await request(app)
            .get("/auth")
            .expect(302)
            .expect('Location', '/')
    })
})


// Formulaire de connexion
describe("POST /login", () => {
    it("doit connecter l'utilisateur et le renvoyer sur la page d'accueil", async () => {
        await request(app)
            .post("/register")
            .send({
                username: "test",
                password: "password",
                fullname: "Test User",
                email: "logingtest@loginmail.com"
            })
        
        const response = await request(app)
            .post("/login")
            .send({
                username: "test",
                password: "password"
            })
            .expect(302)
            .expect('Location', '/')
    })

    it("doit renvoyer une erreur si un champ est vide", async () => {
        const response = await request(app)
            .post("/login")
            .send({
                username: "test"
            })
            .expect('Location', '/auth')
    })

    it("it doit renvoyer une erreur si un des champs n'est pas correct", async () => {
        await request(app)
            .post("/register")
            .send({
                username: "logtest",
                password: "motdepasse123",
                fullname: "Login User",
                email: "test@log.com"
            })
        
        const response = await request(app)
            .post("/login")
            .send({
                username: "logtest",
                password: "motdepasse"
            })
            .expect('Location', '/auth')
    })
})


// Formulaire d'inscription
describe("POST /register", () => {
    it("doit inscrire l'utilisateur puis le renvoyer sur la page d'accueil", async () => {
        const response = await request(app)
            .post("/register")
            .send({
                username: "test_user",
                password: "password",
                fullname: "Test User",
                email: "test@mail.com"
            })
            .expect(302)
            .expect('Location', '/')
    })

    it("doit renvoyer une erreur si un champ est vide", async () => {
        const response = await request(app)
            .post("/register")
            .send({
                username: "test",
                password: "password",
                fullname: "Test"
            })
            .expect('Location', '/auth')
    })

    it("doit renvoyer une erreur si le pseudo est déjà pris", async () => {
        await request(app)
            .post("/register")
            .send({
                username: "test",
                password: "password123",
                fullname: "Test",
                email: "test@test.be"
            })
        
        const response = await request(app)
            .post("/register")
            .send({
                username: "test",
                password: "pass",
                fullname: "User",
                email: "mail@test.com"
            })
            .expect('Location', '/auth')
    })

    it("doit renvoyer une erreur si l'email est déjà utilisé", async () => {
        await request(app)
            .post("/register")
            .send({
                username: "testmail",
                password: "pass123word",
                fullname: "Test Mail",
                email: "test@mail.fr"
            })
        
        const response = await request(app)
            .post("/register")
            .send({
                username: "tester",
                password: "passmot",
                fullname: "User Full",
                email: "test@mail.fr"
            })
            .expect('Location', '/auth')
    })
})


// Lien de déconnexion
describe("GET /logout", () => {
    it("doit déconnecter l'utilisateur et le renvoyer à la page d'accueil", async () => {
        const response = await request(app)
            .get("/logout")
            .expect(302)
            .expect('Location', '/')
    })
})


// --- Page de création d'incident ---
describe("GET /report", () => {
    it("doit afficher la page de création d'incident si l'utilisateur est connecté", async () => {
        await request(app)
            .post("/register")
            .send({
                username: "registertest",
                password: "password",
                fullname: "RegTest User",
                email: "reg@mail.abc"
            })
            .expect(302)
            .expect('Location', '/')

        const response = await request(app)
            .get("/report")
            .expect(200)
            .expect('Location', '/report')
    })

    it("doit renvoyer l'utilisateur à la page d'authentification si il n'est pas connecté", async () => {
        const response = await request(app)
            .get("/report")
            .expect(302)
            .expect('Location', '/auth')
    })
})

describe("POST /report", () => {
    it("doit créer un nouvel incident puis renvoyer l'utilisateur sur la page d'accueil", async () => {
        await request(app)
            .post("/register")
            .send({
                username: "reporttest",
                password: "password",
                fullname: "Report User",
                email: "report@mail.com"
            })

        const response = await request(app)
            .post("/report")
            .send({
                description: "Test Incident",
                address: "Rue du test"
            })
            .expect(302)
            .expect('Location', '/')
    })

    it("doit renvoyer une erreur si un champ n'est pas rempli", async () => {
        await request(app)
            .post("/register")
            .send({
                username: "reptest",
                password: "passworder",
                fullname: "Reporter",
                email: "rep@rep.rep"
            })
        const response = await request(app)
            .post("/report")
            .send({
                description: "Test Incident"
            })
            .expect('Location', '/report')
    })

    it("doit renvoyer une erreur si la description est trop longue", async () => {
        await request(app)
            .post("/register")
            .send({
                username: "longtest",
                password: "longpassword",
                fullname: "Long Test",
                email: "long@test.com"
            })

        const response = await request(app)
            .post("/report")
            .send({
                description: ` AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                    AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                    AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                    AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                    AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                    AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                    `,
                address: "Rue du long test"
            })
            .expect('Location', '/report')
    })
})