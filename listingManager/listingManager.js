"use strict"

var express = require('express');
var fs = require('fs');
var rp = require('request-promise');
const util = require('./util.js');

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


function checkNotifications() {
  debugger;

  // Higher scoped variables.
  var apiCredentials = util.getOBAuth();
  var devicePublicData, devicePrivateData;
  var thisNotice; // Will not stay here. Just for testing.

  var config = {
    apiCredentials: apiCredentials
  };

  // Get new notifications.
  util.getOBNotifications(config)

  // Process any unread notifications
  .then(notes => {

    // For now, assuming I have one order at a time.
    thisNotice = notes[0];

    // Exit if no notices were found.
    if(thisNotice == undefined) return null;

    // Exit if the notice is not for an order.
    if(thisNotice.notification.type != "order") return null;

    debugger;

    // Get device ID from listing
    var tmp = thisNotice.notification.slug.split('-');
    var deviceId = tmp[tmp.length-1];

    return deviceId;
  })

  // Get devicePublicModel from the server.
  .then(deviceId => {

    if(deviceId == null) return null;

    debugger;

    return util.getDevicePublicModel(deviceId);

    // Save the device data to a higher scoped variable.
    .then(publicData => {
      devicePublicData = publicData;
      return publicData.privateData; // Return the ID for the devicePrivateModel
    })
  })

  // Get the devicePrivateData from the server.
  .then(privateDataId => {

    if(privateDataId == null) return null;

    debugger;

    var options = {
      method: 'GET',
      uri: 'http://p2pvps.net/api/devicePrivateData/'+privateDataId,
      //body: listingData,
      //json: true, // Automatically stringifies the body to JSON
      //headers: {
      //  'Authorization': apiCredentials
      //},
      //resolveWithFullResponse: true
    };

    return rp(options)
    .then(function (data) {
      debugger;

      data = JSON.parse(data);

      devicePrivateData = data.collection;
      return devicePrivateData;
    })
  })

  // Fulfill order with login information.
  .then(val => {
    if(val == null) return null;

    debugger;

    var notes =
`Host: p2pvps.net
Port: ${devicePrivateData.serverSSHPort}
Login: ${devicePrivateData.deviceUserName}
Password: ${devicePrivateData.devicePassword}
`

    var bodyData = {
      orderId: thisNotice.notification.orderId,
      note: notes
    }

    var options = {
      method: 'POST',
      uri: 'http://p2pvps.net:4002/ob/orderfulfillment',
      body: bodyData,
      json: true, // Automatically stringifies the body to JSON
      headers: {
        'Authorization': apiCredentials
      },
      //resolveWithFullResponse: true
    };

    return rp(options)
    .then(function (data) {
      debugger;
      console.log(`OrderId ${thisNotice.notification.orderId} has been marked as fulfilled.`);
    });
  })

  // Mark unread notifications as read.
  // POST /ob/marknotificationsasread

  // Update the expiration date.
  .then(() => {

    if(devicePublicData === undefined) return null;

    debugger;
    return util.updateExpiration(devicePublicData._id);
  })


  // Add deviceId to the rentedList model.

  .catch(function (err) {
    debugger;
    console.error('Error communicating with local OpenBazaar Server!', err);
  });
}
// Call checkNotifications() every 2 minutees.
var notificationTimer = setInterval(function() {checkNotifications();}, 120000);
checkNotifications();


// Check all listings in the OB market to ensure their connection is active.

// Check all rented devices to ensure their connection is active.
