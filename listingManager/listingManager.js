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


function checkNotifications() {
  debugger;

  // Higher scoped variables.
  var apiCredentials = getOBAuth();
  var devicePublicData, devicePrivateData;
  var thisNotice; // Will not stay here. Just for testing.

  var options = {
    method: 'GET',
    uri: 'http://p2pvps.net:4002/ob/notifications',
    //body: listingData,
    //json: true, // Automatically stringifies the body to JSON
    headers: {
      'Authorization': apiCredentials
    },
    //resolveWithFullResponse: true
  };

  return rp(options)
  .then(function (data) {

    var allNotifications = JSON.parse(data);
    var newNotifications = [];

    // Exit if no new notifications.
    if(allNotifications.unread == 0) return newNotifications;

    debugger;

    // Read through all notifications and save any that are unread.
    for(var i=0; i < allNotifications.notifications.length; i++) {
      if(!allNotifications.notifications[i].read) {
        newNotifications.push(allNotifications.notifications[i]);
      }
    }

    return newNotifications;
  })

  // Process any unread notifications
  .then(notes => {
    debugger;
    //console.log(JSON.stringify(notes, null, 2));

    // For now, just assuming I have one order at a time.
    thisNotice = notes[0];

    // Exit if the notice is not for an order.
    if(thisNotice.notification.type != "order") return null;

    // Get device ID from listing
    var tmp = thisNotice.notification.slug.split('-');
    var deviceId = tmp[tmp.length-1];

    return deviceId;
  })

  // Get devicePublicModel from server.
  .then(deviceId => {
    debugger;

    if(deviceId == null) return null;

    var options = {
      method: 'GET',
      uri: 'http://p2pvps.net/api/devicePublicData/'+deviceId,
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

      devicePublicData = data.collection;
      return devicePublicData.privateData;
    })
  })

  // Get the devicePrivateData from the server.
  .then(privateDataId => {
    debugger;

    if(privateDataId == null) return null;

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
    debugger;

    if(val == null) return null;

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

  .catch(function (err) {
    debugger;
    console.error('Error communicating with local OpenBazaar Server!', err);
  });
}
// Call checkNotifications() every 2 minutees.
var notificationTimer = setInterval(function() {checkNotifications();}, 120000);
checkNotifications();


/**** BEGIN PROMISE AND UTILITY FUNCTIONS ****/

function getOBAuth() {
  //debugger;

  var clientID = "yourUsername";
  var clientSecret = "yourPassword";

  //Encoding as per Centro API Specification.
  var combinedCredential = clientID+':'+clientSecret;
  //var base64Credential = window.btoa(combinedCredential);
  var base64Credential = Buffer.from(combinedCredential).toString('base64');
  var readyCredential = 'Basic '+base64Credential;


  return readyCredential;

}

/**** END PROMISE AND UTILITY FUNCTIONS ****/
