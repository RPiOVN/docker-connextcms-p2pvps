"use strict";

const express = require("express");
const fs = require("fs");
const rp = require("request-promise");
const util = require("./util.js");

const app = express();
const port = 3434;

// Use Handlebars for templating
const exphbs = require("express3-handlebars");
let hbs;

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
console.log(`Express started on port ${port}`);

function checkNotifications() {
  debugger;

  // Higher scoped variables.
  const apiCredentials = util.getOBAuth();
  let devicePublicData, devicePrivateData;
  let thisNotice; // Will not stay here. Just for testing.

  const config = {
    apiCredentials: apiCredentials,
  };

  // Get new notifications.
  util
    .getOBNotifications(config)

    // Process any unread notifications
    .then(notes => {
      // For now, assuming I have one order at a time.
      thisNotice = notes[0];

      // Exit if no notices were found.
      if (thisNotice === undefined) return null;

      // Exit if the notice is not for an order.
      if (thisNotice.notification.type !== "order") return null;

      debugger;

      // Get device ID from listing
      const tmp = thisNotice.notification.slug.split("-");
      const deviceId = tmp[tmp.length - 1];

      return deviceId;
    })

    // Get devicePublicModel from the server.
    .then(deviceId => {
      if (deviceId == null) return null;
      debugger;

      return util
        .getDevicePublicModel(deviceId)

        .then(publicData => {
          devicePublicData = publicData; // Save the device data to a higher scoped variable.
          return publicData.privateData; // Return the ID for the devicePrivateModel
        })
        .catch(err => {
          throw err;
        });
    })

    // Get the devicePrivateData from the server.
    .then(privateDataId => {
      if (privateDataId == null) return null;
      debugger;

      return util
        .getDevicePrivateModel(privateDataId)

        .then(privateData => {
          devicePrivateData = privateData; // Save the device data to a higher scoped variable.
          return privateData;
        });
    })

    // Fulfill order with login information.
    .then(privateData => {
      if (privateData == null) return null;

      debugger;

      const config = {
        devicePrivateData: privateData,
        obNotice: thisNotice,
        apiCredentials: apiCredentials,
      };

      return util.fulfillOBOrder(config);
    })

    // Mark unread notifications as read.
    // POST /ob/marknotificationsasread
    .then(() => {
      debugger;
      const config = {
        apiCredentials: apiCredentials,
        obNotice: thisNotice,
      };

      return util.markNotificationAsRead(config);
    })

    // Update the expiration date.
    .then(() => {
      if (devicePublicData === undefined) return null;

      debugger;
      return util.updateExpiration(devicePublicData._id);
    })

    // Add deviceId to the rentedList model.
    .then(() => {
      if (devicePublicData === undefined) return null;

      debugger;
      util.addRentedDevice(devicePublicData._id);
    })

    .catch(function(err) {
      debugger;
      console.error("Error communicating with local OpenBazaar Server!", err);
    });
}
// Call checkNotifications() every 2 minutees.
const notificationTimer = setInterval(function() {
  checkNotifications();
}, 120000);
checkNotifications();

// Check all listings in the OB market to ensure their connection is active.

// Check all rented devices to ensure their connection is active.