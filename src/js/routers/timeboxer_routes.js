var riot = require('riot/riot');
var BaseRouter = require('flux-riot').BaseRouter;
var timeboxer_presenter = require('../presenters/timeboxer_presenter.js');

BaseRouter.routes(timeboxer_presenter.index,
  'templates/add', timeboxer_presenter.add,
  'templates/edit/:id', timeboxer_presenter.edit);

module.exports = {
  start: BaseRouter.start
};
