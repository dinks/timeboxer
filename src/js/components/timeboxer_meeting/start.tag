var timeboxer = require('../../actions/timeboxer.js');
var flux_riot = require('flux-riot');
var Timer = require('../../utils/timer');
require('./timer.tag');


<timeboxer-meeting-start>
  <hr>
  <div class="row">
    <div class="col-md-9">
      <h4 class="agenda-name">{ this.currentAgenda.name }</h4>
      <count-down-timer minutes={this.currentTime.minutes}
                        seconds={this.currentTime.seconds}>
      </count-down-timer>

      <div class="row">
        <div class="col-md-6">
          <a href="#" onclick={ startOrPause } class="btn btn-block btn-success">
            <span class="glyphicon glyphicon-play-circle" aria-hidden="true"></span>
            <span id="agendaContinue">Start</span>
          </a>
        </div>
        <div class="col-md-6">
          <a href="#" onclick={ nextAgenda } class="btn btn-block btn-info" id="nextAgendaBtn">
            <span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>
            Next
          </a>
        </div>
      </div>

      <div class="row">
        <div class="col-md-3">
          <a href="#" onclick={ previousAgenda } class="btn btn-xs btn-default">
            <span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>
            Previous
          </a>
          <a href="#" onclick={ reduceTime } class="btn btn-xs btn-default">-1</a>
          <a href="#" onclick={ increaseTime } class="btn btn-xs btn-default">+1</a>
        </div>
      </div>
    </div>
    <div class="col-md-3">
     <h4 class="counter-template-name"> { this.template.name } </h4>
      <ul class="list-group">
        <li class="list-group-item" each={ item, index in this.template.agenda } if={ !item.finished } >
          <b>{ item.name }</b> <span class="badge">{ item.time }</span>
        </li>
      </ul>
    </div>
  </div>

  <div class="modal fade" id="allDone">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">Notice</h4>
        </div>
        <div class="modal-body">
          <p>Great Job finishing the meeting!!</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

  this.currentAgendaIndex = 0;
  this.currentAgendaTime = 1;

  setCurrentAgenda() {
    if(this.template) {
      this.currentAgenda = this.template.agenda[this.currentAgendaIndex];
      if (this.currentAgenda) {
        this.currentAgendaTime = parseFloat(this.currentAgenda.time) * 60;
        this.timerClock.setTime(this.currentAgendaTime);
      } else {
        $(this.allDone).modal();
      }
    }
  }

  getTemplateFromStore() {
    return opts.template_store.getAll()[opts.templateId];
  }

  nextAgenda() {
    this.resetStatus();
    this.template.agenda[this.currentAgendaIndex]['finished'] = true;
    this.currentAgendaIndex++;
    this.setCurrentAgenda();
    this.update();
  }

  previousAgenda() {
    this.resetStatus();
    this.currentAgendaIndex--;
    this.template.agenda[this.currentAgendaIndex]['finished'] = false;
    this.setCurrentAgenda();
  }

  reduceTime () {
    var remainingTime = this.timerClock.getTime();
    if (remainingTime - 60 > 0) {
      this.timerClock.setTime(remainingTime - 59);
    }
  }

  increaseTime () {
    var remainingTime = this.timerClock.getTime();
    this.currentAgendaTime = remainingTime + 60;
    this.timerClock.setTime(this.currentAgendaTime);
  }

  updateCurrentTime (time) {
    this.currentTime = {
      minutes: Math.floor(time/60),
      seconds: time % 60
    };
  }

  initClock() {
    this.timerClock = new Timer({
      pulseCb: function (time) {
        this.updateCurrentTime(time);
        this.update();
      }.bind(this),
      endCb: function () {
        // $(this.nextAgendaBtn).click();
      }.bind(this),
      time: this.currentAgendaTime
    });
  }

  updateFromStore() {
    this.getTemplateFromStore();
    this.setCurrentAgenda();
    this.update();
  }

  startOrPause() {
    switch(this.currentAgendaStatus) {
      case 'paused':
        this.timerClock.start();
        this.currentAgendaStatus = 'started';
        $(this.agendaContinue).html('Pause');
        break;
      case 'started':
        this.timerClock.stop();
        this.currentAgendaStatus = 'paused';
        $(this.agendaContinue).html('Start');
        break;
    }
  }

  resetStatus() {
    this.timerClock.stop();
    this.currentAgendaStatus = 'paused';
    $(this.agendaContinue).html('Start');

    $(this.progressbar).find('.progress-bar').
    css({
      width: '100%'
    }).
    removeClass('progress-bar-warning').
    removeClass('progress-bar-danger');
  }

  flux_riot.storeMixin(this, opts.template_store, this.updateFromStore);
  this.on('mount', function() {
    this.template = this.getTemplateFromStore();
    this.initClock();
    this.resetStatus();
    this.setCurrentAgenda();
    this.updateCurrentTime(this.currentAgendaTime);
    this.update();
  });

  this.on('unmount', function() {
    this.timerClock.stop();
  });

</timeboxer-meeting-start>
