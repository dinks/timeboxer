assign = require 'object-assign'
Dispatcher = require('flux-riot').Dispatcher
ActionTypes = require('../constants/app_constants.coffee').ActionTypes
flux_riot = require 'flux-riot'

_templates = [{
  "name": "Hackday 2014 Time Boxer Presentation",
  "agenda": [{
      "name": "Short Brief",
      "time": "2"
    },{
      "name": "Presentation of Details",
      "time": "5"
    },{
      "name": "Summary",
      "time": "2"
    },{
      "name": "Feedback",
      "time": "0.5"
    }
  ]
}];

getTemplates = function () {
  return _templates;
};

TimeboxerTemplateStore = assign(new flux_riot.BaseStore(), {
  getAll: function () {
    return getTemplates();
  }
});

module.exports = TimeboxerTemplateStore;
