var riot = require('riot/riot');
var timeboxer_template_store = require('../stores/timeboxer_template_store.js');

require('../components/index.tag');
require('../components/timeboxer_template/add.tag');
require('../components/timeboxer_template/edit.tag');
require('../components/timeboxer_meeting/start.tag');


require('../components/contact.tag');
require('../components/about.tag');

var app_tag = null;

var unmount = function() {
  if (app_tag) {
    return app_tag.unmount();
  }
};

var mount = function(tag, opts) {
  var app_container;
  app_container = document.createElement("div");
  app_container.id = 'app-container';
  document.getElementById('container').appendChild(app_container);
  return riot.mount('#app-container', tag, opts)[0];
};

module.exports = {
  index: function() {
    unmount();
    return app_tag = mount('timeboxer-index', {
      title: "Templates",
      store: timeboxer_template_store
    });
  },

  template_add: function() {
    unmount();

    return app_tag = mount('timeboxer-template-add', {
      title: "Add Timeboxer Event Template",
      store: timeboxer_template_store
    });
  },

  template_edit: function(id) {
    unmount();
    return app_tag = mount('timeboxer-template-edit', {
      title: "Edit Timeboxer Event Template",
      templateId: id,
      store: timeboxer_template_store
    });
  },

  meeting_start: function(id) {
    unmount();
    return app_tag = mount('timeboxer-meeting-start', {
      title: "Start a Meeting",
      templateId: id,
      template_store: timeboxer_template_store
    });
  },

  about: function() {
    unmount();
    return app_tag = mount('timeboxer-about', {
      title: "About Us"
    });
  },

  contact: function() {
    unmount();
    return app_tag = mount('timeboxer-contact', {
      title: "Contact Us"
    });
  }
};
