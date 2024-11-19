const https = require('https')
const fs = require('fs')

const app = require('./modules/routes')

https.createServer({
    key: fs.readFileSync('./key.pem', 'utf8'),
    cert: fs.readFileSync('./cert.pem', 'utf8'),
    passphrase: require('./config').server_passphrase
}, app).listen(3000)
