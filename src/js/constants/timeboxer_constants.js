var keymirror = require('keymirror');

module.exports = {
  ActionTypes: keymirror({
    TEMPLATE_SAVE: null,
    TEMPLATE_REMOVE: null,
    TEMPLATE_UPDATE: null,

    SERVER_FETCH_COMPLETE: null
  })
};
