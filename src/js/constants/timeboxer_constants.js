var keymirror = require('keymirror');

module.exports = {
  ActionTypes: keymirror({
    TEMPLATE_SAVE: null,
    TEMPLATE_REMOVE: null,

    SERVER_FETCH_COMPLETE: null
  })
};
