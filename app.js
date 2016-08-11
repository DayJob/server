var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var async = require('async');
var firebase = require('firebase');
var MongoStore = require('connect-mongo')(session);

var validator = require('./utils/validator');
var responder = require('./utils/responder');

var app = express();

// mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGO_DB);
// var db = mongoose.connection;
// db.once("open", function () {
//     console.log("DB connected");
// });
// db.on("error", function (err) {
//     console.log("DB ERROR :", err);
// });

//set middlewares
app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/public');
app.set("view engine", 'ejs');
app.use(express.static(path.join(__dirname + '/public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(flash());

app.use(session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {maxAge: 1000 * 60 * 60},
    store: new MongoStore({
        url: process.env.MONGO_DB
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(validator());
app.use(responder());

//init passport
var initPassport = require('./passport/init');
initPassport(passport);

//set routes
var routes = require('./routes/index')(passport);
app.use('/', routes);

var sequelize = require('./config/sequelize');

sequelize
    .sync({force: false})
    .then(function (err) {
        console.log('Connection has been established successfully.');
        // start server
        app.listen(app.get('port'), function () {
            console.log('Server On');
        });
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });

module.exports = app;
