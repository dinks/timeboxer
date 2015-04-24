var Parse = require('parse').Parse;
var TimeBoxer = require('../actions/timeboxer.js');
var storage = require('./localStorage.js');

function ServerApiUtils() {
  this.init = function() {
    // Parse.initialize("PEdVTpEnHxhjwXHMjkStSlAMU75xq7TKxMut60BD",
    //   "vhbx9wTQMwM0821NgzMs0xq2SxHMzBbYdZMZWg1x");
    // this.boxerObj = Parse.Object.extend("Hackday2");
    // this.query = new Parse.Query(this.boxerObj);
  };
  this.getAll = function () {
    // this.query.find({
    //   success: function(results) {
    //
    //   },
    //   error: function(error) {
    //     alert("Error: " + error.code + " " + error.message);
    //   }
    // });
    TimeBoxer.serverDataReceived(storage.retrieve());
  };
  this.saveAll = function (data) {
    storage.save(data);
  };
  this.init();
};

module.exports = new ServerApiUtils();
