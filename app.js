const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.set('views', 'public/templates')
app.use(express.static('public/static'))

app.get('/', (req, res) => {
    res.render('base', {
        title: 'Home',
        content: 'index'
    })
})

app.get('/auth', (req, res) => {
    res.render('base', {
        title: 'Auth',
        content: 'auth'
    })
})

app.get('/report', (req, res) => {
    res.render('base', {
        title: 'Report',
        content: 'report'
    })
})

app.listen(3000)