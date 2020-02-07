var nodemailer = require('nodemailer');
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const port = 8080;

app.use(express.static('./'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



app.get('/user', function(req, res){

  //res.render('id01');
  res.sendFile('userprofile.html', {root: __dirname})

});

app.post('/mail' , function(req, res){

  const mail_id = `${req.body.email}`;
  const pass = `${req.body.psw}`;
  const msg = `${req.body.subject}`;

  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${req.body.email}`,
    pass: `${req.body.psw}`
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




app.listen(port,() => console.log(`Listening to port ${port}!`))