const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var mysql = require("mysql");
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'visman',
  password        : 'abcd1234',
  database        : 'visman'
});

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youremail@gmail.com', // enter you Gmail email here
    pass: 'yourpassword' // enter password
  }
});


console.log("DB connected!");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));

app.get("/",function(req,res){
	res.redirect("/new");
});

app.get("/new",function(req,res){
	res.render("new");
});

app.post("/new",function(req,res){
	var queryStr = "INSERT INTO Entries VALUES (NULL,'"+req.body.VName+"','"+req.body.VEmail+"',"+req.body.VPhone+",'"+req.body.VCheckInTime+"',NULL,'"+req.body.HName+"','"+req.body.HEmail+"',"+req.body.HPhone+");";
	console.log(queryStr);
	var visitorDetails = "Visitor Details:- \n\nName: "+req.body.VName+"\nEmail: "+req.body.VEmail+"\nPhone: "+req.body.VPhone;
	pool.query(queryStr,function(error,results,fields){
		if(error){
			throw error;
		}else{
			var mailOptions = {
			  from: 'fromemail@gmail.com', 
			  to: 'toemail@gmail.com',
			  subject: 'You have a Visitor',
			  text: visitorDetails
			};
			console.log(mailOptions);
			transporter.sendMail(mailOptions, function(error, info){
			  if (error) {
			    console.log(error);
			  } else {
			    console.log('Email sent: ' + info.response);
			  }
			});
		}
	})
});






app.listen(3000,function(){
	console.log("Server is online!");
});