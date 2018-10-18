var express = require("express");

var app = express();

var fortune = require("./fortune");

var handlebars = require("express-handlebars")
	.create({defaultLayout: "main"});
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);

app.use(function(req, res, next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});

app.use(require("body-parser").urlencoded({extended: true }));

app.get("/", function(req, res){
	res.render("home", {
	courses: [
        {
                code:"CMPS 361",
                description: "Web Application Development",
                instructor: "Mark Voortman",
                credits:3
        },
     	{
                code:"CMPS 363",
                description: "Digital Security",
                instructor: "Brian Bolsinger",
                credits:3
        },
        {
                 code:"SOC 260",
                description: "Japanese Culture",
                instructor: "Robert Fessler",
                credits:3
        },
     	{
                 code:"BMGT 221",
                description: "WI-Business Comm & Research",
                instructor: "John Lawrence",
                credits:3
	},

     	{
                code:"BMGT 300",
                description: "Corporate Finance",
                instructor: "Joseph DeFazio",
                credits:3
        },

]
	
});
	
});



app.get("/datetime", function(req, res){
	res.render("datetime", {datetime: new Date().toString()});
});

app.get("/about", function(req, res){
	
	res.render("about", { fortunes: fortune.getFortune(),
	pageTestScript: "/qa/tests-about.js"
	});
});

app.get("/contact", function(req, res){
	res.render("contact", {csrf: "CSRF token goes here"});
});

app.post("/process", function(req, res){
        if(req.xhr || req.accepts("json,html")==="json"){
        console.log(JSON.stringify(req.body));
res.send({

        success: true
         });
}
else{

res.redirect(303,"/thank-you");
}

});


app.get("/header", function(req, res){
	res.set("Content-Type", "text/plain");
	var s = "";
	for(var name in req.headers) {s += name + ": " + req.headers[name] + "/n"};
	res.send(s);
});

app.use(express.static(__dirname + "/public"));

app.use(function(req, res, next){
	res.status(404);
	res.render("404");
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render("500");
});

app.listen(app.get("port"), function(){
	console.log( "Express started on http://localhost:" + app.get("port") + "; press Ctrl-C to terminate.");
});
