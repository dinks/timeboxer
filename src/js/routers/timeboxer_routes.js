var riot = require('riot/riot');
var BaseRouter = require('flux-riot').BaseRouter;
var timeboxer_presenter = require('../presenters/timeboxer_presenter.js');

BaseRouter.routes(timeboxer_presenter.index,
  'templates/add', timeboxer_presenter.template_add,
  'templates/edit/:id', timeboxer_presenter.template_edit,
  'meeting/start/:id', timeboxer_presenter.meeting_start);

module.exports = {
  start: BaseRouter.start
};
