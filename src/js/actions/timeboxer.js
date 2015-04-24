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
    console.log(task);
    return dispatch(ActionTypes.TEMPLATE_SAVE, task);
  },
  removeTemplate: function(index) {
    return dispatch(ActionTypes.TEMPLATE_REMOVE, index);
  },
  serverDataReceived: function (data) {
    console.log('serverDataReceived', data);
    return dispatch(ActionTypes.SERVER_FETCH_COMPLETE, data);
  }
};
