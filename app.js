const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.set('views', 'public/templates')
app.set()

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.listen(3000)