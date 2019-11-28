const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var methodOverride = require('method-override');
const orgAddress = "FRK Hostel, Jamia Millia Islamia"; //update organisation address here
var mysql = require("mysql");
const nodemailer = require('nodemailer');
const Nexmo = require('nexmo');

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'visman',
  password        : 'abcd1234',
  database        : 'visman'
});


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mujtaba.ali42@gmail.com', // enter you Gmail email here
    pass: '*ALImujtaba@gmail' // enter password
  }
});


const nexmo = new Nexmo({
  apiKey: '49c7d071',
  apiSecret: 'dVrJ2ThHRqD5L1zC',
});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

app.get("/",function(req,res){
	res.redirect("/new");
});

app.get("/new",function(req,res){
	res.render("new");
});

app.post("/new",function(req,res){
	
	var queryStr = "INSERT INTO Entries VALUES (NULL,'"+req.body.VName+"','"+req.body.VEmail+"',"+req.body.VPhone+",'"+req.body.VCheckInTime+"',NULL,'"+req.body.HName+"','"+req.body.HEmail+"',"+req.body.HPhone+");";
	
	var visitorDetails = "Visitor Details:- \n\nName: "+req.body.VName+"\nEmail: "+req.body.VEmail+"\nPhone: "+req.body.VPhone;
	
	pool.query(queryStr,function(error,results,fields){
		if(error){
			throw error;
		}else{
			var mailOptions = {
			  from: 'mujtaba.ali42@gmail.com', 
			  to: req.body.HEmail,
			  subject: 'You have a Visitor',
			  text: visitorDetails
			};

			transporter.sendMail(mailOptions, function(error, info){
			  if (error) {
			    console.log(error);
			  } else {
			    console.log('Email sent: ' + info.response);
			    const from = 'VisMan';
				var to = '917042104749'; // hard coding the host phone number since only this number is whitelisted on nexmo trial account
			    // to = "91"+req.body.HPhone; // un-comment to replace hard-coded number with host phone number
			    
			    nexmo.message.sendSms(from, to, visitorDetails);
			    res.redirect("/"+results.insertId);
			  }
			});
		}
	});
});

app.get("/:Reference_No",function(req,res){
	var queryStr = "SELECT * FROM Entries WHERE Reference_No="+req.params.Reference_No+";";
	pool.query(queryStr,function(error,results,fields){
		if(error){
			throw error;
		}else{
			res.render("show",{entry:results[0]});
		}
	});
});

app.put("/:Reference_No",function(req,res){
	var queryStr = "UPDATE Entries SET VCheckOutTime='"+req.body.VCheckOutTime+"' WHERE Reference_No="+req.params.Reference_No+";";
	
	var visitDetails = "Visit Details:- \n\nName: "+req.body.VName+"\nPhone: "+req.body.VPhone+"\nCheck-in time: "+req.body.VCheckInTime+"\nCheck-out time: "+req.body.VCheckOutTime+"\nHost Name: "+req.body.HName+"\nAddress Visited: "+orgAddress;

	pool.query(queryStr,function(error,results,fields){
		if(error){
			throw error;
		} else {
			var mailOptions = {
			  from: 'mujtaba.ali42@gmail.com', 
			  to: req.body.VEmail,
			  subject: 'Thank you for visiting!',
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
	})
})


app.listen(3000,function(){
	console.log("Server is online!");
});