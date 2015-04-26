var assign = require('object-assign');
var Dispatcher = require('flux-riot').Dispatcher;
var ActionTypes = require('../constants/timeboxer_constants.js').ActionTypes;
var flux_riot = require('flux-riot');
var serverUtil = require('../utils/serverApiUtils.js');

var _templates = [];

var getTemplates = function () {
  return _templates;
};
var addTemplates = function (data) {
  _templates.push(data);
};
var saveTemplates = function (obj) {
  _templates = obj;
};
var removeTemplate = function (index) {
  _templates.splice(index, 1);
};

TimeboxerTemplateStore = assign(new flux_riot.BaseStore(), {
  getAll: function () {
    return getTemplates();
  },
  saveAll: function () {

  },
  getByIndex: function (index) {
    return _templates[index];
  },
  dispatchToken: Dispatcher.register(function(payload) {
    var action, data, index, task;
    action = payload.action;
    switch (action.type) {
      case ActionTypes.SERVER_FETCH_COMPLETE:
        saveTemplates(action.data);
        TimeboxerTemplateStore.emitChange();
      break;
      case ActionTypes.TEMPLATE_SAVE:
        addTemplates(action.data);
        serverUtil.saveTemplate(action.data);
        TimeboxerTemplateStore.emitChange();
      break;
      case ActionTypes.TEMPLATE_REMOVE:
        serverUtil.destroyTemplate(_templates[action.data]);
        removeTemplate(action.data);
        TimeboxerTemplateStore.emitChange();
      break;
    }
  })
});

module.exports = TimeboxerTemplateStore;
