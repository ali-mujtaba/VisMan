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
	pool.query(queryStr,function(error,results,fields){
		if(error){
			throw error;
		}else{
			console.log("Entry added!");
		}
	})
});

app.listen(3000,function(){
	console.log("Server is online!");
});