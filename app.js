const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));

app.get("/",function(req,res){
	res.redirect("/new");
});

app.get("/new",function(req,res){
	res.render("new");
})

app.listen(3000,function(){
	console.log("Server is online!");
});