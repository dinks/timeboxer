var assign = require('object-assign');
var Dispatcher = require('flux-riot').Dispatcher;
var ActionTypes = require('../constants/app_constants.coffee').ActionTypes;
var flux_riot = require('flux-riot');

var _templates = [{
  "name": "Hackday 2014 Time Boxer Presentation",
  "agenda": [
    {
      "name": "Short Brief",
      "time": "2"
    }, {
      "name": "Presentation of Details",
      "time": "5"
    }, {
      "name": "Summary",
      "time": "2"
    }, {
      "name": "Feedback",
      "time": "0.5"
    }
  ]
}, {
  "name": "Hackday 2014 Time Boxer Presentation 2",
  "agenda": [
    {
      "name": "Short Brief",
      "time": "2"
    }, {
      "name": "Presentation of Details",
      "time": "5"
    }, {
      "name": "Summary",
      "time": "2"
    }, {
      "name": "Feedback",
      "time": "0.5"
    }
  ]
}];

var getTemplates = function () {
  return _templates;
};

TimeboxerTemplateStore = assign(new flux_riot.BaseStore(), {
  getAll: function () {
    return getTemplates();
  }
});

module.exports = TimeboxerTemplateStore;
