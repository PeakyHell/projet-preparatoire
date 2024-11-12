const express = require('express')
const session = require('express-session')
const app = express()


app.set('view engine', 'ejs')
app.set('views', 'public/templates')
app.use(express.static('public/static'))


app.use(session({
    secret: 'propre123'
}));


app.get('/', (req, res) => {
    res.render('base', {
        title: 'Home',
        content: 'index'
    })
})

app.get('/auth', (req, res) => {
    if (req.session.username) {
        res.redirect('/')
    }
    else {
        res.render('base', {
            title: 'Auth',
            content: 'auth'
        })
    }
})

app.get('/report', (req, res) => {
    if (req.session.username) {
        res.render('base', {
            title: 'Report',
            content: 'report'
        })
    }
    else {
        res.redirect('/auth')
    }    
})

app.listen(3000)