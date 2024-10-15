const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.set('views', 'public/templates')
app.use(express.static('public/static'))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/auth', (req, res) => {
    res.render('auth')
})

app.get('/report', (req, res) => {
    res.render('report')
})

app.listen(3000)