const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.set('views', 'public/templates')
app.use(express.static('public/static'))

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(3000)