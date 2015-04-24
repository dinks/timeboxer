var assign = require('object-assign');
var Dispatcher = require('flux-riot').Dispatcher;
var ActionTypes = require('../constants/timeboxer_constants.js').ActionTypes;
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
var saveTemplates = function (obj) {
  _templates = JSON.parse(obj[0].attributes.hack_sample);
}

TimeboxerTemplateStore = assign(new flux_riot.BaseStore(), {
  getAll: function () {
    console.log(getTemplates());
    return getTemplates();
  },
  dispatchToken: Dispatcher.register(function(payload) {
    var action, data, index, task;
    action = payload.action;
    switch (action.type) {
      case ActionTypes.SERVER_FETCH_COMPLETE:
        saveTemplates(action.data);
        TimeboxerTemplateStore.emitChange();
      break;
    }
  })
});

module.exports = TimeboxerTemplateStore;
