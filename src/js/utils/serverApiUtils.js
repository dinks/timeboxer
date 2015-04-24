var Parse = require('parse').Parse;
var TimeBoxer = require('../actions/timeboxer.js');

function ServerApiUtils() {
  this.init = function() {
    Parse.initialize("PEdVTpEnHxhjwXHMjkStSlAMU75xq7TKxMut60BD",
      "vhbx9wTQMwM0821NgzMs0xq2SxHMzBbYdZMZWg1x");
    var BoxerObj = Parse.Object.extend("Hackday1");
    this.query = new Parse.Query(BoxerObj);
  };
  this.getAll = function () {
    this.query.find({
      success: function(results) {
        TimeBoxer.serverDataReceived(results);
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  };
  this.init();
};

module.exports = new ServerApiUtils();
