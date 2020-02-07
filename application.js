const express = require('express')
var mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()
var upload = require('express-fileupload')
const port = 8080

app.use(upload())

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "shuvraks",
  database: "projectdatabase1"
});

con.connect(function(err){
	if(err) throw err;

	console.log('Connected!');
})

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('./'))

app.get('/application', function(req, res) {
	res.sendFile('applicationpage1.html', {root: __dirname})
});

app.post('/submit', function(req, res){

	if(req.files){
		var file = req.files.realFile;
		realFile = file.id; 
	}

	var sql = "INSERT INTO post_job_table VALUES (null, '"+ req.body.name +"',\
	 '"+ req.body.father +"', '"+ req.body.mother +"', '"+ req.body.dateOfBirth +"'\
	 '"+ req.body.gender +"', '"+ req.body.nationality +"', '"+ req.body.religion +"', '"+ req.body.blood +"', \
	 '"+ req.body.option +"', '"+ req.body.option2 +"', '"+ req.body.status +"', '"+ req.body.status +"', '"+ req.body.contact +"',\
	  '"+ req.body.email +"', '"+ req.body.exam +"', '"+ req.body.board +"', '"+ req.body.roll +"', '"+ req.body.reg +"',\
	  '"+ req.body.result +"', '"+ req.body.group +"', '"+ req.body.year +"', '"+ req.body.exam2 +"', '"+ req.body.board2 +"', \
	  '"+ req.body.roll2 +"', '"+ req.body.reg2 +"', '"+ req.body.result2 +"', '"+ req.body.group2 +"', '"+ req.body.year2 +"', \
	  '"+ req.body.exam3 +"', '"+ req.body.subject +"', '"+ req.body.result3 +"', '"+ req.body.institute +"', '"+ req.body.year3 +"',\
	   '"+ req.body.exam4 +"', '"+ req.body.subject2 +"', '"+ req.body.result4 +"', '"+ req.body.institute2 +"',\
	   '"+ req.body.year4 +"', '"+ req.body.skill +"', '"+ req.body.realFile +"')";

	 con.query(sql, function (err, result) {
    if (err) throw err;

    console.log("Inserted!");

   })

	 
})

//con.end();

app.listen(port, () => console.log(`Listening to port ${port}!`))