"use strict"

var express = require('express');
var fs = require('fs');
var rp = require('request-promise');

var app = express();
var port = 3434;

// Use Handlebars for templating
var exphbs = require('express3-handlebars');
var hbs;

// Config for Production and Development
//app.engine('handlebars', exphbs({
   // Default Layout and locate layouts and partials
//   defaultLayout: 'main',
//   layoutsDir: 'views/layouts/',
//   partialsDir: 'views/partials/'
//}));

// Locate the views
//app.set('views', __dirname + '/views');

// Locate the assets
//app.use(express.static(__dirname + '/assets'));

// Set Handlebars
//app.set('view engine', 'handlebars');

/*
 * Routes

//Allow CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Index Page
app.get('/', function(request, response, next) {
    response.render('index');
});

//Request Handler/Webserver functions
app.use('/listLogFiles', requestHandlers.listLogFiles);
app.use('/queryTracking', requestHandlers.queryTracking);
*/

/* Start up the Express web server */
app.listen(process.env.PORT || port);
console.log('Express started on port ' + port);
