"use strict";

const rp = require('request-promise');

// Generate an auth key for the header.Required fall all OpenBazaar API calls.
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

// This function updates the expiration date of a devices devicePublicData model.
function updateExpiration(deviceId) {
  return new Promise(function(resolve, reject) {
    debugger;

    // Get the devicePublicData model.
    var options = {
      method: 'GET',
      uri: 'http://p2pvps.net/api/devicePublicData/'+deviceId,
      json: true,
    };
    return rp(options)

    // Update the model with a new expiration date.
    .then(function (data) {
      debugger;

      const now = new Date();
      const thirtyDays = 60000*60*24*30;
      const expirationDate = new Date(now.getTime()+thirtyDays);
      data.collection.expiration = expirationDate.toISOString();

      // Update the model.
      var options = {
        method: 'POST',
        uri: 'http://p2pvps.net/api/devicePublicData/'+deviceId+'/update',
        body: data.collection,
        json: true,
      };
      return rp(options)

      // Return success or failure.
      .then(updatedData => {
        debugger;

        // Verify that the returned value contains the new date.

        return resolve(true);
      })

      .catch(err => {
        throw err;
      });
    })

    .catch(err => {
      console.error('Error in updateExpiration: ', err);
      return reject(err);
    });

  });
}

module.exports = {
  getOBAuth,
  updateExpiration,
};
