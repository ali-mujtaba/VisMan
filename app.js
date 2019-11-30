const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mysql = require("mysql");
const nodemailer = require('nodemailer');
const Nexmo = require('nexmo');

const orgAddress = "FRK Hostel, Jamia Millia Islamia"; //update organisation address here

dotenv.config();

const DB_host = process.env.DATABASE_HOST || 'localhost';
const DB_user = process.env.DATABASE_USER || 'visman';
const DB_pass = process.env.DATABASE_PASS || 'abcd1234';
const DB_name = process.env.DATABASE_NAME || 'visman';

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : DB_host,
  user            : DB_user,
  password        : DB_pass,
  database        : DB_name
});


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SERVICING_GMAIL_ID, // enter your Gmail email here
    pass: process.env.SERVICING_GMAIL_PASS // enter password
  }
});


const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET,
});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

app.get("/",function(req,res){
	res.render("home");
});

app.post("/",function(req,res){
	res.redirect("/appointments/"+req.body.refNo);
})

app.get("/appointments/new",function(req,res){
	res.render("new");
});

app.post("/appointments",function(req,res){
	
	var queryStr = "INSERT INTO Entries VALUES (NULL,'"+req.body.VName+"','"+req.body.VEmail+"',"+req.body.VPhone+",'"+req.body.VCheckInTime+"',NULL,'"+req.body.HName+"','"+req.body.HEmail+"',"+req.body.HPhone+", NULL"+");";
	
	var visitorDetails = "Visitor Details:- \n\nName: "+req.body.VName+"\nEmail: "+req.body.VEmail+"\nPhone: "+req.body.VPhone;
	
	pool.query(queryStr,function(error,results,fields){
		if(error){
			console.log(error);
			res.redirect("/");
		}else{
			var mailOptions = {
			  from: process.env.SERVICING_GMAIL_ID, 
			  to: req.body.HEmail,
			  subject: 'VisMan: You have a Visitor',
			  text: visitorDetails
			};

			transporter.sendMail(mailOptions, function(error, info){
			  if (error) {
			    console.log(error);
			  } else {
			    console.log('Email sent: ' + info.response);
			    const from = 'VisMan';
				// var to = '917042104749'; // hard coding the host phone number since only this number is whitelisted on nexmo trial account
			    var to = "91"+req.body.HPhone; // un-comment to replace hard-coded number with host phone number
			    
			    nexmo.message.sendSms(from, to, visitorDetails);
			    res.redirect("/appointments/"+results.insertId);
			  }
			});
		}
	});
});

app.get("/appointments/:Reference_No",function(req,res){
	var queryStr = "SELECT * FROM Entries WHERE Reference_No="+req.params.Reference_No+";";
	pool.query(queryStr,function(error,results,fields){
		if(error){
			console.log(error);
			res.redirect("/");
		}else{
			if(results[0]==undefined){
				res.send("Invalid Reference Number");
			}else{
				res.render("show",{entry:results[0]});
			}
		}
	});
});

app.put("/appointments/:Reference_No",function(req,res){
	var queryStr = "UPDATE Entries SET VCheckOutTime='"+req.body.VCheckOutTime+"' WHERE Reference_No="+req.params.Reference_No+";";
	
	var visitDetails = "Visit Details:- \n\nName: "+req.body.VName+"\nPhone: "+req.body.VPhone+"\nCheck-in time: "+req.body.VCheckInTime+"\nCheck-out time: "+req.body.VCheckOutTime+"\nHost Name: "+req.body.HName+"\nAddress Visited: "+orgAddress;

	pool.query(queryStr,function(error,results,fields){
		if(error){
			console.log(error);
			res.redirect("/");
		} else {
			var mailOptions = {
			  from: process.env.SERVICING_GMAIL_ID, 
			  to: req.body.VEmail,
			  subject: 'VisMan: Thank you for visiting!',
			  text: visitDetails
			};

			transporter.sendMail(mailOptions, function(error, info){
			  if (error) {
			    console.log(error);
			  } else {
	  				res.send("Thank you for visiting!");
				}
			});
		}
	});
});

const port = process.env.PORT || 3000;
app.listen(port,process.env.IP,function(){
	console.log("Server is online!");
});