var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seed");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var flash = require("connect-flash");
mongoose.set('useFindAndModify', false);

//requiring routes
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

mongoose.connect('mongodb+srv://nathan:PRCvQGWEx7ftU8r@cluster0-tnuje.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("Connected to DB");
}).catch(err =>{
	console.log("Error:", err.message);
});

// mongoose.connect("mongodb://localhost:27017/yelp_camp",{
// 	useNewUrlParser: true,
// 	useCreateIndex: true
// });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();  //seed the database

//Passport Config
app.use(require("express-session")({
	secret: "Doris is the best.",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);

// app.listen(3000, function(){
// 	console.log("Yelpcamp has started");
// });

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("The Server Has Started!");
});

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://nathan:Ken3367572@cluster0-tnuje.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });