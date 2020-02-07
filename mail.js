var nodemailer = require('nodemailer');
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const port = 8080;

app.use(express.static('./'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



app.get('/admin', function(req, res){

  //res.render('id01');
  res.sendFile('adminprofile.html', {root: __dirname})

});

app.post('/send' , function(req, res){

  const mail_id = `${req.body.email}`;
  const msg = `${req.body.subject}`;

  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nasifosman0210@gmail.com',
    pass: 'neeldgonte'
   } 
  });

  var mailOptions = {
    from: 'nasifosman0210@gmail.com',
    to: mail_id,
    subject: 'Sending Email using Node.js',
    text: msg
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.render('id01', {msgs:'Email has been sent'});
    }
  });

});




app.listen(port,() => console.log(`Listening to port ${port}!`))