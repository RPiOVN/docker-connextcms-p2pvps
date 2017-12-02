/*
  This file contains a collection of 'utility' functions used by the listingManager.
  By modularizing the code into a series of subfunctions in this file, it makes
  each subfunciton easier to test. It also makes the code in listingManager easier
  to read, since you only have to follow the high-level calls.
*/

"use strict";

const rp = require("request-promise");

// Generate an auth key for the header.Required fall all OpenBazaar API calls.
function getOBAuth() {
  //debugger;

  const clientID = "yourUsername";
  const clientSecret = "yourPassword";

  //Encoding as per Centro API Specification.
  const combinedCredential = `${clientID}:${clientSecret}`;
  //var base64Credential = window.btoa(combinedCredential);
  const base64Credential = Buffer.from(combinedCredential).toString("base64");
  const readyCredential = `Basic ${base64Credential}`;

  return readyCredential;
}

// This function updates the expiration date of a devices devicePublicData model.
function updateExpiration(deviceId) {
  return new Promise(function(resolve, reject) {
    debugger;

    // Get the devicePublicData model.
    const options = {
      method: "GET",
      uri: `http://p2pvps.net/api/devicePublicData/${deviceId}`,
      json: true,
    };
    return (rp(options)
        // Update the model with a new expiration date.
        .then(function(data) {
          debugger;

          const now = new Date();
          const thirtyDays = 60000 * 60 * 24 * 30;
          const expirationDate = new Date(now.getTime() + thirtyDays);
          data.collection.expiration = expirationDate.toISOString();

          // Update the model.
          const options = {
            method: "POST",
            uri: `http://p2pvps.net/api/devicePublicData/${deviceId}/update`,
            body: data.collection,
            json: true,
          };
          return (rp(options)
              // Return success or failure.
              .then(updatedData => {
                debugger;

                // Verify that the returned value contains the new date.
                if (updatedData.collection.expiration) return resolve(true);
                return resolve(false);
              })

              .catch(err => {
                throw err;
              }) );
        })

        .catch(err => {
          console.error("Error in updateExpiration: ", err);
          return reject(err);
        }) );
  });
}

// This function gets all the notifications from the OB server.
// It returns a Promise that resolves to an array of new notifications.
function getOBNotifications(config) {
  const options = {
    method: "GET",
    uri: "http://p2pvps.net:4002/ob/notifications",
    //body: listingData,
    json: true, // Automatically stringifies the body to JSON
    headers: {
      Authorization: config.apiCredentials,
    },
    //resolveWithFullResponse: true
  };

  return rp(options).then(function(data) {
    const allNotifications = data;
    const newNotifications = [];

    // Exit if no new notifications.
    if (allNotifications.unread === 0) return newNotifications;

    debugger;

    // Read through all notifications and return any that are marked unread.
    for (let i = 0; i < allNotifications.notifications.length; i++) {
      if (!allNotifications.notifications[i].read)
        newNotifications.push(allNotifications.notifications[i]);
    }

    return newNotifications;
  });
}

// This function returns a devicePublicModel given the deviceId.
function getDevicePublicModel(deviceId) {
  const options = {
    method: "GET",
    uri: `http://p2pvps.net/api/devicePublicData/${deviceId}`,
    json: true, // Automatically stringifies the body to JSON
  };

  return rp(options).then(function(data) {
    //debugger;

    if (data.collection === undefined) throw `No devicePublicModel with ID of ${deviceId}`;

    return data.collection;
  });
}

// This function returns a devicePrivateModel given ID for the model.
function getDevicePrivateModel(privateId) {
  const options = {
    method: "GET",
    uri: `http://p2pvps.net/api/devicePrivateData/${privateId}`,
    json: true, // Automatically stringifies the body to JSON
  };

  return rp(options).then(function(data) {
    debugger;

    if (data.collection === undefined) throw `No devicePrivateModel with ID of ${privateId}`;

    return data.collection;
  });
}

module.exports = {
  getOBAuth,
  updateExpiration,
  getOBNotifications,
  getDevicePublicModel,
};
