const express = require('express')
var mysql = require('mysql')
var http = require('http')
var session = require('express-session');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const path = require('path')
const app = express();
var upload = require('express-fileupload')
var flash = require('req-flash')
const jsdom = require('jsdom');
var nodemailer = require('nodemailer');
var pdf = require('html-pdf');
ejs = require('ejs');
//const { JSDOM } = jsdom;
const port = 8080


app.use(upload())
app.set('view engine', 'ejs');
app.set('view engine', 'pug');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "shuvraks",
  database: "projectdatabase1",
  debug: false,
  multipleStatements: true
});

con.connect(function(err){
	if(err) throw err;

	console.log('Connected!');
})

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('./'))
app.use(bodyParser.json());

/*global.document = new JSDOM('ApplicationPage2.html').window.document;
global.pass = document.getElementsByName('serial')[0];
global.serial = " ";
if (pass) {
    serial = pass.value;
}*/

//var serial;
app.get('/login', function(req, res) {
	res.sendFile('loginpage1.html', {root: __dirname})
});

app.get('/signin', function(req, res) {
	res.sendFile('loginadmin.html', {root: __dirname})
});

app.get('/home', function(req, res) {
	res.sendFile('HomePage.html', {root: __dirname})
});

app.get('/application', function(req, res) {
	res.sendFile('ApplicationPage2.html', {root: __dirname})
});

app.get('/personal', function(req, res) {
	res.sendFile('ApplicationPage3.html', {root: __dirname})
});

app.get('/educational', function(req, res) {
	res.sendFile('ApplicationPage4.html', {root: __dirname})
});

app.get('/secondary', function(req, res) {
	res.sendFile('ApplicationPage5.html', {root: __dirname})
});

app.get('/bank', function(req, res) {
	res.sendFile('ApplicationPage6.html', {root: __dirname})
});

app.get('/jobpost', function(req, res) {
	res.sendFile('postjobaadmin.html', {root: __dirname})
});

app.get('/user', function(req, res) {
	con.query("SELECT * FROM post_job_table;", function(err, rows, fields){
		if(err) throw err
			//pl = rows;
	console.log("Data Selected!");
	console.log(rows);
	res.render('userprofile.ejs',{title: 'RUET: Job Portal/user', players:rows})
});
});

app.get('/admin', function(req, res) {
	con.query("SELECT * FROM user1;", function(err, rows, fields){
		if(err) throw err
			//pl = rows;
	console.log("Data Selected!");
	console.log(rows);
	res.render('adminprofile.ejs',{title: 'RUET: Job Portal/Admin', players:rows})
});
});

app.post('/apply', function(req, res){
	res.redirect('/application')
})
 											/* User Log-in Section*/

app.post('/auth', function(request, response) {
	var email = request.body.email;
	var password = request.body.password;
	//console.log(password);
	if (email && password) {
		con.query('SELECT password FROM user_reg_info WHERE email = ? ', email, function(error, results, fields) {
			bcrypt.compare(password, results[0].password, function(error, results) {
			if (results) {
				request.session.loggedin = true;
				request.session.email = email;
				response.redirect('/goto');
			} else {
				response.send('Incorrect E-mail and/or Password!');
			}			
			response.end();
		});
		});
	} else {
		response.send('Please enter E-mail and Password!');
		response.end();
	}
});

app.get('/goto', function(request, response) {
	if (request.session.loggedin) {
		response.redirect('/user');
	} else {
		response.send('Please login to view this page! <a href="/login"> Log-in </a>');
	}
	response.end();
});


app.post('/register', function(request, response){
	var psw = request.body.password;
	request.body.password = bcrypt.hashSync(psw, 10);
	//console.log(request.body.password );
	var sql = "INSERT INTO user_reg_info (`name`, `email`, `password`, `qualification`, `DOB`, `type`, `contact`) VALUES ('"+request.body.name+"', '"+request.body.email+"', \
	'"+request.body.password+"', '"+request.body.qualification+"', '"+request.body.dateOfBirth+"', '"+request.body.option+"', '"+request.body.contact+"')";

	 con.query(sql, function(err){
		if(err) throw err
	console.log("Data Inserted!");
	response.redirect('/goto');
	})

});

app.get('/logout', (req, res, next) => {
    // Check if the session is exist
    if(req.session.loggedin) {
        // destroy the session and redirect the user to the index page.
        req.session.destroy(function() {
            res.redirect('/login');
        });
    }
});

										/* Admin Log-in Section*/

app.post('/match', function(request, response) {
	var email = request.body.email;
	var password = request.body.password;
	//console.log(password);
	if (email && password) {
		con.query('SELECT password FROM admin_reg_info WHERE email = ? ', email, function(error, results, fields) {
			bcrypt.compare(password, results[0].password, function(error, results) {
			if (results) {
				request.session.loggedin = true;
				request.session.email = email;
				response.redirect('/moveto');
			} else {
				response.send('Incorrect E-mail and/or Password!');
			}			
			response.end();
		});
		});
	} else {
		response.send('Please enter E-mail and Password!');
		response.end();
	}
});

app.get('/moveto', function(request, response) {
	if (request.session.loggedin) {
		response.redirect('/admin');
	} else {
		response.send('Please login to view this page! <a href="/signin"> Log-in </a>');
	}
	response.end();
});


app.post('/entry', function(request, response){
	var psw = request.body.password;
	request.body.password = bcrypt.hashSync(psw, 10);
	//console.log(request.body.password );
	var sql = "INSERT INTO admin_reg_info (`email`, `password`, `designation`) VALUES ('"+request.body.email+"', \
	'"+request.body.password+"', '"+request.body.designation+"')";

	 con.query(sql, function(err){
		if(err) throw err
	console.log("Data Inserted!");
	response.redirect('/moveto');
	})

});

app.get('/signout', (req, res, next) => {
    // Check if the session is exist
    if(req.session.loggedin) {
        // destroy the session and redirect the user to the index page.
        req.session.destroy(function() {
            res.redirect('/signin');
        });
    }
});

										/* Application Section*/

app.post('/submit', function(req, res){
	
	 serial = req.body.serial;
	//console.log(serial);
	var sql = "insert into user1(`user_id`, `title`, `section`) values('"+req.body.serial+"', '"+ req.body.job+"', '"+ req.body.dept+"')"
	
	con.query(sql, function(err){
		if(err) throw err
	console.log("Data Inserted!");
   // console.log(serial);
   //alert("Data Saved Successfully!!!Are You Sure to Move next");
	res.redirect('/personal')

	
	})
   })

app.post('/final', function(req, res){
	//
	
	con.query("SELECT user_id FROM user1 ORDER BY id DESC LIMIT 1;", function(err, result){
		if(err) throw err
			
	console.log("Data Selected!");
	console.log(result);
	//console.log(fields);
	var serial = result[0].user_id;
	console.log(serial);
	//console.log("Data Inserted!");
	var sql = "insert into user5(`bank_draft_no`, `amount`, `bank_name`, `issue_date`, `user_no`) values('"+ req.body.bank_draft+"', "+ req.body.amount+" , '"+ req.body.bank_name+"', '"+ req.body.issueDate+"', '"+serial+"')"
	con.query(sql, function(err, rows, fields){
		if(err) throw err
	console.log("Data Inserted!");
	})
	})
   })

app.post('/save', function(req, res){

	con.query("SELECT user_id FROM user1 ORDER BY id DESC LIMIT 1;", function(err, result){
		if(err) throw err
			
	console.log("Data Selected!");
	console.log(result);
	//console.log(fields);
	var serial = result[0].user_id;
	console.log(serial);
	var sql = "insert into user2(`name`, `father_name`, `mother_name`, `birth_date`, `gender`, `nationality`, `email`, \
			`contact`, `religion`, `blood_group`, `tribal`, `marrital_status`, `national_id`, `district`, `present_address`, `permanent_address`, `user_no`)\
	values('"+ req.body.name+"', '"+ req.body.father+"' , '"+ req.body.mother+"', '"+ req.body.dateOfBirth+"', '"+ req.body.gender+"'\
	, '"+ req.body.nationality+"', '"+ req.body.email+"', '"+ req.body.contact+"', '"+ req.body.religion+"', '"+ req.body.blood+"', '"+ req.body.option+"'\
	, '"+ req.body.option2+"', '"+ req.body.national+"', '"+ req.body.district+"', '"+ req.body.status+"', '"+ req.body.status2+"', '"+serial+"')"
	
	con.query(sql, function(err){
		if(err) throw err
	console.log("Data Inserted!");
	//res.render('applicantlist',{title: 'Data Saved', message: 'Data Saved Successfully!!!'})
	res.redirect('/educational')
	})
	})
   })

app.post('/ssc', function(req, res){
	
	con.query("SELECT user_id FROM user1 ORDER BY id DESC LIMIT 1;", function(err, result){
		if(err) throw err
			
	console.log("Data Selected!");
	console.log(result);
	//console.log(fields);
	var serial = result[0].user_id;
	console.log(serial);
	var sql = "insert into ssc_info (`roll_no`, `reg_no`, `result`, `board`, `group`, `year`, `user_no`) values ('"+ req.body.roll+"', '"+ req.body.reg+"' , '"+ req.body.result+"', '"+ req.body.board+"', '"+ req.body.group+"', '"+ req.body.year+"', '"+serial+"')"
	console.log(sql)
	
	con.query(sql, function(err){
		if(err) throw err
	console.log("Data Inserted!");
	
	})
	})
   })


app.post('/hsc', function(req, res){
	
	con.query("SELECT user_id FROM user1 ORDER BY id DESC LIMIT 1;", function(err, result){
		if(err) throw err
			
	console.log("Data Selected!");
	console.log(result);
	//console.log(fields);
	var serial = result[0].user_id;
	console.log(serial);
	var sql = "insert into hsc_info(`roll_no`, `reg_no`, `result`, `board`, `group`, `year` , `user_no`) values('"+ req.body.roll_2+"', '"+ req.body.reg_2+"' , '"+ req.body.result_2+"', '"+ req.body.board_2+"', '"+ req.body.group_2+"', '"+ req.body.year_2+"', '"+serial+"')"

	con.query(sql, function(err){
		if(err) throw err
	console.log("Data Inserted!");
	//res.render('applicantlist',{title: 'Data Saved', message: 'Data Saved Successfully!!!'})
	
	})
	})
   })

app.post('/primary', function(req, res){
	if (req.files){
		let file = req.files.certification;
		var file_name=file.name;
	
	
	file.mv('./files/'+file.name, function(err) {
                     if (err)
	                return res.status(500).send(err)
 con.query("SELECT user_id FROM user1 ORDER BY id DESC LIMIT 1;", function(err, result){
		if(err) throw err
			
	console.log("Data Selected!");
	console.log(result);
	//console.log(fields);
	var serial = result[0].user_id;
	console.log(serial);
	var sql = "INSERT INTO primaryinfo(`class`,`result`,`institution` ,`description`, `certificate`, `user_no`) VALUES ('" + req.body.standard+ "',\
	'" + req.body.result4 + "','" + req.body.institute + "','" + req.body.description + "','" + file_name + "', '"+serial+"')";
 
 
	con.query(sql, function(err){
		if(err) throw err
	console.log("Data Inserted!");
	
		})
			})
		})
		}
		//res.render('applicantlist',{title: 'Data Saved', message: 'Data Saved Successfully!!!'})
	})
   
app.post('/graduate', function(req, res){
	
	console.log(req.body);
	con.query("SELECT user_id FROM user1 ORDER BY id DESC LIMIT 1;", function(err, result){
		if(err) throw err
			
	console.log("Data Selected!");
	console.log(result);
	//console.log(fields);
	var serial = result[0].user_id;
	console.log(serial);
	var sql = "insert into graduate_info(`subject`, `result`, `year`, `special_field`, `institution`, `user_no`) values('"+ req.body.subject+"', '"+ req.body.result_five+"' , '"+ req.body.year_four+"', \
	'"+ req.body.field+"', '"+ req.body.institute_two+"', '"+serial+"')"

	con.query(sql, function(err){
		if(err) throw err
	console.log("Data Inserted!");
	
	})
	})
   })


app.post('/postgraduate', function(req, res){
	
	console.log(req.body);
	con.query("SELECT user_id FROM user1 ORDER BY id DESC LIMIT 1;", function(err, result){
		if(err) throw err
			
	console.log("Data Selected!");
	console.log(result);
	//console.log(fields);
	var serial = result[0].user_id;
	console.log(serial);
	var sql = "insert into postgraduate_info(`subject`, `result`, `year`, `special_field`, `institution`,`user_no`) values('"+ req.body.subject_two+"', '"+ req.body.result_six+"' , '"+ req.body.year_five+"', \
	'"+ req.body.field_two+"', '"+ req.body.institute_three+"', '"+serial+"')"

	con.query(sql, function(err){
		if(err) throw err
	console.log("Data Inserted!");
	
	})
	})
   })

app.post('/phd', function(req, res){
	
	console.log(req.body);
	con.query("SELECT user_id FROM user1 ORDER BY id DESC LIMIT 1;", function(err, result){
		if(err) throw err
			
	console.log("Data Selected!");
	console.log(result);
	//console.log(fields);
	var serial = result[0].user_id;
	console.log(serial);
	var sql = "insert into phd_info(`subject`, `research_field`, `institution`, `research_paper`, `supervisor`, `journal`, `pub_year`,`user_no`) values('"+ req.body.subject_three+"', '"+ req.body.research+"' , '"+ req.body.institute_four+"', \
	'"+ req.body.description_two+"', '"+ req.body.sup+"', '"+req.body.journal+"', '"+req.body.p_year+"', '"+serial+"')"

	con.query(sql, function(err){
		if(err) throw err
	console.log("Data Inserted!");
	})
	})
   })

app.post('/Ohigher', function(req, res){
	
	console.log(req.body);
	con.query("SELECT user_id FROM user1 ORDER BY id DESC LIMIT 1;", function(err, result){
		if(err) throw err
			
	console.log("Data Selected!");
	console.log(result);
	//console.log(fields);
	var serial = result[0].user_id;
	console.log(serial);
	var sql = "insert into helpful_info(`field_name`, `degree`, `recognition`, `institution`,`user_no`) values('"+ req.body.f_name+"', '"+ req.body.degree+"' , '"+ req.body.rec_two+"', \
	'"+ req.body.institute_five+"','"+serial+"')"

	con.query(sql, function(err){
		if(err) throw err
	console.log("Data Inserted!");
	//res.render('applicantlist',{title: 'Data Saved', message: 'Data Saved Successfully!!!'})
	
	})
	})
   })


app.post('/secondary', function(req, res){
	
	if(req.files){
		let file_one = req.files.resume;
		var resume = file_one.name; 

		let file_two = req.files.image;
		var image = file_two.name; 

		let file_three = req.files.signature;
		var signature = file_three.name; 

		file_one.mv('./files/'+file_one.name, function(err) {
                     if (err)
	                return res.status(500).send(err)
	      })
	     file_two.mv('./files/'+file_two.name, function(err) {
                     if (err)
	      	        return res.status(500).send(err)
	      })
	      file_three.mv('./files/'+file_three.name, function(err) {
                     if (err)
	                return res.status(500).send(err)
	      })
	con.query("SELECT user_id FROM user1 ORDER BY id DESC LIMIT 1;", function(err, result){
		if(err) throw err
			
	console.log("Data Selected!");
	console.log(result);
	//console.log(fields);
	var serial = result[0].user_id;
	console.log(serial);
	      var sql = "INSERT INTO `user4`(`skill`,`litigation`,`resume`, `photo` ,`signature`, `user_no`) VALUES ('" + req.body.skill+ "',\
		'" + req.body.cases + "','" + resume + "','" + image + "','" + signature + "','"+serial+"')";
	 
		con.query(sql, function(err){
			if(err) throw err
		console.log("Data Inserted!");
		//res.render('applicantlist',{title: 'Data Saved', message: 'Data Saved Successfully!!!'})
		res.redirect('/bank')
		})
		})

	}

	
	})

									/*Applicant view portion*/
   
app.post('/view', function(req, res) {

	var pl, per, bank, ssc, hsc;
	//var sql = "SELECT * FROM user1 WHERE user_id ='513315169'; SELECT * FROM user2 WHERE user_no ='513315169'; SELECT * FROM ssc_info WHERE user_no ='513315169';\
	//SELECT * FROM hsc_info WHERE user_no ='513315169'; SELECT * FROM user5 WHERE user_no ='513315169'";
	con.query("SELECT * FROM user1 WHERE user_id ='"+req.body.appId+"'; SELECT * FROM user2 WHERE user_no ='"+req.body.appId+"'; SELECT * FROM ssc_info WHERE user_no ='"+req.body.appId+"';\
	SELECT * FROM hsc_info WHERE user_no ='"+req.body.appId+"'; SELECT * FROM graduate_info WHERE user_no ='"+req.body.appId+"'; SELECT * FROM postgraduate_info WHERE user_no ='"+req.body.appId+"'; SELECT * FROM phd_info WHERE user_no ='"+req.body.appId+"';\
	SELECT * FROM helpful_info WHERE user_no ='"+req.body.appId+"'; SELECT skill, litigation FROM user4 WHERE user_no ='"+req.body.appId+"'; SELECT * FROM user5 WHERE user_no ='"+req.body.appId+"';", function(err, rows, fields){
		if(err) throw err
			//pl = rows;
	console.log("Data Selected!");
	console.log(rows);
	res.render('showApplicant.ejs',{title: 'RUET: Job Portal/User/Application Form', players:rows[0] ,personals:rows[1], sscs:rows[2], hscs:rows[3], graduates:rows[4], postgraduates:rows[5], phds:rows[6], helps:rows[7], seconds:rows[8], banks:rows[9]})
	
	});

})

									/*  Post job portion*/

app.post('/savejob', function(req, res){
	
	var sql = "insert into post_job_table(`job_no`, `job_name`, `dept`, `responsibility`, `requirement`, `salary`, `deadline`) \
	values('"+req.body.job+"', '"+ req.body.name+"', '"+ req.body.dept+"', '"+ req.body.detail+"', '"+ req.body.status+"', '"+ req.body.salary+"', '"+ req.body.deadline+"')"
	
	con.query(sql, function(err){
		if(err) throw err
	console.log("Data Inserted!");
	//res.redirect('/personal')

	
	})
   })

									/* Email portion*/	

app.post('/mail' , function(req, res){

  const mail_id = `${req.body.email}`;
  const pass = `${req.body.psw}`;
  const msg = `${req.body.subject}`;

  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: mail_id,
    pass: pass
   } 
  });

  var mailOptions = {
    from:mail_id ,
    to: 'syedarifuzzaman1111@gmail.com',
    subject: 'Sending Email using Node.js',
    text: msg
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.render('id03', {msgs:'Email has been sent'});
    }
  });

});
/*app.get('/pdf-btn', function(req, res) {

	var options = { filename: 'ApplicationDocument.pdf', format: 'A4', orientation: 'portrait', directory: 'C:/Users/Nasif Osman/Downloads/',type: "pdf" };

	pdf.create(html, options).toFile(function(err, res) {
    	if (err) return console.log(err);
        	 console.log(res);
    });
});*/




//con.end();

app.listen(port, () => console.log(`Listening to port ${port}!`))