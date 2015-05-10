var Parse = require('parse').Parse;
var TimeBoxer = require('../actions/timeboxer.js');
var storage = require('./localStorage.js');

function ServerApiUtils() {
  this.init = function() {
    Parse.initialize("PEdVTpEnHxhjwXHMjkStSlAMU75xq7TKxMut60BD",
      "vhbx9wTQMwM0821NgzMs0xq2SxHMzBbYdZMZWg1x");
    this.boxerClass = Parse.Object.extend("Hackday2");
    this.query = new Parse.Query(this.boxerClass);
    this.boxerObj = new this.boxerClass();
  };
  this.getAll = function () {
    this.boxerObj.fetch({
      success: function(results) {
        console.log(results);
        TimeBoxer.serverDataReceived(results.toJSON().results);
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  };
  this.saveTemplate = function (data) {
    this.boxerObj.save(data);
  };
  this.updateTemplate = function (data) {
    this.query.get(data.objectId, {
      success: function (result) {
        result.set('agenda', data.agenda);
        result.save();
        console.log(result);
      }
    });
  };
  this.destroyTemplate = function (data) {
    this.query.get(data.objectId, {
      success: function (result) {
        result.destroy({
          success: function () {
            console.log('destroyed');
          }
        });
      }
    })
  };
  this.init();
};

module.exports = new ServerApiUtils();
