function Timer(opts) {
  var time = opts.time;
  var endCb = opts.endCb || function () {};
  var pulseCb = opts.pulseCb || function () {};
  var timeOutId = null;

  function updateTime() {

    if (time > 0) {
      time = time - 1;
      pulseCb(time);
      timeOutId = setTimeout(function () {
        updateTime();
      }, 1000);
    } else {
      endCb();
    }
  }

  this.setTime = function (newTime) {
    time = parseInt(newTime, 10);
    pulseCb(time);
  };

  this.getTime = function () {
    return time;
  };

  this.stop = function () {
    clearTimeout(timeOutId);
  };

  this.start = function () {
    updateTime();
  };

  this.reset = function () {
    time = opts.time;
    clearTimeout(timeOutId);
  };
}

module.exports = Timer;
