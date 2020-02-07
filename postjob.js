const express = require('express')
var mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()
const port = 8080

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

app.get('/postjob', function(req, res) {
	res.sendFile('postjobaadmin.html', {root: __dirname})
});

app.post('/submit', function(req, res){

	var sql = "INSERT INTO post_job_table (job_no, job_name, dept, responsibility,\
	requirement, salary, deadline) VALUES ('"+ req.body.job +"',\
	 '"+ req.body.name +"', '"+ req.body.dept +"', '"+ req.body.detail +"'\
	 '"+ req.body.status +"', '"+ req.body.salary +"', '"+ req.body.deadline +"')";

	 con.query(sql, function (err, result) {
    if (err) throw err;

    console.log("Inserted!");

   })

	 //con.end();
})


app.listen(port, () => console.log(`Listening to port ${port}!`))