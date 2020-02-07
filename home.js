const express = require('express')
var mysql = require('mysql')
const app = express()
const port = 8080

app.use(express.static('./'))

app.get('/home', function(req, res) {
	res.sendFile('HomePage.html', {root: __dirname})
});

app.listen(port, () => console.log(`Listening to port ${port}!`))