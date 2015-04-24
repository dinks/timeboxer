assign = require('object-assign');

Dispatcher = require('flux-riot').Dispatcher;

ActionTypes = require('../constants/app_constants.coffee').ActionTypes;

flux_riot = require('flux-riot');

gid = 1;

_tasks = [
  {
    id: gid++,
    title: 'Custom tags',
    done: true
  }, {
    id: gid++,
    title: 'Minimal syntax',
    done: true
  }, {
    id: gid++,
    title: 'Virtual DOM',
    done: true
  }, {
    id: gid++,
    title: 'Full stack'
  }, {
    id: gid++,
    title: 'IE8'
  }
];

addTask = function(title, done) {
  if (done == null) {
    done = false;
  }
  return _tasks.push({
    id: gid++,
    title: title,
    done: done
  });
};

getTasks = function() {
  return _tasks;
};

TodoStore = assign(new flux_riot.BaseStore(), {
  getAll: function() {
    return getTasks();
  },
  getTask: function(id) {
    var task, _i, _len, _ref;
    _ref = TodoStore.getAll();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      task = _ref[_i];
      if (task.id === parseInt(id)) {
        return task;
      }
    }
  },
  dispatchToken: Dispatcher.register(function(payload) {
    var action, data, index, task;
    action = payload.action;
    switch (action.type) {
      case ActionTypes.TASK_SAVE:
        data = action.data;
        if (data.id) {
          task = TodoStore.getTask(data.id);
          task.title = data.title;
          return TodoStore.emitChange();
        } else if (data.title) {
          addTask(data.title);
          return TodoStore.emitChange();
        }
        break;
      case ActionTypes.TASK_TOGGLE:
        task = action.data;
        return task.done = !task.done;
      case ActionTypes.TASK_REMOVE:
        task = action.data;
        index = TodoStore.getAll().indexOf(task);
        TodoStore.getAll().splice(index, 1);
        return TodoStore.emitChange();
    }
  })
});

module.exports = TodoStore;