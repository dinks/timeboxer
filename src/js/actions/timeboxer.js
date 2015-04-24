var Dispatcher = require('flux-riot').Dispatcher;

var ActionTypes = require('../constants/timeboxer_constants.js').ActionTypes;

var dispatch = function(type, data) {
  return Dispatcher.handleViewAction({
    type: type,
    data: data
  });
};

module.exports = {
  saveTemplate: function(task) {
    return dispatch(ActionTypes.TEMPLATE_SAVE, task);
  },
  removeTemplate: function(task) {
    return dispatch(ActionTypes.TEMPLATE_REMOVE, task);
  }
};
